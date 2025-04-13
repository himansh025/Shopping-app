import React, { useState, useEffect } from 'react';
// import { verifyOtp } from '../utils/userDataFetch.js';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice.js';
import axiosInstance from '../Config/apiConfig.js';
const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const email = useSelector((state) => state.email.email);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => document.getElementById('otp')?.focus(), []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post("/verify-otp",{ email, otp })
            //  verifyOtp();
            if (response.data) {
                toast.success('OTP Verified!');
                localStorage.setItem('token', response.data.user.token);
                dispatch(login({ user: response.data.user }));
                navigate('/');
            }
        } catch {
            toast.error('Invalid OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="p-8 bg-gray-800 text-white rounded-lg w-96 shadow-lg">
                <h1 className="text-2xl font-bold text-center">Verify OTP</h1>
                <p className="text-sm text-center text-gray-400">Enter the 4-digit OTP sent to your email.</p>
                <form onSubmit={handleSubmit} className="mt-4">
                    <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength="4"
                        required
                        className="w-full p-2 mt-2 rounded bg-gray-700 text-white"
                        placeholder="Enter OTP"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 p-2 bg-blue-600 rounded hover:bg-blue-700"
                    >
                        {loading ? <TailSpin height="20" width="20" color="#fff" /> : 'Verify OTP'}
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export { VerifyOtp };
