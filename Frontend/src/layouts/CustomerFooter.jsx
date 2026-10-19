import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, Clock } from 'lucide-react';
import PageContainer from './PageContainer';

export function CustomerFooter() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Value props bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <PageContainer className="py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Reliable Shipping</h4>
                <p className="text-xs text-slate-400 mt-0.5">Quick dispatch on all confirmed orders</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Secure Checkout</h4>
                <p className="text-xs text-slate-400 mt-0.5">Razorpay & Cash on Delivery supported</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">24/7 AI Assistance</h4>
                <p className="text-xs text-slate-400 mt-0.5">Instant help with orders and inventory</p>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Main footer links */}
      <PageContainer className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & mission */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span>MyShop</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discover quality fashion, apparel, and electronics curated for modern lifestyles.
            </p>
          </div>

          {/* Shop categories */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/men" className="hover:text-white transition-colors">
                  Men&apos;s Collection
                </Link>
              </li>
              <li>
                <Link to="/women" className="hover:text-white transition-colors">
                  Women&apos;s Collection
                </Link>
              </li>
              <li>
                <Link to="/electronics" className="hover:text-white transition-colors">
                  Electronics & Gadgets
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer account */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              My Account
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Profile & Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Seller / Partners */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Seller Hub
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Become a verified seller and reach thousands of daily shoppers.
            </p>
            <Link
              to="/login"
              state={{ role: 'seller' }}
              className="inline-flex items-center text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Seller Login & Portal &rarr;
            </Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center sm:flex sm:justify-between sm:items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} MyShop. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built with modern React and Tailwind CSS</p>
        </div>
      </PageContainer>
    </footer>
  );
}

export default CustomerFooter;
