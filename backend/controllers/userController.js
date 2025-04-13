const bcrypt = require("bcryptjs");
const User = require("../models/UserModel.js");
const Order= require("../models/OrderModel.js")
const { generateToken} = require("../middleware/generateToken.js");
const nodemailer = require("nodemailer");
const dotenv =require('dotenv')
// const bcrypt =require('bcrypt')
dotenv.config({
  path: './.env',
});


const tempUserStore = {};
// Function to generate OTP
const generateOTP = (length) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}
// console.log("auth", process.env.PASSWORD)

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Signup
const signup = async (req, res) => {
  try {
    const { fullname ,username, email, password, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    
    if (userExists) return res.status(400).json({ error: "User already exists!" });

    const otp = generateOTP(4);
    console.log(otp);

    tempUserStore[email] = { username,fullname, email, password, otp, phone };
console.log(tempUserStore);

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Hello! ${fullname}, Please Verify Your OTP`,
      html: `<strong>Your OTP code for Signup  is: ${otp}</strong>`,
    };
    // console.log(mailOptions);
    
    try {
      const data = await transporter.sendMail(mailOptions);
      console.log("data", data);
      res.status(200).json((200, email, "OTP sent successfully"));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}



const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedUser = tempUserStore[email];
console.log(storedUser);

    if (!storedUser) {
      return res.status(400).json({ error: "No OTP request found for this email" });
    }
    if (storedUser.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const { fullname, password, phone,username } = storedUser;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username,fullname, email, phone, password: hashedPassword });
console.log("user create hogya",newUser);

if (!newUser.phone) {
  return res.status(400).json({ error: "Phone number is required" });
}

    await newUser.save();
    const token = generateToken(newUser._id);

    console.log("token aaya",token);
    
    delete tempUserStore[email];
    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(201)
      .cookie(options)
      .json({
        message: "OTP verified successfully",
        user: {
          token,
          user: newUser,
        },
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
        user: { id: user._id, fullname: user.fullname, email: user.email },
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
  const { userId } = req.params; 
  // console.log("order",userId);
  if (!userId) {
    return res.status(404).json({ message: 'UserId not found' });
  }

  try {
    const order = await Order.findOne({ userId })
    .populate('userId', '-password -token')// pulls user details
      .populate('products');      // pulls product details

      console.log("order",order);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: "Order details retrieved",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }

}

module.exports = { signup, verifyOtp, login, logout,userprofile };
