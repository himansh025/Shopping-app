import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../Config/apiConfig";
import { toast } from "react-toastify";
import BackArrow from "./BackArrow";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

const PlaceOrder = () => {
  const [orderStatus, setorderStatus] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [ProductDetail, setProductDetail] = useState("");
  const { items } = useSelector((state) => state.products)
  const { id } = useParams()
  const item = items.find((item) => item._id == id)

  useEffect(() => {
    setProductDetail(item)
  }, [id, item])

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    paymentMethod: "COD",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid phone number")
      .required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    quantity: Yup.number(),
    zip: Yup.string()
      .matches(/^[0-9]{6}$/, "Invalid ZIP code")
      .required("ZIP code is required"),
    paymentMethod: Yup.string().required("Payment method is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    // console.log("Order Place:", values);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/order/createOrder", {
        values,
        productDetails: {
          name: ProductDetail.name,
          id: ProductDetail._id,
          price: ProductDetail.price,
          quantity: quantity,
          sellerId: ProductDetail.seller.sellerId
        }
      })
      setIsLoading(false);
      // console.log("Order Placed:", response.data);
      if (values.paymentMethod == "Online") {
        openRazorpay(response.data);
        resetForm();
      } else {
        toast.success("Order placed successfully!")
        // alert("Order placed successfully!");
        resetForm();
      }
    }
    catch (error) {
      setIsLoading(false);
      console.error("Error placing order:", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  }

  const openRazorpay = (paymentData) => {
    // console.log("razon pay page payment", paymentData);

    const options = {
      key: RAZORPAY_KEY,
      amount: paymentData.razorpay.amount,
      currency: "INR",
      name: "ShopNow",
      description: "Order Payment",
      order_id: paymentData.razorpay.orderId,
      handler: async function (response) {
        // console.log("Payment Response:", response);

        try {
          const verifyResponse = await axiosInstance.post("/order/verifyPayment", {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          })

          const result = verifyResponse.data;
          if (result.success) {
            setorderStatus(true)
            toast.success("Payment verified successfully!")
          } else {
            toast.success("Payment verification failed!")
          }
        } catch (error) {
          console.error("Axios Error:", error);
          alert("Error verifying payment. Check console for details.");
        }
      },
      prefill: {
        name: paymentData.name,
        email: paymentData.email,
        contact: paymentData.contact,
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  const totalPrice = ProductDetail.price * quantity;

  {
    orderStatus && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-100">
        <h1 className="text-3xl font-bold text-green-700">Successfully Order Placed</h1>
      </div>
    )
  }

  return (
    <div className=" w-full flex flex-col lg:flex-row justify-center items-start gap-8 p-6 bg-gray-50">
      {/* Product Image Container */}
            <BackArrow className="mb-4" size={32} />
      
      <div className=" lg:w-1/3 hidden md:flex w-full  sticky  top-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              src={ProductDetail.images || "/api/placeholder/400/400"}
              alt={ProductDetail.name}
              className="w-full h-96 object-cover"
            />
            {ProductDetail.discount > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {ProductDetail.discount}% OFF
              </div>
            )}
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">{ProductDetail.name}</h2>
            <div className="flex items-center mt-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900">₹{ProductDetail.price}</span>
                {ProductDetail.originalPrice && (
                  <span className="text-gray-500 line-through">₹{ProductDetail.originalPrice}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {ProductDetail.availability ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>

            <div className="mt-4 border-t pt-4">
              <p className="text-gray-700">{ProductDetail.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Form Container */}
      <div className="lg:w-1/2 w-full">
        <div className="bg-white p-8 shadow-md rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Complete Your Order</h2>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-600">Product ID: <span className="font-mono">{ProductDetail._id}</span></p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <Field
                          type="text"
                          name="name"
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="John Doe"
                        />
                        <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Field
                          type="email"
                          name="email"
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="johndoe@example.com"
                        />
                        <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-600" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <Field
                          type="tel"
                          name="phone"
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+91 9876543210"
                        />
                        <ErrorMessage name="phone" component="p" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Shipping Address</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <Field
                          as="textarea"
                          name="address"
                          rows="2"
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="123 Main Street, Apartment 4B"
                        />
                        <ErrorMessage name="address" component="p" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <Field
                            type="text"
                            name="city"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Mumbai"
                          />
                          <ErrorMessage name="city" component="p" className="mt-1 text-sm text-red-600" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <Field
                            type="text"
                            name="state"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Maharashtra"
                          />
                          <ErrorMessage name="state" component="p" className="mt-1 text-sm text-red-600" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                          <Field
                            type="text"
                            name="landmark"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Near Central Park"
                          />
                          <ErrorMessage name="landmark" component="p" className="mt-1 text-sm text-red-600" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                          <Field
                            type="text"
                            name="zip"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="400001"
                          />
                          <ErrorMessage name="zip" component="p" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Order Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Product</span>
                        <span className="font-medium">{ProductDetail.name}</span>
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center ">
                          <span className="text-gray-600 mr-4">Quantity</span>
                          <div className="flex items-center border rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600"
                            >
                              −
                            </button>
                            <span className="px-2 py-1 text-center w-8">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQuantity(Math.min(10, quantity + 1))}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="overflow-hidden" >₹{ProductDetail.price} × {quantity}
                        </div>
                      </div>

                      <div className="border-t pt-4 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Subtotal</span>
                          <span className="font-medium">₹{totalPrice}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-600">Shipping</span>
                          <span className="text-gray-600">₹{totalPrice > 500 ? 0 : 50}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 font-bold text-lg">
                          <span>Total</span>
                          <span>₹{totalPrice > 500 ? totalPrice : totalPrice + 50}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Payment Method</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <Field
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          className="h-5 w-5 text-blue-600"
                        />
                        <span className="ml-3">
                          <span className="block font-medium text-gray-700">Cash on Delivery</span>
                          <span className="block text-sm text-gray-500">Pay when you receive the product</span>
                        </span>
                      </label>

                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <Field
                          type="radio"
                          name="paymentMethod"
                          value="Online"
                          className="h-5 w-5 text-blue-600"
                        />
                        <span className="ml-3">
                          <span className="block font-medium text-gray-700">Online Payment</span>
                          <span className="block text-sm text-gray-500">Pay now using Credit/Debit Card, UPI, Netbanking</span>
                        </span>
                      </label>
                    </div>
                    <ErrorMessage name="paymentMethod" component="p" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(isSubmitting || isLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : 'Place Order'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
export default PlaceOrder;
