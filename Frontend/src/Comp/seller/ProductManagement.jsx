import { useState, useEffect } from "react";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    try {
      await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
      });
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditProduct(product);
  };

  // Update product
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${editProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduct),
      });

      if (response.ok) {
        setProducts(products.map((p) => (p._id === editProduct._id ? editProduct : p)));
        setEditProduct(null);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading products...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Manage Your Products</h2>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <li key={product._id} className="p-4 border rounded flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="text-lg font-medium">{product.name}</p>
                  <p className="text-gray-600">${product.price}</p>
                </div>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(product)} className="px-3 py-1 bg-yellow-500 text-white rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(product._id)} className="px-3 py-1 bg-red-600 text-white rounded">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
            <input
              type="text"
              value={editProduct.name}
              onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="number"
              value={editProduct.price}
              onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setEditProduct(null)} className="px-4 py-2 bg-gray-400 text-white rounded">
                Cancel
              </button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
