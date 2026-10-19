
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../../../store/slices/wishlistSlice";
import { useNavigate } from "react-router-dom";

export function Wishlist() {
  const wishlist = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="mt-3 text-slate-500">No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <div key={item._id} className="border border-slate-200 bg-white p-3 rounded-xl shadow-xs">
              <img src={item.images} alt={item.name} className="h-40 w-full rounded-lg object-cover" />
              <h3 className="text-lg font-semibold mt-2 text-slate-800">{item.name}</h3>
              <div className="flex justify-between text-sm mt-1">
                <p className="text-slate-700">Price : ₹{item.price}</p>
                <p className="text-slate-700">Brand : {item.brand}</p>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <p className="text-slate-700">
                  Size :{" "}
                  {item?.size?.map((size, index) => (
                    <span key={index} className="mr-1">{size}</span>
                  ))}
                </p>
                <p className="text-slate-700">Category : {item.category}</p>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => dispatch(removeFromWishlist(item.id || item._id))}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                >
                  Remove
                </button>
                <button
                  onClick={() => navigate(`/placedOrder/${item._id}`)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
