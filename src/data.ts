export interface StudentRecord {
  Student_ID: string;
  Name: string;
  Gender: string;
  Maths: number;
  Science: number;
  English: number;
  Attendance: number;
}

export const defaultDataset: StudentRecord[] = [
  { Student_ID: 'S001', Name: 'Hema', Gender: 'Female', Maths: 85, Science: 90, English: 88, Attendance: 92 },
  { Student_ID: 'S002', Name: 'Arun', Gender: 'Male', Maths: 65, Science: 70, English: 68, Attendance: 80 },
  { Student_ID: 'S003', Name: 'Priya', Gender: 'Female', Maths: 92, Science: 95, English: 90, Attendance: 96 },
  { Student_ID: 'S004', Name: 'Ravi', Gender: 'Male', Maths: 55, Science: 60, English: 58, Attendance: 72 },
  { Student_ID: 'S005', Name: 'Anu', Gender: 'Female', Maths: 78, Science: 82, English: 80, Attendance: 88 },
  { Student_ID: 'S006', Name: 'Kumar', Gender: 'Male', Maths: 72, Science: 75, English: 70, Attendance: 84 },
  { Student_ID: 'S007', Name: 'Divya', Gender: 'Female', Maths: 88, Science: 91, English: 85, Attendance: 94 },
  { Student_ID: 'S008', Name: 'Rahul', Gender: 'Male', Maths: 48, Science: 55, English: 52, Attendance: 65 },
  { Student_ID: 'S009', Name: 'Sneha', Gender: 'Female', Maths: 95, Science: 93, English: 97, Attendance: 98 },
  { Student_ID: 'S010', Name: 'Vijay', Gender: 'Male', Maths: 68, Science: 73, English: 65, Attendance: 78 },
];

export const SUBJECTS = ['Maths', 'Science', 'English'] as const;
export type Subject = (typeof SUBJECTS)[number];

export function overallScore(r: StudentRecord): number {
  return (r.Maths + r.Science + r.English) / 3;
}

export function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

export function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function stdDev(arr: number[]): number {
  if (arr.length === 0) return 0;
  const m = mean(arr);
  const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

export function pearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0;
  const mx = mean(x);
  const my = mean(y);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < x.length; i++) {
    num += (x[i] - mx) * (y[i] - my);
    dx += (x[i] - mx) ** 2;
    dy += (y[i] - my) ** 2;
  }
  const denom = Math.sqrt(dx * dy);
  return denom === 0 ? 0 : num / denom;
}

export function parseCSV(text: string): StudentRecord[] {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  const rows: StudentRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',').map((c) => c.trim());
    const get = (key: string) => {
      const idx = headers.findIndex((h) => h.toLowerCase() === key.toLowerCase());
      return idx >= 0 ? cells[idx] : '';
    };
    const record: StudentRecord = {
      Student_ID: get('Student_ID') || `S${String(i).padStart(3, '0')}`,
      Name: get('Name') || 'Unknown',
      Gender: get('Gender') || 'Unknown',
      Maths: parseFloat(get('Maths')) || 0,
      Science: parseFloat(get('Science')) || 0,
      English: parseFloat(get('English')) || 0,
      Attendance: parseFloat(get('Attendance')) || 0,
    };
    rows.push(record);
  }
  return rows;
}
