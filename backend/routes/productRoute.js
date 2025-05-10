const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer.js');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  wishlist,
  addToCart,removeFromCart,
  getAllSellerProd
} = require('../controllers/productController');
const {authorizeuser,authMiddleware,authorizeseller}= require("../middleware/authMiddleware.js")

router.get('/seller/all',authMiddleware,authorizeseller, getAllSellerProd);

router.post(    
  '/create', 
  upload.array('images', 5), 
  authMiddleware,authorizeseller,
  createProduct
);

router.put(
  '/update/:productId', 
  upload.array('images', 5),
  authMiddleware,authorizeseller,  // Optional image upload
  updateProduct
);

// Route to delete a product
router.delete('/delete/:productId',authMiddleware,authorizeseller, deleteProduct);

// Route to get all products
router.get('/all', getAllProducts);

// Rou  te to get a single product by ID
router.get('/:productId', getProductById);
router.put('/wishlist/:id',authMiddleware,authMiddleware,authorizeuser,wishlist)
router.post("/productCart/:id", authMiddleware,authorizeuser,addToCart);     // Add to cart
router.delete("/productCart/:id", authMiddleware,authorizeuser, removeFromCart); // Remove from cart

module.exports = router;