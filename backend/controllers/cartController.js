// const Cart = require("../Models/CartModel.js");

// Get user's cart
const getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.userId }).populate("products.productId");
  res.json(cart);
};

// Add to cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId: req.user.userId });

  if (!cart) {
    cart = new Cart({ userId: req.user.userId, products: [] });
  }

  const existingProduct = cart.products.find((p) => p.productId.equals(productId));

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.products.push({ productId, quantity });
  }

  await cart.save();
  res.json(cart);
};

// Remove from cart
const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.userId });

  if (!cart) return res.status(404).json({ error: "Cart not found" });

  cart.products = cart.products.filter((p) => !p.productId.equals(req.params.productId));

  await cart.save();
  res.json(cart);
};

module.exports = { getCart, addToCart, removeFromCart };
