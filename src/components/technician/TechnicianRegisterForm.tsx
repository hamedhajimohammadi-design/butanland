"use client";

import { useState, useMemo } from "react";
import { UploadCloud, PhoneCall, CheckCircle2, AlertTriangle, Loader2, User, MapPin, Info, X } from "lucide-react";
// Import city data
import iranData from "iran-cities-json";

export default function TechnicianRegisterForm() {
  const [loading, setLoading] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<"upload" | "call">("upload");
  const [file, setFile] = useState<File | null>(null);
  
  // استیت‌های جدید
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isServiceProvider, setIsServiceProvider] = useState(false); // آیا سرویس‌کار هم هست؟
  const [showServiceModal, setShowServiceModal] = useState(false); // نمایش مودال توضیحات

  // 1. Extract provinces list (calculated once)
  const provinces = useMemo(() => {
    // @ts-ignore
    return iranData.ostan || []; 
  }, []);

  // 2. Extract cities for selected province
  const availableCities = useMemo(() => {
    if (!selectedProvince) return [];
    // @ts-ignore
    return (iranData.shahr || []).filter((city: any) => city.ostan == selectedProvince);
  }, [selectedProvince]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Find province name for better data submission (since we store ID in state)
     // @ts-ignore
    const provinceObj = provinces.find((p: any) => p.id == selectedProvince);
    const provinceName = provinceObj ? provinceObj.name : selectedProvince;
    
    // دیتایی که به سمت سرور می‌فرستید:
    const formData = {
        name: "...", // از اینپوت
        mobile: "...", // از اینپوت
        province: provinceName,
        city: selectedCity,
        verificationMethod,
        isServiceProvider, // true/false
        // file...
    };

    console.log("Submitting:", formData);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(isServiceProvider ? "تبریک! ثبت‌نام شما به عنوان همکار و سرویس‌کار انجام شد." : "ثبت‌نام همکار انجام شد.");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans relative" dir="rtl">
      
      {/* --- مودال توضیحات سرویس‌کار (Pop-up) --- */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">مزایای عضویت در شبکه سرویس‌کاران</h3>
                    <button onClick={() => setShowServiceModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition"><X className="w-5 h-5 text-gray-500"/></button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm leading-6">
                        با فعال کردن تیک سرویس‌کار، پروفایل شما در بخش <strong>"یافتن متخصص"</strong> نمایش داده می‌شود و مشتریان شهر {selectedCity || "شما"} می‌توانند مستقیماً با شما تماس بگیرند.
                    </div>
                    
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <div className="bg-green-100 p-2 rounded-full h-fit"><CheckCircle2 className="w-5 h-5 text-green-600"/></div>
                            <div>
                                <h4 className="font-bold text-gray-800">مشتری رایگان، بدون کمیسیون</h4>
                                <p className="text-xs text-gray-500 mt-1">ما مشتری را به شما وصل می‌کنیم و در درآمد شما شریک نمی‌شویم.</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <div className="bg-orange-100 p-2 rounded-full h-fit"><User className="w-5 h-5 text-orange-600"/></div>
                            <div>
                                <h4 className="font-bold text-gray-800">مدیریت زمان کاری</h4>
                                <p className="text-xs text-gray-500 mt-1">هر وقت مشغول بودید، پروفایل خود را موقتاً غیرفعال کنید.</p>
                            </div>
                        </li>
                    </ul>

                    <div className="border-t pt-4">
                        <h4 className="font-bold text-gray-800 mb-2">تعهدات شما:</h4>
                        <p className="text-sm text-gray-600 leading-relaxed text-justify">
                            سرویس‌کار متعهد می‌شود که نرخ‌نامه مصوب را رعایت کرده و رفتاری حرفه‌ای با مشتریان معرفی شده از سمت بوتان‌لند داشته باشد. در صورت دریافت امتیاز منفی مکرر، پروفایل سرویس‌کار غیرفعال می‌شود.
                        </p>
                    </div>
                </div>
                <div className="p-6 border-t bg-gray-50 flex justify-end">
                    <button 
                        onClick={() => { setIsServiceProvider(true); setShowServiceModal(false); }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition w-full md:w-auto"
                    >
                        قبول قوانین و فعال‌سازی
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- بدنه اصلی فرم --- */}
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-900 p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">عضویت در باشگاه متخصصین</h1>
          <p className="text-blue-200 text-sm">به جمع سرویس‌کاران حرفه‌ای بپیوندید.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
            {/* ... اینپوت‌های نام و موبایل مثل قبل ... */}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">نام و نام خانوادگی</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition" placeholder="مثلا: رضا علوی" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">شماره موبایل</label>
                    <input type="tel" required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition" placeholder="0912..." />
                </div>
            </div>

            {/* --- انتخاب شهر و استان (اصلاح شده) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">استان</label>
                    <div className="relative">
                        <MapPin className="absolute right-3 top-3.5 text-gray-400 w-4 h-4" />
                        <select 
                            value={selectedProvince}
                            onChange={(e) => {
                                setSelectedProvince(e.target.value);
                                setSelectedCity(""); // ریست کردن شهر هنگام تغییر استان
                            }}
                            className="w-full pr-9 pl-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 transition appearance-none"
                            required
                        >
                            <option value="">انتخاب استان...</option>
                            {provinces.map((prov: any) => (
                                <option key={prov.id} value={prov.id}>{prov.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">شهر</label>
                    <div className="relative">
                        <MapPin className="absolute right-3 top-3.5 text-gray-400 w-4 h-4" />
                        <select 
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="w-full pr-9 pl-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 transition appearance-none disabled:bg-gray-50 disabled:text-gray-400"
                            required
                            disabled={!selectedProvince}
                        >
                            <option value="">
                                {selectedProvince ? "انتخاب شهر..." : "اول استان را انتخاب کنید"}
                            </option>
                            
                            {/* Available Cities Map */}
                            {availableCities.map((city: any) => (
                                <option key={city.id} value={city.name}>{city.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* --- بخش جدید: دعوت به همکاری سرویس‌کار --- */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 mb-8">
                <div className="flex items-start gap-3">
                    <input 
                        type="checkbox" 
                        id="serviceProviderCheck"
                        checked={isServiceProvider}
                        onChange={(e) => setIsServiceProvider(e.target.checked)}
                        className="w-5 h-5 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                        <label htmlFor="serviceProviderCheck" className="font-bold text-gray-800 cursor-pointer select-none">
                            مایل هستم به عنوان <span className="text-blue-600">سرویس‌کار منتخب</span> به مشتریان معرفی شوم.
                        </label>
                        <p className="text-xs text-gray-500 mt-1 leading-5">
                            با فعال‌سازی این گزینه، پروفایل شما در لیست متخصصین نمایش داده می‌شود.
                            <button 
                                type="button" 
                                onClick={() => setShowServiceModal(true)}
                                className="text-blue-600 underline mr-1 font-medium hover:text-blue-800"
                            >
                                شرایط و مزایا را بخوانید
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-gray-100 my-6"></div>

            {/* --- ادامه فرم (روش احراز هویت و دکمه) --- */}
            <div className="mb-4">
                 <label className="text-sm font-bold text-gray-800 block mb-4">روش تایید حساب همکار:</label>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div 
                         onClick={() => setVerificationMethod("upload")}
                         className={`cursor-pointer border-2 rounded-2xl p-4 transition-all ${verificationMethod === 'upload' ? 'border-green-500 bg-green-50/30' : 'border-gray-200'}`}
                     >
                         <div className="flex items-center gap-2 mb-1">
                             <UploadCloud className={`w-5 h-5 ${verificationMethod === 'upload' ? 'text-green-600' : 'text-gray-400'}`} />
                             <span className="font-bold text-sm">آپلود مدرک (تایید فوری)</span>
                         </div>
                     </div>
                     <div 
                         onClick={() => setVerificationMethod("call")}
                         className={`cursor-pointer border-2 rounded-2xl p-4 transition-all ${verificationMethod === 'call' ? 'border-orange-400 bg-orange-50/30' : 'border-gray-200'}`}
                     >
                         <div className="flex items-center gap-2 mb-1">
                             <PhoneCall className={`w-5 h-5 ${verificationMethod === 'call' ? 'text-orange-600' : 'text-gray-400'}`} />
                             <span className="font-bold text-sm">تماس (۲۴ تا ۴۸ ساعت)</span>
                         </div>
                     </div>
                 </div>
            </div>

            {/* --- آپلودر (نمایش شرطی) --- */}
            {verificationMethod === 'upload' && (
                 <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-6 text-center mb-6 hover:bg-gray-100 transition relative">
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">{file ? file.name : "تصویر مدرک فنی یا جواز کسب"}</p>
                 </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {isServiceProvider ? 'ثبت‌نام همکار و فعال‌سازی سرویس' : 'ثبت‌نام همکار'}
            </button>

        </form>
      </div>
    </div>
  );
}
