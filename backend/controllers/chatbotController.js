const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const Seller = require("../models/SellerModel");
const User = require("../models/UserModel");

const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const INTENTS = {
    user: {
        product_search: ["product", "find", "search", "available", "buy", "shop", "item"],
        order_status: ["order", "delivery", "track", "status", "shipment"],
        cart_inquiry: ["cart", "add", "remove", "items", "checkout"],
        wishlist: ["wishlist", "favorites", "saved", "liked"],
        payment_help: ["payment", "refund", "cod", "transaction", "failed"],
        account_info: ["profile", "account", "address", "details", "login"]
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
    try {
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
    // 🧠 Try Gemini first
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const geminiResponse = result?.response?.text?.();
    if (geminiResponse) {
      return geminiResponse.trim();
    }

    throw new Error("Empty Gemini response");
  } catch (geminiError) {
    console.error("⚠️ Gemini Error:", geminiError.message);

    // 🪄 Fallback to ChatGPT
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Or "gpt-4o" for more power
        messages: [
          {
            role: "system",
            content:
              systemPrompts[role] ||
              systemPrompts.user,
          },
          {
            role: "user",
            content: query,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      const chatgptResponse = completion.choices[0].message.content;
      return chatgptResponse.trim();
    } catch (chatGPTError) {
      console.error("❌ ChatGPT Fallback Error:", chatGPTError.message);
      return "I'm having trouble right now. Please try again later.";
    }
  }
};

// ✅ Main handler
exports.shopChatBotHandler = async (req, res) => {
    try {
        const { message } = req.body;
        const { user } = req;

        if (!message) return res.status(400).json({ error: "Message is required" });

        const intent = classifyIntent(message, user.role);
        console.log("itnent================>", intent);
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