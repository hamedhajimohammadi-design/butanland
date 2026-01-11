import { Metadata } from 'next';
import OrderSuccess from '@/components/checkout/OrderSuccess'; // مسیر فایل بالا

export const metadata: Metadata = {
  title: 'سفارش شما با موفقیت ثبت شد | بوتان لند',
  description: 'رسید نهایی خرید و کد پیگیری سفارش.',
  robots: {
    index: false, // معمولاً صفحات تشکر نباید در گوگل ایندکس شوند
    follow: false,
  },
};

export default function OrderReceivedPage() {
  return (
    <>
      <OrderSuccess />
    </>
  );
}
