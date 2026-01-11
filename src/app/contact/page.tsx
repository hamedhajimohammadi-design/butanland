import { Metadata } from 'next';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Mail, 
  Send, 
  MessageCircle, 
  Instagram, 
  Truck,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'تماس با ما | نمایندگی روبوتان (بوتان لند)',
  description: 'آدرس و تلفن نمایندگی رسمی روبوتان در مشهد، فروش و ارسال قطعات پکیج به سراسر ایران.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20 pt-28">
      
      {/* --- A. HERO SECTION --- */}
      <div className="bg-slate-900 text-white pt-12 pb-24 px-4 relative overflow-hidden mb-[-4rem]">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <span className="inline-block bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-lg shadow-orange-600/30">
            نمایندگی رسمی روبوتان
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            ارتباط با <span className="text-orange-500">بوتان‌لند</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            دفتر مرکزی و انبار ما در <strong>مشهد مقدس</strong> واقع شده است، اما خدمات و ارسال قطعات ما 
            <span className="text-white font-bold border-b border-orange-500 mx-1">بدون مرز</span> 
            و به سراسر ایران انجام می‌شود.
          </p>
        </div>
        
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[150px] opacity-10 -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600 rounded-full blur-[120px] opacity-10 -ml-20 -mb-20 pointer-events-none"></div>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* --- B. INFO CARDS (Left Side) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Address Card */}
            <div className="bg-white p-6 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:border-orange-200 transition">
              <div className="flex items-start gap-4 relative z-10">
                <div className="bg-blue-50 text-blue-600 p-3.5 rounded-2xl shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">دفتر مرکزی (مشهد)</h3>
                  <p className="text-sm text-gray-500 leading-7">
                    خراسان رضوی، مشهد،<br/>
                    [آدرس دقیق خیابان و پلاک شما در اینجا]<br/>
                    فروشگاه و نمایندگی روبوتان
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                    <Truck size={14} />
                    ارسال روزانه به سراسر کشور
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Phone Card */}
            <div className="bg-white p-6 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:border-orange-200 transition">
              <div className="flex items-start gap-4 relative z-10">
                <div className="bg-orange-50 text-orange-600 p-3.5 rounded-2xl shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                  <Phone size={24} />
                </div>
                <div className="w-full">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">تلفن‌های تماس</h3>
                  
                  <div className="space-y-3">
                    <a href="tel:05112345678" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-orange-50 group/link transition">
                      <span className="text-xs text-gray-500">دفتر مشهد:</span>
                      <span className="text-lg font-black text-gray-800 dir-ltr group-hover/link:text-orange-700">051-12345678</span>
                    </a>
                    
                    <a href="tel:09123456789" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-orange-50 group/link transition">
                      <span className="text-xs text-gray-500">مدیریت / واتساپ:</span>
                      <span className="text-lg font-black text-gray-800 dir-ltr group-hover/link:text-orange-700">0912-345-6789</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Hours & Social */}
            <div className="bg-white p-6 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:border-orange-200 transition">
              <div className="flex items-start gap-4 relative z-10 mb-6">
                <div className="bg-gray-100 text-gray-600 p-3.5 rounded-2xl shrink-0 group-hover:bg-gray-800 group-hover:text-white transition-colors duration-300">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">ساعات کاری</h3>
                  <p className="text-sm text-gray-500">شنبه تا چهارشنبه: ۸:۰۰ الی ۲۰:۰۰</p>
                  <p className="text-sm text-gray-500">پنجشنبه‌ها: ۸:۰۰ الی ۱۴:۰۰</p>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs text-gray-400 mb-3 text-center">ما را در شبکه‌های اجتماعی دنبال کنید</p>
                <div className="flex gap-3 justify-center">
                   <a href="#" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:opacity-90 transition shadow-lg shadow-purple-200">
                     <Instagram size={18} /> اینستاگرام
                   </a>
                   <a href="https://wa.me/989123456789" className="flex-1 bg-[#25D366] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:opacity-90 transition shadow-lg shadow-green-200">
                     <MessageCircle size={18} /> واتساپ
                   </a>
                </div>
              </div>
            </div>

          </div>

          {/* --- C. MAP & FORM (Right Side) --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Map Section */}
            <div className="bg-white p-2 rounded-3xl shadow-lg border border-gray-100 h-64 md:h-80 relative overflow-hidden group">
               {/* نکته: در اینجا باید iframe واقعی گوگل مپ مشهد خود را قرار دهید.
                  من مختصات تقریبی مشهد را گذاشته‌ام.
               */}
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207371.8276162391!2d59.45424788329618!3d36.29720235372379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f6c9101d23b7b9f%3A0x7d25e0160249856d!2sMashhad%2C%20Razavi%20Khorasan%20Province%2C%20Iran!5e0!3m2!1sen!2s!4v1705000000000!5m2!1sen!2s" 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0, borderRadius: '1.2rem' }} 
                 allowFullScreen 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
                 className="grayscale group-hover:grayscale-0 transition duration-700"
               ></iframe>
               
               <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold shadow-sm pointer-events-none">
                  📍 موقعیت ما در مشهد
               </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-1.5 h-8 bg-orange-600 rounded-full"></div>
                 <div>
                   <h2 className="text-2xl font-black text-gray-900">ارسال پیام مستقیم</h2>
                   <p className="text-sm text-gray-500 mt-1">پاسخگویی سریع برای همکاران و مشتریان گرامی</p>
                 </div>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700">نام و نام خانوادگی</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-orange-500 focus:bg-white transition"
                      placeholder="مثال: محمد احمدی"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700">شماره تماس</label>
                    <input 
                      type="tel" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-orange-500 focus:bg-white transition text-left dir-ltr"
                      placeholder="0912..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700">موضوع پیام</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-orange-500 focus:bg-white transition">
                    <option>مشاوره خرید قطعه</option>
                    <option>درخواست لیست قیمت همکاری (عمده)</option>
                    <option>پیگیری سفارش</option>
                    <option>پیشنهاد یا انتقاد</option>
                    <option>سایر موارد</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700">متن پیام شما</label>
                  <textarea 
                    rows={5} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-orange-500 focus:bg-white transition resize-none"
                    placeholder="پیام خود را بنویسید..."
                  ></textarea>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                  <button className="w-full md:w-auto bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg flex items-center justify-center gap-2">
                    <Send size={18} />
                    ارسال پیام
                  </button>
                  <p className="text-xs text-gray-400">
                    <ShieldCheck size={12} className="inline mr-1" />
                    اطلاعات شما نزد ما محفوظ است.
                  </p>
                </div>
              </form>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
