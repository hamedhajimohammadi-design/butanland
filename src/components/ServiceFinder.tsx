"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { MapPin, Star, ShieldCheck, Wrench, Search, PhoneCall } from "lucide-react";

// نوع داده (اینترفیس) برای تعمیرکاران
interface Technician {
  id: number;
  name: string;
  avatar: string;
  city: string;
  expertise: string[];
  rating: number;
  isVerified: boolean;
  status: "available" | "busy";
}

// دیتای تستی (بعدا با fetch جایگزین می‌شود)
const TECHNICIANS_DATA: Technician[] = [
  {
    id: 1,
    name: "حامد حاجی‌محمدی",
    avatar: "/images/tech1.jpg", // عکس تستی بزارید
    city: "تهران",
    expertise: ["پکیج دیواری", "موتورخانه"],
    rating: 4.8,
    isVerified: true,
    status: "available",
  },
  {
    id: 2,
    name: "رضا محمدی",
    avatar: "/images/tech2.jpg",
    city: "تبریز",
    expertise: ["آبگرمکن", "لوله کشی"],
    rating: 4.2,
    isVerified: true,
    status: "busy",
  },
  // ... سایر تعمیرکاران
];

// لیست شهرها برای دراپ‌داون
const CITIES = ["تهران", "تبریز", "اصفهان", "مشهد", "شیراز", "کرج", "رشت", "یزد"];

export default function ServiceFinder() {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // فیلتر کردن تعمیرکاران بر اساس شهر انتخاب شده
  const filteredTechnicians = useMemo(() => {
    if (!selectedCity) return [];
    return TECHNICIANS_DATA.filter((tech) => tech.city === selectedCity);
  }, [selectedCity]);

  // چک کنیم که آیا در شهر انتخاب شده اصلا کسی هست؟
  const hasTechnicianInCity = filteredTechnicians.length > 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12" dir="rtl">
      
      {/* هدر بخش خدمات */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">یافتن نزدیک‌ترین متخصص بوتان</h2>
        <p className="text-gray-500">برای مشاهده لیست تعمیرکاران تایید شده، شهر خود را انتخاب کنید.</p>
      </div>

      {/* باکس انتخاب شهر */}
      <div className="max-w-xl mx-auto bg-white p-4 rounded-2xl shadow-lg border border-gray-100 mb-12">
        <div className="relative">
          <MapPin className="absolute right-3 top-3.5 text-blue-500 w-5 h-5" />
          <select
            className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-gray-700 font-medium"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="" disabled>انتخاب شهر شما...</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* نمایش نتایج */}
      <div className="min-h-[300px]">
        
        {/* حالت 1: هنوز شهری انتخاب نشده */}
        {!selectedCity && (
          <div className="flex flex-col items-center justify-center text-gray-400 mt-10 opacity-60">
            <Search className="w-16 h-16 mb-4" />
            <p>لطفاً یک شهر را انتخاب کنید</p>
          </div>
        )}

        {/* حالت 2: شهر انتخاب شده ولی تعمیرکار نداریم (دعوت به همکاری) */}
        {selectedCity && !hasTechnicianInCity && (
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-orange-800 mb-2">
              هنوز در {selectedCity} نماینده نداریم!
            </h3>
            <p className="text-orange-700 mb-6">
              متاسفانه هنوز تعمیرکاری در این شهر ثبت نام نکرده است.
            </p>
            <div className="bg-white p-6 rounded-xl shadow-sm inline-block w-full">
              <p className="font-bold text-gray-800 mb-2">شما تعمیرکار {selectedCity} هستید؟</p>
              <p className="text-sm text-gray-500 mb-4">
                با عضویت در سایت، مشتریان این شهر را رایگان جذب کنید.
              </p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition shadow-lg shadow-orange-500/20">
                ثبت‌نام به عنوان همکار
              </button>
            </div>
          </div>
        )}

        {/* حالت 3: نمایش لیست تعمیرکاران */}
        {selectedCity && hasTechnicianInCity && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechnicians.map((tech) => (
              <div key={tech.id} className="bg-white rounded-2xl border hover:shadow-xl transition-all duration-300 group overflow-hidden">
                {/* بخش بالایی کارت */}
                <div className="p-6 flex items-start gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 relative">
                        {/* اینجا کامپوننت Image نکست جی اس را استفاده کنید */}
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                             {/* Placeholder if no image */}
                             {tech.name[0]}
                        </div>
                    </div>
                    {tech.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white" title="هویت تایید شده">
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-gray-800">{tech.name}</h3>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-100">
                            <span className="text-xs font-bold text-yellow-700">{tech.rating}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {tech.city}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                        {tech.expertise.map((exp, idx) => (
                            <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                {exp}
                            </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* دکمه‌های پایین کارت */}
                <div className="bg-gray-50 p-4 border-t flex gap-3">
                   <button 
                     className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 rounded-xl font-medium transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                     onClick={() => alert(`درخواست برای ${tech.name} ارسال شد!`)}
                   >
                     <Wrench className="w-4 h-4" />
                     درخواست تعمیر
                   </button>
                   
                   {/* دکمه تماس (می‌تواند مودال باز کند) */}
                   <button className="bg-white border hover:bg-gray-50 text-gray-700 p-2.5 rounded-xl transition">
                     <PhoneCall className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}