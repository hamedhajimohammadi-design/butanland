'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Phone, Lock, User, Loader2, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  // مراحل: 'phone' -> 'otp'
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone');
  const [loading, setLoading] = useState(false);
  
  // داده‌های فرم
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  
  // تایمر ارسال مجدد
  const [timer, setTimer] = useState(60);

  // مدیریت تایمر
  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // مرحله ۱: ارسال شماره به API
  const handleSendPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return alert("شماره موبایل صحیح نیست");
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (data.success) {
        setStep('otp');
        setTimer(60);
        // alert("کد ارسال شد (اگر پنل پیامک ندارید، در لاگ دیجیتس چک کنید)");
      } else {
        alert(data.message || "خطا در ارسال پیامک");
      }
    } catch (err) {
      console.error(err);
      alert("مشکلی در ارتباط با سرور پیش آمد.");
    } finally {
      setLoading(false);
    }
  };

  // مرحله ۲: بررسی کد تایید با API و ورود
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();

      if (data.success) {
        // لاگین موفق! دریافت اطلاعات کاربر از وردپرس
        const userData = data.user; 
        
        // ذخیره در State منیجمنت
        login({
            id: userData.ID || userData.user_id || '0',
            firstName: userData.first_name || 'کاربر', // اگر نام نداشت، پیش‌فرض می‌گذارد
            lastName: userData.last_name || '',
            phone: phone,
            role: 'customer' // نقش را می‌توان بعداً دقیق‌تر کرد
        }, data.token);

        // اگر نام کاربر خالی بود، شاید بخواهید به مرحله register بفرستید،
        // اما فعلاً برای سادگی مستقیم وارد داشبورد می‌کنیم.
        alert(`خوش آمدید ${userData.first_name || 'کاربر عزیز'}!`);
        router.push('/dashboard'); 
      } else {
        alert(data.message || "کد اشتباه است!");
      }
    } catch (err) {
      console.error(err);
      alert("مشکلی پیش آمد.");
    } finally {
      setLoading(false);
    }
  };

  // مرحله ۳: تکمیل پروفایل (اختیاری - فعلاً استفاده نمی‌شود چون بعد از OTP لاگین می‌کنیم)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // این بخش می‌تواند برای آپدیت نام کاربر بعد از لاگین استفاده شود
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-[family-name:var(--font-vazir)]">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
        
        {/* هدر گرافیکی */}
        <div className="h-32 bg-orange-500 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="z-10 text-white text-center">
                <h1 className="text-2xl font-black">بوتان لند</h1>
                <p className="text-orange-100 text-sm mt-1">ورود به حساب کاربری</p>
            </div>
        </div>

        <div className="p-8">
            
            {/* مرحله ۱: شماره موبایل */}
            {step === 'phone' && (
                <form onSubmit={handleSendPhone} className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                    <div className="text-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">شماره موبایل خود را وارد کنید</h2>
                        <p className="text-gray-400 text-xs mt-2">کد تایید برای شما پیامک خواهد شد</p>
                    </div>
                    
                    <div className="relative">
                        <input 
                            type="tel" 
                            dir="ltr"
                            placeholder="0912..."
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-12 text-lg tracking-widest focus:border-orange-500 focus:bg-white outline-none transition-all"
                            autoFocus
                        />
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                    </div>

                    <button disabled={loading} className="w-full h-14 bg-orange-500 text-white rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200">
                        {loading ? <Loader2 className="animate-spin"/> : 'ارسال کد تایید'}
                        {!loading && <ArrowLeft size={20}/>}
                    </button>
                </form>
            )}

            {/* مرحله ۲: کد تایید */}
            {step === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                    <div className="text-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">کد تایید را وارد کنید</h2>
                        <p className="text-gray-400 text-xs mt-2">کد ۵ رقمی به شماره {phone} ارسال شد</p>
                    </div>

                    <div className="relative">
                        <input 
                            type="text" 
                            dir="ltr"
                            placeholder="- - - - -"
                            maxLength={5} // معمولا کدهای دیجیتس ۵ رقمی هستند
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-12 text-center text-2xl tracking-[10px] focus:border-orange-500 focus:bg-white outline-none transition-all"
                            autoFocus
                        />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                        <button type="button" onClick={() => setStep('phone')} className="text-gray-400 hover:text-gray-600">ویرایش شماره</button>
                        {timer > 0 ? (
                            <span className="text-gray-400">{timer} ثانیه تا ارسال مجدد</span>
                        ) : (
                            <button type="button" onClick={() => setTimer(60)} className="text-orange-500 font-bold">ارسال مجدد کد</button>
                        )}
                    </div>

                    <button disabled={loading} className="w-full h-14 bg-orange-500 text-white rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200">
                        {loading ? <Loader2 className="animate-spin"/> : 'تایید و ادامه'}
                    </button>
                </form>
            )}

            {/* مرحله ۳: تکمیل اطلاعات (رزرو شده برای توسعه آینده) */}
            {step === 'register' && (
                <form onSubmit={handleRegister} className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                    <div className="text-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">اطلاعات خود را تکمیل کنید</h2>
                        <p className="text-gray-400 text-xs mt-2">برای صدور فاکتور به نام شما نیاز داریم</p>
                    </div>

                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="نام و نام خانوادگی"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-12 text-sm focus:border-orange-500 focus:bg-white outline-none transition-all"
                            autoFocus
                        />
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                    </div>

                    <button disabled={loading} className="w-full h-14 bg-green-500 text-white rounded-2xl font-bold text-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200">
                        {loading ? <Loader2 className="animate-spin"/> : 'ورود به پنل'}
                        {!loading && <CheckCircle size={20}/>}
                    </button>
                </form>
            )}

        </div>
      </div>
    </div>
  );
}