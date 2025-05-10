import React, { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../store/wishlistSlice.js";
import { useNavigate } from "react-router-dom";

function Wishlist() {
    const wishlist = useSelector((state) => state.wishlist);
    // console.log(wishlist, "kuch hai");
const [item,setitem]= useState("")
useEffect(() => {
    setitem(wishlist)

}, [])

    const dispatch = useDispatch();
const navigate= useNavigate()

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold">Your Wishlist</h2>
            {wishlist.length === 0 ? (
                <p className="mt-3">No items in wishlist.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                        <div key={item._id} className="border p-3 rounded-md">
                            <img src={item.images} alt={item.name} className="h-40  w-full rounded-lg object-cover" />
                            <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
                            <div className="flex justify-between">
                                <p className="text-gray-700"> Price : {item.price}</p>
                                <p className="text-gray-700">Brand : {item.brand}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-700"> Size :
                                    {item?.size?.map((size, index) => (
                                        <span key={index}> {size} </span>
                                    ))}</p>

                                <p className="text-gray-700">Category : {item.category}</p>
                            </div>
                           <div className="flex gap-3">
                           <button
                                onClick={() => dispatch(removeFromWishlist(item.id))}
                                className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Remove
                            </button>
                            {/* <button
                                onClick={()=> navigate(`/addToCart/:${item.id}`,{state:item}) }
                                className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded"
                            >
                                View Product
                            </button> */}
                            <button
                                onClick={() =>navigate(`/placedOrder/:${item._id}`)}
                                className="mt-2 justify-end bg-green-500 text-white px-3 py-1 rounded"
                            >
                                Add To Cart
                            </button>
                           </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Wishlist;
