"use client";
import { useState } from "react";
import { UploadCloud } from "lucide-react";

export default function UpgradeToPartner() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpgrade = async () => {
    // اینجا فایل را به API می‌فرستید
    // و در بک‌اند فقط نقش کاربر (Role) را تغییر نمی‌دهید،
    // بلکه وضعیتش را می‌گذارید روی Pending_Verification
    alert("مدارک ارسال شد. پس از بررسی، حساب شما همکار می‌شود.");
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-blue-900">همکار هستید؟ حساب خود را ارتقاء دهید!</h3>
          <p className="text-sm text-blue-700 mt-1">
            با ارسال تصویر کارت مهارت یا جواز کسب، قیمت‌های همکاری برای شما فعال می‌شود.
          </p>
        </div>

        <div className="flex items-center gap-2">
           {/* اینپوت فایل مخفی */}
           <label className="cursor-pointer bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition flex items-center gap-2">
              <UploadCloud className="w-4 h-4" />
              <span>{file ? "تغییر مدرک" : "آپلود مدرک"}</span>
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
           </label>
           
           {file && (
             <button onClick={handleUpgrade} className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-700 transition">
               ارسال و درخواست تایید
             </button>
           )}
        </div>
      </div>
    </div>
  );
}
