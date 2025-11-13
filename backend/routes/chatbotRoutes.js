const express = require("express");
const router = express.Router();
const {
  shopChatBotHandler,
  healthCheck
} = require("../controllers/chatbotController.js");

const { authMiddleware} = require("../middleware/authMiddleware.js");
router.post("/chat", authMiddleware, shopChatBotHandler);
router.get("/health", healthCheck);

module.exports = router;
