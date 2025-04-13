const mongoose = require("mongoose");

const Order = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  products: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true 
      },
      price: {
        type: Number,
        required: true
      },
      // Add these new fields
      name: {
        type: String
      },
      description: {
        type: String
      },
      images: {
        type: [String]  // Assuming images is an array of strings (URLs)
      }
    }
  ],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    required: true 
  },
  state: { 
    type: String, 
    required: true 
  },
  zip: { 
    type: String, 
    required: true 
  },
  landmark: { 
    type: String 
  },
  paymentMethod: { 
    type: String, 
    enum: ["COD", "Online"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending" 
  },
  orderDetails: {
    orderId: { type: String, required: true }, // Store orderId for both COD & Online
    paymentId: { type: String },
    signature: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", Order);