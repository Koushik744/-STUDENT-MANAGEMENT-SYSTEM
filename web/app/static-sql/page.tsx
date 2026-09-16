import SqlBlock from '@/components/SqlBlock';
import { Lock, CheckCircle, Info } from 'lucide-react';

const staticQueries = [
  {
    id: 'Q1',
    name: 'View All Students',
    description: 'Retrieves the complete student directory with no filtering criteria.',
    concepts: ['SELECT', 'ORDER BY'],
    why: 'No WHERE clause. The query structure is entirely fixed — no user input can alter it.',
    sql: `SELECT student_id, name, email, department, year, gender, city
FROM students
ORDER BY student_id ASC;`,
    expectedNote: '25 rows — all students ordered by ID.',
    interviewQ: 'Why is this classified as Static SQL?',
    interviewA: 'Because the entire query text is hardcoded. No user input influences any part of the query at runtime.',
  },
  {
    id: 'Q2',
    name: 'Computer Science Students',
    description: "Filters students enrolled in the Computer Science department using a hardcoded string literal.",
    concepts: ['WHERE (literal)', 'ORDER BY'],
    why: "The predicate department = 'Computer Science' is a compile-time constant. It cannot change.",
    sql: `SELECT student_id, name, email, year, gender, city
FROM students
WHERE department = 'Computer Science'
ORDER BY name ASC;`,
    expectedNote: '9 rows — CS department only.',
    interviewQ: 'What makes the WHERE condition here "static"?',
    interviewA: "The string 'Computer Science' is a literal embedded in the source code. It is not a runtime parameter and cannot be changed by user input.",
  },
  {
    id: 'Q3',
    name: '3rd Year Students',
    description: 'Identifies all 3rd-year students using a hardcoded integer predicate.',
    concepts: ['WHERE (integer literal)', 'Multi-column ORDER BY'],
    why: 'The value 3 is hardcoded. There is no ? placeholder, no PREPARE statement, no user input.',
    sql: `SELECT student_id, name, department, gender, city
FROM students
WHERE year = 3
ORDER BY department ASC, name ASC;`,
    expectedNote: '9 rows — year = 3.',
    interviewQ: 'Could an attacker inject SQL through this query?',
    interviewA: 'No. There is no user input at all. Static SQL has no injection surface because user data is never incorporated into the query text.',
  },
  {
    id: 'Q4',
    name: 'Students from Hyderabad',
    description: 'Locates all students with residential city = Hyderabad.',
    concepts: ['WHERE (string literal)'],
    why: "The string 'Hyderabad' is a predetermined constant — it cannot be changed without modifying source code.",
    sql: `SELECT student_id, name, department, year, city
FROM students
WHERE city = 'Hyderabad'
ORDER BY name ASC;`,
    expectedNote: '8 rows — Hyderabad residents.',
    interviewQ: "Why not just ask the user which city they want?",
    interviewA: 'This module intentionally demonstrates queries with fixed, predetermined criteria. Dynamic user-driven search is in the Dynamic SQL module, which uses parameter binding.',
  },
  {
    id: 'Q5',
    name: 'High Achievers — Marks > 80',
    description: '3-table INNER JOIN with a fixed marks threshold. Demonstrates relational data retrieval across students, enrollments, and courses.',
    concepts: ['INNER JOIN × 2', 'WHERE (numeric threshold)', 'ORDER BY'],
    why: 'Both the JOIN structure and the threshold (80.00) are hardcoded. The query cannot change at runtime.',
    sql: `SELECT s.student_id, s.name AS student_name,
       s.department, c.course_name,
       e.marks, e.semester
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
INNER JOIN courses c ON e.course_id = c.course_id
WHERE e.marks > 80.00
ORDER BY e.marks DESC;`,
    expectedNote: '38 rows — all enrollment records with marks > 80.',
    interviewQ: 'Why is a JOIN query still considered Static SQL?',
    interviewA: "Because the JOIN structure, the join conditions (ON s.student_id = e.student_id), and the filter threshold (80.00) are all hardcoded. Static SQL is about the fixity of the query structure, not about its complexity.",
  },
  {
    id: 'Q6',
    name: 'Average Marks by Department',
    description: 'Computes departmental benchmark scores using AVG() aggregate grouped by department.',
    concepts: ['JOIN', 'GROUP BY', 'AVG()', 'COUNT(DISTINCT)', 'ROUND()'],
    why: 'The grouping key and aggregation logic are fully defined at development time.',
    sql: `SELECT s.department,
       COUNT(DISTINCT s.student_id) AS total_students,
       ROUND(AVG(e.marks), 2) AS average_marks
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
GROUP BY s.department
ORDER BY average_marks DESC;`,
    expectedNote: '5 rows — one per department.',
    interviewQ: 'Why use COUNT(DISTINCT student_id) instead of COUNT(*)?',
    interviewA: 'Because students can be enrolled in multiple courses. COUNT(*) would count each enrollment, inflating the "student count". COUNT(DISTINCT student_id) counts each student only once regardless of how many courses they are enrolled in.',
  },
  {
    id: 'Q7',
    name: 'MAX / MIN / AVG Marks',
    description: 'Simple aggregate functions applied to the entire enrollments table — no filtering.',
    concepts: ['MAX()', 'MIN()', 'AVG()', 'ROUND()'],
    why: 'The aggregation covers the entire table with no filtering. Structure is fully predetermined.',
    sql: `SELECT MAX(marks) AS highest_marks,
       MIN(marks) AS lowest_marks,
       ROUND(AVG(marks), 2) AS overall_average
FROM enrollments;`,
    expectedNote: '1 row — global statistics.',
    interviewQ: 'What is the difference between WHERE and HAVING in aggregation queries?',
    interviewA: 'WHERE filters individual rows before grouping. HAVING filters groups after GROUP BY has been applied. You cannot use WHERE to filter aggregated values like AVG() — that requires HAVING.',
  },
  {
    id: 'Q8',
    name: 'Department Headcount',
    description: 'Counts the number of students per department using COUNT(*) and GROUP BY.',
    concepts: ['COUNT(*)', 'GROUP BY', 'ORDER BY'],
    why: 'Standard statistical query. Grouping key and count are determined at compile time.',
    sql: `SELECT department, COUNT(*) AS student_count
FROM students
GROUP BY department
ORDER BY student_count DESC;`,
    expectedNote: '5 rows — one per department.',
    interviewQ: 'What does GROUP BY actually do internally?',
    interviewA: 'The database engine partitions all rows into groups where rows with the same value in the GROUP BY column are placed together. Aggregate functions are then computed independently for each partition.',
  },
  {
    id: 'Q9',
    name: 'CS101 Enrollment Roster',
    description: "Lists all students enrolled in 'Database Management Systems' (CS101) with their marks.",
    concepts: ['INNER JOIN × 2', "WHERE (fixed course_id = 'CS101')"],
    why: "The course identifier 'CS101' is a hardcoded literal — no user input determines which course is shown.",
    sql: `SELECT s.student_id, s.name AS student_name,
       s.department, c.course_id,
       c.course_name, e.marks, e.semester
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
INNER JOIN courses c ON e.course_id = c.course_id
WHERE c.course_id = 'CS101'
ORDER BY e.marks DESC;`,
    expectedNote: '11 rows — all CS101 enrollments.',
    interviewQ: 'What index would you create to speed this query up?',
    interviewA: 'idx_enrollment_course_id ON enrollments(course_id) — this allows the database to quickly locate all enrollments for CS101 without scanning the full enrollments table. This index is already created in the project schema.',
  },
];

