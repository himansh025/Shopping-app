import  { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

function NavLinks() {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
    const { user } = useSelector((state) => state.auth);
// console.log(props)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Show navbar when scrolling up, hide when scrolling down
      setIsVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <>
      <div className={`h-auto w-full bg-gray-100  shadow-md flex justify-center items-center px-6 fixed top-0 left-0 right-0 z-20 transition-transform duration-200 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        {/* Desktop Nav */}
        <div className="hidden bg-gray-800 mt-20 w-full  justify-center h-10 items-center md:flex gap-10">
          {user?.role =="seller" &&(
            <>
            <CustomNavLink to="/" text="Dashboard" />
            <CustomNavLink to="/profile" text="Profile" />
            <CustomNavLink to="/orders" text="Orders" />
            </>
          )}
          {user.role=="user" &&(
            <>
            <CustomNavLink to="/" text="Home" />
            <CustomNavLink to="/orders" text="Orders" />
            <CustomNavLink to="/profile" text="Profile" />
        
            </>
          )}
        </div>
      </div>

      {/* Mobile Nav - Also hides on scroll */}
      <div className={`md:hidden bg-amber-50 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'} fixed w-full top-2 left-0 z-10`}>
        <div className="flex flex-col items-center mt-10 gap-1 p-4">
        
           {!user ?(
             <CustomNavLink to="/" text="Home" />
          ):  user.role==="user" ? ( 
            <>
            <CustomNavLink to="/" text="Dashboard" />
            <CustomNavLink to="/profile" text="Profile" />
            <CustomNavLink to="/orders" text="Orders" />
            </>
          ):(
            <>
            <CustomNavLink to="/" text="Dashboard" />
            <CustomNavLink to="/profile" text="Profile" />
            <CustomNavLink to="/orders" text="Orders" />
        
            </>
          )
          } 
       
        </div>
      </div>
    </>
  );
}

// Reusable NavLink Component
function CustomNavLink({ to, text, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => 
        `text-gray-700 hover:text-blue-600 text-lg text-decoration-none transition duration-300 ${
          isActive ? 'font-bold' : ''
        }`
      }
    >
      {text}
    </NavLink>
  );
}

export default NavLinks;