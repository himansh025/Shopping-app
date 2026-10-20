import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Plus, Package, RefreshCw } from "lucide-react";
import AddProducts from "./AddProducts";
import EditProducts from "../components/EditProducts";
import ProductCard from "../components/SellerProductCard";
import axiosInstance from "../../../services/apiClient";
import Spinner from "../../../components/ui/Spinner";

export function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addproduct, setaddproduct] = useState(false);
  const [editproduct, seteditproduct] = useState(false);
  const [selectedProduct, setselectedProduct] = useState(null);

  const { items, searchActive } = useSelector((state) => state.products);
  const displayProducts = searchActive ? items : products;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/products/seller/all`, { params: {} });
      setProducts(response.data?.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchActive) fetchProducts();
  }, [searchActive]);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosInstance.delete(`/products/delete/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    document.body.style.overflow = addproduct || editproduct ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addproduct, editproduct]);

  const handleEdit = (productId) => {
    const prod = products.find((product) => product._id === productId);
    if (prod) {
      setselectedProduct(prod);
      seteditproduct(true);
    }
  };

  const handleAddProduct = () => {
    setaddproduct(true);
  };

  return (
    <div className="space-y-6">
      {/* Upload Product Modal */}
      {addproduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <AddProducts
              onClose={() => setaddproduct(false)}
              onSuccess={() => {
                setaddproduct(false);
                fetchProducts();
              }}
            />
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editproduct && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <EditProducts
              product={selectedProduct}
              onClose={() => seteditproduct(false)}
              onSuccess={() => {
                seteditproduct(false);
                fetchProducts();
              }}
            />
          </div>
        </div>
      )}

      {/* Dashboard Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Seller Catalog &amp; Inventory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {displayProducts.length} Item{displayProducts.length === 1 ? "" : "s"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish products to your catalog. New submissions are reviewed by platform admins before going live on the storefront.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchProducts}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh products list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Products Content */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center flex flex-col items-center justify-center">
          <Spinner size="lg" className="border-indigo-600 border-t-transparent mb-3" />
          <p className="text-sm font-medium text-slate-600">Loading catalog items...</p>
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Products Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchActive
                ? "No products matched your search query. Try clearing filters."
                : "You haven't listed any products yet. Click below to add your first item."}
            </p>
          </div>
          {!searchActive && (
            <button
              type="button"
              onClick={handleAddProduct}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Product</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <ul className="space-y-4">
            {displayProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
