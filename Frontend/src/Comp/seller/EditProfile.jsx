import React, { useState } from "react";
import axiosInstance from "../../Config/apiConfig";

const EditProfile = ({ seller, onUpdate }) => {
  const [formData, setFormData] = useState({
    businessName: seller.businessName || "",
    fullname: seller.fullname || "",
    registrationNumber: seller.registrationNumber || "",
    businessAddress: seller.businessAddress || "",
    phoneNumber: seller.phoneNumber || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.put("/seller/profile/update", formData);
      onUpdate(res.data.seller); // Update parent state
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl bg-white text-black mx-auto p-6 shadow-md rounded"
    >
      <h2 className="text-2xl font-semibold text-center mb-4">Edit Seller Profile</h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Business Name</label>
        <input
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Your Business Name"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Full Name</label>
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Full Name"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Phone Number"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Registration Number</label>
        <input
          type="text"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Registration Number"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Business Address</label>
        <input
          type="text"
          name="businessAddress"
          value={formData.businessAddress}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Business Address"
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditProfile;
