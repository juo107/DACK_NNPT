import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Alert, Button, Empty, Skeleton, Tag, message } from 'antd';
import { ArrowLeft, Heart, ShoppingBag, Star, CreditCard } from 'lucide-react';
import useProductDetail from '../hooks/useProductDetail';
import useCart from '../hooks/useCart';
import useWishlist from '../hooks/useWishlist';
import { formatCurrency, getImageUrl } from '../utils/productHelpers';
import reservationApi from '../api/reservationApi';

/**
 * Component: ProductDetail
 * UI Layer (Presentation)
 * Sử dụng phối hợp useProductDetail (cho dữ liệu sp) và useCart (cho hành động giỏ hàng)
 */
const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [buying, setBuying] = useState(false);
    const [adding, setAdding] = useState(false);
    const [wishBusy, setWishBusy] = useState(false);

    // -- Hooks --
    const {
        product,
        loading,
        error,
        imageUrl,
        stock,
        sizeOptions,
        colorOptions,
        selectedSize,
        setSelectedSize,
        selectedColor,
        setSelectedColor,
        quantity,
        increaseQty,
        decreaseQty,
        relatedProducts
    } = useProductDetail(id);

    const { addItem, isGuest } = useCart();
    const { isInWishlist, toggleWishlist, isGuest: wishGuest } = useWishlist();

    const inWishlist = product?._id ? isInWishlist(product._id) : false;

    // -- Handlers --
    const handleAddToCart = async () => {
        if (!product?._id) return;
        setAdding(true);
        await addItem(product, quantity);
        setAdding(false);
    };

    const handleWishlist = async () => {
        if (!product?._id) return;
        if (wishGuest) {
            message.warning('Vui lòng đăng nhập để lưu yêu thích');
            window.dispatchEvent(new Event('openAuthModal'));
            return;
        }
        setWishBusy(true);
        try {
            await toggleWishlist(product._id);
        } finally {
            setWishBusy(false);
        }
    };

    const handleBuyNow = async () => {
        if (!product?._id) return;

        // Nếu chưa đăng nhập -> Thêm vào giỏ khách và báo đăng nhập
        if (isGuest) {
            await addItem(product, quantity);
            message.warning('Vui lòng đăng nhập để tiến hành thanh toán');
            window.dispatchEvent(new Event('openAuthModal'));
            return;
        }

        // Nếu đã đăng nhập -> Chạy luồng Reservation trực tiếp
        try {
            setBuying(true);
            await reservationApi.create({ product: product._id, quantity });
            message.success('Đặt mua thành công!');
            setTimeout(() => navigate('/my-orders'), 1500);
        } catch (err) {
            message.error(err?.response?.data?.message || 'Mua hàng thất bại');
        } finally {
            setBuying(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
                <Skeleton active paragraph={{ rows: 8 }} />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
                <Alert message={error} type="warning" showIcon />
                <div className="mt-6 font-bold">
                    <Link to="/products" className="text-primary hover:underline">Quay lại trang sản phẩm</Link>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-slate-50 py-8 lg:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-all">
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại danh sách
                </Link>

                <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* -- Left Section -- */}
                    <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-4 shadow-sm">
                        <img
                            src={imageUrl}
                            alt={product.title}
                            className="h-[450px] w-full rounded-[2rem] object-cover lg:h-[600px] hover:scale-105 transition-transform duration-700"
                            onError={(e) => { e.currentTarget.src = '/assets/cat-sneakers.png'; }}
                        />
                    </div>

                    {/* -- Right Section -- */}
                    <div className="flex flex-col rounded-[2.5rem] border border-slate-100 bg-white p-8 lg:p-10 shadow-sm">
                        <div className="flex flex-wrap items-center gap-2">
                            <Tag color="cyan" className="rounded-full px-3 py-1 font-bold border-none bg-cyan-50 text-cyan-600 uppercase text-[10px] tracking-wider">
                                {product.category?.name || 'NEW ARRIVAL'}
                            </Tag>
                        </div>

                        <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 lg:text-5xl leading-tight">
                            {product.title}
                        </h1>

                        <div className="mt-4 flex items-center gap-4">
                            <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-black text-amber-600">
                                <Star className="h-4 w-4 fill-current" />
                                {Number(product.rating || 5).toFixed(1)}
                            </div>
                            <span className="text-sm font-bold text-slate-300">|</span>
                            <span className="text-sm font-semibold text-slate-400">Đã bán 1.2k+</span>
                        </div>

                        <div className="mt-8 border-y border-slate-50 py-8">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Giá bán hôm nay</div>
                            <div className="mt-2 text-5xl font-black text-slate-900 tracking-tighter">
                                {formatCurrency(product.price)}
                            </div>
                        </div>

                        <p className="mt-8 text-lg leading-relaxed text-slate-500 font-medium">
                            {product.description || 'Sản phẩm cao cấp NN STORE. Mang lại trải nghiệm tuyệt vời cho bạn mỗi ngày.'}
                        </p>

                        <div className="mt-10 space-y-8">
                            {sizeOptions.length > 0 && (
                                <div>
                                    <div className="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Kích cỡ</div>
                                    <div className="flex flex-wrap gap-3">
                                        {sizeOptions.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => setSelectedSize(size)}
                                                className={`h-12 min-w-14 rounded-2xl border-2 text-sm font-bold transition-all duration-300 ${
                                                    selectedSize === size
                                                        ? 'border-slate-900 bg-slate-900 text-white scale-105'
                                                        : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {colorOptions.length > 0 && (
                                <div>
                                    <div className="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Màu sắc</div>
                                    <div className="flex flex-wrap gap-3">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setSelectedColor(color)}
                                                className={`h-12 rounded-2xl border-2 px-6 text-sm font-bold transition-all duration-300 ${
                                                    selectedColor === color
                                                        ? 'border-primary bg-primary text-white scale-105 shadow-lg shadow-primary/20'
                                                        : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300'
                                                }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <div className="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">Số lượng & Tồn kho</div>
                                <div className="flex items-center gap-6">
                                    <div className="inline-flex items-center overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50">
                                        <button type="button" onClick={decreaseQty} className="flex h-12 w-12 items-center justify-center text-xl hover:bg-white transition-colors">-</button>
                                        <div className="flex h-12 min-w-14 items-center justify-center px-2 text-lg font-black text-slate-800">{quantity}</div>
                                        <button type="button" onClick={increaseQty} className="flex h-12 w-12 items-center justify-center text-xl hover:bg-white transition-colors">+</button>
                                    </div>
                                    <div className="text-slate-400 font-semibold italic">
                                        Hiện còn: <span className="text-slate-900 font-black not-italic ml-1">{stock}</span> sản phẩm
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* -- Buttons -- */}
                        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                            <Button
                                type="primary"
                                loading={buying}
                                onClick={handleBuyNow}
                                className="!h-16 flex-[1.5] !rounded-2xl !bg-orange-500 hover:!bg-orange-600 !border-none text-lg font-black shadow-xl shadow-orange-500/20"
                                icon={<CreditCard className="h-5 w-5" />}
                            >
                                MUA NGAY
                            </Button>
                            <Button
                                loading={adding}
                                onClick={handleAddToCart}
                                className="!h-16 flex-1 !rounded-2xl !bg-slate-900 hover:!bg-slate-800 text-white !border-none text-lg font-black shadow-xl shadow-slate-900/20"
                                icon={<ShoppingBag className="h-5 w-5" />}
                            >
                                GIỎ HÀNG
                            </Button>
                        </div>
                        
                        <div className="mt-6 flex justify-center">
                            <Button
                                type="text"
                                loading={wishBusy}
                                onClick={handleWishlist}
                                className={`h-10 font-bold transition-colors ${
                                    inWishlist
                                        ? '!text-rose-500'
                                        : 'text-slate-400 hover:text-rose-500'
                                }`}
                                icon={
                                    <Heart
                                        className={`h-4 w-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`}
                                    />
                                }
                            >
                                {inWishlist ? 'Đã lưu yêu thích' : 'Thêm vào yêu thích'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* -- Related -- */}
                <div className="mt-16">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-8">Sản phẩm tương tự</h2>
                    {relatedProducts.length === 0 ? (
                        <div className="mt-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-white p-16">
                            <Empty description={<span className="text-lg font-bold text-slate-400">Chưa có sản phẩm liên quan</span>} />
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((item) => (
                                <Link
                                    key={item._id}
                                    to={`/products/${item._id}`}
                                    className="group overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl"
                                >
                                    <div className="overflow-hidden rounded-2xl">
                                        <img
                                            src={getImageUrl(item)}
                                            alt={item.title}
                                            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => { e.currentTarget.src = '/assets/cat-sneakers.png'; }}
                                        />
                                    </div>
                                    <div className="mt-4 px-2 text-center sm:text-left">
                                        <h3 className="line-clamp-1 text-base font-black text-slate-900 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <div className="mt-2 text-xl font-black text-primary">{formatCurrency(item.price)}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;