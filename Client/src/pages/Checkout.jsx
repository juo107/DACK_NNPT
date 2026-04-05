import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Radio, 
  Divider, 
  message, 
  Breadcrumb,
  Card
} from 'antd';
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User 
} from 'lucide-react';
import useCart from '../hooks/useCart';
import { formatCurrency, getImageUrl } from '../utils/productHelpers';
import productApi from '../api/productApi';
import reservationApi from '../api/reservationApi';
import promotionApi from '../api/promotionApi';
import { Tag as AntTag } from 'antd'; // Tên khác để tránh xung đột nếu có
import { Scissors, X, Percent } from 'lucide-react';

/**
 * Page: Checkout
 * Giao diện thanh toán chuyên nghiệp
 */
const Checkout = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { items, total, subtotal, shipping, clearCart, isGuest } = useCart();
  const [loading, setLoading] = useState(false);
  
  // Promotion State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoLoading, setPromoLoading] = useState(false);

  // Redirect nếu giỏ hàng trống
  React.useEffect(() => {
    if (!loading && items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate, loading]);

  if (items.length === 0) {
    return null;
  }

  // Logic áp dụng mã giảm giá
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setPromoLoading(true);
    try {
      const response = await promotionApi.validate(promoCode);
      const promo = response.data?.promotion || response.promotion;

      // Kiểm tra giá trị đơn tối thiểu
      if (subtotal < promo.minOrderValue) {
        throw new Error(`Đơn hàng tối thiểu ${formatCurrency(promo.minOrderValue)} để sử dụng mã này.`);
      }

      setAppliedPromo(promo);
      let calculatedDiscount = 0;
      if (promo.discountType === 'percentage') {
        calculatedDiscount = Math.floor(subtotal * (promo.discountValue / 100));
        if (promo.maxDiscountValue > 0 && calculatedDiscount > promo.maxDiscountValue) {
          calculatedDiscount = promo.maxDiscountValue;
        }
      } else {
        calculatedDiscount = promo.discountValue;
      }

      setDiscountAmount(calculatedDiscount);
      message.success('Áp dụng mã giảm giá thành công!');
    } catch (error) {
      console.error('Promo error:', error);
      message.error(error.response?.data?.message || error.message || 'Mã không hợp lệ');
      setAppliedPromo(null);
      setDiscountAmount(0);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setDiscountAmount(0);
    setPromoCode('');
    message.info('Đã gỡ mã giảm giá');
  };

  // Xử lý xác nhận đặt hàng
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 1. Chuẩn bị dữ liệu cho API Reservation
      const reservationData = {
        items: items.map(item => ({
          product: item.product?._id || item.product,
          quantity: item.quantity
        })),
        shippingInfo: values,
        promotionId: appliedPromo?._id // Gửi ID khuyến mãi lên server
      };

      // 2. Gọi API đặt hàng
      await reservationApi.create(reservationData);
      
      // 3. Thành công -> Clear giỏ hàng & Chuyển trang
      message.success('Đặt hàng thành công! Đang chuyển đến đơn hàng của bạn.');
      await clearCart();
      
      setTimeout(() => {
        navigate('/my-orders');
      }, 2000);
    } catch (error) {
      console.error('Checkout failed:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation / Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Quay lại giỏ hàng
          </Link>
          <Breadcrumb 
            items={[
              { title: <Link to="/cart">Giỏ hàng</Link> },
              { title: 'Thanh toán' }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cột trái: Thông tin giao hàng */}
          <div className="lg:col-span-7">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <Truck className="text-primary w-6 h-6" />
                Thông tin giao hàng
              </h2>
              
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
                initialValues={{ paymentMethod: 'cod' }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <Form.Item
                    name="fullName"
                    label={<span className="font-bold text-slate-600">Họ và tên</span>}
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                  >
                    <Input prefix={<User className="w-4 h-4 text-slate-400" />} placeholder="Nguyễn Văn A" className="h-12 rounded-xl" />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label={<span className="font-bold text-slate-600">Số điện thoại</span>}
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                  >
                    <Input prefix={<Phone className="w-4 h-4 text-slate-400" />} placeholder="090xxx" className="h-12 rounded-xl" />
                  </Form.Item>
                </div>

                <Form.Item
                  name="address"
                  label={<span className="font-bold text-slate-600">Địa chỉ cụ thể</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng' }]}
                >
                  <Input prefix={<MapPin className="w-4 h-4 text-slate-400" />} placeholder="Số nhà, tên đường, phường/xã..." className="h-12 rounded-xl" />
                </Form.Item>

                <Form.Item
                  name="note"
                  label={<span className="font-bold text-slate-600">Ghi chú (Tùy chọn)</span>}
                >
                  <Input.TextArea placeholder="Lời nhắn cho shipper..." rows={3} className="rounded-xl" />
                </Form.Item>

                <Divider className="my-10" />

                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <CreditCard className="text-primary w-6 h-6" />
                  Phương thức thanh toán
                </h2>

                <Form.Item name="paymentMethod">
                  <Radio.Group className="w-full space-y-4">
                    <div className="flex flex-col gap-4">
                        <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${form.getFieldValue('paymentMethod') === 'cod' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}>
                            <Radio value="cod" />
                            <div>
                                <div className="font-black text-slate-900">Thanh toán khi nhận hàng (COD)</div>
                                <div className="text-xs text-slate-500 font-semibold">Trả tiền mặt khi shipper giao hàng tận nơi.</div>
                            </div>
                        </label>

                        <label className="flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-100 opacity-60 grayscale cursor-not-allowed">
                            <Radio value="momo" disabled />
                            <div>
                                <div className="font-black text-slate-900">Ví MoMo (Đang bảo trì)</div>
                                <div className="text-xs text-slate-500 font-semibold">Thanh toán nhanh chóng qua mã QR.</div>
                            </div>
                        </label>
                    </div>
                  </Radio.Group>
                </Form.Item>
              </Form>
            </div>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="lg:col-span-5">
            <div className="sticky top-10 space-y-6">
              <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl shadow-slate-900/20">
                <h3 className="text-2xl font-black mb-8 italic tracking-tighter">ORDER SUMMARY</h3>
                
                {/* List items rút gọn */}
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-xl bg-white/10 overflow-hidden border border-white/10">
                        <img 
                          src={getImageUrl(item.product)} 
                          alt={item.product?.title} 
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-0 right-0 h-5 w-5 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-bl-lg">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-100 truncate">{item.product?.title}</div>
                        <div className="text-xs text-slate-400 font-bold tracking-widest">{formatCurrency(item.product?.price)}</div>
                      </div>
                      <div className="text-sm font-black text-white">
                        {formatCurrency((item.product?.price || 0) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <Divider className="border-white/10 my-8" />
                
                <div className="space-y-4">
                  <div className="flex justify-between text-slate-400 font-bold">
                    <span>Tạm tính</span>
                    <span className="text-white">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-bold">
                    <span>Phí vận chuyển</span>
                    <span className="text-white">{shipping === 0 ? 'Miễn phí' : formatCurrency(shipping)}</span>
                  </div>

                  {/* Input Promo Code */}
                  <div className="pt-4">
                    {!appliedPromo ? (
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Mã giảm giá (VD: WELCOME10)" 
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 h-10 rounded-xl"
                        />
                        <Button 
                          onClick={handleApplyPromo}
                          loading={promoLoading}
                          className="!bg-primary !border-none !text-white font-bold h-10 rounded-xl px-4"
                        >
                          ÁP DỤNG
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-white/5 border border-dashed border-white/20 rounded-xl">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-primary/20 rounded-lg text-primary">
                            <Scissors className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-primary uppercase tracking-widest">{appliedPromo.code}</div>
                            <div className="text-[10px] text-slate-400">Đã áp dụng giảm giá</div>
                          </div>
                        </div>
                        <Button 
                          type="text" 
                          icon={<X className="w-4 h-4 text-slate-500 hover:text-white" />} 
                          onClick={handleRemovePromo}
                        />
                      </div>
                    )}
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-primary font-bold animate-pulse">
                      <span className="flex items-center gap-1"><Percent className="w-4 h-4" /> Khuyến mãi</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="h-px bg-white/10 my-6"></div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Thanh toán tổng</div>
                      <div className="text-4xl font-black text-white tracking-tighter italic">
                        {formatCurrency(Math.max(0, total - discountAmount))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="primary"
                  block
                  size="large"
                  loading={loading}
                  onClick={() => form.submit()}
                  className="mt-10 !h-16 !rounded-2xl !bg-primary !border-none text-lg font-black text-white hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
                >
                  XÁC NHẬN ĐẶT HÀNG
                </Button>

                <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Bảo mật thông tin thanh toán 100%
                </div>
              </div>

              {/* Tips / Policy */}
              <Card className="rounded-[1.5rem] border-dashed border-2 border-slate-200 bg-slate-50 shadow-none">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-white p-3 rounded-xl shadow-sm h-fit">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Chính sách giao hàng</h4>
                    <p className="mt-1 text-slate-500 text-sm leading-relaxed">Đơn hàng được giao miễn phí cho người dùng đạt giá trị trên 1,000,000₫. Thời gian nhận hàng từ 2-4 ngày làm việc.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
