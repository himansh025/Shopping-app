const mongoose = require("mongoose");

const Product = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // Example: "Clothing", "Electronics", "Furniture"
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    brand: { type: String },

    // Array of images for multiple product types
    images: {
      type: [String], 
      required: true,
      validate: [(val) => val.length > 0, "At least one image is required"],
    },

    // Flexible attributes for different product categories
    attributes: { type: mongoose.Schema.Types.Mixed, default: {} },

    // Seller Details
    seller: {
      sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: false },
      name: { type: String, default: "MyShop Official" },
      email: { type: String, default: "support@myshop.com" },
      contact: { type: String, default: "N/A" },
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    createdByRole: {
      type: String,
      enum: ["seller", "admin"],
      default: "seller",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", Product);
