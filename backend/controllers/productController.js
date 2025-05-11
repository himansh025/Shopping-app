const Product = require('../models/ProductModel.js');
const User = require('../models/UserModel.js');
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
    const { name } = req.query;

    // Build filter object for searching
    let filter = {};

    // If there is a search query in 'name', apply it across multiple fields
    if (name) {
      const searchQuery = { $regex: name, $options: 'i' }; // Case-insensitive search
      filter = {
        $or: [
          { name: searchQuery },  // Search in the product name
          { category: searchQuery },  // Search in the category
          { brand: searchQuery }  // Search in the brand
        ]
      };
    }

    // Fetch products that match the filter
    const products = await Product.find(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};


const getAllSellerProd = async (req, res) => {
  try {
    const { name } = req.query;

    // Always filter by seller.sellerId
    const filter = { "seller.sellerId": req.user.id };
console.log(filter)

    if (name) {
      const searchQuery = { $regex: name, $options: 'i' };
      filter.$or = [
        { name: searchQuery },
        { category: searchQuery },
        { brand: searchQuery }
      ];
    }

    const products = await Product.find(filter);
console.log(products)
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
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

    const { productId } = req.params;

    console.log("Received attributes:", attributes);

    // Ensure attributes is parsed correctly if it's passed as a string
    let parsedAttributes
    if (attributes) {
      try {
        parsedAttributes = JSON.parse(attributes);  // Parse stringified attributes if passed as a string
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid attributes JSON' });
      }
    }

    // Find the product
    let product = await Product.findById(productId);
    
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
      attributes: parsedAttributes
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
      productId,
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


const wishlist= async (req, res) => {
  const userId = req.user.id; 
  const id = req.params.id;

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.wishlist.indexOf(id);

    if (index > -1) {
      // already in wishlist -> remove
      user.wishlist.splice(index, 1);
    } else {
      // not in wishlist -> add
      user.wishlist.push(id);
    }

    await user.save();

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};


const addToCart = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.cart.includes(productId)) {
      return res.status(400).json({ message: "Product already in cart" });
    }
    user.cart.push(productId);
    await user.save();
    res.status(200).json({ cart: user.cart, message: "Product added to cart" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart", error: err });
  }
};

const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.cart = user.cart.filter(id => id.toString() !== productId);
    await user.save();
    res.status(200).json({ cart: user.cart, message: "Product removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from cart", error: err });
  }
};


module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsBySeller,
  wishlist,
  addToCart,
  removeFromCart,
  getAllSellerProd
};