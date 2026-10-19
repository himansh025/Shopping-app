/* eslint-disable react/prop-types */
import { Routes, Route } from 'react-router-dom';
import { CustomerLayout, SellerLayout, AuthLayout } from '../layouts';
import { HomePage, ProductDetail, Men, Women, Electronics } from '../features/catalog';
import { AddToCart } from '../features/cart';
import { Wishlist } from '../features/wishlist';
import { PlaceOrder } from '../features/checkout';
import { Orders } from '../features/orders';
import { Profile } from '../features/account';
import { Dashboard, SellerProfile, AddProducts } from '../features/seller';
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
          <Route path="/profile" element={<SellerProfile />} />
          <Route path="/add" element={<AddProducts />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      ) : (
        /* Customer / Storefront Shell */
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage data={data} />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/electronics" element={<Electronics />} />
          <Route path="/item-detail/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
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

      {/* Dedicated Authentication Shell */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
