import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { message } from 'antd';
import cartApi from '../api/cartApi';

const CartContext = createContext();
const LOCAL_CART_KEY = 'nn_guest_cart';

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    // 1. Sync user
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    // 2. Fetch Cart Logic
    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);
            const currentUser = JSON.parse(localStorage.getItem('user'));
            
            if (currentUser) {
                const response = await cartApi.getItems();
                const cartItems = response?.data || response || [];
                setItems(Array.isArray(cartItems) ? cartItems : []);
            } else {
                const guestCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
                setItems(guestCart);
            }
        } catch (error) {
            console.error('Fetch cart error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
        window.addEventListener('cartUpdated', fetchCart);
        return () => window.removeEventListener('cartUpdated', fetchCart);
    }, [fetchCart]);

    // 3. Cart Actions
    const addItem = async (productObj, quantity = 1) => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const productId = productObj._id || productObj;

            if (currentUser) {
                await cartApi.add({ product: productId, quantity });
            } else {
                let guestCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
                const existingIdx = guestCart.findIndex(i => (i.product?._id || i.product) === productId);
                if (existingIdx > -1) {
                    guestCart[existingIdx].quantity += quantity;
                } else {
                    guestCart.push({ product: productObj, quantity: quantity });
                }
                localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(guestCart));
            }
            fetchCart(); // Cập nhật lại state global
            message.success('Đã thêm sản phẩm vào giỏ hàng');
        } catch (error) {
            message.error('Thêm vào giỏ thất bại');
        }
    };

    const updateQuantity = async (productId, delta) => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            if (currentUser) {
                if (delta > 0) await cartApi.add({ product: productId, quantity: Math.abs(delta) });
                else await cartApi.remove({ product: productId, quantity: Math.abs(delta) });
            } else {
                let guestCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
                const idx = guestCart.findIndex(i => (i.product?._id || i.product) === productId);
                if (idx > -1) {
                    guestCart[idx].quantity += delta;
                    if (guestCart[idx].quantity <= 0) guestCart.splice(idx, 1);
                    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(guestCart));
                }
            }
            fetchCart();
        } catch (error) {
            message.error('Cập nhật số lượng thất bại');
        }
    };

    const removeItem = async (productId) => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            if (currentUser) {
                const item = items.find(i => (i.product?._id || i.product) === productId);
                if (item) await cartApi.remove({ product: productId, quantity: item.quantity });
            } else {
                let guestCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
                const newCart = guestCart.filter(i => (i.product?._id || i.product) !== productId);
                localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(newCart));
            }
            fetchCart();
            message.success('Đã xóa sản phẩm khỏi giỏ');
        } catch (error) {
            message.error('Xóa thất bại');
        }
    };

    const clearCart = () => {
        localStorage.removeItem(LOCAL_CART_KEY);
        setItems([]);
    };

    const mergeGuestCart = async () => {
        const guestCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY));
        if (guestCart && guestCart.length > 0) {
            try {
                for (const item of guestCart) {
                    await cartApi.add({ product: item.product?._id || item.product, quantity: item.quantity });
                }
                localStorage.removeItem(LOCAL_CART_KEY);
                fetchCart();
            } catch (err) {
                console.error('Merge cart failed', err);
            }
        }
    };

    // 4. Calculations
    const subtotal = useMemo(() => {
        return items.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);
    }, [items]);

    const shipping = (subtotal > 1000000 || subtotal === 0) ? 0 : 30000;
    const total = subtotal + shipping;

    const value = {
        items,
        loading,
        subtotal,
        shipping,
        total,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        mergeGuestCart,
        fetchCart,
        isGuest: !user
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => useContext(CartContext);
