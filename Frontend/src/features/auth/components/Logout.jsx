import { useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';

export function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear storage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('to9ken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');

    // Clear cookies safely using standard document.cookie
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    navigate("/login");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-[40vh] text-slate-600 font-medium">
      Logging out...
    </div>
  );
}

export default Logout;
