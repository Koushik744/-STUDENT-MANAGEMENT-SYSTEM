'use client';
import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

// ── SQL syntax highlighter ────────────────────────────────────────────────────

const KEYWORDS = new Set([
  'SELECT','FROM','WHERE','JOIN','INNER','LEFT','RIGHT','OUTER','ON',
  'GROUP','BY','ORDER','HAVING','LIMIT','OFFSET','AS','DISTINCT',
  'AND','OR','NOT','IN','IS','NULL','LIKE','BETWEEN','EXISTS',
  'INSERT','INTO','VALUES','UPDATE','SET','DELETE',
  'CREATE','DROP','ALTER','TABLE','INDEX','DATABASE','USE',
  'START','TRANSACTION','COMMIT','ROLLBACK','BEGIN',
  'PREPARE','EXECUTE','DEALLOCATE','USING',
  'PRIMARY','FOREIGN','KEY','REFERENCES','CASCADE','UNIQUE',
  'NOT','NULL','CHECK','DEFAULT','AUTO_INCREMENT','AUTOINCREMENT',
  'ASC','DESC','CASE','WHEN','THEN','ELSE','END','WITH',
]);

const FUNCTIONS = new Set([
  'COUNT','SUM','AVG','MAX','MIN','ROUND','UPPER','LOWER',
  'CONCAT','LENGTH','SUBSTRING','TRIM','COALESCE','IFNULL',
  'NOW','DATE','YEAR','MONTH','DAY','CAST','CONVERT',
  'IF','NULLIF','CURRENT_TIMESTAMP',
]);

function highlightSQL(sql: string): React.ReactNode[] {
  const lines = sql.split('\n');
  return lines.map((line, li) => {
    const nodes: React.ReactNode[] = [];
    let i = 0;

    while (i < line.length) {
      // Line comment
      if (line[i] === '-' && line[i + 1] === '-') {
        nodes.push(<span key={`${li}-c${i}`} className="sql-comment">{line.slice(i)}</span>);
        break;
      }

      // String literal
      if (line[i] === "'" || line[i] === '"') {
        const q = line[i];
        let j = i + 1;
        while (j < line.length && line[j] !== q) j++;
        nodes.push(<span key={`${li}-s${i}`} className="sql-string">{line.slice(i, j + 1)}</span>);
        i = j + 1;
        continue;
      }

      // Number
      if (/\d/.test(line[i]) && (i === 0 || /[\s,()=<>!]/.test(line[i - 1]))) {
        let j = i;
        while (j < line.length && /[\d.]/.test(line[j])) j++;
        nodes.push(<span key={`${li}-n${i}`} className="sql-number">{line.slice(i, j)}</span>);
        i = j;
        continue;
      }

      // Placeholder ?
      if (line[i] === '?') {
        nodes.push(<span key={`${li}-p${i}`} className="sql-placeholder">?</span>);
        i++;
        continue;
      }

      // Word token
      if (/[a-zA-Z_@]/.test(line[i])) {
        let j = i;
        while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
        const word = line.slice(i, j);
        const upper = word.toUpperCase();
        if (KEYWORDS.has(upper)) {
          nodes.push(<span key={`${li}-k${i}`} className="sql-keyword">{word}</span>);
        } else if (FUNCTIONS.has(upper)) {
          nodes.push(<span key={`${li}-f${i}`} className="sql-function">{word}</span>);
        } else if (/^(s|e|c)\.\w+$/.test(word) || (j < line.length && line[j] === '.')) {
          // Table alias or table name
          nodes.push(<span key={`${li}-t${i}`} className="sql-table">{word}</span>);
        } else {
          nodes.push(<span key={`${li}-id${i}`} className="sql-column">{word}</span>);
        }
        i = j;
        continue;
      }

      // Dot after alias
      if (line[i] === '.' && nodes.length > 0) {
        nodes.push(<span key={`${li}-dot${i}`} className="sql-punct">.</span>);
        i++;
        // Next word is a column
        let j = i;
        while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
        if (j > i) {
          nodes.push(<span key={`${li}-col${i}`} className="sql-column">{line.slice(i, j)}</span>);
          i = j;
        }
        continue;
      }

      // Operators
      if (/[=<>!*,();]/.test(line[i])) {
        nodes.push(<span key={`${li}-op${i}`} className="sql-punct">{line[i]}</span>);
        i++;
        continue;
      }

      // Whitespace
      if (/\s/.test(line[i])) {
        let j = i;
        while (j < line.length && /\s/.test(line[j])) j++;
        nodes.push(line.slice(i, j));
        i = j;
        continue;
      }

      nodes.push(line[i]);
      i++;
    }

    return (
      <span key={li}>
        {nodes}
        {li < lines.length - 1 ? '\n' : ''}
      </span>
    );
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

interface SqlBlockProps {
  code: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
  maxHeight?: string;
}

export default function SqlBlock({ code, title, showLineNumbers = false, className = '', maxHeight }: SqlBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const highlighted = highlightSQL(code.trim());
  const lines = code.trim().split('\n');

  return (
    <div className={`sql-block relative group ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
          <span className="text-xs font-mono font-semibold text-zinc-500 tracking-widest uppercase">{title}</span>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
        </div>
      )}

      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md
          bg-zinc-800/80 border border-white/[0.08] text-zinc-400 hover:text-zinc-200
          opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer text-xs"
        aria-label="Copy SQL"
      >
        {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
        {copied ? 'Copied' : 'Copy'}
      </button>

      <div
        className="p-4 overflow-x-auto"
        style={maxHeight ? { maxHeight, overflowY: 'auto' } : {}}
      >
        {showLineNumbers ? (
          <table className="border-collapse w-full">
            <tbody>
              {lines.map((_, idx) => (
                <tr key={idx}>
                  <td className="select-none pr-4 text-right text-zinc-700 text-xs w-6 align-top leading-[1.65]">{idx + 1}</td>
                  <td className="align-top leading-[1.65]">
                    <span className="font-mono text-[13.5px]">{highlightSQL(lines[idx])}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre className="text-[13.5px] leading-[1.65] whitespace-pre-wrap break-words font-mono">
            {highlighted}
          </pre>
        )}
      </div>
    </div>
  );
}
