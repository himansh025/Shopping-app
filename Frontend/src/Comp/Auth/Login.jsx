import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import {login} from '../../store/authSlicer.js'
import { useSelector,useDispatch } from "react-redux";
import { ToastContext } from "../../App.jsx";
import { useContext } from "react";
const Login = () => {
  const { register, handleSubmit, formState: { errors, dirtyFields } } = useForm();
  const { success, error, info, warning } = useContext(ToastContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || { role: "user" };
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user= useSelector((state)=>state.auth);
const dispatch= useDispatch();

console.log("user",user)
const handleLogin = async (data) => {
  setIsLoading(true);
  try {
    console.log("Login Data:", data);
    let res;
    
    if (role === "user") {
      res = await axios.post("http://localhost:5000/api/v1/user/login", data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
    }else if(role === "seller") {
      res = await axios.post("http://localhost:5000/api/v1/seller/login", data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
     else {
      res = await axios.post("http://localhost:5000/api/v1/user/login", data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    
    if (res && res.data) {
      success('Login successful!');
      console.log(res.data);
      
      const token = res.data.token;
      const userData = res.data.user;
      
      // Store token in localStorage
      sessionStorage.setItem("token",token)
     
      sessionStorage.setItem("user", JSON.stringify(userData))
      
      console.log("User data being dispatched:", userData);
      
      // Dispatch login action with the correct payload structure
      dispatch(login({ user: userData }));
      if(res.data?.isVerified){
        console.log("g")
        navigate("/dashboard")
      }
      // navigate("/dashboard")

      navigate("/")

    }
  } catch (error) {
    // console.error("Login failed:", error);
    error("invalid credentials")
    // error('Login failed. Please check your credentials.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-8">Login as {role || "user"}</p>
        
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          {/* Email Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                type="email"
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter your email"
              />
              {dirtyFields.email && !errors.email && (
                <CheckCircle size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
              )}
              {errors.email && (
                <AlertCircle size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
              )}
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                {...register("password", { 
                  required: "Password is required"
                })}
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter your password"
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200 font-medium mt-6 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          
          {/* Account Options */}
          <div className="flex justify-between text-sm pt-2">
            <button
              type="button"
              onClick={() => navigate("/signup", { state: { role: role } })}
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              Create an Account
            </button>
            <button
              type="button"
              onClick={() => navigate("/forget", { state: { role: role } })}
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;