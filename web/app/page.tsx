import Link from 'next/link';
import { ArrowRight, Database, Shield, Zap, GitBranch, BarChart3, Lock, RefreshCw, ChevronRight } from 'lucide-react';
import { stats } from '@/lib/data';

const flowSteps = [
  { label: 'STATIC SQL', sub: 'Fixed structure', color: 'blue', steps: ['Hardcoded query', 'Literal predicates', 'Execution'] },
  { label: 'DYNAMIC SQL', sub: 'Runtime parameters', color: 'purple', steps: ['User input', 'Bind parameter (?)', 'Prepared stmt', 'Execution'] },
];

const bentoItems = [
  {
    title: 'Interactive SQL Lab',
    description: 'Run any project query live against the embedded dataset. Real execution, real results.',
    href: '/sql-lab',
    icon: Zap,
    color: 'blue',
    span: 'md:col-span-2',
    badge: 'LIVE',
    preview: `SELECT s.name, c.course_name, e.marks\nFROM students s\nJOIN enrollments e ON s.student_id = e.student_id\nJOIN courses c ON e.course_id = c.course_id\nWHERE e.marks >= 90\nORDER BY e.marks DESC;`,
  },
  {
    title: 'SQL Injection Defense',
    description: 'Visual breakdown of how parameterized queries and whitelisting prevent injection attacks.',
    href: '/security',
    icon: Shield,
    color: 'red',
    span: '',
    badge: 'SECURITY',
  },
  {
    title: 'Schema Architecture',
    description: 'Interactive ER diagram. Click tables to explore columns, constraints, and relationships.',
    href: '/architecture',
    icon: Database,
    color: 'amber',
    span: '',
    badge: 'ER DIAGRAM',
  },
  {
    title: 'Static SQL Module',
    description: 'Nine hardcoded queries. Fixed structure. No user input. Verified against live data.',
    href: '/static-sql',
    icon: Lock,
    color: 'green',
    span: '',
    badge: 'STATIC',
  },
  {
    title: 'Transaction Demos',
    description: 'Step through COMMIT and ROLLBACK with visual ACID property breakdowns.',
    href: '/transactions',
    icon: RefreshCw,
    color: 'purple',
    span: '',
    badge: 'ACID',
  },
  {
    title: 'Dataset Analytics',
    description: 'Recharts-powered visualizations of the embedded 25-student, 46-enrollment dataset.',
    href: '/analytics',
    icon: BarChart3,
    color: 'blue',
    span: '',
    badge: 'CHARTS',
  },
  {
    title: 'Dynamic SQL Module',
    description: 'Runtime parameter binding. Whitelist validation for column identifiers. Full prepared statement flow.',
    href: '/dynamic-sql',
    icon: GitBranch,
    color: 'amber',
    span: 'md:col-span-2',
    badge: 'DYNAMIC',
    preview: `PREPARE stmt FROM\n  'SELECT * FROM students WHERE department = ?';\n\nSET @dept = 'Cybersecurity';\nEXECUTE stmt USING @dept;\nDEALLOCATE PREPARE stmt;`,
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  blue:   { border: 'border-blue-500/20',   bg: 'bg-blue-500/[0.07]',   text: 'text-blue-400',   badge: 'badge-blue' },
  purple: { border: 'border-violet-500/20', bg: 'bg-violet-500/[0.07]', text: 'text-violet-400', badge: 'badge-purple' },
  red:    { border: 'border-red-500/20',    bg: 'bg-red-500/[0.07]',    text: 'text-red-400',    badge: 'badge-red' },
  amber:  { border: 'border-amber-500/20',  bg: 'bg-amber-500/[0.07]',  text: 'text-amber-400',  badge: 'badge-amber' },
  green:  { border: 'border-emerald-500/20',bg: 'bg-emerald-500/[0.07]',text: 'text-emerald-400',badge: 'badge-green' },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-4 overflow-hidden dot-grid">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/[0.06] blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-violet-600/[0.04] blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-mono text-blue-300 tracking-wider">DBMS Engineering Project — Interactive Demo</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold leading-[1.0] tracking-tight mb-6">
            <span className="gradient-text block">STATIC × DYNAMIC</span>
            <span className="block mt-1 text-zinc-100">SQL ENGINEERING</span>
            <span className="block gradient-text-blue text-4xl sm:text-5xl md:text-6xl mt-2">LAB</span>
          </h1>

          <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            A practical exploration of SQL execution, parameterized queries,<br className="hidden sm:block" />
            relational modeling, and database security.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link
              href="/sql-lab"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500
                text-white font-semibold transition-all duration-200 shadow-lg shadow-blue-900/30 cursor-pointer"
            >
              <Zap size={16} />
              Explore SQL Lab
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/architecture"
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/[0.1]
                text-zinc-300 hover:text-zinc-100 hover:border-white/[0.2] hover:bg-white/[0.04]
                font-semibold transition-all duration-200 cursor-pointer"
            >
              View Architecture
            </Link>
            <a
              href="https://github.com/Koushik744/-STUDENT-MANAGEMENT-SYSTEM"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/[0.07]
                text-zinc-500 hover:text-zinc-300 hover:border-white/[0.14]
                font-medium transition-all duration-200 cursor-pointer"
            >
              <GitBranch size={15} /> GitHub
            </a>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {[
              { label: 'Students', value: stats.totalStudents },
              { label: 'Courses', value: stats.totalCourses },
              { label: 'Enrollments', value: stats.totalEnrollments },
              { label: 'Avg Marks', value: stats.avgMarks },
              { label: 'Departments', value: stats.departments },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100">{value}</div>
                <div className="text-xs text-zinc-600 uppercase tracking-wider mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-zinc-600" />
        </div>
      </section>

      {/* ── SQL Flow Visual ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">Static vs Dynamic SQL</h2>
          <p className="text-zinc-500 max-w-xl mx-auto">
            The core distinction: whether the query structure is fixed at development time or assembled at runtime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flowSteps.map(({ label, sub, color, steps }) => {
            const c = colorMap[color];
            return (
              <div key={label} className={`glass-raised rounded-xl p-6 border ${c.border}`}>
                <div className="mb-5">
                  <span className={`badge ${c.badge} mb-2`}>{label}</span>
                  <p className={`text-sm ${c.text} font-mono`}>{sub}</p>
                </div>
                <div className="flex flex-col gap-0">
                  {steps.map((step, i) => (
                    <div key={step}>
                      <div className={`flex items-center gap-3 py-2.5 px-3 rounded-lg ${c.bg}`}>
                        <span className={`font-mono text-sm font-semibold ${c.text}`}>{step}</span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className="flex justify-center py-1">
                          <ChevronRight size={14} className={`${c.text} opacity-40 rotate-90`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="mt-8 glass-raised rounded-xl border border-white/[0.07] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3 text-zinc-600 text-xs font-semibold tracking-widest uppercase">Feature</th>
                <th className="text-left px-5 py-3 text-blue-400 text-xs font-semibold tracking-widest uppercase">Static SQL</th>
                <th className="text-left px-5 py-3 text-violet-400 text-xs font-semibold tracking-widest uppercase">Dynamic SQL</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Query structure', 'Fixed before execution', 'Assembled at runtime'],
                ['Conditions', 'Hardcoded literals', 'User-supplied at runtime'],
                ['PREPARE/EXECUTE', 'Not required', 'Used (PREPARE / EXECUTE)'],
                ['User input', 'Not supported', 'Bound via parameters'],
                ['Injection risk', 'None (no user input)', 'Handled via ? placeholders'],
                ['Example', "WHERE year = 3", "WHERE year = ?"],
              ].map(([f, s, d]) => (
                <tr key={f} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-2.5 text-zinc-500 font-mono text-xs">{f}</td>
                  <td className="px-5 py-2.5 text-zinc-300 font-mono text-xs">{s}</td>
                  <td className="px-5 py-2.5 text-zinc-300 font-mono text-xs">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Bento Grid ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">Explore the Lab</h2>
          <p className="text-zinc-500">Every module is interactive, documented, and interview-ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bentoItems.map((item) => {
            const c = colorMap[item.color];
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative glass-raised rounded-xl p-5 border ${c.border}
                  hover:border-opacity-50 hover:bg-white/[0.03] transition-all duration-200
                  cursor-pointer flex flex-col gap-3 ${item.span || ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-9 h-9 rounded-lg ${c.bg} ${c.border} border flex items-center justify-center`}>
                    <Icon size={16} className={c.text} />
                  </div>
                  <span className={`badge ${c.badge}`}>{item.badge}</span>
                </div>

                <div>
                  <h3 className="font-semibold text-zinc-100 mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.description}</p>
                </div>

                {item.preview && (
                  <div className="mt-2 p-3 rounded-lg bg-[#0d1117] border border-white/[0.05] overflow-hidden">
                    <pre className="text-[11px] font-mono text-zinc-400 leading-relaxed overflow-hidden max-h-20">
                      {item.preview}
                    </pre>
                  </div>
                )}

                <div className={`flex items-center gap-1 text-xs ${c.text} font-medium mt-auto pt-1`}>
                  Explore <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Database Schema Preview ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">3-Table Relational Schema</h2>
          <p className="text-zinc-500 max-w-xl mx-auto">
            Third Normal Form. One-to-many relationships. Primary and foreign keys with CASCADE rules.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
          {[
            { name: 'STUDENTS', pk: 'student_id', cols: ['name', 'email', 'department', 'year', 'gender', 'city'], color: 'blue' },
            { name: 'ENROLLMENTS', pk: 'enrollment_id', cols: ['student_id FK', 'course_id FK', 'marks', 'semester'], color: 'purple', junction: true },
            { name: 'COURSES', pk: 'course_id', cols: ['course_name', 'department', 'credits'], color: 'amber' },
          ].map((table, i) => {
            const c = colorMap[table.color];
            return (
              <div key={table.name} className="flex items-center">
                {/* Connector */}
                {i === 1 && (
                  <div className="hidden md:flex flex-col items-center mx-2">
                    <span className="text-xs text-zinc-600 font-mono mb-1">1:N</span>
                    <div className="w-8 h-px bg-zinc-700" />
                    <div className="text-zinc-600 text-xs">←</div>
                  </div>
                )}

                <div className={`glass-raised rounded-xl border ${c.border} p-4 w-52`}>
                  <div className={`badge ${c.badge} mb-3 text-[10px]`}>{table.junction ? 'JUNCTION' : 'TABLE'}</div>
                  <h3 className={`font-mono text-sm font-bold ${c.text} mb-2`}>{table.name}</h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="text-xs font-mono text-amber-300">PK {table.pk}</span>
                    </div>
                    {table.cols.map(col => (
                      <div key={col} className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${col.includes('FK') ? 'bg-blue-400' : 'bg-zinc-700'}`} />
                        <span className={`text-xs font-mono ${col.includes('FK') ? 'text-blue-300' : 'text-zinc-500'}`}>{col}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connector right */}
                {i === 1 && (
                  <div className="hidden md:flex flex-col items-center mx-2">
                    <span className="text-xs text-zinc-600 font-mono mb-1">N:1</span>
                    <div className="w-8 h-px bg-zinc-700" />
                    <div className="text-zinc-600 text-xs">→</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/architecture"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/[0.1]
              text-zinc-400 hover:text-zinc-200 hover:border-white/[0.2] transition-all duration-200 text-sm cursor-pointer"
          >
            View full ER diagram <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
