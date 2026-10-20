import { Edit2, Trash2, Tag, Package, AlertCircle } from "lucide-react";

export const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <li className="p-4 sm:p-5 border border-slate-200/90 hover:border-indigo-200 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
      {/* Image & Product Info */}
      <div className="flex items-start sm:items-center gap-4 w-full md:w-3/4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
          <img
            src={product.images?.[0] || "https://placehold.co/200x200?text=No+Photo"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              {product.name}
            </h3>

            {product.approvalStatus === "approved" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live on Storefront
              </span>
            ) : product.approvalStatus === "rejected" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Rejected by Admin
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Awaiting Admin Review
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="font-extrabold text-slate-900 text-base">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {product.category}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-slate-400" />
              Stock: {product.stock}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            {product.brand && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                Brand: {product.brand}
              </span>
            )}
            {product.attributes?.material && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                {product.attributes.material}
              </span>
            )}
            {product.attributes?.type && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                {product.attributes.type}
              </span>
            )}
          </div>

          {product.approvalStatus === "rejected" && product.approvalRemarks && (
            <div className="flex items-start gap-1.5 text-xs text-rose-700 bg-rose-50 p-2 rounded-xl border border-rose-200 mt-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div>
                <strong className="font-semibold">Reviewer Note:</strong>{" "}
                {product.approvalRemarks}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
        <button
          type="button"
          onClick={() => onEdit(product._id)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Edit</span>
        </button>
        <button
          type="button"
          onClick={() => onDelete(product._id)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          <span>Delete</span>
        </button>
      </div>
    </li>
  );
};

export default ProductCard;