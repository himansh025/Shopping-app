import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Config/apiConfig";
import Loader from "../../Comp/Loader";

const Men = () => {
  const [menProducts, setMenProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <h1 className="text-3xl font-bold mb-4">Men's Collection</h1>
      <p className="text-gray-600 mb-6">
        Discover the latest trends in men's fashion
      </p>

      {menProducts.length === 0 ? (
        <p className="text-gray-500 text-center">No products found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <img
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-500 text-sm">{product.category}</p>
                <p className="text-sm text-gray-700">{product.description}</p>
                <p className="font-semibold mt-2">₹{product.price}</p>
                <p className="text-sm text-gray-600">
                  Brand: {product.brand} | Material: {product.material}
                </p>
                <p className="text-sm text-gray-600">
                  Sizes: {product.size?.join(", ") || product.attributes?.size?.join(", ")}
                </p>
                <p className="text-sm text-gray-600">
                  Seller: {product.seller?.name} ({product.seller?.contact})
                </p>
                <button
                  onClick={() => navigate(`/addToCart/${product._id}`)}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Men;
