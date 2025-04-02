import React from "react";
import { Link } from "react-router-dom";
function AllCategories() {
  const categories = [
    {
      img: "https://imgs.search.brave.com/Pw7CiDW2PHfRGT7goLkDkSr99jTixcnXBzj6vPX8bh4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Y3JlYXRlLnZpc3Rh/LmNvbS9hcGkvbWVk/aWEvc21hbGwvNjg1/ODU3OTI0L3N0b2Nr/LXBob3RvLWNoZWVy/ZnVsLW11bHRpcmFj/aWFsLW1lbi1icmln/aHQtc3VpdHMtc2l0/dGluZy1mbG9vci1j/cm9zc2VkLWxlZ3Mt/c21pbGluZw",
      name: "Men's",
    },
    {
      img: "https://imgs.search.brave.com/9WOqqmn9ZAmRIPGHuMSvqP4OUEQ7knaYcmXMvsYVkBY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9m/YWxsLXN0dWRpby1z/aG90LXR3by1tb2Rl/bHMtd2l0aC1ibG9u/ZC13YXZ5LWhhaXJz/dHlsZS13b29sLXN0/cmF3LWhhdC13ZWFy/aW5nLXN0cmlwZWQt/cG9uY2hvXzI3MzQ0/My0zNzkzLmpwZz9z/ZW10PWFpc19oeWJy/aWQ",
      name: "Women's",
    },
    {
      img: "https://images.pexels.com/photos/682933/pexels-photo-682933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      name: "Electronics",
    },

    // {
    //   img: "https://imgs.search.brave.com/vxicPzgQPcBFEOV-KIHunPyN5DgEWb5eVc4uGwTqd-I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9m/dWxsLXNob3QtYm95/cy13aXRoLXN1bmds/YXNzZXMtcG9zaW5n/XzIzLTIxNDg0MjMx/MzYuanBnP3NlbXQ9/YWlzX2h5YnJpZA",
    //   name: "Boy's",
    // },
    // {
    //   img: "https://imgs.search.brave.com/aZJsp8d0aIfNNv1aza-SAnaCWy9JI-LJZC6vIEtnYEQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9j/dXRlLWxpdHRsZS1n/aXJsLXdpdGgtc2hv/cHBpbmctYmFncy15/ZWxsb3ctYmFja2dy/b3VuZF8xMTU3LTI3/ODQwLmpwZz9zZW10/PWFpc19oeWJyaWQ",
    //   name: "Girl's",
    // },

    
  ];

  let cats = ["men", "women","electronics"
    // ,"boy", "girl"
  ]

  return (
    <div className="w-full mx-auto h-max bg-gray-100 py-10">
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold   text-gray-800 border-b-4 border-blue-500 inline-block pb-1">
          Shop by Categories
        </h1>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-5 md:px-10">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-105 hover:shadow-lg"
          >
            <Link to={`/${cats[index]}`}>
              <img
                src={category.img}
                className="h-72 w-full object-cover"
                alt={category.name}
              />
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold text-gray-700">{category.name}</h2>
              </div>
            </Link>
          </div>
        ))}

      </div>
    </div>
  );
}







export default AllCategories;
