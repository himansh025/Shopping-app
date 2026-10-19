import { Link, Outlet } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

/**
 * Dedicated Authentication Layout Shell
 */
export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 text-slate-900 antialiased">
      {/* Auth Top Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200/50 bg-white/60 backdrop-blur-xs">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-slate-900 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-600/20 group-hover:bg-blue-700 transition-colors">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            MyShop
          </span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-white/80 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </Link>
      </header>

      {/* Centered Auth Card Region */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200/40">
        <p>&copy; {new Date().getFullYear()} MyShop. Secure e-commerce authentication.</p>
      </footer>
    </div>
  );
}

export default AuthLayout;
