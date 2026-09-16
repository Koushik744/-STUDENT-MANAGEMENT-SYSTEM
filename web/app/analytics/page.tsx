'use client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';

import {
  getStudentsByDepartment,
  getAvgMarksByCourse,
  getEnrollmentDistribution,
  getMarksBand,
  stats,
} from '@/lib/data';
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react';

const DEPT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
const COURSE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

const tooltipStyle = {
  contentStyle: { backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px' },
  labelStyle: { color: '#a1a1aa' },
  itemStyle: { color: '#e4e4e7' },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fmtAvg = (v: any) => [`${Number(v ?? 0).toFixed(1)}`, 'Avg'] as [string, string];

const bandColor: Record<string, string> = {
  '90-100': '#10b981',
  '80-89':  '#3b82f6',
  '70-79':  '#f59e0b',
  '< 70':   '#ef4444',
};

export default function AnalyticsPage() {
  const deptData    = getStudentsByDepartment();   // { name, value }[]
  const courseData  = getAvgMarksByCourse();        // { name, avg }[]
  const enrollData  = getEnrollmentDistribution();  // { name, value, full }[]
  const bandData    = getMarksBand();               // { name, value }[]

  return (
    <div className="min-h-screen">
      <div className="border-b border-white/[0.06] bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <span className="badge badge-blue mb-3">ANALYTICS</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">Dataset Analytics</h1>
          <p className="text-zinc-400 max-w-2xl">
            Visual analysis of the embedded 25-student demo dataset. All charts are derived from the same data used in the SQL Lab.
            <span className="ml-2 badge badge-amber text-[10px]">DEMO DATA</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* ── Stats row ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Users,      label: 'Students',    value: stats.totalStudents,          color: 'text-blue-400' },
            { icon: BookOpen,   label: 'Courses',     value: stats.totalCourses,           color: 'text-emerald-400' },
            { icon: Award,      label: 'Enrollments', value: stats.totalEnrollments,       color: 'text-violet-400' },
            { icon: TrendingUp, label: 'Avg Marks',   value: stats.avgMarks.toFixed(1),    color: 'text-amber-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-raised rounded-xl border border-white/[0.07] p-5 flex items-center gap-4">
              <Icon size={18} className={color} />
              <div>
                <div className="text-2xl font-bold text-zinc-100">{value}</div>
                <div className="text-xs text-zinc-600">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Row 1: Dept bar + enroll pie ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-raised rounded-xl border border-white/[0.07] p-5">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Students by Department</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {deptData.map((_, i) => (
                    <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-raised rounded-xl border border-white/[0.07] p-5">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Enrollments per Course</h2>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={220}>
                <PieChart>
                  <Pie data={enrollData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={2}>
                    {enrollData.map((_, i) => (
                      <Cell key={i} fill={COURSE_COLORS[i % COURSE_COLORS.length]} fillOpacity={0.9} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5">
                {enrollData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COURSE_COLORS[i % COURSE_COLORS.length] }} />
                    <span className="text-xs text-zinc-500 font-mono">{d.name}</span>
                    <span className="text-xs text-zinc-600">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Avg marks bar ─────────────────────────────────────── */}
        <div className="glass-raised rounded-xl border border-white/[0.07] p-5">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Average Marks by Course</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={courseData} layout="vertical" barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip {...tooltipStyle} formatter={fmtAvg} />
              <Bar dataKey="avg" radius={[0, 4, 4, 0]}>
                {courseData.map((_, i) => (
                  <Cell key={i} fill={COURSE_COLORS[i % COURSE_COLORS.length]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Row 3: Marks band + line ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-raised rounded-xl border border-white/[0.07] p-5">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Marks Distribution Bands</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bandData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {bandData.map((d) => (
                    <Cell key={d.name} fill={bandColor[d.name] ?? '#71717a'} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-raised rounded-xl border border-white/[0.07] p-5">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Avg Marks by Course (Line)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={courseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 95]} tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} formatter={fmtAvg} />
                <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── SQL behind the charts ────────────────────────────────────── */}
        <section className="glass-raised rounded-xl border border-white/[0.07] p-5">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">SQL Behind These Charts</h2>
          <p className="text-xs text-zinc-600 mb-3">Try these queries in the <a href="/sql-lab" className="text-blue-400 hover:underline">SQL Lab</a>:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            {[
              { label: 'Students by department', sql: 'SELECT department, COUNT(*) AS count\nFROM students\nGROUP BY department\nORDER BY count DESC' },
              { label: 'Avg marks by course', sql: 'SELECT c.course_id,\n  ROUND(AVG(e.marks), 1) AS avg\nFROM enrollments e\nJOIN courses c ON e.course_id = c.course_id\nGROUP BY c.course_id' },
            ].map(({ label, sql }) => (
              <div key={label} className="p-3 rounded-lg bg-zinc-900 border border-white/[0.06]">
                <div className="text-zinc-600 mb-2">{label}</div>
                <pre className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{sql}</pre>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
