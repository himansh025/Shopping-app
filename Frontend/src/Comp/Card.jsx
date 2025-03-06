import React, { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
function Cart({ allproduct }) {
  const navigate= useNavigate()
  console.log("product", allproduct);
const [newitem,setnewitem]=useState("")
const handleitem= (item)=>{
  console.log(item);
  setnewitem(item)
  
  if(item){
  navigate(`/item-detail/${item.id}`,{state:item})
  }
  else{
    alert("Please Add a item in cart")
    console.log("item not found");
    
  }
}
useEffect(()=>{

},[newitem])
  return (
    <div className="w-max  grid mx-auto  sm:mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:mx-auto  lg:grid-cols-4 gap-6 ">
      {allproduct.map((item) => (
        <div key={item.id} className="bg-slate-300 p-3 shadow-lg rounded-xl  h-fit w-[300px] flex flex-col">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-[200px] object-cover rounded-lg"
          />
          <h3 className="text-md font-bold mt-3">Product Name: {item.name}</h3>
          <p className="text-gray-600 text-md">Category: {item.category}</p>
          <p className="text-gray-600 text-md">Brand: {item.brand}</p>
          <p className="text-gray-700 text-md">Price: ₹{item.price}</p>
        <div className='flex justify-center rounded-3xl'> 
        <button onClick={()=>handleitem(item)} className="mt-auto w-max bg-green-600 text-white px-2 py-2 text-md   hover:bg-green-700">
            View Item
          </button>
        </div>
        </div>
      ))}
    </div>
  );
}

export default Cart;
