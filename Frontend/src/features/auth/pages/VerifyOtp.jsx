import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../../../store/slices/authSlice';
import axiosInstance from '../../../services/apiClient';
import Spinner from '../../../components/ui/Spinner';

export function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { email = '', role = 'user' } = location.state || {};
  
  useEffect(() => {
    document.getElementById('otp')?.focus();
    
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
      const endpoint = role === "seller" ? "/seller/verify-otp" : "/user/verify-otp";
      const res = await axiosInstance.post(endpoint, { 
        email, 
        otp 
      });
      
      if (res) {
        toast.success('OTP verified successfully!');
        const token = res.data?.token || res?.data?.user?.token;
        
        if (token) {
          sessionStorage.setItem('token', token);
          const userData = res.data?.user || res?.data?.seller;
          if (userData) {
            sessionStorage.setItem('user', JSON.stringify(userData));
          }
          dispatch(login({ user: userData }));
          
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          toast.error('Authentication failed. Missing token in response.');
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(
        error?.response?.data?.error || 
        error?.response?.data?.message || 
        'Invalid OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-md border border-slate-200/80">
      <h3 className="text-2xl font-bold text-center text-slate-900 mb-2">Verify Your Account</h3>
      <p className="text-sm text-center text-gray-600 mb-6">
        Enter the 4-digit OTP sent to <span className="font-medium text-slate-900">{email}</span>
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
            Didn&apos;t receive the code?{' '}
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
  );
}

export default VerifyOtp;
