const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer.js");
const { authMiddleware, authorizeAdmin } = require("../middleware/authMiddleware.js");
const {
  getAdminStats,
  getAdminSellers,
  updateSellerStatus,
  getAdminProducts,
  updateProductApproval,
  createAdminProduct,
  deleteAdminProduct,
  getAdminCategories,
  updateCategoryApproval,
  createAdminCategory,
  deleteAdminCategory,
} = require("../controllers/adminController.js");

// Apply auth + admin authorization to all admin routes
router.use(authMiddleware, authorizeAdmin);

// Dashboard stats
router.get("/stats", getAdminStats);

// Seller management
router.get("/sellers", getAdminSellers);
router.put("/sellers/:id/status", updateSellerStatus);

// Product approval & admin product creation
router.get("/products", getAdminProducts);
router.put("/products/:id/approval", updateProductApproval);
router.post("/products", upload.array("images", 5), createAdminProduct);
router.delete("/products/:id", deleteAdminProduct);

// Category approval & admin category creation
router.get("/categories", getAdminCategories);
router.put("/categories/:id/approval", updateCategoryApproval);
router.post("/categories", upload.single("image"), createAdminCategory);
router.delete("/categories/:id", deleteAdminCategory);

module.exports = router;
