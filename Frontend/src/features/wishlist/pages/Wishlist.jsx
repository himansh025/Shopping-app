import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight, Zap } from "lucide-react";
import { removeFromWishlist } from "../../../store/slices/wishlistSlice";
import { addToCart } from "../../../store/slices/cartSlice";
import axiosInstance from "../../../services/apiClient";
import { toast } from "react-toastify";

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="%23f1f5f9"><rect width="300" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="14" font-family="sans-serif">No Image Available</text></svg>';

export function Wishlist() {
  const wishlist = useSelector((state) => state.wishlist || []);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = async (item) => {
    const id = (item._id || item.id || '').toString();
    dispatch(removeFromWishlist(id));
    toast.info("Removed from wishlist");

    if (user?.role === "user") {
      try {
        await axiosInstance.put(`/products/wishlist/${id}`);
      } catch (err) {
        console.error("Failed to remove from server wishlist:", err);
      }
    }
  };

  const handleMoveToCart = async (item) => {
    const id = (item._id || item.id || '').toString();
    dispatch(addToCart({ ...item, quantity: 1 }));
    toast.success("Added to shopping cart!");

    if (user?.role === "user") {
      try {
        await axiosInstance.post("/cart/add", {
          productId: id,
          quantity: 1,
          size: "",
        });
      } catch (err) {
        console.error("Failed to sync cart add:", err);
      }
    }
  };

  const handleBuyNow = (item) => {
    const id = (item._id || item.id || '').toString();
    navigate(`/checkout?buyNow=${id}`);
  };

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center shadow-inner">
          <Heart className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Your Wishlist is Empty
        </h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
          Save your favorite styles and electronics here to track their availability or purchase them anytime.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Saved Wishlist</span>
            <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Items saved for later consideration.
          </p>
        </div>

        <Link
          to="/"
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline flex items-center gap-1"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => {
          const id = (item._id || item.id || '').toString();
          const imgSrc = Array.isArray(item.images)
            ? item.images[0]
            : (item.images || FALLBACK_IMAGE);
          const price = parseFloat(item.price) || 0;
          const isOutOfStock = typeof item.stock === 'number' && item.stock <= 0;

          return (
            <div
              key={id}
              className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
                <img
                  src={imgSrc}
                  alt={item.name}
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Remove from wishlist button */}
                <button
                  type="button"
                  aria-label="Remove from wishlist"
                  onClick={() => handleRemove(item)}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-500 hover:text-rose-600 rounded-full shadow-sm backdrop-blur-xs transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Out of Stock Pill */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4 flex flex-col flex-1">
                {item.brand && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    {item.brand}
                  </span>
                )}
                <Link
                  to={`/item-detail/${id}`}
                  className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2"
                >
                  {item.name}
                </Link>

                <div className="mt-auto pt-2 flex items-baseline justify-between border-t border-slate-100">
                  <span className="text-base font-bold text-slate-900">
                    ₹{price.toFixed(2)}
                  </span>
                  {item.category && (
                    <span className="text-xs text-slate-400 capitalize">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => handleMoveToCart(item)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => handleBuyNow(item)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-xs transition"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Wishlist;
