import { useState, useEffect } from "react";
import axiosInstance from "../../Config/apiConfig";
import BackArrow from "../../Comp/BackArrow";

const SellerProfile = () => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const user=JSON.parse(sessionStorage.getItem("user"))
const res= await axiosInstance.get('/seller/profile')
 
        setSeller(user);
      } catch (error) {
        console.error("Error fetching seller profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading seller profile...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6  bg-white rounded-lg shadow-md">
         <BackArrow className="mb-4" size={32} />
      <h2 className="text-2xl text-center font-semibold mb-4">Seller Profile</h2>


      {seller && (
        <div className="flex flex-col items-center space-y-4">
          <img
            src={imagePreview || seller.profileImage || "https://via.placeholder.com/150"}
            alt="Seller"
            className="w-24 h-24 rounded-full bg-black text-white border"
          />
          {/* <input type="file" accept="image/*" onChange={handleImageChange} className="p-2 border rounded" /> */}
          <p className="text-lg font-medium">Name : {seller.
businessName
}</p>
          <p className="text-gray-600">Email : {seller.email}</p>
          <p className="text-gray-600">Registration No. : {seller.registrationNumber}</p>

          <p className="text-gray-600">Address : {seller.businessAddress}</p>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Seller</span>

          <div className="mt-4 w-full">
            <h3 className="text-xl font-semibold text-center">Your Listed Products</h3>
            <p className="text-gray-600">{seller.products.length}</p>
            {seller.products.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {seller.products.map((product) => (
                  <li key={product._id} className="p-3 border rounded flex justify-between">
                    <span>{product.name} - ${product.price}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center mt-2">No products listed yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
    