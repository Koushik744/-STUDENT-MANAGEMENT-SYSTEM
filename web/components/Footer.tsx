import Link from 'next/link';
import { GitBranch, Database } from 'lucide-react';

const sections = [
  { heading: 'SQL Modules', links: [
    { label: 'SQL Lab',       href: '/sql-lab' },
    { label: 'Static SQL',    href: '/static-sql' },
    { label: 'Dynamic SQL',   href: '/dynamic-sql' },
    { label: 'Transactions',  href: '/transactions' },
  ]},
  { heading: 'Project', links: [
    { label: 'Architecture',  href: '/architecture' },
    { label: 'Security',      href: '/security' },
    { label: 'Analytics',     href: '/analytics' },
    { label: 'About',         href: '/about' },
  ]},
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <Database size={14} className="text-blue-400" />
              </div>
              <span className="font-mono font-semibold text-sm text-zinc-100">SQL<span className="text-blue-400">Lab</span></span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              An interactive showcase of Static vs Dynamic SQL, parameterized queries, and database engineering concepts.
            </p>
            <a
              href="https://github.com/Koushik744/-STUDENT-MANAGEMENT-SYSTEM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <GitBranch size={13} /> View on GitHub
            </a>
          </div>

          {sections.map(sec => (
            <div key={sec.heading}>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-zinc-600 mb-3">{sec.heading}</h3>
              <ul className="space-y-2">
                {sec.links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Tech stack */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-zinc-600 mb-3">Built With</h3>
            <div className="flex flex-wrap gap-2">
              {['Python', 'MySQL', 'Next.js', 'TypeScript', 'Tailwind'].map(t => (
                <span key={t} className="badge badge-blue text-[10px]">{t}</span>
              ))}
            </div>
            <p className="text-xs text-zinc-600 mt-4">
              Demo data: 25 students · 6 courses · 46 enrollments
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-700 font-mono">Student Management System — Static vs Dynamic SQL</p>
          <p className="text-xs text-zinc-700">DBMS Engineering Project</p>
        </div>
      </div>
    </footer>
  );
}
