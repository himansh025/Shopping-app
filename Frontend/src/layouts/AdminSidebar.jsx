/* eslint-disable react/prop-types */
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  PackageCheck,
  Tags,
  Store,
  LogOut,
  X,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import axiosInstance from '../services/apiClient';

export function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/user/logout');
    } catch (err) {
      console.error('Admin logout error:', err);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  const navItems = [
    { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Manage Sellers', to: '/admin/sellers', icon: Users, end: false },
    { label: 'Product Reviews', to: '/admin/products', icon: PackageCheck, end: false },
    { label: 'Categories', to: '/admin/categories', icon: Tags, end: false },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-white leading-tight">
              Admin Portal
            </h2>
            <p className="text-[10px] text-indigo-400 font-semibold tracking-wide uppercase">
              MyShop Platform Control
            </p>
          </div>
        </div>

        {mobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Platform Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => mobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Storefront
        </div>
        <NavLink
          to="/"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Store className="w-4 h-4 shrink-0 text-slate-400" />
            <span>Customer Store</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
        </NavLink>
      </div>

      {/* Admin Profile & Logout Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center text-sm">
            {user?.fullname ? user.fullname.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.fullname || 'Administrator'}
            </p>
            <p className="text-xs text-indigo-400 truncate font-mono">
              {user?.email || 'admin@myshop.com'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg border border-rose-900/40 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[80vw] h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;
