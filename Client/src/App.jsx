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

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
