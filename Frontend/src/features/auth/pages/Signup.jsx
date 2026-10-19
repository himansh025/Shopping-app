import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, User } from "lucide-react";
import axiosInstance from "../../../services/apiClient";
import { toast } from "react-toastify";
import GoogleLoginButton from "../components/GoogleLoginButton";

export function Signup() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, dirtyFields } 
  } = useForm();
  
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = location.state || { role: "user" };
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (data) => {
    setIsLoading(true);
    try {
      const endpoint = role === "seller" ? "/seller/signup" : "/user/signup";
      const res = await axiosInstance.post(endpoint, data);
      
      if (res && res.data) {
        toast.success(res.data.message || "Registration successful! Verify your email.");
        setTimeout(() => {
          navigate("/verify-otp", {
            state: {
              email: data.email,
              role: role
            }
          });
        }, 1500);
      }
    } catch (err) {
      console.error("Signup Error:", err);
      toast.error(
        err.response?.data?.error || 
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-md border border-slate-200/80">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-6">Create Account</h2>
      <p className="text-center text-gray-500 mb-8">Sign up as {role || "user"}</p>
      
      <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
        {/* Name Field */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              {...register("name", { 
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters"
                }
              })}
              type="text"
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your full name"
            />
            {dirtyFields.name && !errors.name && (
              <CheckCircle size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            )}
            {errors.name && (
              <AlertCircle size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
            )}
          </div>
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

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
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              type={showPassword ? "text" : "password"}
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Create a password"
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
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center my-3 text-slate-500 text-sm">or</p>

        <GoogleLoginButton role={role} />
        
        {/* Account Options */}
        <div className="flex justify-center text-sm pt-2">
          <button
            type="button"
            onClick={() => navigate("/login", { state: { role: role } })}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            Already have an account? Log in
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
