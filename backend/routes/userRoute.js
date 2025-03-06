const express = require("express");
const { signup, login, logout,verifyOtp } = require("../controllers/userController.js");

const router = express.Router();

router.post("/signup",signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;