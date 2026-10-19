/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  X,
  ArrowUpDown,
  ShoppingBag,
} from 'lucide-react';
import { clearSearch } from '../../../store/slices/productsSlice';
import ProductCard from '../components/ProductCard';
import AllCategories from '../components/AllCategories';
import HeroSection from '../components/HeroSection';
import SignatureCarousel from '../components/SignatureCarousel';
import EditorialBanner from '../components/EditorialBanner';
import BrandStory from '../components/BrandStory';
import ImageCollage from '../components/ImageCollage';
import NewsletterSection from '../components/NewsletterSection';
import { ProductCardSkeleton } from '../../../components/ui/Skeleton';
import EmptyState from '../../../components/ui/EmptyState';

const HOMEPAGE_TABS = ['All Products', 'Men', 'Women', 'Electronics'];

export function HomePage({ data = [] }) {
  const dispatch = useDispatch();
  const { items, searchActive, status } = useSelector((state) => state.products);

  const [activeTab, setActiveTab] = useState('All Products');
  const [sortOption, setSortOption] = useState('featured');

  // Use items from Redux or data prop
  const sourceProducts = searchActive
    ? items
    : Array.isArray(items) && items.length > 0
    ? items
    : data;

  // Filter and sort products for homepage
  const displayedProducts = useMemo(() => {
    let list = Array.isArray(sourceProducts) ? [...sourceProducts] : [];

    // Filter by tab when not in search mode
    if (!searchActive && activeTab !== 'All Products') {
      list = list.filter((p) =>
        p.category?.toLowerCase().includes(activeTab.toLowerCase())
      );
    }

    // Sort products
    switch (sortOption) {
      case 'price-low':
        list.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high':
        list.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        // 'featured' maintains default ordering
        break;
    }

    return list;
  }, [sourceProducts, activeTab, sortOption, searchActive]);

  // Featured Products section shows strictly 8 products (2 rows of 4)
  const featuredProducts = useMemo(() => {
    return displayedProducts.slice(0, 8);
  }, [displayedProducts]);

  const handleClearSearch = () => {
    dispatch(clearSearch());
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('featured-showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-slate-50/50">
      {/* Search Results Mode */}
      {searchActive ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
                <Search className="w-4 h-4" />
                <span>Search Results</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Matching Products
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Found {displayedProducts.length} {displayedProducts.length === 1 ? 'item' : 'items'} matching your query
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort selector */}
              <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* Clear Search Action */}
              <button
                type="button"
                onClick={handleClearSearch}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Exit Search</span>
              </button>
            </div>
          </div>

          {displayedProducts.length === 0 ? (
            <EmptyState
              icon={<Search className="w-6 h-6 text-slate-400" />}
              title="No Products Found"
              description="We couldn't find any products matching your search term. Try checking for typos or searching by a broader category."
              action={
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                >
                  Clear Search & View All
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Normal Storefront Mode */
        <>
          {/* Modern Magazine-Style Editorial Hero Section */}
          <HeroSection onExploreClick={scrollToCatalog} />

          {/* Category Discovery Section */}
          <AllCategories />

          {/* Signature Carousel Section (from fashion-studio) */}
          <SignatureCarousel
            products={sourceProducts}
            title="Signature Pieces"
            subtitle="Curated Selection"
          />

          {/* Editorial Campaign Banner (from fashion-studio) */}
          <EditorialBanner />

          {/* Curated Products Showcase */}
          <section id="featured-showcase" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5 block">
                  Product Discovery
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Featured Products
                </h2>
              </div>

              {/* Category Quick Filter Tabs & Sort */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex p-1 bg-slate-200/70 rounded-xl">
                  {HOMEPAGE_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        activeTab === tab
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-xl px-2.5 py-1.5 shadow-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-transparent border-none text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Cards Grid or Skeletons (Strictly 8 products, 4 per row) */}
            {status === 'loading' && (!sourceProducts || sourceProducts.length === 0) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : featuredProducts.length === 0 ? (
              <EmptyState
                icon={<ShoppingBag className="w-6 h-6 text-slate-400" />}
                title={`No ${activeTab} Found`}
                description="There are currently no products available in this department. Switch tabs or check back soon."
                action={
                  <button
                    type="button"
                    onClick={() => setActiveTab('All Products')}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                  >
                    View All Products
                  </button>
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product._id || product.id} product={product} />
                  ))}
                </div>

                {displayedProducts.length > 8 && (
                  <div className="mt-12 text-center">
                    <Link
                      to={
                        activeTab === 'Men'
                          ? '/men'
                          : activeTab === 'Women'
                          ? '/women'
                          : activeTab === 'Electronics'
                          ? '/electronics'
                          : '/men'
                      }
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 shadow-xs group"
                    >
                      <span>Explore All {activeTab !== 'All Products' ? activeTab : 'Products'} ({displayedProducts.length})</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Brand Story & Atelier Philosophy (from fashion-studio) */}
          <BrandStory />

          {/* Editorial Lookbook / Image Collage (from fashion-studio) */}
          <ImageCollage />

          {/* Atelier Newsletter Section (from fashion-studio) */}
          <NewsletterSection />
        </>
      )}
    </div>
  );
}

export default HomePage;
