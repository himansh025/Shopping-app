import React from "react";

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <li
      className="p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      {/* Image & Info */}
      <div className="flex gap-4 items-center w-full md:w-2/3">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-24 h-24 object-cover rounded-lg border"
        />
        <div className="space-y-1">
          <p className="text-lg font-semibold text-gray-800">{product.name}</p>
          <p className="text-sm text-gray-600">INR {product.price}</p>
          <p className="text-sm text-gray-600">Category: {product.category}</p>
          <p className="text-sm text-gray-600">Stock: {product.stock}</p>
          <p className="text-sm text-gray-600">Brand: {product.brand}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 md:gap-3">
        <button
          onClick={() => onEdit(product._id)}
          className="px-4 py-1 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="px-4 py-1 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default ProductCard;