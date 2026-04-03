import React from 'react';
import { Star, Quote, Heart } from 'lucide-react';
import { Avatar } from 'antd';

const reviews = [
  { id: 1, name: 'Nguyễn Văn A', role: 'Khách hàng thân thiết', text: 'Chất liệu vải thực sự vượt mong đợi. Đường may tinh tế, form dáng hiện đại. Chắc chắn sẽ quay lại ủng hộ shop nhiều hơn.', rating: 5, avatar: '/u1.png' },
  { id: 2, name: 'Trần Thị B', role: 'Nhà thiết kế tự do', text: 'Minimalist mindset được thể hiện rõ nét qua các sản phẩm của NN Store. Đơn giản nhưng không hề đơn điệu, cực kỳ dễ phối đồ.', rating: 5, avatar: '/u2.png' },
  { id: 3, name: 'Lê Hoàng C', role: 'Nhiếp ảnh gia', text: 'Dịch vụ chăm sóc khách hàng cực kỳ nhiệt tình. Quá trình giao hàng nhanh chóng, đóng gói cẩn thận. Rất hài lòng.', rating: 4, avatar: '/u3.png' },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-4">CẢM NHẬN KHÁCH HÀNG</h2>
          <p className="text-gray-500 text-lg max-w-2xl">Hơn 10,000 khách hàng đã tin tưởng và đồng hành cùng chúng tôi trên hành trình định hình phong cách.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="p-10 bg-gray-50 rounded-[2rem] border border-gray-100 hover:shadow-2xl hover:bg-white transition-all duration-500 group">
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-accent fill-current' : 'text-gray-200'}`} />
                ))}
              </div>
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 w-12 h-12 text-primary/10 group-hover:scale-125 transition-transform" />
                <p className="text-lg text-gray-600 mb-8 leading-relaxed relative z-10 font-medium italic">"{review.text}"</p>
              </div>
              <div className="flex items-center gap-4">
                <Avatar size={56} src={review.avatar} className="border-2 border-primary/20 p-0.5" />
                <div>
                  <div className="font-black text-gray-900 text-lg">{review.name}</div>
                  <div className="text-sm font-bold text-primary/60 uppercase tracking-widest">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
