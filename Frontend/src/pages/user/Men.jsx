import { useEffect, useState } from "react";
import axiosInstance from "../../Config/apiConfig";
import Loader from "../../Comp/Loader";
import ProductCard from "../../Comp/ProductCard";

const Men = () => {
  const [menProducts, setMenProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/products/all?category=Men");
        if (response.data && response.data.products) {
          setMenProducts(response.data.products);
        }
      } catch (error) {
        console.error("Error fetching men products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenProducts();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Men&apos;s Collection
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Discover the latest trends in men&apos;s fashion and apparel
        </p>
      </div>

      {menProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
          <p className="text-slate-500">No products found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Men;
