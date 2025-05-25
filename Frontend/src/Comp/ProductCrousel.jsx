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


  return (
    <div className="w-full mt-20 h-[500px]">
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
