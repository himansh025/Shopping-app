/* eslint-disable react/prop-types */
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, User } from 'lucide-react';
import Badge from '../components/ui/Badge';

export function SellerHeader({ setMobileOpen }) {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
      case '/dashboard':
        return 'Merchant Dashboard';
      case '/add':
        return 'Add New Product';
      case '/orders':
        return 'Order Management';
      case '/profile':
        return 'Seller Business Profile';
      default:
        return 'Seller Portal';
    }
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open seller sidebar"
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {pageTitle}
          </h1>
          <p className="hidden sm:block text-[11px] text-slate-500">
            Manage your catalog, fulfill orders, and monitor sales
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Merchant status badge */}
        <Badge variant="success" size="sm" dot className="hidden sm:inline-flex">
          Verified Seller
        </Badge>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-xs">
            <User className="w-4 h-4" />
          </div>
          <span className="hidden md:inline text-xs font-semibold text-slate-800">
            {user?.businessName || user?.fullname || 'Seller'}
          </span>
        </div>
      </div>
    </header>
  );
}

export default SellerHeader;
