const Order = require('../models/Orders.js');

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    if(orders.lenght>1){

        res.status(200).json({
            success: true,
            orderlength: orders.length,
            orders
        });
    }
    res.status(200).json({
        success: true,
        message:"No Orders Yet"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users orders',
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

    module.exports= {OrderbyId,getAllOrders}