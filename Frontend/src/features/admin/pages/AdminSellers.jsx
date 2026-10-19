import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Calendar,
  Store,
  RefreshCw,
  Mail,
  Phone,
} from 'lucide-react';
import axiosInstance from '../../../services/apiClient';
import { toast } from 'react-toastify';
import Spinner from '../../../components/ui/Spinner';

export function AdminSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchSellers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/sellers', {
        params: {
          status: statusFilter,
          search: search || undefined,
        },
      });
      if (res.data?.success) {
        setSellers(res.data.sellers || []);
      }
    } catch (err) {
      console.error('Error fetching sellers:', err);
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const handleUpdateStatus = async (sellerId, newStatus) => {
    try {
      setActionLoading(`${sellerId}-${newStatus}`);
      const res = await axiosInstance.put(`/admin/sellers/${sellerId}/status`, {
        status: newStatus,
      });
      if (res.data?.success) {
        toast.success(res.data.message || `Seller status updated to ${newStatus}`);
        fetchSellers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update seller status');
    } finally {
      setActionLoading(null);
    }
  };

  const counts = {
    all: sellers.length,
    active: sellers.filter((s) => s.status === 'active').length,
    pending: sellers.filter((s) => s.status === 'pending').length,
    disabled: sellers.filter((s) => s.status === 'disabled').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>Manage Sellers & Merchants</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Accept pending merchant applications, or enable/disable seller storefront privileges.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSellers}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto">
          {[
            { id: 'all', label: `All Sellers (${counts.all})` },
            { id: 'pending', label: `Pending Approval (${counts.pending})` },
            { id: 'active', label: `Active (${counts.active})` },
            { id: 'disabled', label: `Disabled (${counts.disabled})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, brand..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Sellers List */}
      {loading ? (
        <div className="py-16 text-center">
          <Spinner size="lg" />
          <p className="text-xs text-slate-500 mt-2">Loading sellers...</p>
        </div>
      ) : sellers.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
          <Store className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No sellers found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search query or filter tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sellers.map((seller) => {
            const isPending = seller.status === 'pending';
            const isActive = seller.status === 'active';
            const isDisabled = seller.status === 'disabled';

            return (
              <div
                key={seller._id}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-xs ${
                  isDisabled
                    ? 'border-rose-200 bg-rose-50/20'
                    : isPending
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Card Header: Name & Status */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-900 truncate">
                        {seller.fullname || seller.username}
                      </h3>
                      {seller.businessName && (
                        <p className="text-xs text-indigo-600 font-semibold truncate">
                          {seller.businessName}
                        </p>
                      )}
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isPending
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {seller.status || 'Active'}
                    </span>
                  </div>

                  {/* Seller Contact Info */}
                  <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{seller.email}</span>
                    </div>
                    {seller.phoneNumber && (
                      <div className="flex items-center gap-2 text-slate-600 truncate">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{seller.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Joined {new Date(seller.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Product Inventory Counts */}
                  <div className="grid grid-cols-2 gap-2 text-center mb-4">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Products</span>
                      <p className="text-sm font-bold text-slate-800">{seller.productCount || 0}</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Pending Review</span>
                      <p className="text-sm font-bold text-amber-600">{seller.pendingProductCount || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="pt-3 border-t border-slate-100">
                  {isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={actionLoading === `${seller._id}-active`}
                        onClick={() => handleUpdateStatus(seller._id, 'active')}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Accept & Enable</span>
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === `${seller._id}-disabled`}
                        onClick={() => handleUpdateStatus(seller._id, 'disabled')}
                        className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {isActive && (
                    <button
                      type="button"
                      disabled={actionLoading === `${seller._id}-disabled`}
                      onClick={() => handleUpdateStatus(seller._id, 'disabled')}
                      className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Disable Seller</span>
                    </button>
                  )}

                  {isDisabled && (
                    <button
                      type="button"
                      disabled={actionLoading === `${seller._id}-active`}
                      onClick={() => handleUpdateStatus(seller._id, 'active')}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Enable / Reactivate Seller</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminSellers;
