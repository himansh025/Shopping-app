/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Heart,
  ShoppingCart,
  Zap,
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Minus,
  Plus,
  ArrowLeft,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { addToWishlist, removeFromWishlist } from '../../../store/slices/wishlistSlice';
import { addToCart } from '../../../store/slices/cartSlice';
import axiosInstance from '../../../services/apiClient';
import ProductCard from '../components/ProductCard';
import Skeleton from '../../../components/ui/Skeleton';
import EmptyState from '../../../components/ui/EmptyState';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f1f5f9'/%3E%3Cpath d='M240 270a30 30 0 1 0 0-60 30 30 0 0 0 0 60zm180 150H180l75-100 50 65 70-90 45 60v65z' fill='%2394a3b8'/%3E%3Ctext x='50%25' y='82%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-family='sans-serif' font-size='20' font-weight='500'%3ENo Image Available%3C/text%3E%3C/svg%3E";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const wishlist = useSelector((state) => state.wishlist || []);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Variant & purchase state
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Direct product fetch or Redux lookup
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let isMounted = true;

    const resolveProduct = async () => {
      setLoading(true);
      setFetchError(null);

      // Check if product is already in Redux items
      const existing = items?.find((it) => it._id === id || it.id === id);
      if (existing) {
        if (isMounted) {
          setProduct(existing);
          setLoading(false);
          initProductOptions(existing);
        }
        return;
      }

      // If not in Redux (direct link or refresh), fetch from API
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        if (isMounted) {
          const fetchedProd = res.data?.product || res.data;
          if (fetchedProd) {
            setProduct(fetchedProd);
            initProductOptions(fetchedProd);
          } else {
            setFetchError('Product details are currently unavailable.');
          }
        }
      } catch (err) {
        console.error('Failed to fetch single product:', err);
        if (isMounted) {
          setFetchError(
            err.response?.status === 404
              ? 'This product could not be found or has been removed.'
              : 'Failed to load product details. Please try again.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const initProductOptions = (prod) => {
      const rawSizes = prod.size || prod.attributes?.size;
      const parsedSizes = Array.isArray(rawSizes)
        ? rawSizes
        : typeof rawSizes === 'string'
        ? rawSizes.split(',').map((s) => s.trim())
        : [];
      if (parsedSizes.length > 0) {
        setSelectedSize(parsedSizes[0]);
      }
      setQuantity(1);
      setActiveImageIndex(0);
    };

    resolveProduct();

    return () => {
      isMounted = false;
    };
  }, [id, items]);

  const isWishlisted = useMemo(() => {
    if (!product) return false;
    const pId = product._id || product.id;
    return wishlist.some((item) => (item._id || item.id) === pId);
  }, [product, wishlist]);

  const handleToggleWishlist = async () => {
    if (!product) return;
    const pId = product._id || product.id;

    if (!user) {
      if (isWishlisted) {
        dispatch(removeFromWishlist(pId));
        toast.info(`Removed "${product.name}" from wishlist`);
      } else {
        dispatch(addToWishlist(product));
        toast.success(`Saved "${product.name}" to wishlist`);
      }
      return;
    }

    try {
      if (isWishlisted) {
        await axiosInstance.put(`/products/wishlist/${pId}`);
        dispatch(removeFromWishlist(pId));
        toast.info(`Removed "${product.name}" from wishlist`);
      } else {
        await axiosInstance.put(`/products/wishlist/${pId}`);
        dispatch(addToWishlist(product));
        toast.success(`Saved "${product.name}" to wishlist`);
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = async () => {
    if (!product || isOutOfStock) return;
    setIsAddingToCart(true);

    const cartPayload = {
      ...product,
      selectedSize,
      quantity,
    };

    try {
      if (!user) {
        dispatch(addToCart(cartPayload));
        toast.success(`Added ${quantity} × "${product.name}" to cart`);
      } else {
        try {
          await axiosInstance.post('/cart/add', {
            productId: product._id || product.id,
            quantity,
            size: selectedSize || '',
          });
        } catch {
          // Fallback to legacy route if any issue
          await axiosInstance.post(`/products/productCart/${product._id || product.id}`, {
            quantity,
            selectedSize,
          });
        }
        dispatch(addToCart(cartPayload));
        toast.success(`Added ${quantity} × "${product.name}" to cart`);
      }
    } catch (err) {
      console.error('Add to cart failed:', err);
      dispatch(addToCart(cartPayload));
      toast.success(`Added ${quantity} × "${product.name}" to cart`);
    } finally {
      setTimeout(() => setIsAddingToCart(false), 500);
    }
  };

  const handleBuyNow = () => {
    if (!product || isOutOfStock) return;
    navigate(`/checkout?buyNow=${product._id || product.id}`);
  };

  // Image list parsing
  const imageList = useMemo(() => {
    if (!product) return [FALLBACK_IMAGE];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    if (typeof product.images === 'string' && product.images.trim()) {
      return [product.images];
    }
    return [FALLBACK_IMAGE];
  }, [product]);

  // Size list parsing
  const availableSizes = useMemo(() => {
    if (!product) return [];
    const rawSizes = product.size || product.attributes?.size;
    return Array.isArray(rawSizes)
      ? rawSizes
      : typeof rawSizes === 'string' && rawSizes.trim()
      ? rawSizes.split(',').map((s) => s.trim())
      : [];
  }, [product]);

  const isOutOfStock = product?.stock !== undefined && product.stock <= 0;

  // Similar Products in the same category
  const similarProducts = useMemo(() => {
    if (!product || !items || !Array.isArray(items)) return [];
    return items
      .filter(
        (it) =>
          it._id !== (product._id || product.id) &&
          it.category?.toLowerCase() === product.category?.toLowerCase()
      )
      .slice(0, 4);
  }, [product, items]);

  // Loading State with Skeletons
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton variant="circular" className="w-8 h-8" />
          <Skeleton variant="text" className="w-32 h-4" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="lg:col-span-6 space-y-4">
            <Skeleton variant="rectangular" className="w-full aspect-[4/5] rounded-2xl" />
            <div className="flex gap-3">
              <Skeleton variant="rectangular" className="w-20 h-20 rounded-xl" />
              <Skeleton variant="rectangular" className="w-20 h-20 rounded-xl" />
              <Skeleton variant="rectangular" className="w-20 h-20 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-6 space-y-6">
            <Skeleton variant="text" className="w-24 h-5" />
            <Skeleton variant="text" className="w-3/4 h-8" />
            <Skeleton variant="text" className="w-32 h-7" />
            <Skeleton variant="rectangular" className="w-full h-24 rounded-xl" />
            <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error / Not Found State
  if (fetchError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={<AlertCircle className="w-8 h-8 text-rose-500" />}
          title="Product Not Available"
          description={fetchError || "The product you requested could not be found or is no longer listed."}
          action={
            <Link
              to="/"
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
            >
              Browse Storefront Catalog
            </Link>
          }
        />
      </div>
    );
  }

  const activeImage = imageList[activeImageIndex] || imageList[0] || FALLBACK_IMAGE;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Back Action */}
        <nav className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition p-1 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="hover:text-slate-600">Home</Link>
            <span>/</span>
            {product.category && (
              <>
                <span className="text-slate-600 capitalize">{product.category}</span>
                <span>/</span>
              </>
            )}
            <span className="text-slate-900 font-medium truncate max-w-[140px] sm:max-w-xs">
              {product.name}
            </span>
          </div>
        </nav>

        {/* Main Product Showcase Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10">
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Main Image Frame */}
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 group">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Wishlist Floating Button */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className="absolute top-4 right-4 p-3 rounded-full bg-white/95 backdrop-blur-xs shadow-md hover:bg-white text-slate-600 hover:text-rose-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isWishlisted ? 'text-rose-500 fill-rose-500' : ''
                    }`}
                  />
                </button>

                {/* Sold Out Overlay */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails Row if multiple images */}
              {imageList.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {imageList.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? 'border-blue-600 shadow-sm ring-2 ring-blue-600/20'
                          : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Details & Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Category & Brand Header */}
                <div className="flex items-center gap-2">
                  {product.category && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                      <Tag className="w-3 h-3" />
                      {product.category}
                    </span>
                  )}
                  {product.brand && (
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {product.brand}
                    </span>
                  )}
                </div>

                {/* Product Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {product.name}
                </h1>

                {/* Pricing & Stock Status */}
                <div className="flex items-baseline gap-3 pb-2 border-b border-slate-100">
                  <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base text-slate-400 line-through tabular-nums">
                      ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                    </span>
                  )}
                  <span
                    className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${
                      isOutOfStock
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {isOutOfStock ? 'Out of Stock' : `${product.stock} units available`}
                  </span>
                </div>

                {/* Size / Variant Options */}
                {availableSizes.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 uppercase tracking-wider">
                        Available Sizes
                      </span>
                      {selectedSize && (
                        <span className="text-slate-500">Selected: <strong className="text-slate-900">{selectedSize}</strong></span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-11 h-10 px-3.5 rounded-xl border text-xs font-bold uppercase transition-all ${
                            selectedSize === size
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/30'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                {!isOutOfStock && (
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      Quantity
                    </label>
                    <div className="inline-flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        disabled={quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold text-slate-900 tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((prev) =>
                            product.stock ? Math.min(product.stock, prev + 1) : prev + 1
                          )
                        }
                        disabled={product.stock !== undefined && quantity >= product.stock}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Key Attributes & Specifications */}
                <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-100 text-xs">
                  {product.brand && (
                    <div>
                      <span className="text-slate-400 block">Brand</span>
                      <span className="font-semibold text-slate-800">{product.brand}</span>
                    </div>
                  )}
                  {product.attributes?.material && (
                    <div>
                      <span className="text-slate-400 block">Material</span>
                      <span className="font-semibold text-slate-800">{product.attributes.material}</span>
                    </div>
                  )}
                  {product.attributes?.type && (
                    <div>
                      <span className="text-slate-400 block">Style / Type</span>
                      <span className="font-semibold text-slate-800">{product.attributes.type}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 block">Delivery</span>
                    <span className="font-semibold text-emerald-600">Express Available</span>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Product Overview
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Verified Seller Card */}
                {product.seller && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-slate-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">
                          {product.seller.name || 'Verified Partner Merchant'}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      {product.seller.email && (
                        <p className="text-slate-400 truncate max-w-xs">{product.seller.email}</p>
                      )}
                      {product.seller.contact && (
                        <p className="text-slate-500">Contact: {product.seller.contact}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Purchase Actions Button Group */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className={`h-12 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      isOutOfStock
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : isAddingToCart
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-600/20'
                    }`}
                  >
                    {isAddingToCart ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleBuyNow}
                    className={`h-12 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                      isOutOfStock
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg shadow-emerald-600/20'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* Trust Badges Bar */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 px-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    Express Shipping
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Buyer Protection
                  </span>
                  <span className="flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                    7-Day Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Recommendation */}
        {similarProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
                  You Might Also Like
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Related Products
                </h2>
              </div>
              <Link
                to={product.category ? `/${product.category.toLowerCase()}` : '/'}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
              >
                View More in {product.category}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;