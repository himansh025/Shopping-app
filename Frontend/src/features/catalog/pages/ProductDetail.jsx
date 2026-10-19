/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Heart,
  ShoppingBag,
  Zap,
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Minus,
  Plus,
  AlertCircle,
  Star,
  Maximize2,
  X,
  MapPin,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { addToWishlist, removeFromWishlist } from '../../../store/slices/wishlistSlice';
import { addToCart } from '../../../store/slices/cartSlice';
import axiosInstance from '../../../services/apiClient';
import ProductCard from '../components/ProductCard';
import Skeleton from '../../../components/ui/Skeleton';
import EmptyState from '../../../components/ui/EmptyState';

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f1f5f9'/%3E%3Cpath d='M240 270a30 30 0 1 0 0-60 30 30 0 0 0 0 60zm180 150H180l75-100 50 65 70-90 45 60v65z' fill='%2394a3b8'/%3E%3Ctext x='50%25' y='82%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-family='sans-serif' font-size='20' font-weight='500'%3ENo Image Available%3C/text%3E%3C/svg%3E";

export function ProductDetail() {
  const params = useParams();
  const rawId = params.id;
  // Extract MongoDB ObjectId if combined in a slug (e.g., name-67cc7f1d4c0e7fe61e7f7518) or use directly
  const mongoIdMatch = rawId?.match(/[a-f0-9]{24}$/i);
  const id = mongoIdMatch ? mongoIdMatch[0] : rawId;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const wishlist = useSelector((state) => state.wishlist || []);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Lightbox modal state
  const [modalImage, setModalImage] = useState(null);

  // Variant & purchase state
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Pincode delivery check state
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Direct product fetch or Redux lookup
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let isMounted = true;

    const resolveProduct = async () => {
      setLoading(true);
      setFetchError(null);

      // Check Redux store first
      const foundInRedux = items?.find((p) => (p._id || p.id) === id);
      if (foundInRedux) {
        if (isMounted) {
          setProduct(foundInRedux);
          setLoading(false);
        }
        return;
      }

      // Fetch directly from API
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        if (res.data?.product && isMounted) {
          setProduct(res.data.product);
        } else if (isMounted) {
          setFetchError('Product not found');
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch product details:', err);
          setFetchError(err.response?.data?.message || 'Could not load product details');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) resolveProduct();

    return () => {
      isMounted = false;
    };
  }, [id, items]);

  // Wishlist check
  const isWishlisted = useMemo(() => {
    if (!product || !wishlist) return false;
    const currentId = (product._id || product.id || '').toString();
    return wishlist.some((item) => (item._id || item.id || '').toString() === currentId);
  }, [product, wishlist]);

  const handleToggleWishlist = async () => {
    if (!product) return;
    const pId = (product._id || product.id || '').toString();

    try {
      if (isWishlisted) {
        dispatch(removeFromWishlist(pId));
        toast.info(`Removed "${product.name}" from wishlist`);
        if (user?.role === 'user') {
          await axiosInstance.put(`/products/wishlist/${pId}`);
        }
      } else {
        dispatch(addToWishlist(product));
        toast.success(`Saved "${product.name}" to wishlist`);
        if (user?.role === 'user') {
          await axiosInstance.put(`/products/wishlist/${pId}`);
        }
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
      size: selectedSize || '',
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
          // Fallback to legacy route
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
      return product.images.filter(Boolean);
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
      : ['S', 'M', 'L', 'XL', 'XXL'];
  }, [product]);

  const isOutOfStock = product?.stock !== undefined && product.stock <= 0;

  // Pricing calculations
  const originalPrice = product?.originalPrice || (product?.price ? Math.round(product.price * 1.5) : 0);
  const discountPercent =
    originalPrice && product?.price && originalPrice > product.price
      ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
      : null;

  // Delivery check handler
  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      setPincodeStatus({ valid: false, message: 'Please enter a valid 6-digit PIN code' });
      return;
    }
    setPincodeStatus({
      valid: true,
      message: `Delivery available at ${pincode} by ${new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}`,
    });
  };

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

  // Close modal on escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setModalImage(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton variant="rectangular" className="w-full aspect-[3/4] rounded-2xl" />
            <Skeleton variant="rectangular" className="w-full aspect-[3/4] rounded-2xl" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <Skeleton variant="text" className="w-48 h-6" />
            <Skeleton variant="text" className="w-full h-8" />
            <Skeleton variant="rectangular" className="w-36 h-10 rounded-xl" />
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
          description={fetchError || 'The product you requested could not be found or is no longer listed.'}
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

  return (
    <div className="min-h-screen bg-white py-6 sm:py-8">
      {/* Lightbox Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalImage(null)}
        >
          <button
            type="button"
            onClick={() => setModalImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition"
            aria-label="Close Preview"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={modalImage}
            alt={product.name}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center justify-between text-xs text-slate-500 mb-6 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link
                  to={`/${product.category.toLowerCase()}`}
                  className="capitalize hover:text-slate-900 transition-colors"
                >
                  {product.category}
                </Link>
                <span>/</span>
              </>
            )}
            {product.brand && (
              <>
                <span className="font-semibold text-slate-800">{product.brand}</span>
                <span>/</span>
              </>
            )}
            <span className="text-slate-900 truncate max-w-[160px] sm:max-w-sm">
              {product.name}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="hidden sm:inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </nav>

        {/* Main Product Layout: Left Images Grid, Right Sticky Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN: 2-COLUMN IMAGE GRID (MYNTRA-STYLE)          */}
          {/* ======================================================== */}
          <div className="lg:col-span-7">
            {imageList.length > 1 ? (
              // 2-Column Side-by-Side Gallery Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {imageList.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setModalImage(img)}
                    className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 cursor-zoom-in"
                  >
                    <img
                      src={img}
                      alt={`${product.name} - Angle ${idx + 1}`}
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Zoom Icon Overlay on Hover */}
                    <div className="absolute bottom-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-xs text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                      <Maximize2 className="w-4 h-4" />
                    </div>

                    {/* Index Badge */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/40 text-white text-[10px] font-bold backdrop-blur-xs">
                      {idx + 1} / {imageList.length}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              // Single Image Display
              <div
                onClick={() => setModalImage(imageList[0])}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 cursor-zoom-in max-w-2xl mx-auto"
              >
                <img
                  src={imageList[0]}
                  alt={product.name}
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/80 backdrop-blur-xs text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: STICKY BUY BOX & PRODUCT DETAILS           */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 lg:sticky lg:top-6 self-start space-y-6">
            {/* Header: Brand & Title */}
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight uppercase">
                {product.brand || product.category || 'Exclusive Collection'}
              </h1>
              <p className="text-base sm:text-lg text-slate-500 font-normal mt-0.5 leading-snug">
                {product.name}
              </p>

              {/* Rating Badge */}
              <div className="inline-flex items-center gap-2 mt-3 px-2.5 py-1 rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-800 shadow-2xs">
                <span className="flex items-center gap-1 font-bold text-slate-900">
                  4.1 <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">585 Ratings</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Price Row */}
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                {originalPrice > product.price && (
                  <>
                    <span className="text-sm sm:text-base text-slate-400 line-through tabular-nums">
                      MRP ₹{Number(originalPrice).toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-rose-600">
                      ({discountPercent}% OFF)
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs font-bold text-emerald-700 mt-1">
                inclusive of all taxes
              </p>
            </div>

            {/* Size Selector */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  SELECT SIZE
                </span>
                <button
                  type="button"
                  onClick={() => toast.info('Standard international sizing applies')}
                  className="text-xs font-bold uppercase text-rose-600 hover:text-rose-700 transition"
                >
                  SIZE CHART &gt;
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full border text-xs font-bold uppercase transition-all flex items-center justify-center ${
                      selectedSize === size
                        ? 'border-rose-600 text-rose-600 ring-2 ring-rose-600/30 font-extrabold bg-rose-50/30'
                        : 'border-slate-200 text-slate-800 hover:border-slate-400 bg-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Quantity:
                </span>
                <div className="inline-flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="w-7 h-7 flex items-center justify-center rounded bg-white text-slate-700 shadow-2xs hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900">
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
                    className="w-7 h-7 flex items-center justify-center rounded bg-white text-slate-700 shadow-2xs hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons: ADD TO BAG & WISHLIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`h-13 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md focus:outline-none ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : isAddingToCart
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white shadow-rose-500/25'
                }`}
              >
                {isAddingToCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? 'Sold Out' : 'ADD TO BAG'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`h-13 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
                  isWishlisted
                    ? 'border-rose-500 bg-rose-50 text-rose-600'
                    : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                  }`}
                />
                <span>{isWishlisted ? 'WISHLISTED' : 'WISHLIST'}</span>
              </button>
            </div>

            {/* Buy Now Direct Button */}
            {!isOutOfStock && (
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-11 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white transition shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Buy Now</span>
              </button>
            )}

            <hr className="border-slate-100" />

            {/* Delivery Options & Pincode Check */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <Truck className="w-4 h-4 text-slate-700" />
                <span>DELIVERY OPTIONS</span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value);
                      setPincodeStatus(null);
                    }}
                    placeholder="Enter pincode"
                    className="w-full h-10 px-3 pr-8 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <MapPin className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                </div>
                <button
                  type="submit"
                  className="px-4 h-10 bg-white border border-rose-500 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-lg transition"
                >
                  Check
                </button>
              </form>

              {pincodeStatus ? (
                <p
                  className={`text-xs ${
                    pincodeStatus.valid ? 'text-emerald-700 font-semibold' : 'text-rose-600'
                  }`}
                >
                  {pincodeStatus.message}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Please enter PIN code to check delivery time & Pay on Delivery Availability
                </p>
              )}

              {/* Trust Points */}
              <div className="space-y-1.5 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Original Products</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Pay on delivery might be available</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Easy 7 days returns and exchanges</span>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Best Offers Section */}
            <div className="space-y-2.5 bg-slate-50/70 p-4 rounded-xl border border-slate-200/70 text-xs">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-900">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>BEST OFFERS</span>
              </div>
              <p className="font-semibold text-slate-800">
                Best Price: <span className="text-rose-600">₹{Math.max(1, product.price - 150)}</span>
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                <li>Applicable on orders above ₹1,499</li>
                <li>Coupon code: <strong className="text-slate-900 font-mono">SHOPNOW150</strong></li>
                <li>10% Instant Discount on HDFC & SBI Bank Cards</li>
                <li>Flat 7.5% Cashback on Axis Bank Credit Cards</li>
              </ul>
            </div>

            {/* Product Overview & Description */}
            {product.description && (
              <div className="space-y-2 pt-1 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-900 block">
                  Product Details
                </span>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Verified Merchant Summary */}
            {product.seller && (
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Sold by</span>
                  <span className="font-bold text-slate-900">
                    {product.seller.name || 'Verified Merchant Store'}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  <Store className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products Recommendation */}
        {similarProducts.length > 0 && (
          <section className="mt-20 pt-10 border-t border-slate-200">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
                  You Might Also Like
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Similar Products
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