import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Config/apiConfig";
import Loader from "../../Comp/Loader";

const Women = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchWomenProducts = async () => {
      try {
        setLoading(true);
        // Fetch products with category 'Women'
        const response = await axiosInstance.get("/products/all?category=Women");
        if (response.data && response.data.products) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error("Error fetching women products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWomenProducts();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Women's Collection</h1>
        <p className="text-gray-600">Explore our latest women's fashion styles</p>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <div className="h-48 bg-gray-200">
                <img
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">₹{product.price}</p>
                <button
                  onClick={() => navigate(`/addToCart/${product._id}`)}
                  className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition duration-300">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Women;
