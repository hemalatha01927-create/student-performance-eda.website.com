import { useEffect, useMemo, useRef } from 'react';
import Chart from 'chart.js/auto';
import type { StudentRecord } from '../data';
import { mean, overallScore, pearsonCorrelation, SUBJECTS } from '../data';

interface ChartsProps {
  data: StudentRecord[];
}

const COLORS = {
  blue: '#3b82f6',
  blueBg: 'rgba(59, 130, 246, 0.6)',
  purple: '#8b5cf6',
  purpleBg: 'rgba(139, 92, 246, 0.6)',
  emerald: '#10b981',
  emeraldBg: 'rgba(16, 185, 129, 0.6)',
  amber: '#f59e0b',
  amberBg: 'rgba(245, 158, 11, 0.6)',
  rose: '#f43f5e',
  roseBg: 'rgba(244, 63, 94, 0.6)',
};

function makeHistogram(values: number[], binCount = 5): { labels: string[]; counts: number[] } {
  if (values.length === 0) return { labels: [], counts: [] };
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return { labels: [`${min}`], counts: [values.length] };
  const binSize = (max - min) / binCount;
  const bins: number[] = new Array(binCount).fill(0);
  const labels: string[] = [];
  for (let i = 0; i < binCount; i++) {
    const lo = min + i * binSize;
    const hi = lo + binSize;
    labels.push(`${Math.round(lo)}–${Math.round(hi)}`);
  }
  for (const v of values) {
    let idx = Math.floor((v - min) / binSize);
    if (idx >= binCount) idx = binCount - 1;
    bins[idx]++;
  }
  return { labels, counts: bins };
}

const baseOpts = (yTitle: string, xTitle: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      padding: 12,
      cornerRadius: 8,
      titleFont: { size: 13, weight: 'bold' as const },
      bodyFont: { size: 12 },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: { display: true, text: yTitle, font: { size: 12, weight: 500 as const } },
      grid: { color: 'rgba(226, 232, 240, 0.6)' },
      ticks: { font: { size: 11 } },
    },
    x: {
      title: { display: true, text: xTitle, font: { size: 12, weight: 500 as const } },
      grid: { display: false },
      ticks: { font: { size: 11 } },
    },
  },
});

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-fade-in-up">
      <h3 className="text-base font-bold text-slate-800 mb-0.5">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 mb-4">{subtitle}</p>}
      <div className="h-64">{children}</div>
    </div>
  );
}

