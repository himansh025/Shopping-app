const express = require("express");
const { getCart, addToCart, removeFromCart } = require("../controllers/cartController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/getCart", authMiddleware, getCart);
router.post("/addTOCart", authMiddleware, addToCart);
router.delete("/removeFromCart/:productId", authMiddleware, removeFromCart);

module.exports = router;
