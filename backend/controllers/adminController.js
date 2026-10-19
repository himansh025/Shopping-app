const Seller = require("../models/SellerModel");
const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");
const Order = require("../models/OrderModel");
const User = require("../models/UserModel");
const { uploadOnCloudinary } = require("../utils/cloudinary");

// ==========================================
// 1. Dashboard Overview / Analytics Stats
// ==========================================
const getAdminStats = async (req, res) => {
  try {
    const [
      totalSellers,
      activeSellers,
      pendingSellers,
      disabledSellers,
      totalProducts,
      pendingProducts,
      approvedProducts,
      rejectedProducts,
      totalCategories,
      pendingCategories,
      approvedCategories,
      totalOrders,
      orders
    ] = await Promise.all([
      Seller.countDocuments(),
      Seller.countDocuments({ status: "active" }),
      Seller.countDocuments({ status: "pending" }),
      Seller.countDocuments({ status: "disabled" }),
      Product.countDocuments(),
      Product.countDocuments({ approvalStatus: "pending" }),
      Product.countDocuments({ approvalStatus: { $in: ["approved", undefined] } }),
      Product.countDocuments({ approvalStatus: "rejected" }),
      Category.countDocuments(),
      Category.countDocuments({ approvalStatus: "pending" }),
      Category.countDocuments({ approvalStatus: { $in: ["approved", undefined] } }),
      Order.countDocuments(),
      Order.find({ status: { $ne: "cancelled" } }).select("totalAmount")
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Recent items requiring admin attention
    const recentPendingProducts = await Product.find({ approvalStatus: "pending" })
      .sort({ createdAt: -1 })
      .limit(6);

    const recentPendingSellers = await Seller.find({ status: "pending" })
      .select("-password -otp")
      .sort({ createdAt: -1 })
      .limit(6);

    const recentPendingCategories = await Category.find({ approvalStatus: "pending" })
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      stats: {
        sellers: {
          total: totalSellers,
          active: activeSellers,
          pending: pendingSellers,
          disabled: disabledSellers,
        },
        products: {
          total: totalProducts,
          pending: pendingProducts,
          approved: approvedProducts,
          rejected: rejectedProducts,
        },
        categories: {
          total: totalCategories,
          pending: pendingCategories,
          approved: approvedCategories,
        },
        orders: {
          total: totalOrders,
          revenue: totalRevenue,
        },
      },
      recentPendingProducts,
      recentPendingSellers,
      recentPendingCategories,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch platform metrics",
      error: error.message,
    });
  }
};

// ==========================================
// 2. Seller Management (Accept / Enable / Disable)
// ==========================================
const getAdminSellers = async (req, res) => {
  try {
    const { status, search } = req.query;

    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { businessName: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }

    const sellers = await Seller.find(filter)
      .select("-password -otp")
      .sort({ createdAt: -1 });

    // Attach product counts for each seller
    const sellersWithCounts = await Promise.all(
      sellers.map(async (seller) => {
        const productCount = await Product.countDocuments({
          "seller.sellerId": seller._id,
        });
        const pendingProductCount = await Product.countDocuments({
          "seller.sellerId": seller._id,
          approvalStatus: "pending",
        });
        return {
          ...seller.toObject(),
          productCount,
          pendingProductCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: sellersWithCounts.length,
      sellers: sellersWithCounts,
    });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sellers list",
      error: error.message,
    });
  }
};

const updateSellerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "disabled", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'active', 'disabled', or 'pending'.",
      });
    }

    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    seller.status = status;
    // If activating seller, also mark verified
    if (status === "active") {
      seller.isVerified = true;
    }
    await seller.save();

    res.status(200).json({
      success: true,
      message: `Seller status updated to "${status}" successfully`,
      seller: {
        _id: seller._id,
        fullname: seller.fullname,
        email: seller.email,
        status: seller.status,
      },
    });
  } catch (error) {
    console.error("Error updating seller status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update seller status",
      error: error.message,
    });
  }
};

