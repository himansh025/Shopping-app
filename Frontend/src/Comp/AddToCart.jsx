import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { IoHeart } from "react-icons/io5" ;
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist ,removeFromWishlist} from "../store/wishlistSlice";


const AddToCart = () => {
    const [cart, setCart] = useState(null);
    const [wishList, setWishList] = useState(false);
    const dispatch= useDispatch()
    const selector = useSelector((state) => state.wishlist);
    // console.log(selector);
    
    // const isInWishlist = selector.some((item) => item.id === itemData?.id);
    // console.log(seletor);
    // console.log(wishList ,"wishlist");
    
    const location = useLocation();
    const itemData = location.state;
    const navigate= useNavigate()
const handleaddstock= ()=>{
    

}
const handleremovestock= ()=>{
    

}
const HandlePlaceOrder= (id)=>{
    console.log(id);
navigate(`/placedOrder/${id}`,{state:{
    name:cart.name,
    id:cart.id,
    price:cart.price,
    stock:cart.stock,
    size:cart.size,
}})
}
const handleremovewishlist=()=>{
    if (wishList) {
        console.log("wishlist remove kiya");
        dispatch(removeFromWishlist(itemData.id));
    }
    setWishList(!wishList)
}
const handleaddwishlist=()=>{
    console.log("add kiya",wishList);
    dispatch(addToWishlist(itemData));
    setWishList(!wishList);
}

    useEffect(() => {
        if (itemData) {
            console.log(itemData);
            
            setCart(itemData);
        }
    }, [itemData]);

    return (
        <div className="max-w-lg mx-auto p-6 bg-slate-500 shadow-lg rounded-lg mt-10">
            {!cart ? (
                <h2 className="text-center text-gray-600">Cart is empty</h2>
            ) : (
                <div className="">
<div className=" flex justify-between">
<h2 className="font-bold text-2xl mb-3">My Cart</h2>
    {wishList?(
        <>
<IoHeart  onClick={handleremovewishlist} className="mt-2 mr-2 h-6 w-6 text-black">go to page</IoHeart> 
</>
    ):
    <>
    <CiHeart onClick={handleaddwishlist
    }className="mt-2 mr-2 h-6 w-6">go to page</CiHeart> 
    </>
}
</div>
                <div key={cart.id} className="mb-4">
                    <img
                        src={cart.image}
                        alt={cart.name}
                        className="w-full h-64 object-cover rounded-lg"
                        />
                    <h2 className="text-2xl font-bold mt-4 mb-1">{cart.name}</h2>

                    <div className=" grid grid-cols-2">
                        <p className="text-lg text-blue-950">Price: ₹{cart.price}</p>


                        <p className="text-lg  mt-1">Category : {cart.category}</p>
                        <p className="text-lg  mt-1">Item Size : {cart.size}</p>
                        <p className="text-lg  mt-1">Type : {cart.type}</p>
                        <p className="text-lg  mt-1">Stock : {cart.stock}</p>
                    </div>
                    <div className="flex">
                    <button  onClick={handleaddstock} className=" bg-blue-100 px-3 m-2 rounded-lg ">Add itme</button>
                     <button onClick={handleremovestock} className=" bg-red-400 px-3 m-2 rounded-lg">Remove</button>
                     <button onClick={()=>{HandlePlaceOrder(cart.id)}} className=" bg-yellow-400 px-3  m-2 rounded-lg justify-end">Placed order</button>
                    
                    </div>
                    
                </div>
            </div>
            )}
            <button onClick={()=>navigate("/wishlist")}>wish</button>
        </div>
    );
};

export default AddToCart;
