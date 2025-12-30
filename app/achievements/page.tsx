import { getAchievements } from '../../lib/content';
import AchievementsGrid from './AchievementsGrid';

export const metadata = { title: 'Achievements | TCC' };
export const dynamic = 'force-dynamic';

export default async function AchievementsPage() {
  const achievements = await getAchievements();

  // Separate featured and regular achievements
  const featuredAchievements = achievements.filter(a => a.featured);
  const regularAchievements = achievements.filter(a => !a.featured);

  return (
    <div>
      {/* Hero */}
      <section 
        className="relative section bg-brand-hero text-white overflow-hidden"
        style={{
          backgroundImage: 'url(/images/achievements-collab.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-brand-primary/80"></div>
        <div className="container text-center max-w-3xl mx-auto relative z-10">
          <h1 className="h1 mb-4">Our Achievements</h1>
          <p className="text-lg text-white/85 leading-relaxed mx-auto">
            Celebrating milestones, awards, and recognition that mark our journey in legal education and community impact.
          </p>
        </div>
      </section>

      {/* Achievements Grid with Modal */}
      <AchievementsGrid 
        achievements={achievements}
        featuredAchievements={featuredAchievements}
        regularAchievements={regularAchievements}
      />
    </div>
  );
}
