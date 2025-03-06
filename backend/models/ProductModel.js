const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: [String], required: true },
  brand: { type: String, required: true },
  material: { type: String, required: true },
  stock: { type: Number, required: true },
  images: { type: [String], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
