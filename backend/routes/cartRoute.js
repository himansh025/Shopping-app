const express = require('express');
const router = express.Router();
const { 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  getCart,
  clearCart,
  mergeCart
} = require('../controllers/cartController.js');
const { authMiddleware, authorizeuser } = require('../middleware/authMiddleware.js');

// All cart routes require authenticated customer
router.use(authMiddleware, authorizeuser);

// Get user's cart
router.get('/', getCart);

// Add item to cart
router.post('/add', addToCart);

// Merge guest cart on login
router.post('/merge', mergeCart);

// Update cart item quantity
router.put('/update/:cartItemId', updateCartItem);

// Remove item from cart
router.delete('/remove/:cartItemId', removeFromCart);

// Clear entire cart
router.delete('/clear', clearCart);

module.exports = router;