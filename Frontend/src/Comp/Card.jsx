import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom';
function Cart() {
  const {items}= useSelector((state)=>state.products)
  const navigate= useNavigate()  
const handleitem= (item)=>{
  navigate(`/item-detail/${item}`)
 
}

  return (
    <div className="w-max  grid mx-auto  overflow-hidden sm:mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:mx-auto  lg:grid-cols-4 gap-6 ">
          {items.map((item,index) => (
        <div key={index} className=" p-3  bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-105 hover:shadow-lg h-fit w-[300px] flex flex-col">
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-[200px] object-cover rounded-lg"
            />
          <h3 className="text-md font-bold mt-3"> {item.name}</h3>
          <p className="text-gray-600 text-md">Category: {item.category}</p>
          <p className="text-gray-600 text-md">Brand: {item.brand}</p>
          <p className="text-gray-700 text-md">Price: ₹{item.price}</p>
        <div className='flex justify-center rounded-3xl'> 
        <button onClick={()=>handleitem(item._id)} className="mt-auto w-max bg-green-600 text-white px-2 py-2 text-md   hover:bg-green-700">
            View Item
          </button>
        </div>
        </div>
      ))}
    </div>
      );
}

export default Cart;
