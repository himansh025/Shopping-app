/* eslint-disable react/prop-types, no-unused-vars */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tags,
  Search,
  FolderTree,
  RefreshCw,
  Image as ImageIcon,
  ShieldAlert,
  Info,
  PackagePlus,
  Layers,
} from 'lucide-react';
import axiosInstance from '../../../services/apiClient';
import Spinner from '../../../components/ui/Spinner';

const PARENT_CATEGORIES = ['Men', 'Women', 'Boy', 'Girl', 'Electronics', 'Other'];

export function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParent, setSelectedParent] = useState('all');
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get('/category/all');
      if (res.data?.success && Array.isArray(res.data.categories)) {
        setCategories(res.data.categories);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Unable to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        (cat.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesParent =
        selectedParent === 'all' || cat.parentCategory === selectedParent;

      return matchesSearch && matchesParent;
    });
  }, [categories, searchQuery, selectedParent]);

  const parentStats = useMemo(() => {
    const stats = { all: categories.length };
    PARENT_CATEGORIES.forEach((p) => {
      stats[p] = categories.filter((c) => c.parentCategory === p).length;
    });
    return stats;
  }, [categories]);

  const getParentBadgeClass = (parent) => {
    switch (parent) {
      case 'Men':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Women':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Boy':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Girl':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'Electronics':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Tags className="w-4 h-4" />
            <span>Catalog Directory</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Store Categories
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse official platform categories to link your products accurately for customer discovery.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchCategories}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Admin Curated Policy Notice Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs">
          <p className="font-bold text-indigo-950">
            Admin Curated Platform Taxonomy
          </p>
          <p className="text-indigo-800/80 leading-relaxed">
            Categories are officially maintained and managed by platform administrators to ensure storefront quality and consistent search taxonomy. Sellers can link products to any available category when listing or updating items.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">All Categories</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{categories.length}</p>
        </div>
        {PARENT_CATEGORIES.slice(0, 5).map((parent) => (
          <div
            key={parent}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs"
          >
            <p className="text-xs text-slate-500 font-medium">{parent}</p>
            <p className="text-xl font-bold text-indigo-600 mt-1">
              {parentStats[parent] || 0}
            </p>
          </div>
        ))}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Parent Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setSelectedParent('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedParent === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All ({parentStats.all})
          </button>
          {PARENT_CATEGORIES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedParent(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedParent === p
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {p} ({parentStats[p] || 0})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Categories Cards Grid */}
      {loading ? (
        <div className="py-16 text-center flex flex-col items-center justify-center">
          <Spinner size="lg" className="border-indigo-600 border-t-transparent mb-3" />
          <p className="text-sm font-medium text-slate-500">Loading catalog categories...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 p-8">
          <FolderTree className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Categories Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'No categories matched your search term.'
              : 'No categories available in this department.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat._id}
              className="group p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Department badge & status */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getParentBadgeClass(
                      cat.parentCategory
                    )}`}
                  >
                    {cat.parentCategory}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {cat.productCount || 0} product{(cat.productCount || 0) === 1 ? '' : 's'}
                  </span>
                </div>

                {/* Thumbnail & Title */}
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                      /{cat.slug}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {cat.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
              </div>

              {/* Linking helper footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  Official Storefront Tag
                </span>
                <span className="text-xs font-semibold text-indigo-600 group-hover:underline">
                  Select in Add Product →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageCategories;
