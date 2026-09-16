import { schema, students, courses, enrollments } from '@/lib/data';
import { Database, Key, Link2, Hash } from 'lucide-react';

type TableName = keyof typeof schema;

const tableNames: TableName[] = ['students', 'courses', 'enrollments'];

const tablePreviews: Record<TableName, Record<string, string | number>[]> = {
  students: students.slice(0, 5).map(s => ({
    student_id: s.student_id,
    name: s.name,
    department: s.department,
    year: s.year,
    city: s.city,
  })),
  courses: courses.map(c => ({
    course_id: c.course_id,
    course_name: c.course_name,
    department: c.department,
    credits: c.credits,
  })),
  enrollments: enrollments.slice(0, 5).map(e => ({
    enrollment_id: e.enrollment_id,
    student_id: e.student_id,
    course_id: e.course_id,
    marks: e.marks,
    semester: e.semester,
  })),
};

const createSql: Record<TableName, string> = {
  students: `CREATE TABLE students (
  student_id  INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  department  VARCHAR(50)  NOT NULL,
  year        INT          NOT NULL CHECK (year BETWEEN 1 AND 4),
  gender      VARCHAR(10)  NOT NULL,
  city        VARCHAR(50)  NOT NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_students_dept ON students(department);
CREATE INDEX idx_students_city ON students(city);
CREATE INDEX idx_students_year ON students(year);`,

  courses: `CREATE TABLE courses (
  course_id   VARCHAR(10)  PRIMARY KEY,
  course_name VARCHAR(100) NOT NULL,
  department  VARCHAR(50)  NOT NULL,
  credits     INT          NOT NULL CHECK (credits > 0)
);`,

  enrollments: `CREATE TABLE enrollments (
  enrollment_id INT           AUTO_INCREMENT PRIMARY KEY,
  student_id    INT           NOT NULL,
  course_id     VARCHAR(10)   NOT NULL,
  marks         DECIMAL(5,2)  NOT NULL CHECK (marks BETWEEN 0 AND 100),
  semester      VARCHAR(20)   NOT NULL,

  FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON DELETE CASCADE,
  FOREIGN KEY (course_id)  REFERENCES courses(course_id)
    ON DELETE CASCADE,

  UNIQUE KEY uq_enrollment (student_id, course_id)
);

-- Indexes
CREATE INDEX idx_enrollment_student ON enrollments(student_id);
CREATE INDEX idx_enrollment_course  ON enrollments(course_id);`,
};

const tableColor: Record<TableName, { badge: string; accent: string; dot: string }> = {
  students:    { badge: 'badge-blue',   accent: 'border-blue-500/20',   dot: 'bg-blue-400' },
  courses:     { badge: 'badge-amber',  accent: 'border-amber-500/20',  dot: 'bg-amber-400' },
  enrollments: { badge: 'badge-purple', accent: 'border-violet-500/20', dot: 'bg-violet-400' },
};

export default function DatabasePage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-white/[0.06] bg-zinc-900/30">
        <div className="page-container py-8">
          <span className="badge badge-blue mb-3">
            <Database size={10} />
            SCHEMA EXPLORER
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">Database Schema</h1>
          <p className="text-zinc-400 max-w-2xl">
            Three-table normalized schema in 3NF. Full DDL, column definitions, constraints, indexes, and data previews.
          </p>
        </div>
      </div>

      <div className="page-container py-10 space-y-12">
        {tableNames.map(tname => {
          const tschema = schema[tname];
          const color = tableColor[tname];
          const preview = tablePreviews[tname];
          const previewCols = Object.keys(preview[0]);

          return (
            <section key={tname}>
              {/* Table header */}
              <div className="flex items-center gap-3 mb-4">
                <Database size={16} className="text-zinc-500" />
                <h2 className="font-mono text-xl font-bold text-zinc-100">{tname}</h2>
                <span className={`badge ${color.badge}`}>{tschema.rowCount} rows</span>
              </div>
              <p className="text-zinc-500 text-sm mb-6">{tschema.description}</p>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Column definitions */}
                <div className={`glass-raised rounded-xl border overflow-hidden ${color.accent}`}>
                  <div className="px-5 py-3 border-b border-white/[0.05]">
                    <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Columns</span>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.05]">
                        <th className="text-left px-4 py-2.5 text-xs text-zinc-600">Name</th>
                        <th className="text-left px-4 py-2.5 text-xs text-zinc-600">Type</th>
                        <th className="text-left px-4 py-2.5 text-xs text-zinc-600">Constraints</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tschema.columns.map(col => (
                        <tr key={col.name} className="border-b border-white/[0.03] hover:bg-white/[0.01]">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              {col.constraints.includes('PRIMARY KEY') && <Key size={10} className="text-amber-400 shrink-0" />}
                              {col.constraints.includes('FK') && <Link2 size={10} className="text-blue-400 shrink-0" />}
                              {col.constraints.includes('UNIQUE') && <Hash size={10} className="text-emerald-400 shrink-0" />}
                              <span className="font-mono text-xs text-zinc-300">{col.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 font-mono text-xs text-zinc-500">{col.type}</td>
                          <td className="px-4 py-2.5 text-xs text-zinc-600">{col.constraints}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {tschema.indexes.length > 0 && (
                    <div className="px-4 py-3 border-t border-white/[0.04]">
                      <p className="text-xs text-zinc-700 mb-1.5 font-semibold uppercase tracking-wider">Indexes</p>
                      {tschema.indexes.map(idx => (
                        <div key={idx} className="font-mono text-xs text-zinc-500 py-0.5">{idx}</div>
                      ))}
                    </div>
                  )}
                  {tschema.foreignKeys.length > 0 && (
                    <div className="px-4 py-3 border-t border-white/[0.04]">
                      <p className="text-xs text-zinc-700 mb-1.5 font-semibold uppercase tracking-wider">Foreign Keys</p>
                      {tschema.foreignKeys.map(fk => (
                        <div key={fk} className="font-mono text-xs text-blue-400/70 py-0.5 leading-relaxed">{fk}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* DDL + data preview */}
                <div className="space-y-4">
                  {/* CREATE TABLE */}
                  <div className="glass-raised rounded-xl border border-white/[0.07] overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/[0.05]">
                      <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">CREATE TABLE DDL</span>
                    </div>
                    <pre className="p-4 text-xs font-mono text-zinc-400 overflow-x-auto leading-relaxed whitespace-pre">{createSql[tname]}</pre>
                  </div>

                  {/* Data preview */}
                  <div className="glass-raised rounded-xl border border-white/[0.07] overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/[0.05] flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                        Data Preview (first {preview.length} rows)
                      </span>
                      <span className="badge badge-amber text-[10px]">DEMO DATA</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-white/[0.05]">
                            {previewCols.map(col => (
                              <th key={col} className="px-3 py-2 text-left font-mono text-zinc-600">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {preview.map((row, i) => (
                            <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.01]">
                              {previewCols.map(col => (
                                <td key={col} className="px-3 py-2 font-mono text-zinc-500 whitespace-nowrap">
                                  {String(row[col])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
