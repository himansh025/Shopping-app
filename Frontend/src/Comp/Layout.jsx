import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import NavLinks from './NavLinks'
import { useSelector } from 'react-redux'
function Layout() {
  const {user}= useSelector((state)=>state.auth)
  return (
<div>
 
<div  className=' '>
    <Navbar/>
    {user && user?.role=="seller"&&(
      <>
        <NavLinks className="" props={user}/ >  
      </>
    )}
</div>
<div className=""> {/* Adjust as needed */}
  <Outlet />
</div>
  </div>
  )
}

export default Layout