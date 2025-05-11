const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
      lowercase: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true
    },
    phone: {
      type: Number,
      required: false, // Make phone optional
    },
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    wishlist: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    }],
    cart: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    }],
    isVerified: {
      type: Boolean,
      default: true // Since we verify with OTP before creating
    },
    profileImage: {
      type: String,
      default: null
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Virtual for user's full name
UserSchema.virtual('name').get(function() {
  return this.fullname;
});

// Method to check if user has admin rights
UserSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Don't return password and __v in toJSON
UserSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("User", UserSchema);