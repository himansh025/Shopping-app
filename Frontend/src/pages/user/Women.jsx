import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/productsSlicer.js";

const Women = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  // Filter women's products
  const womenProducts = items?.filter((p) => p.attributes.type === "Women") || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Women's Collection</h1>
        <p className="text-gray-600">Explore our latest women's fashion styles</p>
      </div>

      {status === "loading" ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : womenProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {womenProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <div className="h-48 bg-gray-200">
                <img 
                  src={product.image?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <button className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition duration-300">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Featured Products Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                <img 
                  src={`/api/placeholder/400/300?text=Featured+${item}`}
                  alt={`Featured product ${item}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">Women's Product {item}</h3>
                <p className="text-gray-600 text-sm mb-2">High-quality fashion item</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">$49.99</span>
                  <button className="bg-pink-500 text-white px-3 py-1 rounded text-sm hover:bg-pink-600">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Women;
