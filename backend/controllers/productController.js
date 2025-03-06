const Product = require('../models/ProductModel.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');
// const fs = require('fs');

const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      price, 
      category, 
      description, 
      type, 
      size, 
      brand, 
      material, 
      stock 
    } = req.body;

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one image is required' 
      });
    }

    // Limit to 5 images
    if (req.files.length > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Maximum 5 images allowed' 
      });
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    for (const file of req.files) {
      const uploadResponse = await uploadOnCloudinary(file.path);
      if (uploadResponse) {
        imageUrls.push(uploadResponse.url);
      }
    }

    // Create new product
    const newProduct = new Product({
      name,
      price,
      category,
      description,
      type,
      size: Array.isArray(size) ? size : [size],
      brand,
      material,
      stock,
      images: imageUrls
    });

    // Save product
    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: savedProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create product',
      error: error.message 
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    // Handle image uploads if new images are provided
    if (req.files && req.files.length > 0) {
      // Limit to 5 images
      if (req.files.length > 5) {
        return res.status(400).json({ 
          success: false, 
          message: 'Maximum 5 images allowed' 
        });
      }

      // Upload new images
      const newImageUrls = [];
      for (const file of req.files) {
        const uploadResponse = await uploadOnCloudinary(file.path);
        if (uploadResponse) {
          newImageUrls.push(uploadResponse.url);
        }
      }

      // If new images are uploaded, add them to existing images
      if (updateData.images) {
        updateData.images = [...updateData.images, ...newImageUrls];
      } else {
        updateData.images = newImageUrls;
      }
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update product',
      error: error.message 
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete product',
      error: error.message 
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch products',
      error: error.message 
    });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch product',
      error: error.message 
    });
  }
};
module.exports={createProduct,updateProduct,deleteProduct,getProducts,getSingleProduct}