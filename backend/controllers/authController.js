const bcrypt = require("bcryptjs");
const User = require("../models/UserModel.js");
const generateToken = require("../middleware/generateToken.js");
const nodemailer = require("nodemailer");
const dotenv =require('dotenv')
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
console.log("auth", process.env.PASSWORD)

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
    const { name, email, password, phoneno } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "User already exists!" });

    const otp = generateOTP(4);
    // console.log(otp);

    tempUserStore[email] = { name, email, password, otp };

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Hello! ${name}, Please Verify Your OTP`,
      html: `<strong>Your OTP code for Signup  is: ${otp}</strong>`,
    };
    try {
      const data = await transporter.sendMail(mailOptions);
      console.log("data", data);
      res.status(200).json(new Apiresponse(200, email, "OTP sent successfully"));
    } catch (error) {
      throw new ApiError(500, `Error while sending OTP: ${error}`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const storedUser = tempUserStore[email];
    if (!storedUser) {
      throw new ApiError(400, "No OTP request found for this email");
    }
    if (storedUser.otp !== otp) {
      throw new ApiError(400, "Invalid OTP");
    }
    const { name, password } = storedUser;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, phoneno, password: hashedPassword });

    await newUser.save();
    delete tempUserStore[email];

    const token = generateToken(newUser._id);

    console.log("aya token",token);

    const createdUser = await User.findById(newUser._id).select("-password ");

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user");
    }
    const options = {
      httpOnly: true,
      secure: true,
    }

    res
      .status(201)
      .cookie("token", token, options)
      .json({
        message: 'OTP verified successfully',
        user: {
          token,
          createdUser
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
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
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

module.exports = { signup, verifyOtp, login, logout };
