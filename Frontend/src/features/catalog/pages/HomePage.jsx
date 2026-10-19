/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import ProductCarousel from "../components/ProductCarousel";
import Card from "../components/ProductGrid";
import AllCategories from "../components/AllCategories";
import Loader from "../../../components/common/Loader";

function HomePage({ data }) {
  const { items, searchActive, status } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  if (!items?.length && status === "loading") return <Loader />;

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {!searchActive ? (
        <>
          <ProductCarousel />

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
        <section className="w-auto mx-auto mt-3 overflow-hidden  py-12">
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
