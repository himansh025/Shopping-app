const mongoose = require('mongoose');

const Seller = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  businessAddress: {
    type: String,
    required: true
  },
  registrationNumber: {
    type: String,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  otp: {
    code: String,
    expiresAt: Date
  },
  role: {
    type: String,
    enum: ['seller'],
    default: 'seller'
  }
}, { timestamps: true });

module.exports = mongoose.model('Seller', Seller);