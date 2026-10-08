import { useMemo } from 'react';
import type { StudentRecord } from '../data';
import { mean, median, stdDev, SUBJECTS } from '../data';

interface StatisticsProps {
  data: StudentRecord[];
}

type StatRow = {
  metric: string;
  values: Record<string, string>;
};

export function Statistics({ data }: StatisticsProps) {
  const columns = [...SUBJECTS, 'Attendance'] as const;

  const tableData = useMemo<StatRow[]>(() => {
    const cols: Record<string, number[]> = {};
    for (const c of columns) {
      cols[c] = data.map((r) => r[c]);
    }
    const metrics: { label: string; fn: (a: number[]) => number }[] = [
      { label: 'Mean', fn: mean },
      { label: 'Median', fn: median },
      { label: 'Minimum', fn: (a) => (a.length ? Math.min(...a) : 0) },
      { label: 'Maximum', fn: (a) => (a.length ? Math.max(...a) : 0) },
      { label: 'Std Deviation', fn: stdDev },
    ];
    return metrics.map((m) => ({
      metric: m.label,
      values: Object.fromEntries(columns.map((c) => [c, m.fn(cols[c]).toFixed(2)])),
    }));
  }, [data]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Descriptive Statistics</h2>
        <p className="text-sm text-slate-500">Mean, median, min, max, and standard deviation for each subject and attendance.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <th className="text-left px-6 py-4 font-semibold">Metric</th>
                {columns.map((c) => (
                  <th key={c} className="text-center px-6 py-4 font-semibold">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr
                  key={row.metric}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                >
                  <td className="px-6 py-4 font-semibold text-slate-700">{row.metric}</td>
                  {columns.map((c) => (
                    <td key={c} className="text-center px-6 py-4 text-slate-600 font-medium">
                      {row.values[c]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns.map((col, idx) => {
          const row = tableData.find((r) => r.metric === 'Mean')!;
          const meanVal = parseFloat(row.values[col]);
          const gradients = [
            'from-blue-500 to-blue-600',
            'from-purple-500 to-purple-600',
            'from-emerald-500 to-emerald-600',
            'from-amber-500 to-amber-600',
          ];
          return (
            <div key={col} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-fade-in-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold text-white bg-gradient-to-r ${gradients[idx % 4]} mb-3`}>
                {col}
              </div>
              <p className="text-3xl font-bold text-slate-800">{meanVal.toFixed(1)}</p>
              <p className="text-xs text-slate-500 mt-1">Mean score across all students</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
