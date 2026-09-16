'use client';
import { useState } from 'react';
import { schema } from '@/lib/data';
import { Key, Link2, ChevronRight, Database } from 'lucide-react';

type TableName = keyof typeof schema;

export default function ArchitecturePage() {
  const [activeTable, setActiveTable] = useState<TableName>('students');
  const active = schema[activeTable];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <span className="badge badge-amber mb-3">ER DIAGRAM</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">Database Architecture</h1>
          <p className="text-zinc-400 max-w-2xl">
            Three-table normalized schema in Third Normal Form. One-to-many relationships enforced via Foreign Keys with ON DELETE CASCADE.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Visual ER Diagram ────────────────────────────────────────── */}
        <div className="glass-raised rounded-xl border border-white/[0.07] p-6 mb-10">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-8 text-center">Entity-Relationship Diagram</h2>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-0">

            {/* Students table */}
            <ERTable
              name="students"
              badge="TABLE"
              badgeColor="blue"
              active={activeTable === 'students'}
              onClick={() => setActiveTable('students')}
              columns={[
                { name: 'student_id', type: 'INT', pk: true },
                { name: 'name', type: 'VARCHAR(100)' },
                { name: 'email', type: 'VARCHAR(100)', unique: true },
                { name: 'department', type: 'VARCHAR(50)' },
                { name: 'year', type: 'INT' },
                { name: 'gender', type: 'VARCHAR(10)' },
                { name: 'city', type: 'VARCHAR(50)' },
              ]}
            />

            {/* Connector students → enrollments */}
            <div className="hidden lg:flex flex-col items-center gap-1 px-3">
              <span className="text-xs font-mono text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded">1</span>
              <div className="h-px w-16 bg-gradient-to-r from-blue-500/40 to-violet-500/40" />
              <span className="text-xs font-mono text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded">N</span>
            </div>
            <div className="lg:hidden text-xs text-zinc-600 font-mono">1 : N ↕</div>

            {/* Enrollments junction table */}
            <ERTable
              name="enrollments"
              badge="JUNCTION"
              badgeColor="purple"
              active={activeTable === 'enrollments'}
              onClick={() => setActiveTable('enrollments')}
              columns={[
                { name: 'enrollment_id', type: 'INT', pk: true },
                { name: 'student_id', type: 'INT', fk: true },
                { name: 'course_id', type: 'VARCHAR(10)', fk: true },
                { name: 'marks', type: 'DECIMAL(5,2)' },
                { name: 'semester', type: 'VARCHAR(20)' },
              ]}
            />

            {/* Connector enrollments → courses */}
            <div className="hidden lg:flex flex-col items-center gap-1 px-3">
              <span className="text-xs font-mono text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded">N</span>
              <div className="h-px w-16 bg-gradient-to-r from-violet-500/40 to-amber-500/40" />
              <span className="text-xs font-mono text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded">1</span>
            </div>
            <div className="lg:hidden text-xs text-zinc-600 font-mono">N : 1 ↕</div>

            {/* Courses table */}
            <ERTable
              name="courses"
              badge="TABLE"
              badgeColor="amber"
              active={activeTable === 'courses'}
              onClick={() => setActiveTable('courses')}
              columns={[
                { name: 'course_id', type: 'VARCHAR(10)', pk: true },
                { name: 'course_name', type: 'VARCHAR(100)' },
                { name: 'department', type: 'VARCHAR(50)' },
                { name: 'credits', type: 'INT' },
              ]}
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-xs">
            {[
              { dot: 'bg-amber-400', label: 'Primary Key (PK)' },
              { dot: 'bg-blue-400', label: 'Foreign Key (FK)' },
              { dot: 'bg-emerald-500', label: 'UNIQUE constraint' },
              { dot: 'bg-zinc-700', label: 'NOT NULL column' },
            ].map(({ dot, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-zinc-600">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Detail panel ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {(Object.keys(schema) as TableName[]).map(tname => (
            <button
              key={tname}
              onClick={() => setActiveTable(tname)}
              className={`text-left glass-raised rounded-xl border p-5 transition-all cursor-pointer ${
                activeTable === tname
                  ? 'border-blue-500/30 bg-blue-500/[0.05]'
                  : 'border-white/[0.07] hover:border-white/[0.12]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Database size={14} className="text-zinc-500" />
                  <span className="font-mono font-semibold text-zinc-200">{tname}</span>
                </div>
                <span className="text-xs font-mono text-zinc-600">{schema[tname].rowCount} rows</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{schema[tname].description}</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-blue-400 font-medium">
                View details <ChevronRight size={12} />
              </div>
            </button>
          ))}
        </div>

        {/* ── Column detail ────────────────────────────────────────────── */}
        <div className="glass-raised rounded-xl border border-white/[0.07] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database size={15} className="text-zinc-500" />
              <span className="font-mono font-semibold text-zinc-200">{activeTable}</span>
              <span className="text-xs text-zinc-600">· {active.rowCount} rows · {active.columns.length} columns</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Column', 'Data Type', 'Constraints', 'Description'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {active.columns.map((col, i) => (
                  <tr key={col.name} className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${i === active.columns.length - 1 ? 'border-0' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {col.constraints.includes('PRIMARY KEY') && <Key size={11} className="text-amber-400 shrink-0" />}
                        {col.constraints.includes('FK') && <Link2 size={11} className="text-blue-400 shrink-0" />}
                        <span className="font-mono text-sm text-zinc-200">{col.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-zinc-400">{col.type}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-mono text-zinc-500">{col.constraints}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-zinc-500">{col.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(active.indexes.length > 0 || active.foreignKeys.length > 0) && (
            <div className="px-5 pb-5 pt-2 border-t border-white/[0.04] grid grid-cols-1 md:grid-cols-2 gap-6">
              {active.indexes.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Indexes</h3>
                  {active.indexes.map(idx => (
                    <div key={idx} className="font-mono text-xs text-zinc-400 py-1">{idx}</div>
                  ))}
                </div>
              )}
              {active.foreignKeys.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Foreign Keys</h3>
                  {active.foreignKeys.map(fk => (
                    <div key={fk} className="font-mono text-xs text-blue-400/80 py-1 leading-relaxed">{fk}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ERTable sub-component ──────────────────────────────────────────────────────

interface ERCol { name: string; type: string; pk?: boolean; fk?: boolean; unique?: boolean }
interface ERTableProps {
  name: string; badge: string; badgeColor: string; active: boolean;
  onClick: () => void; columns: ERCol[];
}

const badgeColors: Record<string, string> = {
  blue: 'badge-blue', purple: 'badge-purple', amber: 'badge-amber',
};
const borderColors: Record<string, string> = {
  blue: 'border-blue-500/30 shadow-blue-900/20', purple: 'border-violet-500/30 shadow-violet-900/20', amber: 'border-amber-500/30 shadow-amber-900/20',
};

function ERTable({ name, badge, badgeColor, active, onClick, columns }: ERTableProps) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border p-4 w-52 transition-all cursor-pointer shadow-lg ${
        active ? `${borderColors[badgeColor]} bg-zinc-900` : 'border-white/[0.08] bg-zinc-900/60 hover:border-white/[0.15]'
      }`}
    >
      <span className={`badge ${badgeColors[badgeColor]} mb-3 text-[10px]`}>{badge}</span>
      <h3 className="font-mono text-sm font-bold text-zinc-100 mb-2">{name}</h3>
      <div className="space-y-1.5">
        {columns.map(col => (
          <div key={col.name} className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              col.pk ? 'bg-amber-400' : col.fk ? 'bg-blue-400' : col.unique ? 'bg-emerald-500' : 'bg-zinc-700'
            }`} />
            <span className={`text-xs font-mono truncate ${col.pk ? 'text-amber-300' : col.fk ? 'text-blue-300' : 'text-zinc-500'}`}>
              {col.name}
            </span>
          </div>
        ))}
      </div>
    </button>
  );
}
