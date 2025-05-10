const express = require("express");
const { OrderbyId,getAllOrders,userOrders} = require("../controllers/ordersController");
const {authMiddleware,authorizeseller,authorizeuser} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/orderById", OrderbyId);
router.get("/userOrders",authMiddleware,authorizeuser,userOrders );
router.get("/allOrders",authMiddleware,authorizeseller,getAllOrders );


module.exports = router;