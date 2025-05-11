const express = require("express");
const { signup, login, logout,verifyOtp,profile,updateProfile } = require("../controllers/sellerController");
const { authMiddleware,authorizeseller } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup",signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout",authMiddleware,authorizeseller, logout);
router.get("/profile",authMiddleware,authorizeseller ,profile);
router.put("/profile/update",authMiddleware,authorizeseller ,updateProfile);


module.exports = router;