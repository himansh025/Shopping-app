import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  ArrowRight,
  Lock,
  Headphones,
} from 'lucide-react';
import PageContainer from './PageContainer';

export function CustomerFooter() {
  return (
    <footer className="mt-auto bg-[#090d16] text-slate-300 border-t border-slate-800/80 relative overflow-hidden">
      {/* Top Value Propositions Strip */}
      <div className="border-b border-slate-800/60 bg-slate-950/60">
        <PageContainer className="py-7 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Express Shipping</h4>
                <p className="text-xs text-slate-400 mt-0.5">Free dispatch on orders over ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">100% Genuine Origin</h4>
                <p className="text-xs text-slate-400 mt-0.5">Strict quality & authenticity checks</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">7-Day Easy Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">Instant door-step pickup & exchange</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">24/7 AI Assistance</h4>
                <p className="text-xs text-slate-400 mt-0.5">Instant styling & order resolution</p>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Main Footer Navigation Columns */}
      <PageContainer className="py-12 sm:py-16">
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

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Secured</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Verified Direct Sellers</span>
              </span>
            </div>
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

          {/* Merchant Hub & Verification (Col 10-12) */}
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
            <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-500">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Automated Payouts & Inventory Management</span>
            </div>
          </div>
        </div>

        {/* Accepted Payment Badges & Trust Strip */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Supported Payments:</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-semibold text-slate-300">
              UPI (GPay / PhonePe / Paytm)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-semibold text-slate-300">
              Razorpay Online Gateway
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-semibold text-slate-300">
              Visa / Mastercard / RuPay
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-semibold text-slate-300">
              Cash on Delivery (COD)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Original Guarantee</span>
            </span>
            <span>•</span>
            <span>Fast Express Dispatch</span>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="mt-8 pt-6 border-t border-slate-900/90 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
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
