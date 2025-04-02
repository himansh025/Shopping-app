import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Orders = () => {
  // This would typically come from your API or state management
  const [orders, setOrders] = useState([
    {
      id: 1,
      date: '2025-03-28',
      status: 'Delivered',
      total: 129.99,
      items: [
        { id: 101, name: 'Wireless Headphones', price: 79.99, quantity: 1, image: '/api/placeholder/80/80' },
        { id: 102, name: 'Phone Case', price: 25.00, quantity: 2, image: '/api/placeholder/80/80' },
      ]
    },
    {
      id: 2,
      date: '2025-03-30',
      status: 'Processing',
      total: 49.95,
      items: [
        { id: 103, name: 'Bluetooth Speaker', price: 49.95, quantity: 1, image: '/api/placeholder/80/80' },
      ]
    }
  ]);

  // For demo purposes - toggle between having orders and empty state
  const toggleOrders = () => {
    if (orders.length > 0) {
      setOrders([]);
    } else {
      setOrders([
        {
          id: 1,
          date: '2025-03-28',
          status: 'Delivered',
          total: 129.99,
          items: [
            { id: 101, name: 'Wireless Headphones', price: 79.99, quantity: 1, image: '/api/placeholder/80/80' },
            { id: 102, name: 'Phone Case', price: 25.00, quantity: 2, image: '/api/placeholder/80/80' },
          ]
        },
        {
          id: 2,
          date: '2025-03-30',
          status: 'Processing',
          total: 49.95,
          items: [
            { id: 103, name: 'Bluetooth Speaker', price: 49.95, quantity: 1, image: '/api/placeholder/80/80' },
          ]
        }
      ]);
    }
  };

  const getoroder=async()=>{
    const res= await axios.get(`${import.meta.env.VITE_BASE_URL}/orders`)
    console.log(res.data);
    if(res.data){
      setOrders(res.data)
    }
  }
  useEffect(()=>{
    getoroder();
  })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
      
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg text-center">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't placed any orders.</p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">Placed on {order.date}</p>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex py-4 border-b last:border-b-0">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${item.price.toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 p-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Order Total:</span>
                  <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                </div>
                <div className="mt-4 flex space-x-3 justify-end">
                  <button className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-blue-600 rounded text-sm font-medium text-white hover:bg-blue-700 transition">
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;