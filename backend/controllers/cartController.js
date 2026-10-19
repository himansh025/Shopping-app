const Cart = require('../models/CartModel.js');
const Product = require('../models/ProductModel.js');

// Helper to populate and return cart
const getPopulatedCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name price images brand stock category seller'
  });
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    let cart = await getPopulatedCart(userId);

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
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

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size = '' } = req.body;
    const userId = req.user._id || req.user.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check if product is in stock
    if (product.stock < qty) {
      return res.status(400).json({ 
        success: false, 
        message: `Only ${product.stock} units available in stock` 
      });
    }

    // Check size if product explicitly provides a sizes array
    if (size && product.size && Array.isArray(product.size) && product.size.length > 0) {
      if (!product.size.includes(size)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid size selected' 
        });
      }
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = new Cart({ 
        user: userId, 
        items: [] 
      });
    }

    // Check if product already exists in cart with matching size
    const existingIndex = cart.items.findIndex(
      item => item.product.toString() === productId.toString() && (item.size || '') === (size || '')
    );

    if (existingIndex > -1) {
      const newQuantity = cart.items[existingIndex].quantity + qty;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Total in cart exceeds available stock (${product.stock})`
        });
      }
      cart.items[existingIndex].quantity = newQuantity;
      cart.items[existingIndex].price = product.price; // keep price fresh
    } else {
      cart.items.push({
        product: product._id,
        quantity: qty,
        size: size || '',
        price: product.price
      });
    }

    await cart.save();
    const updatedCart = await getPopulatedCart(userId);

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart: updatedCart
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
    const userId = req.user._id || req.user.id;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    // Find the cart item by item._id or by item.product
    let cartItem = cart.items.id(cartItemId);
    if (!cartItem) {
      cartItem = cart.items.find(item => item.product.toString() === cartItemId.toString());
    }

    if (!cartItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart item not found' 
      });
    }

    // Find product to verify stock
    const product = await Product.findById(cartItem.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Associated product not found'
      });
    }

    if (product.stock < qty) {
      return res.status(400).json({ 
        success: false, 
        message: `Only ${product.stock} units available in stock` 
      });
    }

    cartItem.quantity = qty;
    cartItem.price = product.price;

    await cart.save();
    const updatedCart = await getPopulatedCart(userId);

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart: updatedCart
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
    const userId = req.user._id || req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    // Check if cartItemId is subdocument _id
    const itemById = cart.items.id(cartItemId);
    if (itemById) {
      cart.items.pull(cartItemId);
    } else {
      // Or remove by product id
      cart.items = cart.items.filter(
        item => item.product.toString() !== cartItemId.toString()
      );
    }

    await cart.save();
    const updatedCart = await getPopulatedCart(userId);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: updatedCart
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

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    } else {
      cart.items = [];
      cart.totalQuantity = 0;
      cart.totalPrice = 0;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
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

/**
 * Merge Guest Cart into User Cart upon login
 * Body: { guestItems: [{ productId, quantity, size }] }
 */
exports.mergeCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { guestItems = [] } = req.body;

    if (!Array.isArray(guestItems) || guestItems.length === 0) {
      const currentCart = await getPopulatedCart(userId);
      return res.status(200).json({
        success: true,
        message: 'No guest items to merge',
        cart: currentCart || { items: [], totalQuantity: 0, totalPrice: 0 }
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    for (const gItem of guestItems) {
      const pId = gItem.productId || gItem._id || gItem.id;
      if (!pId) continue;

      const product = await Product.findById(pId);
      if (!product || product.stock <= 0) continue;

      const reqQty = Math.max(1, parseInt(gItem.quantity, 10) || 1);
      const reqSize = gItem.size || '';

      const existingIndex = cart.items.findIndex(
        it => it.product.toString() === pId.toString() && (it.size || '') === reqSize
      );

      if (existingIndex > -1) {
        // Increment quantity, capped by product stock
        const combinedQty = cart.items[existingIndex].quantity + reqQty;
        cart.items[existingIndex].quantity = Math.min(combinedQty, product.stock);
        cart.items[existingIndex].price = product.price;
      } else {
        const finalQty = Math.min(reqQty, product.stock);
        cart.items.push({
          product: product._id,
          quantity: finalQty,
          size: reqSize,
          price: product.price
        });
      }
    }

    await cart.save();
    const updatedCart = await getPopulatedCart(userId);

    res.status(200).json({
      success: true,
      message: 'Guest cart merged successfully',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Error merging cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to merge cart',
      error: error.message
    });
  }
};