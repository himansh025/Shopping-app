const {Cart} = require('../models/CartModel.js');
const {Product} = require('../models/ProductModel.js');

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    const userId = req.user.id; // Assuming you have authentication middleware

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check if product is in stock
    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient stock' 
      });
    }

    // Check if size is available
    if (!product.size.includes(size)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid size selected' 
      });
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = new Cart({ 
        user: userId, 
        items: [] 
      });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      // Update quantity if product exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        size,
        price: product.price
      });
    }

    // Save cart
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add product to cart',
      error: error.message 
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    // Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    // Find the cart item
    const cartItem = cart.items.id(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart item not found' 
      });
    }

    // Find the product to check stock
    const product = await Product.findById(cartItem.product);
    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient stock' 
      });
    }

    // Update quantity
    cartItem.quantity = quantity;

    // Save cart
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      cart
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update cart item',
      error: error.message 
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const userId = req.user.id;

    // Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    // Remove item from cart
    cart.items.pull(cartItemId);

    // Save cart
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to remove item from cart',
      error: error.message 
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user's cart and populate product details
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items.product',
        select: 'name price images brand size stock'
      });

    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch cart',
      error: error.message 
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find and update cart
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], totalQuantity: 0, totalPrice: 0 },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to clear cart',
      error: error.message 
    });
  }
};