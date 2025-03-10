const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer.js');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  // getProductsBySeller
} = require('../controllers/productController');

// Route to create a new product with up to 5 images
router.post(    
  '/create', 
  upload.array('images', 5),  // 'images' is the field name, max 5 files
  createProduct
);

// Route to update a product, allowing additional image uploads
router.put(
  '/update/:productId', 
  upload.array('images', 5),  // Optional image upload
  updateProduct
);

// Route to delete a product
router.delete('/delete/:productId', deleteProduct);

// Route to get all products
router.get('/all', getAllProducts);

// Rou  te to get a single product by ID
router.get('/:productId', getProductById);

module.exports = router;