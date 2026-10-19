const Seller = require('../models/SellerModel');
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const {generateToken }= require("../middleware/generateToken.js");
const sendOtpEmail = require("../utils/sendOtpEmail.js");


const signup = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    const fullname = (req.body.fullname || req.body.name)?.trim();

    // Check required fields
    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required'
      });
    }

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      if (existingSeller.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'This email is already registered as a seller. Please log in.'
        });
      } else {
        // Unverified account: update password and reissue OTP
        const otp = otpGenerator.generate(4, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
          alphabets: false, 
        });
        console.log(`[SELLER SIGNUP RESEND OTP] Email: ${email} | OTP: ${otp}`);

        const salt = await bcrypt.genSalt(10);
        existingSeller.password = await bcrypt.hash(password, salt);
        existingSeller.fullname = fullname;
        existingSeller.otp = {
          code: otp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        };
        await existingSeller.save();

        try {
          await sendOtpEmail({ email, fullname, otp });
        } catch (mailErr) {
          console.warn("sendOtpEmail warning (SMTP error, logged OTP to console):", mailErr.message);
        }

        return res.status(200).json({
          success: true,
          message: 'Verification code resent. Please verify OTP.'
        });
      }
    }

    // Auto-generate guaranteed unique username
    const baseUsername = req.body.username?.trim().toLowerCase() || email.split('@')[0].replace(/[^a-z0-9]/g, '') || 'seller';
    let username = baseUsername;
    let counter = 1;
    while (await Seller.findOne({ username })) {
      username = `${baseUsername}${Math.floor(100 + Math.random() * 900)}${counter}`;
      counter++;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      alphabets: false, 
    });
    console.log(`[SELLER SIGNUP OTP] Email: ${email} | OTP: ${otp}`);

    // Create new seller
    const newSeller = new Seller({
      username,
      fullname,
      email,
      password: hashedPassword,
      otp: {
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      }
    });
    
    await newSeller.save();

    try {
      await sendOtpEmail({ email, fullname, otp });
    } catch (mailErr) {
      console.warn("sendOtpEmail warning (SMTP error, logged OTP to console):", mailErr.message);
    }

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
    console.log(seller)
    const token= await generateToken(seller._id);
    console.log(token)

    res.status(200).json({
      success: true,
      token,
      user:seller,
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


// Logout
const logout = async (req, res) => {
  await Seller.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        token: null
       }
    }
  )
  const options = {
    httpOnly: true,
    secure: true,
  }
  res
    .status(200)
    .clearCookie("token", options)
    .json({messfage: "successfull logout"})
}

const updateProfile = async (req, res) => {
  try {
    const sellerId = req.user._id; // authenticated user ID

    // Only allow these specific fields to be updated
    const allowedUpdates = [
      "businessName",
      "fullname",
      "phoneNumber",
      "registrationNumber",
      "businessAddress"
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedSeller = await Seller.findByIdAndUpdate(sellerId, updates, {
      new: true,
      runValidators: true,
    }).select("-password"); // exclude password if present

    if (!updatedSeller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      seller: updatedSeller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

module.exports = updateProfile;


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
module.exports={login,logout,verifyOtp,signup,profile,updateProfile }