import { Carousel } from "react-bootstrap"; // Ensure Bootstrap is installed

function ProductCarousel() {
  const products = [
    {
      img: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      name: "Men's Cloths",
      des: "High-quality product with amazing features",
    },
    {
      img: "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      name: "Shirts",
      des: "High-quality product with amazing features",
    },
    {
      img: "https://images.pexels.com/photos/16170/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      name: "Jackets",
      des: "High-quality product with amazing features",
    },
    {
      img: "https://images.pexels.com/photos/13758357/pexels-photo-13758357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      name: "Women",
      des: "High-quality product with amazing features",
    },
  ];

  // const products = [
  //   {
  //     img: '../assets/image_5-1_3a2fbf56-a6b1-46b4-ab26-ec44c26f3307.webp',
  //     name: "Product 1",
  //     des: "High-quality product with amazing features",
  //   },
  //   {
  //     img: "../assets/image_3_8209ecc7-a2d5-42d5-9db9-c65dc7622dcd.webp",
  //     name: "Product 2",
  //     des: "High-quality product with amazing features",
  //   },
  //   {
  //     img: "https://as2.ftcdn.net/v2/jpg/02/18/95/39/1000_F_218953981_WZqXxFUXvcFwHnQKyOnMshJLUJH3wvdH.jpg",
  //     name: "Product 3",
  //     des: "High-quality product with amazing features",
  //   },
  // ];
  return (
    <div className="w-full h-[500px]">
      <Carousel fade>
        {products.map((product, index) => (
          <Carousel.Item key={index}>
            <img
              src={product.img}
              alt={product.name}
              className="object-cover w-full h-[450px] p-4"
            />
            <Carousel.Caption>
              <h3>{product.name}</h3>
              <p>{product.des}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default ProductCarousel;
