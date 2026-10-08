import { BarChart3, GraduationCap, LayoutDashboard, Table2, TrendingUp, Upload } from 'lucide-react';

export type TabId = 'dashboard' | 'statistics' | 'charts' | 'dataset' | 'insights';

interface NavigationProps {
  active: TabId;
  onNavigate: (tab: TabId) => void;
  onUploadClick: () => void;
}

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  { id: 'charts', label: 'Charts', icon: TrendingUp },
  { id: 'dataset', label: 'Dataset', icon: Table2 },
  { id: 'insights', label: 'EDA Insights', icon: GraduationCap },
];

export function Navigation({ active, onNavigate, onUploadClick }: NavigationProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 leading-tight hidden sm:block">
                Student Performance
              </h1>
              <p className="text-xs text-slate-500 leading-tight hidden sm:block">EDA Dashboard</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigate(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <button
            onClick={onUploadClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02]"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload CSV</span>
          </button>
        </div>

        <nav className="lg:hidden flex items-center gap-1 overflow-x-auto scrollbar-thin pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
