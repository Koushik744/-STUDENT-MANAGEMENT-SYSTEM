'use client';
import { useState } from 'react';
import SqlBlock from '@/components/SqlBlock';
import { Shield, AlertTriangle, CheckCircle, ChevronRight, XCircle, Lock } from 'lucide-react';

const injectionExamples = [
  {
    name: "Classic OR Injection",
    input: "' OR '1'='1",
    unsafe: `SELECT * FROM students\nWHERE department = '' OR '1'='1';`,
    safe: `SELECT * FROM students\nWHERE department = ?;`,
    boundValue: `"' OR '1'='1"`,
    effect: 'Modifies the WHERE clause to always be true, returning ALL rows.',
    safeEffect: 'The entire string is treated as the literal value to match against department. No SQL is executed.',
  },
  {
    name: "DROP TABLE Attack",
    input: "'; DROP TABLE students; --",
    unsafe: `SELECT * FROM students\nWHERE name = ''; DROP TABLE students; --';`,
    safe: `SELECT * FROM students\nWHERE name = ?;`,
    boundValue: `"'; DROP TABLE students; --"`,
    effect: 'Injects a second SQL statement. The DROP TABLE would delete all student data.',
    safeEffect: 'The dangerous string is sent as a data value. The database compares the column to this literal text — no statement is ever executed.',
  },
  {
    name: "UNION-based Data Exfiltration",
    input: "' UNION SELECT null, password, null FROM admin; --",
    unsafe: `SELECT name FROM students\nWHERE city = '' UNION SELECT null, password, null FROM admin; --';`,
    safe: `SELECT name FROM students\nWHERE city = ?;`,
    boundValue: `"' UNION SELECT null, password, null FROM admin; --"`,
    effect: 'Appends a second SELECT that retrieves the admin password table.',
    safeEffect: 'The entire string including UNION keyword is treated as the city value to look up. No second query runs.',
  },
];

const flowSteps = [
  { step: 'User Input', safe: 'Raw string from UI control', icon: '01', color: 'text-zinc-400', bg: 'bg-zinc-800/60' },
  { step: 'Validation', safe: 'Type check / whitelist check', icon: '02', color: 'text-blue-400', bg: 'bg-blue-500/[0.08]' },
  { step: 'Parameter Binding', safe: '? placeholder — value treated as data', icon: '03', color: 'text-violet-400', bg: 'bg-violet-500/[0.08]' },
  { step: 'SQL Engine', safe: 'Parses template separately from value', icon: '04', color: 'text-emerald-400', bg: 'bg-emerald-500/[0.08]' },
  { step: 'Result Set', safe: 'Only matching data rows returned', icon: '05', color: 'text-zinc-400', bg: 'bg-zinc-800/60' },
];

