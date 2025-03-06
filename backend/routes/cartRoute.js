const express = require('express');
const router = express.Router();
const { 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  getCart,
  clearCart
} = require('../controllers/cartController.js');
// const authMiddleware = require('../middlewares/authMiddleware'); // Assuming you have an auth middleware

// Add item to cart (requires authentication)
router.post('/add',
    //  authMiddleware,
      addToCart);

// Update cart item quantity
router.put('/update/:cartItemId',
    //  authMiddleware, 
     updateCartItem);

// Remove item from cart
router.delete('/remove/:cartItemId',
    //  authMiddleware, 
     removeFromCart);

// Get user's cart
router.get('/', 
    // authMiddleware,
     getCart);

// Clear entire cart
router.delete('/clear',
    //  authMiddleware,
      clearCart);

module.exports = router;