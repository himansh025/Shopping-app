const express = require("express");
const { signup, login, logout,verifyOtp, userprofile, userwishlist,userCart } = require("../controllers/userController.js");
const {authMiddleware,authorizeuser} = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/signup",signup);
router.post("/verify-otp",verifyOtp);
router.post("/login", login);
router.post("/logout",authMiddleware,logout);
router.get("/profile", authMiddleware,authorizeuser,userprofile);
router.get('/user-wishlist',authMiddleware,authorizeuser,userwishlist)
router.get('/user-cart',authMiddleware,authorizeuser,userCart)


module.exports = router;