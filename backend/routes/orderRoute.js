const express = require("express");
const { OrderbyId,getAllOrders} = require("../controllers/ordersController");

const router = express.Router();

router.get("/orderById", OrderbyId);
router.get("/allOrders",getAllOrders );
// router.("/allOrders", );


module.exports = router;