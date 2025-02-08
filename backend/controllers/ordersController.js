const Order = require("../models/OrderModel.js");

// Get Orders by User ID
const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Place Order
const placeOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    const newOrder = new Order({
      userId: req.params.userId,
      products,
      totalAmount,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports={placeOrder,getOrdersByUser}