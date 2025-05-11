import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AddProducts from "../../Comp/seller/AddProducts";
import EditProducts from "../../Comp/seller/EditProducts";
import ProductCard from "../../Comp/seller/ProductCard";
import axiosInstance from "../../Config/apiConfig";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addproduct, setaddproduct] = useState(false);
  const [editproduct, seteditproduct] = useState(false);
  const [selectedProduct, setselectedProduct] = useState([]);

  const { items, searchActive } = useSelector((state) => state.products);
  const displayProducts = searchActive ? items : products;

  useEffect(() => {
   if(!searchActive) fetchProducts();
  }, []);


  const fetchProducts = async () => {
    try {
      const response = await  axiosInstance.get(`/products/seller/all`,{params:{}});
      const data = await response.data;
      setProducts(data?.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axiosInstance.delete(`/products/delete/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    document.body.style.overflow = addproduct ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [addproduct]);

  const handleEdit = async(productId) => {
     try {
      const res= await axiosInstance.delete(`/products/update/${productId}`);
      if(res)setProducts(products.filter((product) => product._id !== productId));
      
    } catch (error) {
      console.error("Error deleting product:", error);
    }
    const editproduct = products.find((product) => product._id === productId);
    setselectedProduct(editproduct);
    seteditproduct(true);
  };

  const handleAddProduct = () => {
    setaddproduct(true);
  };

  if (loading) {
    return <p className="text-center mt-5">Loading products...</p>;
  }

  return (
    <div className="max-w-6xl mt-30 mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        Your Products ({displayProducts.length})
      </h2>

      {addproduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm">
          <div className="bg-white max-h-[90vh] w-[90%] md:w-max overflow-y-auto rounded-lg p-4">
            <AddProducts onClose={() => setaddproduct(false)} />
          </div>
        </div>
      )}

      {editproduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm">
          <div className="bg-white max-h-[90vh] w-[90%] md:w-max overflow-y-auto rounded-lg p-4">
            <EditProducts
              product={selectedProduct}
              onClose={() => seteditproduct(false)}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleAddProduct}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add New Product
      </button>

      {displayProducts.length === 0 ? (
        <p>No products listed yet.</p>
      ) : (
        <ul className="space-y-4">
          {displayProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
