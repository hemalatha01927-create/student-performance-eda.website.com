import { useMemo, useState } from 'react';
import type { StudentRecord } from '../data';
import { overallScore, SUBJECTS } from '../data';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface DataTableProps {
  data: StudentRecord[];
}

type SortDir = 'asc' | 'desc' | null;
type SortKey = keyof StudentRecord | 'overall';

export function DataTable({ data }: DataTableProps) {
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const genders = useMemo(() => ['All', ...new Set(data.map((r) => r.Gender))], [data]);

  const columns: { key: SortKey; label: string; numeric: boolean }[] = [
    { key: 'Student_ID', label: 'Student ID', numeric: false },
    { key: 'Name', label: 'Name', numeric: false },
    { key: 'Gender', label: 'Gender', numeric: false },
    { key: 'Maths', label: 'Maths', numeric: true },
    { key: 'Science', label: 'Science', numeric: true },
    { key: 'English', label: 'English', numeric: true },
    { key: 'Attendance', label: 'Attendance', numeric: true },
    { key: 'overall', label: 'Overall', numeric: true },
  ];

  const filtered = useMemo(() => {
    let rows = [...data];
    if (genderFilter !== 'All') {
      rows = rows.filter((r) => r.Gender === genderFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      rows = rows.filter(
        (r) =>
          r.Name.toLowerCase().includes(q) ||
          r.Student_ID.toLowerCase().includes(q) ||
          r.Gender.toLowerCase().includes(q),
      );
    }
    if (sortKey && sortDir) {
      rows.sort((a, b) => {
        let av: number | string;
        let bv: number | string;
        if (sortKey === 'overall') {
          av = overallScore(a);
          bv = overallScore(b);
        } else {
          av = a[sortKey];
          bv = b[sortKey];
        }
        if (typeof av === 'string' && typeof bv === 'string') {
          return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
        }
        return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
      });
    }
    return rows;
  }, [data, search, genderFilter, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else if (sortDir === 'desc') {
        setSortDir(null);
        setSortKey(null);
      } else setSortDir('asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-slate-400 inline ml-1" />;
    if (sortDir === 'asc') return <ArrowUp className="w-3 h-3 text-blue-600 inline ml-1" />;
    if (sortDir === 'desc') return <ArrowDown className="w-3 h-3 text-blue-600 inline ml-1" />;
    return <ArrowUpDown className="w-3 h-3 text-slate-400 inline ml-1" />;
  };

  const scoreColor = (val: number) => {
    if (val >= 85) return 'text-emerald-600 font-semibold';
    if (val >= 65) return 'text-slate-700';
    if (val >= 50) return 'text-amber-600 font-medium';
    return 'text-rose-600 font-medium';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Dataset</h2>
        <p className="text-sm text-slate-500">Complete student records with search, sorting, and gender filtering.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or gender..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {genders.map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  genderFilter === g
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`px-4 py-3 font-semibold text-slate-600 cursor-pointer select-none hover:text-blue-600 transition-colors ${col.numeric ? 'text-right' : 'text-left'}`}
                  >
                    {col.label}
                    <SortIcon col={col.key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8 text-slate-400">
                    No records match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr
                    key={r.Student_ID}
                    className={`border-b border-slate-100 hover:bg-blue-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                  >
                    <td className="px-4 py-3 text-slate-500 font-medium">{r.Student_ID}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{r.Name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        r.Gender === 'Female'
                          ? 'bg-purple-50 text-purple-600'
                          : r.Gender === 'Male'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-slate-100 text-slate-600'
                      }`}>
                        {r.Gender}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right ${scoreColor(r.Maths)}`}>{r.Maths}</td>
                    <td className={`px-4 py-3 text-right ${scoreColor(r.Science)}`}>{r.Science}</td>
                    <td className={`px-4 py-3 text-right ${scoreColor(r.English)}`}>{r.English}</td>
                    <td className={`px-4 py-3 text-right ${scoreColor(r.Attendance)}`}>{r.Attendance}%</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-800">{overallScore(r).toFixed(1)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-400 mt-3">
          Showing {filtered.length} of {data.length} records
        </p>
      </div>
    </div>
  );
}
