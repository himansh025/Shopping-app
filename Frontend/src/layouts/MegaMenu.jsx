import { Link } from 'react-router-dom';
import { ArrowRight, Percent, ChevronRight } from 'lucide-react';
import PageContainer from './PageContainer';

/**
 * Editorial Content & Curated Highlights per Department
 */
const DEPARTMENT_CONFIG = {
  men: {
    title: 'Men’s Fashion & Essentials',
    departmentRoute: '/men',
    curatedCollections: [
      { name: 'New In: Spring / Summer', badge: 'New', to: '/men' },
      { name: 'Best Selling Tops', badge: 'Hot', to: '/category/Men\'s Clothing' },
      { name: 'Sneakers & Streetwear', badge: null, to: '/category/Men\'s Shoes' },
      { name: 'Jackets & Outerwear', badge: null, to: '/category/Men\'s Jacket' },
      { name: 'Watches & Accessories', badge: null, to: '/category/Men\'s Accessories' },
      { name: 'Clearance Outlet (Up to 50% Off)', badge: 'Sale', to: '/men' },
    ],
    curatedStyles: [
      { name: 'Minimalist Monochrome', desc: 'Effortless everyday urban essentials' },
      { name: 'Smart Formal & Blazer Sets', desc: 'Sharpened tailoring for modern work' },
      { name: 'Relaxed Athleisure', desc: 'Performance stretch comfort & gym gear' },
    ],
    showcase: {
      tag: 'NEW ARRIVALS',
      headline: 'The Urban Sartorialist Collection',
      subtext: 'Crisp fabrics, precision tailoring & contemporary aesthetics.',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Explore Men’s Wardrobe',
      to: '/men',
    },
  },
  women: {
    title: 'Women’s Luxury & Trends',
    departmentRoute: '/women',
    curatedCollections: [
      { name: 'Spring / Summer Runway', badge: 'New', to: '/women' },
      { name: 'Signature Dresses & Tops', badge: 'Trending', to: '/category/Women\'s Clothing' },
      { name: 'Outerwear, Coats & Blazers', badge: null, to: '/category/Women\'s Jacket' },
      { name: 'Jewelry, Bags & Accents', badge: null, to: '/category/Women\'s Accessories' },
      { name: 'Luxury Footwear & Heels', badge: null, to: '/women' },
      { name: 'Weekend Edit: 30% Off', badge: 'Sale', to: '/women' },
    ],
    curatedStyles: [
      { name: 'Quiet Luxury Edit', desc: 'High-end neutrals and flowing silhouettes' },
      { name: 'Bold Botanical Florals', desc: 'Vibrant spring palettes and statement pieces' },
      { name: 'Modern Power Suiting', desc: 'Structured chic for the boardroom & beyond' },
    ],
    showcase: {
      tag: 'FEATURED EDIT',
      headline: 'Effortless Chic & Modern Elegance',
      subtext: 'Explore versatile staples designed for all-day confidence.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Shop Women’s Line',
      to: '/women',
    },
  },
  kids: {
    title: 'Kids & Teens Collection',
    departmentRoute: '/boy',
    curatedCollections: [
      { name: 'Boy’s Outfits & Sets', badge: 'Popular', to: '/boy' },
      { name: 'Boy’s Active Shoes & Trainers', badge: null, to: '/category/Boy\'s Shoes' },
      { name: 'Boy’s Everyday Apparel', badge: null, to: '/category/Boy\'s Clothing' },
      { name: 'Girl’s Floral Dresses & Casuals', badge: 'Trending', to: '/girl' },
      { name: 'Girl’s Clothing Essentials', badge: null, to: '/category/Girl\'s Clothing' },
      { name: 'School & Playground Essentials', badge: null, to: '/boy' },
    ],
    curatedStyles: [
      { name: 'Playground Durable Fabrics', desc: 'Double-stitched cotton & easy wash denim' },
      { name: 'Festive & Party Wear', desc: 'Celebration-ready ensembles for all ages' },
    ],
    showcase: {
      tag: 'KIDS CORNER',
      headline: 'Vibrant Comfort for Play & Adventure',
      subtext: 'Ultra-soft fabrics, fun patterns, and durable wear.',
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Discover Kids Range',
      to: '/boy',
    },
  },
  electronics: {
    title: 'Electronics, Audio & Smart Gadgets',
    departmentRoute: '/electronics',
    curatedCollections: [
      { name: 'Flagship Wireless Headphones', badge: 'Hot', to: '/electronics' },
      { name: 'Hi-Fi Audio & Earbuds', badge: null, to: '/electronics' },
      { name: 'Smart Watches & Fitness Bands', badge: 'New', to: '/electronics' },
      { name: 'Tech Accessories & Chargers', badge: null, to: '/electronics' },
      { name: 'All Electronics Catalog', badge: null, to: '/category/Electronics' },
      { name: 'Festive Tech Deals: Up to 40% Off', badge: 'Sale', to: '/electronics' },
    ],
    curatedStyles: [
      { name: 'Active Noise Cancellation', desc: 'Pure acoustic immersion on the move' },
      { name: 'Smart Home & Mobile Hub', desc: 'Sync seamlessly across your devices' },
    ],
    showcase: {
      tag: 'FLAGSHIP AUDIO',
      headline: 'High-Fidelity Studio Precision',
      subtext: 'Next-gen wireless freedom with deep bass and pristine clarity.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Browse Electronics',
      to: '/electronics',
    },
  },
};

