/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ArrowLeftRight, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';
import axiosInstance from '../Config/apiConfig';

/**
 * Standardized Customer Product Card
 * - Displays: Image, Category badge, Title, Price, Add to Cart button
 * - Quick Actions: Wishlist toggle, Compare button
 * - Excludes: Description, Seller info, Brand/Material, Sizes (moved to Detail page per requirements)
 */
export function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const wishlist = useSelector((state) => state.wishlist || []);

  const [isCompared, setIsCompared] = useState(false);

  if (!product) return null;

  const productId = product._id || product.id;
  const isWishlisted = wishlist.some(
    (item) => item._id === productId || item.id === productId
  );

  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : typeof product.images === 'string'
      ? product.images
      : '/placeholder.jpg';

  const handleNavigateDetail = () => {
    navigate(`/item-detail/${productId}`);
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();

    // Guest fallback
    if (!user) {
      if (isWishlisted) {
        dispatch(removeFromWishlist(productId));
        toast.info(`Removed ${product.name} from wishlist`);
      } else {
        dispatch(addToWishlist(product));
        toast.success(`Added ${product.name} to wishlist`);
      }
      return;
    }

    try {
      if (isWishlisted) {
        await axiosInstance.put(`/products/wishlist/${productId}`);
        dispatch(removeFromWishlist(productId));
        toast.info(`Removed ${product.name} from wishlist`);
      } else {
        await axiosInstance.put(`/products/wishlist/${productId}`);
        dispatch(addToWishlist(product));
        toast.success(`Added ${product.name} to wishlist`);
      }
    } catch (err) {
      console.error('Wishlist error:', err);
      toast.error('Failed to update wishlist');
    }
  };

  const handleToggleCompare = (e) => {
    e.stopPropagation();
    if (isCompared) {
      setIsCompared(false);
      toast.info(`Removed ${product.name} from compare list`);
    } else {
      setIsCompared(true);
      toast.success(`Added ${product.name} to compare list`);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    navigate(`/addToCart/${productId}`);
  };

  return (
    <div
      onClick={handleNavigateDetail}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Product Image & Top Floating Badges */}
      <div className="relative h-60 sm:h-64 w-full bg-slate-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Category Pill (Top Left) */}
        {product.category && (
          <span className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 shadow-xs">
            {product.category}
          </span>
        )}

        {/* Floating Quick Action Buttons (Top Right) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-sm hover:bg-white text-slate-600 hover:text-rose-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? 'text-rose-500 fill-rose-500' : ''
              }`}
            />
          </button>

          {/* Compare Button */}
          <button
            type="button"
            onClick={handleToggleCompare}
            aria-label={isCompared ? 'Remove from compare' : 'Add to compare'}
            className={`p-2 rounded-full backdrop-blur-xs shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              isCompared
                ? 'bg-blue-600 text-white shadow-blue-600/30'
                : 'bg-white/90 hover:bg-white text-slate-600 hover:text-blue-600'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Product Title */}
          <h3
            title={product.name}
            className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.stock !== undefined && (
              <span
                className={`text-[11px] font-medium ${
                  product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart CTA */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-4 w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-600/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
