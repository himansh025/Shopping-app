const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
  businessName: {
    type: String,
    trim: true
  },
    username: {
    type: String,
    required:true
  },
  fullname: {
    type: String,
    required:true
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
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  businessAddress: {
    type: String
  },
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true // handles uniqueness when value is missing
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

module.exports = mongoose.model('Seller', SellerSchema);
