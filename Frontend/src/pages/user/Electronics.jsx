import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from '../../store/productsSlicer.js';
import { useNavigate } from "react-router-dom";

const Electronics = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products); // ✅ Correct path
const navigate= useNavigate();
  console.log(items);


  useEffect(() => {
    
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const menProducts = items?.filter((p) => p.attributes.type === "Gadget");


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Electronics Gadget Collection</h1>
      <p className="text-gray-600 mb-6">
        Discover the latest trends in Electronics Gadget
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
                <p className="font-semibold mt-2">${product.price}</p>
                <p className="text-sm text-gray-600">
                  Brand: {product.brand} | Material: {product.material}
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

export default Electronics;
