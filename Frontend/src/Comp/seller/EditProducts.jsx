import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { X } from "lucide-react";

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

const EditProducts = ({ product, onClose }) => {
  const [images, setImages] = useState([]);

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
      sellerId: product.seller?.sellerId,
      name: data.sellerName,
      email: data.sellerEmail,
      contact: data.sellerContact,
    };

    formData.append("attributes", JSON.stringify(attributes));
    formData.append("seller", JSON.stringify(seller));

    images.forEach((img) => formData.append("images", img));

    try {
      const res = await axios.put(
        `http://localhost:5000/api/v1/products/update/${product._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Product updated successfully!");
      onClose(); // close modal
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg w-full bg-white text-black p-4 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          <X className="w-6 h-6" />
        </button>
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
        ].map(({ name, type, placeholder }) => (
          <div key={name} className="mb-3">
            {type === "textarea" ? (
              <textarea
                {...register(name)}
                placeholder={placeholder}
                className="w-full p-2 border rounded"
              />
            ) : (
              <input
                {...register(name, { valueAsNumber: type === "number" })}
                type={type}
                placeholder={placeholder}
                className="w-full p-2 border rounded"
              />
            )}
            {errors[name] && <p className="text-red-500 text-sm">{errors[name]?.message}</p>}
          </div>
        ))}

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border mb-3"
        />
        {errors.images && <p className="text-red-500">{errors.images.message}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProducts;
