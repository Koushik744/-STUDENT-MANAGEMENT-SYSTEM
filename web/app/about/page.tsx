import { GitBranch, ExternalLink, Terminal, Database, Shield, Zap } from 'lucide-react';

const techStack = [
  { group: 'Frontend', items: ['Next.js 15 (App Router)', 'TypeScript', 'Tailwind CSS v4', 'Recharts', 'Lucide Icons'] },
  { group: 'Data Layer', items: ['Embedded JS dataset', 'Custom SQL engine (TypeScript)', 'No external DB for frontend', 'Static generation (Vercel)'] },
  { group: 'Backend (Original)', items: ['Python 3 CLI (app.py)', 'MySQL + InnoDB', 'sqlite3 (dev mode)', 'mysql-connector-python'] },
  { group: 'Deployment', items: ['Vercel (static export)', 'Zero server credentials', 'No .env in frontend', 'All demo data labeled'] },
];

const features = [
  {
    icon: Terminal,
    title: 'Interactive SQL Lab',
    desc: 'Run SELECT queries against embedded dataset in the browser. Supports JOINs, GROUP BY, aggregate functions, ORDER BY, LIMIT.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/[0.07]',
    border: 'border-blue-500/20',
    href: '/sql-lab',
  },
  {
    icon: Database,
    title: 'Static & Dynamic SQL',
    desc: 'Side-by-side exploration of hardcoded queries vs runtime-parameterized queries. Every concept has an interview question attached.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/[0.07]',
    border: 'border-emerald-500/20',
    href: '/static-sql',
  },
  {
    icon: Shield,
    title: 'Security Analysis',
    desc: 'Three injection attack scenarios with interactive before/after. Explains why ? placeholders work for values but whitelists are required for identifiers.',
    color: 'text-red-400',
    bg: 'bg-red-500/[0.07]',
    border: 'border-red-500/20',
    href: '/security',
  },
  {
    icon: Zap,
    title: 'ACID Transactions',
    desc: 'Step-through simulation of COMMIT and ROLLBACK flows. Visual state changes show atomicity in action.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/[0.07]',
    border: 'border-amber-500/20',
    href: '/transactions',
  },
];

const auditFindings = [
  { label: 'Static SQL module', status: 'Genuine', note: '9 queries with hardcoded literals — correctly classified' },
  { label: 'Dynamic SQL module', status: 'Genuine', note: '? placeholders + Python DB-API binding — correctly implemented' },
  { label: 'SQL injection defense', status: 'Genuine', note: 'Parameterized queries + ALLOWED_SORT_COLUMNS whitelist dict' },
  { label: 'ACID transactions', status: 'Genuine', note: 'START TRANSACTION / COMMIT / ROLLBACK in transactions.sql' },
  { label: 'Schema normalization', status: '3NF', note: '3 tables, FK relationships, ON DELETE CASCADE' },
  { label: 'Python placeholder bug', status: 'Bug', note: 'app.py uses ? (sqlite3 syntax) — should be %s for mysql-connector' },
  { label: 'Unused dependency', status: 'Minor', note: 'tabulate in requirements.txt but never called in code' },
  { label: 'Hardcoded local path', status: 'Minor', note: 'README.md line 408 has c:\\Users\\N Koushik\\... path' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-white/[0.06] bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <span className="badge badge-blue mb-3">ABOUT</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">Project Overview</h1>
          <p className="text-zinc-400 max-w-2xl">
            SQL Engineering Lab — a showcase of Static vs Dynamic SQL concepts built on an audited student management system.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {/* ── Project origin ───────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-zinc-100 mb-4">What This Is</h2>
            <div className="space-y-3 text-sm text-zinc-400 leading-relaxed">
              <p>
                This web application is a visual companion to a <strong className="text-zinc-200">Student Management System</strong> Python CLI project
                that demonstrates the difference between Static and Dynamic SQL in MySQL.
              </p>
              <p>
                The original project runs a 961-line Python CLI against a MySQL database with a 3-table normalized schema.
                This web interface makes the SQL concepts explorable in a browser without needing MySQL credentials.
              </p>
              <p>
                All data is <strong className="text-zinc-200">embedded demo data</strong> (25 students, 6 courses, 46 enrollments).
                The browser-based SQL engine is a custom TypeScript implementation — not a real SQL database.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href="https://github.com/Koushik744/-STUDENT-MANAGEMENT-SYSTEM"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.08] text-sm text-zinc-300 hover:border-white/[0.2] hover:text-zinc-100 transition-colors">
                <GitBranch size={14} />
                Original Repo
                <ExternalLink size={11} className="text-zinc-600" />
              </a>
              <a href="/sql-lab"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-sm text-blue-300 hover:bg-blue-600/30 transition-colors">
                <Terminal size={14} />
                Open SQL Lab
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100 mb-4">Audit Findings</h2>
            {auditFindings.map(f => (
              <div key={f.label} className="flex items-start gap-3">
                <span className={`badge text-[10px] shrink-0 mt-0.5 ${
                  f.status === 'Genuine' ? 'badge-green' :
                  f.status === '3NF'     ? 'badge-blue' :
                  f.status === 'Bug'     ? 'badge-red' : 'badge-amber'
                }`}>{f.status}</span>
                <div>
                  <div className="text-sm text-zinc-300">{f.label}</div>
                  <div className="text-xs text-zinc-600 mt-0.5">{f.note}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Feature cards ────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-zinc-100 mb-6">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map(f => (
              <a key={f.title} href={f.href}
                className={`glass-raised rounded-xl border p-5 transition-all hover:scale-[1.01] group ${f.border} ${f.bg}`}>
                <div className="flex items-start gap-3">
                  <f.icon size={18} className={`${f.color} mt-0.5 shrink-0`} />
                  <div>
                    <div className="text-sm font-semibold text-zinc-200 mb-1 group-hover:text-white transition-colors">{f.title}</div>
                    <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── Tech stack ───────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-zinc-100 mb-6">Technology Stack</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {techStack.map(group => (
              <div key={group.group} className="glass-raised rounded-xl border border-white/[0.07] p-4">
                <h3 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-3">{group.group}</h3>
                <ul className="space-y-2">
                  {group.items.map(item => (
                    <li key={item} className="text-sm text-zinc-400 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Security note ────────────────────────────────────────────── */}
        <section className="glass-raised rounded-xl border border-emerald-500/20 p-5 bg-emerald-500/[0.03]">
          <h3 className="text-sm font-semibold text-emerald-400 mb-2">Security & Credentials Note</h3>
          <div className="text-sm text-zinc-400 leading-relaxed space-y-1">
            <p>This web interface contains <strong className="text-zinc-200">zero MySQL credentials</strong>. No .env files. No API keys.</p>
            <p>The original project&apos;s MySQL database is <strong className="text-zinc-200">not accessible</strong> from this deployment.</p>
            <p>All SQL executes against an in-memory JavaScript dataset. Results are labeled <span className="badge badge-amber text-[10px] ml-1">DEMO DATA</span>.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
