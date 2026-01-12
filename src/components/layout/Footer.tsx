import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Linkedin, Twitter, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 rounded-t-[3rem] mt-auto">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: About */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-black flex items-center gap-1 mb-6">
              <span className="text-orange-500">بوتان</span>لند
            </Link>
            <p className="text-gray-400 text-sm leading-7 mb-6 text-justify">
              اولین و بزرگترین مرجع تخصصی فروش آنلاین قطعات یدکی پکیج‌های دیواری بوتان و ایران رادیاتور. با تضمین اصالت کالا و ارسال فوری به سراسر کشور.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-orange-600 transition"><Instagram size={18}/></a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-blue-600 transition"><Twitter size={18}/></a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-blue-700 transition"><Linkedin size={18}/></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-orange-500">دسترسی سریع</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/shop" className="hover:text-white transition">فروشگاه قطعات</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">مجله آموزشی</Link></li>
              <li><Link href="/services" className="hover:text-white transition">درخواست تعمیرکار</Link></li>
              <li><Link href="/about" className="hover:text-white transition">درباره ما</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">تماس با ما</Link></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-orange-500">محصولات پرفروش</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/shop?category=wall-mounted-gas-boiler" className="hover:text-white transition">پکیج دیواری</Link></li>
              <li><Link href="/shop?category=spare-parts" className="hover:text-white transition">قطعات یدکی</Link></li>
              <li><Link href="/shop?category=radiator" className="hover:text-white transition">رادیاتور پنلی</Link></li>
              <li><Link href="/shop?category=water-heater" className="hover:text-white transition">آبگرمکن گازی</Link></li>
              <li><Link href="/shop?category=tools" className="hover:text-white transition">ابزار آلات</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-orange-500">ارتباط با ما</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="text-orange-500 shrink-0" size={20} />
                <span>تهران، خیابان طالقانی، بعد از بهار، پاساژ دانش، طبقه دوم، واحد ۲۴</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-orange-500 shrink-0" size={20} />
                <a href="tel:02177654321" className="hover:text-white" dir="ltr">021-77654321</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-orange-500 shrink-0" size={20} />
                <a href="mailto:info@butanland.com" className="hover:text-white">info@butanland.com</a>
              </li>
            </ul>
            
            {/* Newsletter */}
            <div className="mt-6 bg-white/5 p-1 rounded-xl flex items-center border border-white/10">
               <input type="email" placeholder="عضویت در خبرنامه..." className="bg-transparent w-full px-3 py-2 text-sm text-white outline-none placeholder-gray-500" />
               <button className="bg-orange-600 p-2 rounded-lg hover:bg-orange-700 transition"><Send size={16}/></button>
            </div>
          </div>

        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© ۱۴۰۳ بوتان‌لند. تمامی حقوق محفوظ است.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-1">
            طراحی و توسعه با <span className="text-red-500">❤</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
