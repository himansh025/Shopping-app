import { Link } from 'react-router-dom';
import { ArrowUpRight, Camera } from 'lucide-react';

const COLLAGE_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    title: 'Autumn Editorial',
    tag: 'Lookbook',
    link: '/women',
    span: 'col-span-12 md:col-span-6 md:row-span-2 min-h-[360px] md:min-h-[500px]',
  },
  {
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
    title: 'Tailored Essentials',
    tag: 'Menswear',
    link: '/men',
    span: 'col-span-6 md:col-span-3 min-h-[220px]',
  },
  {
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    title: 'Everyday Ease',
    tag: 'Minimalist',
    link: '/women',
    span: 'col-span-6 md:col-span-3 min-h-[220px]',
  },
  {
    url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    title: 'Modern Silhouette',
    tag: 'Trending',
    link: '/women',
    span: 'col-span-6 md:col-span-3 min-h-[220px]',
  },
  {
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    title: 'Smart Tech Gear',
    tag: 'Electronics',
    link: '/electronics',
    span: 'col-span-6 md:col-span-3 min-h-[220px]',
  },
];

export function ImageCollage() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.24em] text-blue-600 mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Visual Gallery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Curated Style Moments
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs">
            Explore editorial capsules, styled pairings, and everyday inspiration.
          </p>
        </div>

        {/* 12-Column Responsive Grid */}
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          {COLLAGE_IMAGES.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`group relative rounded-2xl overflow-hidden bg-slate-100 shadow-xs hover:shadow-lg transition-all duration-300 ${item.span}`}
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-end justify-between text-white">
                <div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-300 block mb-1">
                    {item.tag}
                  </span>
                  <h3 className="text-sm sm:text-lg font-bold text-white leading-tight">
                    {item.title}
                  </h3>
                </div>

                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-900 transition-colors">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImageCollage;
