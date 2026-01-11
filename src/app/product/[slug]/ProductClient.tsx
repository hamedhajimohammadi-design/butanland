'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShoppingCart, Check, Star, Shield, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface ProductClientProps {
  product: any;
}

export default function ProductClient({ product }: ProductClientProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');
  const [selectedImage, setSelectedImage] = useState(product.image?.sourceUrl || '');

  const galleryImages = [
    product.image,
    ...(product.galleryImages?.nodes || [])
  ].filter(img => img?.sourceUrl);

  const price = product.price;
  const regularPrice = product.regularPrice;
  const isOnSale = regularPrice && price !== regularPrice;

  return (
    <div className="bg-white min-h-screen pb-16">
      <div className="container mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight size={16} className="mx-2" />
          <Link href="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  {selectedImage ? (
                     <Image
                      src={selectedImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image Available</div>
                  )}
                </motion.div>
              </AnimatePresence>
              {product.stockStatus === 'OUT_OF_STOCK' && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Sold Out
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {galleryImages.map((img: any, idx: number) => (
                  <button
                    key={`${img.sourceUrl}-${idx}`}
                    onClick={() => setSelectedImage(img.sourceUrl)}
                    className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img.sourceUrl ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img.sourceUrl}
                      alt={img.altText || `Product thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info & Actions */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-yellow-500">
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" className="text-gray-300" />
                </div>
                <span className="text-gray-500 text-sm">(24 reviews)</span>
            </div>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl font-bold text-blue-600">{price}</span>
              {isOnSale && (
                <span className="text-lg text-gray-400 line-through mb-1">{regularPrice}</span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-8 text-sm">
                {product.stockStatus === 'IN_STOCK' ? (
                   <span className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
                        <Check size={16} className="mr-1" /> In Stock
                   </span>
                ) : (
                    <span className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full font-medium">
                        Out of Stock
                   </span>
                )}
            </div>

            {/* Short Description */}
            <div 
                className="prose prose-sm text-gray-600 mb-8 max-w-none"
                dangerouslySetInnerHTML={{ __html: product.shortDescription || '' }} 
            />

            {/* CTA */}
            <div className="flex gap-4 mb-8">
                <button className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200">
                    <ShoppingCart size={20} />
                    Add to Cart
                </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Shield size={20} />
                    </div>
                    <span className="font-medium text-sm">2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <RefreshCw size={20} />
                    </div>
                    <span className="font-medium text-sm">30 Day Returns</span>
                </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Tabs */}
        <div className="border-t border-gray-200 pt-16">
            <div className="flex gap-8 border-b border-gray-200 mb-8">
                <button 
                    onClick={() => setActiveTab('description')}
                    className={`pb-4 text-lg font-medium transition-colors border-b-2 ${
                        activeTab === 'description' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Description
                </button>
                <button 
                    onClick={() => setActiveTab('specifications')}
                    className={`pb-4 text-lg font-medium transition-colors border-b-2 ${
                        activeTab === 'specifications' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Specifications
                </button>
            </div>

            {activeTab === 'description' && (
                 <div 
                    className="prose prose-lg text-gray-600 max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-blue-600"
                    dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available.</p>' }} 
                />
            )}
            
            {activeTab === 'specifications' && (
                <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
                    <p>No specifications available for this product.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
