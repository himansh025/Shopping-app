const express = require("express");
const Cart = require("../models/CartModel.js");

const router = express.Router();

// Get User's Cart
router.get("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId }).populate(
    "products.productId"
  );
  res.json(cart);
});

// Add to Cart
router.post("/:userId", async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId: req.params.userId });

  if (!cart) {
    cart = new Cart({ userId: req.params.userId, products: [] });
  }

  const existingProduct = cart.products.find((p) =>
    p.productId.equals(productId)
  );

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.products.push({ productId, quantity });
  }

  await cart.save();
  res.json(cart);
});

// Remove from Cart
router.delete("/:userId/:productId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });

  if (!cart) return res.status(404).json({ error: "Cart not found" });

  cart.products = cart.products.filter(
    (p) => !p.productId.equals(req.params.productId)
  );

  await cart.save();
  res.json(cart);
});

module.exports = router;
