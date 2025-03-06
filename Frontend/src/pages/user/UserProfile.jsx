import { useState, useEffect } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://api.example.com/user-profile");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading user profile...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">User Profile</h2>

      {user && (
        <div className="flex flex-col items-center space-y-4">
          <img
            src={imagePreview || user.profileImage || "https://via.placeholder.com/150"}
            alt="User"
            className="w-24 h-24 rounded-full border"
          />
          <input type="file" accept="image/*" onChange={handleImageChange} className="p-2 border rounded" />
          <p className="text-lg font-medium">{user.name}</p>
          <p className="text-gray-600">{user.email}</p>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">User</span>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
