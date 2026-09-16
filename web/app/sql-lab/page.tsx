'use client';
import { useState, useCallback, useRef } from 'react';
import { Play, ChevronRight, Database, BookOpen, Zap } from 'lucide-react';
import SqlBlock from '@/components/SqlBlock';
import QueryResult from '@/components/QueryResult';
import { executeQuery, type QueryResult as QR } from '@/lib/sql-engine';

const queryLibrary = [
  {
    category: 'Static Queries',
    color: 'blue',
    queries: [
      {
        name: 'All Students',
        tag: 'STATIC',
        desc: 'View the complete student roster.',
        sql: `SELECT student_id, name, email, department, year, gender, city\nFROM students\nORDER BY student_id ASC;`,
      },
      {
        name: 'Computer Science Dept',
        tag: 'STATIC',
        desc: 'Filter by a hardcoded department literal.',
        sql: `SELECT student_id, name, email, year, gender, city\nFROM students\nWHERE department = 'Computer Science'\nORDER BY name ASC;`,
      },
      {
        name: '3rd Year Students',
        tag: 'STATIC',
        desc: 'Fixed integer predicate — year = 3.',
        sql: `SELECT student_id, name, department, gender, city\nFROM students\nWHERE year = 3\nORDER BY department ASC, name ASC;`,
      },
      {
        name: 'Hyderabad Students',
        tag: 'STATIC',
        desc: 'Fixed string city predicate.',
        sql: `SELECT student_id, name, department, year, city\nFROM students\nWHERE city = 'Hyderabad'\nORDER BY name ASC;`,
      },
      {
        name: 'High Achievers (>80)',
        tag: 'STATIC',
        desc: '3-table JOIN with fixed marks threshold.',
        sql: `SELECT s.student_id, s.name AS student_name, s.department,\n       c.course_name, e.marks, e.semester\nFROM students s\nJOIN enrollments e ON s.student_id = e.student_id\nJOIN courses c ON e.course_id = c.course_id\nWHERE e.marks > 80.00\nORDER BY e.marks DESC;`,
      },
      {
        name: 'Avg Marks by Dept',
        tag: 'STATIC',
        desc: 'GROUP BY with AVG() aggregate function.',
        sql: `SELECT s.department,\n       COUNT(DISTINCT s.student_id) AS student_count,\n       ROUND(AVG(e.marks), 2) AS average_marks\nFROM students s\nJOIN enrollments e ON s.student_id = e.student_id\nGROUP BY s.department\nORDER BY average_marks DESC;`,
      },
      {
        name: 'Department Headcount',
        tag: 'STATIC',
        desc: 'COUNT(*) grouped by department.',
        sql: `SELECT department, COUNT(*) AS student_count\nFROM students\nGROUP BY department\nORDER BY student_count DESC;`,
      },
      {
        name: 'MAX / MIN Marks',
        tag: 'STATIC',
        desc: 'Fixed aggregate functions on the enrollments table.',
        sql: `SELECT MAX(marks) AS highest_marks,\n       MIN(marks) AS lowest_marks,\n       ROUND(AVG(marks), 2) AS overall_average\nFROM enrollments;`,
      },
    ],
  },
  {
    category: 'Dynamic Queries',
    color: 'purple',
    queries: [
      {
        name: 'Search by Department',
        tag: 'DYNAMIC',
        desc: 'Parameterized department search — try "Cybersecurity".',
        sql: `-- Change the value below to search any department\nSELECT student_id, name, email, department, year, city\nFROM students\nWHERE department = 'Cybersecurity'\nORDER BY name ASC;`,
      },
      {
        name: 'Search by City',
        tag: 'DYNAMIC',
        desc: 'City filter — try "Bengaluru", "Mumbai", "Pune".',
        sql: `SELECT student_id, name, department, year, city\nFROM students\nWHERE city = 'Bengaluru'\nORDER BY name ASC;`,
      },
      {
        name: 'Min Marks Filter',
        tag: 'DYNAMIC',
        desc: 'Runtime marks cutoff with 3-table JOIN.',
        sql: `SELECT s.student_id, s.name, s.department,\n       c.course_name, e.marks, e.semester\nFROM students s\nJOIN enrollments e ON s.student_id = e.student_id\nJOIN courses c ON e.course_id = c.course_id\nWHERE e.marks >= 90\nORDER BY e.marks DESC;`,
      },
      {
        name: 'Search by Year',
        tag: 'DYNAMIC',
        desc: 'Academic year parameter (1-4).',
        sql: `SELECT student_id, name, department, year, city\nFROM students\nWHERE year = 2\nORDER BY department ASC, name ASC;`,
      },
    ],
  },
  {
    category: 'JOIN Demos',
    color: 'amber',
    queries: [
      {
        name: '3-Table JOIN',
        tag: 'JOIN',
        desc: 'Students → Enrollments → Courses',
        sql: `SELECT s.name AS student_name, c.course_name,\n       e.marks, e.semester\nFROM students s\nJOIN enrollments e ON s.student_id = e.student_id\nJOIN courses c ON e.course_id = c.course_id\nORDER BY s.name ASC\nLIMIT 12;`,
      },
      {
        name: 'Top Performers',
        tag: 'JOIN',
        desc: 'Students with marks ≥ 90.',
        sql: `SELECT s.student_id, s.name, s.department,\n       c.course_name, e.marks\nFROM students s\nJOIN enrollments e ON s.student_id = e.student_id\nJOIN courses c ON e.course_id = c.course_id\nWHERE e.marks >= 90.00\nORDER BY e.marks DESC;`,
      },
      {
        name: 'Avg by Course',
        tag: 'JOIN',
        desc: 'Aggregated scores per course.',
        sql: `SELECT c.course_id, c.course_name,\n       COUNT(e.enrollment_id) AS total_enrolled,\n       ROUND(AVG(e.marks), 2) AS avg_marks\nFROM courses c\nJOIN enrollments e ON c.course_id = e.course_id\nGROUP BY c.course_id, c.course_name\nORDER BY avg_marks DESC;`,
      },
      {
        name: 'CS101 Roster',
        tag: 'JOIN',
        desc: 'All students enrolled in DBMS (CS101).',
        sql: `SELECT s.student_id, s.name, s.department,\n       c.course_id, c.course_name, e.marks, e.semester\nFROM students s\nJOIN enrollments e ON s.student_id = e.student_id\nJOIN courses c ON e.course_id = c.course_id\nWHERE c.course_id = 'CS101'\nORDER BY e.marks DESC;`,
      },
    ],
  },
  {
    category: 'Aggregations',
    color: 'green',
    queries: [
      {
        name: 'Dept Benchmark',
        tag: 'AGG',
        desc: 'Average marks per department with student count.',
        sql: `SELECT s.department,\n       COUNT(DISTINCT s.student_id) AS student_count,\n       ROUND(AVG(e.marks), 2) AS avg_marks\nFROM students s\nJOIN enrollments e ON s.student_id = e.student_id\nGROUP BY s.department\nORDER BY avg_marks DESC;`,
      },
      {
        name: 'All Courses Stats',
        tag: 'AGG',
        desc: 'MAX, MIN, AVG for every course.',
        sql: `SELECT c.course_id, c.course_name,\n       COUNT(e.enrollment_id) AS enrolled,\n       MAX(e.marks) AS highest,\n       MIN(e.marks) AS lowest,\n       ROUND(AVG(e.marks), 2) AS average\nFROM courses c\nJOIN enrollments e ON c.course_id = e.course_id\nGROUP BY c.course_id, c.course_name\nORDER BY average DESC;`,
      },
    ],
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; badge: string; activeBg: string }> = {
  blue:   { border: 'border-blue-500/20',   bg: 'bg-blue-500/[0.07]',   text: 'text-blue-400',   badge: 'badge-blue',   activeBg: 'bg-blue-500/15 border-blue-500/30' },
  purple: { border: 'border-violet-500/20', bg: 'bg-violet-500/[0.07]', text: 'text-violet-400', badge: 'badge-purple', activeBg: 'bg-violet-500/15 border-violet-500/30' },
  amber:  { border: 'border-amber-500/20',  bg: 'bg-amber-500/[0.07]',  text: 'text-amber-400',  badge: 'badge-amber',  activeBg: 'bg-amber-500/15 border-amber-500/30' },
  green:  { border: 'border-emerald-500/20',bg: 'bg-emerald-500/[0.07]',text: 'text-emerald-400',badge: 'badge-green',  activeBg: 'bg-emerald-500/15 border-emerald-500/30' },
};

type LibraryQuery = { name: string; tag: string; desc: string; sql: string; color: string };

export default function SqlLabPage() {
  const [sql, setSql] = useState(queryLibrary[0].queries[0].sql);
  const [result, setResult] = useState<QR | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeQuery, setActiveQuery] = useState<string>('All Students');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runQuery = useCallback(async () => {
    setLoading(true);
    setResult(null);
    // Small async tick to show loading state
    await new Promise(r => setTimeout(r, 120));
    const r = executeQuery(sql);
    setResult(r);
    setLoading(false);
  }, [sql]);

  const loadQuery = (q: LibraryQuery) => {
    setSql(q.sql);
    setActiveQuery(q.name);
    setResult(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      runQuery();
    }
    // Allow Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newSql = sql.substring(0, start) + '  ' + sql.substring(end);
      setSql(newSql);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-zinc-900/30">
        <div className="page-container py-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="badge badge-blue">INTERACTIVE</span>
            <span className="badge badge-green">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse mr-1" />
              LIVE ENGINE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100">SQL Lab</h1>
          <p className="text-zinc-500 mt-1">
            Execute queries against the embedded dataset. Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/[0.08] text-xs font-mono">⌘ Enter</kbd> to run.
          </p>
        </div>
      </div>

      <div className="page-container py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-6">

          {/* ── Query Library sidebar ─────────────────────────────────────── */}
          <div className="glass-raised rounded-xl border border-white/[0.07] overflow-hidden xl:max-h-[calc(100vh-180px)] xl:overflow-y-auto">
            <div className="sticky top-0 px-4 py-3 border-b border-white/[0.06] bg-zinc-900/60 backdrop-blur z-10 flex items-center gap-2">
              <BookOpen size={14} className="text-zinc-500" />
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Query Library</span>
            </div>

            <div className="p-2">
              {queryLibrary.map((cat) => {
                const c = colorMap[cat.color];
                return (
                  <div key={cat.category} className="mb-4">
                    <div className={`px-3 py-1.5 rounded-md ${c.bg} mb-1`}>
                      <span className={`text-xs font-mono font-semibold uppercase tracking-wider ${c.text}`}>
                        {cat.category}
                      </span>
                    </div>
                    {cat.queries.map((q) => (
                      <button
                        key={q.name}
                        onClick={() => loadQuery({ ...q, color: cat.color })}
                        className={`w-full text-left px-3 py-2 rounded-lg mb-0.5 border transition-all duration-150 cursor-pointer ${
                          activeQuery === q.name
                            ? `${c.activeBg} text-zinc-100`
                            : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">{q.name}</span>
                          {activeQuery === q.name && <ChevronRight size={12} className={c.text} />}
                        </div>
                        <p className="text-xs text-zinc-600 mt-0.5 leading-tight truncate">{q.desc}</p>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Editor + Results ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Editor */}
            <div className="glass-raised rounded-xl border border-white/[0.07] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-zinc-900/40">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  </div>
                  <span className="text-xs font-mono text-zinc-600">query.sql</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-700 font-mono">Embedded SQLite · 25 students · 46 enrollments</span>
                  <button
                    onClick={runQuery}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500
                      text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Play size={13} fill="currentColor" />
                    {loading ? 'Running…' : 'Run'}
                  </button>
                </div>
              </div>

              <div className="relative bg-[#0d1117]">
                <textarea
                  ref={textareaRef}
                  value={sql}
                  onChange={e => setSql(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  className="w-full min-h-[220px] max-h-[360px] p-4 bg-transparent resize-y
                    font-mono text-[13.5px] leading-[1.65] text-zinc-200
                    focus:outline-none focus:ring-0 border-0"
                  aria-label="SQL query editor"
                  style={{ caretColor: '#60a5fa' }}
                />
              </div>
            </div>

            {/* Results */}
            <div className="glass-raised rounded-xl border border-white/[0.07] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Database size={13} className="text-zinc-600" />
                  <span className="text-xs font-mono text-zinc-600 uppercase tracking-wider">Query Results</span>
                </div>
                {result && !result.error && (
                  <div className="flex items-center gap-3">
                    <span className="badge badge-green text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      {result.rowCount} rows
                    </span>
                    <span className="text-xs text-zinc-700 font-mono">{result.executionMs}ms</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <QueryResult result={result} loading={loading} />
              </div>
            </div>

            {/* Tip */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/[0.06] border border-blue-500/15">
              <Zap size={13} className="text-blue-400 shrink-0" />
              <p className="text-xs text-zinc-500">
                <span className="text-zinc-400 font-medium">Tip:</span> This engine runs against embedded JavaScript data — same 25 students and 46 enrollments as the Python project. It supports SELECT, JOIN, WHERE, GROUP BY, ORDER BY, LIMIT.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
