import { useEffect, useState } from 'react';
import axiosInstance from '../../../services/apiClient';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Package, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import BackArrow from '../../../components/common/BackArrow';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="%23f1f5f9"><rect width="300" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="14" font-family="sans-serif">No Image Available</text></svg>';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchOrders = async () => {
      try {
        const endpoint =
          user?.role === 'seller' ? '/orderDetail/allOrders' : '/orderDetail/userOrders';
        const res = await axiosInstance.get(endpoint);
        if (isMounted && res.data?.orders) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center gap-4 mb-6">
        <BackArrow size={24} />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {user?.role === 'seller' ? 'Customer Orders' : 'My Orders'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {user?.role === 'seller'
              ? 'Manage orders received for your store inventory.'
              : 'Track and review your previous purchases.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 mx-auto border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-slate-500">Loading orders...</p>
        </div>
      ) : orders?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
            <Package className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">No Orders Found</h2>
          <p className="text-slate-500 mb-6 text-sm max-w-sm">
            {user?.role === 'seller'
              ? 'You have not received any customer orders yet.'
              : 'Looks like you have not placed any orders yet. Start exploring our store today!'}
          </p>
          {user?.role !== 'seller' && (
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            // For seller, filter items to only products belonging to this seller
            const displayProducts =
              user?.role === 'seller'
                ? (order.products || []).filter(
                    (p) =>
                      p.sellerId &&
                      (p.sellerId.toString() === (user._id || user.id || '').toString())
                  )
                : order.products || [];

            if (displayProducts.length === 0 && user?.role === 'seller') return null;

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
              >
                {/* Order Top Banner */}
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-500">
                    <div>
                      <span className="font-medium text-slate-700">Order ID: </span>
                      <span className="font-mono text-slate-900 font-semibold">{order._id}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Payment: </span>
                      <span className="capitalize">{order.paymentMethod}</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Line Items List */}
                <div className="p-6 divide-y divide-slate-100">
                  {displayProducts.map((item, index) => {
                    const pId = item?.productId?._id || item?.productId || index;
                    const imgSrc = Array.isArray(item.images)
                      ? item.images[0]
                      : (item.images || FALLBACK_IMAGE);
                    const price = parseFloat(item.price) || 0;

                    return (
                      <div
                        key={`${pId}-${index}`}
                        className="py-4 first:pt-0 last:pb-0 flex items-center gap-4"
                      >
                        <div className="w-16 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                          <img
                            src={imgSrc}
                            alt={item.name}
                            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-800">
                              ₹{price.toFixed(2)} each
                            </span>
                          </div>
                        </div>

                        {item.productId && (
                          <button
                            type="button"
                            onClick={() => navigate(`/item-detail/${item.productId}`)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline flex items-center gap-1 ml-auto"
                          >
                            <span>View Product</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Order Footer */}
                <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-3">
                  <div className="text-xs text-slate-500">
                    <span>Delivered to: </span>
                    <strong className="text-slate-700">{order.name}</strong> ({order.city}, {order.state})
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-500">Total:</span>
                    <span className="text-lg font-bold text-slate-900">
                      ₹{order.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;