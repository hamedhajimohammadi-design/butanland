'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, Send, Paperclip, User, Headset, MoreVertical, CheckCircle } from 'lucide-react';

export default function TicketChatPage() {
  const { id } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [reply, setReply] = useState('');

  // دیتای ساختگی مکالمه
  const [messages, setMessages] = useState([
    { id: 1, sender: 'user', text: 'سلام، من پمپ مدل ویلو رو خریدم ولی فشار آب کمه. آیا تنظیم خاصی داره؟', time: '۱۴۰۲/۱۰/۲۰ - ۱۰:۳۰' },
    { id: 2, sender: 'admin', text: 'سلام جناب حاجی‌محمدی عزیز 👋\nلطفاً بفرمایید دقیقاً کدام مدل را خریداری کردید؟ عکس پلاک پمپ را ارسال کنید.', time: '۱۴۰۲/۱۰/۲۰ - ۱۰:۴۵' },
    { id: 3, sender: 'user', text: 'مدل RS 25/6 هست. الان عکسش رو میفرستم.', time: '۱۴۰۲/۱۰/۲۰ - ۱۰:۵۰' },
    { id: 4, sender: 'user', text: '📎 image_pump_123.jpg', type: 'image', time: '۱۴۰۲/۱۰/۲۰ - ۱۰:۵۱' },
    { id: 5, sender: 'admin', text: 'بله این مدل سه دور سرعت دارد. روی بدنه پمپ یک کلید قرمز رنگ هست، آن را روی حالت ۳ (سه خط) بگذارید مشکل حل می‌شود.', time: '۱۴۰۲/۱۰/۲۰ - ۱۱:۰۰' },
  ]);

  // اسکرول خودکار به پایین وقتی پیام جدید میاد
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      text: reply,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setReply('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-[family-name:var(--font-vazir)]">
      
      {/* 1. هدر چت (ثابت بالا) */}
      <div className="bg-white px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <Link href="/dashboard/support" className="text-gray-500 hover:text-gray-900">
                <ChevronRight size={24} />
            </Link>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center relative">
                    <Headset size={20} />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                    <h1 className="font-bold text-gray-900 text-sm">پشتیبانی فنی (تیکت #{id})</h1>
                    <span className="text-xs text-green-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        پاسخ داده شده
                    </span>
                </div>
            </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={20} />
        </button>
      </div>

      {/* 2. ناحیه پیام‌ها (اسکرول شونده) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        
        {/* پیام سیستم (شروع) */}
        <div className="flex justify-center">
            <span className="bg-gray-200 text-gray-500 text-[10px] px-3 py-1 rounded-full">
                ۱۴۰۲/۱۰/۲۰
            </span>
        </div>

        {messages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] md:max-w-[60%] flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* آواتار */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.sender === 'user' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                        {msg.sender === 'user' ? <User size={16}/> : <Headset size={16}/>}
                    </div>

                    {/* حباب پیام */}
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${
                        msg.sender === 'user' 
                        ? 'bg-orange-500 text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    }`}>
                        {/* متن پیام */}
                        <p className="whitespace-pre-line">{msg.text}</p>
                        
                        {/* زمان */}
                        <div className={`text-[10px] mt-1 flex items-center gap-1 ${
                            msg.sender === 'user' ? 'text-orange-100 justify-end' : 'text-gray-400 justify-start'
                        }`}>
                            {msg.time}
                            {msg.sender === 'user' && <CheckCircle size={10} />}
                        </div>
                    </div>
                </div>
            </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. ورودی پیام (ثابت پایین) */}
      <div className="bg-white p-3 border-t border-gray-100 fixed bottom-0 w-full max-w-[100vw]">
        <form onSubmit={handleSend} className="container mx-auto max-w-4xl flex items-end gap-2">
            
            <button type="button" className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <Paperclip size={20} />
            </button>

            <div className="flex-1 bg-gray-100 rounded-2xl flex items-center px-4 py-2">
                <textarea 
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="پیام خود را بنویسید..."
                    className="w-full bg-transparent border-none outline-none text-sm max-h-32 min-h-[44px] py-3 resize-none"
                    rows={1}
                />
            </div>

            <button 
                disabled={!reply.trim()}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
            >
                <Send size={20} className="rotate-180" /> {/* آیکون رو برعکس کردم که جهت ارسال درست باشه */}
            </button>
        </form>
      </div>

    </div>
  );
}
