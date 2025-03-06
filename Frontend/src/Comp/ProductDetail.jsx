import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoHeart } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../store/wishlistSlice";
import Card from '../Comp/Card'
const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [wishList, setWishList] = useState(false);
    const dispatch = useDispatch();
    const wishlistSelector = useSelector((state) => state.wishlist);
    
    const allproduct = [
        {
          id: 1,
          name: "Casual Shirt",
          price: 799,
          category: "Men",
          description: "A comfortable and stylish casual shirt perfect for everyday wear.",
          type: "Shirt",
          size: ["S", "M", "L", "XL"],
          brand: "Levi's",
          material: "Cotton",
          stock: 50,
          image: "https://as1.ftcdn.net/v2/jpg/02/10/85/26/1000_F_210852662_KWN4O1tjxIQt8axc2r82afdSwRSLVy7g.jpg"
        },
        {
          id: 2,
          name: "Formal Pant",
          price: 999,
          category: "Men",
          description: "Elegant formal trousers suitable for office and formal occasions.",
          type: "Pants",
          size: ["30", "32", "34", "36", "38"],
          brand: "Raymond",
          material: "Polyester Blend",
          stock: 30,
          image: "https://as2.ftcdn.net/v2/jpg/04/86/94/63/1000_F_486946394_itDniDdY8BA1ORKNHbcW1Ij9wPeOsMMx.jpg"
        },
        {
          id: 3,
          name: "Blue Denim Jeans",
          price: 1299,
          category: "Men",
          description: "Classic blue denim jeans with a slim fit and stretch fabric for comfort.",
          type: "Jeans",
          size: ["28", "30", "32", "34", "36"],
          brand: "Wrangler",
          material: "Denim",
          stock: 40,
          image: "https://t4.ftcdn.net/jpg/03/03/36/97/240_F_303369705_Ap2BaZOlOMHqwtWmtNb1TBlgRmXtgtoh.jpg"
        },
        {
          id: 4,
          name: "Printed T-Shirt",
          price: 499,
          category: "Men",
          description: "Trendy printed t-shirt made from breathable fabric, perfect for summer.",
          type: "T-Shirt",
          size: ["S", "M", "L", "XL"],
          brand: "Nike",
          material: "Cotton",
          stock: 60,
          image: "https://as1.ftcdn.net/v2/jpg/05/19/35/57/1000_F_519355756_kXfktwJ6Kz5QJIkH8ySeVwCbXYdkGyFB.jpg"
        },
        {
          id: 5,
          name: "Leather Jacket",
          price: 2999,
          category: "Men",
          description: "Premium leather jacket with a stylish design and comfortable fit.",
          type: "Jacket",
          size: ["M", "L", "XL"],
          brand: "Zara",
          material: "Genuine Leather",
          stock: 20,
          image: "https://as1.ftcdn.net/v2/jpg/04/61/75/80/1000_F_461758062_xEip5jqZxzY6fxyd8xBGzZYh6h5B8enM.jpg"
        },
        {
          id: 6,
          name: "Winter Sweater",
          price: 1200,
          category: "Men",
          description: "Soft and warm wool sweater, perfect for chilly winters.",
          type: "Sweater",
          size: ["S", "M", "L", "XL"],
          brand: "H&M",
          material: "Wool",
          stock: 35,
          image: "https://as2.ftcdn.net/v2/jpg/01/81/21/37/1000_F_181213709_YMfYlFJG3WxbVjSKR9FJQgWWTXelWDmF.jpg"
        },
        {
          id: 7,
          name: "Floral Dress",
          price: 1499,
          category: "Women",
          description: "Beautiful floral printed dress for casual and party wear.",
          type: "Dress",
          size: ["S", "M", "L", "XL"],
          brand: "Forever 21",
          material: "Rayon",
          stock: 25,
          image: "https://as2.ftcdn.net/v2/jpg/02/91/78/58/1000_F_291785819_3M6wIcb5BwVStHZxV38MIgOdMc7qPhXJ.jpg"
        },
        {
          id: 8,
          name: "Ankle-Length Leggings",
          price: 699,
          category: "Women",
          description: "Stretchable leggings with an elastic waistband for ultimate comfort.",
          type: "Leggings",
          size: ["XS", "S", "M", "L", "XL"],
          brand: "Adidas",
          material: "Spandex",
          stock: 45,
          image: "https://as1.ftcdn.net/v2/jpg/01/30/75/06/1000_F_130750621_HUuWtyrRgJHgk55v1IOIvgOdLduj1fob.jpg"
        },
        {
          id: 9,
          name: "Sports Shoes",
          price: 2499,
          category: "Unisex",
          description: "Lightweight running shoes with excellent grip and comfort.",
          type: "Shoes",
          size: ["6", "7", "8", "9", "10"],
          brand: "Puma",
          material: "Mesh & Rubber",
          stock: 50,
          image: "https://as2.ftcdn.net/v2/jpg/02/18/95/39/1000_F_218953981_WZqXxFUXvcFwHnQKyOnMshJLUJH3wvdH.jpg"
        },
        {
          id: 10,
          name: "Handbag",
          price: 1799,
          category: "Women",
          description: "Elegant leather handbag with multiple compartments for storage.",
          type: "Accessories",
          size: "Medium",
          brand: "Gucci",
          material: "Faux Leather",
          stock: 30,
          image: "https://as1.ftcdn.net/v2/jpg/02/34/93/61/1000_F_234936136_BpfUOqp4KDjDtV8oKNjHjN9nAyv7EtMw.jpg"
        }
      ];

    const location = useLocation();
    const productData = location.state;
    const navigate = useNavigate();

    useEffect(() => {
        if (productData) {
            setProduct(productData);
            setWishList(wishlistSelector.some(item => item.id === productData.id));
        }
        //  window.location.reload();
    }, [productData, wishlistSelector]);

    const toggleWishlist = () => {
        if (wishList) {
            dispatch(removeFromWishlist(product.id));
        } else {
            dispatch(addToWishlist(product));
        }
        setWishList(!wishList);
    };

    return (
        <>
        <div className="w-full mx-auto p-6  border-y-indigo-300 shadow-lg rounded-lg mt-10">
         <div className="flex justify-center bg-slate-950 w-full rounded-sm h-max ">

            {!product ? (
                <h2 className="text-center text-gray-600 text-xl">No Product Selected</h2>
            ) : (
                <div className="space-y-4 border px-4 w= rounded-lg bg-yellow-50 m-4 sm:border-b-black lg:border-2 lg:border-blue-950 lg:p-10 ">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-2xl mx-auto text-center">Product Details</h2>
                        {wishList ? (
                            <IoHeart onClick={toggleWishlist} className="h-6 w-6 text-red-500 cursor-pointer" />
                        ) : (
                            <CiHeart onClick={toggleWishlist} className="h-6 w-6 cursor-pointer" />
                        )}
                    </div>
                    
                    <div className="flex flex-col justify-center  border-2 border-gray-700 rounded-lg  items-center">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-64 w-full max-w-sm object-cover rounded-lg"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-lg">
                        <h2 className="text-2xl font-bold">{product.name}</h2>
                        <p className="text-blue-950">Price: ₹{product.price}</p>
                        <p>Category: {product.category}</p>
                       
                        <p>Item Size: {Array.isArray(product.size) ? product.size.join(", ") : product.size}</p>
                        <p>Type: {product.type}</p>
                        <p>Brand: {product.brand}</p>
                        <p>Material: {product.material}</p>
                        <p>Stock: {product.stock}</p>
                    </div>
                    <p className="text-lg">Description: {product.description}</p>
                    <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4  space-x-2 mt-5">
                        <button 
                            onClick={() => navigate(`/addToCart/${product.id}`, { state: product })} 
                            className="bg-blue-500 px-4 py-2 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                            Add to Cart
                        </button>
                        <button 
                            onClick={() => navigate("/wishlist")} 
                            className="bg-yellow-500 px-4 py-2 text-white rounded-lg shadow-md hover:bg-yellow-600 transition">
                            View Wishlist
                        </button>
                        <button 
                            onClick={() => navigate(`/placedOrder/${product.id}`, { state: product })} 
                            className="bg-green-500 px-4 py-2 text-white rounded-lg shadow-md hover:bg-green-600 transition">
                            Place Order
                        </button>
                    </div>
                </div>
            )}
               </div>    

</div>                     <h3 className="text-3xl text-center w-full mt-10 font-bold border-t-2 border-blue-600 p-4">Similar Products</h3>
        <Card allproduct={allproduct}/>
     
        </>

    );
};

export default ProductDetail;
