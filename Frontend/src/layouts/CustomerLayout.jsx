import { Outlet } from 'react-router-dom';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';
import Chatbot from '../features/chatbot';

/**
 * Dedicated Customer / Storefront Layout
 */
export function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      {/* Sticky Single-Source-of-Truth Customer Header */}
      <CustomerHeader />

      {/* Main Storefront Content Region */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Shared Storefront Footer */}
      <CustomerFooter />

      {/* Floating AI Assistant */}
      <Chatbot />
    </div>
  );
}

export default CustomerLayout;
