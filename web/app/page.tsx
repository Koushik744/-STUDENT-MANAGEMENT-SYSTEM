import Link from 'next/link';
import { ArrowRight, Database, Shield, Zap, GitBranch, BarChart3, Lock, RefreshCw, ChevronRight } from 'lucide-react';
import { stats } from '@/lib/data';

const flowSteps = [
  {
    label: 'STATIC SQL',
    sub: 'Fixed structure — no runtime input',
    color: 'blue',
    steps: ['Hardcoded query text', 'Literal predicates', 'Direct execution'],
  },
  {
    label: 'DYNAMIC SQL',
    sub: 'Runtime parameters — user-driven',
    color: 'purple',
    steps: ['User input received', 'Bind via ? placeholder', 'PREPARE statement', 'EXECUTE + DEALLOCATE'],
  },
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
    preview: `SELECT s.name, c.course_name, e.marks
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE e.marks >= 90
ORDER BY e.marks DESC;`,
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
    preview: `PREPARE stmt FROM
  'SELECT * FROM students WHERE department = ?';

SET @dept = 'Cybersecurity';
EXECUTE stmt USING @dept;
DEALLOCATE PREPARE stmt;`,
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  blue:   { border: 'border-blue-500/20',    bg: 'bg-blue-500/[0.07]',    text: 'text-blue-400',    badge: 'badge-blue' },
  purple: { border: 'border-violet-500/20',  bg: 'bg-violet-500/[0.07]',  text: 'text-violet-400',  badge: 'badge-purple' },
  red:    { border: 'border-red-500/20',     bg: 'bg-red-500/[0.07]',     text: 'text-red-400',     badge: 'badge-red' },
  amber:  { border: 'border-amber-500/20',   bg: 'bg-amber-500/[0.07]',   text: 'text-amber-400',   badge: 'badge-amber' },
  green:  { border: 'border-emerald-500/20', bg: 'bg-emerald-500/[0.07]', text: 'text-emerald-400', badge: 'badge-green' },
};

