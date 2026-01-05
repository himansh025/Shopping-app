const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const Seller = require('../models/SellerModel')
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access Denied! No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    console.log("decoded", decoded)

    const { userId } = decoded;

    let user = await User.findById(userId);
    // console.log(user)
    let role = 'user';

    if (!user) {
      user = await Seller.findById(userId);
      role = 'seller';
    }

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Select only safe fields
    if (role === 'user') {
      user = await User.findById(userId).select('username email fullname phone');
    } else if (role === 'seller') {
      user = await Seller.findById(userId).select('-password -otp');
    }

    req.user = {
      ...user.toObject(),
      id: user._id.toString(),
      role
    };

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(400).json({ error: "Invalid token!" });
  }
};


const authorizeuser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as user' });
  }
};

const authorizeseller = (req, res, next) => {
  if (req.user && req.user.role === 'seller') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as seller' });
  }
};

const optionalAuthMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return next(); // Proceed without user context for guests
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    const { userId } = decoded;

    let user = await User.findById(userId);
    let role = 'user';

    if (!user) {
      user = await Seller.findById(userId);
      role = 'seller';
    }

    if (user) {
      // Select only safe fields
      if (role === 'user') {
        user = await User.findById(userId).select('username email fullname phone');
      } else if (role === 'seller') {
        user = await Seller.findById(userId).select('-password -otp');
      }

      req.user = {
        ...user.toObject(),
        id: user._id.toString(),
        role
      };
    }
    next();
  } catch (err) {
    console.error("Optional JWT verification error:", err);
    // Even if token is invalid, allow as guest
    next();
  }
};

module.exports = { authMiddleware, authorizeseller, authorizeuser, optionalAuthMiddleware };