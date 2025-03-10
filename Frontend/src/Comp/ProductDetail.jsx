import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoHeart } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../store/wishlistSlice";
import Card from '../Comp/Card'

const ProductDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [wishList, setWishList] = useState(false);
  const [product, setProduct] = useState(null);
  const wishlistSelector = useSelector((state) => state.wishlist);
  const { items } = useSelector((state) => state.products);

  const item = items?.filter((item) => item._id === id);

  useEffect(() => {
    if (item?.length > 0) {
      setProduct(item[0]);
      setWishList(wishlistSelector.some(wishItem => wishItem._id === item[0]._id));
    }
  }, [id, wishlistSelector, item]);

  const toggleWishlist = () => {
    if (wishList) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
    setWishList(!wishList);
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <h2 className="text-center text-gray-600 text-xl">Loading product...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="md:flex">
          {/* Product Image Section */}
          <div className="md:w-1/2 bg-gray-50">
            <div className="relative h-80 md:h-full overflow-hidden">
              <img
                src={product.images}
                alt={product.name}
                className="w-full h-[550px] object-cover transition-transform duration-200 hover:scale-103"
              />
              <button 
                onClick={toggleWishlist}
                className="absolute top-4 right-4 p-1  rounded-3xl shadow-md transition-all duration-100 hover:bg-gray-200  "
              >
                {wishList ? (
                  <IoHeart className="h-6 w-6  text-red-500" />
                ) : (
                  <CiHeart className="h-6 w-6 " />
                )}
              </button>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="md:w-1/2 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-xl font-semibold text-blue-600 mb-4">₹{product.price}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between border-b pb-1">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{product.category}</span>
              </div>
              
              {product?.attributes?.size && (
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">Size</span>
                  <span className="font-medium">{product.attributes.size.join(", ")}</span>
                </div>
              )}
              
              {product?.attributes?.type && (
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">{product.attributes.type}</span>
                </div>
              )}
              
              <div className="flex justify-between border-b pb-1">
                <span className="text-gray-600">Brand</span>
                <span className="font-medium">{product.brand}</span>
              </div>
              
              {product?.attributes?.material && (
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">Material</span>
                  <span className="font-medium">{product.attributes.material}</span>
                </div>
              )}
              
              <div className="flex justify-between border-b pb-1">
                <span className="text-gray-600">Stock</span>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} Available` : 'Out of Stock'}
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => navigate(`/addToCart/${product._id}`)}
                className="bg-blue-500 py-3 text-white rounded-md shadow-sm hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none"
              >
                Add to Cart
              </button>
              
              <button
                onClick={() => navigate("/wishlist")}
                className="bg-gray-100 py-3 text-gray-800 rounded-md shadow-sm hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none"
              >
                View Wishlist
              </button>
              
              <button
                onClick={() => navigate(`/placedOrder/${product._id}`)}
                className="bg-green-500 py-3 text-white rounded-md shadow-sm hover:bg-green-600 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 mb-6">
        <h3 className="text-2xl font-bold text-center relative pb-3 mb-8">
          Similar Products
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500"></span>
        </h3>
        <Card />
      </div>
    </div>
  );
};

export default ProductDetail;