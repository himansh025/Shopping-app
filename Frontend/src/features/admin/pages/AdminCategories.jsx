import { useState, useEffect, useCallback } from 'react';
import {
  Tags,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  PlusCircle,
  RefreshCw,
  X,
  Upload,
} from 'lucide-react';
import axiosInstance from '../../../services/apiClient';
import { toast } from 'react-toastify';
import Spinner from '../../../components/ui/Spinner';

export function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // Modal for admin direct category creation
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentCategory, setParentCategory] = useState('Men');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/categories', {
        params: {
          approvalStatus: filter,
          search: search || undefined,
        },
      });
      if (res.data?.success) {
        setCategories(res.data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching admin categories:', err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleUpdateApproval = async (categoryId, approvalStatus) => {
    try {
      setActionLoading(`${categoryId}-${approvalStatus}`);
      const res = await axiosInstance.put(`/admin/categories/${categoryId}/approval`, {
        approvalStatus,
      });
      if (res.data?.success) {
        toast.success(`Category marked as ${approvalStatus}!`);
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update category approval');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category permanently?')) return;

    try {
      setActionLoading(`del-${categoryId}`);
      const res = await axiosInstance.delete(`/admin/categories/${categoryId}`);
      if (res.data?.success) {
        toast.success('Category deleted successfully');
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setActionLoading(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateCategorySubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('parentCategory', parentCategory);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await axiosInstance.post('/admin/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        toast.success('Category created and approved directly by Administrator!');
        setIsAddModalOpen(false);
        setName('');
        setDescription('');
        setImageFile(null);
        setImagePreview('');
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Tags className="w-6 h-6 text-indigo-600" />
            <span>Category Taxonomy Approvals</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Moderate categories proposed by sellers, or publish official catalog departments and navigation sections directly.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Category</span>
          </button>
          <button
            type="button"
            onClick={fetchCategories}
            className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto">
          {[
            { id: 'pending', label: 'Pending Approval' },
            { id: 'approved', label: 'Approved & Active' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'all', label: 'All Categories' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <Spinner size="lg" />
          <p className="text-xs text-slate-500 mt-2">Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
          <Tags className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No categories found</h3>
          <p className="text-xs text-slate-400 mt-1">
            No categories match the selected filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const isPending = cat.approvalStatus === 'pending';
            const isApproved = cat.approvalStatus === 'approved';
            const isRejected = cat.approvalStatus === 'rejected';

            return (
              <div
                key={cat._id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  {/* Category Image / Header */}
                  <div className="flex items-start gap-3.5 mb-3.5">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100 shrink-0">
                        <Tags className="w-6 h-6" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                          {cat.parentCategory}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPending
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {cat.approvalStatus || 'Approved'}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 truncate">{cat.name}</h3>
                      <p className="text-xs text-slate-400 font-mono truncate">/{cat.slug}</p>
                    </div>
                  </div>

                  {cat.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {cat.description}
                    </p>
                  )}

                  {/* Meta Details */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4 bg-slate-50/60 p-2 rounded-lg">
                    <span>
                      <strong className="text-slate-800 font-medium">Proposed by:</strong>{' '}
                      {cat.createdByRole === 'admin' ? 'Admin' : `Seller (${cat.createdByName || 'Seller'})`}
                    </span>
                    <span>
                      <strong className="text-slate-800 font-medium">{cat.productCount || 0}</strong> products
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  {isPending && (
                    <>
                      <button
                        type="button"
                        disabled={actionLoading === `${cat._id}-approved`}
                        onClick={() => handleUpdateApproval(cat._id, 'approved')}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve Category</span>
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === `${cat._id}-rejected`}
                        onClick={() => handleUpdateApproval(cat._id, 'rejected')}
                        className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {isApproved && (
                    <>
                      <button
                        type="button"
                        disabled={actionLoading === `${cat._id}-rejected`}
                        onClick={() => handleUpdateApproval(cat._id, 'rejected')}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Unpublish</span>
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === `del-${cat._id}`}
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {isRejected && (
                    <>
                      <button
                        type="button"
                        disabled={actionLoading === `${cat._id}-approved`}
                        onClick={() => handleUpdateApproval(cat._id, 'approved')}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Re-Approve</span>
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === `del-${cat._id}`}
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add Platform Category</h3>
                <p className="text-xs text-slate-500">Categories added by admin are automatically approved and live</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Designer Watches"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parent Department *</label>
                <select
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Men">Men&apos;s Department</option>
                  <option value="Women">Women&apos;s Department</option>
                  <option value="Boy">Boy&apos;s Department</option>
                  <option value="Girl">Girl&apos;s Department</option>
                  <option value="Electronics">Electronics &amp; Gadgets</option>
                  <option value="Other">Other / General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of items in this category..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Image (Optional)</label>
                <div className="border border-dashed border-slate-200 rounded-xl p-3 text-center hover:bg-slate-50 transition cursor-pointer relative">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-600 font-medium">Click to upload category hero photo</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-xl mt-2 border border-slate-200"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting && <Spinner size="sm" />}
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;
