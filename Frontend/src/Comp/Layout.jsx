import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
function Layout() {
  return (
<div>
 
<div  className=' mb-16'>
    <Navbar/>
</div>
  <Outlet/>
  </div>
  )
}

export default Layout