import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Award, 
  Users, 
  Globe, 
  Package, 
  CheckCircle, 
  ArrowLeft,
  Target,
  Heart
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'درباره ما | بوتان لند (نمایندگی رسمی روبوتان)',
  description: 'آشنایی با بوتان لند، مرجع تخصصی قطعات پکیج و تاسیسات. نمایندگی رسمی روبوتان در مشهد با ارسال به سراسر کشور.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20 pt-28">
      
      {/* --- A. HERO SECTION --- */}
      <section className="relative bg-slate-900 text-white py-20 px-4 overflow-hidden rounded-b-[3rem] mb-16">
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-white/10 text-orange-300">
            <Award size={14} />
            <span>بیش از ۱۵ سال تجربه درخشان</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-black mb-8 leading-tight">
            ما <span className="text-orange-500">قلب خانه شما</span> را<br/>
            گرم نگه می‌داریم
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            بوتان‌لند فقط یک فروشگاه اینترنتی نیست؛ ما تیمی از متخصصین تاسیسات هستیم که با نام تجاری 
            <strong className="text-white mx-1">روبوتان</strong> 
            در مشهد فعالیت می‌کنیم و حالا دانش و قطعات اورجینال را به وسعت ایران ارائه می‌دهیم.
          </p>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-600 rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20"></div>
      </section>

      {/* --- B. STORY SECTION --- */}
      <section className="container mx-auto px-4 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Image/Visual */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl relative z-10">
               {/* جایگذاری تصویر واقعی تیم یا فروشگاه */}
               <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 to-gray-400 flex items-center justify-center text-white/20">
                 <Users size={64} />
                 {/* <Image src="/about-team.jpg" fill className="object-cover" /> */}
               </div>
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-orange-200 rounded-3xl -z-0"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-orange-100 rounded-full blur-xl -z-0"></div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-orange-600 rounded-full"></span>
              داستان ما
            </h2>
            <p className="text-gray-500 leading-8 mb-6 text-justify">
              داستان ما از یک فروشگاه کوچک و تعمیرگاه تخصصی پکیج در شهر مشهد شروع شد. جایی که تعهد به مشتری و استفاده از قطعات اصلی، رمز موفقیت ما بود. با گذشت سال‌ها و کسب اعتماد مشتریان محلی تحت نام <strong>«روبوتان»</strong>، تصمیم گرفتیم این تجربه و دسترسی به قطعات نایاب را با کل ایران به اشتراک بگذاریم.
            </p>
            <p className="text-gray-500 leading-8 mb-8 text-justify">
              امروز <strong>بوتان‌لند</strong> بازوی آنلاین ماست که فاصله بین انبار قطعات اورجینال ما و خانه شما را به اندازه یک کلیک کوتاه کرده است. فرقی نمی‌کند در تبریز باشید یا بندرعباس؛ قطعه مورد نظر شما با همان کیفیت و سرعتی که همشهریان مشهدی دریافت می‌کنند، به دست شما می‌رسد.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg"><CheckCircle size={20}/></div>
                <span className="font-bold text-sm text-gray-700">ضمانت اصالت قطعه</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><CheckCircle size={20}/></div>
                <span className="font-bold text-sm text-gray-700">مشاوره فنی رایگان</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg"><CheckCircle size={20}/></div>
                <span className="font-bold text-sm text-gray-700">ارسال سریع هوایی/زمینی</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-red-100 text-red-600 p-2 rounded-lg"><CheckCircle size={20}/></div>
                <span className="font-bold text-sm text-gray-700">نمایندگی رسمی</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- C. STATS (Numbers) --- */}
      <section className="bg-orange-600 text-white py-16 mb-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black mb-2 flex justify-center items-center gap-1">
                +<span className="dir-ltr">15</span>
              </div>
              <p className="text-orange-100 text-sm font-bold">سال تجربه تخصصی</p>
            </div>

            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black mb-2 flex justify-center items-center gap-1">
                +<span className="dir-ltr">5000</span>
              </div>
              <p className="text-orange-100 text-sm font-bold">تنوع قطعات موجود</p>
            </div>

            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black mb-2 flex justify-center items-center gap-1">
                +<span className="dir-ltr">10k</span>
              </div>
              <p className="text-orange-100 text-sm font-bold">مشتری راضی</p>
            </div>

            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black mb-2 flex justify-center items-center gap-1">
                <span className="dir-ltr">24</span>/7
              </div>
              <p className="text-orange-100 text-sm font-bold">پشتیبانی آنلاین</p>
            </div>

          </div>
        </div>
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </section>

      {/* --- D. VALUES (Why Us) --- */}
      <section className="container mx-auto px-4 mb-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-gray-900 mb-4">چرا بوتان‌لند را انتخاب کنید؟</h2>
          <p className="text-gray-500">تعهد ما تنها فروش قطعه نیست، بلکه حل مشکل گرمایش خانه شما در سریع‌ترین زمان ممکن است.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center hover:-translate-y-2 transition duration-300">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
              <Package size={36} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">انبار غنی و متنوع</h3>
            <p className="text-gray-500 text-sm leading-6">
              ما فقط واسطه نیستیم؛ انبار فیزیکی ما در مشهد تضمین می‌کند که کالا موجود است و بلافاصله پس از سفارش پردازش می‌شود.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center hover:-translate-y-2 transition duration-300 relative z-10">
            <div className="absolute -top-4 right-1/2 translate-x-1/2 bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
              مهمترین ویژگی
            </div>
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
              <Target size={36} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">تخصص فنی و مشاوره</h3>
            <p className="text-gray-500 text-sm leading-6">
              فروشندگان ما تعمیرکاران خبره هستند. قبل از خرید، می‌توانید عکس قطعه را بفرستید تا از خرید اشتباه جلوگیری کنید.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center hover:-translate-y-2 transition duration-300">
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <Globe size={36} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">ارسال به تمام ایران</h3>
            <p className="text-gray-500 text-sm leading-6">
              با همکاری تیپاکس، پست و باربری، سفارش شما را در کوتاه‌ترین زمان ممکن به دورترین نقاط کشور می‌رسانیم.
            </p>
          </div>

        </div>
      </section>

      {/* --- E. CTA (Call to Action) --- */}
      <section className="container mx-auto px-4">
        <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <Heart className="mx-auto text-orange-500 mb-6" size={48} />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              همکاران ما منتظر شنیدن صدای شما هستند
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              اگر تعمیرکار هستید و به دنبال تامین‌کننده مطمئن می‌گردید، یا اگر مصرف‌کننده‌ای هستید که پکیج خانه‌اش خراب شده، ما اینجا هستیم.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/shop" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-2">
                <Package size={20} />
                مشاهده فروشگاه
              </Link>
              <Link href="/contact" className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-2">
                تماس با ما <ArrowLeft size={20} />
              </Link>
            </div>
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl"></div>
        </div>
      </section>

    </div>
  );
}
