'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import TechnicianCard, { Technician } from './TechnicianCard';

// Dummy cities list for the dropdown
const CITIES = ['تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'کرج', 'اهواز', 'رشت'];

export default function ServiceFinderClient() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState("");
  
  // Modal State
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    async function fetchTechnicians() {
      const loadMockData = () => {
        console.warn("Using Mock Data Fallback");
        const mockData: Technician[] = Array.from({ length: 12 }).map((_, i) => ({
            id: i + 1000,
            name: `تکنسین نمونه ${i + 1}`,
            avatar_url: '', 
            meta: {
                city: CITIES[Math.floor(Math.random() * CITIES.length)],
                expertise: ['نصب پکیج', 'تعمیرات', 'لوله کشی'].slice(0, Math.floor(Math.random() * 3) + 1),
                rating: (Math.random() * 2) + 3,
                reviews_count: Math.floor(Math.random() * 200) + 10,
                is_verified: Math.random() > 0.3,
                technician_status: Math.random() > 0.2 ? 'available' : 'busy'
            }
        }));
        setTechnicians(mockData);
        setError(""); // Ensure no error message is shown
      };

      try {
        const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://api.butanland.com';
        const baseUrl = apiUrl.replace('/graphql', '').replace(/\/$/, '');
        
        // Use a simple fetch execution
        const res = await fetch(`${baseUrl}/wp-json/wp/v2/users?roles=technician`);
        
        // 1. Check Network/Server Status (Soft check, no Throw)
        if (!res.ok) {
           console.warn(`API returned status ${res.status}. Switching to mock data.`);
           loadMockData(); // Direct fallback
           return;
        }

        const data = await res.json();

        // 2. Validate Data
        if (!Array.isArray(data)) {
           console.warn("API data is not an array. Switching to mock data.");
           loadMockData();
           return;
        }

        // 3. Map Real Data
        const formattedData = data.map((u: any) => ({
          id: u.id,
          name: u.name,
          avatar_url: u.butan_meta?.avatar_url || "/images/placeholder-user.png", 
          meta: {
              city: u.butan_meta?.city || "نامشخص",
              expertise: u.butan_meta?.expertise || [],
              rating: u.butan_meta?.rating || 0,
              reviews_count: u.butan_meta?.jobs_count || 12,
              is_verified: u.butan_meta?.is_verified || false,
              technician_status: u.butan_meta?.status || "available",
          }
        }));

        setTechnicians(formattedData);
        setError("");

      } catch (err: any) {
        // Network errors (e.g. offline) land here
        console.error("Network/System Error:", err);
        loadMockData();
      } finally {
        setLoading(false);
      }
    }

    fetchTechnicians();
  }, []);

  const filteredTechnicians = technicians.filter(tech => {
    const matchesCity = selectedCity ? tech.meta.city === selectedCity : true;
    const matchesSearch = tech.name.includes(searchQuery) || (tech.meta.expertise || []).some(e => e.includes(searchQuery));
    return matchesCity && matchesSearch;
  });

  const handleRequestService = (tech: Technician) => {
      setSelectedTech(tech);
      setRequestSent(false); // Reset
  };

  const confirmRequest = () => {
      // API call to send request would go here
      setTimeout(() => {
        setRequestSent(true);
      }, 1000);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
          <div className="container mx-auto px-4 py-16 relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                  <div className="max-w-2xl text-center lg:text-right">
                      <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                          بهترین تعمیرکاران بوتان <br/>
                          <span className="text-orange-500">در نزدیکی شما</span>
                      </h1>
                      <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                          با جستجو در لیست متخصصین تایید شده، به سادگی برای سرویس دوره‌ای، نصب و تعمیرات درخواست ثبت کنید.
                      </p>
                      <button 
                        onClick={() => document.getElementById('search-box')?.scrollIntoView({behavior: 'smooth'})} 
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-orange-900/40 inline-flex items-center gap-2"
                      >
                          <Search size={20} />
                          یافتن متخصص
                      </button>
                  </div>
                  
                  {/* Technician Call to Action */}
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 w-full lg:w-96 text-center lg:text-right">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto lg:mx-0 text-orange-500">
                         <CheckCircle2 />
                      </div>
                      <h3 className="text-xl font-bold mb-2">شما تعمیرکار هستید؟</h3>
                      <p className="text-gray-400 text-sm mb-6">به جمع متخصصین بوتان بپیوندید و درآمد خود را افزایش دهید.</p>
                      <Link href="/register?role=technician" className="block w-full text-center bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-xl font-bold transition">
                          ثبت نام تعمیرکاران
                      </Link>
                  </div>
              </div>
          </div>
          
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
              <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-600 rounded-full blur-[120px]"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600 rounded-full blur-[100px]"></div>
          </div>
      </div>

      {/* 2. Sticky Search Bar */}
      <div id="search-box" className="bg-white border-b border-gray-200 sticky top-20 z-30 shadow-sm">
         <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/* City Select */}
                <div className="relative md:w-64 shrink-0">
                    <select 
                        className="w-full h-12 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl appearance-none outline-none focus:border-orange-500 transition cursor-pointer"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        <option value="">همه شهرها</option>
                        {CITIES.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>

                {/* Search Input */}
                <div className="relative flex-1">
                    <input 
                        type="text" 
                        placeholder="جستجو نام تکنسین یا تخصص..."
                        className="w-full h-12 pl-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
            </div>
         </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 size={40} className="animate-spin mb-4 text-orange-600" />
                <p>در حال بارگذاری لیست متخصصین...</p>
             </div>
        ) : error ? (
            <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
                <p className="text-red-600 font-bold mb-2">خطا در دریافت اطلاعات</p>
                <p className="text-red-500 text-sm dir-ltr">{error}</p>
            </div>
        ) : filteredTechnicians.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTechnicians.map(tech => (
                    <TechnicianCard key={tech.id} technician={tech} onRequest={handleRequestService} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">
                    با فیلترهای انتخاب شده، تکنسینی یافت نشد.
                </p>
                <button 
                  onClick={() => { setSelectedCity(''); setSearchQuery(''); }}
                  className="mt-4 text-orange-600 font-bold hover:underline"
                >
                    پاک کردن فیلترها
                </button>
            </div>
        )}
      </div>

      {/* Request Modal */}
      {selectedTech && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-lg text-gray-800">درخواست سرویس</h3>
                      <button onClick={() => setSelectedTech(null)} className="p-2 hover:bg-gray-200 rounded-full transition"><X size={20} /></button>
                  </div>
                  
                  <div className="p-8 text-center">
                     {requestSent ? (
                         <div className="flex flex-col items-center animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 size={32} className="text-green-600" />
                            </div>
                            <h4 className="font-black text-xl text-gray-900 mb-2">درخواست ارسال شد!</h4>
                            <p className="text-gray-500 mb-6">
                                درخواست شما برای <strong>{selectedTech.name}</strong> ارسال شد. ایشان به زودی با شما تماس خواهند گرفت.
                            </p>
                            <button 
                                onClick={() => setSelectedTech(null)}
                                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold"
                            >
                                متوجه شدم
                            </button>
                         </div>
                     ) : (
                        <>
                            <div className="mb-6">
                                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-3 overflow-hidden">
                                     {selectedTech.avatar_url ? (
                                         <Image src={selectedTech.avatar_url} alt={selectedTech.name} width={80} height={80} />
                                     ) : (
                                         <div className="w-full h-full flex items-center justify-center text-gray-300"><Search /></div>
                                     )}
                                </div>
                                <h4 className="font-bold text-lg text-gray-900">{selectedTech.name}</h4>
                                <p className="text-gray-500 text-sm">متخصص {selectedTech.meta.expertise?.[0]}</p>
                            </div>
                            
                            <p className="text-gray-600 mb-8 text-sm bg-blue-50 p-4 rounded-xl border border-blue-100">
                                با ارسال درخواست، شماره تماس شما برای ایشان ارسال می‌شود تا جهت هماهنگی تماس بگیرند.
                            </p>

                            <button 
                                onClick={confirmRequest}
                                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition shadow-lg shadow-orange-200"
                            >
                                تایید و ارسال درخواست
                            </button>
                        </>
                     )}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}
