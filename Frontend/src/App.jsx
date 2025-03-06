import './App.css';
import Navbar from './Comp/Navbar';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/addToCart/:id" element={<AddToCart />} />
          <Route path="/placedOrder/:id" element={<PlaceOrder />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/item-detail/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
