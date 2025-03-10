import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
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
          <Route path="/boy" element={<Boy />} />
          <Route path="/girl" element={<Girl />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
