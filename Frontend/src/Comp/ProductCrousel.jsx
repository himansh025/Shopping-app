import { Carousel } from "react-bootstrap"; // Ensure Bootstrap is installed

function ProductCarousel() {
  const products = [
    {
      img: "https://as1.ftcdn.net/v2/jpg/01/30/75/06/1000_F_130750621_HUuWtyrRgJHgk55v1IOIvgOdLduj1fob.jpg",
      name: "Product 1",
      des: "High-quality product with amazing features",
    },
    {
      img: "https://as2.ftcdn.net/v2/jpg/02/18/95/39/1000_F_218953981_WZqXxFUXvcFwHnQKyOnMshJLUJH3wvdH.jpg",
      name: "Product 2",
      des: "High-quality product with amazing features",
    },
    {
      img: "https://as2.ftcdn.net/v2/jpg/02/18/95/39/1000_F_218953981_WZqXxFUXvcFwHnQKyOnMshJLUJH3wvdH.jpg",
      name: "Product 3",
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
