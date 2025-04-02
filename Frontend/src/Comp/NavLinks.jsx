import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function NavLinks() {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

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
      <div className={`h-20 w-full bg-gray-100 shadow-md flex justify-center items-center px-6 fixed top-0 left-0 right-0 z-20 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        {/* Desktop Nav */}
        <div className="hidden bg-gray-800 mt-40 w-full  justify-center h-20 items-center md:flex gap-10">
          <CustomNavLink to="/" text="Home" />
          <CustomNavLink to="/shop" text="Shop" />
          <CustomNavLink to="/cart" text="Cart" />
          <CustomNavLink to="/orders" text="Orders" />

        </div>
        
        {/* Mobile Menu Button */}
        {/* <div className="md:hidden flex flex-col gap-10">
          <CustomNavLink to="/" text="Home" />
          <CustomNavLink to="/shop" text="Shop" />
          <CustomNavLink to="/cart" text="Cart" />
        </div> */}
      </div>

      {/* Mobile Nav - Also hides on scroll */}
      <div className={`md:hidden bg-amber-50 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'} fixed w-full top-20 left-0 z-10`}>
        <div className="flex flex-col items-center gap-6 p-6">
          <CustomNavLink to="/" text="Home" />
          <CustomNavLink to="/shop" text="Shop" />
          <CustomNavLink to="/cart" text="Cart" />
        </div>
      </div>
      
      {/* Add padding to prevent content from hiding behind fixed navbar */}
      <div className="h-20"></div>
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
        `text-gray-700 hover:text-blue-600 text-lg transition duration-300 ${
          isActive ? 'font-bold' : ''
        }`
      }
    >
      {text}
    </NavLink>
  );
}

export default NavLinks;