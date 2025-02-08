const express = require("express");
const { getOrdersByUser, placeOrder } = require("../controllers/ordersController");

const router = express.Router();

router.get("/:userId", getOrdersByUser);
router.post("/:userId", placeOrder);

module.exports = router;
