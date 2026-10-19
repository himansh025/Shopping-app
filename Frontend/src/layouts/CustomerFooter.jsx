import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import PageContainer from './PageContainer';

export function CustomerFooter() {
  return (
    <footer className="mt-auto bg-[#090d16] text-slate-300 border-t border-slate-800/80">
      <PageContainer className="py-12 sm:py-16">
        {/* Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Identity & Mission (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 text-white font-black text-xl tracking-tight group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-white text-lg font-bold">Shopping App</span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Discover curated apparel, designer streetwear, footwear, and consumer electronics delivered directly from verified merchants.
            </p>
          </div>

          {/* Department Links (Col 5-6) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Departments
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
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
                  Electronics & Tech
                </Link>
              </li>
              <li>
                <Link to="/boy" className="hover:text-white transition-colors">
                  Boy&apos;s Fashion
                </Link>
              </li>
              <li>
                <Link to="/girl" className="hover:text-white transition-colors">
                  Girl&apos;s Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support & Account (Col 7-9) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Track Your Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Account & Profile Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Merchant Hub (Col 10-12) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Merchant Partner Portal
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you a verified brand, boutique atelier, or merchant? List your catalog and reach active buyers nationwide.
            </p>
            <div className="pt-1">
              <Link
                to="/login"
                state={{ role: 'seller' }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all group active:scale-95"
              >
                <span>Seller Login & Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Shopping App. All rights reserved.</p>

          <div className="flex items-center gap-5 text-slate-500 text-xs">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Return Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Security</span>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}

export default CustomerFooter;
