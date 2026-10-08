import { GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Student Performance EDA Dashboard</p>
          </div>
          <p className="text-sm text-slate-500">
            AI &amp; Machine Learning – Exploratory Data Analysis
          </p>
        </div>
      </div>
    </footer>
  );
}
