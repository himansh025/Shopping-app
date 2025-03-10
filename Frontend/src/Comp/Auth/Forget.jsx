import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, Lock, CheckCircle, AlertCircle } from "lucide-react";

function Forget() {
  const { register, handleSubmit, formState: { errors, dirtyFields } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = location.state || { role: "user" };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log(`Reset Password Email Sent To ${role}:`, data.email);
      // API endpoint would differ based on role
      const endpoint = role === "user" ? "/api/user/reset-password" : "/api/seller/reset-password";
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On success
      setEmailSent(true);
      
      // Navigate to OTP verification after short delay
      setTimeout(() => {
        navigate("/verify-otp", { 
          state: { 
            email: data.email,
            role: role 
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error("Failed to send reset email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Forgot Password</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          {emailSent 
            ? `Recovery email sent! Check your inbox.` 
            : `Enter your ${role} email to reset your password.`}
        </p>
        
        {!emailSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              {dirtyFields.email && !errors.email && (
                <CheckCircle size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
              )}
              {errors.email && (
                <AlertCircle size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
              )}
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Reset Password"}
              {!isLoading && <ArrowRight size={16} />}
            </button>
            
            <div className="flex justify-between text-sm pt-2">
              <button
                type="button"
                onClick={() => navigate("/login", { state: { role: role } })}
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                Back to Login
              </button>
              <button
                type="button"
                onClick={() => navigate("/signup", { state: { role: role } })}
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                Create an Account
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle size={60} className="text-green-500" />
            </div>
            <p className="text-lg font-medium">Email sent successfully!</p>
            <p className="text-gray-500 mt-2">Check your inbox for the verification code.</p>
            <p className="text-gray-400 text-sm mt-4">Redirecting to verification page...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Forget;