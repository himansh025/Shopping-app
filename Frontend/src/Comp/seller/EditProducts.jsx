import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import axiosInstance from "../../Config/apiConfig";
import { useSelector } from "react-redux";

const productSchema = z.object({
  name: z.string().min(3),
  price: z.number().min(1),
  category: z.string().min(3),
  description: z.string().min(10),
  stock: z.number().min(0),
  brand: z.string().min(2),
  size: z.string().min(1),
  material: z.string().min(3),
  type: z.string().min(3),
  sellerName: z.string().min(3),
  sellerEmail: z.string().email(),
  sellerContact: z.string().min(10),
  images: z.any().optional()
});

const categoryOptions = ["Clothing", "Electronics", "Footwear", "Accessories"];
const typeOptions = ["Men", "Women", "Kids", "Unisex"];

const EditProducts = ({ product, onClose }) => {
  const [images, setImages] = useState([]);
  const { user } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      stock: product.stock,
      brand: product.brand,
      size: product.attributes?.size?.join(","),
      material: product.attributes?.material,
      type: product.attributes?.type,
      sellerName: product.seller?.name,
      sellerEmail: product.seller?.email,
      sellerContact: product.seller?.contact,
    }
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setValue("images", files);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("stock", data.stock);
    formData.append("brand", data.brand);

    const attributes = {
      size: data.size.split(",").map((s) => s.trim()),
      material: data.material,
      type: data.type,
    };
    const seller = {
      sellerId: user?._id,
      name: user?.fullname,
      email: user?.email,
      contact: user?.phoneNumber,
    };

    formData.append("attributes", JSON.stringify(attributes));
    formData.append("seller", JSON.stringify(seller));

    images.forEach((img) => formData.append("images", img));

    try {
      const res = await axiosInstance.put(`/products/update/${product._id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      console.log(res.data)
      alert("Product updated successfully!");
      onClose(); // close modal
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg h-auto bg-white text-black mx-auto p-4  shadow-lg rounded-lg "
    >
      <div className="flex relative justify-center items-center mb-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-3 text-gray-500 hover:text-red-500"
        >
          <X className="w-6 h-6 fixed text-black" />
        </button>
      </div>
      <h2 className="text-xl font-bold text-center mb-4">Edit Product</h2>

      {[
        { name: "name", type: "text", placeholder: "Product Name" },
        { name: "price", type: "number", placeholder: "Price" },
        { name: "category", type: "text", placeholder: "Category" },
        { name: "description", type: "textarea", placeholder: "Description" },
        { name: "stock", type: "number", placeholder: "Stock" },
        { name: "brand", type: "text", placeholder: "Brand" },
        { name: "size", type: "text", placeholder: "Sizes (comma-separated)" },
        { name: "material", type: "text", placeholder: "Material" },
        { name: "type", type: "text", placeholder: "Type" },
        { name: "sellerName", type: "text", placeholder: "Seller Name" },
        { name: "sellerEmail", type: "email", placeholder: "Seller Email" },
        { name: "sellerContact", type: "text", placeholder: "Seller Contact" },
      ].map(({ name, type, placeholder }) => {
        const isReadOnly = ["sellerName", "sellerEmail", "sellerContact"].includes(name);
        const value =
          name === "sellerName"
            ? user?.fullname
            : name === "sellerEmail"
              ? user?.email
              : name === "sellerContact"
                ? user?.phoneNumber
                : undefined;

        return (
          <div key={name} className="mb-3">
            <label htmlFor={name} className="block font-medium mb-1">
              {placeholder}
            </label>
            {type === "textarea" ? (
              <textarea
                id={name}
                {...register(name)}
                placeholder={placeholder}
                className="w-full p-2 border rounded"
              />
            ) : name === "category" ? (
              <select
                
                id={name}
                {...register(name)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat+1} value={cat}>{cat}</option>
                ))}
              </select>
            ) : name === "type" ? (
              <select
                id={name}
                {...register(name)}
                className="w-full p-2 border rounded"
                placeholder="Select Type"

              >
                <option value="">Select Type</option>
                {typeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            ) : (
              <>
                <input
                  id={name}
                  type={type}
                  placeholder={placeholder}
                  className={`w-full p-2 border rounded ${isReadOnly ? "bg-gray-100" : ""}`}
                  readOnly={isReadOnly}
                  value={value !== undefined ? value : undefined}
                  tabIndex={isReadOnly ? -1 : 0}
                  {...(!isReadOnly && register(name, { valueAsNumber: type === "number" }))}
                />
                {isReadOnly && (
                  <input type="hidden" {...register(name)} value={value} />
                )}
              </>
            )}
            {errors[name] && <p className="text-red-500 text-sm">{errors[name]?.message}</p>}
          </div>
        );
      })}

      <div className="mb-3">
        <label htmlFor="images" className="block font-medium mb-1">
          Upload Images
        </label>
        <input
          id="images"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border"
        />
        {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Update Product
      </button>
    </form>
  );
};
export default EditProducts;
