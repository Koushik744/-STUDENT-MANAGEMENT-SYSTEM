'use client';
import type { QueryResult } from '@/lib/sql-engine';

interface Props {
  result: QueryResult | null;
  loading?: boolean;
}

export default function QueryResult({ result, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
        <span className="text-sm text-zinc-500 font-mono ml-2">Executing query…</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-32 text-zinc-600 text-sm font-mono">
        Run a query to see results
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="p-4 rounded-lg bg-red-950/30 border border-red-500/20">
        <p className="text-sm font-mono text-red-400">
          <span className="text-red-500 font-bold">ERROR: </span>{result.error}
        </p>
      </div>
    );
  }

  if (result.rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-zinc-600 text-sm font-mono">
        No matching records found
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
        <table className="result-table">
          <thead>
            <tr>
              {result.columns.map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <tr key={i}>
                {result.columns.map(col => {
                  const val = row[col];
                  const display = val == null ? <span className="text-zinc-600 italic">NULL</span>
                    : typeof val === 'number' ? String(Number.isInteger(val) ? val : val.toFixed(2))
                    : String(val);
                  return <td key={col}>{display}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-xs text-zinc-600 font-mono">
          {result.rowCount} row{result.rowCount !== 1 ? 's' : ''}
        </span>
        <span className="text-xs text-zinc-700 font-mono">
          {result.executionMs}ms
        </span>
      </div>
    </div>
  );
}
