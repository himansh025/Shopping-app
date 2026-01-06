import React from 'react';

const Boy = () => {
  const subcategories = [
    {
      name: 'T-shirts',
      image: '/api/placeholder/400/300?text=Boys+Tshirts',
      items: ['Graphic Tees', 'Polos', 'Long Sleeve', 'Casual Tees']
    },
    {
      name: 'Pants',
      image: '/api/placeholder/400/300?text=Boys+Pants',
      items: ['Jeans', 'Cargo Pants', 'Shorts', 'Track Pants']
    },
    {
      name: 'Shoes',
      image: '/api/placeholder/400/300?text=Boys+Shoes',
      items: ['Sneakers', 'Sports Shoes', 'Casual Shoes', 'Sandals']
    },
    {
      name: 'School Wear',
      image: '/api/placeholder/400/300?text=Boys+School',
      items: ['Uniforms', 'Backpacks', 'School Shoes', 'Sports Kits']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Boys' Collection</h1>
        <p className="text-gray-600">Stylish and comfortable clothing for active boys</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {subcategories.map((subcat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            <div className="h-48 bg-gray-200">
              <img 
                src={subcat.image}
                alt={subcat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{subcat.name}</h3>
              <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-300">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                <img 
                  src={`/api/placeholder/400/300?text=Featured+${item}`}
                  alt={`Featured product ${item}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">Boys' Product {item}</h3>
                <p className="text-gray-600 text-sm mb-2">Durable and comfortable</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">$29.99</span>
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export  default Boy 