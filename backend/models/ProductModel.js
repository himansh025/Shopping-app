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
      sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      contact: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", Product);