export default function StaticSqlPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-zinc-900/30">
        <div className="page-container py-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="badge badge-blue">MODULE 1</span>
            <span className="badge badge-green">
              <Lock size={10} />
              STATIC SQL
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">Static SQL</h1>
          <p className="text-zinc-400 max-w-2xl leading-relaxed">
            Fixed query structures with predetermined conditions hardcoded before execution.
            No user input. No <code className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-xs text-zinc-300">PREPARE</code> / <code className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-xs text-zinc-300">EXECUTE</code>.
            No string concatenation.
          </p>

          {/* Definition card */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: CheckCircle, label: 'Fixed text', desc: 'Query text unchanging at runtime', color: 'text-emerald-400' },
              { icon: Lock,         label: 'Fixed criteria', desc: 'Literal values in WHERE clauses',   color: 'text-blue-400' },
              { icon: CheckCircle, label: 'No PREPARE', desc: 'No prepared statement commands',  color: 'text-emerald-400' },
              { icon: CheckCircle, label: 'Injection-safe', desc: 'No user input, no attack surface',  color: 'text-emerald-400' },
            ].map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-lg glass border border-white/[0.06]">
                <Icon size={15} className={`${color} mt-0.5 shrink-0`} />
                <div>
                  <div className="text-sm font-semibold text-zinc-200">{label}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Query list */}
      <div className="page-container py-10">
        <div className="flex flex-col gap-8">
          {staticQueries.map((q) => (
            <div key={q.id} className="glass-raised rounded-xl border border-white/[0.07] overflow-hidden">
              {/* Query header */}
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-zinc-600">{q.id}</span>
                    <h2 className="text-lg font-semibold text-zinc-100">{q.name}</h2>
                  </div>
                  <p className="text-sm text-zinc-500">{q.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {q.concepts.map(c => (
                      <span key={c} className="badge badge-blue text-[10px]">{c}</span>
                    ))}
                  </div>
                </div>
                <span className="badge badge-green shrink-0">STATIC</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* SQL block */}
                <div className="p-4 border-r border-white/[0.05]">
                  <SqlBlock code={q.sql} title="SQL" showLineNumbers />
                  <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
                    <Info size={11} />
                    <span>{q.expectedNote}</span>
                  </div>
                </div>

                {/* Why static + interview */}
                <div className="p-5 flex flex-col gap-4">
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Why Static SQL?</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{q.why}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-500/[0.06] border border-amber-500/15">
                    <p className="text-xs font-semibold text-amber-400 mb-1.5">Interview Question</p>
                    <p className="text-sm text-zinc-300 italic mb-2">&ldquo;{q.interviewQ}&rdquo;</p>
                    <p className="text-sm text-zinc-500">{q.interviewA}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
