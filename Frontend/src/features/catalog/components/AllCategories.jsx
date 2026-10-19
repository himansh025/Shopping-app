import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import heroImg1 from '../../../assets/-original-imah4aakqjyhdkzd.webp';
import heroImg2 from '../../../assets/-original-imah4kfupk3zbayz.webp';
import heroImg3 from '../../../assets/image_3_8209ecc7-a2d5-42d5-9db9-c65dc7622dcd.webp';
import heroImg4 from '../../../assets/-original-imah4aakzbkzhdpx.webp';

const CATEGORIES = [
  {
    name: "Men's Apparel",
    description: "Shirts, jackets, denim & essentials",
    path: "/men",
    img: heroImg1,
    tag: "Trending",
  },
  {
    name: "Women's Collection",
    description: "Dresses, tops, knitwear & accessories",
    path: "/women",
    img: heroImg2,
    tag: "Popular",
  },
  {
    name: "Electronics & Tech",
    description: "Audio, gadgets, chargers & wearables",
    path: "/electronics",
    img: heroImg3,
    tag: "New In",
  },
  {
    name: "Kids & Youth",
    description: "Everyday comfort, sets & activewear",
    path: "/boy",
    img: heroImg4,
    tag: "Explore",
  },
];

export function AllCategories() {
  return (
    <section className="py-16 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5 block">
              Curated Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Shop by Category
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-md">
            Explore authentic merchandise across our most popular departments with verified quality and direct merchant fulfillment.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.path}
              className="group relative flex flex-col h-80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-slate-200/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              {/* Category Background Image */}
              <img
                src={cat.img}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Gradient Scrim for readable text */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />

              {/* Top Tag */}
              <div className="relative z-10 p-4">
                <span className="inline-block px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs">
                  {cat.tag}
                </span>
              </div>

              {/* Bottom Content Area */}
              <div className="relative z-10 mt-auto p-5 text-white flex items-end justify-between">
                <div>
                  <h3 className="text-lg font-bold group-hover:text-blue-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-200/90 mt-1 line-clamp-1">
                    {cat.description}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:bg-blue-600 transition-colors shrink-0 ml-2">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AllCategories;
