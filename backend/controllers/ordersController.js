const Order = require('../models/OrderModel.js');

const getAllOrders = async (req, res) => {
  try {
    const sellerId= req.user.id
    
    const orders =await Order.find({ "products.sellerId": sellerId });
    if (orders.length < 1) {
      return res.status(200).json({
        success: true,
        orders: [],
        orderlength: 0,
        message: "No orders yet"
      });
    }

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
      if(order){
          res.status(200).json({
              success: true,
              order,
            message:" Orders found"
          });
      }
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users orders',
        error: error.message
      });
    }
  };

  const userOrders = async (req, res) => {
    try {
      const userId = req.user.id;
  
      if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
      }

      // Always return an array of orders
      const orders = await Order.find({ userId });
  
      if (!orders || orders.length === 0) {
        return res.status(200).json({
          success: true,
          orders: [],
          message: "No orders found for this user"
        });
      }
  
      return res.status(200).json({
        success: true,
        orders, // always an array
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
  
  

    module.exports= {OrderbyId,getAllOrders,userOrders}