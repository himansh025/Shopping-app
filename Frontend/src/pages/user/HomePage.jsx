import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import ProductCrousel from "../../Comp/ProductCrousel";
import Card from "../../Comp/Card";
import AllCategories from "../../Comp/AllCategories";
import NavLinks from "../../Comp/NavLinks";

function HomePage({ data }) {
  const { items, searchActive } = useSelector((state) => state.products);
  const {user} = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen w-full bg-gray-100">
      
      {user &&(
        <NavLinks />
      )}

      {!searchActive ? (
        <>
          <ProductCrousel />

          <section className="bg-white py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-800">
              Discover Amazing Products!
            </h1>
            <p className="text-gray-600 mt-2">
              Shop the latest trends at unbeatable prices.
            </p>
            {user && user.role === "user" ? (
              <Link
                to="/whislist"
                className="mt-6 inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
              >
                Shop Now <ShoppingCart className="ml-2" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="mt-6 inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
              >
                Shop Now <ShoppingCart className="ml-2" />
              </Link>
            )}
          </section>

          <AllCategories />

          <section className="w-full  py-12">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Featured Products
            </h2>
            <div className="mt-6 w-full  overflow-hidden">
              <Card items={data} />
            </div>
          </section>
        </>
      ) : (
        <section className="w-max mx-auto py-12">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Search Results
          </h2>
          <div className="mt-6 overflow-hidden">
            <Card items={items} />
          </div>
        </section>
      )}

      <footer className="bg-gray-900 text-white text-center py-4 mt-10">
        <p>© 2025 MyShop. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
