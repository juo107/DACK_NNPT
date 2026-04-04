import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import wishlistApi from '../api/wishlistApi';

const WishlistContext = createContext();

function pid(item) {
  const p = item?.product;
  return p?._id != null ? String(p._id) : p != null ? String(p) : '';
}

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const syncUser = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) setUser(JSON.parse(savedUser));
      else setUser(null);
    };
    syncUser();
    window.addEventListener('storage', syncUser);
    window.addEventListener('userChanged', syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('userChanged', syncUser);
    };
  }, []);

  const fetchWishlist = useCallback(async () => {
    const currentUser = localStorage.getItem('user');
    if (!currentUser) {
      setItems([]);
      return;
    }
    try {
      setLoading(true);
      const data = await wishlistApi.getItems();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
    window.addEventListener('wishlistUpdated', fetchWishlist);
    return () => window.removeEventListener('wishlistUpdated', fetchWishlist);
  }, [fetchWishlist]);

  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) return false;
      const id = String(productId);
      return items.some((item) => pid(item) === id);
    },
    [items]
  );

  const addToWishlist = useCallback(async (productId) => {
    const currentUser = localStorage.getItem('user');
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để lưu yêu thích');
      window.dispatchEvent(new Event('openAuthModal'));
      return false;
    }
    try {
      const res = await wishlistApi.add({ product: productId });
      if (typeof res === 'string' && res.includes('wishlist')) {
        message.info('Sản phẩm đã có trong danh sách yêu thích');
      } else {
        message.success('Đã thêm vào yêu thích');
      }
      await fetchWishlist();
      window.dispatchEvent(new Event('wishlistUpdated'));
      return true;
    } catch {
      message.error('Không thể thêm vào yêu thích');
      return false;
    }
  }, [fetchWishlist]);

  const removeFromWishlist = useCallback(async (productId) => {
    const currentUser = localStorage.getItem('user');
    if (!currentUser) return false;
    try {
      await wishlistApi.remove({ product: productId });
      message.success('Đã xóa khỏi yêu thích');
      await fetchWishlist();
      window.dispatchEvent(new Event('wishlistUpdated'));
      return true;
    } catch {
      message.error('Xóa yêu thích thất bại');
      return false;
    }
  }, [fetchWishlist]);

  const toggleWishlist = useCallback(
    async (productId) => {
      if (isInWishlist(productId)) {
        return removeFromWishlist(productId);
      }
      return addToWishlist(productId);
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  );

  const value = {
    items,
    loading,
    isGuest: !user,
    fetchWishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlistContext = () => useContext(WishlistContext);
