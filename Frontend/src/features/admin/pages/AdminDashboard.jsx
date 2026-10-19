import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  PackageCheck,
  Tags,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import axiosInstance from '../../../services/apiClient';
import { toast } from 'react-toastify';
import Spinner from '../../../components/ui/Spinner';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/stats');
      if (res.data?.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleApproveProduct = async (productId) => {
    try {
      setActionLoading(`prod-${productId}`);
      const res = await axiosInstance.put(`/admin/products/${productId}/approval`, {
        approvalStatus: 'approved',
      });
      if (res.data?.success) {
        toast.success('Product approved and published to storefront!');
        fetchStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve product');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectProduct = async (productId) => {
    try {
      setActionLoading(`prod-${productId}`);
      const res = await axiosInstance.put(`/admin/products/${productId}/approval`, {
        approvalStatus: 'rejected',
      });
      if (res.data?.success) {
        toast.info('Product marked as rejected.');
        fetchStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject product');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAcceptSeller = async (sellerId) => {
    try {
      setActionLoading(`seller-${sellerId}`);
      const res = await axiosInstance.put(`/admin/sellers/${sellerId}/status`, {
        status: 'active',
      });
      if (res.data?.success) {
        toast.success('Seller approved & enabled successfully!');
        fetchStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update seller');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveCategory = async (categoryId) => {
    try {
      setActionLoading(`cat-${categoryId}`);
      const res = await axiosInstance.put(`/admin/categories/${categoryId}/approval`, {
        approvalStatus: 'approved',
      });
      if (res.data?.success) {
        toast.success('Category approved for storefront taxonomy!');
        fetchStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve category');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-slate-500 font-medium">Loading platform overview...</p>
      </div>
    );
  }

  const s = stats?.stats || {};
  const pendingProducts = stats?.recentPendingProducts || [];
  const pendingSellers = stats?.recentPendingSellers || [];
  const pendingCategories = stats?.recentPendingCategories || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Administrative Authority Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Platform Operations & Approvals
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Review and accept seller registrations, approve catalog inventory submissions before they appear on the storefront, and moderate store taxonomy.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/sellers"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shadow-sm transition-all"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Review Sellers ({s.sellers?.pending || 0} pending)</span>
            </Link>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold shadow-sm transition-all"
            >
              <PackageCheck className="w-4 h-4 text-white" />
              <span>Audit Products ({s.products?.pending || 0} pending)</span>
            </Link>
            <button
              type="button"
              onClick={fetchStats}
              title="Refresh Stats"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Pending Products Metric */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Products
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {s.products?.pending || 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {s.products?.approved || 0} approved in store catalog
          </p>
        </div>

        {/* Sellers Metric */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Sellers
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {s.sellers?.active || 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {s.sellers?.pending || 0} pending • {s.sellers?.disabled || 0} disabled
          </p>
        </div>

        {/* Categories Metric */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Categories
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Tags className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {s.categories?.approved || 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {s.categories?.pending || 0} pending seller proposals
          </p>
        </div>

        {/* Total Orders / Revenue Metric */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Gross Volume
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            ₹{(s.orders?.revenue || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Across {s.orders?.total || 0} customer orders
          </p>
        </div>
      </div>

      {/* Review Queue: Pending Products */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-indigo-600" />
              <span>Pending Product Submissions</span>
              {pendingProducts.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                  {pendingProducts.length} new
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These products will remain hidden from the storefront until approved.
            </p>
          </div>

          <Link
            to="/admin/products"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingProducts.length === 0 ? (
          <div className="py-10 text-center text-slate-400 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">All caught up!</p>
            <p className="text-xs text-slate-400">There are no products currently waiting for admin review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingProducts.map((prod) => (
              <div
                key={prod._id}
                className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all shadow-xs"
              >
                <div>
                  <div className="flex gap-3 mb-3">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'}
                      alt={prod.name}
                      className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                    />
                    <div className="min-w-0">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {prod.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 truncate mt-1">
                        {prod.name}
                      </h3>
                      <p className="text-sm font-semibold text-slate-900">
                        ₹{Number(prod.price).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 bg-slate-50 rounded-lg p-2 mb-3">
                    <p className="truncate">
                      <span className="font-medium text-slate-700">Seller:</span> {prod.seller?.name || 'Seller'}
                    </p>
                    <p className="truncate text-slate-400">{prod.seller?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={actionLoading === `prod-${prod._id}`}
                    onClick={() => handleApproveProduct(prod._id)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading === `prod-${prod._id}`}
                    onClick={() => handleRejectProduct(prod._id)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Queue: Pending Sellers & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Sellers */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Pending Seller Registrations</span>
              </h2>
              <p className="text-xs text-slate-500">Enable or review new merchant accounts</p>
            </div>
            <Link
              to="/admin/sellers"
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Manage ({s.sellers?.total || 0})
            </Link>
          </div>

          {pendingSellers.length === 0 ? (
            <div className="py-8 text-center text-slate-400 bg-slate-50/50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
              <p className="text-xs text-slate-500">No pending seller registrations.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingSellers.map((seller) => (
                <div
                  key={seller._id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {seller.fullname || seller.username}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{seller.email}</p>
                  </div>
                  <button
                    type="button"
                    disabled={actionLoading === `seller-${seller._id}`}
                    onClick={() => handleAcceptSeller(seller._id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0 transition-colors"
                  >
                    Accept & Enable
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Categories */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tags className="w-4 h-4 text-emerald-600" />
                <span>Seller Category Proposals</span>
              </h2>
              <p className="text-xs text-slate-500">Approve taxonomy additions</p>
            </div>
            <Link
              to="/admin/categories"
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Manage ({s.categories?.total || 0})
            </Link>
          </div>

          {pendingCategories.length === 0 ? (
            <div className="py-8 text-center text-slate-400 bg-slate-50/50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
              <p className="text-xs text-slate-500">No pending category proposals.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingCategories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">{cat.name}</p>
                    <p className="text-xs text-slate-400 truncate">
                      Under: {cat.parentCategory} • Proposed by: {cat.createdByName || 'Seller'}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={actionLoading === `cat-${cat._id}`}
                    onClick={() => handleApproveCategory(cat._id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
