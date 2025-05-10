const express = require("express");
const { 
  createOrder, 
  verifyPayment 
} = require("../controllers/paymentController.js");
const { authorizeuser, authMiddleware } = require("../middleware/authMiddleware.js");

const router = express.Router();

// Route to create a new order (both COD and Online)
router.post("/createOrder",authMiddleware,authorizeuser, createOrder);

// Route to verify payment after Razorpay transaction
router.post("/verifyPayment",authMiddleware,authorizeuser, verifyPayment);

module.exports = router;