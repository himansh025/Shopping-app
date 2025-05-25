import React, { useEffect, useState } from 'react';
import { 
  UserCircle, 
  Package, 
  LogOut,  
  MapPin, 
  Mail,
  Phone
} from 'lucide-react';
import axiosInstance from '../../Config/apiConfig';
import { useNavigate } from 'react-router-dom';
import BackArrow from '../../Comp/BackArrow';

function Profile() {
  const [orderData, setOrderData] = useState(null);
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get(`/user/profile`);
      setOrderData(response.data.order);
      setUserData(response?.data?.user);
      setProducts(response?.data?.products);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [ ]);

  const handleLogout = () => {
    console.log("Logging out");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateTotalSpent = () => {
    // Normalize: if orderData is not an array, wrap it in one
    const orders = Array.isArray(orderData) ? orderData : [orderData];
  
    // Calculate total spent
    const total = orders?.reduce((sum, order) => sum + (order?.totalAmount || 0), 0);
  
    return total;
  };
  
  const handleback = () => {
    navigate("/");
  };

  const handleview = () => {
    navigate("/orders");
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <UserCircle className="w-5 h-5" /> },
    { id: 'orders', label: 'My Orders', icon: <Package className="w-5 h-5" /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 mt-16 py-8 relative">
      <div className="flex items-center mb-6">
      <BackArrow className="mb-4" size={32} />
        <h1 className="text-2xl font-bold">My Account</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center space-x-4 mb-6 pb-4 border-b">
              <div className="bg-blue-100 rounded-full p-3">
                <UserCircle className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">{userData?.fullname}</h2>
                <p className="text-gray-600 text-sm">{userData?.email}</p>
              </div>
            </div>

            <nav>
              <ul>
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center w-full p-3 rounded-md text-left mb-1 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-3">{tab.icon}</span>
                      {tab.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-3 rounded-md text-left text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeTab === 'profile' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-gray-500 text-sm mb-1">Full Name</h3>
                    <p className="font-medium">{userData?.fullname}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm mb-1">Email Address</h3>
                    <p className="font-medium flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {userData?.email}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm mb-1">Phone Number</h3>
                    <p className="font-medium flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {userData?.phone}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm mb-1">Date Joined</h3>
                    <p className="font-medium">{userData?.createdAt ? formatDate(userData.createdAt) : ""}</p>
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4">Account Statistics</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {orderData?.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{calculateTotalSpent()}
                      </div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">My Orders</h2>
                {!orderData ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium">No orders yet</h3>
                    <p className="text-gray-500 mt-2 mb-4">You haven't placed any orders yet.</p>
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orderData && orderData.length > 0 ? (
                        orderData.map((order) => (
                          <tr key={order._id}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                              {order?.orderDetails?.orderId || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              {order?.createdAt ? formatDate(order.createdAt) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  order?.status === 'Delivered'
                                    ? 'bg-green-100 text-green-800'
                                    : order?.status === 'Processing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {order?.status || 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                              ${order?.totalAmount || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button className="text-blue-600 hover:text-blue-800" onClick={() => handleview(order)}>
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-gray-500">
                            No orders found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Addresses</h2>
                {orderData && orderData.length > 0 ? (
                  orderData.map((order,key) => (
                    <div key={order._id} className="border border-gray-200 rounded-md p-4 mb-4">
                    <span className='my-2'>{key+1}</span>
                      <h3 className="font-medium">Order By : {order?.name}</h3>
                      <h6 className="font-medium">Email: {order?.email}</h6>
                      <h6 className="font-medium">Ph. no. : {order?.phone}</h6>
                      <p className="text-sm text-gray-600">
                    Address : {order?.address}
                    </p>
                      <p className="text-sm text-gray-600">
                       State : {order?.state}, City : {order?.city}, Zip Code : {order?.zip}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No saved addresses available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
