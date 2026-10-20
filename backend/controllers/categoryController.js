const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");
const { uploadOnCloudinary } = require("../utils/cloudinary");

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description, parentCategory, status, image } = req.body;

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

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only platform administrators are authorized to create categories.",
      });
    }

    const newCategory = new Category({
      name: trimmedName,
      slug,
      description: description ? description.trim() : "",
      parentCategory: parentCategory || "Other",
      status: status || "active",
      image: imageUrl,
      approvalStatus: "approved",
      createdByRole: "admin",
      createdByName: req.user?.fullname || "Administrator",
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created and approved successfully!",
      category: savedCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// Get all categories with optional filters
const getAllCategories = async (req, res) => {
  try {
    const { search, parentCategory, status, all, approvalStatus } = req.query;

    const filter = {};

    // For public / storefront, only show approved categories
    if (!all || all !== "true") {
      filter.approvalStatus = { $nin: ["pending", "rejected"] };
    } else if (approvalStatus && approvalStatus !== "all") {
      filter.approvalStatus = approvalStatus;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (parentCategory && parentCategory !== "all") {
      filter.parentCategory = parentCategory;
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    // Count products associated with each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({
          category: { $regex: `^${cat.name}$`, $options: "i" },
          approvalStatus: { $nin: ["pending", "rejected"] }
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
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// Get single category by ID or slug
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    let category = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(id);
    }

    if (!category) {
      category = await Category.findOne({ slug: id });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const productCount = await Product.countDocuments({
      category: { $regex: `^${category.name}$`, $options: "i" },
    });

    res.status(200).json({
      success: true,
      category: {
        ...category.toObject(),
        productCount,
      },
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only platform administrators are authorized to update categories.",
      });
    }

    const { id } = req.params;
    const { name, description, parentCategory, status, image } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (name && name.trim() !== "") {
      const trimmedName = name.trim();
      const existing = await Category.findOne({
        name: { $regex: `^${trimmedName}$`, $options: "i" },
        _id: { $ne: id },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Another category with this name already exists",
        });
      }

      category.name = trimmedName;
      category.slug = trimmedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    if (description !== undefined) {
      category.description = description.trim();
    }

    if (parentCategory) {
      category.parentCategory = parentCategory;
    }

    if (status) {
      category.status = status;
    }

    if (image !== undefined) {
      category.image = image;
    }

    if (req.file) {
      const uploadRes = await uploadOnCloudinary(req.file.path);
      if (uploadRes && uploadRes.url) {
        category.image = uploadRes.secure_url || uploadRes.url;
      }
    }

    const updatedCategory = await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only platform administrators are authorized to delete categories.",
      });
    }

    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if products exist in this category
    const associatedProducts = await Product.countDocuments({
      category: { $regex: `^${category.name}$`, $options: "i" },
    });

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted successfully`,
      associatedProducts,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

// Seed default categories matching existing products
const seedDefaultCategories = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only platform administrators can seed categories.",
      });
    }
    const defaultCategories = [
      {
        name: "Men's Shoes",
        parentCategory: "Men",
        description: "Running shoes, sneakers, boots, and formal footwear for men.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
      },
      {
        name: "Men's Clothing",
        parentCategory: "Men",
        description: "Shirts, t-shirts, jeans, trousers, and ethnic wear for men.",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop",
      },
      {
        name: "Men's Jacket",
        parentCategory: "Men",
        description: "Biker jackets, bomber jackets, track jackets, and winter coats for men.",
        image: "https://image.hm.com/assets/hm/e7/8c/e78ca4201350be6cb52ba79bc8b7143a34bd17fc.jpg?imwidth=600",
      },
      {
        name: "Men's Accessories",
        parentCategory: "Men",
        description: "Wallets, belts, sunglasses, watches, and bags for men.",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop",
      },
      {
        name: "Women's Jacket",
        parentCategory: "Women",
        description: "Puffer jackets, blazers, trench coats, and winter wear for women.",
        image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=600&auto=format&fit=crop",
      },
      {
        name: "Women's Accessories",
        parentCategory: "Women",
        description: "Totes, luxury handbags, sunglasses, jewelry, and belts for women.",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
      },
      {
        name: "Women's Clothing",
        parentCategory: "Women",
        description: "Dresses, tops, jeans, ethnic suits, and skirts for women.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
      },
      {
        name: "Boy's Clothing",
        parentCategory: "Boy",
        description: "Hoodies, t-shirts, shorts, track pants, and party wear for boys.",
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop",
      },
      {
        name: "Boy's Shoes",
        parentCategory: "Boy",
        description: "Sports shoes, school shoes, and sneakers for boys.",
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=600&auto=format&fit=crop",
      },
      {
        name: "Girl's Clothing",
        parentCategory: "Girl",
        description: "Party dresses, frocks, tops, tights, and skirts for girls.",
        image: "https://image.hm.com/assets/hm/71/09/7109587354acbd7f76926cd4d2d8182b3c30724c.jpg?imwidth=600",
      },
      {
        name: "Electronics",
        parentCategory: "Electronics",
        description: "Earbuds, gaming laptops, smartphones, headphones, and smart gadgets.",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop",
      },
    ];

    let createdCount = 0;
    for (const cat of defaultCategories) {
      const exists = await Category.findOne({
        name: { $regex: `^${cat.name}$`, $options: "i" },
      });
      if (!exists) {
        const slug = cat.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        await Category.create({ ...cat, slug, status: "active" });
        createdCount++;
      }
    }

    const allCategories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: `Seeded ${createdCount} new categories. Total: ${allCategories.length}`,
      count: allCategories.length,
      categories: allCategories,
    });
  } catch (error) {
    console.error("Error seeding categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to seed categories",
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  seedDefaultCategories,
};
