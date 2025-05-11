import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import axiosInstance from "../../Config/apiConfig";
import { useSelector } from "react-redux";

// ✅ Define Schema Validation
const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  price: z.number().min(1, "Price must be greater than 0"),
  category: z.string().min(3, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  stock: z.number().min(0, "Stock cannot be negative"),
  brand: z.string().min(2, "Brand is required"),
  size: z.string().min(1, "Size is required"), // Comma-separated
  material: z.string().min(3, "Material is required"),
  type: z.string().min(3, "Type is required"),
  sellerName: z.string().min(3, "Seller name is required"),
  sellerEmail: z.string().email("Invalid email"),
  sellerContact: z.string().min(10, "Contact must be at least 10 digits"),
  images: z
    .any()
    .refine((files) => files?.length > 0, "At least one image is required"),
});

const AddProducts = ({ onClose }) => {
  const [images, setImages] = useState([]);
  const {user}= useSelector((state)=>state.auth)
  console.log(user)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setValue("images", files);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append text fields
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("stock", data.stock);
    formData.append("brand", data.brand);

    // Create attributes object
    const attributeData = {
      size: data.size.split(","),
      material: data.material,
      type: data.type,
    };

    // Create seller object
    const sellerData = {
      sellerId: user?._id,
      name: user.fullname,
      email: user.email,
      contact: user.phoneNumber,
    };

    console.log("haan",sellerData)
    // Append objects as stringified JSON
    formData.append("attributes", JSON.stringify(attributeData));
    formData.append("seller", JSON.stringify(sellerData));

    // Append images
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await axiosInstance.post(`/products/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      onClose()
      // console.log("Product uploaded:", response.data);
      alert("Product uploaded successfully!");
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("Failed to upload product: " + (error.response?.data?.message || error.message));
    }
  };

  return (
  <form
  onSubmit={handleSubmit(onSubmit)}
  className="max-w-lg bg-white text-black mx-auto p-3 shadow-lg rounded-lg"
>
  <div className="flex relative justify-center items-center mb-4">
    <button
      type="button"
      className="absolute top-0 right-3 text-gray-500 hover:text-red-500"
      onClick={onClose}
    >
      <X className="h-8 w-8 fixed text-black" />
    </button>
    <h2 className="text-xl font-bold">Upload Product</h2>
  </div>

  {/* Product Name */}
  <label htmlFor="name" className="block font-medium mb-1">Product Name</label>
  <input
    id="name"
    {...register("name")}
    placeholder="Product Name"
    className="w-full p-2 border mb-3"
  />
  {errors.name && <p className="text-red-500">{errors.name.message}</p>}

  {/* Price */}
  <label htmlFor="price" className="block font-medium mb-1">Price</label>
  <input
    id="price"
    {...register("price", { valueAsNumber: true })}
    type="number"
    placeholder="Price"
    className="w-full p-2 border mb-3"
  />
  {errors.price && <p className="text-red-500">{errors.price.message}</p>}

  {/* Category */}
  <label htmlFor="category" className="block font-medium mb-1">Category</label>
  <input
    id="category"
    {...register("category")}
    placeholder="Category"
    className="w-full p-2 border mb-3"
  />
  {errors.category && <p className="text-red-500">{errors.category.message}</p>}

  {/* Description */}
  <label htmlFor="description" className="block font-medium mb-1">Description</label>
  <textarea
    id="description"
    {...register("description")}
    placeholder="Description"
    className="w-full p-2 border mb-3"
  />
  {errors.description && <p className="text-red-500">{errors.description.message}</p>}

  {/* Stock */}
  <label htmlFor="stock" className="block font-medium mb-1">Stock Quantity</label>
  <input
    id="stock"
    {...register("stock", { valueAsNumber: true })}
    type="number"
    placeholder="Stock Quantity"
    className="w-full p-2 border mb-3"
  />
  {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}

  {/* Brand */}
  <label htmlFor="brand" className="block font-medium mb-1">Brand</label>
  <input
    id="brand"
    {...register("brand")}
    placeholder="Brand"
    className="w-full p-2 border mb-3"
  />
  {errors.brand && <p className="text-red-500">{errors.brand.message}</p>}

  {/* Size */}
  <label htmlFor="size" className="block font-medium mb-1">Sizes (comma-separated)</label>
  <input
    id="size"
    {...register("size")}
    placeholder="Sizes (comma-separated)"
    className="w-full p-2 border mb-3"
  />
  {errors.size && <p className="text-red-500">{errors.size.message}</p>}

  {/* Material */}
  <label htmlFor="material" className="block font-medium mb-1">Material</label>
  <input
    id="material"
    {...register("material")}
    placeholder="Material"
    className="w-full p-2 border mb-3"
  />
  {errors.material && <p className="text-red-500">{errors.material.message}</p>}

  {/* Type */}
  <label htmlFor="type" className="block font-medium mb-1">Type</label>
  <input
    id="type"
    {...register("type")}
    placeholder="Type"
    className="w-full p-2 border mb-3"
  />
  {errors.type && <p className="text-red-500">{errors.type.message}</p>}

  {/* Seller Name */}
  <label className="block font-medium mb-1">Seller Name</label>
  <input
    value={user?.fullname}
    readOnly
    className="w-full p-2 border mb-3 bg-gray-100 text-gray-700"
  />
  <input
    type="hidden"
    {...register("sellerName")}
    value={user?.fullname}
  />
  {errors.sellerName && <p className="text-red-500">{errors.sellerName.message}</p>}

  {/* Seller Email */}
  <label className="block font-medium mb-1">Seller Email</label>
  <input
    type="email"
    value={user?.email}
    readOnly
    className="w-full p-2 border mb-3 bg-gray-100 text-gray-700"
  />
  <input
    type="hidden"
    {...register("sellerEmail")}
    value={user?.email}
  />
  {errors.sellerEmail && <p className="text-red-500">{errors.sellerEmail.message}</p>}

  {/* Seller Contact */}
  <label className="block font-medium mb-1">Seller Contact</label>
  <input
    value={user?.phoneNumber}
    readOnly
    className="w-full p-2 border mb-3 bg-gray-100 text-gray-700"
  />
  <input
    type="hidden"
    {...register("sellerContact")}
    value={user?.phoneNumber}
  />
  {errors.sellerContact && <p className="text-red-500">{errors.sellerContact.message}</p>}

  {/* Image Upload */}
  <label htmlFor="images" className="block font-medium mb-1">Product Images</label>
  <input
    id="images"
    type="file"
    multiple
    accept="image/*"
    onChange={handleImageChange}
    className="w-full p-2 border mb-3"
  />
  {errors.images && <p className="text-red-500">{errors.images.message}</p>}

  {/* Submit */}
  <button
    type="submit"
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    Upload Product
  </button>
</form>


  );
};

export default AddProducts;
