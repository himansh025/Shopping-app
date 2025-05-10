import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { IoHeart } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../store/wishlistSlice";
import { addToCart, removeFromCart } from "../store/cartSlicer";
import axiosInstance from "../Config/apiConfig";
const AddToCart = () => {
  const [cart, setCart] = useState(null);
  // const [Add,SetAdd] =useState[null];
  const [wishList, setWishList] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { items } = useSelector((state) => state.products);
  const { user, status } = useSelector((state) => state.auth);
  const wishlistSelector = useSelector((state) => state.wishlist);
  const item = items?.find((item) => item._id === id);
  const cartdata = useSelector((state) => state.cart)
  // console.log(cartdata.length)


  let already = cartdata.find((item) => item._id == id)
  // console.log("al", already);


  useEffect(() => {
    if (item) {
      setCart(item);
      setWishList(wishlistSelector.some((wishItem) => wishItem._id === item._id));
    }
  }, [id, item, wishlistSelector]);

  const token= sessionStorage.getItem("token")

  const toggleWishlist = async() => {
    if (!cart) return;
    if(status && user  ){
    if (wishList) {
      const res = await axiosInstance.put(`/products/wishlist/${cart._id}`,{
        headers: { Authorization: `Bearer ${token}` }
      });
      // console.log(res.data.wishlist, "updated wishlist from backend");
      dispatch(removeFromWishlist(cart._id));
    } else {
      const res = await axiosInstance.put(`/products/wishlist/${cart._id}`,{
        headers: { Authorization: `Bearer ${token}` }
      });
      // console.log(res.data.wishlist, "updated wishlist from backend");
      dispatch(addToWishlist(cart));
    }
    setWishList(!wishList);}
    else{
      navigate('/login')
    }
  };


const handleAddToCart = async (id, item) => {
  if(status && user){
  try {
    const res = await axiosInstance.post(`/products/productCart/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch(addToCart(item));
    // console.log(res.data.message);
  } catch (err) {
    console.error("Add to cart failed:", err.response?.data?.message || err.message);
  }}
  else{
    navigate('/login')
  }
};

const handleRemoveFromCart = async (id) => {
  if(status && user){
  try {
    const res = await axiosInstance.delete(`/products/productCart/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch(removeFromCart(id));
    // console.log(res.data.message);
  } catch (err) {
    console.error("Remove from cart failed:", err.response?.data?.message || err.message);
  }}
  else{
    navigate('/login')
  }
};


  if (!cart) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <h2 className="text-center text-gray-600 text-xl">Loading product...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 p-4">
      {/* Single Product Display */}
      <div className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg mt-10 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-2xl text-gray-800">My Cart</h2>
          <button onClick={toggleWishlist} className="text-2xl">
            {wishList ? <IoHeart className="text-red-500" /> : <CiHeart className="text-gray-500" />}
          </button>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={cart?.images}
            alt={cart?.name}
            className="w-64 h-64 object-cover rounded-lg shadow-sm"
          />
          <h2 className="text-2xl font-bold mt-4 text-gray-900">{cart?.name}</h2>
          <p className="text-lg text-blue-600 mt-2">Price: ₹{cart?.price}</p>
        </div>

        <div className="flex justify-center gap-4 mt-5">
          {!already && (
            <button
              onClick={() => handleAddToCart(cart._id, cart)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Item
            </button>
          )}
          <button
            onClick={() => handleRemoveFromCart(cart._id)}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Remove
          </button>
          <button
            onClick={() => navigate(`/placedOrder/${cart._id}`)}
            className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            Place Order
          </button>
        </div>
        <button
          onClick={() => navigate(`/wishlist`)}
          className="mt-4 block text-blue-500 hover:underline text-center"
        >
          View Wishlist
        </button>
      </div>

      {/* Cart Items List */}
      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg mt-10 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-center">Cart Items</h2>
        {cartdata.length > 0 ? (
          cartdata.map((data) => (
            <div key={data._id} className="flex items-center gap-4 mb-4 p-3 border-b border-gray-300">
              <img
                src={data.images}
                alt={data.name}
                className="w-16 h-16 object-cover rounded-lg shadow-sm"
              />
              <div>
                <h2 className="text-lg font-bold text-gray-900">{data.name}</h2>
                <p className="text-md text-blue-600">Price: ₹{data.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No items in the cart</p>
        )}
      </div>
    </div>


  );
};

export default AddToCart;