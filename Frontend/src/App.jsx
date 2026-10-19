import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppRoutes } from './routes';
import axiosInstance from './services/apiClient';
import { useDispatch, useSelector } from 'react-redux';
import { createContext, useState, useEffect } from 'react';
import { loadAllProducts, setLoading } from './store/slices/productsSlice';
import { setWishlist } from './store/slices/wishlistSlice';
import { setToCart } from './store/slices/cartSlice';

export const ToastContext = createContext();

function App() {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const fetchWishlist = async () => {
    try {
      const res = await axiosInstance.get('/user/user-wishlist');
      dispatch(setWishlist(res.data.wishlist));
    } catch (error) {
      console.log("Error fetching wishlist", error);
    }
  };

  const fetchCartlist = async () => {
    try {
      const res = await axiosInstance.get('/user/user-cart');
      dispatch(setToCart(res.data.cart));
    } catch (error) {
      console.log("Error fetching cart", error);
    }
  };

  const fetchProducts = async () => {
    dispatch(setLoading());
    try {
      const response = await axiosInstance.get("/products/all", { params: {} });
      setData(response?.data.products);
      if (response.data) {
        dispatch(loadAllProducts(response.data.products));
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    if (user?.role === "user") {
      fetchWishlist();
      fetchCartlist();
    } else if (!user) {
      // Load from LocalStorage for guests
      const savedWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
      const savedCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      dispatch(setWishlist(savedWishlist));
      dispatch(setToCart(savedCart));
    }
    fetchProducts();
  }, [user]);

  // Sync to LocalStorage for guests
  const cart = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (!user) {
      localStorage.setItem("guestCart", JSON.stringify(cart || []));
    }
  }, [cart, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem("guestWishlist", JSON.stringify(wishlist || []));
    }
  }, [wishlist, user]);

  const showToast = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    info: (message) => toast.info(message),
    warning: (message) => toast.warning(message),
  };

  return (
    <ToastContext.Provider value={showToast}>
      <Router>
        <AppRoutes user={user} data={data} />
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ToastContext.Provider>
  );
}

export default App;