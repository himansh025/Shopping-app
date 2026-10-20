import { useState, useEffect, useRef } from 'react';
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
  ShieldCheck,
  ChevronDown,
  Flame,
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
import MegaMenu from './MegaMenu';

export function CustomerHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState(null);
  const hoverTimeoutRef = useRef(null);

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

  // Fetch approved catalog categories for mega menu
  useEffect(() => {
    axiosInstance
      .get('/category/all')
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
        }
      })
      .catch((err) => console.error('Error fetching categories for header:', err));
  }, []);

  // Sync search input with Redux search
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
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

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
  }, [location.pathname]);

  // Mega menu hover delay logic to prevent accidental close
  const handleMouseEnter = (key) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveMegaMenu(key);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 160);
  };

  const navDepartments = [
    { key: null, label: 'All Products', to: '/' },
    { key: 'men', label: 'Men', to: '/men' },
    { key: 'women', label: 'Women', to: '/women' },
    { key: 'kids', label: 'Kids', to: '/boy' },
    { key: 'electronics', label: 'Electronics', to: '/electronics' },
  ];

  return (
    <header
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
      onMouseLeave={handleMouseLeave}
    >
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

            {/* Admin Portal Fast Shortcut */}
            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Admin Panel</span>
              </Link>
            )}

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
                  {user.role === 'admin' && (
                    <>
                      <DropdownItem
                        icon={<ShieldCheck className="w-4 h-4 text-purple-600" />}
                        onClick={() => navigate('/admin/dashboard')}
                      >
                        <span className="font-semibold text-purple-700">Admin Control Panel</span>
                      </DropdownItem>
                      <DropdownSeparator />
                    </>
                  )}
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

      {/* Category Navigation Bar (Desktop) with Mega Menu Triggers */}
      <div className="hidden md:block border-t border-slate-100 bg-slate-50/70 relative">
        <PageContainer>
          <nav className="flex items-center justify-between h-11 text-xs font-medium">
            <div className="flex items-center gap-1 lg:gap-2 h-full">
              {navDepartments.map((dept) => {
                const isActive = activeMegaMenu === dept.key;
                return (
                  <div
                    key={dept.label}
                    className="h-full flex items-center relative"
                    onMouseEnter={() => dept.key && handleMouseEnter(dept.key)}
                  >
                    <NavLink
                      to={dept.to}
                      end={dept.to === '/'}
                      className={({ isActive: isRouteActive }) =>
                        `h-full px-3.5 flex items-center gap-1.5 transition-all border-b-2 font-semibold ${
                          isActive || isRouteActive
                            ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                            : 'border-transparent text-slate-700 hover:text-slate-950 hover:bg-slate-100/70'
                        }`
                      }
                    >
                      <span>{dept.label}</span>
                      {dept.key && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isActive ? 'rotate-180 text-blue-600' : 'text-slate-400'
                          }`}
                        />
                      )}
                    </NavLink>
                  </div>
                );
              })}
            </div>

            {/* Right Promo / Sale Quick Link */}
            <div className="flex items-center gap-3">
              <Link
                to="/category/Men's Clothing"
                className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 transition-colors py-1 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100/80 border border-rose-200/60"
              >
                <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>CLEARANCE SALE</span>
                <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-extrabold ml-1">
                  UP TO 50%
                </span>
              </Link>
            </div>
          </nav>
        </PageContainer>

        {/* Desktop Mega Menu Dropdown */}
        {activeMegaMenu && (
          <MegaMenu
            activeKey={activeMegaMenu}
            categories={categories}
            onClose={() => setActiveMegaMenu(null)}
          />
        )}
      </div>

      {/* Mobile Drawer Navigation with Accordion Mega Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-150">
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

          {/* Mobile Category Links with Accordion Subcategories */}
          <div className="space-y-1 border-t border-slate-100 pt-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Departments &amp; Categories
            </div>

            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-100'
                }`
              }
            >
              All Products
            </NavLink>

            {/* Accordion for Departments */}
            {[
              { key: 'Men', label: 'Men’s Fashion', to: '/men' },
              { key: 'Women', label: 'Women’s Luxury', to: '/women' },
              { key: 'Kids', label: 'Kids & Teens', to: '/boy' },
              { key: 'Electronics', label: 'Electronics & Audio', to: '/electronics' },
            ].map((dept) => {
              const isExpanded = mobileExpandedGroup === dept.key;
              const subCats = categories.filter((c) => {
                if (dept.key === 'Kids') return ['Boy', 'Girl'].includes(c.parentCategory);
                return c.parentCategory === dept.key;
              });

              return (
                <div key={dept.key} className="rounded-xl border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between bg-slate-50/70 px-3 py-2">
                    <NavLink
                      to={dept.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-semibold text-slate-800 hover:text-blue-600"
                    >
                      {dept.label}
                    </NavLink>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileExpandedGroup(isExpanded ? null : dept.key)
                      }
                      className="p-1 text-slate-500 hover:text-slate-800"
                      aria-label="Expand department"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="p-2 space-y-1 bg-white border-t border-slate-100">
                      {subCats.map((cat) => (
                        <Link
                          key={cat._id || cat.name}
                          to={`/category/${encodeURIComponent(cat.name)}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg"
                        >
                          {cat.name}
                        </Link>
                      ))}
                      <Link
                        to={dept.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-1.5 text-xs font-bold text-blue-600"
                      >
                        Explore All {dept.label} →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Account Links */}
          <div className="space-y-1 border-t border-slate-100 pt-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Account &amp; Orders
            </div>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 mb-1"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Admin Control Panel</span>
                  </Link>
                )}
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
