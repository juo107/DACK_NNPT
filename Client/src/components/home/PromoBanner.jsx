import React from 'react';
import { Ticket, Copy, Zap } from 'lucide-react';
import { message } from 'antd';

const PromoBanner = () => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Đã sao chép mã giảm giá!');
  };

  return (
    <section className="bg-primary py-12 relative overflow-hidden group">
      {/* Decorative Sparkles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <Zap className="absolute top-4 left-10 text-white/10 w-24 h-24 rotate-12" />
        <Zap className="absolute bottom-4 right-10 text-white/10 w-24 h-24 -rotate-12" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-center lg:text-left">
            <div className="hidden sm:flex w-16 h-16 bg-white/20 rounded-2xl items-center justify-center backdrop-blur-md">
              <Ticket className="w-8 h-8 text-white rotate-12" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-1 uppercase">ƯU ĐÃI ĐẶC BIỆT</h2>
              <p className="text-white/80 font-medium">Nhập mã ngay để nhận ưu đãi lên đến 100k cho đơn hàng đầu tiên.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-2xl flex items-center justify-between gap-12 group/code hover:bg-white/20 transition-all cursor-pointer" onClick={() => copyToClipboard('NNSTORENEW')}>
              <div>
                <div className="text-[10px] font-bold text-white/60 tracking-widest uppercase mb-1">Mã khuyến mãi</div>
                <div className="text-2xl font-black text-white tracking-[0.2em]">NNSTORENEW</div>
              </div>
              <div className="p-2 bg-white rounded-lg text-primary shadow-lg transform group-hover/code:scale-110 transition-transform">
                <Copy className="w-6 h-6" />
              </div>
            </div>
            
            <div className="text-white font-black text-4xl hidden lg:block opacity-50 tracking-tighter">
              &
            </div>

            <div className="text-center sm:text-left">
              <div className="text-white/60 text-sm font-bold uppercase tracking-widest mb-1">Hết hạn sau</div>
              <div className="flex gap-2">
                <div className="bg-black/20 backdrop-blur-md px-3 py-2 rounded-xl text-white font-black text-xl">12h</div>
                <div className="bg-black/20 backdrop-blur-md px-3 py-2 rounded-xl text-white font-black text-xl">45m</div>
                <div className="bg-black/20 backdrop-blur-md px-3 py-2 rounded-xl text-white font-black text-xl">08s</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
