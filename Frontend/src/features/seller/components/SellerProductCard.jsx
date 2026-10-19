/* eslint-disable react/prop-types */


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
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-lg font-semibold text-gray-800">{product.name}</p>
            {product.approvalStatus === 'approved' ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                ● Live on Store
              </span>
            ) : product.approvalStatus === 'rejected' ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                ● Rejected by Admin
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                ⏳ Awaiting Admin Approval
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">INR {product.price}</p>
          <p className="text-sm text-gray-600">Category: {product.category}</p>
          <p className="text-sm text-gray-600">Stock: {product.stock}</p>
          <p className="text-sm text-gray-600">Brand: {product.brand}</p>
          {product.approvalStatus === 'rejected' && product.approvalRemarks && (
            <p className="text-xs text-rose-600 bg-rose-50 p-1.5 rounded border border-rose-100">
              <strong>Admin Remark:</strong> {product.approvalRemarks}
            </p>
          )}
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