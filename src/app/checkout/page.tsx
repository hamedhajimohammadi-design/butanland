'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { fetchAPI } from '@/lib/api';
import { MapPin, User, CreditCard, ChevronRight, ShoppingBag, Truck } from 'lucide-react';

const CREATE_ORDER_MUTATION = `
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      order {
        databaseId
        orderNumber
        status
      }
    }
  }
`;

// تابع تبدیل اعداد فارسی به انگلیسی
const toEnglishDigits = (str: string) => {
  if (!str) return str;
  return str
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
};

// 👇 تابع جدید: تبدیل شناسه کدگذاری‌شده به عدد (مثلاً "cG9zdDoxNjk=" به 169)
const getDatabaseId = (id: string | number) => {
    if (typeof id === 'number') return id;
    if (!id) return 0;
    
    // اگر خودش عدد رشته‌ای بود
    if (!isNaN(Number(id)) && !id.toString().includes(':') && !id.toString().includes('=')) {
        return parseInt(id as string);
    }

    try {
        // دیکود کردن بیس۶۴ (مثلا "post:169")
        const decoded = atob(id as string);
        if (decoded.includes(':')) {
            return parseInt(decoded.split(':')[1]);
        }
    } catch (e) {
        console.warn("ID Decode Error:", id);
    }
    
    return 0;
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postcode: '1111111111', 
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={48} />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">سبد خرید شما خالی است</h1>
        <p className="text-gray-500 mb-8 text-sm">برای ثبت سفارش ابتدا محصولی را به سبد اضافه کنید.</p>
        <Link href="/" className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const englishPhone = toEnglishDigits(formData.phone);
      const englishPostcode = toEnglishDigits(formData.postcode);

      const input = {
        paymentMethod: 'cod',
        billing: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address1: formData.address,
          city: formData.city,
          postcode: englishPostcode,
          email: formData.email,
          phone: englishPhone,
          country: 'IR', 
          state: 'TEH',
        },
        shipping: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address1: formData.address,
            city: formData.city,
            postcode: englishPostcode,
            country: 'IR',
            state: 'TEH',
        },
        // 👇 تبدیل شناسه‌ها به عدد قبل از ارسال
        lineItems: items.map((item) => ({
          productId: getDatabaseId(item.id),
          quantity: item.quantity,
        })),
      };

      console.log("📤 در حال ثبت سفارش:", input);

      const data = await fetchAPI(CREATE_ORDER_MUTATION, {
        variables: { input },
      });

      if (data.errors) {
         console.error("❌ خطای وردپرس:", JSON.stringify(data.errors, null, 2));
         const msg = data.errors[0].message;
         throw new Error(`خطای ثبت سفارش: ${msg}`);
      }

      if (data?.createOrder?.order) {
        console.log("✅ سفارش با موفقیت ثبت شد:", data.createOrder.order);
        // router.push redirect updated here
        router.push(`/order-received/${data.createOrder.order.orderNumber}?total=${totalPrice()}`);
        clearCart(); 
      } else {
        throw new Error('پاسخ نامعتبر از سرور (سفارش ایجاد نشد)');
      }

    } catch (error: any) {
      console.error("❌ Checkout Error:", error);
      alert(error.message || "مشکلی در ارتباط با سرور پیش آمد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-10 font-[family-name:var(--font-vazir)]">
      
      {/* Header Mobile */}
      <div className="bg-white p-4 sticky top-0 z-20 border-b border-gray-100 md:hidden flex items-center gap-3">
        <Link href="/" className="text-gray-500"><ChevronRight /></Link>
        <span className="font-bold text-gray-800">تکمیل خرید</span>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-10">
        <h1 className="text-2xl font-black text-gray-900 mb-8 hidden md:block border-r-4 border-orange-500 pr-3">نهایی کردن سفارش</h1>
        <div className="flex flex-col lg:flex-row gap-6">
            
            {/* 1. Form Section */}
            <div className="flex-1 space-y-6">
                
                {/* اطلاعات گیرنده */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-orange-600">
                        <User size={20} />
                        <h2 className="font-bold text-lg">اطلاعات گیرنده</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-bold">نام <span className="text-red-500">*</span></label>
                            <input 
                                required
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                type="text" 
                                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:border-orange-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-bold">نام خانوادگی <span className="text-red-500">*</span></label>
                            <input 
                                required
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                type="text" 
                                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:border-orange-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-bold">شماره موبایل <span className="text-red-500">*</span></label>
                            <input 
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                type="tel" 
                                placeholder="0912..."
                                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:border-orange-500 outline-none transition-colors text-left dir-ltr"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-bold">ایمیل (الزامی) <span className="text-red-500">*</span></label>
                            <input 
                                required
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                type="email" 
                                placeholder="example@mail.com"
                                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:border-orange-500 outline-none transition-colors text-left dir-ltr"
                            />
                        </div>
                    </div>
                </div>

                {/* آدرس ارسال */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-orange-600">
                        <MapPin size={20} />
                        <h2 className="font-bold text-lg">آدرس ارسال</h2>
                    </div>
                    <div className="space-y-4">
                         <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-bold">شهر <span className="text-red-500">*</span></label>
                            <input 
                                required
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                type="text" 
                                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:border-orange-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-bold">آدرس دقیق پستی <span className="text-red-500">*</span></label>
                            <textarea 
                                required
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:border-orange-500 outline-none transition-colors resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

            </div>

            {/* 2. Order Summary (Left/Sticky) */}
            <div className="lg:w-[400px]">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                    <div className="flex items-center gap-2 mb-6 text-gray-800">
                        <CreditCard size={20} />
                        <h2 className="font-bold text-lg">خلاصه سفارش</h2>
                    </div>

                    <div className="space-y-3 mb-6 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-3 items-center bg-gray-50 p-2 rounded-lg">
                                <div className="relative w-12 h-12 bg-white rounded-md overflow-hidden shrink-0">
                                   {item.image && <Image src={item.image} alt={item.name} fill className="object-contain" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-700 truncate">{item.name}</p>
                                    <p className="text-[10px] text-gray-400">{item.quantity} عدد</p>
                                </div>
                                <span className="text-xs font-bold text-gray-900">
                                    {(item.price * item.quantity).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed border-gray-200 my-4"></div>

                    <div className="flex justify-between items-center mb-3 text-sm text-gray-500">
                        <span>هزینه ارسال</span>
                        <span className="flex items-center gap-1 text-gray-900 font-bold">
                            <Truck size={14} className="text-blue-500"/>
                            پس‌کرایه (تیپاکس/باربری)
                        </span>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <span className="font-bold text-gray-700">مبلغ قابل پرداخت</span>
                        <div className="text-xl font-black text-gray-900">
                            {totalPrice().toLocaleString()} <span className="text-xs font-normal text-gray-500">تومان</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:shadow-none"
                    >
                        {loading ? 'در حال ثبت...' : 'ثبت سفارش (پرداخت در محل)'}
                    </button>
                    
                    <p className="text-[10px] text-gray-400 text-center mt-3 leading-relaxed">
                        با ثبت سفارش، قوانین و مقررات بوتان لند را می‌پذیرم.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
