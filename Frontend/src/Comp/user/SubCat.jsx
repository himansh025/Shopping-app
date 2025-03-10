import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function SubCat() {
    const {items}= useSelector((state)=>state.products)
    console.log("lets sub",items);
const tech = items?.filter((item) => item.attributes.type === "Gadget");
console.log("Filtered Gadgets:", tech);

// Organizing gadgets into categories dynamically
const Gadgets = tech.reduce((acc, item) => {
  if (item.name.toLowerCase().includes("phone")) {
    acc.Phones.push({ img: item.images[0], name: item.name, path: `/product/${item.name}` });
  } else if (item.name.toLowerCase().includes("laptop")) {
    acc.Laptops.push({ img: item.images[0], name: item.name, path: `/product/${item.name}` });
  } else {
    acc.Accessories.push({ img: item.images[0], name: item.name, path: `/product/${item.name}` });
  }
  return acc;
}, { Phones: [], Laptops: [], Accessories: [] });

const categories = [
  {
    title: "Gadgets",
    items: [...Gadgets.Phones, ...Gadgets.Laptops, ...Gadgets.Accessories],
  },
];

console.log("Gadgets Categories:", categories);

  
    
//   const categories = [
//     {
//       title: "Gadgets",
//       items: [
//         { img: "https://example.com/phone.jpg", name: "Phones", path: "/phones",extra:"" },
//         { img: "https://example.com/laptop.jpg", name: "Laptops", path: "/laptops" ,extra:""}
//         { img: "https://example.com/accessories.jpg", name: "Accessories", path: "/accessories",extra:"" }
//         { img: "https://example.com/accessories.jpg", name: "Accessories", path: "/accessories",extra:"" }
//         { img: "https://example.com/accessories.jpg", name: "Accessories", path: "/accessories",extra:"" }
//         { img: "https://example.com/accessories.jpg", name: "Accessories", path: "/accessories",extra:"" }
//         { img: "https://example.com/accessories.jpg", name: "Accessories", path: "/accessories",extra:"" }
//       ],
//     }
    // ,
    // {
    //   title: "Home Essentials",
    //   items: [
    //     { img: "https://example.com/furniture.jpg", name: "Furniture", path: "/furniture" },
    //     { img: "https://example.com/kitchen.jpg", name: "Kitchen", path: "/kitchen" },
    //     { img: "https://example.com/decor.jpg", name: "Decor", path: "/decor" },
    //     { img: "https://example.com/decor.jpg", name: "Decor", path: "/decor" },
    //     { img: "https://example.com/decor.jpg", name: "Decor", path: "/decor" },
    //     { img: "https://example.com/decor.jpg", name: "Decor", path: "/decor" },
    //     { img: "https://example.com/decor.jpg", name: "Decor", path: "/decor" },
    //   ],
    // },
//   ];

  return (
    <div className="w-full mx-auto h-max bg-gray-100 py-10">
   

      {/* Loop through each category */}
      {categories.map((category, idx) => (
        <div key={idx} className="mb-10 px-5 md:px-10">
          {/* Category Title */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">{category.title}</h2>
          
          {/* Horizontal Scroll Section */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {category.items.map((item, index) => (
              <Link key={index} to={item.path} className="flex-none shadow-lg hover:shadow-2xl bg-neutral-200 m-2 w-40 sm:w-48 lg:w-56">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-105 hover:shadow-lg">
                  <img src={item?.img} alt="NAME" className="h-40 w-full object-cover"  />
                  <div className="p-3 text-center">
                    <h3 className="text-lg font-medium text-gray-700">{item.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubCat;
