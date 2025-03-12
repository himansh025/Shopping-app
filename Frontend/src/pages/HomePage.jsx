import { ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../Comp/Card";
import ProductCrousel from "../Comp/ProductCrousel";
import AllCategories from "../Comp/AllCategories";
import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { fetchProducts } from "../store/productsSlicer";
// import SubCat from "../Comp/user/SubCat";
function HomePage() {


  // const product = [
  //   {
  //     id: 1,
  //     name: "Casual Shirt",
  //     price: 799,
  //     category: "Men",
  //     description: "A comfortable and stylish casual shirt perfect for everyday wear.",
  //     type: "Shirt",
  //     size: ["S", "M", "L", "XL"],
  //     brand: "Levi's",
  //     material: "Cotton",
  //     stock: 50,
  //     image: "https://as1.ftcdn.net/v2/jpg/02/10/85/26/1000_F_210852662_KWN4O1tjxIQt8axc2r82afdSwRSLVy7g.jpg"
  //   },
  //   {
  //     id: 2,
  //     name: "Formal Pant",
  //     price: 999,
  //     category: "Men",
  //     description: "Elegant formal trousers suitable for office and formal occasions.",
  //     type: "Pants",
  //     size: ["30", "32", "34", "36", "38"],
  //     brand: "Raymond",
  //     material: "Polyester Blend",
  //     stock: 30,
  //     image: "https://as2.ftcdn.net/v2/jpg/04/86/94/63/1000_F_486946394_itDniDdY8BA1ORKNHbcW1Ij9wPeOsMMx.jpg"
  //   },
  //   {
  //     id: 3,
  //     name: "Blue Denim Jeans",
  //     price: 1299,
  //     category: "Men",
  //     description: "Classic blue denim jeans with a slim fit and stretch fabric for comfort.",
  //     type: "Jeans",
  //     size: ["28", "30", "32", "34", "36"],
  //     brand: "Wrangler",
  //     material: "Denim",
  //     stock: 40,
  //     image: "https://t4.ftcdn.net/jpg/03/03/36/97/240_F_303369705_Ap2BaZOlOMHqwtWmtNb1TBlgRmXtgtoh.jpg"
  //   },
  //   {
  //     id: 4,
  //     name: "Printed T-Shirt",
  //     price: 499,
  //     category: "Men",
  //     description: "Trendy printed t-shirt made from breathable fabric, perfect for summer.",
  //     type: "T-Shirt",
  //     size: ["S", "M", "L", "XL"],
  //     brand: "Nike",
  //     material: "Cotton",
  //     stock: 60,
  //     image: "https://as1.ftcdn.net/v2/jpg/05/19/35/57/1000_F_519355756_kXfktwJ6Kz5QJIkH8ySeVwCbXYdkGyFB.jpg"
  //   },
  //   {
  //     id: 5,
  //     name: "Leather Jacket",
  //     price: 2999,
  //     category: "Men",
  //     description: "Premium leather jacket with a stylish design and comfortable fit.",
  //     type: "Jacket",
  //     size: ["M", "L", "XL"],
  //     brand: "Zara",
  //     material: "Genuine Leather",
  //     stock: 20,
  //     image: "https://as1.ftcdn.net/v2/jpg/04/61/75/80/1000_F_461758062_xEip5jqZxzY6fxyd8xBGzZYh6h5B8enM.jpg"
  //   },
  //   {
  //     id: 6,
  //     name: "Winter Sweater",
  //     price: 1200,
  //     category: "Men",
  //     description: "Soft and warm wool sweater, perfect for chilly winters.",
  //     type: "Sweater",
  //     size: ["S", "M", "L", "XL"],
  //     brand: "H&M",
  //     material: "Wool",
  //     stock: 35,
  //     image: "https://as2.ftcdn.net/v2/jpg/01/81/21/37/1000_F_181213709_YMfYlFJG3WxbVjSKR9FJQgWWTXelWDmF.jpg"
  //   },
  //   {
  //     id: 7,
  //     name: "Floral Dress",
  //     price: 1499,
  //     category: "Women",
  //     description: "Beautiful floral printed dress for casual and party wear.",
  //     type: "Dress",
  //     size: ["S", "M", "L", "XL"],
  //     brand: "Forever 21",
  //     material: "Rayon",
  //     stock: 25,
  //     image: "https://as2.ftcdn.net/v2/jpg/02/91/78/58/1000_F_291785819_3M6wIcb5BwVStHZxV38MIgOdMc7qPhXJ.jpg"
  //   },
  //   {
  //     id: 8,
  //     name: "Ankle-Length Leggings",
  //     price: 699,
  //     category: "Women",
  //     description: "Stretchable leggings with an elastic waistband for ultimate comfort.",
  //     type: "Leggings",
  //     size: ["XS", "S", "M", "L", "XL"],
  //     brand: "Adidas",
  //     material: "Spandex",
  //     stock: 45,
  //     image: "https://as1.ftcdn.net/v2/jpg/01/30/75/06/1000_F_130750621_HUuWtyrRgJHgk55v1IOIvgOdLduj1fob.jpg"
  //   },
  //   {
  //     id: 9,
  //     name: "Sports Shoes",
  //     price: 2499,
  //     category: "Unisex",
  //     description: "Lightweight running shoes with excellent grip and comfort.",
  //     type: "Shoes",
  //     size: ["6", "7", "8", "9", "10"],
  //     brand: "Puma",
  //     material: "Mesh & Rubber",
  //     stock: 50,
  //     image: "https://as2.ftcdn.net/v2/jpg/02/18/95/39/1000_F_218953981_WZqXxFUXvcFwHnQKyOnMshJLUJH3wvdH.jpg"
  //   },
  //   {
  //     id: 10,
  //     name: "Handbag",
  //     price: 1799,
  //     category: "Women",
  //     description: "Elegant leather handbag with multiple compartments for storage.",
  //     type: "Accessories",
  //     size: "Medium",
  //     brand: "Gucci",
  //     material: "Faux Leather",
  //     stock: 30,
  //     image: "https://as1.ftcdn.net/v2/jpg/02/34/93/61/1000_F_234936136_BpfUOqp4KDjDtV8oKNjHjN9nAyv7EtMw.jpg"
  //   }
  // ];

  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products); // ✅ Correct path

  useEffect(() => {
    
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);



  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Hero Section */}
      <ProductCrousel />
      <section className="bg-white py-16  text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Discover Amazing Products!
        </h1>
        <p className="text-gray-600 mt-2">
          Shop the latest trends at unbeatable prices.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Shop Now <ShoppingCart className="ml-2" />
        </Link>
      </section>
      {/* <SubCat/> */}
      <AllCategories />

      {/* Featured Products */}
      <section className="w-max mx-auto py-12 ">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Featured Products
        </h2>
        <div className=" mt-6 overflow-hidden">
          <Card  />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4 mt-10">
        <p>© 2025 YourShop. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
