'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import AchievementModal from './AchievementModal';
import type { Achievement } from '@/lib/types';

interface AchievementsGridProps {
  achievements: Achievement[];
  featuredAchievements: Achievement[];
  regularAchievements: Achievement[];
}

export default function AchievementsGrid({ 
  achievements, 
  featuredAchievements, 
  regularAchievements 
}: AchievementsGridProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAchievement(null), 300);
  };

  return (
    <>
      {/* Featured Achievements */}
      {featuredAchievements.length > 0 && (
        <section className="section bg-white">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-3">
                Featured <span className="text-brand-primary">Achievements</span>
              </h2>
              <div className="h-1 w-16 rounded-full bg-brand-primary/70 mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  onClick={() => openModal(achievement)}
                  className="bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-xl p-6 border-2 border-brand-primary/20 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-white">
                    <Image
                      src={achievement.image}
                      alt={achievement.title}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-brand-dark group-hover:text-brand-primary transition-colors">
                      {achievement.title}
                    </h3>
                    <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full flex-shrink-0">
                      Featured
                    </span>
                  </div>
                  {achievement.category && (
                    <p className="text-sm text-brand-primary font-medium mb-2">{achievement.category}</p>
                  )}
                  <p className="text-sm text-brand-muted mb-3 leading-relaxed line-clamp-3">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-brand-muted">
                    {new Date(achievement.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <div className="mt-3 text-sm text-brand-primary font-medium flex items-center gap-1">
                    Click to view details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Achievements */}
      <section className="section bg-brand-light">
        <div className="container max-w-6xl">
          {featuredAchievements.length > 0 && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-3">
                All Achievements
              </h2>
              <div className="h-1 w-16 rounded-full bg-brand-primary/70 mx-auto" />
            </div>
          )}

          {achievements.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-primary/10 mb-6">
                <svg
                  className="w-10 h-10 text-brand-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-brand-dark mb-3">No achievements yet</h3>
              <p className="text-brand-muted max-w-md mx-auto">
                We&apos;re working hard to create meaningful impact. Check back soon for updates on our milestones and achievements.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuredAchievements.length > 0 ? regularAchievements : achievements).map((achievement) => (
                <div
                  key={achievement.id}
                  onClick={() => openModal(achievement)}
                  className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden bg-gray-50">
                    <Image
                      src={achievement.image}
                      alt={achievement.title}
                      fill
                      className="object-contain p-3 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                    {achievement.title}
                  </h3>
                  {achievement.category && (
                    <p className="text-sm text-brand-primary font-medium mb-2">{achievement.category}</p>
                  )}
                  <p className="text-sm text-brand-muted mb-3 leading-relaxed line-clamp-3">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-brand-muted mb-3">
                    {new Date(achievement.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <div className="text-sm text-brand-primary font-medium flex items-center gap-1">
                    Click to view details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <AchievementModal
        achievement={selectedAchievement}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
