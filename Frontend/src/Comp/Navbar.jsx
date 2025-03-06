import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, User, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlicer.js";
import SearchBar from "./SearchBar.jsx";
import { FaUser } from "react-icons/fa6";
// import logo from "../logo.png"; // Your logo image

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [selectuser,setselectuser]= useState(false)

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const handleuser = () => {
  setselectuser(!selectuser);
  };
  

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            {/* <img src={logo} alt="Logo" className="h-12 w-12 mr-2" /> */}
            <span className="text-xl text-decoration-none ml-5 font-bold text-gray-800">ShopEase</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex  gap-20 space-x-6">
            <NavLink to="/" text="Home" />
            <NavLink to="/shop" text="Shop" />
            <NavLink to="/cart" text="Cart" icon={<ShoppingCart className="h-5 w-5" />} />
            {/* <SearchBar/> */}
          </div>
          <SearchBar/>

          {/* Auth Section */}
          <div className="hidden md:flex space-x-4 items-center">
            {user ? (
              <>
                <NavLink to="/profile" text="Profile" icon={<User className="h-5 w-5" />} />
                <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                  <LogOut className="h-5 w-5 inline" /> Logout
                </button>
              </>
            ) : (
              <>

             
              {selectuser?(
                <>
                 <div className="flex flex-col mt-5 gap-2">
                 <button
        onClick={() => navigate("/login", { state: { role: "seller" } })}
        className="w-full bg-blue-500 text-white px-2 py-1 rounded mb-2"
      >
        Seller
      </button>
      <button
        onClick={() => navigate("/login", { state: { role: "user" } })}
        className="w-full bg-blue-500 text-white px-2 py-1 rounded mb-2"
      >
        User
      </button>
                 </div>
                </>
              ): null}
              <FaUser className="h-10 w-10 bg-gray-200 p-1 rounded-3xl" onClick={handleuser}  />
            
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-100 p-3 space-y-2">
          <MobileNavLink to="/" text="Home" onClick={() => setMenuOpen(false)} />
          <MobileNavLink to="/shop" text="Shop" onClick={() => setMenuOpen(false)} />
          <MobileNavLink to="/cart" text="Cart" onClick={() => setMenuOpen(false)} />
          
          {user ? (
            <>
              <MobileNavLink to="/profile" text="Profile" onClick={() => setMenuOpen(false)} />
              <button
                onClick={() => {
                //   handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <MobileNavLink to="/login" text="Login" onClick={() => setMenuOpen(false)} />
              <MobileNavLink to="/signup" text="Signup" onClick={() => setMenuOpen(false)} />
          
            </>
          )}
        </div>
      )}
    </nav>
  );
}

// Desktop NavLink Component
function NavLink({ to, text, icon }) {
  return (
    <Link to={to} className="flex text-decoration-none items-center text-gray-700 hover:text-gray-900">
      {icon && <span className="mr-1">{icon}</span>}
      {text}
    </Link>
  );
}

// Mobile NavLink Component
function MobileNavLink({ to, text, onClick }) {
  return (
    <>
    <Link to={to} className="block text-decoration-none text-gray-700 hover:text-blue-600 px-4 py-1" onClick={onClick}>
      {text}
    </Link>
       
        </>
  );
}

export default Navbar;