export function MegaMenu({ activeKey, categories = [], onClose }) {
  if (!activeKey || !DEPARTMENT_CONFIG[activeKey]) return null;

  const config = DEPARTMENT_CONFIG[activeKey];

  // Map active department to DB parent categories
  let targetParent = 'Men';
  if (activeKey === 'women') targetParent = 'Women';
  if (activeKey === 'electronics') targetParent = 'Electronics';
  if (activeKey === 'kids') targetParent = ['Boy', 'Girl'];

  // Match live categories from database
  const liveCategories = categories.filter((c) => {
    if (Array.isArray(targetParent)) {
      return targetParent.includes(c.parentCategory);
    }
    return c.parentCategory === targetParent;
  });

  return (
    <div
      onMouseEnter={(e) => e.stopPropagation()}
      className="absolute top-full left-0 w-full bg-white border-b border-slate-200/90 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <PageContainer>
        <div className="py-7 grid grid-cols-12 gap-8">
          {/* Column 1: Official Catalog Categories (Live from database) */}
          <div className="col-span-3 space-y-4 border-r border-slate-100 pr-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Store Categories
              </h3>
            </div>

            <ul className="space-y-1.5">
              {liveCategories.length > 0 ? (
                liveCategories.map((cat) => (
                  <li key={cat._id || cat.name}>
                    <Link
                      to={`/category/${encodeURIComponent(cat.name)}`}
                      onClick={onClose}
                      className="group flex items-center justify-between text-xs font-medium text-slate-700 hover:text-blue-600 py-1 transition-colors"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        {cat.name}
                      </span>
                      {cat.productCount > 0 && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({cat.productCount})
                        </span>
                      )}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate-400 py-1">
                  Loading categories...
                </li>
              )}

              <li className="pt-2">
                <Link
                  to={config.departmentRoute}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mt-1"
                >
                  <span>View All in {config.title.split(' ')[0]}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Curated Collections & Edits */}
          <div className="col-span-3 space-y-4 border-r border-slate-100 pr-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Curated Collections
              </h3>
            </div>

            <ul className="space-y-2">
              {config.curatedCollections.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.to}
                    onClick={onClose}
                    className="group flex items-center justify-between text-xs font-medium text-slate-700 hover:text-indigo-600 py-0.5 transition-colors"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                          item.badge === 'Sale'
                            ? 'bg-rose-100 text-rose-700'
                            : item.badge === 'Hot' || item.badge === 'Trending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Style Guides & Editorial Highlights */}
          <div className="col-span-3 space-y-4 border-r border-slate-100 pr-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Style Guide &amp; Edits
              </h3>
            </div>

            <div className="space-y-3">
              {config.curatedStyles.map((style, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 transition-colors"
                >
                  <p className="text-xs font-bold text-slate-900">{style.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {style.desc}
                  </p>
                </div>
              ))}

              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 flex items-center gap-2.5">
                <Percent className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-[11px] text-amber-900 font-medium">
                  <strong>Free Express Delivery</strong> on all orders over ₹999
                </p>
              </div>
            </div>
          </div>

          {/* Column 4: Premium Showcase Banner Card */}
          <div className="col-span-3">
            <Link
              to={config.showcase.to}
              onClick={onClose}
              className="group block relative h-full min-h-[260px] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <img
                src={config.showcase.image}
                alt={config.showcase.headline}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-5 flex flex-col justify-end text-white">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white mb-2 self-start border border-white/30">
                  {config.showcase.tag}
                </span>
                <h4 className="text-sm font-bold text-white leading-snug group-hover:text-blue-300 transition-colors">
                  {config.showcase.headline}
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                  {config.showcase.subtext}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
                  <span>{config.showcase.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

export default MegaMenu;
