const bcrypt = require("bcryptjs");
const User = require("../models/UserModel.js");
const Order= require("../models/OrderModel.js")
const { generateToken} = require("../middleware/generateToken.js");
const otpGenerator = require('otp-generator');
const sendOtpEmail = require("../utils/sendOtpEmail.js");

const tempUserStore = {};

// Signup controller
const signup = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;
    
    // Validate required fields
    if (!username || !fullname || !email || !password) {
      return res.status(400).json({ 
        error: "Username, full name, email, and password are required" 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ error: "Email already in use" });
      } else {
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets:false,
      specialChars: false,
      alphabets: false, 
    });

    console.log(otp)

    // Store user data with OTP
    tempUserStore[email] = { 
      username,
      fullname, 
      email, 
      password, 
      otp, 
      createdAt: new Date()
    };

    // Set OTP expiration (15 minutes)
    setTimeout(() => {
      if (tempUserStore[email]) {
        delete tempUserStore[email];
      }
    }, 10 * 60 * 1000);

    // Prepare email content
await sendOtpEmail({ email, fullname, otp });

    // Respond with success
    res.status(200).json({ 
      success: true,
      message: "OTP sent successfully to your email" 
    });
    
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      error: "Server error during signup process",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verify OTP controller
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Check if email and OTP are provided
    if (!email || !otp) {
      return res.status(400).json({ 
        error: "Email and OTP are required" 
      });
    }

    // Get stored user data
    const storedUser = tempUserStore[email];
    
    // Check if there's pending OTP verification for this email
    if (!storedUser) {
      return res.status(400).json({ 
        error: "No pending verification found for this email or OTP expired" 
      });
    }

    // Check if OTP matches
    if (storedUser.otp !== otp) {
      return res.status(400).json({ 
        error: "Invalid OTP" 
      });
    }

    // Extract user data from temporary store
    const { username, fullname, password } = storedUser;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    const newUser = new User({
      username,
      fullname,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id);

    // Clean up temporary storage
    delete tempUserStore[email];

    // Send successful response
    res.status(201).json({
      success: true,
      message: "Account verified successfully",
      user: {
        token,
        user: {
          _id: newUser._id,
          username: newUser.username,
          fullname: newUser.fullname,
          email: newUser.email,
          role: newUser.role
        }
      }
    });
    
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ 
      error: "Server error during verification process",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};
// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = generateToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("token", token, options)
      .json({
        token,
        user: user,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout
const logout = async (req, res) => {

  await User.findByIdAndUpdate(
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

const userprofile= async(req,res)=>{

const userId= req.user._id
  if (!userId) {
    return res.status(404).json({ message: 'UserId not found' });
  }

  try {
    const user= await User.findById(userId).select('-password')

    const order = await Order.find({ userId })
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: "Order details retrieved",
      order,
      products:order.products,
      user
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }

}
const userwishlist=  async (req, res) => {

  const userId = req.user.id; // (get user ID from token or session)

  try {
    const user = await User.findById(userId).populate('wishlist');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const userCart=  async (req, res) => {
  const userId = req.user.id; // (get user ID from token or session)
  try {
    if(!userId){
      return res.status(404).json({ message: "user not found" });
    }
    const usercart = await User.findById(userId).populate('cart');
    if (!usercart) {
      return res.status(404).json({ message: "usercart not found" });
    }

    res.status(200).json({ cart: usercart.cart,message :"successfullty get the user cart data" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

module.exports = { signup, verifyOtp, login, logout,userprofile,userwishlist,userCart };
