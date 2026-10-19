import { useState, useEffect, useCallback } from 'react';
import {
  PackageCheck,
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

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvalFilter, setApprovalFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // Modal for admin direct product creation
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    brand: 'MyShop',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/products', {
        params: {
          approvalStatus: approvalFilter,
          search: search || undefined,
        },
      });
      if (res.data?.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [approvalFilter, search]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/category/all?all=true');
      if (res.data?.categories) {
        setCategories(res.data.categories);
        if (!formData.category && res.data.categories.length > 0) {
          setFormData((prev) => ({ ...prev, category: res.data.categories[0].name }));
        }
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  }, [formData.category]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleUpdateApproval = async (productId, status) => {
    try {
      setActionLoading(`${productId}-${status}`);
      const res = await axiosInstance.put(`/admin/products/${productId}/approval`, {
        approvalStatus: status,
      });
      if (res.data?.success) {
        toast.success(`Product marked as ${status}!`);
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update approval status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product permanently?')) return;

    try {
      setActionLoading(`del-${productId}`);
      const res = await axiosInstance.delete(`/admin/products/${productId}`);
      if (res.data?.success) {
        toast.success('Product deleted successfully');
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setActionLoading(null);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.warning('Maximum 5 images allowed');
      return;
    }
    setSelectedFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const handleCreateProductSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category || !formData.stock || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error('Please select at least 1 product image');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('stock', formData.stock);
      data.append('brand', formData.brand || 'MyShop');

      selectedFiles.forEach((file) => {
        data.append('images', file);
      });

      const res = await axiosInstance.post('/admin/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        toast.success('Product created and auto-approved for storefront!');
        setIsAddModalOpen(false);
        setFormData({
          name: '',
          price: '',
          category: categories[0]?.name || '',
          description: '',
          stock: '',
          brand: 'MyShop',
        });
        setSelectedFiles([]);
        setFilePreviews([]);
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
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
            <PackageCheck className="w-6 h-6 text-indigo-600" />
            <span>Product Review & Approvals</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review seller submissions before they go live on the storefront, or publish official catalog products directly.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Admin Product</span>
          </button>
          <button
            type="button"
            onClick={fetchProducts}
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
            { id: 'pending', label: 'Pending Review' },
            { id: 'approved', label: 'Approved & Live' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'all', label: 'All Catalog' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setApprovalFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                approvalFilter === tab.id
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
            placeholder="Search by title, brand, seller..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <Spinner size="lg" />
          <p className="text-xs text-slate-500 mt-2">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
          <PackageCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No products found</h3>
          <p className="text-xs text-slate-400 mt-1">
            No items currently match the selected filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((prod) => {
            const isPending = prod.approvalStatus === 'pending';
            const isApproved = prod.approvalStatus === 'approved';
            const isRejected = prod.approvalStatus === 'rejected';

            return (
              <div
                key={prod._id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  {/* Top Image & Badge */}
                  <div className="relative mb-3.5">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'}
                      alt={prod.name}
                      className="w-full h-44 object-cover rounded-xl bg-slate-100 border border-slate-100"
                    />
                    <span
                      className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                        isApproved
                          ? 'bg-emerald-500 text-white'
                          : isPending
                          ? 'bg-amber-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {isApproved ? 'Approved & Live' : isPending ? 'Pending Review' : 'Rejected'}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="mb-2">
                    <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {prod.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2 leading-snug">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="text-base font-bold text-slate-900">
                      ₹{Number(prod.price).toLocaleString('en-IN')}
                    </span>
                    <span>Stock: {prod.stock} units</span>
                  </div>

                  {/* Seller / Origin info */}
                  <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600 mb-4 border border-slate-100">
                    <p className="truncate">
                      <span className="font-semibold text-slate-700">Origin:</span>{' '}
                      {prod.createdByRole === 'admin'
                        ? 'Published by Admin'
                        : `Seller: ${prod.seller?.name || 'Seller'}`}
                    </p>
                    {prod.seller?.email && (
                      <p className="text-[11px] text-slate-400 truncate">{prod.seller.email}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  {isPending && (
                    <>
                      <button
                        type="button"
                        disabled={actionLoading === `${prod._id}-approved`}
                        onClick={() => handleUpdateApproval(prod._id, 'approved')}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve Product</span>
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === `${prod._id}-rejected`}
                        onClick={() => handleUpdateApproval(prod._id, 'rejected')}
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
                        disabled={actionLoading === `${prod._id}-rejected`}
                        onClick={() => handleUpdateApproval(prod._id, 'rejected')}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Unpublish / Reject</span>
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === `del-${prod._id}`}
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {isRejected && (
                    <>
                      <button
                        type="button"
                        disabled={actionLoading === `${prod._id}-approved`}
                        onClick={() => handleUpdateApproval(prod._id, 'approved')}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Re-Approve to Store</span>
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === `del-${prod._id}`}
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete product"
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

      {/* Admin Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add Official Store Product</h3>
                <p className="text-xs text-slate-500">Products added by admin are automatically approved and published</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Nike Air Max Plus Running Shoes"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 2999"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="e.g. 50"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name} ({c.parentCategory})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. MyShop / Nike"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed product features, materials, and sizing specifications..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Images (up to 5) *</label>
                <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition cursor-pointer relative">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-600 font-medium">Click to upload product photos</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">JPEG, PNG, WEBP</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {filePreviews.length > 0 && (
                  <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1">
                    {filePreviews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt="Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                      />
                    ))}
                  </div>
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
                  <span>Publish to Store</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
