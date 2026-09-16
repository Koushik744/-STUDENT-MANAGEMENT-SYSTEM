'use client';
import { useState } from 'react';
import SqlBlock from '@/components/SqlBlock';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Zap } from 'lucide-react';

type TxStep = { id: number; sql: string; label: string; status: 'pending' | 'executing' | 'committed' | 'rolled_back' };
type TxState = 'idle' | 'running' | 'committed' | 'rolled_back';

const initialSteps: TxStep[] = [
  { id: 1, sql: 'START TRANSACTION;', label: 'Begin transaction block', status: 'pending' },
  { id: 2, sql: "UPDATE students SET department = 'Data Science'\nWHERE student_id = 5;", label: 'Update student department', status: 'pending' },
  { id: 3, sql: "INSERT INTO enrollments (student_id, course_id, marks, semester)\nVALUES (5, 'DS401', 88.50, 'Spring 2025');", label: 'Insert new enrollment', status: 'pending' },
  { id: 4, sql: "UPDATE enrollments SET marks = 91.00\nWHERE student_id = 5 AND course_id = 'CS101';", label: 'Update existing marks', status: 'pending' },
  { id: 5, sql: 'COMMIT;', label: 'Persist all changes atomically', status: 'pending' },
];

const rollbackSteps: TxStep[] = [
  { id: 1, sql: 'START TRANSACTION;', label: 'Begin transaction block', status: 'pending' },
  { id: 2, sql: "INSERT INTO students (name, email, department, year, gender, city)\nVALUES ('Ghost User', 'ghost@test.com', 'CS', 1, 'M', 'Delhi');", label: 'Insert student (will be undone)', status: 'pending' },
  { id: 3, sql: "INSERT INTO enrollments (student_id, course_id, marks, semester)\nVALUES (LAST_INSERT_ID(), 'CS101', 75.0, 'Spring 2025');", label: 'Insert enrollment (will be undone)', status: 'pending' },
  { id: 4, sql: "-- Simulated error: FK constraint violation\nINSERT INTO enrollments (student_id, course_id, marks, semester)\nVALUES (99999, 'CS101', 50.0, 'Spring 2025');", label: 'ERROR — FK constraint fails', status: 'pending' },
  { id: 5, sql: 'ROLLBACK; -- Entire transaction is undone', label: 'Undo ALL changes since START TRANSACTION', status: 'pending' },
];

const acidProps = [
  {
    letter: 'A',
    name: 'Atomicity',
    color: 'text-blue-400',
    bg: 'bg-blue-500/[0.07]',
    border: 'border-blue-500/20',
    def: 'All operations in a transaction succeed together, or none take effect.',
    demo: 'If the INSERT into enrollments fails after the UPDATE on students, the UPDATE is also undone.',
  },
  {
    letter: 'C',
    name: 'Consistency',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/[0.07]',
    border: 'border-emerald-500/20',
    def: 'Every transaction takes the database from one valid state to another, never violating constraints.',
    demo: 'A student_id FK in enrollments must reference a real students row. An invalid FK triggers a violation and the transaction is rejected.',
  },
  {
    letter: 'I',
    name: 'Isolation',
    color: 'text-violet-400',
    bg: 'bg-violet-500/[0.07]',
    border: 'border-violet-500/20',
    def: "A transaction's intermediate state is invisible to other concurrent transactions until committed.",
    demo: "While one transaction is updating a student's department, a concurrent read will still see the original value until COMMIT.",
  },
  {
    letter: 'D',
    name: 'Durability',
    color: 'text-amber-400',
    bg: 'bg-amber-500/[0.07]',
    border: 'border-amber-500/20',
    def: 'Once committed, changes survive even a system crash or power failure.',
    demo: 'MySQL writes committed data to disk (InnoDB redo logs) before acknowledging the COMMIT to the client.',
  },
];

