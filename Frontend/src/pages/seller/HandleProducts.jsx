import axios from "axios";
import { useState, useEffect } from "react";
import AddProducts from "../../Comp/seller/AddProducts";
import EditProducts from "../../Comp/seller/EditProducts";

const HandleProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addproduct, setaddproduct] = useState(false);
  const [editproduct, seteditproduct] = useState(false);
const [selectedProduct,setselectedProduct]= useState([])
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/products/all"); // Replace with actual API
      const data = await response.data;
      console.log(data);

      setProducts(data?.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete("http://localhost:5000/api/v1/products/delete",productId);

      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    document.body.style.overflow = addproduct ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [addproduct]);


  const handleEdit = (productId) => {
    console.log("Edit product:", productId);
    const editproduct = products.find((product) => product._id !== productId)
    console.log(editproduct ? editproduct : "");
    setselectedProduct(editproduct)
    seteditproduct(true)
  };

  const handleAddProduct = () => {
    console.log("Add new product");
    setaddproduct(true)
  };

  if (loading) {
    return <p className="text-center mt-5">Loading products...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Your Products ({products.length})</h2>
      {addproduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm">
          <div className="bg-white  max-h-[90vh] w-[90%] md:w-max overflow-y-auto rounded-lg  p-4">
            <AddProducts onClose={() => setaddproduct(false)} />
          </div>
        </div>
      )}

      {editproduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm">
          <div className="bg-white  max-h-[90vh] w-[90%] md:w-max overflow-y-auto rounded-lg  p-4">
            <EditProducts
              product={selectedProduct} 
              onClose={() => seteditproduct(false)}
            />
          </div>
        </div>
      )}


      <button onClick={handleAddProduct} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">
        Add New Product
      </button>

      {products.length === 0 ? (
        <p>No products listed yet.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <li
              key={product._id}
              className="p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Image & Info */}
              <div className="flex gap-4 items-center w-full md:w-2/3">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-600">INR {product.price}</p>
                  <p className="text-sm text-gray-600">Category: {product.category}</p>
                  <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                  <p className="text-sm text-gray-600">Brand: {product.brand}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 md:gap-3">
                <button
                  onClick={() => handleEdit(product._id)}
                  className="px-4 py-1 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="px-4 py-1 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                >
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
