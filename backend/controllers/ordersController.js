const Order = require('../models/OrderModel.js');

const getAllOrders = async (req, res) => {
  try {
    const sellerId = req.user._id || req.user.id;
    
    const rawOrders = await Order.find({ "products.sellerId": sellerId }).sort({ createdAt: -1 });
    if (!rawOrders || rawOrders.length === 0) {
      return res.status(200).json({
        success: true,
        orders: [],
        orderlength: 0,
        message: "No orders yet"
      });
    }

    // Filter products for this specific seller to preserve privacy in multi-seller orders
    const orders = rawOrders.map(order => {
      const orderObj = order.toObject();
      orderObj.products = orderObj.products.filter(
        p => p.sellerId && p.sellerId.toString() === sellerId.toString()
      );
      return orderObj;
    });

    res.status(200).json({
      success: true,
      orders,
      orderlength: orders.length,
      message: "Orders found"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all orders',
      error: error.message
    });
  }
};

const OrderbyId = async (req, res) => {
  try {
    const { id } = req.body;
    const order = await Order.findById(id);
    if (order) {
      return res.status(200).json({
        success: true,
        order,
        message: "Orders found"
      });
    }
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders: orders || [],
      message: "User's orders found"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user orders',
      error: error.message
    });
  }
};

module.exports = { OrderbyId, getAllOrders, userOrders };