import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { updateQuantity, removeFromCart, clearCart } from '../../../store/slices/cartSlice';
import axiosInstance from '../../../services/apiClient';
import { toast } from 'react-toastify';
import { getProductUrl } from '../../../utils/url';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="%23f1f5f9"><rect width="300" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="14" font-family="sans-serif">No Image Available</text></svg>';

export function CartPage() {
  const cart = useSelector((state) => state.cart || []);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Calculations
  const { totalItems, subtotal, shippingFee, finalTotal, freeShippingRemaining } = useMemo(() => {
    let itemsCount = 0;
    let total = 0;

    cart.forEach((item) => {
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const price = parseFloat(item.price) || 0;
      itemsCount += qty;
      total += price * qty;
    });

    const shipping = total > 500 || total === 0 ? 0 : 50;
    const remaining = Math.max(0, 500 - total);

    return {
      totalItems: itemsCount,
      subtotal: total,
      shippingFee: shipping,
      finalTotal: total + shipping,
      freeShippingRemaining: remaining,
    };
  }, [cart]);

  // Quantity Change Handler
  const handleQuantityChange = async (item, newQty) => {
    const maxStock = typeof item.stock === 'number' ? item.stock : 99;
    if (newQty < 1 || newQty > maxStock) return;

    const pId = (item._id || item.productId || item.id || '').toString();
    const pSize = item.size || '';

    dispatch(updateQuantity({ id: pId, size: pSize, quantity: newQty }));

    if (user?.role === 'user') {
      try {
        const cartId = item.cartItemId || pId;
        await axiosInstance.put(`/cart/update/${cartId}`, { quantity: newQty });
      } catch (err) {
        console.error('Failed to update cart on server:', err);
      }
    }
  };

  // Remove Item Handler
  const handleRemove = async (item) => {
    const pId = (item._id || item.productId || item.id || '').toString();
    const pSize = item.size || '';

    dispatch(removeFromCart({ id: pId, size: pSize }));
    toast.info('Item removed from cart');

    if (user?.role === 'user') {
      try {
        const cartId = item.cartItemId || pId;
        await axiosInstance.delete(`/cart/remove/${cartId}`);
      } catch (err) {
        console.error('Failed to remove cart item from server:', err);
      }
    }
  };

  // Clear Cart Handler
  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to empty your cart?')) return;
    dispatch(clearCart());

    if (user?.role === 'user') {
      try {
        await axiosInstance.delete('/cart/clear');
      } catch (err) {
        console.error('Failed to clear cart on server:', err);
      }
    }
  };

  // Empty Cart View
  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
          <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
          Looks like you haven&apos;t added any items to your bag yet. Explore our curated collections and discover great finds today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/wishlist"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            <span>View Saved Wishlist</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Shopping Cart</span>
            <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your selected items before proceeding to checkout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleClearCart}
            className="text-xs sm:text-sm text-slate-500 hover:text-rose-600 transition-colors font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Empty Cart</span>
          </button>
          <Link
            to="/"
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline flex items-center gap-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Cart Items List (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Progress Indicator */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm">
            {freeShippingRemaining > 0 ? (
              <div>
                <p className="text-slate-700 font-medium flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>
                    Add <strong className="text-blue-600">₹{freeShippingRemaining.toFixed(0)}</strong> more to get <strong>FREE Express Delivery</strong>!
                  </span>
                </p>
                <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, ((500 - freeShippingRemaining) / 500) * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-emerald-700 font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Congratulations! Your order qualifies for <strong>FREE Delivery</strong>.</span>
              </p>
            )}
          </div>

          {/* List of Line Items */}
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
            {cart.map((item) => {
              const pId = (item._id || item.productId || item.id || '').toString();
              const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
              const price = parseFloat(item.price) || 0;
              const lineTotal = price * qty;
              const maxStock = typeof item.stock === 'number' ? item.stock : 99;
              const isOutOfStock = maxStock <= 0;
              const isLowStock = maxStock > 0 && maxStock <= 5;
              const imgSrc = Array.isArray(item.images) ? item.images[0] : (item.images || FALLBACK_IMAGE);

              return (
                <div key={`${pId}-${item.size || ''}`} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                  {/* Product Image */}
                  <div className="w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-200/80">
                    <img
                      src={imgSrc}
                      alt={item.name}
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                      {item.brand && (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {item.brand}
                        </span>
                      )}
                      <Link
                        to={getProductUrl(item, item.name)}
                        className="text-base font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>

                      {/* Variant and Stock Indicators */}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                        {item.size && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-700">
                            Size: {item.size}
                          </span>
                        )}
                        {isOutOfStock ? (
                          <span className="text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-md">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                            Only {maxStock} left
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-medium">In Stock</span>
                        )}
                      </div>

                      {/* Price Display */}
                      <div className="mt-2 text-sm">
                        <span className="font-bold text-slate-900">₹{price.toFixed(2)}</span>
                        {qty > 1 && (
                          <span className="text-xs text-slate-400 ml-2">
                            (₹{price.toFixed(2)} each)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={qty <= 1}
                        onClick={() => handleQuantityChange(item, qty - 1)}
                        className="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-slate-800">
                        {qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={qty >= maxStock}
                        onClick={() => handleQuantityChange(item, qty + 1)}
                        className="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[80px]">
                      <div className="text-base font-bold text-slate-900">
                        ₹{lineTotal.toFixed(2)}
                      </div>
                    </div>

                    {/* Remove Action */}
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => handleRemove(item)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Box (4 Columns) */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal ({totalItems})</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₹${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax</span>
                <span className="text-slate-500">Included in price</span>
              </div>

              <div className="border-t border-slate-200 pt-4 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-900">Total Payable</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-900">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                  <p className="text-[11px] text-slate-400">Inclusive of all applicable duties</p>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust and Guarantee Badges */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Secure 256-bit SSL encrypted checkout</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Fast express delivery with live tracking</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <RotateCcw className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>7-day easy returns and replacement policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
