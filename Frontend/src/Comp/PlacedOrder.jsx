import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
const RAZORPAY_ID = import.meta.env.VITE_RAZORPAY_ID;

console.log(RAZORPAY_KEY,RAZORPAY_ID);

const PlaceOrder = () => {
    // const [orderId, setOrderId] = useState(null);
    const [quantity,setquantity]= useState(1);
    const [ProductDetail, setProductDetail] = useState("");
    const {items}= useSelector((state)=>state.products)
    const {id} = useParams()
    console.log(id);
    
    const item = items.find((item)=>item._id==id)

    useEffect(() => {
        setProductDetail(item)
    }, [id,item])

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
       
  let data= {
          name: ProductDetail.name,
          id: ProductDetail._id,
          price: ProductDetail.price,
          quantity: quantity
      }
      console.log(data);

        try {
            const response = await axios.post("http://localhost:5000/api/v1/order/createOrder", {
                values,
                productDetails: {
                    name: ProductDetail.name,
                    id: ProductDetail._id,
                    price: ProductDetail.price,
                    quantity: quantity
                }

            }, {
                headers: { "Content-Type": "application/json" }
            });
            console.log(response);

            console.log("Order Placed:", response.data);
                // (response.data.orderId);
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
      console.log("razon pay page payment",paymentData);
      
        const options = {
            key: RAZORPAY_KEY, 
            amount: paymentData.razorpay.amount,
            currency: "INR",
            name: "ShopNow",
            description: "Order Payment",
            order_id: paymentData.razorpay.orderId,
            handler: async function (response) {
                console.log("Payment Response:", response);
    
                try {
                    const verifyResponse = await axios.post("http://localhost:5000/api/v1/order/verifyPayment",{
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
        <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-6 p-6 bg-gray-100">
        {/* First Container */}
        <div className="lg:w-1/3 w-full max-w-sm rounded-lg mx-auto bg-blue-300 p-4 flex justify-center items-center">
          <img src={ProductDetail.images} alt="Product" className="h-80 w-80 md:h-90 md:w-90 object-cover rounded-lg" />
        </div>
      
        {/* Second Container */}
        <div className="lg:w-1/2 w-full max-w-lg mx-auto bg-neutral-300 p-6 shadow-lg rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Place Your Order</h2>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            <Form className="space-y-4">
              <div className="flex flex-wrap justify-between">
                <p className="text-black">Product ID: {ProductDetail._id}</p>
                <p className="text-black">Product Name: {ProductDetail.name}</p>
              </div>
      
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Full Name</label>
                  <Field type="text" name="name" className="w-full border p-2 rounded-md" placeholder="Enter your name" />
                  <ErrorMessage name="name" component="p" className="text-red-500" />
                </div>
                <div>
                  <label className="block text-gray-700">Email</label>
                  <Field type="email" name="email" className="w-full border p-2 rounded-md" placeholder="Enter your email" />
                  <ErrorMessage name="email" component="p" className="text-red-500" />
                </div>
              </div>
      
              {/* Phone & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Phone Number</label>
                  <Field type="tel" name="phone" className="w-full border p-2 rounded-md" placeholder="Enter your phone number" />
                  <ErrorMessage name="phone" component="p" className="text-red-500" />
                </div>
                <div>
                  <label className="block text-gray-700">Address</label>
                  <Field as="textarea" name="address" className="w-full border p-2 rounded-md" placeholder="Enter your address" />
                  <ErrorMessage name="address" component="p" className="text-red-500" />
                </div>
              </div>
      
              {/* City & State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">City</label>
                  <Field type="text" name="city" className="w-full border p-2 rounded-md" placeholder="Enter city" />
                  <ErrorMessage name="city" component="p" className="text-red-500" />
                </div>
                <div>
                  <label className="block text-gray-700">State</label>
                  <Field type="text" name="state" className="w-full border p-2 rounded-md" placeholder="Enter state" />
                  <ErrorMessage name="state" component="p" className="text-red-500" />
                </div>
              </div>
      
              {/* Landmark & ZIP Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Landmark</label>
                  <Field type="text" name="landmark" className="w-full border p-2 rounded-md" placeholder="Enter Landmark" />
                  <ErrorMessage name="landmark" component="p" className="text-red-500" />
                </div>
                <div>
                  <label className="block text-gray-700">ZIP Code</label>
                  <Field type="number" name="zip" className="w-full border p-2 rounded-md" placeholder="Enter ZIP code" />
                  <ErrorMessage name="zip" component="p" className="text-red-500" />
                </div>
              </div>
      
              {/* Payment Method */}
              <div>
                <p className="text-lg font-bold">Amount: ₹ {ProductDetail.price}</p>
                <div className="flex items-center gap-2">
    <p className="text-lg font-bold">Quantity:</p>
    <select 
    onChange={(e) => setquantity(e.target.value)} 
    className="border-2 border-gray-600 rounded-md p-2 text-lg"
>
    <option value="" className="font-bold">Select Quantity</option>
    {[...Array(10).keys()].map((num) => (
        <option key={num + 1} value={num + 1} className="font-bold">{num + 1}</option>
    ))}
</select>

</div>

                <label className="block text-gray-700">Payment Method</label>
                <Field as="select" name="paymentMethod" className="w-full border p-2 rounded-md">
                  <option value="COD">Cash on Delivery</option>
                  <option value="Online">Online Payment</option>
                </Field>
                <ErrorMessage name="paymentMethod" component="p" className="text-red-500" />
              </div>
      
              {/* Submit Button */}
              <button type="submit" className="mt-4 bg-green-600 text-white px-6 py-3 text-lg rounded-md w-full hover:bg-green-700">
                Place Order
              </button>
            </Form>
          </Formik>
        </div>
      </div>
      
    
    
    );
};

export default PlaceOrder;
