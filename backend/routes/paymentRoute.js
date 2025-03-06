const express = require("express");
const { 
  createOrder, 
  verifyPayment 
} = require("../controllers/paymentController.js");

const router = express.Router();

// Route to create a new order (both COD and Online)
router.post("/createOrder", createOrder);

// Route to verify payment after Razorpay transaction
router.post("/verifyPayment", verifyPayment);

module.exports = router;