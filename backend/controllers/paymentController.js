require("dotenv").config();
const Razorpay = require("razorpay");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const createOrder = async (req, res) => {
  try {
    const { data, productDetails } = req.body;

    // Validate input
    if (!data || !productDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data"
      });
    }

    // Cash on Delivery (COD) Order
    if (data.paymentMethod === "COD") {
      for (const product of productDetails) {
        const productDoc = await Product.findById(product.productId);
        if (!productDoc || productDoc.stock < product.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product: ${product.name}`
          });
        }

        // Reduce stock
        productDoc.stock -= product.quantity;
        await productDoc.save();
      }

      // Create COD Order
      const order = new Order({
        userId: data.userId, // Ensure this is a valid ObjectId
        products: productDetails.map(product => ({
          productId: product.productId,
          quantity: product.quantity,
          price: product.price
        })),
        totalAmount: productDetails.reduce((total, product) => total + product.price * product.quantity, 0),
        name: data.name,
        email: data.email,
        phone: data.contact,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        landmark: data.landmark,
        paymentMethod: "COD",
        status: "Pending"
      });

      await order.save();

      return res.status(200).json({
        success: true,
        message: "COD Order placed successfully",
        order
      });
    }

    // Online Payment Order
    if (data.paymentMethod === "Online") {
      // Calculate total amount
      const totalAmount = productDetails.reduce((total, product) =>
        total + (product.price * product.quantity), 0
      );

      // Razorpay order options
      const options = {
        amount: Math.round(totalAmount * 100), // Convert to paise
        currency: "INR",
        receipt: `order_rcptid_${Date.now()}`,
        notes: {
          userId: data.userId,
          products: JSON.stringify(productDetails)
        }
      };

      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create(options);

      res.status(200).json({
        success: true,
        message: "Razorpay order created",
        razorpay: {
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          key: process.env.RAZORPAY_KEY_ID
        },
        orderDetails: {
          name: data.name,
          email: data.email,
          contact: data.contact
        }
      });
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    // Find and update order
    const order = await Order.findOne({
      "razorpay.orderId": razorpay_order_id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Update order status and payment details
    order.status = "Paid";
    order.razorpay = {
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    };

    // Reduce product stock
    for (const item of order.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      orderId: order._id
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message
    });
  }
};

module.exports = { createOrder, verifyPayment };