export default function SecurityPage() {
  const [selectedExample, setSelectedExample] = useState(0);
  const ex = injectionExamples[selectedExample];

  return (
    <div className="min-h-screen">
      <div className="border-b border-white/[0.06] bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <span className="badge badge-red mb-3">
            <Shield size={10} />
            SECURITY ANALYSIS
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">SQL Injection & Defense</h1>
          <p className="text-zinc-400 max-w-2xl">
            How parameterized queries and identifier whitelisting protect this project from SQL injection attacks.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {/* ── Parameterized flow ───────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-zinc-100 mb-6">Secure Parameter Flow</h2>
          <div className="flex flex-col gap-0">
            {flowSteps.map((s, i) => (
              <div key={s.step}>
                <div className={`flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] ${s.bg}`}>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900/80 border border-white/[0.08] flex items-center justify-center shrink-0">
                    <span className="text-xs font-mono font-bold text-zinc-500">{s.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold text-sm ${s.color}`}>{s.step}</div>
                    <div className="text-xs text-zinc-600 mt-0.5">{s.safe}</div>
                  </div>
                  {i === 2 && (
                    <div className="hidden sm:flex items-center gap-2">
                      <span className="badge badge-green">
                        <CheckCircle size={10} />
                        SAFE
                      </span>
                    </div>
                  )}
                </div>
                {i < flowSteps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ChevronRight size={14} className="text-zinc-700 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Injection simulator ──────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-zinc-100 mb-2">SQL Injection Scenarios</h2>
          <p className="text-zinc-500 text-sm mb-6">
            See exactly what happens when a malicious payload hits an unsafe query vs a parameterized query.
          </p>

          {/* Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {injectionExamples.map((e, i) => (
              <button key={e.name} onClick={() => setSelectedExample(i)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                  i === selectedExample
                    ? 'bg-red-500/15 border-red-500/30 text-red-300'
                    : 'border-white/[0.08] text-zinc-400 hover:border-white/[0.15] hover:text-zinc-200'
                }`}>
                {e.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Unsafe */}
            <div className="glass-raised rounded-xl border border-red-500/20 overflow-hidden">
              <div className="px-4 py-3 border-b border-red-500/15 flex items-center gap-2 bg-red-500/[0.06]">
                <XCircle size={14} className="text-red-400" />
                <span className="text-sm font-semibold text-red-400">UNSAFE — String Concatenation</span>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-zinc-600 mb-1">Malicious user input:</p>
                  <div className="px-3 py-2 rounded bg-zinc-900 border border-red-500/15 font-mono text-xs text-red-300">
                    {ex.input}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 mb-1">What gets executed:</p>
                  <SqlBlock code={ex.unsafe} />
                </div>
                <div className="p-3 rounded-lg bg-red-500/[0.08] border border-red-500/20">
                  <p className="text-xs text-red-400 font-semibold mb-1">Result:</p>
                  <p className="text-xs text-red-300/80">{ex.effect}</p>
                </div>
              </div>
            </div>

            {/* Safe */}
            <div className="glass-raised rounded-xl border border-emerald-500/20 overflow-hidden">
              <div className="px-4 py-3 border-b border-emerald-500/15 flex items-center gap-2 bg-emerald-500/[0.05]">
                <CheckCircle size={14} className="text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">SAFE — Parameterized Query</span>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-zinc-600 mb-1">Same malicious input:</p>
                  <div className="px-3 py-2 rounded bg-zinc-900 border border-emerald-500/15 font-mono text-xs text-emerald-300">
                    {ex.input}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 mb-1">Query template (never changes):</p>
                  <SqlBlock code={ex.safe} />
                </div>
                <div>
                  <p className="text-xs text-zinc-600 mb-1">Bound as DATA value:</p>
                  <div className="px-3 py-2 rounded bg-zinc-900 border border-white/[0.06] font-mono text-xs text-zinc-400">
                    cursor.execute(query, ({ex.boundValue},))
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20">
                  <p className="text-xs text-emerald-400 font-semibold mb-1">Result:</p>
                  <p className="text-xs text-emerald-300/80">{ex.safeEffect}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Whitelist for identifiers ────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-zinc-100 mb-2">Dynamic Identifiers — Whitelist Pattern</h2>
          <p className="text-zinc-500 text-sm mb-6">
            SQL <code className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-xs">?</code> placeholders only work for data values, not for column names, table names, or ORDER BY identifiers. This requires a different defense strategy.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-raised rounded-xl border border-red-500/20 p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={14} className="text-red-400" />
                <span className="text-sm font-semibold text-red-400">WHY ? FAILS FOR COLUMN NAMES</span>
              </div>
              <SqlBlock code={`-- This is INVALID — ? cannot be a column identifier\nSELECT * FROM students ORDER BY ?;\n\n-- What the database actually sees:\n-- ORDER BY 'name'   ← treated as a string literal\n-- NOT as the column named "name"\n-- Result: all rows in arbitrary/undefined order`} />
              <p className="text-xs text-zinc-500 mt-3 leading-relaxed">
                SQL grammar distinguishes between identifier positions (column/table names) and expression positions (WHERE values). Parameter markers are only valid in expression positions.
              </p>
            </div>

            <div className="glass-raised rounded-xl border border-emerald-500/20 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Lock size={14} className="text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">WHITELIST SOLUTION</span>
              </div>
              <SqlBlock code={`# Python — ALLOWED_SORT_COLUMNS whitelist\nALLOWED_SORT_COLUMNS = {\n    "1": ("name",  "Student Name"),\n    "2": ("year",  "Academic Year"),\n    "3": ("city",  "Residential City")\n}\n\ncol_choice = user_input  # e.g., "2"\nif col_choice not in ALLOWED_SORT_COLUMNS:\n    print("[SECURITY] Rejected!")\n    continue\n\n# col_name is 'name', 'year', or 'city'\n# — never a raw user string\ncol_name, _ = ALLOWED_SORT_COLUMNS[col_choice]\nquery = f"SELECT ... ORDER BY {col_name} ASC"`} />
              <div className="mt-3 p-3 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20">
                <p className="text-xs text-emerald-300">
                  The user never touches the SQL identifier. They pick a number (1, 2, 3) and the code resolves it to a programmer-written string from the dict.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Summary table ────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-zinc-100 mb-6">Defense Summary</h2>
          <div className="glass-raised rounded-xl border border-white/[0.07] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Input Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Defense</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Example</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['String value (dept, city)', 'Parameterized ? binding', "WHERE department = ?", 'badge-green', '✓ SAFE'],
                  ['Numeric value (marks, year)', 'Type cast + ? binding', 'float(marks_input), WHERE marks >= ?', 'badge-green', '✓ SAFE'],
                  ['Column name (ORDER BY)', 'Whitelist dict lookup', 'ALLOWED_SORT_COLUMNS["2"] → "year"', 'badge-green', '✓ SAFE'],
                  ['Sort direction (ASC/DESC)', 'Whitelist dict lookup', 'ALLOWED_SORT_DIRECTIONS["1"] → "ASC"', 'badge-green', '✓ SAFE'],
                  ['Column for UPDATE SET', 'Whitelist dict lookup', 'ALLOWED_UPDATE_COLUMNS["1"] → "department"', 'badge-green', '✓ SAFE'],
                  ['String concatenation', '—', 'WHERE dept = \' + user_input + \'', 'badge-red', '✗ NEVER USED'],
                ].map(([type, defense, example, badge, status]) => (
                  <tr key={type as string} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-zinc-300 text-sm">{type}</td>
                    <td className="px-5 py-3 text-zinc-400 text-sm">{defense}</td>
                    <td className="px-5 py-3 font-mono text-xs text-zinc-500">{example}</td>
                    <td className="px-5 py-3"><span className={`badge ${badge} text-[10px]`}>{status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
