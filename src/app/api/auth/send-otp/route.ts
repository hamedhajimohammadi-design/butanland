import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { phone } = await request.json();
  const wpUrl = process.env.WORDPRESS_URL;

  // 👇👇👇 بای‌پس برای شماره تست (بدون نیاز به اینترنت ایران)
  if (phone.includes('09120000000')) {
    return NextResponse.json({ success: true, message: 'کد تایید آزمایشی ارسال شد' });
  }
  // 👆👆👆 پایان بای‌پس

  // کد اصلی برای کاربران واقعی (فعلاً کار نمی‌کند چون پنل قطع است)
  const mobileNo = phone.startsWith('0') ? phone.slice(1) : phone;
  const formData = new URLSearchParams();
  formData.append('countrycode', '+98');
  formData.append('mobileNo', mobileNo);
  formData.append('type', 'login');

  try {
    const res = await fetch(`${wpUrl}/wp-json/digits/v1/send_otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    const data = await res.json();
    
    if (data.code === 1) {
      return NextResponse.json({ success: true, message: data.message });
    } else {
      // چون پنل قطع است، احتمالا اینجا خطا می‌دهد
      return NextResponse.json({ success: false, message: 'پنل پیامک پاسخگو نیست' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطا در ارتباط با سرور' }, { status: 500 });
  }
}