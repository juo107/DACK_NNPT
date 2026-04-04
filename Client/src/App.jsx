import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ProductManagement from './pages/admin/ProductManagement';
import './App.css';

import MyOrders from './pages/MyOrders';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Wishlist from './pages/Wishlist';

function App() {
  return (
    <Router>
      <WishlistProvider>
      <CartProvider>
        <div className="app">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Trang chủ */}
            <Route path="/" element={<Home />} />

            {/* Trang sản phẩm */}
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            
            {/* Giỏ hàng */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Đơn mua */}
            <Route path="/my-orders" element={<MyOrders />} />

            {/* Trang quản lý Admin */}
            <Route path="/admin/products" element={<ProductManagement />} />
            
            {/* Bổ sung các route khác ở đây */}
          </Routes>
        </main>
        <Footer />
        </div>
      </CartProvider>
      </WishlistProvider>
    </Router>
  );
}

export default App;
