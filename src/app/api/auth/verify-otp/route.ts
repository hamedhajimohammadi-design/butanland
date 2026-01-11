// 👇 این خط باعث می‌شود خطاهای SSL در لوکال نادیده گرفته شوند
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { phone, otp } = await request.json();
  const wpUrl = process.env.WORDPRESS_URL;

  // 👇 لاگین بای‌پس (تست)
  if (phone.includes('09120000000') && otp === '12345') {
    console.log("🚀 شروع عملیات لاگین تست...");
    
    try {
      const query = `
        mutation Login($username: String!, $password: String!) {
          login(input: {username: $username, password: $password}) {
            authToken
            user {
              id
              databaseId
              firstName
              lastName
              email
            }
          }
        }
      `;

      console.log(`📡 در حال اتصال به: ${wpUrl}/graphql`);
      
      const res = await fetch(`${wpUrl}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          variables: {
            username: '09120000000', // نام کاربری
            password: 'Test@12345'   // رمز عبور
          }
        }),
      });

      console.log("وضعیت پاسخ سرور:", res.status);
      
      const text = await res.text();
      // console.log("متن کامل پاسخ:", text.substring(0, 500)); // اگر نیاز شد فعال کنید

      // تلاش برای تبدیل به JSON
      let data;
      try {
         data = JSON.parse(text);
      } catch (err) {
         console.error("❌ پاسخ سرور JSON نیست (احتمالا پلاگین نصب نیست یا آدرس غلط است)");
         console.error("خروجی:", text.substring(0, 200));
         return NextResponse.json({ success: false, message: 'خطا: پاسخ سرور معتبر نیست' }, { status: 400 });
      }

      if (data?.data?.login?.authToken) {
        console.log("✅ لاگین موفقیت‌آمیز بود!");
        return NextResponse.json({
          success: true,
          user: {
            user_id: data.data.login.user.databaseId,
            first_name: data.data.login.user.firstName || 'کاربر تست',
            last_name: data.data.login.user.lastName || '',
          },
          token: data.data.login.authToken
        });
      } else {
        console.error("❌ لاگین ناموفق بود.");
        console.error("خطاهای دریافتی:", JSON.stringify(data.errors || data, null, 2));
      }

    } catch (e) {
      console.error("🔥 خطای ارتباط:", e);
    }
    return NextResponse.json({ success: false, message: 'اطلاعات تست اشتباه است (ترمینال را چک کنید)' }, { status: 400 });
  }

  // --- کد اصلی برای کاربران واقعی ---
  return NextResponse.json({ success: false, message: 'فقط شماره تست مجاز است' }, { status: 400 });
}