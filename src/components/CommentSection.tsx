'use client';

import { useState } from 'react';
import { User, Send, MessageSquare, Star, AlertCircle, CheckCircle } from 'lucide-react';

interface Comment {
  databaseId: number;
  content: string;
  date: string;
  author: {
    node: {
      name: string;
      avatar?: {
        url: string;
      };
    };
  };
}

export default function CommentSection({ comments, postId }: { comments: Comment[], postId: number }) {
  const [formData, setFormData] = useState({ name: '', email: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  // 👇 این تابع واقعاً نظر را به وردپرس می‌فرستد
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    const CREATE_COMMENT_MUTATION = `
      mutation CreateComment($author: String!, $authorEmail: String!, $content: String!, $commentOn: Int!) {
        createComment(input: {
          author: $author,
          authorEmail: $authorEmail,
          content: $content,
          commentOn: $commentOn
        }) {
          success
          comment {
            databaseId
            content
            date
          }
        }
      }
    `;

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: CREATE_COMMENT_MUTATION,
          variables: {
            author: formData.name,
            authorEmail: formData.email,
            content: formData.content,
            commentOn: postId // ID عددی پست/محصول که نظر برای آن ثبت می‌شود
          },
        }),
      });

      const json = await res.json();

      if (json.errors) {
        throw new Error(json.errors[0]?.message || 'خطا در ثبت دیدگاه');
      }

      // موفقیت
      setStatus({ 
        type: 'success', 
        message: 'دیدگاه شما با موفقیت ثبت شد و پس از تایید مدیر نمایش داده می‌شود.' 
      });
      setFormData({ name: '', email: '', content: '' }); // خالی کردن فرم

    } catch (error: any) {
      console.error('Comment Error:', error);
      setStatus({ 
        type: 'error', 
        message: 'مشکلی پیش آمد. لطفاً اتصال اینترنت خود را بررسی کنید یا بعداً تلاش کنید.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="comments" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-12 scroll-mt-24">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
        <span className="bg-orange-100 text-orange-600 p-2 rounded-lg">
          <MessageSquare size={24} />
        </span>
        <h3 className="text-2xl font-black text-gray-900">نظرات و پرسش‌ها</h3>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold mr-auto">
          {comments.length} دیدگاه
        </span>
      </div>

      {/* Comment List */}
      <div className="space-y-6 mb-12">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.databaseId} className="flex gap-4 bg-gray-50 p-4 rounded-xl">
              <div className="shrink-0">
                {comment.author.node.avatar?.url ? (
                  <img 
                    src={comment.author.node.avatar.url} 
                    alt={comment.author.node.name} 
                    className="w-10 h-10 rounded-full border border-gray-200" 
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                    <User size={20} />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900 text-sm">{comment.author.node.name}</span>
                  <span className="text-[10px] text-gray-400">{new Date(comment.date).toLocaleDateString('fa-IR')}</span>
                </div>
                <div 
                  className="text-gray-600 text-sm leading-7"
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                />
                {/* ستاره‌های نمایشی (اگر سیستم امتیازدهی واقعی ندارید) */}
                <div className="flex items-center gap-1 mt-2">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                   ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
             <MessageSquare className="mx-auto text-gray-300 mb-2" size={32} />
             <p className="text-gray-500 text-sm">اولین نفری باشید که نظر می‌دهید!</p>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-4">ارسال دیدگاه جدید</h4>
        
        {status.type === 'success' && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4 border border-green-200">
            <CheckCircle size={16} /> {status.message}
          </div>
        )}
        
        {status.type === 'error' && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4 border border-red-200">
            <AlertCircle size={16} /> {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="نام شما" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500 transition focus:shadow-sm"
            />
            <input 
              type="email" 
              placeholder="ایمیل (نمایش داده نمی‌شود)" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500 transition focus:shadow-sm"
            />
          </div>
          <textarea 
            rows={4} 
            placeholder="دیدگاه یا سوال خود را بنویسید..." 
            required
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500 transition resize-none focus:shadow-sm"
          ></textarea>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-orange-700 transition flex items-center gap-2 mr-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
          >
            {isSubmitting ? 'در حال ارسال...' : 'ارسال دیدگاه'}
            <Send size={16} className={isSubmitting ? 'hidden' : 'block'} />
          </button>
        </form>
      </div>

    </div>
  );
}