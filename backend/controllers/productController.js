const Product = require('../models/ProductModel.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');
// Controller for creating products
// const mongoose = require("mongoose")
const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      price, 
      category, 
      description, 
      stock, 
      brand, 
      attributes, 
      seller 
    } = req.body;

    
    // Validate required fields
    if (!name || !price || !category || !description || !stock) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required product fields' 
      });
    }
    
    const attributesString = JSON.parse(attributes);
    const sellerStrrng = JSON.parse(seller);
        console.log("fed",sellerStrrng)

    // Validate seller information
    if (!seller ) {
      return res.status(400).json({ 
        success: false, 
        message: 'Complete seller information is required' 
      });
    }

    // Validate file uploads
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one image is required' 
      });
    }

    if (req.files.length > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Maximum 5 images allowed' 
      });
    }

    // Process image uploads
    const imageUrls = [];
    for (const file of req.files) {
      const uploadResponse = await uploadOnCloudinary(file.path);
      
      if (uploadResponse && uploadResponse.url) {
        imageUrls.push(uploadResponse.url);
      } else {
        return res.status(500).json({
          success: false,
          message: 'Failed to upload images to Cloudinary'
        });
      }
    }

    // console.log(seller.sellerId, seller.name,
    //   seller.email,seller.contact);
    
    // Create product with all data
    const newProduct =await new Product({
      name,
      price,
      category,
      description,
      stock,
      brand: brand || "",
      attributes: attributesString || {},
      images: imageUrls,
      seller: {
        sellerId:sellerStrrng. sellerId,
        name: sellerStrrng.name,
        email: sellerStrrng.email,
        contact: sellerStrrng.contact
      }
    });

    const savedProduct = await newProduct.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Product created successfully', 
      product: savedProduct 
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create product', 
      error: error.message 
    });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { 
      name, 
      price, 
      category, 
      description, 
      stock, 
      brand, 
      attributes,
      seller 
    } = req.body;
    
    // Find the product
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Update image files if provided
    let imageUrls = [...product.images]; // Start with existing images
    
    if (req.files && req.files.length > 0) {
      // Process new image uploads
      if (req.files.length > 5) {
        return res.status(400).json({ 
          success: false, 
          message: 'Maximum 5 images allowed' 
        });
      }
      
      // Replace with new images
      imageUrls = [];
      for (const file of req.files) {
        const uploadResponse = await uploadOnCloudinary(file.path);
        
        if (uploadResponse && uploadResponse.url) {
          imageUrls.push(uploadResponse.url);
        }
      }
    }
    
    // Build update object
    const updateData = {
      name: name || product.name,
      price: price || product.price,
      category: category || product.category,
      description: description || product.description,
      stock: stock || product.stock,
      brand: brand || product.brand,
      images: imageUrls,
      attributes: attributes || product.attributes
    };
    
    // Update seller info if provided
    if (seller && Object.keys(seller).length > 0) {
      updateData.seller = {
        sellerId: seller.sellerId || product.seller.sellerId,
        name: seller.name || product.seller.name,
        email: seller.email || product.seller.email,
        contact: seller.contact || product.seller.contact
      };
    }
    
    // Update the product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// Get products by seller
const getProductsBySeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    
    const products = await Product.find({ 'seller.sellerId': sellerId });
    
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seller products',
      error: error.message
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsBySeller
};