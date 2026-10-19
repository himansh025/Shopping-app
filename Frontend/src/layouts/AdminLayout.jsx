import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

/**
 * Dedicated Admin Management Panel Layout Shell with Guard
 */
export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Admin Portal Restricted</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            This administration gateway is restricted to authorized platform administrators only. Please log in with your administrative credentials.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Admin Sign In</span>
            </Link>
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100/90 text-slate-900 antialiased">
      {/* Responsive Admin Sidebar */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