function TxSimulator({ scenario }: { scenario: 'commit' | 'rollback' }) {
  const steps = scenario === 'commit' ? initialSteps : rollbackSteps;
  const [current, setCurrent] = useState(-1);
  const [txState, setTxState] = useState<TxState>('idle');
  const [stepStates, setStepStates] = useState<TxStep['status'][]>(steps.map(() => 'pending'));

  const reset = () => { setCurrent(-1); setTxState('idle'); setStepStates(steps.map(() => 'pending')); };

  const advance = () => {
    const next = current + 1;
    if (next >= steps.length) return;

    setTxState(next === 0 ? 'running' : txState);

    setStepStates(prev => {
      const copy = [...prev];
      const isError = scenario === 'rollback' && next === steps.length - 2;
      const isFinal = next === steps.length - 1;

      if (isError) {
        copy[next] = 'rolled_back';
      } else if (isFinal) {
        copy[next] = scenario === 'commit' ? 'committed' : 'rolled_back';
        // update all previous
        copy.forEach((_, i) => {
          if (i < next) copy[i] = scenario === 'commit' ? 'committed' : 'rolled_back';
        });
      } else {
        copy[next] = 'executing';
      }
      return copy;
    });

    if (next === steps.length - 1) {
      setTxState(scenario === 'commit' ? 'committed' : 'rolled_back');
    }

    setCurrent(next);
  };

  const statusIcon = (s: TxStep['status']) => {
    if (s === 'committed') return <CheckCircle size={13} className="text-emerald-400 shrink-0" />;
    if (s === 'rolled_back') return <XCircle size={13} className="text-red-400 shrink-0" />;
    if (s === 'executing') return <Zap size={13} className="text-amber-400 shrink-0" />;
    return <div className="w-[13px] h-[13px] rounded-full border border-zinc-700 shrink-0" />;
  };

  const borderMap: Record<TxStep['status'], string> = {
    pending: 'border-white/[0.06]',
    executing: 'border-amber-500/30 bg-amber-500/[0.04]',
    committed: 'border-emerald-500/20 bg-emerald-500/[0.03]',
    rolled_back: 'border-red-500/20 bg-red-500/[0.04]',
  };

  return (
    <div className="glass-raised rounded-xl border border-white/[0.07] overflow-hidden">
      <div className={`px-5 py-3 border-b border-white/[0.06] flex items-center justify-between ${
        scenario === 'commit' ? 'bg-emerald-500/[0.04]' : 'bg-red-500/[0.04]'
      }`}>
        <div className="flex items-center gap-2">
          {scenario === 'commit'
            ? <CheckCircle size={14} className="text-emerald-400" />
            : <XCircle size={14} className="text-red-400" />}
          <span className={`text-sm font-semibold ${scenario === 'commit' ? 'text-emerald-400' : 'text-red-400'}`}>
            {scenario === 'commit' ? 'Successful COMMIT' : 'ROLLBACK on Error'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {txState !== 'idle' && (
            <span className={`badge text-[10px] ${
              txState === 'committed' ? 'badge-green' : txState === 'rolled_back' ? 'badge-red' : 'badge-amber'
            }`}>
              {txState.toUpperCase().replace('_', ' ')}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2">
        {steps.map((step, i) => (
          <div key={step.id}
            className={`rounded-lg border p-3 transition-all ${borderMap[stepStates[i]]}`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{statusIcon(stepStates[i])}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-zinc-600 mb-1">{step.label}</div>
                <div className="font-mono text-xs text-zinc-400 whitespace-pre-wrap leading-relaxed">{step.sql}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={advance}
          disabled={current >= steps.length - 1}
          className="flex-1 py-2 rounded-lg bg-zinc-800 border border-white/[0.08] text-sm text-zinc-200 font-medium hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {current === -1 ? 'Start Simulation' : current >= steps.length - 1 ? 'Complete' : 'Next Step →'}
        </button>
        <button onClick={reset}
          className="px-3 py-2 rounded-lg border border-white/[0.08] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
          <RefreshCw size={14} />
        </button>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-white/[0.06] bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <span className="badge badge-amber mb-3">TRANSACTIONS</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">ACID Transactions</h1>
          <p className="text-zinc-400 max-w-2xl">
            How MySQL InnoDB ensures data integrity using START TRANSACTION, COMMIT, and ROLLBACK.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {/* ── ACID properties ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-zinc-100 mb-6">ACID Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {acidProps.map(p => (
              <div key={p.letter} className={`rounded-xl border p-5 ${p.bg} ${p.border}`}>
                <div className={`text-4xl font-black font-mono mb-3 ${p.color}`}>{p.letter}</div>
                <div className="text-sm font-bold text-zinc-200 mb-2">{p.name}</div>
                <p className="text-xs text-zinc-500 leading-relaxed mb-3">{p.def}</p>
                <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04]">
                  <p className="text-xs text-zinc-600 italic leading-relaxed">{p.demo}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Step-through simulators ───────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-zinc-100 mb-2">Step-Through Simulation</h2>
          <p className="text-zinc-500 text-sm mb-6">
            Click <strong className="text-zinc-300">Next Step</strong> to advance each transaction statement and observe how state changes.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TxSimulator scenario="commit" />
            <TxSimulator scenario="rollback" />
          </div>
        </section>

        {/* ── Raw SQL ────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-zinc-100 mb-6">MySQL Transaction SQL</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-raised rounded-xl border border-white/[0.07] p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={14} className="text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">Successful Transaction</span>
              </div>
              <SqlBlock code={`START TRANSACTION;

-- 1. Update department
UPDATE students
SET department = 'Data Science'
WHERE student_id = 5;

-- 2. Add course enrollment
INSERT INTO enrollments
  (student_id, course_id, marks, semester)
VALUES
  (5, 'DS401', 88.50, 'Spring 2025');

-- 3. Update previous marks
UPDATE enrollments
SET marks = 91.00
WHERE student_id = 5
  AND course_id = 'CS101';

-- All 3 statements succeed → persist
COMMIT;`} showLineNumbers />
            </div>

            <div className="glass-raised rounded-xl border border-white/[0.07] p-5">
              <div className="flex items-center gap-2 mb-4">
                <XCircle size={14} className="text-red-400" />
                <span className="text-sm font-semibold text-red-400">Rollback on Error</span>
              </div>
              <SqlBlock code={`START TRANSACTION;

-- 1. Insert new student
INSERT INTO students
  (name, email, department, year, gender, city)
VALUES
  ('Ghost User', 'ghost@test.com',
   'CS', 1, 'M', 'Delhi');

-- 2. Valid enrollment for new student
INSERT INTO enrollments
  (student_id, course_id, marks, semester)
VALUES
  (LAST_INSERT_ID(), 'CS101',
   75.0, 'Spring 2025');

-- 3. INVALID student_id → FK violation!
INSERT INTO enrollments
  (student_id, course_id, marks, semester)
VALUES
  (99999, 'CS101', 50.0, 'Spring 2025');

-- Error caught → undo EVERYTHING
ROLLBACK;`} showLineNumbers />
              <div className="mt-3 p-3 rounded-lg bg-red-500/[0.06] border border-red-500/15">
                <p className="text-xs text-zinc-500">
                  After ROLLBACK: the student inserted in step 1 and the enrollment from step 2 are both gone. Atomicity guarantees that partial state is never committed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── MySQL vs SQLite note ───────────────────────────────────────── */}
        <section>
          <div className="glass-raised rounded-xl border border-amber-500/20 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-amber-400 mb-2">MySQL InnoDB vs SQLite Transactions</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                  The transactions in <code className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-xs">transactions.sql</code> are written for <strong className="text-zinc-200">MySQL InnoDB</strong>,
                  which supports full ACID transactions natively.
                  The Python CLI (<code className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-xs">app.py</code>) uses SQLite (via <code className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-xs">sqlite3</code>)
                  which also supports transactions but uses different API calls.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-zinc-900 border border-white/[0.06]">
                    <div className="text-zinc-600 mb-2">MySQL</div>
                    <div className="text-zinc-400">START TRANSACTION;</div>
                    <div className="text-zinc-400">-- ... statements ...</div>
                    <div className="text-emerald-400">COMMIT;</div>
                    <div className="text-red-400">ROLLBACK;</div>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-white/[0.06]">
                    <div className="text-zinc-600 mb-2">Python sqlite3</div>
                    <div className="text-zinc-400">conn = sqlite3.connect(...)</div>
                    <div className="text-zinc-400">conn.execute(sql)</div>
                    <div className="text-emerald-400">conn.commit()</div>
                    <div className="text-red-400">conn.rollback()</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
