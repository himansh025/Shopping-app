import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlicer.js";
import { FaUser } from "react-icons/fa6";
import SearchBar from "./SearchBar.jsx";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserRoles, setShowUserRoles] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleUserRoles = () => setShowUserRoles(!showUserRoles);
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex text-decoration-none items-center">
            <span className="text-sm md:text-xl font-bold  text-gray-800">ShopEase</span>
          </Link>
      
            <div className=" w-fit md:w-full max-w-md">
              <SearchBar />
            </div>
     
          {/* Desktop Auth + Icons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                <LogOut className="inline h-5 w-5 mr-1" /> Logout
              </button>
            ) : (
              <div className="relative">
                <FaUser
                  className="h-9 w-9 cursor-pointer bg-gray-200 p-2 rounded-full"
                  onClick={toggleUserRoles}
                />
                {showUserRoles && (
                  <div className="absolute top-12 right-0 gap-3 bg-white shadow-lg border rounded p-2 space-y-2 z-10">
                    <button
                      onClick={() => {
                        navigate("/login", { state: { role: "seller" } })
                        setShowUserRoles(!showUserRoles)
                      }
                      }
                      className="w-32 bg-blue-500 text-white px-2 m-1 py-1 rounded hover:bg-blue-600"
                    >
                      Seller
                    </button>
                    <button
                      onClick={() => {
                        navigate("/login", { state: { role: "user" } })
                        setShowUserRoles(!showUserRoles)
                      }}
                      className="w-32 bg-blue-500 text-white m-1 px-2 py-1 rounded hover:bg-blue-600"
                    >
                      User
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-gray-100 border-t border-gray-300 p-4 space-y-4">

          {user ? (
            <>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full bg-red-500 text-white px-4 py-2 rounded-md text-center hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate("/login", { state: { role: "seller" } });
                  setMenuOpen(false);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Login as Seller
              </button>
              <button
                onClick={() => {
                  navigate("/login", { state: { role: "user" } });
                  setMenuOpen(false);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Login as User
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}


export default Navbar;
