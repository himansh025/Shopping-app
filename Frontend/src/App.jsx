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

  // Helper to normalize cart payload from backend CartModel
  const normalizeCartData = (cartData) => {
    if (!cartData) return [];
    const items = cartData.items || (Array.isArray(cartData) ? cartData : []);
    return items
      .filter((item) => item && (item.product || item._id))
      .map((item) => {
        const prod = item.product && typeof item.product === 'object' ? item.product : {};
        const pId = prod._id || item.product || item._id || item.productId;
        return {
          ...prod,
          _id: pId ? pId.toString() : '',
          productId: pId ? pId.toString() : '',
          cartItemId: item._id ? item._id.toString() : undefined,
          quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
          size: item.size || '',
          price: prod.price !== undefined ? prod.price : item.price,
        };
      });
  };

  const fetchWishlist = async () => {
    try {
      const res = await axiosInstance.get('/user/user-wishlist');
      if (res.data?.wishlist) {
        dispatch(setWishlist(res.data.wishlist));
      }
    } catch (error) {
      console.log('Error fetching wishlist', error);
    }
  };

  const syncAndFetchCart = async () => {
    try {
      const storedGuestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');

      if (Array.isArray(storedGuestCart) && storedGuestCart.length > 0) {
        // Merge guest cart items into authenticated user's cart
        const guestItems = storedGuestCart.map((item) => ({
          productId: item._id || item.productId || item.id,
          quantity: item.quantity || 1,
          size: item.size || '',
        }));

        const mergeRes = await axiosInstance.post('/cart/merge', { guestItems });
        if (mergeRes.data?.cart) {
          dispatch(setToCart(normalizeCartData(mergeRes.data.cart)));
          localStorage.removeItem('guestCart');
          return;
        }
      }

      // If no guest items to merge, fetch authoritative cart
      const res = await axiosInstance.get('/cart');
      if (res.data?.cart) {
        dispatch(setToCart(normalizeCartData(res.data.cart)));
      }
    } catch (error) {
      console.log('Error synchronizing cart:', error);
      // Fallback to legacy endpoint if /cart fails
      try {
        const fallbackRes = await axiosInstance.get('/user/user-cart');
        if (fallbackRes.data?.cart) {
          dispatch(setToCart(normalizeCartData(fallbackRes.data.cart)));
        }
      } catch (err) {
        console.log('Fallback cart fetch also failed', err);
      }
    }
  };

  const syncAndFetchWishlist = async () => {
    try {
      const storedGuestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');

      if (Array.isArray(storedGuestWishlist) && storedGuestWishlist.length > 0) {
        // Fetch current user wishlist first
        const userWishlistRes = await axiosInstance.get('/user/user-wishlist');
        const currentWishlist = userWishlistRes.data?.wishlist || [];
        const existingIds = new Set(
          currentWishlist.map((it) => (it._id || it.id || '').toString())
        );

        // Sync items not yet in user wishlist
        for (const gItem of storedGuestWishlist) {
          const gId = (gItem._id || gItem.id || '').toString();
          if (gId && !existingIds.has(gId)) {
            await axiosInstance.put(`/products/wishlist/${gId}`);
          }
        }

        localStorage.removeItem('guestWishlist');
      }

      await fetchWishlist();
    } catch (error) {
      console.log('Error syncing wishlist:', error);
      fetchWishlist();
    }
  };

  const fetchProducts = async () => {
    dispatch(setLoading());
    try {
      const response = await axiosInstance.get('/products/all', { params: {} });
      setData(response?.data?.products || []);
      if (response.data?.products) {
        dispatch(loadAllProducts(response.data.products));
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  useEffect(() => {
    if (user?.role === 'user') {
      syncAndFetchCart();
      syncAndFetchWishlist();
    } else if (!user) {
      // Load from LocalStorage for guests
      const savedWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      const savedCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      dispatch(setWishlist(savedWishlist));
      dispatch(setToCart(savedCart));
    }
    fetchProducts();
  }, [user]);

  // Sync to LocalStorage for guests only
  const cart = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('guestCart', JSON.stringify(cart || []));
    }
  }, [cart, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('guestWishlist', JSON.stringify(wishlist || []));
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