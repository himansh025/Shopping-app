const Seller = require('../models/SellerModel');
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const {generateToken }= require("../middleware/generateToken.js");


const signup = async (req, res) => {
  try {
    const { businessName, email, phoneNumber, password, businessAddress, registrationNumber } = req.body;

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ 
      $or: [{ email }, { phoneNumber }] 
    });

    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: 'Seller already exists with this email or phone number'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = otpGenerator.generate(6, { 
      upperCaseAlphabets: false, 
      specialChars: false 
    });

    // Create new seller
    const newSeller = new Seller({
      businessName,
      email,
      phoneNumber,
      password: hashedPassword,
      businessAddress,
      registrationNumber,
      otp: {
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // OTP expires in 10 minutes
      }
    });
    
    await newSeller.save();

    // TODO: Send OTP to seller's phone/email

    res.status(201).json({
      success: true,
      message: 'Seller registered successfully. Please verify OTP.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in seller registration',
      error: error.message
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const seller = await Seller.findOne({ 
      email,
      'otp.code': otp,
      'otp.expiresAt': { $gt: new Date() }
    });

    if (!seller) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Mark seller as verified
    seller.isVerified = true;
    seller.otp = undefined;
    await seller.save();
    const token= await generateToken(newSeller._id);

    res.status(200).json({
      success: true,
      token:token,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in OTP verification',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email })

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    // Check if seller is verified
    if (!seller.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Seller account not verified'
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, seller.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token= generateToken(seller._id);
    seller.password = "";


    res.status(200).json({
      success: true,
      user:seller,
      message: 'Login successful',
      token:token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in seller login',
      error: error.message
    });
  }
};

const logout = async (req, res) => {
  try {
    // For JWT, typically logout is handled client-side by removing the token
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in seller logout',
      error: error.message
    });
  }
};



const profile = async (req, res) => {
  try {
    // Get seller ID from authenticated user
    const sellerId = req.user.id;
    
    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: 'Seller ID not found'
      });
    }
    
    // Find seller by ID and exclude sensitive fields
    const seller = await Seller.findById(sellerId)
      .select('-password -otp -token')
      .populate('products', 'name price images category stock')
      .lean();
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }
    
    res.status(200).json({
      success: true,
      seller
    });
    
  } catch (error) {
    console.error('Error in seller profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching seller profile',
      error: error.message
    });
  }
};
module.exports={login,logout,verifyOtp,signup,profile }