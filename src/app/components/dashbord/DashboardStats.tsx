import { useMemo } from 'react';
import { Credential } from '@/types';
import { FiAward, FiCheckSquare, FiStar } from 'react-icons/fi';

type DashboardStatsProps = {
  credentials: Credential[];
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <div className="bg-gray-800 p-4 rounded-lg flex items-center">
    <div className="p-3 bg-gray-700 rounded-lg mr-4">{icon}</div>
    <div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  </div>
);

export const DashboardStats = ({ credentials }: DashboardStatsProps) => {
  const stats = useMemo(() => {
    const total = credentials.length;
    
    // FIX: Changed 'c.verified' to check for the correct status
    const verified = credentials.filter(c => c.status === 'Verified').length;
    
    const skillCounts = credentials
      .flatMap(c => c.skills)
      .reduce((acc, skill) => {
        acc[skill] = (acc[skill] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([skill]) => skill)
      .join(', ');

    return { total, verified, topSkills: topSkills || 'N/A' };
  }, [credentials]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard icon={<FiAward size={24} className="text-blue-400" />} label="Total Credentials" value={stats.total} />
      <StatCard icon={<FiCheckSquare size={24} className="text-green-400" />} label="Verified Credentials" value={stats.verified} />
      <StatCard icon={<FiStar size={24} className="text-yellow-400" />} label="Top Skills" value={stats.topSkills} />
    </div>
  );
};