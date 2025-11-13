import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/user/HomePage';
import Layout from './Comp/Layout';
import AddToCart from './Comp/AddToCart';
import PlaceOrder from './Comp/PlacedOrder';
import Login from './Comp/Auth/Login';
import Signup from './Comp/Auth/Signup';
import Wishlist from './Comp/Wishlist';
import ProductDetail from './Comp/ProductDetail';
import Forget from './Comp/Auth/Forget';
import AddProducts from './Comp/seller/AddProducts';
import Men from './pages/user/Men';
import Women from './pages/user/Women';
import Electronics from './pages/user/Electronics';
import axiosInstance from './Config/apiConfig';
import Orders from './Comp/Orders';
import Dashboard from './pages/seller/Dashboard';
import Profile from './pages/user/Profile';
import SellerProfile from './pages/seller/SellerProfile'
import { useDispatch, useSelector } from 'react-redux';
import { createContext, useState } from 'react';
import { useEffect } from 'react';
import { loadAllProducts, setProducts } from './store/productsSlicer'
import  VerifyOtp  from './Comp/VerifyOtp';
import { setWishlist } from './store/wishlistSlice';
import { setToCart } from './store/cartSlicer';
import Chatbot from './Comp/Chatbot';
export const ToastContext = createContext();

function App() {
  const [Data, setData] = useState([])
  const dispatch = useDispatch()
  const { user, status } = useSelector((state) => state.auth)
  // console.log(user)

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
    const response = await axiosInstance.get("/products/all",{params:{}})
    // console.log("d",response?.data);
    setData(response?.data.products)
    if (response.data) {
dispatch(loadAllProducts(response.data.products));
    }
  };


  useEffect(() => {
    if (status && user?.role=="user") {
      fetchWishlist();
      fetchCartlist();
    }
    fetchProducts()
  }, [user])


  const showToast = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    info: (message) => toast.info(message),
    warning: (message) => toast.warning(message)
  };

  return (
    <ToastContext.Provider value={showToast}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
           
            {user?.role != "seller" &&
              <Route index element={<HomePage data={Data} />} />}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forget" element={<Forget />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/item-detail/:id" element={<ProductDetail />} />
            <Route path="/men" element={<Men />} />
            <Route path="/women" element={<Women />} />
            <Route path="/electronics" element={<Electronics />} />


            {user?.role == "seller" && (
              < >
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<SellerProfile />} />
                <Route path="/add" element={<AddProducts />} />
                <Route path="/orders" element={<Orders />} />

              </>
            )}

            {user?.role === "user" && (
              <>
                <Route path="/addToCart/:id" element={<AddToCart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/placedOrder/:id" element={<PlaceOrder />} />
              </>
            )}

          </Route>
        
        </Routes>
<Chatbot/>
        {/* Toast Container */}
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
       {/* {user?.role === "user" && <Chatbot />} */}
    </ToastContext.Provider>
  );
}

export default App;