const Razorpay = require("razorpay");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const Cart = require("../models/CartModel");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "secret_placeholder",
});

/**
 * Create Order Controller
 * Supports both multi-item carts and single-item direct checkouts
 * Authoritatively calculates price & shipping on server
 */
const createOrder = async (req, res) => {
  try {
    const { values, items, productDetails } = req.body;
    const userId = req.user._id || req.user.id;

    if (!values) {
      return res.status(400).json({
        success: false,
        message: "Customer and shipping values are required",
      });
    }

    // Determine normalized item list
    let rawItems = [];
    if (Array.isArray(items) && items.length > 0) {
      rawItems = items;
    } else if (productDetails) {
      // Legacy single-item structure
      rawItems = [{
        productId: productDetails.id || productDetails._id,
        quantity: productDetails.quantity || 1,
        size: productDetails.size || '',
      }];
    }

    if (rawItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items provided for checkout",
      });
    }

    // Validate and build authoritative order products
    const orderProducts = [];
    let itemsSubtotal = 0;

    for (const rawItem of rawItems) {
      const pId = rawItem.productId || rawItem.id || rawItem._id;
      const qty = Math.max(1, parseInt(rawItem.quantity, 10) || 1);

      if (!pId) {
        return res.status(400).json({
          success: false,
          message: "Invalid product identifier in order items",
        });
      }

      const productDoc = await Product.findById(pId);
      if (!productDoc) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${pId} not found`,
        });
      }

      if (productDoc.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: "${productDoc.name}". Available: ${productDoc.stock}, Requested: ${qty}`,
        });
      }

      const itemTotal = productDoc.price * qty;
      itemsSubtotal += itemTotal;

      orderProducts.push({
        productId: productDoc._id,
        sellerId: productDoc.seller.sellerId,
        quantity: qty,
        price: productDoc.price, // Server authoritative price
        name: productDoc.name,
        description: productDoc.description,
        images: productDoc.images,
      });
    }

    // Authoritative shipping calculation: Free if subtotal > 500, else 50
    const shippingFee = itemsSubtotal > 500 ? 0 : 50;
    const totalAmount = itemsSubtotal + shippingFee;

    const uniqueOrderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Handle Cash on Delivery (COD)
    if (values.paymentMethod === "COD") {
      // Re-verify and decrement stock for all items atomically
      for (const item of orderProducts) {
        const updated = await Product.findOneAndUpdate(
          { _id: item.productId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!updated) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock to complete order for item: ${item.name}`,
          });
        }
      }

      const order = new Order({
        userId,
        products: orderProducts,
        totalAmount,
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        state: values.state,
        zip: values.zip,
        landmark: values.landmark || "",
        paymentMethod: "COD",
        status: "Pending",
        orderDetails: { orderId: uniqueOrderId },
      });

      await order.save();

      // Clear user's server cart if authenticated
      await Cart.findOneAndUpdate(
        { user: userId },
        { items: [], totalQuantity: 0, totalPrice: 0 }
      );

      return res.status(200).json({
        success: true,
        message: "COD Order placed successfully",
        order,
      });
    }

    // Handle Online Payment (Razorpay)
    if (values.paymentMethod === "Online") {
      const options = {
        amount: Math.round(totalAmount * 100), // In paise
        currency: "INR",
        receipt: uniqueOrderId,
        notes: {
          userId: userId.toString(),
          itemsCount: orderProducts.length.toString(),
        },
      };

      const razorpayOrder = await razorpay.orders.create(options);

      // Create internal order in "Processing" state (stock not decremented until payment verified)
      const order = new Order({
        userId,
        products: orderProducts,
        totalAmount,
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        state: values.state,
        zip: values.zip,
        landmark: values.landmark || "",
        paymentMethod: "Online",
        status: "Processing",
        orderDetails: { orderId: razorpayOrder.id },
      });

      await order.save();

      return res.status(200).json({
        success: true,
        message: "Razorpay order created",
        orderId: order._id,
        razorpay: {
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          key: process.env.RAZORPAY_KEY_ID,
        },
        orderDetails: {
          name: values.name,
          email: values.email,
          contact: values.phone,
          totalAmount,
        },
      });
    }

    return res.status(400).json({
      success: false,
      message: `Unsupported payment method: ${values.paymentMethod}`,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

/**
 * Verify Razorpay Payment Signature
 * Decrements stock and marks order "Paid" upon HMAC verification
 */
const verifyPayment = async (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;

    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment verification payload",
      });
    }

    // Verify HMAC SHA-256 signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(order_id + "|" + payment_id)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: signature mismatch",
      });
    }

    // Find internal order
    const order = await Order.findOne({ "orderDetails.orderId": order_id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Matching order not found",
      });
    }

    // Prevent double verification or double stock decrement
    if (order.status === "Paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        orderId: order._id,
      });
    }

    // Update order status and payment details
    order.status = "Paid";
    order.orderDetails.paymentId = payment_id;
    order.orderDetails.signature = signature;

    // Decrement stock for all items
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    await order.save();

    // Clear user's server cart after confirmed payment
    await Cart.findOneAndUpdate(
      { user: order.userId },
      { items: [], totalQuantity: 0, totalPrice: 0 }
    );

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

module.exports = { createOrder, verifyPayment };