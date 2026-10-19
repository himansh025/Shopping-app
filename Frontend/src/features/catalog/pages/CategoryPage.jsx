/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Tag,
  Layers,
  ArrowUpDown,
  Search as SearchIcon,
} from 'lucide-react';
import axiosInstance from '../../../services/apiClient';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../../../components/ui/Skeleton';
import EmptyState from '../../../components/ui/EmptyState';

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-500', label: 'Under ₹500', min: 0, max: 500 },
  { id: '500-1000', label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { id: '1000-2500', label: '₹1,000 - ₹2,500', min: 1000, max: 2500 },
  { id: 'above-2500', label: 'Above ₹2,500', min: 2500, max: Infinity },
];

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest Arrivals' },
  { id: 'name-asc', label: 'Name: A to Z' },
];

/**
 * Reusable Modern Category / Catalog Page
 * - Unifies /men, /women, /electronics, /boy, /girl
 * - Real client-side filtering (price, brand, availability, keyword)
 * - Real client-side sorting (price, date, name)
 * - Skeleton loading & resilient EmptyState
 */
export function CategoryPage({
  category = '',
  title = 'Catalog',
  description = 'Browse our selection of quality products',
  badgeText = '',
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting state
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'featured');
  const [selectedPriceRange, setSelectedPriceRange] = useState(searchParams.get('price') || 'all');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('stock') === 'true');
  const [filterQuery, setFilterQuery] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch products for category
  useEffect(() => {
    let isMounted = true;
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = category ? { category } : {};
        const response = await axiosInstance.get('/products/all', { params });

        if (isMounted) {
          if (response.data && Array.isArray(response.data.products)) {
            setProducts(response.data.products);
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        console.error(`Failed to fetch ${category} products:`, err);
        if (isMounted) {
          setError('Unable to load products at this time. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategoryProducts();
    return () => {
      isMounted = false;
    };
  }, [category]);

  // Derive unique brands from genuine products
  const availableBrands = useMemo(() => {
    const brandsSet = new Set();
    products.forEach((p) => {
      if (p.brand && typeof p.brand === 'string' && p.brand.trim() !== '') {
        brandsSet.add(p.brand.trim());
      }
    });
    return Array.from(brandsSet).sort();
  }, [products]);

  // Apply filtering and sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by keyword query within category
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }

    // Filter by price range
    if (selectedPriceRange !== 'all') {
      const rangeConfig = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
      if (rangeConfig) {
        result = result.filter(
          (p) => p.price >= rangeConfig.min && p.price < rangeConfig.max
        );
      }
    }

    // Filter by Brand
    if (selectedBrand !== 'all') {
      result = result.filter(
        (p) => p.brand?.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // Filter by In-Stock
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Apply Sorting
    switch (selectedSort) {
      case 'price-low':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'name-asc':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        // 'featured' keeps original backend order
        break;
    }

    return result;
  }, [products, filterQuery, selectedPriceRange, selectedBrand, inStockOnly, selectedSort]);

  const hasActiveFilters =
    selectedPriceRange !== 'all' ||
    selectedBrand !== 'all' ||
    inStockOnly ||
    filterQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedPriceRange('all');
    setSelectedBrand('all');
    setInStockOnly(false);
    setFilterQuery('');
    setSelectedSort('featured');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Header Hero */}
        <header className="mb-8 p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            {badgeText && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 text-blue-300 border border-white/10 mb-3 backdrop-blur-xs">
                <Tag className="w-3 h-3" />
                {badgeText}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>
        </header>

        {/* Toolbar: Result Count, Filter Toggle (Mobile), Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters {hasActiveFilters && '• Active'}</span>
            </button>

            <span className="text-sm font-medium text-slate-600">
              {loading ? (
                'Loading items...'
              ) : (
                <>
                  Showing <strong className="text-slate-900">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Quick In-Category Keyword Filter */}
            <div className="relative hidden sm:block w-48 lg:w-60">
              <input
                type="text"
                placeholder="Filter in collection..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 text-xs bg-slate-100 focus:bg-white text-slate-900 rounded-xl border border-transparent focus:border-blue-600 focus:outline-none transition"
              />
              <SearchIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              <label htmlFor="sort-select" className="sr-only">
                Sort products
              </label>
              <select
                id="sort-select"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="h-9 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer transition"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-medium text-slate-500">Active filters:</span>
            {selectedPriceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-blue-50 text-blue-700 font-medium">
                {PRICE_RANGES.find((r) => r.id === selectedPriceRange)?.label}
                <button type="button" onClick={() => setSelectedPriceRange('all')}>
                  <X className="w-3.5 h-3.5 hover:text-blue-900" />
                </button>
              </span>
            )}
            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-blue-50 text-blue-700 font-medium">
                Brand: {selectedBrand}
                <button type="button" onClick={() => setSelectedBrand('all')}>
                  <X className="w-3.5 h-3.5 hover:text-blue-900" />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-50 text-emerald-700 font-medium">
                In Stock Only
                <button type="button" onClick={() => setInStockOnly(false)}>
                  <X className="w-3.5 h-3.5 hover:text-emerald-900" />
                </button>
              </span>
            )}
            {filterQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-700 font-medium">
                &ldquo;{filterQuery}&rdquo;
                <button type="button" onClick={() => setFilterQuery('')}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 ml-1 underline cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span>Filter Products</span>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Price Range
                </h4>
                <div className="space-y-1.5">
                  {PRICE_RANGES.map((range) => (
                    <label
                      key={range.id}
                      className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-1"
                    >
                      <input
                        type="radio"
                        name="price-filter"
                        checked={selectedPriceRange === range.id}
                        onChange={() => setSelectedPriceRange(range.id)}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In-Stock Toggle */}
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-semibold text-slate-700">In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </label>
              </div>

              {/* Brand Filter (if available) */}
              {availableBrands.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Brands ({availableBrands.length})
                  </h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    <label className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-0.5">
                      <input
                        type="radio"
                        name="brand-filter"
                        checked={selectedBrand === 'all'}
                        onChange={() => setSelectedBrand('all')}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <span>All Brands</span>
                    </label>
                    {availableBrands.map((b) => (
                      <label
                        key={b}
                        className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-0.5"
                      >
                        <input
                          type="radio"
                          name="brand-filter"
                          checked={selectedBrand.toLowerCase() === b.toLowerCase()}
                          onChange={() => setSelectedBrand(b)}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="truncate">{b}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Mobile Filter Drawer / Modal */}
          {mobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
              <div className="w-full max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Filters</h3>
                    <button
                      type="button"
                      onClick={() => setMobileFilterOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Price Range
                    </h4>
                    <div className="space-y-2">
                      {PRICE_RANGES.map((range) => (
                        <label key={range.id} className="flex items-center gap-2 text-sm text-slate-700">
                          <input
                            type="radio"
                            name="mobile-price"
                            checked={selectedPriceRange === range.id}
                            onChange={() => setSelectedPriceRange(range.id)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* In-Stock */}
                  <div className="pt-3 border-t border-slate-100">
                    <label className="flex items-center justify-between text-sm font-medium text-slate-800">
                      <span>In Stock Only</span>
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </label>
                  </div>

                  {/* Brands */}
                  {availableBrands.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Brands
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                          <input
                            type="radio"
                            name="mobile-brand"
                            checked={selectedBrand === 'all'}
                            onChange={() => setSelectedBrand('all')}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>All Brands</span>
                        </label>
                        {availableBrands.map((b) => (
                          <label key={b} className="flex items-center gap-2 text-sm text-slate-700">
                            <input
                              type="radio"
                              name="mobile-brand"
                              checked={selectedBrand.toLowerCase() === b.toLowerCase()}
                              onChange={() => setSelectedBrand(b)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span>{b}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-2">
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
                  >
                    View {filteredProducts.length} Results
                  </button>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="w-full py-2 rounded-xl text-slate-600 text-xs font-medium hover:bg-slate-100 transition"
                    >
                      Reset All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Product Grid / Empty State Column */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <EmptyState
                icon={<X className="w-6 h-6 text-rose-600" />}
                title="Failed to Load Products"
                description={error}
                action={
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                  >
                    Try Again
                  </button>
                }
              />
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                icon={<Layers className="w-6 h-6 text-slate-400" />}
                title={hasActiveFilters ? "No Products Match Your Filters" : `No ${title} Available`}
                description={
                  hasActiveFilters
                    ? "Try adjusting or clearing your filters to see more available products."
                    : `We currently don't have any items listed in ${title}. Check back soon!`
                }
                action={
                  hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                    >
                      Clear All Filters
                    </button>
                  ) : (
                    <Link
                      to="/"
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                    >
                      Explore Storefront
                    </Link>
                  )
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
