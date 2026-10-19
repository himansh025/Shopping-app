import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../store/slices/cartSlice";
import axiosInstance from "../../../services/apiClient";

/**
 * Backward compatibility route for /addToCart/:id
 * Automatically ensures the item is added to the cart and navigates to the unified /cart page
 */
export function AddToCart() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    let isMounted = true;

    const addItemAndRedirect = async () => {
      let product = items?.find((it) => (it._id || it.id) === id);

      if (!product && id) {
        try {
          const res = await axiosInstance.get(`/products/${id}`);
          product = res.data?.product;
        } catch (err) {
          console.error("Failed to fetch product for AddToCart bridge:", err);
        }
      }

      if (product && isMounted) {
        dispatch(addToCart(product));

        if (user?.role === "user") {
          try {
            await axiosInstance.post("/cart/add", {
              productId: product._id || product.id,
              quantity: 1,
              size: "",
            });
          } catch (err) {
            console.error("Server add to cart sync error:", err);
          }
        }
      }

      if (isMounted) {
        navigate("/cart", { replace: true });
      }
    };

    addItemAndRedirect();

    return () => {
      isMounted = false;
    };
  }, [id, items, user, dispatch, navigate]);

  return (
    <div className="flex justify-center items-center h-64 w-full">
      <div className="text-center text-slate-500 font-medium animate-pulse">
        Adding product to cart...
      </div>
    </div>
  );
}

export default AddToCart;
