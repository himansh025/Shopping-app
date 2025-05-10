const express = require("express");
const { signup, login, logout,verifyOtp,profile } = require("../controllers/sellerController");
const { authMiddleware,authorizeseller } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup",signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout",authMiddleware, logout);
router.get("/profile",authMiddleware,authorizeseller ,profile);

module.exports = router;