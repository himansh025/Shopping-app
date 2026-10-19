import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  CreditCard,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
  Package,
  AlertCircle,
  LogIn,
} from 'lucide-react';
import axiosInstance from '../../../services/apiClient';
import { clearCart } from '../../../store/slices/cartSlice';
import { toast } from 'react-toastify';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="%23f1f5f9"><rect width="300" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="14" font-family="sans-serif">No Image Available</text></svg>';

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const buyNowId = searchParams.get('buyNow');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart || []);
  const { items: allProducts } = useSelector((state) => state.products);

  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [loadingBuyNow, setLoadingBuyNow] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // If Buy Now is triggered, fetch/find single product
  useEffect(() => {
    if (buyNowId) {
      const found = allProducts?.find((p) => (p._id || p.id) === buyNowId);
      if (found) {
        setBuyNowProduct({ ...found, quantity: 1 });
      } else {
        setLoadingBuyNow(true);
        axiosInstance
          .get(`/products/${buyNowId}`)
          .then((res) => {
            if (res.data?.product) {
              setBuyNowProduct({ ...res.data.product, quantity: 1 });
            }
          })
          .catch((err) => console.error('Failed to load Buy Now product:', err))
          .finally(() => setLoadingBuyNow(false));
      }
    } else {
      setBuyNowProduct(null);
    }
  }, [buyNowId, allProducts]);

  // Determine active checkout items
  const checkoutItems = useMemo(() => {
    if (buyNowProduct) {
      return [buyNowProduct];
    }
    return cart;
  }, [buyNowProduct, cart]);

  // Calculations
  const { subtotal, shippingFee, finalTotal } = useMemo(() => {
    let total = 0;
    checkoutItems.forEach((item) => {
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const price = parseFloat(item.price) || 0;
      total += price * qty;
    });
    const shipping = total > 500 || total === 0 ? 0 : 50;
    return {
      subtotal: total,
      shippingFee: shipping,
      finalTotal: total + shipping,
    };
  }, [checkoutItems]);

  // Form Initial Values
  const initialValues = {
    name: user?.fullname || user?.username || '',
    email: user?.email || '',
    phone: user?.phone ? user.phone.toString() : '',
    address: '',
    city: '',
    state: '',
    zip: '',
    landmark: '',
    paymentMethod: 'COD',
  };

  // Form Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().trim().required('Full name is required'),
    email: Yup.string().email('Valid email is required').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),
    address: Yup.string().trim().required('Street address is required'),
    city: Yup.string().trim().required('City is required'),
    state: Yup.string().trim().required('State is required'),
    zip: Yup.string()
      .matches(/^[0-9]{6}$/, 'Postal PIN code must be 6 digits')
      .required('ZIP / PIN code is required'),
    landmark: Yup.string().trim(),
    paymentMethod: Yup.string()
      .oneOf(['COD', 'Online'], 'Invalid payment method')
      .required('Select payment method'),
  });

  // Razorpay Handler
  const launchRazorpayModal = (orderPayload, values) => {
    if (!window.Razorpay) {
      toast.error('Payment gateway is loading. Please try again.');
      setIsSubmittingOrder(false);
      return;
    }

    const options = {
      key: orderPayload.razorpay?.key || RAZORPAY_KEY,
      amount: orderPayload.razorpay?.amount,
      currency: 'INR',
      name: 'ShopNow Store',
      description: `Payment for Order #${orderPayload.orderId || ''}`,
      order_id: orderPayload.razorpay?.orderId,
      handler: async function (response) {
        try {
          const verifyRes = await axiosInstance.post('/order/verifyPayment', {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          if (verifyRes.data?.success) {
            toast.success('Payment verified successfully!');
            if (!buyNowProduct) {
              dispatch(clearCart());
            }
            setConfirmedOrder({
              _id: verifyRes.data.orderId || orderPayload.orderId,
              totalAmount: finalTotal,
              paymentMethod: 'Online',
              status: 'Paid',
              shippingAddress: {
                name: values.name,
                address: values.address,
                city: values.city,
                state: values.state,
                zip: values.zip,
              },
            });
          } else {
            toast.error('Payment verification failed.');
          }
        } catch (err) {
          console.error('Verification error:', err);
          toast.error(err.response?.data?.message || 'Payment verification encountered an issue.');
        } finally {
          setIsSubmittingOrder(false);
        }
      },
      prefill: {
        name: values.name,
        email: values.email,
        contact: values.phone,
      },
      theme: { color: '#2563eb' },
      modal: {
        ondismiss: function () {
          setIsSubmittingOrder(false);
          toast.warning('Payment window closed. Your cart items are preserved.');
        },
      },
    };

    const rzpInstance = new window.Razorpay(options);
    rzpInstance.on('payment.failed', function (resp) {
      setIsSubmittingOrder(false);
      toast.error(resp.error?.description || 'Online payment failed. Please retry.');
    });
    rzpInstance.open();
  };

  // Form Submit Handler
  const handleOrderSubmit = async (values) => {
    if (!user) {
      toast.info('Please sign in to complete your checkout');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (checkoutItems.length === 0) {
      toast.error('Your order contains no items');
      return;
    }

    setIsSubmittingOrder(true);

    try {
      // Build normalized payload
      const orderItems = checkoutItems.map((item) => ({
        productId: (item._id || item.productId || item.id || '').toString(),
        quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
        size: item.size || '',
      }));

      const res = await axiosInstance.post('/order/createOrder', {
        values,
        items: orderItems,
      });

      if (res.data?.success) {
        if (values.paymentMethod === 'Online') {
          launchRazorpayModal(res.data, values);
        } else {
          // COD Order confirmed directly
          toast.success('Order placed successfully!');
          if (!buyNowProduct) {
            dispatch(clearCart());
          }
          setConfirmedOrder(res.data.order);
          setIsSubmittingOrder(false);
        }
      }
    } catch (err) {
      setIsSubmittingOrder(false);
      console.error('Order submission error:', err);
      toast.error(err.response?.data?.message || 'Failed to create order. Please try again.');
    }
  };

  // Order Confirmation Screen
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner">
          <CheckCircle2 className="w-12 h-12 stroke-[1.5]" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Thank You! Your Order is Confirmed
        </h1>
        <p className="text-slate-500 mb-6 text-base">
          We&apos;ve received your order and our merchants are preparing your items for shipment.
        </p>

        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 max-w-lg mx-auto text-left space-y-4 mb-8">
          <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
            <span className="text-slate-500">Order Reference</span>
            <span className="font-mono font-bold text-slate-900">
              {confirmedOrder._id || confirmedOrder.orderDetails?.orderId}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
            <span className="text-slate-500">Payment Method</span>
            <span className="font-semibold text-slate-800">
              {confirmedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment (Razorpay)'}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
            <span className="text-slate-500">Total Amount</span>
            <span className="font-bold text-base text-slate-900">
              ₹{confirmedOrder.totalAmount?.toFixed(2) || finalTotal.toFixed(2)}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-slate-500 block mb-1">Delivering to:</span>
            <span className="font-medium text-slate-800 block">
              {confirmedOrder.name || confirmedOrder.shippingAddress?.name}
            </span>
            <span className="text-slate-600 block text-xs">
              {confirmedOrder.address || confirmedOrder.shippingAddress?.address},{' '}
              {confirmedOrder.city || confirmedOrder.shippingAddress?.city},{' '}
              {confirmedOrder.state || confirmedOrder.shippingAddress?.state} -{' '}
              {confirmedOrder.zip || confirmedOrder.shippingAddress?.zip}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition"
          >
            <Package className="w-4 h-4" />
            <span>View My Orders</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Empty checkout items check
  if (!loadingBuyNow && checkoutItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Items to Check Out</h2>
        <p className="text-slate-500 mb-6 text-sm">
          Your shopping cart is currently empty. Add products before proceeding to checkout.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {buyNowProduct ? 'Complete your single-item direct purchase.' : 'Provide shipping address and select payment method to place your order.'}
        </p>
      </div>

      {/* Guest Sign-in Banner if unauthenticated */}
      {!user && (
        <div className="mb-8 p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogIn className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Have an account?</p>
              <p className="text-xs text-blue-700">Sign in now for faster checkout, order tracking, and auto-filled addresses.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/login', { state: { from: '/checkout' } })}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
          >
            Sign In
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Shipping & Payment Form (7 Cols) */}
        <div className="lg:col-span-7">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleOrderSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-8">
                {/* Section 1: Shipping Address */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm">
                      1
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Shipping Details</h2>
                      <p className="text-xs text-slate-500">Where should we deliver your order?</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <Field
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <ErrorMessage name="name" component="div" className="text-rose-600 text-xs mt-1" />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <Field
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <ErrorMessage name="email" component="div" className="text-rose-600 text-xs mt-1" />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number (10 digits) *
                      </label>
                      <Field
                        type="tel"
                        name="phone"
                        maxLength="10"
                        placeholder="9876543210"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <ErrorMessage name="phone" component="div" className="text-rose-600 text-xs mt-1" />
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Street Address *
                      </label>
                      <Field
                        as="textarea"
                        name="address"
                        rows="2"
                        placeholder="Flat / House No., Building, Street Name"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <ErrorMessage name="address" component="div" className="text-rose-600 text-xs mt-1" />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        City *
                      </label>
                      <Field
                        type="text"
                        name="city"
                        placeholder="e.g. Mumbai"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <ErrorMessage name="city" component="div" className="text-rose-600 text-xs mt-1" />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        State *
                      </label>
                      <Field
                        type="text"
                        name="state"
                        placeholder="e.g. Maharashtra"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <ErrorMessage name="state" component="div" className="text-rose-600 text-xs mt-1" />
                    </div>

                    {/* Zip */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        PIN / ZIP Code (6 digits) *
                      </label>
                      <Field
                        type="text"
                        name="zip"
                        maxLength="6"
                        placeholder="400001"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <ErrorMessage name="zip" component="div" className="text-rose-600 text-xs mt-1" />
                    </div>

                    {/* Landmark */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Landmark (Optional)
                      </label>
                      <Field
                        type="text"
                        name="landmark"
                        placeholder="e.g. Near City Center"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Payment Method */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm">
                      2
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Payment Method</h2>
                      <p className="text-xs text-slate-500">Choose how you want to pay</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* COD Option */}
                    <label
                      className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition ${
                        values.paymentMethod === 'COD'
                          ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={values.paymentMethod === 'COD'}
                        onChange={() => setFieldValue('paymentMethod', 'COD')}
                        className="mt-1 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-5 h-5 text-emerald-600" />
                          <span className="font-semibold text-sm text-slate-900">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Pay cash or UPI upon delivery at your doorstep with verified receipt.
                        </p>
                      </div>
                    </label>

                    {/* Razorpay Online Option */}
                    <label
                      className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition ${
                        values.paymentMethod === 'Online'
                          ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online"
                        checked={values.paymentMethod === 'Online'}
                        onChange={() => setFieldValue('paymentMethod', 'Online')}
                        className="mt-1 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-sm text-slate-900">
                            Online Payment (Razorpay)
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Instant, secure payment via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Final Confirmation Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmittingOrder}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  {isSubmittingOrder ? (
                    <span>Processing Order...</span>
                  ) : values.paymentMethod === 'Online' ? (
                    <span>Pay ₹{finalTotal.toFixed(2)} via Razorpay</span>
                  ) : (
                    <span>Confirm COD Order (₹{finalTotal.toFixed(2)})</span>
                  )}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Right Column: Order Review & Pricing Summary (5 Cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {checkoutItems.length} {checkoutItems.length === 1 ? 'item' : 'items'}
              </span>
            </h2>

            {/* Item Thumbnails List */}
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 space-y-3 pr-1">
              {checkoutItems.map((item) => {
                const pId = (item._id || item.productId || item.id || '').toString();
                const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
                const price = parseFloat(item.price) || 0;
                const imgSrc = Array.isArray(item.images)
                  ? item.images[0]
                  : (item.images || FALLBACK_IMAGE);

                return (
                  <div key={`${pId}-${item.size || ''}`} className="pt-3 first:pt-0 flex items-center gap-3">
                    <div className="w-14 h-16 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden flex-shrink-0">
                      <img
                        src={imgSrc}
                        alt={item.name}
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>Qty: {qty}</span>
                        {item.size && <span>• Size: {item.size}</span>}
                      </div>
                      <p className="text-xs font-bold text-slate-800 mt-1">
                        ₹{(price * qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-slate-200 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span className="font-semibold text-slate-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₹${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-base">Total Payable</span>
                <span className="text-2xl font-bold text-slate-900">
                  ₹{finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Trust Points */}
            <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-slate-500">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted & Verified Online Payments</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Express Insured Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
