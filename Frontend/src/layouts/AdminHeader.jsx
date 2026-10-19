/* eslint-disable react/prop-types */
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, ShieldCheck, Store } from 'lucide-react';
import Badge from '../components/ui/Badge';

export function AdminHeader({ setMobileOpen }) {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const getPageInfo = (pathname) => {
    switch (pathname) {
      case '/admin':
      case '/admin/dashboard':
        return {
          title: 'System Overview & Approvals',
          subtitle: 'Live platform operations, pending merchant audits, and catalog approvals',
        };
      case '/admin/sellers':
        return {
          title: 'Seller & Merchant Controls',
          subtitle: 'Audit, accept, enable, or disable registered sellers on MyShop',
        };
      case '/admin/products':
        return {
          title: 'Product Reviews & Catalog',
          subtitle: 'Approve or reject seller product submissions, or publish official catalog items',
        };
      case '/admin/categories':
        return {
          title: 'Category Taxonomy Approvals',
          subtitle: 'Review seller-proposed categories and configure storefront departments',
        };
      default:
        return {
          title: 'Admin Control Center',
          subtitle: 'Platform administrative authority & management',
        };
    }
  };

  const { title, subtitle } = getPageInfo(location.pathname);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open admin sidebar"
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="hidden sm:block text-[11px] text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Store className="w-3.5 h-3.5 text-slate-500" />
          <span>View Storefront</span>
        </Link>

        {/* Administrator badge */}
        <Badge variant="indigo" size="sm" dot className="hidden md:inline-flex">
          Super Admin
        </Badge>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="hidden lg:inline text-xs font-semibold text-slate-800">
            {user?.fullname || 'Administrator'}
          </span>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
