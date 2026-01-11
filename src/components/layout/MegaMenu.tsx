'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, ChevronLeft } from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  parentId: string | null;
  childItems: { nodes: MenuItem[] };
}

interface MegaMenuProps {
  items: MenuItem[];
}

export default function MegaMenu({ items }: MegaMenuProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);

  // Filter root items
  const rootItems = items.filter((item) => !item.parentId);

  const toggleMobileItem = (id: string) => {
    setExpandedMobileItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <nav className="w-full" onMouseLeave={() => setActiveItem(null)}>
      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center justify-start gap-8 h-full">
        {rootItems.map((item) => (
          <div
            key={item.id}
            className="group h-full flex items-center"
            onMouseEnter={() => setActiveItem(item.id)}
          >
            <Link
              href={item.path}
              className={`text-sm font-medium transition-colors py-4 border-b-2 border-transparent hover:border-blue-600 flex items-center gap-1 ${
                activeItem === item.id ? 'text-blue-600 border-blue-600' : 'text-gray-700'
              }`}
            >
              {item.label}
              {item.childItems.nodes.length > 0 && <ChevronDown size={14} />}
            </Link>

            {/* Desktop Mega Dropdown */}
            <AnimatePresence>
              {activeItem === item.id && item.childItems.nodes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-full w-full bg-white shadow-xl border-t border-gray-100 py-8 z-50"
                  onMouseEnter={() => setActiveItem(item.id)}
                  onMouseLeave={() => setActiveItem(null)}
                >
                  <div className="container mx-auto px-4">
                    <div className="grid grid-cols-4 gap-8">
                      {item.childItems.nodes.map((subItem) => (
                        <div key={subItem.id} className="flex flex-col gap-3">
                          <Link
                            href={subItem.path}
                            className="font-bold text-gray-900 hover:text-blue-600 mb-2 block"
                          >
                            {subItem.label}
                          </Link>
                          {subItem.childItems.nodes.length > 0 && (
                            <ul className="space-y-2">
                              {subItem.childItems.nodes.map((grandChild) => (
                                <li key={grandChild.id}>
                                  <Link
                                    href={grandChild.path}
                                    className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                                  >
                                    {grandChild.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Mobile Trigger Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 -mr-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer (RTL Friendly) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white z-50 shadow-2xl overflow-y-auto lg:hidden"
            >
              <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <span className="font-bold text-lg">منو</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4">
                <ul className="flex flex-col space-y-2">
                  {rootItems.map((item) => (
                    <li key={item.id} className="border-b border-gray-50 last:border-0 pb-2">
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="py-2 text-gray-800 font-medium block flex-1"
                        >
                          {item.label}
                        </Link>
                        {item.childItems.nodes.length > 0 && (
                          <button
                            onClick={() => toggleMobileItem(item.id)}
                            className="p-2 text-gray-400"
                          >
                           <ChevronDown 
                              size={16} 
                              className={`transition-transform duration-200 ${expandedMobileItems.includes(item.id) ? 'rotate-180' : ''}`}
                           />
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {expandedMobileItems.includes(item.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-gray-50 rounded-lg px-3"
                          >
                            <ul className="py-2 space-y-3">
                              {item.childItems.nodes.map((subItem) => (
                                <li key={subItem.id}>
                                    <div className="font-medium text-sm text-gray-700 mb-1">
                                        <Link href={subItem.path} onClick={() => setMobileMenuOpen(false)}>
                                            {subItem.label}
                                        </Link>
                                    </div>
                                    {subItem.childItems.nodes.length > 0 && (
                                        <ul className="mr-3 border-r-2 border-gray-200 pr-3 space-y-2 mt-2">
                                            {subItem.childItems.nodes.map(grandChild => (
                                                 <li key={grandChild.id}>
                                                     <Link 
                                                        href={grandChild.path}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="text-sm text-gray-500 block py-1"
                                                     >
                                                        {grandChild.label}
                                                     </Link>
                                                 </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
