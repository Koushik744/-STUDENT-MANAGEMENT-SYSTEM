'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Database, GitBranch } from 'lucide-react';

const navLinks = [
  { href: '/',              label: 'Home' },
  { href: '/sql-lab',       label: 'SQL Lab' },
  { href: '/static-sql',    label: 'Static SQL' },
  { href: '/dynamic-sql',   label: 'Dynamic SQL' },
  { href: '/architecture',  label: 'Architecture' },
  { href: '/security',      label: 'Security' },
  { href: '/transactions',  label: 'Transactions' },
  { href: '/analytics',     label: 'Analytics' },
  { href: '/about',         label: 'About' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-white/[0.07]' : 'bg-transparent'
      }`}
      style={{ height: '60px' }}
    >
      <nav className="max-w-6xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-blue-500/20 border border-blue-500/30 flex items-center justify-center
            group-hover:bg-blue-500/30 transition-colors">
            <Database size={14} className="text-blue-400" />
          </div>
          <span className="font-mono font-semibold text-sm text-zinc-100 tracking-tight hidden sm:block">
            SQL<span className="text-blue-400">Lab</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-0.5">
          {navLinks.slice(1).map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                    active
                      ? 'text-zinc-100 bg-white/[0.08]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Koushik744/-STUDENT-MANAGEMENT-SYSTEM"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm
              text-zinc-400 hover:text-zinc-200 border border-white/[0.08] hover:border-white/[0.15]
              transition-all duration-150 cursor-pointer"
            aria-label="GitHub repository"
          >
            <GitBranch size={14} />
            <span className="hidden md:inline text-xs font-mono">GitHub</span>
          </a>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md
              text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden glass border-t border-white/[0.06] animate-slide-down">
          <ul className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      active ? 'text-zinc-100 bg-white/[0.08]' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            <li>
              <a
                href="https://github.com/Koushik744/-STUDENT-MANAGEMENT-SYSTEM"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-zinc-400 hover:text-zinc-200"
              >
                <GitBranch size={14} /> GitHub
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
