import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
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
import Boy from './pages/user/Boy';
import Girl from './pages/user/Girl';
import Electronics from './pages/user/Electronics';
import Orders from './Comp/Orders';

// Create a toast context to make toast functions available throughout the app
import { createContext, useState } from 'react';
import Profile from './Comp/user/Profile';
import HandleProducts from './pages/seller/HandleProducts';
import SellerProfile from './pages/seller/SellerProfile'
import { useEffect } from 'react';
import axios from 'axios';
import { setProducts} from './store/productsSlicer'
import { useDispatch, useSelector } from 'react-redux';
export const ToastContext = createContext();

function App() {
  const [Data,setData]= useState([])
  const dispatch= useDispatch()
  const { items } = useSelector((state) => state.products); // ✅ Correct path

  const fetchProducts =  async () => {
    const response = await axios.get("http://localhost:5000/api/v1/products/all");
    // console.log("d",response?.data);
    setData(response?.data.products)
    if(response.data){
      dispatch(setProducts(response.data.products))
    }
  };
  useEffect(()=>{
    fetchProducts()
  },[])
  
  console.log(items);
  // Toast helper functions
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
            <Route index element={<HomePage data={Data} />} />
            <Route path="/addToCart/:id" element={<AddToCart />} />
            <Route path="/placedOrder/:id" element={<PlaceOrder />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/add" element={<AddProducts />} />
            <Route path="/item-detail/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forget" element={<Forget />} />
            <Route path="/men" element={<Men />} />
            <Route path="/women" element={<Women />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />


            <Route path="/electronics" element={<Electronics />} />
            {/* <Route path="/boy" element={<Boy />} /> */}
            {/* <Route path="/girl" element={<Girl />} /> */}

            <Route path="/seller-profile" element={<SellerProfile/>} />
            <Route path="/dashboard" element={<HandleProducts />} />

          

          </Route>
        </Routes>

        {/* Toast Container */}
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
      </Router>
    </ToastContext.Provider>
  );
}

export default App;