const comparisonRows = [
  ['Query structure',  'Fixed before execution',   'Assembled at runtime'],
  ['Conditions',       'Hardcoded literals',        'User-supplied at runtime'],
  ['PREPARE/EXECUTE',  'Not required',              'Used (PREPARE / EXECUTE)'],
  ['User input',       'Not supported',             'Bound via ? parameters'],
  ['Injection risk',   'None — no user input',      'Handled via ? placeholders'],
  ['Example',          'WHERE year = 3',            'WHERE year = ?'],
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen w-full">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[88vh] text-center px-4 sm:px-6 lg:px-8 dot-grid overflow-hidden">
        {/* Ambient glow — contained by overflow:hidden on the section */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[480px] h-[480px] rounded-full bg-blue-600/[0.07] blur-[100px]" />
          <div className="absolute top-1/3 left-1/4
            w-[240px] h-[240px] rounded-full bg-violet-600/[0.05] blur-[70px]" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            border border-blue-500/25 bg-blue-500/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" aria-hidden />
            <span className="text-xs font-mono text-blue-300 tracking-wider">
              DBMS Engineering Project — Interactive Demo
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-bold leading-[1.0] tracking-tight mb-6">
            <span className="gradient-text block text-4xl sm:text-6xl md:text-7xl">
              STATIC × DYNAMIC
            </span>
            <span className="block mt-1 text-zinc-100 text-3xl sm:text-5xl md:text-6xl">
              SQL ENGINEERING
            </span>
            <span className="block gradient-text-blue text-2xl sm:text-4xl md:text-5xl mt-2">
              LAB
            </span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
            A practical exploration of SQL execution, parameterized queries,
            relational modeling, and database security.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link
              href="/sql-lab"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600
                hover:bg-blue-500 text-white font-semibold text-sm transition-all
                duration-200 shadow-lg shadow-blue-900/30 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Zap size={15} aria-hidden />
              Open SQL Lab
              <ArrowRight size={15} aria-hidden />
            </Link>
            <Link
              href="/architecture"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border
                border-white/[0.1] text-zinc-300 hover:text-zinc-100
                hover:border-white/[0.2] hover:bg-white/[0.04] font-semibold text-sm
                transition-all duration-200 cursor-pointer w-full sm:w-auto justify-center"
            >
              View Architecture
            </Link>
            <a
              href="https://github.com/Koushik744/-STUDENT-MANAGEMENT-SYSTEM"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border
                border-white/[0.07] text-zinc-500 hover:text-zinc-300
                hover:border-white/[0.14] font-medium text-sm transition-all
                duration-200 cursor-pointer w-full sm:w-auto justify-center"
            >
              <GitBranch size={14} aria-hidden /> GitHub
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {[
              { label: 'Students',    value: stats.totalStudents },
              { label: 'Courses',     value: stats.totalCourses },
              { label: 'Enrollments', value: stats.totalEnrollments },
              { label: 'Avg Marks',   value: stats.avgMarks },
              { label: 'Departments', value: stats.departments },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100">{value}</div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div aria-hidden className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-zinc-700" />
        </div>
      </section>

      {/* ── Static vs Dynamic Comparison ──────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3">
              Static vs Dynamic SQL
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Whether the query structure is fixed at development time or assembled at runtime.
            </p>
          </div>

          {/* Flow cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {flowSteps.map(({ label, sub, color, steps }) => {
              const c = colorMap[color];
              return (
                <div key={label} className={`glass-raised rounded-xl p-5 border ${c.border} min-w-0`}>
                  <div className="mb-4">
                    <span className={`badge ${c.badge} mb-2`}>{label}</span>
                    <p className={`text-xs ${c.text} font-mono mt-1.5`}>{sub}</p>
                  </div>
                  <div className="flex flex-col gap-0">
                    {steps.map((step, i) => (
                      <div key={step}>
                        <div className={`flex items-center gap-3 py-2 px-3 rounded-lg ${c.bg}`}>
                          <span className={`font-mono text-xs sm:text-sm font-semibold ${c.text} truncate`}>
                            {step}
                          </span>
                        </div>
                        {i < steps.length - 1 && (
                          <div className="flex justify-center py-0.5">
                            <ChevronRight size={12} className={`${c.text} opacity-35 rotate-90`} aria-hidden />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparison table — scrollable wrapper prevents left/right clipping */}
          <div className="glass-raised rounded-xl border border-white/[0.07] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[520px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-4 sm:px-5 py-3 text-zinc-600 text-[10px] font-semibold tracking-widest uppercase whitespace-nowrap">
                      Feature
                    </th>
                    <th className="text-left px-4 sm:px-5 py-3 text-blue-400 text-[10px] font-semibold tracking-widest uppercase whitespace-nowrap">
                      Static SQL
                    </th>
                    <th className="text-left px-4 sm:px-5 py-3 text-violet-400 text-[10px] font-semibold tracking-widest uppercase whitespace-nowrap">
                      Dynamic SQL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map(([f, s, d]) => (
                    <tr key={f} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 sm:px-5 py-2.5 text-zinc-500 font-mono text-xs whitespace-nowrap">{f}</td>
                      <td className="px-4 sm:px-5 py-2.5 text-zinc-300 font-mono text-xs">{s}</td>
                      <td className="px-4 sm:px-5 py-2.5 text-zinc-300 font-mono text-xs">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bento Grid ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3">Explore the Lab</h2>
            <p className="text-zinc-500 text-sm sm:text-base">
              Every module is interactive, documented, and interview-ready.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {bentoItems.map((item) => {
              const c = colorMap[item.color];
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative glass-raised rounded-xl p-5 border ${c.border}
                    hover:border-opacity-60 hover:bg-white/[0.025] transition-all duration-200
                    cursor-pointer flex flex-col gap-3 min-w-0 ${item.span || ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`w-9 h-9 rounded-lg ${c.bg} border ${c.border}
                      flex items-center justify-center shrink-0`}>
                      <Icon size={16} className={c.text} aria-hidden />
                    </div>
                    <span className={`badge ${c.badge} shrink-0`}>{item.badge}</span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-zinc-100 mb-1 text-sm sm:text-base">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {item.preview && (
                    <div className="mt-1 p-3 rounded-lg bg-[#0d1117] border border-white/[0.05] overflow-hidden">
                      <pre className="text-[11px] font-mono text-zinc-400 leading-relaxed
                        overflow-hidden whitespace-pre-wrap break-words max-h-[72px]">
                        {item.preview}
                      </pre>
                    </div>
                  )}

                  <div className={`flex items-center gap-1 text-xs ${c.text} font-medium mt-auto pt-1`}>
                    Explore
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" aria-hidden />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Schema Preview ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3">
              3-Table Relational Schema
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Third Normal Form. One-to-many relationships. Primary and foreign keys with CASCADE rules.
            </p>
          </div>

          {/* Scrollable on small screens so tables don't clip */}
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center justify-center gap-0 min-w-[640px] mx-auto w-fit">
              {[
                {
                  name: 'STUDENTS',
                  pk: 'student_id',
                  cols: ['name', 'email', 'department', 'year', 'gender', 'city'],
                  color: 'blue',
                },
                {
                  name: 'ENROLLMENTS',
                  pk: 'enrollment_id',
                  cols: ['student_id FK', 'course_id FK', 'marks', 'semester'],
                  color: 'purple',
                  junction: true,
                },
                {
                  name: 'COURSES',
                  pk: 'course_id',
                  cols: ['course_name', 'department', 'credits'],
                  color: 'amber',
                },
              ].map((table, i) => {
                const c = colorMap[table.color];
                return (
                  <div key={table.name} className="flex items-center">
                    {/* Left connector (before ENROLLMENTS) */}
                    {i === 1 && (
                      <div className="flex flex-col items-center mx-3">
                        <span className="text-[10px] text-zinc-600 font-mono mb-1">1</span>
                        <div className="flex items-center gap-0">
                          <div className="w-6 h-px bg-zinc-700" />
                          <span className="text-zinc-500 text-xs">◄</span>
                        </div>
                        <span className="text-[10px] text-zinc-600 font-mono mt-1">N</span>
                      </div>
                    )}

                    <div className={`glass-raised rounded-xl border ${c.border} p-4 w-48`}>
                      <div className={`badge ${c.badge} mb-3 text-[9px]`}>
                        {table.junction ? 'JUNCTION TABLE' : 'TABLE'}
                      </div>
                      <h3 className={`font-mono text-xs font-bold ${c.text} mb-2.5 tracking-wide`}>
                        {table.name}
                      </h3>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" aria-hidden />
                          <span className="text-[11px] font-mono text-amber-300 truncate">
                            PK {table.pk}
                          </span>
                        </div>
                        {table.cols.map(col => (
                          <div key={col} className="flex items-center gap-2">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                col.includes('FK') ? 'bg-blue-400' : 'bg-zinc-700'
                              }`}
                              aria-hidden
                            />
                            <span className={`text-[11px] font-mono truncate ${
                              col.includes('FK') ? 'text-blue-300' : 'text-zinc-500'
                            }`}>
                              {col}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right connector (after ENROLLMENTS) */}
                    {i === 1 && (
                      <div className="flex flex-col items-center mx-3">
                        <span className="text-[10px] text-zinc-600 font-mono mb-1">N</span>
                        <div className="flex items-center gap-0">
                          <span className="text-zinc-500 text-xs">►</span>
                          <div className="w-6 h-px bg-zinc-700" />
                        </div>
                        <span className="text-[10px] text-zinc-600 font-mono mt-1">1</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs">
            {[
              { dot: 'bg-amber-400', label: 'Primary Key' },
              { dot: 'bg-blue-400',  label: 'Foreign Key' },
              { dot: 'bg-zinc-700',  label: 'Column' },
            ].map(({ dot, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${dot}`} aria-hidden />
                <span className="text-zinc-600">{label}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/architecture"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                border border-white/[0.1] text-zinc-400 hover:text-zinc-200
                hover:border-white/[0.2] transition-all duration-200 text-sm cursor-pointer"
            >
              View full ER diagram <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
