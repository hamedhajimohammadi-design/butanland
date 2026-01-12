'use client';

import React from 'react';
import { Star, CheckCircle, User, MapPin, Wrench, MessageSquare } from 'lucide-react';
import Image from 'next/image';

// Adjust based on your actual API response structure
export interface Technician {
  id: number;
  name: string;
  avatar_url?: string; 
  // Depending on how WP exposes it (usually avatar_urls object, but let's map it before passing here or handle it)
  meta: {
    city: string;
    expertise: string[];
    rating: number;
    reviews_count?: number;
    is_verified: boolean;
    technician_status: 'available' | 'busy';
  };
}

interface TechnicianCardProps {
  technician: Technician;
  onRequest: (tech: Technician) => void;
}

export default function TechnicianCard({ technician, onRequest }: TechnicianCardProps) {
  const isAvailable = technician.meta.technician_status === 'available';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
      
      {/* Verification Badge (Absolute) */}
      {technician.meta.is_verified && (
        <div className="absolute top-0 left-0 bg-blue-50 text-blue-600 px-3 py-1 rounded-br-2xl text-xs font-bold flex items-center gap-1 z-10">
          <CheckCircle size={14} className="fill-blue-600 text-white" />
          تایید شده
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
            {technician.avatar_url ? (
                <Image 
                src={technician.avatar_url} 
                alt={technician.name} 
                width={64} 
                height={64} 
                className="object-cover"
                />
            ) : (
                <User className="w-full h-full p-3 text-gray-400" />
            )}
            </div>
            {/* Status Dot */}
            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`} title={isAvailable ? 'در دسترس' : 'مشغول'} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="font-bold text-gray-900 truncate pr-1">{technician.name}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin size={12} />
                  {technician.meta.city || 'نامشخص'}
                </div>
             </div>
             
             {/* Rating */}
             {technician.meta.rating > 0 && (
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <span className="text-xs font-bold text-yellow-700">{technician.meta.rating.toFixed(1)}</span>
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    </div>
                    {technician.meta.reviews_count ? (
                       <div className="flex items-center gap-1 text-[10px] text-gray-400">
                           <MessageSquare size={12} />
                           <span>({technician.meta.reviews_count})</span>
                       </div>
                    ) : null}
                </div>
             )}
          </div>

          {/* Expertise Tags */}
          <div className="mt-3 flex flex-wrap gap-1">
            {technician.meta.expertise && technician.meta.expertise.slice(0, 3).map((exp, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 text-[10px] border border-gray-100">
                    <Wrench size={10} className="text-gray-400" /> {exp}
                </span>
            ))}
            {(technician.meta.expertise?.length || 0) > 3 && (
                <span className="text-[10px] text-gray-400 flex items-center px-1">+{technician.meta.expertise.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-5">
        <button 
          onClick={() => onRequest(technician)}
          className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-orange-600 transition-colors shadow-lg shadow-gray-200 hover:shadow-orange-200"
        >
          درخواست سرویس
        </button>
      </div>

    </div>
  );
}
