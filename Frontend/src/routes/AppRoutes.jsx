/* eslint-disable react/prop-types */
import { Routes, Route } from 'react-router-dom';
import { CustomerLayout, SellerLayout, AdminLayout, AuthLayout } from '../layouts';
import { HomePage, ProductDetail, Men, Women, Electronics, Boy, Girl } from '../features/catalog';
import CategoryPage from '../features/catalog/pages/CategoryPage';
import { CartPage, AddToCart } from '../features/cart';
import { Wishlist } from '../features/wishlist';
import { CheckoutPage, PlaceOrder } from '../features/checkout';
import { Orders } from '../features/orders';
import { Profile } from '../features/account';
import { Dashboard, SellerProfile, AddProducts, ManageCategories } from '../features/seller';
import { AdminDashboard, AdminSellers, AdminProducts, AdminCategories } from '../features/admin';
import { Login, Signup, Forget, VerifyOtp } from '../features/auth';

/**
 * Central Application Route Configuration
 */
export function AppRoutes({ user, data }) {
  return (
    <Routes>
      {/* Seller Workspace Shell */}
      {user?.role === "seller" ? (
        <Route element={<SellerLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/seller" element={<Dashboard />} />
          <Route path="/seller/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<SellerProfile />} />
          <Route path="/seller/profile" element={<SellerProfile />} />
          <Route path="/add" element={<AddProducts />} />
          <Route path="/seller/products/add" element={<AddProducts />} />
          <Route path="/categories" element={<ManageCategories />} />
          <Route path="/seller/categories" element={<ManageCategories />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/seller/orders" element={<Orders />} />
        </Route>
      ) : (
        /* Customer / Storefront Shell */
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage data={data} />} />

          {/* Department & Category Routes */}
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/electronics" element={<Electronics />} />
          <Route path="/boy" element={<Boy />} />
          <Route path="/girl" element={<Girl />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/categories/:category" element={<CategoryPage />} />

          {/* Professional E-Commerce Product URLs (SEO Slug + ID) */}
          <Route path="/product/:slug/:id" element={<ProductDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/products/:slug/:id" element={<ProductDetail />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          {/* Legacy fallback */}
          <Route path="/item-detail/:id" element={<ProductDetail />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/addToCart/:id" element={<AddToCart />} />
          <Route path="/placedOrder/:id" element={<PlaceOrder />} />

          {user?.role === "user" && (
            <>
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
            </>
          )}
        </Route>
      )}

      {/* Dedicated Admin Workspace Shell */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/sellers" element={<AdminSellers />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
      </Route>

      {/* Dedicated Authentication Shell */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/forgot-password" element={<Forget />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
