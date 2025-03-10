import { useEffect, useState } from "react";

const Categories = ({ category, title }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("your-backend-api-url") // Replace with your actual API URL
      .then((res) => res.json())
      .then((data) => {
        const filteredProducts = data.filter((product) => product.category.toLowerCase() === category.toLowerCase());
        setProducts(filteredProducts);
      });
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="text-center py-10">
        <h2 className="text-5xl font-extrabold text-gray-800">{title} Collection</h2>
        <p className="text-lg text-gray-600 mt-2">Find the best styles in {title}</p>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.name} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
              <img src={product.images[0]} alt={product.name} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-500">Brand: {product.brand}</p>
                <p className="text-gray-700 font-bold text-xl">₹{product.price}</p>
                <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
