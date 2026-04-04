import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Empty, Skeleton, Tag, Alert, message } from 'antd';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, CreditCard, ShieldCheck } from 'lucide-react';
import useCart from '../hooks/useCart';
import { formatCurrency, getImageUrl } from '../utils/productHelpers';

/**
 * Component: Cart Page
 * UI Layer (Presentation) - Chỉ hiển thị dữ liệu từ Custom Hook
 * Tuân thủ quy tắc tách biệt Logic hoàn toàn.
 */
const Cart = () => {
    const navigate = useNavigate();
    const {
        items,
        loading,
        subtotal,
        shipping,
        total,
        updateQuantity,
        removeItem,
        isGuest
    } = useCart();

    const handleCheckout = () => {
        if (isGuest) {
            message.warning('Vui lòng đăng nhập để tiến hành thanh toán');
            // Mở AuthModal - logic này có thể trigger qua Global State hoặc sự kiện
            window.dispatchEvent(new Event('openAuthModal'));
            return;
        }
        
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 py-16">
                <div className="container mx-auto px-4 md:px-8">
                    <Skeleton active paragraph={{ rows: 12 }} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* -- Header Section -- */}
                <div className="mb-10">
                    <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại cửa hàng
                    </Link>
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 lg:text-5xl">Giỏ hàng của bạn</h1>
                        <div className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-sm border border-slate-100">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-xs">Phân loại phẩm</p>
                            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-black">{items.length}</div>
                        </div>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="rounded-[2.5rem] bg-white p-20 shadow-sm border border-slate-100 text-center flex flex-col items-center">
                        <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Giỏ hàng đang trống</h3>
                        <p className="mt-2 text-slate-500 max-w-sm">Có vẻ như bạn chưa chọn được món đồ nào ưng ý. Hãy tiếp tục khám phá các sản phẩm tuyệt vời của chúng tôi nhé!</p>
                        <Link to="/products">
                            <Button type="primary" size="large" className="mt-8 !h-14 !px-10 !rounded-2xl !bg-slate-900 hover:!bg-primary transition-all font-black text-lg">
                                QUAY LẠI MUA SẮM
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
                        
                        {/* -- Left Section: Items List -- */}
                        <div className="space-y-6">
                            {isGuest && (
                                <Alert 
                                    message="Đăng nhập để nhận thêm ưu đãi" 
                                    description="Giỏ hàng hiện tại đang được lưu tạm thời. Hãy đăng nhập để lưu trữ vĩnh viễn và tích điểm thành viên." 
                                    type="warning" showIcon 
                                    className="!rounded-2xl !mb-6"
                                />
                            )}
                            
                            {items.map((item) => (
                                <div key={item._id || (item.product?._id || item.product)} className="group flex flex-col md:flex-row items-center gap-6 rounded-[2rem] bg-white p-6 shadow-sm border border-slate-50 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                                    <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                                        <img
                                            src={getImageUrl(item.product)}
                                            alt={item.product?.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => { e.currentTarget.src = '/assets/cat-sneakers.png'; }}
                                        />
                                    </div>
                                    
                                    <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-6 w-full text-center sm:text-left">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{item.product?.title}</h3>
                                            <p className="mt-1 text-slate-400 text-sm font-semibold uppercase tracking-widest tracking-tighter">
                                                {formatCurrency(item.product?.price)} / sản phẩm
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-center sm:items-end gap-3">
                                            <div className="inline-flex items-center overflow-hidden rounded-xl border-2 border-slate-100 bg-slate-50">
                                                <button 
                                                    onClick={() => updateQuantity(item.product?._id || item.product, -1)}
                                                    className="flex h-10 w-10 items-center justify-center hover:bg-white transition-colors"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <div className="flex h-10 min-w-10 items-center justify-center px-2 font-black text-slate-800">{item.quantity}</div>
                                                <button 
                                                    onClick={() => updateQuantity(item.product?._id || item.product, 1)}
                                                    className="flex h-10 w-10 items-center justify-center hover:bg-white transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                            
                                            <div className="text-xl font-black text-slate-900 tracking-tighter">
                                                {formatCurrency((item.product?.price || 0) * item.quantity)}
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => removeItem(item.product?._id || item.product)}
                                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* -- Right Section: Order Summary -- */}
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-28 space-y-6">
                                <div className="rounded-[2.5rem] bg-white p-8 lg:p-10 shadow-sm border border-slate-100 text-center sm:text-left">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tóm tắt đơn hàng</h2>
                                    
                                    <div className="mt-10 space-y-5">
                                        <div className="flex justify-between items-center text-slate-500 font-bold">
                                            <span>Tạm tính ({items.length} sp)</span>
                                            <span className="text-slate-900">{formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-500 font-bold">
                                            <span>Phí vận chuyển</span>
                                            {shipping === 0 ? (
                                                <Tag color="green" className="m-0 border-none bg-green-50 text-green-600 font-black uppercase text-[10px] px-3 py-1 rounded-full">Miễn phí</Tag>
                                            ) : (
                                                <span className="text-slate-900">{formatCurrency(shipping)}</span>
                                            )}
                                        </div>
                                        
                                        <div className="h-px bg-slate-50 my-6"></div>
                                        
                                        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4">
                                            <div className="w-full sm:w-auto">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tổng cộng</div>
                                                <div className="text-4xl font-black text-slate-900 tracking-tighter">
                                                    {formatCurrency(total)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="primary"
                                        block
                                        onClick={handleCheckout}
                                        className="mt-10 !h-16 !rounded-2xl !bg-slate-900 hover:!bg-primary !border-none text-lg font-black shadow-xl shadow-slate-900/20"
                                        icon={<CreditCard className="h-5 w-5" />}
                                    >
                                        THANH TOÁN NGAY
                                    </Button>
                                    
                                    <div className="mt-8 flex flex-col items-center gap-4 text-center">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                            <ShieldCheck className="h-4 w-4 text-primary" />
                                            Giao dịch an toàn & Bảo mật
                                        </div>
                                        <div className="flex items-center gap-4 opacity-30 grayscale saturate-0">
                                            <img src="/assets/payment-visa.png" className="h-5" alt="visa" />
                                            <img src="/assets/payment-master.png" className="h-5" alt="master" />
                                            <img src="/assets/payment-momo.png" className="h-5" alt="momo" />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[2rem] bg-slate-900 p-8 text-white">
                                    <h4 className="text-lg font-black text-white">Thông tin hỗ trợ</h4>
                                    <p className="mt-2 text-slate-400 text-sm leading-relaxed">Đơn hàng được giao từ 2-4 ngày làm việc. Quý khách có thể đổi trả hàng miễn phí trong vòng 7 ngày nếu có lỗi từ nhà sản xuất.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
