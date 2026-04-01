import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductManagement from './pages/admin/ProductManagement';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main style={{ padding: '2rem 0', minHeight: '80vh' }}>
          <div className="container">
            <Routes>
              {/* Trang chủ */}
              <Route path="/" element={<Home />} />
              
              {/* Trang quản lý Admin */}
              <Route path="/admin/products" element={<ProductManagement />} />
              
              {/* Bổ sung các route khác ở đây */}
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