export function Charts({ data }: ChartsProps) {
  const chartsRef = useRef<Chart[]>([]);

  const chartConfigs = useMemo(() => {
    const histograms = SUBJECTS.map((s) => makeHistogram(data.map((r) => r[s])));
    const attHist = makeHistogram(data.map((r) => r.Attendance));

    const subjectAvgs = SUBJECTS.map((s) => mean(data.map((r) => r[s])));
    const subjectColors = [COLORS.blueBg, COLORS.purpleBg, COLORS.emeraldBg];

    const genders = [...new Set(data.map((r) => r.Gender))];
    const genderData = genders.map((g) => {
      const filtered = data.filter((r) => r.Gender === g);
      return SUBJECTS.map((s) => mean(filtered.map((r) => r[s])));
    });
    const genderColors = [COLORS.blueBg, COLORS.purpleBg, COLORS.emeraldBg, COLORS.amberBg];

    const scatterData = data.map((r) => ({ x: r.Attendance, y: overallScore(r) }));

    const corr = pearsonCorrelation(
      data.map((r) => r.Attendance),
      data.map((r) => overallScore(r)),
    );

    return { histograms, attHist, subjectAvgs, subjectColors, genders, genderData, genderColors, scatterData, corr };
  }, [data]);

  useEffect(() => {
    chartsRef.current.forEach((c) => c.destroy());
    chartsRef.current = [];

    const { histograms, attHist, subjectAvgs, subjectColors, genders, genderData, genderColors, scatterData, corr } = chartConfigs;

    const histMeta = [
      { id: 'mathsHist', label: 'Maths', data: histograms[0], color: COLORS.blueBg, border: COLORS.blue },
      { id: 'scienceHist', label: 'Science', data: histograms[1], color: COLORS.purpleBg, border: COLORS.purple },
      { id: 'englishHist', label: 'English', data: histograms[2], color: COLORS.emeraldBg, border: COLORS.emerald },
      { id: 'attHist', label: 'Attendance', data: attHist, color: COLORS.amberBg, border: COLORS.amber },
    ];

    for (const h of histMeta) {
      const canvas = document.getElementById(h.id) as HTMLCanvasElement | null;
      if (!canvas) continue;
      chartsRef.current.push(
        new Chart(canvas, {
          type: 'bar',
          data: {
            labels: h.data.labels,
            datasets: [{ label: `${h.label} Distribution`, data: h.data.counts, backgroundColor: h.color, borderColor: h.border, borderWidth: 1.5, borderRadius: 6 }],
          },
          options: baseOpts('Number of Students', `${h.label} Score Range`),
        }),
      );
    }

    const subjCanvas = document.getElementById('subjectAvg') as HTMLCanvasElement | null;
    if (subjCanvas) {
      chartsRef.current.push(
        new Chart(subjCanvas, {
          type: 'bar',
          data: {
            labels: [...SUBJECTS],
            datasets: [{ label: 'Average Score', data: subjectAvgs, backgroundColor: subjectColors, borderRadius: 8, borderWidth: 0 }],
          },
          options: { ...baseOpts('Average Score', 'Subject'), plugins: { ...baseOpts('', '').plugins, legend: { display: false } } },
        }),
      );
    }

    const genderCanvas = document.getElementById('genderCompare') as HTMLCanvasElement | null;
    if (genderCanvas) {
      chartsRef.current.push(
        new Chart(genderCanvas, {
          type: 'bar',
          data: {
            labels: [...SUBJECTS],
            datasets: genders.map((g, i) => ({
              label: g,
              data: genderData[i],
              backgroundColor: genderColors[i % genderColors.length],
              borderRadius: 6,
            })),
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' as const, labels: { font: { size: 12 }, usePointStyle: true, pointStyle: 'circle' as const } },
              tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', padding: 12, cornerRadius: 8 },
            },
            scales: {
              y: { beginAtZero: true, title: { display: true, text: 'Average Score', font: { size: 12 } }, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
              x: { grid: { display: false } },
            },
          },
        }),
      );
    }

    const scatterCanvas = document.getElementById('scatterChart') as HTMLCanvasElement | null;
    if (scatterCanvas) {
      chartsRef.current.push(
        new Chart(scatterCanvas, {
          type: 'scatter',
          data: {
            datasets: [
              {
                label: 'Students',
                data: scatterData,
                backgroundColor: 'rgba(139, 92, 246, 0.6)',
                borderColor: COLORS.purple,
                pointRadius: 6,
                pointHoverRadius: 8,
              },
              {
                label: `Trend (r = ${corr.toFixed(2)})`,
                type: 'line' as const,
                data: scatterData
                  .slice()
                  .sort((a, b) => a.x - b.x)
                  .map((p) => ({ x: p.x, y: p.y })),
                borderColor: COLORS.blue,
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                tension: 0.3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' as const, labels: { font: { size: 12 }, usePointStyle: true, pointStyle: 'circle' as const } },
              tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                  label: (ctx: any) => `Attendance: ${ctx.parsed.x}% — Score: ${ctx.parsed.y.toFixed(1)}`,
                },
              },
            },
            scales: {
              y: { title: { display: true, text: 'Overall Score', font: { size: 12 } }, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
              x: { title: { display: true, text: 'Attendance (%)', font: { size: 12 } }, grid: { color: 'rgba(226, 232, 240, 0.4)' } },
            },
          },
        }),
      );
    }

    return () => {
      chartsRef.current.forEach((c) => c.destroy());
      chartsRef.current = [];
    };
  }, [chartConfigs]);

  const { corr } = chartConfigs;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Charts & Visualizations</h2>
        <p className="text-sm text-slate-500">Data distribution, comparison analysis, and correlation between attendance and performance.</p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-3">Data Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard title="Maths Score Distribution" subtitle="Frequency of students across score ranges">
            <canvas id="mathsHist" />
          </ChartCard>
          <ChartCard title="Science Score Distribution" subtitle="Frequency of students across score ranges">
            <canvas id="scienceHist" />
          </ChartCard>
          <ChartCard title="English Score Distribution" subtitle="Frequency of students across score ranges">
            <canvas id="englishHist" />
          </ChartCard>
          <ChartCard title="Attendance Distribution" subtitle="Frequency of students across attendance ranges">
            <canvas id="attHist" />
          </ChartCard>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-3">Comparison Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Subject Average Comparison" subtitle="Average scores across all subjects">
            <canvas id="subjectAvg" />
          </ChartCard>
          <ChartCard title="Gender Performance Comparison" subtitle="Average scores by gender across subjects">
            <canvas id="genderCompare" />
          </ChartCard>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-3">Correlation Analysis</h3>
        <ChartCard title="Attendance vs Overall Score" subtitle="Scatter plot showing the relationship between attendance and performance">
          <canvas id="scatterChart" />
        </ChartCard>
        <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-slate-700">
            <span className="font-bold text-blue-700">Correlation coefficient (r) = {corr.toFixed(3)}</span>
            {' — '}
            {corr > 0.7
              ? 'Students with higher attendance generally show better performance.'
              : corr > 0.3
                ? 'There is a moderate positive relationship between attendance and performance.'
                : corr > -0.3
                  ? 'There is a weak relationship between attendance and performance.'
                  : 'There is a negative relationship between attendance and performance.'}
          </p>
        </div>
      </div>
    </div>
  );
}
