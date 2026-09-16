'use client';
import { useState } from 'react';
import SqlBlock from '@/components/SqlBlock';
import QueryResult from '@/components/QueryResult';
import { executeQuery, type QueryResult as QR } from '@/lib/sql-engine';
import { ChevronDown, Shield, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import { students, courses } from '@/lib/data';

const departments = [...new Set(students.map(s => s.department))].sort();
const cities = [...new Set(students.map(s => s.city))].sort();
const courseIds = courses.map(c => c.course_id);

export default function DynamicSqlPage() {
  // Dept search
  const [dept, setDept] = useState('Computer Science');
  const [deptResult, setDeptResult] = useState<QR | null>(null);

  // City search
  const [city, setCity] = useState('Hyderabad');
  const [cityResult, setCityResult] = useState<QR | null>(null);

  // Min marks
  const [minMarks, setMinMarks] = useState(88);
  const [marksResult, setMarksResult] = useState<QR | null>(null);

  // Year search
  const [year, setYear] = useState(3);
  const [yearResult, setYearResult] = useState<QR | null>(null);

  // Dynamic sort
  const SORT_COLS = { '1': 'name', '2': 'year', '3': 'city' };
  const SORT_DIRS = { '1': 'ASC', '2': 'DESC' };
  const [sortCol, setSortCol] = useState('1');
  const [sortDir, setSortDir] = useState('1');
  const [sortResult, setSortResult] = useState<QR | null>(null);

  // Multi-filter
  const [mfDept, setMfDept] = useState('');
  const [mfYear, setMfYear] = useState('');
  const [mfCity, setMfCity] = useState('');
  const [mfResult, setMfResult] = useState<QR | null>(null);

  const run = (sql: string, setter: (r: QR) => void) => {
    setter(executeQuery(sql));
  };

  const sortQuery = () => {
    const col = SORT_COLS[sortCol as keyof typeof SORT_COLS];
    const dir = SORT_DIRS[sortDir as keyof typeof SORT_DIRS];
    return `SELECT student_id, name, department, year, city\nFROM students\nORDER BY ${col} ${dir};`;
  };

  const multiQuery = () => {
    const conds: string[] = [];
    if (mfDept) conds.push(`department = '${mfDept}'`);
    if (mfYear && ['1','2','3','4'].includes(mfYear)) conds.push(`year = ${mfYear}`);
    if (mfCity) conds.push(`city = '${mfCity}'`);
    const where = conds.length ? `\nWHERE ${conds.join('\n  AND ')}` : '';
    return `SELECT student_id, name, department, year, city\nFROM students${where}\nORDER BY name ASC;`;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="badge badge-blue">MODULE 2</span>
            <span className="badge badge-purple">DYNAMIC SQL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">Dynamic SQL</h1>
          <p className="text-zinc-400 max-w-2xl leading-relaxed">
            Queries that accept runtime values via parameter binding. User input is treated as <strong className="text-zinc-200">data</strong>, never as executable SQL code.
          </p>

          {/* Flow diagram */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm font-mono">
            {['User Input', 'Validation', 'Parameter Binding (?)', 'SQL Execution', 'Result'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg glass border border-white/[0.08] text-zinc-300 text-xs">{step}</span>
                {i < 4 && <ChevronRight size={13} className="text-zinc-600" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {/* ── 1. Department Search ──────────────────────────────────────── */}
        <DemoSection
          id="D1" tag="DYNAMIC" badge="badge-purple"
          name="Search by Department"
          desc="The department value is supplied at runtime via a bound parameter."
          prepareSQL={`PREPARE stmt FROM\n  'SELECT student_id, name, email, department, year, city\n   FROM students WHERE department = ?\n   ORDER BY name ASC';\n\nSET @dept = '${dept}';\nEXECUTE stmt USING @dept;\nDEALLOCATE PREPARE stmt;`}
          pythonSQL={`query = "SELECT ... FROM students WHERE department = ?"\ncursor.execute(query, ("${dept}",))`}
        >
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="flex-1">
              <label className="text-xs text-zinc-500 mb-1.5 block">Department <span className="text-violet-400">(runtime parameter)</span></label>
              <div className="relative">
                <select
                  value={dept}
                  onChange={e => setDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/[0.1] text-zinc-200 text-sm
                    focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer"
                >
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
            </div>
            <button onClick={() => run(`SELECT student_id, name, email, department, year, city FROM students WHERE department = '${dept}' ORDER BY name ASC`, setDeptResult)}
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors cursor-pointer shrink-0">
              Execute Query
            </button>
          </div>
          {deptResult && <div className="mt-3"><QueryResult result={deptResult} /></div>}
        </DemoSection>

        {/* ── 2. City Search ────────────────────────────────────────────── */}
        <DemoSection
          id="D2" tag="DYNAMIC" badge="badge-purple"
          name="Search by City"
          desc="City name is supplied at runtime. The ? placeholder prevents any injection."
          prepareSQL={`PREPARE stmt FROM\n  'SELECT student_id, name, department, year, city\n   FROM students WHERE city = ?';\n\nSET @city = '${city}';\nEXECUTE stmt USING @city;\nDEALLOCATE PREPARE stmt;`}
          pythonSQL={`query = "SELECT ... FROM students WHERE city = ?"\ncursor.execute(query, ("${city}",))`}
        >
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="flex-1">
              <label className="text-xs text-zinc-500 mb-1.5 block">City <span className="text-violet-400">(runtime parameter)</span></label>
              <div className="relative">
                <select value={city} onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/[0.1] text-zinc-200 text-sm focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer">
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
            </div>
            <button onClick={() => run(`SELECT student_id, name, department, year, city FROM students WHERE city = '${city}' ORDER BY name ASC`, setCityResult)}
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors cursor-pointer shrink-0">
              Execute Query
            </button>
          </div>
          {cityResult && <div className="mt-3"><QueryResult result={cityResult} /></div>}
        </DemoSection>

        {/* ── 3. Min Marks ─────────────────────────────────────────────── */}
        <DemoSection
          id="D3" tag="DYNAMIC" badge="badge-purple"
          name="Minimum Marks Cutoff"
          desc="Numeric cutoff is cast to float() and bound dynamically — type-safe runtime input."
          prepareSQL={`PREPARE stmt FROM\n  'SELECT s.name, c.course_name, e.marks\n   FROM students s\n   JOIN enrollments e ON s.student_id = e.student_id\n   JOIN courses c ON e.course_id = c.course_id\n   WHERE e.marks >= ?';\n\nSET @min = ${minMarks};\nEXECUTE stmt USING @min;\nDEALLOCATE PREPARE stmt;`}
          pythonSQL={`min_marks = float("${minMarks}")\nquery = "SELECT ... WHERE e.marks >= ?"\ncursor.execute(query, (min_marks,))`}
        >
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="flex-1">
              <label className="text-xs text-zinc-500 mb-1.5 block">Minimum marks cutoff: <span className="text-violet-400 font-mono">{minMarks}</span></label>
              <input type="range" min={60} max={98} value={minMarks} onChange={e => setMinMarks(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer" />
              <div className="flex justify-between text-xs text-zinc-700 mt-0.5"><span>60</span><span>98</span></div>
            </div>
            <button onClick={() => run(`SELECT s.student_id, s.name, s.department, c.course_name, e.marks FROM students s JOIN enrollments e ON s.student_id = e.student_id JOIN courses c ON e.course_id = c.course_id WHERE e.marks >= ${minMarks} ORDER BY e.marks DESC`, setMarksResult)}
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors cursor-pointer shrink-0">
              Execute Query
            </button>
          </div>
          {marksResult && <div className="mt-3"><QueryResult result={marksResult} /></div>}
        </DemoSection>

        {/* ── 4. Academic Year ─────────────────────────────────────────── */}
        <DemoSection
          id="D4" tag="DYNAMIC" badge="badge-purple"
          name="Academic Year Search"
          desc="Input validated to be in [1,2,3,4] before binding — whitelist validation on the value."
          prepareSQL={`PREPARE stmt FROM\n  'SELECT student_id, name, department, year, city\n   FROM students WHERE year = ?';\n\nSET @yr = ${year};\nEXECUTE stmt USING @yr;\nDEALLOCATE PREPARE stmt;`}
          pythonSQL={`if year_input not in ["1","2","3","4"]:\n    print("[ERROR] Invalid year!")\n    continue\nquery = "SELECT ... WHERE year = ?"\ncursor.execute(query, (int(year_input),))`}
        >
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Academic Year <span className="text-violet-400">(validated 1–4)</span></label>
              <div className="flex gap-2">
                {[1,2,3,4].map(y => (
                  <button key={y} onClick={() => setYear(y)}
                    className={`w-10 h-10 rounded-lg border text-sm font-mono font-semibold transition-all cursor-pointer ${
                      year === y ? 'bg-violet-600 border-violet-500 text-white' : 'border-white/[0.1] text-zinc-400 hover:border-violet-500/40 hover:text-zinc-200'
                    }`}>
                    {y}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => run(`SELECT student_id, name, department, year, city FROM students WHERE year = ${year} ORDER BY department ASC, name ASC`, setYearResult)}
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors cursor-pointer shrink-0">
              Execute Query
            </button>
          </div>
          {yearResult && <div className="mt-3"><QueryResult result={yearResult} /></div>}
        </DemoSection>

        {/* ── 5. Dynamic Sorting (whitelisting) ───────────────────────── */}
        <DemoSection
          id="D5" tag="WHITELIST" badge="badge-amber"
          name="Dynamic Sorting — Column Whitelisting"
          desc="Column names cannot use ? placeholders. User choice is resolved through a pre-approved whitelist dictionary."
          prepareSQL={`-- Column names CANNOT use ? placeholders\n-- Safe pattern: resolve user input through a whitelist\n\nSET @sort_col = ${sortCol};\nSET @col = CASE @sort_col WHEN 1 THEN 'name' WHEN 2 THEN 'year' WHEN 3 THEN 'city' ELSE 'name' END;\nSET @dir = '${SORT_DIRS[sortDir as keyof typeof SORT_DIRS]}';\n\nSET @sql = CONCAT(\n  'SELECT student_id, name, department, year, city\\n',\n  'FROM students ORDER BY ', @col, ' ', @dir\n);\nPREPARE stmt FROM @sql;\nEXECUTE stmt;\nDEALLOCATE PREPARE stmt;`}
          pythonSQL={`ALLOWED_SORT_COLUMNS = {\n  "1": ("name", "Student Name"),\n  "2": ("year", "Academic Year"),\n  "3": ("city", "Residential City")\n}\n\ncol_choice = "${sortCol}"  # user input\nif col_choice not in ALLOWED_SORT_COLUMNS:\n    print("[SECURITY] Invalid choice!")\n    continue\n\nsort_column, _ = ALLOWED_SORT_COLUMNS[col_choice]\n# sort_column is now 'name', 'year', or 'city'\n# — never a raw user string\nquery = f"SELECT ... ORDER BY {sort_column} ${SORT_DIRS[sortDir as keyof typeof SORT_DIRS]}"`}
          whitelistNote
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Sort column <span className="text-amber-400">(whitelist)</span></label>
              <div className="flex gap-2">
                {[['1','Name'], ['2','Year'], ['3','City']].map(([v,l]) => (
                  <button key={v} onClick={() => setSortCol(v)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer ${
                      sortCol === v ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'border-white/[0.1] text-zinc-400 hover:text-zinc-200'
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Direction</label>
              <div className="flex gap-2">
                {[['1','ASC ↑'], ['2','DESC ↓']].map(([v,l]) => (
                  <button key={v} onClick={() => setSortDir(v)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer ${
                      sortDir === v ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'border-white/[0.1] text-zinc-400 hover:text-zinc-200'
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => run(sortQuery(), setSortResult)}
              className="px-4 py-2 rounded-lg bg-amber-600/80 hover:bg-amber-500/80 text-white text-sm font-semibold transition-colors cursor-pointer shrink-0">
              Execute
            </button>
          </div>
          <div className="mt-3 p-3 rounded-lg bg-amber-500/[0.06] border border-amber-500/15 text-xs">
            <span className="text-amber-400 font-semibold">Resolved SQL: </span>
            <span className="font-mono text-zinc-300">{sortQuery()}</span>
          </div>
          {sortResult && <div className="mt-3"><QueryResult result={sortResult} /></div>}
        </DemoSection>

        {/* ── 6. Multi-filter ──────────────────────────────────────────── */}
        <DemoSection
          id="D6" tag="DYNAMIC" badge="badge-purple"
          name="Multi-criteria Dynamic Filtering"
          desc="WHERE clause built dynamically. Only active filters are included. All values are bound via ?."
          prepareSQL={multiQuery()}
          pythonSQL={`conditions = []\nparams = []\nif dept_input:\n    conditions.append("department = ?")\n    params.append(dept_input)\nif year_input in ["1","2","3","4"]:\n    conditions.append("year = ?")\n    params.append(int(year_input))\nif city_input:\n    conditions.append("city = ?")\n    params.append(city_input)\n\nwhere = " WHERE " + " AND ".join(conditions) if conditions else ""\nquery = f"SELECT ... FROM students{where} ORDER BY name ASC"\ncursor.execute(query, tuple(params))`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Department (optional)</label>
              <div className="relative">
                <select value={mfDept} onChange={e => setMfDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/[0.1] text-zinc-200 text-sm focus:outline-none appearance-none cursor-pointer">
                  <option value="">— Any —</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Year (optional)</label>
              <div className="relative">
                <select value={mfYear} onChange={e => setMfYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/[0.1] text-zinc-200 text-sm focus:outline-none appearance-none cursor-pointer">
                  <option value="">— Any —</option>
                  {[1,2,3,4].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">City (optional)</label>
              <div className="relative">
                <select value={mfCity} onChange={e => setMfCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/[0.1] text-zinc-200 text-sm focus:outline-none appearance-none cursor-pointer">
                  <option value="">— Any —</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button onClick={() => run(multiQuery(), setMfResult)}
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors cursor-pointer">
              Execute Query
            </button>
            <span className="text-xs text-zinc-600 font-mono">
              Active filters: {[mfDept, mfYear, mfCity].filter(Boolean).length}
            </span>
          </div>
          <div className="mt-2 p-3 rounded-lg bg-zinc-900 border border-white/[0.06] overflow-x-auto">
            <pre className="text-xs font-mono text-zinc-400">{multiQuery()}</pre>
          </div>
          {mfResult && <div className="mt-3"><QueryResult result={mfResult} /></div>}
        </DemoSection>
      </div>
    </div>
  );
}

// ── DemoSection component ─────────────────────────────────────────────────────

interface DemoSectionProps {
  id: string; tag: string; badge: string; name: string; desc: string;
  prepareSQL: string; pythonSQL: string; whitelistNote?: boolean;
  children: React.ReactNode;
}

function DemoSection({ id, tag, badge, name, desc, prepareSQL, pythonSQL, whitelistNote, children }: DemoSectionProps) {
  const [showSQL, setShowSQL] = useState(false);

  return (
    <div className="glass-raised rounded-xl border border-white/[0.07] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-zinc-600">{id}</span>
            <h2 className="text-lg font-semibold text-zinc-100">{name}</h2>
          </div>
          <p className="text-sm text-zinc-500">{desc}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className={`badge ${badge}`}>{tag}</span>
          {whitelistNote && (
            <span className="badge badge-amber">WHITELIST</span>
          )}
        </div>
      </div>

      {/* Interactive controls */}
      <div className="p-5">{children}</div>

      {/* Toggle SQL */}
      <div className="border-t border-white/[0.05]">
        <button
          onClick={() => setShowSQL(!showSQL)}
          className="w-full flex items-center gap-2 px-5 py-3 text-xs text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.02] transition-colors cursor-pointer"
        >
          <ChevronDown size={13} className={`transition-transform ${showSQL ? 'rotate-180' : ''}`} />
          {showSQL ? 'Hide' : 'Show'} MySQL PREPARE / EXECUTE + Python code
        </button>

        {showSQL && (
          <div className="border-t border-white/[0.05] grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-4 border-r border-white/[0.04]">
              <p className="text-xs text-zinc-600 mb-2 font-mono uppercase tracking-wider">MySQL PREPARE / EXECUTE</p>
              <SqlBlock code={prepareSQL} />
            </div>
            <div className="p-4">
              <p className="text-xs text-zinc-600 mb-2 font-mono uppercase tracking-wider">Python DB-API</p>
              <SqlBlock code={pythonSQL} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
