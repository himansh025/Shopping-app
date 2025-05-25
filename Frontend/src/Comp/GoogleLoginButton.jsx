import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlicer';
import axiosInstance from '../Config/apiConfig';

export default function GoogleLoginButton({role}) {
    const navigate= useNavigate()
    const dispatch= useDispatch()

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const res = await axiosInstance.post('/auth/google', { token,role });
    sessionStorage.setItem('token', res.data.token);
    sessionStorage.setItem("user", JSON.stringify(res.data.user))

    dispatch(login({user:res.data.user}))
    navigate('/')
    alert('Google login successful!');
  };

  const handleError = () => {
    alert('Google Login Failed');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
