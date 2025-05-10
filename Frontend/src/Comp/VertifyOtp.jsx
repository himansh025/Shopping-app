import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../store/authSlicer.js';
import axiosInstance from '../Config/apiConfig.js';
import { Spinner } from 'react-bootstrap';
const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    // const email = useSelector((state) => state.email.em1ail);
    const email=location.state?.email;
    const role=location.state?.role;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => document.getElementById('otp')?.focus(), []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res
            // console.log(email,role)
            if(role==="user"){ 
            const res = await axiosInstance.post("/user/verify-otp",{ email, otp })
        }
       else if(role==="seller"){ 
            const res = await axiosInstance.post("/seller/verify-otp",{ email, otp })
        }else{ 
            const res = await axiosInstance.post("/verify-otp",{ email, otp })
        }
            //  verifyOtp();
            if (res.data) {
                toast.success('OTP Verified!');
                localStorage.setItem('token', res.data.user.token);
                dispatch(login({ user: res.data.user }));
                navigate('/');
            }
        } catch {
            toast.error('Invalid OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center  bg-white bg-opacity-10 backdrop-blur-sm">
            <div className="p-8 h-max w-max blur-none bg-gray-800 text-white rounded-lg  shadow-lg">
                <h3 className="text-lg font-bold text-center">Verify Account with otp</h3>
                <p className="text-sm text-center text-gray-400">Enter the 4-digit OTP sent to your email.</p>
                <form onSubmit={handleSubmit} className="mt-4">
                <div className=' flex justify-center items-center'>

                    <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength="4"
                        required
                        className="  px-6 py-2 mt-2 rounded bg-gray-700 text-white"
                        placeholder="Enter OTP"
                    />
                    </div>
                    <div className=' flex justify-center items-center'>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-max mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                        >
                        {loading?(
                            <>
                            
                              <Spinner className='text-slate-200'/>
                               
                        
                        </>):(<>
                        Verify
                        </>)
                            }
                    </button>
                            </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export { VerifyOtp };
