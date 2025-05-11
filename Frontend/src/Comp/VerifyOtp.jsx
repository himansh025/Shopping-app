import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../store/authSlicer.js';
import axiosInstance from '../Config/apiConfig.js';
import { Spinner } from 'react-bootstrap';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Get state from location
    const { email = '', role = 'user' } = location.state || {};
    
    // Focus OTP input on component mount
    useEffect(() => {
        document.getElementById('otp')?.focus();
        
        // Redirect if no email in state
        if (!email) {
            toast.error('Email information missing. Please try signing up again.');
            navigate('/signup');
        }
    }, [email, navigate]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!otp || otp.length !== 4) {
            toast.error('Please enter a valid 4-digit OTP');
            return;
        }
        
        setLoading(true);
        
        try {
            let endpoint = "/user/verify-otp";
            
            // Use correct endpoint based on role
            if (role === "seller") {
                endpoint = "/seller/verify-otp";
            }
            
            // Make API request
            const res = await axiosInstance.post(endpoint, { 
                email, 
                otp 
            });
            
            if (res && res.data) {
                toast.success('OTP verified successfully!');
                
                // Extract token and user data
                const token = res.data?.token;
                
                if (token) {
                    // Save token to localStorage
                    sessionStorage.setItem('token', token);
                    
                    // Update Redux state
                    dispatch(login({ user: res.data.user }));
                    
                    // Redirect to homepage
                    setTimeout(() => {
                        navigate('/');
                    }, 1500);
                } else {
                    toast.error('Authentication failed. Missing token in response.');
                }
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            toast.error(error?.response?.data?.error || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="p-8 w-full max-w-md bg-white rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">Verify Your Account</h3>
                <p className="text-sm text-center text-gray-600 mb-6">
                    Enter the 4-digit OTP sent to <span className="font-medium">{email}</span>
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center items-center">
                        <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                            maxLength="4"
                            required
                            className="w-full px-6 py-3 rounded-lg border border-gray-300 text-lg text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="Enter 4-digit OTP"
                        />
                    </div>
                    
                    <div className="flex justify-center items-center">
                        <button
                            type="submit"
                            disabled={loading || otp.length !== 4}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition ${
                                loading || otp.length !== 4 
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <Spinner className="mr-2" size="sm" />
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                'Verify OTP'
                            )}
                        </button>
                    </div>
                    
                    <div className="text-center mt-4">
                        <p className="text-gray-600 text-sm">
                            Didn't receive the code?{' '}
                            <button
                                type="button"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                                onClick={() => navigate('/signup', { state: { role } })}
                            >
                                Try again
                            </button>
                        </p>
                    </div>
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default VerifyOtp;