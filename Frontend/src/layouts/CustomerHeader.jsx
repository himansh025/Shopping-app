import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingBag,
  Search,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Package,
  Store,
} from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { clearSearch, setProducts } from '../store/slices/productsSlice';
import axiosInstance from '../services/apiClient';
import PageContainer from './PageContainer';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
} from '../components/ui/Dropdown';

export function CustomerHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart || []);
  const wishlist = useSelector((state) => state.wishlist || []);
  const cartCount = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
    : 0;
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;

  // Sync search input with Redux search
  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      dispatch(clearSearch());
      return;
    }

    try {
      const res = await axiosInstance.get('/products/all', {
        params: { name: searchQuery.trim() },
      });
      if (res.data?.products) {
        dispatch(setProducts(res.data.products));
      }
      if (location.pathname !== '/') {
        navigate('/');
      }
    } catch (err) {
      console.error('Search request failed:', err);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim() === '') {
      dispatch(clearSearch());
    }
  };

  const handleLogout = async () => {
    try {
      const endpoint = user?.role === 'seller' ? '/seller/logout' : '/user/logout';
      await axiosInstance.post(endpoint);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      dispatch(logout());
      navigate('/');
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const categoryLinks = [
    { label: 'All Products', to: '/' },
    { label: 'Men', to: '/men' },
    { label: 'Women', to: '/women' },
    { label: 'Electronics', to: '/electronics' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Main Navigation Bar */}
      <PageContainer>
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 text-slate-900 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-600/20 group-hover:bg-blue-700 transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              MyShop
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search products by title, category, or brand..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full h-10 pl-10 pr-4 text-sm bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-full border border-transparent focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Action Icons (Wishlist, Cart, User Dropdown) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              aria-label={`Saved Wishlist (${wishlistCount} items)`}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              aria-label={`Shopping Cart (${cartCount} items)`}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-blue-600 rounded-full shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account Dropdown */}
            {user ? (
              <Dropdown>
                <DropdownTrigger className="p-1 rounded-full border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-xs">
                      {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden lg:inline text-xs font-medium text-slate-700 max-w-[100px] truncate">
                      {user.fullname || user.username}
                    </span>
                  </div>
                </DropdownTrigger>
                <DropdownMenu align="right" width="w-56">
                  <DropdownLabel>
                    Signed in as <span className="font-semibold text-slate-900">{user.email || user.username}</span>
                  </DropdownLabel>
                  <DropdownSeparator />
                  <DropdownItem
                    icon={<User className="w-4 h-4" />}
                    onClick={() => navigate('/profile')}
                  >
                    My Profile
                  </DropdownItem>
                  <DropdownItem
                    icon={<Package className="w-4 h-4" />}
                    onClick={() => navigate('/orders')}
                  >
                    My Orders
                  </DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem
                    destructive
                    icon={<LogOut className="w-4 h-4" />}
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Dropdown>
                <DropdownTrigger className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
                  <User className="w-4 h-4" />
                  <span>Account</span>
                </DropdownTrigger>
                <DropdownMenu align="right" width="w-48">
                  <DropdownItem
                    icon={<User className="w-4 h-4" />}
                    onClick={() => navigate('/login', { state: { role: 'user' } })}
                  >
                    Customer Login
                  </DropdownItem>
                  <DropdownItem
                    icon={<Store className="w-4 h-4" />}
                    onClick={() => navigate('/login', { state: { role: 'seller' } })}
                  >
                    Seller Portal
                  </DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem onClick={() => navigate('/signup')}>
                    Register Account
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </PageContainer>

      {/* Category Navigation Bar (Desktop) */}
      <div className="hidden md:block border-t border-slate-100 bg-slate-50/50">
        <PageContainer>
          <nav className="flex items-center gap-8 h-10 text-xs font-medium">
            {categoryLinks.map((cat) => (
              <NavLink
                key={cat.to}
                to={cat.to}
                end={cat.to === '/'}
                className={({ isActive }) =>
                  `h-full flex items-center transition-colors border-b-2 pt-0.5 ${
                    isActive
                      ? 'border-blue-600 text-blue-600 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`
                }
              >
                {cat.label}
              </NavLink>
            ))}
          </nav>
        </PageContainer>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-10 pl-10 pr-4 text-sm bg-slate-100 text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </form>

          {/* Mobile Category Links */}
          <div className="space-y-1 border-t border-slate-100 pt-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Categories
            </div>
            {categoryLinks.map((cat) => (
              <NavLink
                key={cat.to}
                to={cat.to}
                end={cat.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {cat.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Account Links */}
          <div className="space-y-1 border-t border-slate-100 pt-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Account & Orders
            </div>
            {user ? (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  <Package className="w-4 h-4 text-slate-500" />
                  <span>My Orders</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>My Profile</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/login', { state: { role: 'user' } });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg text-center"
                >
                  Customer Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/login', { state: { role: 'seller' } });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg text-center"
                >
                  Seller Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default CustomerHeader;
