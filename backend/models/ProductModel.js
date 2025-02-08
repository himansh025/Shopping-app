const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title:String,
  name: String,
  price: Number,
  description: String,
  image: String,
  category: String,
});

module.exports = mongoose.model("Product", ProductSchema);
