import { useMemo } from 'react';
import type { StudentRecord } from '../data';
import { mean, overallScore, pearsonCorrelation, SUBJECTS } from '../data';
import { Award, TrendingDown, TrendingUp, Users, Calendar, Lightbulb, BarChart2, GitCompare } from 'lucide-react';

interface InsightsProps {
  data: StudentRecord[];
}

function InsightCard({
  icon: Icon,
  title,
  value,
  detail,
  gradient,
}: {
  icon: typeof Award;
  title: string;
  value: string;
  detail?: string;
  gradient: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 animate-fade-in-up">
      <div className={`w-11 h-11 rounded-xl ${gradient} flex items-center justify-center mb-3 shadow-sm`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-xs text-slate-500 font-medium mb-1">{title}</p>
      <p className="text-xl font-bold text-slate-800">{value}</p>
      {detail && <p className="text-xs text-slate-500 mt-1">{detail}</p>}
    </div>
  );
}

export function Insights({ data }: InsightsProps) {
  const insights = useMemo(() => {
    if (data.length === 0) return null;

    const subjectAvgs = SUBJECTS.map((s) => ({ subject: s, avg: mean(data.map((r) => r[s])) }));
    const highestSub = subjectAvgs.reduce((a, b) => (a.avg > b.avg ? a : b));
    const lowestSub = subjectAvgs.reduce((a, b) => (a.avg < b.avg ? a : b));

    const avgAttendance = mean(data.map((r) => r.Attendance));
    const overallAvg = mean(data.map((r) => overallScore(r)));

    let topStudent = data[0];
    let topScore = overallScore(topStudent);
    for (const r of data) {
      const s = overallScore(r);
      if (s > topScore) {
        topScore = s;
        topStudent = r;
      }
    }

    const aboveAvg = data.filter((r) => overallScore(r) > overallAvg).length;

    const corr = pearsonCorrelation(
      data.map((r) => r.Attendance),
      data.map((r) => overallScore(r)),
    );

    const highAtt = data.filter((r) => r.Attendance >= avgAttendance);
    const lowAtt = data.filter((r) => r.Attendance < avgAttendance);
    const highAttAvg = highAtt.length > 0 ? mean(highAtt.map((r) => overallScore(r))) : 0;
    const lowAttAvg = lowAtt.length > 0 ? mean(lowAtt.map((r) => overallScore(r))) : 0;

    let corrLabel = 'weak';
    if (corr > 0.7) corrLabel = 'strong positive';
    else if (corr > 0.3) corrLabel = 'moderate positive';
    else if (corr < -0.3) corrLabel = 'negative';

    return {
      highestSub,
      lowestSub,
      avgAttendance,
      overallAvg,
      topStudent,
      topScore,
      aboveAvg,
      total: data.length,
      corr,
      corrLabel,
      highAttAvg,
      lowAttAvg,
    };
  }, [data]);

  if (!insights) {
    return (
      <div className="text-center py-12 text-slate-400">No data available to generate insights.</div>
    );
  }

  const findings = [
    {
      icon: TrendingUp,
      title: `Highest Performing Subject: ${insights.highestSub.subject}`,
      text: `The highest average score is in ${insights.highestSub.subject} at ${insights.highestSub.avg.toFixed(1)}, suggesting students perform best in this subject.`,
      gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    },
    {
      icon: TrendingDown,
      title: `Lowest Performing Subject: ${insights.lowestSub.subject}`,
      text: `The lowest average score is in ${insights.lowestSub.subject} at ${insights.lowestSub.avg.toFixed(1)}, indicating this area may need additional focus.`,
      gradient: 'bg-gradient-to-br from-rose-500 to-rose-600',
    },
    {
      icon: Calendar,
      title: `Average Attendance: ${insights.avgAttendance.toFixed(1)}%`,
      text: `The class has an average attendance of ${insights.avgAttendance.toFixed(1)}%. Students with attendance above this average score ${insights.highAttAvg.toFixed(1)} on average, while those below score ${insights.lowAttAvg.toFixed(1)}.`,
      gradient: 'bg-gradient-to-br from-amber-500 to-amber-600',
    },
    {
      icon: Award,
      title: `Highest Scoring Student: ${insights.topStudent.Name}`,
      text: `${insights.topStudent.Name} (${insights.topStudent.Student_ID}) achieved the highest overall score of ${insights.topScore.toFixed(1)} with ${insights.topStudent.Attendance}% attendance.`,
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      icon: Users,
      title: `Students Above Average: ${insights.aboveAvg} out of ${insights.total}`,
      text: `${insights.aboveAvg} out of ${insights.total} students scored above the overall average of ${insights.overallAvg.toFixed(1)}, meaning ${((insights.aboveAvg / insights.total) * 100).toFixed(0)}% of the class is above average.`,
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
    {
      icon: GitCompare,
      title: `Attendance–Performance Correlation: r = ${insights.corr.toFixed(3)}`,
      text:
        insights.corr > 0.5
          ? 'Students with higher attendance generally show better performance. This indicates a strong positive relationship between attending classes and academic results.'
          : insights.corr > 0.2
            ? 'There is a moderate positive relationship between attendance and performance. Students who attend more classes tend to score higher.'
            : 'There is a weak relationship between attendance and performance. Other factors may be influencing student scores.',
      gradient: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">EDA Insights</h2>
        <p className="text-sm text-slate-500">Automatically generated findings from the dataset analysis.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InsightCard
          icon={Award}
          title="Top Subject"
          value={insights.highestSub.subject}
          detail={`Avg: ${insights.highestSub.avg.toFixed(1)}`}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <InsightCard
          icon={TrendingDown}
          title="Weakest Subject"
          value={insights.lowestSub.subject}
          detail={`Avg: ${insights.lowestSub.avg.toFixed(1)}`}
          gradient="bg-gradient-to-br from-rose-500 to-rose-600"
        />
        <InsightCard
          icon={Users}
          title="Top Student"
          value={insights.topStudent.Name}
          detail={`Score: ${insights.topScore.toFixed(1)}`}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <InsightCard
          icon={BarChart2}
          title="Above Average"
          value={`${insights.aboveAvg} / ${insights.total}`}
          detail={`${((insights.aboveAvg / insights.total) * 100).toFixed(0)}% of class`}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <InsightCard
          icon={Calendar}
          title="Avg Attendance"
          value={`${insights.avgAttendance.toFixed(1)}%`}
          gradient="bg-gradient-to-br from-amber-500 to-amber-600"
        />
        <InsightCard
          icon={GitCompare}
          title="Correlation (r)"
          value={insights.corr.toFixed(3)}
          detail={insights.corrLabel}
          gradient="bg-gradient-to-br from-cyan-500 to-cyan-600"
        />
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-3">Key Findings</h3>
        <div className="space-y-3">
          {findings.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex gap-4 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${f.gradient} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 mb-0.5">{f.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 animate-fade-in-up">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-lg mb-1">Summary</p>
            <p className="text-sm text-white/90 leading-relaxed">
              The analysis of {insights.total} students shows that {insights.highestSub.subject} is the strongest subject (avg {insights.highestSub.avg.toFixed(1)}),
              while {insights.lowestSub.subject} needs the most improvement (avg {insights.lowestSub.avg.toFixed(1)}).
              {insights.corr > 0.3
                ? ' Attendance has a positive correlation with academic performance — students who attend class regularly tend to achieve higher scores.'
                : ' Attendance does not strongly correlate with performance, suggesting other factors influence student outcomes.'}
              {' '}{insights.topStudent.Name} is the top performer with an overall score of {insights.topScore.toFixed(1)}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
