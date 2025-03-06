import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate= useNavigate()
  const locate = useLocation()
  const { role } = locate.state;
  console.log(role);


  const handleLogin = (data) => {
    console.log("Login Data:", data);
    if (role == "user") {
      const res = axios.post("/user", data, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      console.log(res);

    }
    const res = axios.post("/seller", data, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    console.log(res);

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
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
              {...register("password", { required: "Password is required" })}
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
            Login
          </button>
          <div className=" mt-3 flex justify-between">
            <button
              onClick={() => navigate("/signup", { state: { role: role } })}
              className="w-max text-gray-500 p-2 rounded mb-2">
              Create a Account
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

export default Login;
