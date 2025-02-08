const Product = require("../models/ProductModel.js");

// Get all products
const getProducts = async (req, res) => {
  const products = await Product.find();
  res
  .status(200)
  .json({
    message:"successfully fetch all the products",
    products:products
  });
};

// Add new product
const addProduct = async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res
  .status(201)
  .json(
    {
      message:"succesfully add the new product",newProduc:newProduc
    });
};

// Delete product
const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

module.exports = { getProducts, addProduct, deleteProduct };
