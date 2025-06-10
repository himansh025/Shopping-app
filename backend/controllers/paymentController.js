const Razorpay = require("razorpay");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ,
  key_secret: process.env.RAZORPAY_KEY_SECRET 
});


const createOrder = async (req, res) => {
  try {
    const { values, productDetails } = req.body;
console.log(values,productDetails)
    // Validate input
    if (!values || !productDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data"
      });
    }

     // Generate a unique orderId for both COD and Online payments
     const uniqueOrderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Cash on Delivery (COD) Order
    if (values.paymentMethod === "COD") {
      const product = productDetails;
      const productDoc = await Product.findById(product.id);
      
      if (!productDoc || productDoc.stock < product.quantity) {
          return res.status(400).json({
              success: false,
              message: `Insufficient stock for product: ${product.name}`
          });
      }
  
      // Reduce stock
      productDoc.stock -= product.quantity;
      await productDoc.save();
  
  
      // Create COD Order
      const order = new Order({
          userId: values.id, 
          products: [   // ✅ Wrap inside an array
              {
                  productId: productDetails.id,  // ✅ Ensure ObjectId
                  quantity: product.quantity,
                  sellerId:product.sellerId,
                  price: product.price,
                  name: productDoc.name,  
                  description: productDoc.description, 
                  images: productDoc.images
              }
          ],
          totalAmount: product.price * product.quantity,
          name: values.name ,
          email: values.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          state: values.state,
          zip: values.zip,
          landmark: values.landmark,
          paymentMethod: "COD",
          status: "Pending",
          orderDetails: { orderId: uniqueOrderId }
      });
  
      await order.save();
  
      return res.status(200).json({
          success: true,
          message: "COD Order placed successfully",
          order,
          productDetail: productDoc
      });
  }

    // Online Payment Order
    if (values.paymentMethod === "Online") {
      // Calculate total amount
      const totalAmount = productDetails.price * productDetails.quantity;

      // Razorpay order options
      const options = {
        amount: Math.round(totalAmount * 100), // Convert to paise
        currency: "INR",
        receipt: uniqueOrderId, // Use generated orderId
        notes: {
          userId: values.id,
          products: JSON.stringify(productDetails)
        }
      };
      
      // Create Razorpay order
const razorpayOrder = await razorpay.orders.create(options);

// Find the product details using the product ID
let id = productDetails.id;
const prod = await Product.findById(id);

if (!prod) {
  return res.status(404).json({ success: false, message: "Product not found" });
}

// Create the order and include the full product details inside `products`
const order = new Order({
  userId: values.id,
  products: [{
    productId: prod._id,
    quantity: productDetails.quantity,
    sellerId:productDetails.sellerId,
    price: prod.price, // Use the actual product price
    name: prod.name,  // Adding product details inside products array
    description: prod.description, 
    images: prod.images
  }],
  totalAmount: prod.price * productDetails.quantity,
  name: values.name ,
  email: values.email,
  phone: values.phone,
  address: values.address,
  city: values.city,
  state: values.state,
  zip: values.zip,
  landmark: values.landmark,
  paymentMethod: "Online",
  status: "Processing",
  orderDetails: { orderId: razorpayOrder.id } // Store generated orderId
});

await order.save();
 

      res.status(200).json({
        success: true,
        message: "Razorpay order created",
        razorpay: {
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          key: process.env.RAZORPAY_KEY_ID
        },
        orderDetails: {
          name: values.name,
          email: values.email,
          contact: values.contact,
          productDetail:prod
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
      order_id,
      payment_id,
      signature
    } = req.body;

    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({ success: false, message: "Invalid payment verification data" });
    }


    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET )
      .update(order_id + "|" + payment_id)
      .digest("hex");


    if (generatedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }


  // Find and update order
  const order = await Order.findOne({ "orderDetails.orderId": order_id });


    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Update order status and payment details
    order.status = "Paid";
    order.orderDetails.paymentId = payment_id;
    order.orderDetails.signature = signature;

    // Reduce product stock
    if(order.products.length>1){
    for (const item of order.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }}else{
      const prodcount= order.products[0];
      

      const product = await Product.findById(prodcount.productId);

      if (product) {
        product.stock -= prodcount.quantity;
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