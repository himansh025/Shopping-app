import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const locate = useLocation()
  const { role } = locate.state;
  console.log(role);
  const handleSignup = (data) => {
    console.log("Signup Data:", data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input 
              {...register("username", { required: "Username is required" })} 
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              {...register("email", { required: "Email is required" })} 
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} 
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
            Sign Up
          </button>
          <div className=" mt-3 flex justify-between">
            <button
              onClick={() => navigate("/signup", { state: { role: role } })}
              className="w-max text-gray-500 p-2 rounded mb-2">
              Alredy hava an Account
            </button>
            <button
              onClick={() => navigate("/forget", { state: { role: role } })}
              className="w-max  text-gray-500 p-2 rounded mb-2">
              Forget Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
