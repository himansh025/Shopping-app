import React, { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
function Card({items,remove}) {
  const [pureitem,setpureitem]= useState([])
  // const {items}= useSelector((state)=>state.products)
  const navigate= useNavigate() 
  // console.log(items) 

  useEffect(()=>{

    if(remove){
      // console.log(remove[0]?._id)
      let removeDuplicateiItem= items.filter((item)=>item._id!=remove[0]?._id)
      setpureitem(removeDuplicateiItem);
      // console.log(pureitem)
    }
  },[])

const handleitem= (item)=>{
  navigate(`/item-detail/${item}`)
 
}

  return (
    <div className="w-full  grid mx-auto  overflow-hidden sm:mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:mx-auto  lg:grid-cols-3 gap-6 ">
          {(pureitem.length>0? pureitem : items ).map((item,index) => (
        <div key={index} className=" p-3  bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-105 hover:shadow-lg h-fit w-[300px] flex flex-col">
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-[200px] object-cover rounded-lg"
            />
          <h5 className=" text-md font-bold mt-3"> {item.name}</h5>
          <p className="text-gray-600 text-sm">Category: {item.category}</p>
          <p className="text-gray-600 text-sm">Brand: {item.brand}</p>
          <p className="text-gray-700 text-sm">Price: ₹{item.price}</p>
        <div className='flex justify-center rounded-3xl'> 
        <button onClick={()=>handleitem(item._id)} className="mt-auto w-max bg-green-600  text-white px-2 py-2 text-md   hover:bg-green-700">
            View Item
          </button>
        </div>
        </div>
      ))}
    </div>
      );
}

export default Card;
