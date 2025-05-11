import React, { useState, useEffect } from "react";
import axiosInstance from "../../Config/apiConfig";
import BackArrow from "../../Comp/BackArrow";
import EditProfile from "../../Comp/seller/EditProfile"; // ✅ Proper import of child component
import { User } from "lucide-react";

const SellerProfile = () => {
  const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await axiosInstance.get("/seller/profile");
        const userproducts = await axiosInstance.get("/products/seller/all");
        console.log(userproducts)
        setProducts(userproducts.data.products)
        setSeller(res.data.seller);
      } catch (error) {
        console.error("Error fetching seller profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, []);

  const handleProfileUpdate = (updatedSeller) => {
    setSeller(updatedSeller);
    setEditMode(false);
  };

  if (loading) return <p className="text-center  ">Loading seller profile...</p>;

  return (
    <div className="max-w-6xl  mx-auto p-6 mt-30 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl text-center font-semibold mb-4">Seller Profile</h2>
      <BackArrow className="mb-4" size={32} />
      <div className="flex flex-col  md:flex-row justify-around">

        {seller?.profileImage ? (
          <img
            src={seller.profileImage}
            alt="Seller"
            className="w-24 h-24 rounded-full border"
          />
        ) : (
          <div className="w-26 h-26 flex items-center justify-center rounded-full bg-gray-200 border">
            <User className="text-4xl w-24 h-24 text-gray-700" />
          </div>
        )}

        {!editMode ? (
          <div className="space-y-3 grid md:grid-cols-2">
            <p><strong>Name:</strong> {seller.fullname || "Not Added"}</p>
            <p><strong>Email:</strong> {seller.email}</p>
            <p><strong>Phone No.:</strong> {seller.phoneNumber || "Not Added"}</p>
            <p><strong>Registration No.:</strong> {seller.registrationNumber || "Not Added"}</p>
            <p><strong>Bussiness Name:</strong> {seller.businessName || "Not Added"}</p>
            <p><strong>Address:</strong> {seller.businessAddress || "Not Added"}</p>

            {/* ✅ Edit Profile Button */}
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>


          </div>
        ) : (
          <EditProfile seller={seller} onUpdate={handleProfileUpdate} />
        )}
      </div>
        <div className="mt-6">
              <h3 className="text-xl font-semibold text-center">Your Listed Products</h3>
             {products?.length > 0 ? (
  <ul className="mt-4 space-y-4">
    {products.map((product) => (
      <li
        key={product._id}
        className="p-4 border rounded-lg flex items-center justify-between gap-4 bg-white shadow-sm"
      >
        {/* Product Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className=" w-24 h-24 md:w-34 md:h-34  object-cover rounded-md"
        />

        {/* Product Details */}
        <div className="flex-1 ">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.description}</p>
          <div className="text-sm grid grid-cols-2 gap-3 text-gray-600 mt-1">
            <p><span className="font-medium">Price:</span> ₹{product.price}</p>
            <p><span className="font-medium">Brand:</span> {product.brand}</p>
            <p><span className="font-medium">Stock:</span> {product.stock}</p>
            <p><span className="font-medium">Category:</span> {product.category}</p>
            <p><span className="font-medium">Type:</span> {product.attributes?.type}</p>
          </div>
        </div>
      </li>
    ))}
  </ul>
) : (
  <p className="text-center mt-4 text-gray-600">No products listed yet.</p>
)}

            </div>
    </div>
  );
};

export default SellerProfile;
