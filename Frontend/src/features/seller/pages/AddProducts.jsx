/* eslint-disable react/prop-types, no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  PackagePlus,
  ShieldCheck,
  Sparkles,
  Info,
  Check,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../../services/apiClient";
import { useSelector } from "react-redux";
import Spinner from "../../../components/ui/Spinner";

// Zod Schema Validation
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  price: z
    .number({ invalid_type_error: "Price must be a valid number" })
    .min(1, "Price must be at least ₹1"),
  category: z.string().min(2, "Please select or enter a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .min(0, "Stock cannot be negative"),
  brand: z.string().min(2, "Brand name is required"),
  size: z.string().min(1, "At least one size is required"),
  material: z.string().min(2, "Material or fabric details are required"),
  type: z.string().min(2, "Product department/type is required"),
  sellerName: z.string().min(2, "Seller name is required"),
  sellerEmail: z.string().email("Invalid email address"),
  sellerContact: z.string().min(8, "Contact number is required"),
  images: z
    .any()
    .refine((files) => files && files.length > 0, "At least one product image is required"),
});

const POPULAR_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "Free Size"];
const POPULAR_TYPES = ["Men", "Women", "Unisex", "Boy", "Girl", "Electronics", "Lifestyle"];

export function AddProducts({ onClose, onSuccess }) {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const fileInputRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
      category: "",
      description: "",
      stock: 10,
      brand: "",
      size: "",
      material: "Cotton Blend",
      type: "Men",
      sellerName: user?.fullname || user?.username || "Verified Merchant",
      sellerEmail: user?.email || "seller@myshop.com",
      sellerContact: user?.phoneNumber || "9876543210",
    },
  });

  const currentCategory = watch("category");
  const currentType = watch("type");

  // Fetch all categories for auto-suggestions
  useEffect(() => {
    axiosInstance
      .get("/category/all?all=true")
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.categories)) {
          setAvailableCategories(res.data.categories);
        }
      })
      .catch((err) => console.error("Could not fetch categories:", err));
  }, []);

  // Sync user info into form state
  useEffect(() => {
    if (user) {
      setValue("sellerName", user.fullname || user.username || "Verified Merchant");
      setValue("sellerEmail", user.email || "");
      setValue("sellerContact", user.phoneNumber || "9876543210");
    }
  }, [user, setValue]);

  // Handle image files selection and previews
  const handleFiles = (incomingFiles) => {
    const validFiles = Array.from(incomingFiles).filter((file) =>
      file.type.startsWith("image/")
    );
    if (validFiles.length === 0) return;

    const updatedFiles = [...images, ...validFiles];
    setImages(updatedFiles);
    setValue("images", updatedFiles, { shouldValidate: true });

    // Generate object URLs for immediate preview
    const newPreviews = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
    }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedFiles = images.filter((_, i) => i !== indexToRemove);
    setImages(updatedFiles);
    setValue("images", updatedFiles, { shouldValidate: true });

    // Revoke old URL to prevent memory leaks
    if (imagePreviews[indexToRemove]?.url) {
      URL.revokeObjectURL(imagePreviews[indexToRemove].url);
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // Toggle size chips
  const handleSizeToggle = (size) => {
    let nextSizes;
    if (selectedSizes.includes(size)) {
      nextSizes = selectedSizes.filter((s) => s !== size);
    } else {
      nextSizes = [...selectedSizes, size];
    }
    setSelectedSizes(nextSizes);
    setValue("size", nextSizes.join(", "), { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("stock", data.stock);
    formData.append("brand", data.brand);

    const attributeData = {
      size: data.size
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      material: data.material,
      type: data.type,
    };

    const sellerData = {
      sellerId: user?._id,
      name: user?.fullname || user?.username || "Verified Merchant",
      email: user?.email,
      contact: user?.phoneNumber || "9876543210",
    };

    formData.append("attributes", JSON.stringify(attributeData));
    formData.append("seller", JSON.stringify(sellerData));

    images.forEach((image) => formData.append("images", image));

    try {
      await axiosInstance.post(`/products/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        "Product uploaded successfully! Submitted for Admin review before going live."
      );
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error uploading product:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload product. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 antialiased">
      {/* Modal / Card Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-indigo-50/30 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-600 flex items-center justify-center shadow-xs">
            <PackagePlus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Add New Product
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Admin Moderated
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              List a new item in your catalog. Products undergo review before going live on the storefront.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scrollable Form Body */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
      >
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. General Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
              >
                Product Title / Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="name"
                {...register("name")}
                placeholder="e.g. Slim-Fit Stretch Denim Jacket"
                className={`w-full px-4 py-2.5 text-sm bg-white rounded-xl border transition-all placeholder:text-slate-400 focus:outline-none focus:ring-4 ${
                  errors.name
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-indigo-600 focus:ring-indigo-500/10"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Category with Dropdown Suggestions */}
            <div>
              <label
                htmlFor="category"
                className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
              >
                Category <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="category"
                  list="category-suggestions"
                  {...register("category")}
                  placeholder="Select or enter category..."
                  className={`w-full px-4 py-2.5 text-sm bg-white rounded-xl border transition-all placeholder:text-slate-400 focus:outline-none focus:ring-4 ${
                    errors.category
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                      : "border-slate-200 focus:border-indigo-600 focus:ring-indigo-500/10"
                  }`}
                />
                <datalist id="category-suggestions">
                  {availableCategories.map((c) => (
                    <option key={c._id || c.name} value={c.name}>
                      {c.name} ({c.parentCategory})
                    </option>
                  ))}
                </datalist>
              </div>
              {errors.category && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label
                htmlFor="brand"
                className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
              >
                Brand Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="brand"
                {...register("brand")}
                placeholder="e.g. Nike, Zara, Apple, MyBrand"
                className={`w-full px-4 py-2.5 text-sm bg-white rounded-xl border transition-all placeholder:text-slate-400 focus:outline-none focus:ring-4 ${
                  errors.brand
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-indigo-600 focus:ring-indigo-500/10"
                }`}
              />
              {errors.brand && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {errors.brand.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Stock Inventory */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Pricing &amp; Inventory
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
              >
                Price (INR ₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                  ₹
                </span>
                <input
                  id="price"
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  min="1"
                  step="any"
                  placeholder="1499"
                  className={`w-full pl-8 pr-4 py-2.5 text-sm bg-white rounded-xl border transition-all placeholder:text-slate-400 focus:outline-none focus:ring-4 ${
                    errors.price
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                      : "border-slate-200 focus:border-indigo-600 focus:ring-indigo-500/10"
                  }`}
                />
              </div>
              {errors.price && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Stock Quantity */}
            <div>
              <label
                htmlFor="stock"
                className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
              >
                Stock Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                id="stock"
                {...register("stock", { valueAsNumber: true })}
                type="number"
                min="0"
                placeholder="25"
                className={`w-full px-4 py-2.5 text-sm bg-white rounded-xl border transition-all placeholder:text-slate-400 focus:outline-none focus:ring-4 ${
                  errors.stock
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-indigo-600 focus:ring-indigo-500/10"
                }`}
              />
              {errors.stock && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {errors.stock.message}
                </p>
              )}
            </div>

            {/* Department / Type */}
            <div>
              <label
                htmlFor="type"
                className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
              >
                Target Department <span className="text-rose-500">*</span>
              </label>
              <select
                id="type"
                {...register("type")}
                className="w-full px-4 py-2.5 text-sm bg-white rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all focus:outline-none text-slate-800"
              >
                {POPULAR_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Specifications & Variants */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. Attributes &amp; Specifications
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sizes with Quick Preset Chips */}
            <div className="md:col-span-2 space-y-2">
              <label
                htmlFor="size"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wide"
              >
                Available Sizes (comma-separated or select chips){" "}
                <span className="text-rose-500">*</span>
              </label>

              {/* Quick Select Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {POPULAR_SIZES.map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleSizeToggle(sz)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs scale-105"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                      {sz}
                    </button>
                  );
                })}
              </div>

              <input
                id="size"
                {...register("size")}
                placeholder="e.g. S, M, L, XL or UK 8, UK 9, UK 10"
                className={`w-full px-4 py-2.5 text-sm bg-white rounded-xl border transition-all placeholder:text-slate-400 focus:outline-none focus:ring-4 ${
                  errors.size
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-indigo-600 focus:ring-indigo-500/10"
                }`}
              />
              {errors.size && (
                <p className="text-xs text-rose-500 font-medium">
                  {errors.size.message}
                </p>
              )}
            </div>

            {/* Material */}
            <div className="md:col-span-2">
              <label
                htmlFor="material"
                className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
              >
                Material / Composition <span className="text-rose-500">*</span>
              </label>
              <input
                id="material"
                {...register("material")}
                placeholder="e.g. 100% Organic Cotton, Stainless Steel, Genuine Leather"
                className={`w-full px-4 py-2.5 text-sm bg-white rounded-xl border transition-all placeholder:text-slate-400 focus:outline-none focus:ring-4 ${
                  errors.material
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-indigo-600 focus:ring-indigo-500/10"
                }`}
              />
              {errors.material && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {errors.material.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Product Description */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4. Product Description
            </h3>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
            >
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              {...register("description")}
              placeholder="Highlight key features, craftsmanship, fit tips, care instructions, and what makes this item unique..."
              className={`w-full px-4 py-3 text-sm bg-white rounded-xl border transition-all placeholder:text-slate-400 focus:outline-none focus:ring-4 ${
                errors.description
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                  : "border-slate-200 focus:border-indigo-600 focus:ring-indigo-500/10"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1 font-medium">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {/* Section 5: Media & Image Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                5. High-Resolution Product Images
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {images.length} file{images.length === 1 ? "" : "s"} selected
            </span>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files) {
                handleFiles(e.dataTransfer.files);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-indigo-600 bg-indigo-50/60 scale-[1.01]"
                : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/80 bg-slate-50/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Drag &amp; drop product photos, or{" "}
              <span className="text-indigo-600 underline">browse files</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports PNG, JPG, WEBP up to 10MB each. First photo will be your primary storefront cover.
            </p>
          </div>

          {errors.images && (
            <p className="text-xs text-rose-500 font-medium">
              {errors.images.message}
            </p>
          )}

          {/* Image Previews Grid */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
              {imagePreviews.map((preview, index) => (
                <div
                  key={preview.url}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs"
                >
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {index === 0 && (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-600 text-white shadow-xs">
                      ★ Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors opacity-90 hover:opacity-100 shadow-xs"
                    title="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 text-white">
                    <p className="text-[10px] truncate">{preview.name}</p>
                    <p className="text-[9px] text-slate-300">{preview.size} MB</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 6: Verified Seller Identity Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                Listing as: {user?.fullname || user?.username || "Verified Merchant"}
              </p>
              <p className="text-slate-500">
                {user?.email} • {user?.phoneNumber || "Contact on file"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 font-semibold text-[11px] shrink-0 self-start sm:self-auto">
            <span>● Verified Direct Seller</span>
          </div>
        </div>

        {/* Hidden inputs to guarantee schema validation passes */}
        <input type="hidden" {...register("sellerName")} />
        <input type="hidden" {...register("sellerEmail")} />
        <input type="hidden" {...register("sellerContact")} />

        {/* Action Buttons Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sticky bottom-0 bg-white/95 backdrop-blur-xs py-3 -mx-6 px-6">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="border-white border-t-transparent" />
                <span>Submitting for Review...</span>
              </>
            ) : (
              <>
                <PackagePlus className="w-4 h-4" />
                <span>Submit Product for Review</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProducts;
