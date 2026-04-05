import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import PromotionManagement from './pages/admin/PromotionManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import './App.css';

import MyOrders from './pages/MyOrders';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Wishlist from './pages/Wishlist';
import ChatButton from './components/home/ChatButton';

import AdminLayout from './layouts/AdminLayout';

// Placeholder components cho Admin
const Dashboard = () => <h2>Tổng quan hệ thống</h2>;

function App() {
  return (
    <Router>
      <WishlistProvider>
        <CartProvider>
          <div className="app min-h-screen flex flex-col">
            <Routes>
              {/* Client Routes: Có Header và Footer */}
              <Route
                path="/*"
                element={
                  <>
                    <Header />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/my-orders" element={<MyOrders />} />
                      </Routes>
                    </main>
                    <Footer />
                  </>
                }
              />

              {/* Admin Routes: Sử dụng AdminLayout riêng */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="promotions" element={<PromotionManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="inventories" element={<InventoryManagement />} />
              </Route>
            </Routes>
            <ChatButton />
          </div>
        </CartProvider>
      </WishlistProvider>
    </Router>
  );
}

export default App;
