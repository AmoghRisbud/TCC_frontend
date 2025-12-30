'use client';

import React from 'react';
import Image from 'next/image';
import type { Achievement } from '@/lib/types';

interface AchievementModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementModal({ achievement, isOpen, onClose }: AchievementModalProps) {
  if (!isOpen || !achievement) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative w-full h-72 md:h-96 bg-gray-50 rounded-t-2xl overflow-hidden">
          <Image
            src={achievement.image}
            alt={achievement.title}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-3 mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark flex-1">
              {achievement.title}
            </h2>
            {achievement.featured && (
              <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium flex-shrink-0">
                Featured
              </span>
            )}
          </div>

          {achievement.category && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-brand-primary">
                Category:
              </span>
              <span className="text-sm text-gray-700">
                {achievement.category}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 mb-6 text-sm text-brand-muted">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(achievement.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>

          <div className="prose prose-sm md:prose-base max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {achievement.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
