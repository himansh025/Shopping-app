
// GirlsPage.js
import React from 'react';

const Girl = () => {
  const subcategories = [
    {
      name: 'Dresses',
      image: '/api/placeholder/400/300?text=Girls+Dresses',
      items: ['Party Dresses', 'Casual Dresses', 'Skirts', 'Sets']
    },
    {
      name: 'Tops',
      image: '/api/placeholder/400/300?text=Girls+Tops',
      items: ['T-Shirts', 'Blouses', 'Sweaters', 'Cardigans']
    },
    {
      name: 'Bottoms',
      image: '/api/placeholder/400/300?text=Girls+Bottoms',
      items: ['Jeans', 'Leggings', 'Shorts', 'Skirts']
    },
    {
      name: 'Accessories',
      image: '/api/placeholder/400/300?text=Girls+Accessories',
      items: ['Hair Accessories', 'Bags', 'Jewelry', 'Socks']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Girls' Collection</h1>
        <p className="text-gray-600">Adorable and stylish clothing for girls of all ages</p>
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
              <button className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition duration-300">
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
                <h3 className="font-semibold mb-1">Girls' Product {item}</h3>
                <p className="text-gray-600 text-sm mb-2">Cute and comfortable</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">$34.99</span>
                  <button className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600">
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

export default Girl;