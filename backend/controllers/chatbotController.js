const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const Seller = require("../models/SellerModel");
const User = require("../models/UserModel");

const OpenAI = require("openai");
let openai;
try {
    if (process.env.OPENAI_API_KEY) {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
} catch (e) {
    console.warn("OpenAI init skipped:", e.message);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
let groq;
try {
    if (process.env.GROQ_API_KEY) {
        groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    } else {
        console.warn("GROQ_API_KEY is missing. Chatbot will fallback to other models.");
    }
} catch (error) {
    console.error("Failed to initialize Groq client:", error);
}

const INTENTS = {
    user: {
        product_search: ["product", "find", "search", "available", "buy", "shop", "item"],
        order_status: ["order", "delivery", "track", "status", "shipment"],
        cart_inquiry: ["cart", "add", "remove", "items", "checkout"],
        wishlist: ["wishlist", "favorites", "saved", "liked"],
        payment_help: ["payment", "refund", "cod", "transaction", "failed"],
        account_info: ["profile", "account", "address", "details", "login"]
    },
    guest: { // ✅ New intent group for guests
        product_search: ["product", "find", "search", "available", "buy", "shop", "item"],
        general_help: ["help", "contact", "support", "hi", "hello"]
    },
    seller: {
        product_management: ["add", "update", "delete", "product", "stock", "inventory"],
        order_management: ["orders", "sales", "delivered", "pending", "track"],
        analytics: ["analytics", "performance", "insight", "revenue"],
        platform_help: ["help", "how", "tutorial", "guide", "support"]
    },
    admin: {
        user_management: ["users", "manage", "block", "delete", "stats"],
        platform_overview: ["overview", "report", "analytics", "revenue"]
    }
};

// ✅ Classify intent
const classifyIntent = (query, role) => {
    const lower = query.toLowerCase();
    const intents = INTENTS[role] || INTENTS.user;
    for (const [intent, keywords] of Object.entries(intents)) {
        if (keywords.some(k => lower.includes(k))) return intent;
    }
    return "general";
};

// ✅ Build database context
const getDatabaseContext = async (intent, userId, role) => {
    const ctx = {};
    if (!userId && role !== 'guest') return ctx; // Safety check

    try {
        if (role === 'guest') {
            switch (intent) {
                case "product_search":
                    const products = await Product.find({ stock: { $gt: 0 } }).limit(5);
                    ctx.products = products.map(p => ({
                        name: p.name,
                        price: p.price,
                        category: p.category
                    }));
                    break;
            }
            return ctx;
        }

        switch (intent) {
            case "order_status":
                const orders = await Order.find({ userId }).populate("products.productId");
                ctx.orders = orders.map(o => ({
                    id: o._id,
                    status: o.status,
                    total: o.totalAmount,
                    date: o.createdAt,
                    products: o.products.map(p => p.productId?.name)
                }));
                break;

            case "cart_inquiry":
                const cart = await Cart.findOne({ user: userId }).populate("items.product");
                if (cart) {
                    ctx.cart = {
                        totalItems: cart.totalQuantity,
                        totalPrice: cart.totalPrice,
                        items: cart.items.map(i => ({
                            name: i.product?.name,
                            price: i.price,
                            quantity: i.quantity
                        }))
                    };
                } else ctx.cart = { message: "Your cart is empty." };
                break;

            case "wishlist":
                const user = await User.findById(userId).populate("wishlist");
                ctx.wishlist = user?.wishlist?.map(p => ({
                    name: p.name,
                    price: p.price,
                    category: p.category
                })) || [];
                break;

            case "product_search":
                const products = await Product.find({ stock: { $gt: 0 } }).limit(8);
                ctx.products = products.map(p => ({
                    name: p.name,
                    price: p.price,
                    brand: p.brand,
                    category: p.category
                }));
                break;

            case "account_info":
                const account = await User.findById(userId);
                if (account) {
                    ctx.userInfo = {
                        name: account.fullname,
                        email: account.email,
                        phone: account.phone,
                        verified: account.isVerified,
                        lastLogin: account.lastLogin
                    };
                }
                break;

            case "order_management":
                if (role === "seller") {
                    const sellerOrders = await Order.find({ "products.sellerId": userId });
                    ctx.orders = sellerOrders.map(o => ({
                        id: o._id,
                        total: o.totalAmount,
                        status: o.status
                    }));
                }
                break;

            case "user_management":
                if (role === "admin") {
                    const users = await User.find().limit(10);
                    ctx.users = users.map(u => ({
                        username: u.username,
                        email: u.email,
                        verified: u.isVerified,
                        role: u.role
                    }));
                }
                break;
        }
    } catch (err) {
        console.error("DB Context Error:", err);
        ctx.error = "Database error occurred";
    }
    return ctx;
};

const generateAIResponse = async (query, context, role) => {
    const systemPrompts = {
        user: `
You are ShopEase AI Assistant helping a **customer**.
You can help with:
🛒 Orders and tracking
💳 Payments and refunds
🎁 Product info and search
🧺 Cart and wishlist
👤 Account info
If user asks unrelated questions, respond:
"I can only help with ShopEase products, orders, and your account."
Context: ${JSON.stringify(context)}
`,
        guest: `
You are ShopEase AI Assistant helping a **visitor**.
You can help with:
🎁 Product discovery and search
ℹ️ General information about ShopEase
Encourage them to login for checking orders or cart.
Context: ${JSON.stringify(context)}
`,
        seller: `
You are ShopEase AI Assistant helping a **seller**.
Assist with:
📦 Managing products and stock
📈 Orders and analytics
If unrelated, reply:
"I can help only with ShopEase seller dashboard and inventory tasks."
Context: ${JSON.stringify(context)}
`,
        admin: `
You are ShopEase AI Assistant helping an **admin**.
Assist with:
👥 Managing users
📊 Viewing analytics and reports
Context: ${JSON.stringify(context)}
`,
    };

    const prompt = `
${systemPrompts[role] || systemPrompts.user}
User Query: "${query}"
Generate a short, natural, and relevant response.
`;

    try {
        // 🚀 1. Try Groq (gpt-oss-120b)
        if (groq) {
            try {
                const chatCompletion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: systemPrompts[role] || systemPrompts.user },
                        { role: "user", content: query }
                    ],
                    model: "openai/gpt-oss-120b",
                    max_tokens: 300,
                    temperature: 0.7,
                });
                const groqResponse = chatCompletion.choices[0]?.message?.content;
                if (groqResponse) return groqResponse.trim();
            } catch (err1) {
                console.warn("Groq gpt-oss-120b failed, trying qwen3.8-27b:", err1.message);
                const chatCompletion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: systemPrompts[role] || systemPrompts.user },
                        { role: "user", content: query }
                    ],
                    model: "qwen/qwen3.8-27b",
                    max_tokens: 300,
                    temperature: 0.7,
                });
                const groqResponse = chatCompletion.choices[0]?.message?.content;
                if (groqResponse) return groqResponse.trim();
            }
        }
    } catch (groqError) {
        console.error("⚠️ Groq Error:", groqError.message);
    }

    // 🪄 2. Intelligent Contextual Rule-Based Fallback
    const q = query.toLowerCase();
    if (q.includes("how does it work") || q.includes("how it works") || q.includes("work")) {
        return "Welcome to our store! 🛍️ Here's how it works:\n\n1. **Browse & Discover**: Explore curated Men's, Women's, and Electronics collections.\n2. **Select & Add to Bag**: Pick your preferred size and add to cart.\n3. **Quick Checkout**: Pay online via UPI/Cards or choose Cash on Delivery (COD).\n4. **Express Delivery**: Enjoy fast shipping directly to your doorstep with easy 7-day returns!";
    }
    if (q.includes("order") || q.includes("track") || q.includes("delivery")) {
        if (context.orders?.length) {
            return `You have ${context.orders.length} order(s). Your latest order status is **${context.orders[0].status}**. You can track full details on your [Orders page](/orders).`;
        }
        return "You can check and track all your active and previous orders by navigating to your [Orders page](/orders).";
    }
    if (q.includes("pay") || q.includes("payment") || q.includes("cod") || q.includes("upi")) {
        return "We support multiple payment methods:\n- **UPI**: Google Pay, PhonePe, Paytm\n- **Online Gateway**: Razorpay (Credit/Debit cards, Net Banking)\n- **Cash on Delivery (COD)** on eligible pincodes!";
    }
    if (q.includes("return") || q.includes("refund") || q.includes("exchange")) {
        return "We offer a **7-Day Hassle-Free Return & Exchange** guarantee. If you're not satisfied, you can initiate a doorstep return or exchange right from your order history.";
    }
    if (q.includes("cart") || q.includes("bag")) {
        return "You can view and manage your selected items anytime by opening your [Shopping Bag](/cart).";
    }
    if (q.includes("wishlist") || q.includes("favorite") || q.includes("saved")) {
        return "You can view all your saved items anytime on your [Wishlist page](/wishlist).";
    }

    return "Hello! I am your AI Shopping Assistant. You can ask me to help you find products, track active orders, explain return policies, or check sizing details. What would you like to explore today?";
};

// ✅ Main handler
exports.shopChatBotHandler = async (req, res) => {
    try {
        const { message } = req.body;
        // User might be undefined if guest, so default to guest role
        const user = req.user || { role: 'guest', _id: null };

        if (!message) return res.status(400).json({ error: "Message is required" });

        const intent = classifyIntent(message, user.role);
        console.log("intent================>", intent);
        const context = await getDatabaseContext(intent, user._id, user.role);
        console.log("context================>", context);
        const aiResponse = await generateAIResponse(message, context, user.role);
        console.log("ai res ================>", aiResponse);

        res.json({ response: aiResponse, intent, role: user.role });
    } catch (err) {
        console.error("Chatbot Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ Health check
exports.healthCheck = (req, res) => {
    res.json({ status: "OK", message: "ShopEase Chatbot is online 🚀" });
};