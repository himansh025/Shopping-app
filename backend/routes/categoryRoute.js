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
  authorizeseller,
} = require("../middleware/authMiddleware");

// Public endpoints
router.get("/all", getAllCategories);
router.get("/:id", getCategoryById);

// Seller/Admin protected endpoints
router.post(
  "/create",
  authMiddleware,
  authorizeseller,
  upload.single("image"),
  createCategory
);

router.put(
  "/update/:id",
  authMiddleware,
  authorizeseller,
  upload.single("image"),
  updateCategory
);

router.delete(
  "/delete/:id",
  authMiddleware,
  authorizeseller,
  deleteCategory
);

router.post(
  "/seed",
  authMiddleware,
  authorizeseller,
  seedDefaultCategories
);

module.exports = router;
