import { useState, useEffect } from "react";

const HandleProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://api.example.com/seller-products"); // Replace with actual API
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await fetch(`https://api.example.com/products/${productId}`, { method: "DELETE" });
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (productId) => {
    console.log("Edit product:", productId);
    // Navigate to edit page or open a modal (implementation needed)
  };

  const handleAddProduct = () => {
    console.log("Add new product");
    // Navigate to add product page (implementation needed)
  };

  if (loading) {
    return <p className="text-center mt-5">Loading products...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Your Products</h2>

      <button onClick={handleAddProduct} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">
        Add New Product
      </button>

      {products.length === 0 ? (
        <p>No products listed yet.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <li key={product.id} className="p-4 border rounded flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="text-lg font-medium">{product.name}</p>
                  <p className="text-gray-600">${product.price}</p>
                </div>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(product.id)} className="px-3 py-1 bg-yellow-500 text-white rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(product.id)} className="px-3 py-1 bg-red-600 text-white rounded">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HandleProducts;
