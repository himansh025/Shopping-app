import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
const RAZORPAY_ID = import.meta.env.VITE_RAZORPAY_ID;
console.log(RAZORPAY_KEY,RAZORPAY_ID);


const PlaceOrder = () => {
    const [orderId, setOrderId] = useState(null);
    const [ProductDetail, setProductDetail] = useState("");
    const location = useLocation()
    const data = location.state

    useEffect(() => {
        setProductDetail(data)
    }, [])

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
        console.log("Order Place:", values);
        try {
            const response = await axios.post("http://localhost:5000/api/v1/order/createOrder", {
                data: values,
                productDetail: {
                    name: ProductDetail.name,
                    id: ProductDetail.id,
                    price: ProductDetail.price
                }
            }, {
                headers: { "Content-Type": "application/json" }
            });
            console.log(response);

            console.log("Order Placed:", response.data);
            setOrderId(response.data.orderId);
            if (values.paymentMethod == "Online") {
                openRazorpay(response.data);
                resetForm();

            } else {
                alert("Order placed successfully!");
                resetForm();
            }
        }
        catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order.");
        }
    }

  

    const openRazorpay = (paymentData) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY, 
            amount: paymentData.amount,
            currency: "INR",
            name: "ShopNow",
            description: "Order Payment",
            order_id: paymentData.orderId,
            handler: async function (response) {
                console.log("Payment Response:", response);
    
                try {
                    const verifyResponse = await axios.post("http://localhost:5000/api/v1/payment/verifyPayment",{
                            order_id: response.razorpay_order_id,
                            payment_id: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                        },
                        {
                            headers: { "Content-Type": "application/json" },
                        }
                    );
    
                    const result = verifyResponse.data;
                    if (result.success) {
                        alert("Payment verified successfully!");
                    } else {
                        alert("Payment verification failed!");
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
    

    return (
        <div className="max-w-lg mx-auto p-6 bg-slate-200 shadow-lg rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Place Your Order</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >

                <Form className="space-y-4">
                    <div className="flex justify-between">
                        <p className="text-black">Product id :  {ProductDetail.id}</p>
                        <p className="text-black">Product id :  {ProductDetail.name}</p>
                    </div>
                    <div className=" flex justify-between">
                        {/* Name */}
                        <div>
                            <label className="block text-gray-700">Full Name</label>
                            <Field
                                type="text"
                                name="name"
                                className="w-full border p-2 rounded-md"
                                placeholder="Enter your name"
                            />
                            <ErrorMessage name="name" component="p" className="text-red-500" />
                        </div>
                        {/* Email */}
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <Field
                                type="email"
                                name="email"
                                className="w-full border p-2 rounded-md"
                                placeholder="Enter your email"
                            />
                            <ErrorMessage name="email" component="p" className="text-red-500" />
                        </div>

                    </div>

                    <div className=" flex justify-between">
                        {/* Phone */}
                        <div>
                            <label className="block text-gray-700">Phone Number</label>
                            <Field
                                type="tel"
                                name="phone"
                                className="w-full border p-2 rounded-md"
                                placeholder="Enter your phone number"
                            />
                            <ErrorMessage name="phone" component="p" className="text-red-500" />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-gray-700">Address</label>
                            <Field
                                as="textarea"
                                name="address"
                                className="w-full border p-2 rounded-md"
                                placeholder="Enter your address"
                            />
                            <ErrorMessage name="address" component="p" className="text-red-500" />
                        </div>

                    </div>
                    {/* City & State */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">City</label>
                            <Field
                                type="text"
                                name="city"
                                className="w-full border p-2 rounded-md"
                                placeholder="Enter city"
                            />
                            <ErrorMessage name="city" component="p" className="text-red-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700">State</label>
                            <Field
                                type="text"
                                name="state"
                                className="w-full border p-2 rounded-md"
                                placeholder="Enter state"
                            />
                            <ErrorMessage name="state" component="p" className="text-red-500" />
                        </div>
                    </div>

                    {/* ZIP Code */}
                    <div className=" flex justify-between">
                        <div>
                            <label className="block text-gray-700"> Landmark :</label>
                            <Field
                                type="text"
                                name="landmark"
                                className="w-full border p-2 rounded-md"
                                placeholder="Enter Landmark "
                            />
                            <ErrorMessage name="landmark" component="p" className="text-red-500" />
                        </div>

                        <div>
                            <label className="block text-gray-700">ZIP Code</label>
                            <Field
                                type="number"
                                name="zip"
                                className="w-full border p-2 rounded-md"
                                placeholder="Enter ZIP code"
                            />
                            <ErrorMessage name="zip" component="p" className="text-red-500" />
                        </div>
                    </div>
                    {/* Payment Method */}
                    <div>
<p> Amount : ₹ {ProductDetail.price}</p>
                            <label className="block text-gray-700">Payment Method</label>
                            <Field 
                                as="select" 
                                name="paymentMethod" 
                                className="w-full border p-2 rounded-md"
                            >
                                <option value="COD">Cash on Delivery</option>
                                <option value="Online">Online Payment</option>
                            </Field>
                            <ErrorMessage name="paymentMethod" component="p" className="text-red-500" />
                        </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="mt-4 bg-green-600 text-white px-6 py-3 text-lg rounded-md w-full hover:bg-green-700"
                    >
                        Place Order
                    </button>
                    {/* {paymentMethod === "Online" && orderId && (
                        <button
                            type="button"
                            className="w-full mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            onClick={() => openRazorpay({ orderId })}
                        >
                            Pay with Razorpay
                        </button>
                    )} */}
                </Form>
            </Formik>
        </div>
    );
};

export default PlaceOrder;
