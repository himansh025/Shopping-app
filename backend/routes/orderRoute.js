const express = require("express");
const { OrderbyId,getAllOrders} = require("../controllers/ordersController");

const router = express.Router();

router.get("/orderById", OrderbyId);
router.post("/allOrders",getAllOrders );
// router.("/allOrders", );


module.exports = router;