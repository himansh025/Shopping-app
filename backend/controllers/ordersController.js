const Order = require('../models/OrderModel.js');
const Product = require('../models/ProductModel.js');

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    console.log("orders",orders);
//     const getProductDetails = async () => {
//       const productIds = orders.flatMap(order => 
//         order.products ? order.products.map(prod => prod.productId) : []
//       );
    
//       // Fetch product details using productIds
//       const productDetails = await Product.find({ _id: { $in: productIds } });
    
//       return productDetails;
//     };
//     let data=await getProductDetails()
// console.log("data",data.length)

    
    if(orders.lenght<1){
        res.status(200).json({
            success: true,
            orderlength: orders.length,
            message:"No Orders Yet"
          });
    }
    res.status(200).json({
        success: true,
        orders:orders,
        orderlength: orders.length,
        message:" Orders Found"
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