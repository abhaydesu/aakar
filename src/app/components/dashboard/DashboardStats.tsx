import { useMemo } from 'react';
import { Credential } from '@/types';
import { FiAward, FiCheckSquare, FiStar } from 'react-icons/fi';

type DashboardStatsProps = {
  credentials: Credential[];
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-transparent">
    <div className="p-3 bg-green-100 rounded-lg text-neutral-900">
      {icon}
    </div>
    <div>
      <div className="text-2xl md:text-3xl font-extrabold text-neutral-900">{value}</div>
      <div className="text-sm text-neutral-600">{label}</div>
    </div>
  </div>
);

export const DashboardStats = ({ credentials }: DashboardStatsProps) => {
  const stats = useMemo(() => {
    const total = credentials.length;

    const verified = credentials.filter((c) => c.status === 'Verified').length;

    const skillCounts = credentials
      .flatMap((c) => c.skills ?? [])
      .reduce((acc: Record<string, number>, skill) => {
        acc[skill] = (acc[skill] || 0) + 1;
        return acc;
      }, {});

    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([skill]) => skill)
      .join(', ');

    return { total, verified, topSkills: topSkills || 'N/A' };
  }, [credentials]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard icon={<FiAward size={20} />} label="Total Credentials" value={stats.total} />
      <StatCard icon={<FiCheckSquare size={20} />} label="Verified Credentials" value={stats.verified} />
      <StatCard icon={<FiStar size={20} />} label="Top Skills" value={stats.topSkills} />
    </div>
  );
};
