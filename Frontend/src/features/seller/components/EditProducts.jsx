/* eslint-disable react/prop-types, no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  UploadCloud,
  Trash2,
  Edit3,
  ShieldCheck,
  Check,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../../services/apiClient";
import { useSelector } from "react-redux";
import Spinner from "../../../components/ui/Spinner";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(1, "Price must be greater than 0"),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .min(0, "Stock cannot be negative"),
  brand: z.string().min(2, "Brand is required"),
  size: z.string().min(1, "Size is required"),
  material: z.string().min(2, "Material is required"),
  type: z.string().min(2, "Type is required"),
  sellerName: z.string().min(2),
  sellerEmail: z.string().email(),
  sellerContact: z.string().min(8),
  images: z.any().optional(),
});

const POPULAR_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "Free Size"];
const POPULAR_TYPES = ["Men", "Women", "Unisex", "Boy", "Girl", "Electronics", "Lifestyle"];

export function EditProducts({ product, onClose, onSuccess }) {
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState(
    product?.attributes?.size || []
  );
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
      name: product?.name || "",
      price: product?.price || "",
      category: product?.category || "",
      description: product?.description || "",
      stock: product?.stock ?? 10,
      brand: product?.brand || "",
      size: Array.isArray(product?.attributes?.size)
        ? product.attributes.size.join(", ")
        : product?.attributes?.size || "",
      material: product?.attributes?.material || "Cotton Blend",
      type: product?.attributes?.type || "Men",
      sellerName: product?.seller?.name || user?.fullname || "Verified Merchant",
      sellerEmail: product?.seller?.email || user?.email || "seller@myshop.com",
      sellerContact: product?.seller?.contact || user?.phoneNumber || "9876543210",
    },
  });

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

  const handleFiles = (incomingFiles) => {
    const validFiles = Array.from(incomingFiles).filter((file) =>
      file.type.startsWith("image/")
    );
    if (validFiles.length === 0) return;

    const updatedFiles = [...images, ...validFiles];
    setImages(updatedFiles);
    setValue("images", updatedFiles);

    const newPreviews = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
    }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveNewImage = (idx) => {
    const updatedFiles = images.filter((_, i) => i !== idx);
    setImages(updatedFiles);
    setValue("images", updatedFiles);
    if (imagePreviews[idx]?.url) {
      URL.revokeObjectURL(imagePreviews[idx].url);
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveExistingImage = (imgUrl) => {
    setExistingImages((prev) => prev.filter((u) => u !== imgUrl));
  };

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

    const attributes = {
      size: data.size
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      material: data.material,
      type: data.type,
    };

    const seller = {
      sellerId: user?._id || product?.seller?.sellerId,
      name: user?.fullname || product?.seller?.name,
      email: user?.email || product?.seller?.email,
      contact: user?.phoneNumber || product?.seller?.contact || "9876543210",
    };

    formData.append("attributes", JSON.stringify(attributes));
    formData.append("seller", JSON.stringify(seller));
    formData.append("existingImages", JSON.stringify(existingImages));

    images.forEach((img) => formData.append("images", img));

    try {
      await axiosInstance.put(`/products/update/${product._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated successfully!");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 antialiased">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-amber-50/20 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shadow-xs">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Edit Product Details
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update pricing, stock levels, variants, or photos for{" "}
              <span className="font-semibold text-slate-800">
                {product?.name || "Product"}
              </span>
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Form Content */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
      >
        {/* General Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. General Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="edit-name"
                className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
              >
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="edit-name"
                {...register("name")}
                className="w-full px-4 py-2.5 text-sm bg-white rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all focus:outline-none"
              />
              {errors.name && (
                <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="edit-category"
                className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
              >
                Category <span className="text-rose-500">*</span>
              </label>
              <input
                id="edit-category"
                list="category-edit-suggestions"
                {...register("category")}
                className="w-full px-4 py-2.5 text-sm bg-white rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all focus:outline-none"
              />
              <datalist id="category-edit-suggestions">
                {availableCategories.map((c) => (
                  <option key={c._id || c.name} value={c.name} />
                ))}
              </datalist>
              {errors.category && (
                <p className="text-xs text-rose-500 mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="edit-brand"
                className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
              >
                Brand Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="edit-brand"
                {...register("brand")}
                className="w-full px-4 py-2.5 text-sm bg-white rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all focus:outline-none"
              />
              {errors.brand && (
                <p className="text-xs text-rose-500 mt-1">{errors.brand.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Pricing &amp; Stock
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="edit-price"
                className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
              >
                Price (INR ₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                  ₹
                </span>
                <input
                  id="edit-price"
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  step="any"
                  className="w-full pl-8 pr-4 py-2.5 text-sm bg-white rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all focus:outline-none"
                />
              </div>
              {errors.price && (
                <p className="text-xs text-rose-500 mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="edit-stock"
                className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
              >
                Stock Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                id="edit-stock"
                {...register("stock", { valueAsNumber: true })}
                type="number"
                min="0"
                className="w-full px-4 py-2.5 text-sm bg-white rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all focus:outline-none"
              />
              {errors.stock && (
                <p className="text-xs text-rose-500 mt-1">{errors.stock.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="edit-type"
                className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
              >
                Department / Type <span className="text-rose-500">*</span>
              </label>
              <select
                id="edit-type"
                {...register("type")}
                className="w-full px-4 py-2.5 text-sm bg-white rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all focus:outline-none"
              >
                {POPULAR_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sizes & Material */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. Sizes &amp; Specifications
            </h3>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="edit-size"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wide"
            >
              Sizes <span className="text-rose-500">*</span>
            </label>
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
                        ? "bg-amber-600 text-white border-amber-600 shadow-xs"
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
              id="edit-size"
              {...register("size")}
              className="w-full px-4 py-2.5 text-sm bg-white rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all focus:outline-none"
            />
            {errors.size && (
              <p className="text-xs text-rose-500">{errors.size.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-material"
              className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
            >
              Material Details <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-material"
              {...register("material")}
              className="w-full px-4 py-2.5 text-sm bg-white rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all focus:outline-none"
            />
            {errors.material && (
              <p className="text-xs text-rose-500">{errors.material.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="edit-description"
            className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
          >
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="edit-description"
            rows={4}
            {...register("description")}
            className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all focus:outline-none"
          />
          {errors.description && (
            <p className="text-xs text-rose-500">{errors.description.message}</p>
          )}
        </div>

        {/* Images */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Product Images
            </h3>
            <span className="text-[11px] text-slate-400">
              {existingImages.length + images.length} total photos
            </span>
          </div>

          {/* Existing Photos */}
          {existingImages.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">Current Photos</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {existingImages.map((url, i) => (
                  <div
                    key={url}
                    className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                  >
                    <img
                      src={url}
                      alt={`Current photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(url)}
                      className="absolute top-1 right-1 p-1 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Photos Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-amber-500 bg-amber-50/50"
                : "border-slate-200 hover:border-amber-400 bg-slate-50/50"
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
            <UploadCloud className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">
              Upload additional product photos
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Click or drag &amp; drop</p>
          </div>

          {/* New Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
              {imagePreviews.map((preview, i) => (
                <div
                  key={preview.url}
                  className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                >
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(i)}
                    className="absolute top-1 right-1 p-1 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hidden inputs */}
        <input type="hidden" {...register("sellerName")} />
        <input type="hidden" {...register("sellerEmail")} />
        <input type="hidden" {...register("sellerContact")} />

        {/* Action Footer */}
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
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-semibold shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="border-white border-t-transparent" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Product Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProducts;
