import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function ProductCarousel({ className = '' }) {
  const products = [
    {
      img: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      name: "Men's Clothes",
      des: 'High-quality product with amazing features',
    },
    {
      img: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      name: 'Shirts',
      des: 'High-quality product with amazing features',
    },
    {
      img: 'https://images.pexels.com/photos/16170/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      name: 'Jackets',
      des: 'High-quality product with amazing features',
    },
    {
      img: 'https://images.pexels.com/photos/13758357/pexels-photo-13758357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      name: 'Women',
      des: 'High-quality product with amazing features',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  };

  return (
    <div
      role="region"
      aria-label="Featured Products Carousel"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative w-full max-w-7xl mx-auto my-6 h-[380px] md:h-[480px] overflow-hidden rounded-2xl shadow-md bg-slate-900 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {products.map((product, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={index}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              {/* Caption */}
              <div className="absolute bottom-8 left-6 md:left-12 right-6 md:right-12 text-white">
                <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold tracking-wider uppercase bg-blue-600/90 rounded-full backdrop-blur-sm">
                  Featured Collection
                </span>
                <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-sm md:text-base text-slate-200 max-w-xl">
                  {product.des}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev button */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-900 shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Next button */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-900 shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === activeIndex}
            className={`h-2 transition-all rounded-full ${
              index === activeIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductCarousel;
