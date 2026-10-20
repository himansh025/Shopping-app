const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  seedDefaultCategories,
} = require("../controllers/categoryController");
const {
  authMiddleware,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// Public endpoints (Viewable by customers and sellers)
router.get("/all", getAllCategories);
router.get("/:id", getCategoryById);

// Admin-ONLY management endpoints (Only admin can create, update, delete, seed categories)
router.post(
  "/create",
  authMiddleware,
  authorizeAdmin,
  upload.single("image"),
  createCategory
);

router.put(
  "/update/:id",
  authMiddleware,
  authorizeAdmin,
  upload.single("image"),
  updateCategory
);

router.delete(
  "/delete/:id",
  authMiddleware,
  authorizeAdmin,
  deleteCategory
);

router.post(
  "/seed",
  authMiddleware,
  authorizeAdmin,
  seedDefaultCategories
);

module.exports = router;
