import React, { useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; 

const  Logout= ()=> {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear local storage items
    localStorage.removeItem('to9ken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');

    // Remove cookies by specifying path and domain (if needed)
    Cookies.remove('accessToken', { path: '/' }); 
    Cookies.remove('accesstoken', { path: '/' }); 
    Cookies.remove('refreshToken', { path: '/' });


    Cookies.remove('accessToken', { path: '/', domain: 'localhost' });
    Cookies.remove('refreshToken', { path: '/', domain: 'localhost' });


    navigate("/login");
  }, [navigate]);

  return (
    <div>
      Logging out...
    </div>
  );
}

export {Logout};