import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoHeart } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { Store } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../store/wishlistSlice";
import Card from "./Card";
import axiosInstance from "../Config/apiConfig";
import BackArrow from "./BackArrow";

const ProductDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [wishList, setWishList] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const wishlistSelector = useSelector((state) => state.wishlist || []);
  const { items } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const item = items?.find((it) => it._id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (item) {
      setProduct(item);
      setWishList(wishlistSelector.some((wishItem) => wishItem._id === id));

      const rawSizes = item.size || item.attributes?.size;
      const parsedSizes = Array.isArray(rawSizes)
        ? rawSizes
        : typeof rawSizes === "string"
        ? rawSizes.split(",").map((s) => s.trim())
        : [];
      if (parsedSizes.length > 0) {
        setSelectedSize(parsedSizes[0]);
      }
    }
  }, [id, wishlistSelector, item]);

  const toggleWishlist = async () => {
    if (!product) return;

    if (!user) {
      if (wishList) {
        dispatch(removeFromWishlist(product._id));
      } else {
        dispatch(addToWishlist(product));
      }
      setWishList(!wishList);
      return;
    }

    try {
      if (wishList) {
        await axiosInstance.put(`/products/wishlist/${id}`);
        dispatch(removeFromWishlist(product._id));
        setWishList(false);
      } else {
        await axiosInstance.put(`/products/wishlist/${id}`);
        dispatch(addToWishlist(product));
        setWishList(true);
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <h2 className="text-center text-slate-500 text-lg">Loading product details...</h2>
      </div>
    );
  }

  const rawSizes = product.size || product.attributes?.size;
  const availableSizes = Array.isArray(rawSizes)
    ? rawSizes
    : typeof rawSizes === "string"
    ? rawSizes.split(",").map((s) => s.trim())
    : [];

  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : typeof product.images === "string"
      ? product.images
      : "/placeholder.jpg";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <BackArrow className="mb-6" size={28} />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Media Column */}
          <div className="relative bg-slate-50 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
            <div className="relative w-full max-w-md h-[400px] sm:h-[480px] overflow-hidden rounded-xl">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center rounded-xl"
              />
              <button
                type="button"
                onClick={toggleWishlist}
                aria-label={wishList ? "Remove from wishlist" : "Add to wishlist"}
                className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-xs shadow-md hover:bg-white transition-all text-slate-700"
              >
                {wishList ? (
                  <IoHeart className="h-6 w-6 text-rose-500 fill-rose-500" />
                ) : (
                  <CiHeart className="h-6 w-6 hover:text-rose-500" />
                )}
              </button>
            </div>
          </div>

          {/* Product Info Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category */}
              {product.category && (
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  {product.category}
                </span>
              )}

              {/* Title & Price */}
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 mb-2">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-slate-900 mb-6">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </p>

              {/* Variant Options: Selectable Sizes */}
              {availableSizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Select Size
                    </span>
                    {selectedSize && (
                      <span className="text-xs text-slate-500">Selected: {selectedSize}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((sizeOption, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSize(sizeOption)}
                        className={`min-w-10 h-10 px-3.5 rounded-lg border text-sm font-semibold transition-all ${
                          selectedSize === sizeOption
                            ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/20"
                            : "bg-white border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        {sizeOption.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications: Brand, Material, Stock */}
              <div className="space-y-2.5 py-4 border-y border-slate-100 text-sm mb-6">
                {product.brand && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Brand</span>
                    <span className="font-medium text-slate-900">{product.brand}</span>
                  </div>
                )}
                {product.attributes?.material && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Material</span>
                    <span className="font-medium text-slate-900">{product.attributes.material}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Availability</span>
                  <span
                    className={`font-semibold ${
                      product.stock > 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} units in stock` : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Seller Information Card */}
              {product.seller && (product.seller.name || product.seller.contact || product.seller.email) && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Seller Details
                    </h4>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    {product.seller.name && (
                      <p>
                        <span className="font-medium text-slate-800">Merchant:</span> {product.seller.name}
                      </p>
                    )}
                    {product.seller.contact && (
                      <p>
                        <span className="font-medium text-slate-800">Contact:</span> {product.seller.contact}
                      </p>
                    )}
                    {product.seller.email && (
                      <p>
                        <span className="font-medium text-slate-800">Email:</span> {product.seller.email}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions: Add to Cart & Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  user && user.role === "user"
                    ? navigate(`/addToCart/${product._id}`)
                    : navigate("/login");
                }}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center shadow-sm shadow-blue-600/10 transition-colors"
              >
                Add to Cart
              </button>

              <button
                type="button"
                onClick={() => {
                  user && user?.role === "user"
                    ? navigate(`/placedOrder/${product._id}`)
                    : navigate("/login");
                }}
                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm flex items-center justify-center shadow-sm shadow-emerald-600/10 transition-colors"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-14 mb-6">
        <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">
          Similar Products
        </h3>
        <Card items={items} remove={item} />
      </div>
    </div>
  );
};

export default ProductDetail;