// ==========================================
// 3. Product Approvals & Admin Product Management
// ==========================================
const getAdminProducts = async (req, res) => {
  try {
    const { approvalStatus, category, search } = req.query;

    const filter = {};
    if (approvalStatus && approvalStatus !== "all") {
      filter.approvalStatus = approvalStatus;
    }

    if (category && category !== "all") {
      filter.category = { $regex: category, $options: "i" };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { "seller.name": { $regex: search, $options: "i" } },
        { "seller.email": { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching admin products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products for review",
      error: error.message,
    });
  }
};

const updateProductApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;

    if (!["approved", "rejected", "pending"].includes(approvalStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'approved', 'rejected', or 'pending'.",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.approvalStatus = approvalStatus;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${approvalStatus === "approved" ? "approved" : "rejected"} successfully`,
      product,
    });
  } catch (error) {
    console.error("Error updating product approval:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product approval status",
      error: error.message,
    });
  }
};

const createAdminProduct = async (req, res) => {
  try {
    const { name, price, category, description, stock, brand, attributes } = req.body;

    if (!name || !price || !category || !description || !stock) {
      return res.status(400).json({
        success: false,
        message: "Missing required product fields (name, price, category, description, stock)",
      });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadRes = await uploadOnCloudinary(file.path);
        if (uploadRes && uploadRes.url) {
          imageUrls.push(uploadRes.secure_url || uploadRes.url);
        }
      }
    } else if (req.body.images) {
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } else if (req.body.image) {
      imageUrls = [req.body.image];
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    const attributesObj = attributes ? (typeof attributes === "string" ? JSON.parse(attributes) : attributes) : {};

    const newProduct = new Product({
      name,
      price: Number(price),
      category,
      description,
      stock: Number(stock),
      brand: brand || "MyShop",
      attributes: attributesObj,
      images: imageUrls,
      seller: {
        name: "MyShop Official",
        email: "support@myshop.com",
        contact: "1800-MYSHOP",
      },
      approvalStatus: "approved",
      createdByRole: "admin",
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created and approved directly by Administrator!",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error in admin product creation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

const deleteAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: `Product "${product.name}" deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Failed to delete product", error: error.message });
  }
};

// ==========================================
// 4. Category Approvals & Admin Management
// ==========================================
const getAdminCategories = async (req, res) => {
  try {
    const { approvalStatus, search } = req.query;

    const filter = {};
    if (approvalStatus && approvalStatus !== "all") {
      filter.approvalStatus = approvalStatus;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({
          category: { $regex: `^${cat.name}$`, $options: "i" },
        });
        return {
          ...cat.toObject(),
          productCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount,
    });
  } catch (error) {
    console.error("Error fetching admin categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories list",
      error: error.message,
    });
  }
};

const updateCategoryApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;

    if (!["approved", "rejected", "pending"].includes(approvalStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'approved', 'rejected', or 'pending'.",
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    category.approvalStatus = approvalStatus;
    if (approvalStatus === "approved") {
      category.status = "active";
    }
    await category.save();

    res.status(200).json({
      success: true,
      message: `Category ${approvalStatus === "approved" ? "approved" : "rejected"} successfully`,
      category,
    });
  } catch (error) {
    console.error("Error updating category approval:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category approval status",
      error: error.message,
    });
  }
};

const createAdminCategory = async (req, res) => {
  try {
    const { name, description, parentCategory, image } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const trimmedName = name.trim();
    const existing = await Category.findOne({
      name: { $regex: `^${trimmedName}$`, $options: "i" },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A category with this name already exists",
      });
    }

    let imageUrl = image || "";
    if (req.file) {
      const uploadRes = await uploadOnCloudinary(req.file.path);
      if (uploadRes && uploadRes.url) {
        imageUrl = uploadRes.secure_url || uploadRes.url;
      }
    }

    const slug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newCategory = new Category({
      name: trimmedName,
      slug,
      description: description ? description.trim() : "",
      parentCategory: parentCategory || "Other",
      status: "active",
      approvalStatus: "approved",
      createdByRole: "admin",
      createdByName: "Administrator",
      image: imageUrl,
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created and approved directly by Administrator!",
      category: savedCategory,
    });
  } catch (error) {
    console.error("Error creating admin category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

const deleteAdminCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: "Failed to delete category", error: error.message });
  }
};

module.exports = {
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
};
