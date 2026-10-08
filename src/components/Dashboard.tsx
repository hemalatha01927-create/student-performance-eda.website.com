import { useMemo } from 'react';
import type { StudentRecord } from '../data';
import { mean, overallScore, SUBJECTS } from '../data';
import { Users, Award, TrendingDown, Calendar, Target } from 'lucide-react';

interface DashboardProps {
  data: StudentRecord[];
}

function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  gradient: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 animate-fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center shadow-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  );
}

export function Dashboard({ data }: DashboardProps) {
  const stats = useMemo(() => {
    if (data.length === 0) {
      return { total: 0, avg: '0', highest: '0', lowest: '0', att: '0' };
    }
    const allScores: number[] = [];
    data.forEach((r) => {
      allScores.push(r.Maths, r.Science, r.English);
    });
    const allOveralls = data.map((r) => overallScore(r));
    return {
      total: data.length,
      avg: mean(allOveralls).toFixed(1),
      highest: Math.max(...allOveralls).toFixed(1),
      lowest: Math.min(...allOveralls).toFixed(1),
      att: mean(data.map((r) => r.Attendance)).toFixed(1),
    };
  }, [data]);

  const topStudent = useMemo(() => {
    if (data.length === 0) return null;
    let best = data[0];
    let bestScore = overallScore(best);
    for (const r of data) {
      const s = overallScore(r);
      if (s > bestScore) {
        bestScore = s;
        best = r;
      }
    }
    return { name: best.Name, score: bestScore.toFixed(1), attendance: best.Attendance };
  }, [data]);

  const subjectAverages = useMemo(
    () => SUBJECTS.map((s) => ({ subject: s, avg: mean(data.map((r) => r[s])) })),
    [data],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Dashboard Overview</h2>
        <p className="text-sm text-slate-500">A quick summary of the student performance dataset.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total Students" value={String(stats.total)} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
        <StatCard icon={Target} label="Average Score" value={stats.avg} gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
        <StatCard icon={Award} label="Highest Score" value={stats.highest} gradient="bg-gradient-to-br from-emerald-500 to-emerald-600" />
        <StatCard icon={TrendingDown} label="Lowest Score" value={stats.lowest} gradient="bg-gradient-to-br from-rose-500 to-rose-600" />
        <StatCard icon={Calendar} label="Avg Attendance" value={`${stats.att}%`} gradient="bg-gradient-to-br from-amber-500 to-amber-600" />
      </div>

      {topStudent && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium">Top Performing Student</p>
                <p className="text-2xl font-bold">{topStudent.name}</p>
                <p className="text-white/80 text-sm mt-0.5">
                  Score: {topStudent.score} &middot; Attendance: {topStudent.attendance}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-fade-in-up">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Subject Averages at a Glance</h3>
        <div className="space-y-4">
          {subjectAverages.map((s) => (
            <div key={s.subject}>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-700">{s.subject}</span>
                <span className="text-sm font-bold text-slate-800">{s.avg.toFixed(1)}</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
                  style={{ width: `${s.avg}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
