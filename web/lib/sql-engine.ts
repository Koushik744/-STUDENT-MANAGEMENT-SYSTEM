'use client';
// Lightweight SQL interpreter — handles the subset of queries used in this project.
// Supports: SELECT ... FROM ... [JOIN] [WHERE] [GROUP BY] [ORDER BY] [LIMIT]

import { students, courses, enrollments } from './data';

type Row = Record<string, unknown>;

const DB: Record<string, Row[]> = {
  students:    students as unknown as Row[],
  courses:     courses  as unknown as Row[],
  enrollments: enrollments as unknown as Row[],
};

export interface QueryResult {
  columns: string[];
  rows: Row[];
  rowCount: number;
  executionMs: number;
  error?: string;
}

// ── Tokenizer ────────────────────────────────────────────────────────────────

function tokenize(sql: string): string[] {
  // Normalize and split on whitespace while keeping quoted strings intact
  return sql
    .replace(/\s+/g, ' ')
    .trim()
    .match(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^\s,()]+|[(),])/g) ?? [];
}

// ── Expression evaluator ─────────────────────────────────────────────────────

function evalExpr(expr: string, row: Row): unknown {
  const e = expr.trim();
  // Null literal
  if (/^NULL$/i.test(e)) return null;
  // String literal
  const strMatch = e.match(/^'(.*)'$/);
  if (strMatch) return strMatch[1];
  // Number literal
  if (/^-?\d+(\.\d+)?$/.test(e)) return parseFloat(e);
  // Qualified column: table.column
  const dotMatch = e.match(/^(\w+)\.(\w+)$/);
  if (dotMatch) {
    const key = dotMatch[2].toLowerCase();
    return row[key] ?? row[`${dotMatch[1].toLowerCase()}.${key}`] ?? null;
  }
  // Simple column name
  const lower = e.toLowerCase();
  if (lower in row) return row[lower];
  // Try case-insensitive
  const found = Object.keys(row).find(k => k.toLowerCase() === lower);
  return found ? row[found] : null;
}

function compare(left: unknown, op: string, right: unknown): boolean {
  const l = left == null ? null : (typeof left === 'string' ? left : Number(left));
  const r = right == null ? null : (typeof right === 'string' ? right : Number(right));
  if (l === null || r === null) return false;
  switch (op) {
    case '=':  return l === r || String(l).toLowerCase() === String(r).toLowerCase();
    case '!=': case '<>': return l !== r;
    case '>':  return Number(l) > Number(r);
    case '>=': return Number(l) >= Number(r);
    case '<':  return Number(l) < Number(r);
    case '<=': return Number(l) <= Number(r);
    default:   return false;
  }
}

// ── WHERE clause evaluator ───────────────────────────────────────────────────

type Condition = { left: string; op: string; right: string };
type LogicNode = { type: 'AND' | 'OR'; left: LogicNode | Condition; right: LogicNode | Condition } | Condition;

function parseCondition(tokens: string[], pos: number): { node: LogicNode; pos: number } {
  let leftStr = '';
  let op = '';
  let rightStr = '';

  // Skip optional parenthesis groups for simple conditions
  while (pos < tokens.length && tokens[pos] === '(') pos++;

  leftStr = tokens[pos++] ?? '';
  // Handle qualified names: table.col
  if (tokens[pos] === '.') { leftStr += '.' + tokens[pos + 1]; pos += 2; }

  op = tokens[pos++] ?? '';
  rightStr = tokens[pos++] ?? '';
  while (pos < tokens.length && tokens[pos] === ')') pos++;

  const node: Condition = { left: leftStr, op, right: rightStr };

  if (pos < tokens.length && /^AND$/i.test(tokens[pos])) {
    pos++;
    const right = parseCondition(tokens, pos);
    return { node: { type: 'AND', left: node, right: right.node }, pos: right.pos };
  }
  if (pos < tokens.length && /^OR$/i.test(tokens[pos])) {
    pos++;
    const right = parseCondition(tokens, pos);
    return { node: { type: 'OR', left: node, right: right.node }, pos: right.pos };
  }
  return { node, pos };
}

function evalCondition(node: LogicNode, row: Row): boolean {
  if ('type' in node) {
    const l = evalCondition(node.left, row);
    const r = evalCondition(node.right, row);
    return node.type === 'AND' ? l && r : l || r;
  }
  const left  = evalExpr(node.left, row);
  const right = evalExpr(node.right, row);
  return compare(left, node.op, right);
}

// ── Aggregate functions ──────────────────────────────────────────────────────

function applyAggregates(
  selectTokens: string[],
  groups: Map<string, Row[]>
): { columns: string[]; rows: Row[] } {
  const columns: string[] = [];
  const colDefs: { alias: string; expr: string }[] = [];

  // Parse SELECT list: col [AS alias], func(col) [AS alias], ...
  const selectStr = selectTokens.join(' ');
  const parts = selectStr.split(/,(?![^(]*\))/); // split on comma not inside parens

  for (const part of parts) {
    const t = part.trim();
    const aliasMatch = t.match(/^(.+?)\s+AS\s+(\w+)$/i);
    const alias = aliasMatch ? aliasMatch[2] : t.replace(/[^a-zA-Z0-9_.]/g, '_').replace(/\(.*\)/, '');
    const expr  = aliasMatch ? aliasMatch[1].trim() : t;
    colDefs.push({ alias, expr });
    columns.push(alias);
  }

  const rows: Row[] = [];
  for (const [, groupRows] of groups) {
    const row: Row = {};
    for (const { alias, expr } of colDefs) {
      const funcMatch = expr.match(/^(\w+)\s*\(\s*(DISTINCT\s+)?(.+?)\s*\)$/i);
      if (funcMatch) {
        const fn   = funcMatch[1].toUpperCase();
        const dist = !!funcMatch[2];
        const col  = funcMatch[3];
        const vals = groupRows.map(r => evalExpr(col === '*' ? 'enrollment_id' : col, r));
        const nums = vals.filter(v => v !== null).map(Number);
        const uniq = dist ? [...new Set(vals)] : vals;
        switch (fn) {
          case 'COUNT': row[alias] = col === '*' ? groupRows.length : uniq.filter(v => v !== null).length; break;
          case 'SUM':   row[alias] = nums.reduce((a, b) => a + b, 0); break;
          case 'AVG':   row[alias] = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0; break;
          case 'MAX':   row[alias] = nums.length ? Math.max(...nums) : null; break;
          case 'MIN':   row[alias] = nums.length ? Math.min(...nums) : null; break;
          case 'ROUND': {
            const inner = col.split(',');
            const val = evalExpr(inner[0].trim(), groupRows[0]);
            const dec = inner[1] ? parseInt(inner[1].trim()) : 0;
            row[alias] = Math.round(Number(val) * Math.pow(10, dec)) / Math.pow(10, dec);
            break;
          }
          default: row[alias] = null;
        }
      } else {
        // Check for ROUND(expr, n) outside aggregate context
        const roundMatch = expr.match(/^ROUND\s*\(\s*(.+?)\s*,\s*(\d+)\s*\)$/i);
        if (roundMatch) {
          const val = evalExpr(roundMatch[1], groupRows[0]);
          const dec = parseInt(roundMatch[2]);
          row[alias] = Math.round(Number(val) * Math.pow(10, dec)) / Math.pow(10, dec);
        } else {
          row[alias] = evalExpr(expr, groupRows[0]);
        }
      }
    }
    rows.push(row);
  }
  return { columns, rows };
}

// ── Simple SELECT projection ─────────────────────────────────────────────────

function projectRow(selectTokens: string[], row: Row): Row {
  if (selectTokens.length === 1 && selectTokens[0] === '*') return { ...row };
  const result: Row = {};
  const selectStr = selectTokens.join(' ');
  const parts = selectStr.split(/,(?![^(]*\))/);

  for (const part of parts) {
    const t = part.trim();
    // ROUND(expr, n) AS alias
    const roundMatch = t.match(/^ROUND\s*\((.+?),\s*(\d+)\)\s*(?:AS\s+(\w+))?$/i);
    if (roundMatch) {
      const val = evalExpr(roundMatch[1].trim(), row);
      const dec = parseInt(roundMatch[2]);
      const alias = roundMatch[3] ?? `ROUND_${roundMatch[1].trim()}`;
      result[alias] = Math.round(Number(val) * Math.pow(10, dec)) / Math.pow(10, dec);
      continue;
    }
    // expr AS alias
    const aliasMatch = t.match(/^(.+?)\s+AS\s+(\w+)$/i);
    if (aliasMatch) {
      result[aliasMatch[2]] = evalExpr(aliasMatch[1].trim(), row);
      continue;
    }
    // Simple column or qualified column
    const dotMatch = t.match(/^(\w+)\.(\w+)$/);
    const colName = dotMatch ? dotMatch[2] : t;
    result[colName] = evalExpr(t, row);
  }
  return result;
}

// ── Main query executor ──────────────────────────────────────────────────────

export function executeQuery(sql: string): QueryResult {
  const start = Date.now();
  try {
    const normalized = sql
      .replace(/--[^\n]*/g, '')        // remove line comments
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/;$/, '');

    if (!/^SELECT\s/i.test(normalized)) {
      return { columns: [], rows: [], rowCount: 0, executionMs: 0,
        error: 'Only SELECT queries are supported in the demo.' };
    }

    // ── Split the query into clauses ──────────────────────────────────────
    const upperSQL = normalized;

    // Extract LIMIT
    let limit = Infinity;
    const limitMatch = upperSQL.match(/\bLIMIT\s+(\d+)\b/i);
    if (limitMatch) limit = parseInt(limitMatch[1]);

    // Extract ORDER BY
    let orderByStr = '';
    const orderMatch = upperSQL.match(/\bORDER\s+BY\s+(.+?)(?:\bLIMIT\b|$)/i);
    if (orderMatch) orderByStr = orderMatch[1].trim();

    // Extract GROUP BY
    let groupByStr = '';
    const groupMatch = upperSQL.match(/\bGROUP\s+BY\s+(.+?)(?:\bORDER\s+BY\b|\bLIMIT\b|$)/i);
    if (groupMatch) groupByStr = groupMatch[1].trim();

    // Extract HAVING (basic support)
    let havingStr = '';
    const havingMatch = upperSQL.match(/\bHAVING\s+(.+?)(?:\bORDER\s+BY\b|\bLIMIT\b|$)/i);
    if (havingMatch) havingStr = havingMatch[1].trim();

    // Extract WHERE
    let whereStr = '';
    const whereMatch = upperSQL.match(/\bWHERE\s+(.+?)(?:\bGROUP\s+BY\b|\bORDER\s+BY\b|\bLIMIT\b|\bHAVING\b|$)/i);
    if (whereMatch) whereStr = whereMatch[1].trim();

    // Extract FROM + JOINs
    const fromMatch = upperSQL.match(/\bFROM\s+(.+?)(?:\bWHERE\b|\bGROUP\s+BY\b|\bORDER\s+BY\b|\bLIMIT\b|$)/i);
    if (!fromMatch) return { columns: [], rows: [], rowCount: 0, executionMs: 0, error: 'Missing FROM clause.' };
    const fromClause = fromMatch[1].trim();

    // Extract SELECT columns
    const selectMatch = upperSQL.match(/^SELECT\s+(.+?)\s+FROM\b/i);
    if (!selectMatch) return { columns: [], rows: [], rowCount: 0, executionMs: 0, error: 'Invalid SELECT.' };
    const selectStr = selectMatch[1].trim();

    // ── Build base dataset from FROM + JOINs ─────────────────────────────
    let rows: Row[] = buildFromClause(fromClause);

    // ── Apply WHERE ────────────────────────────────────────────────────
    if (whereStr) {
      const tokens = whereStr.split(/\s+/);
      const { node } = parseCondition(tokens, 0);
      rows = rows.filter(r => evalCondition(node, r));
    }

    // ── GROUP BY ───────────────────────────────────────────────────────
    const hasAgg = /\b(COUNT|SUM|AVG|MAX|MIN)\s*\(/i.test(selectStr);
    if (groupByStr || hasAgg) {
      const groupKeys = groupByStr
        ? groupByStr.split(',').map(k => k.trim().split(/\./).pop()!.toLowerCase())
        : [];
      const groups = new Map<string, Row[]>();
      if (groupKeys.length === 0) {
        groups.set('__all__', rows);
      } else {
        for (const r of rows) {
          const key = groupKeys.map(k => String(r[k] ?? '')).join('|');
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key)!.push(r);
        }
      }

      const selectTokens = [selectStr];
      const agg = applyAggregates(selectTokens, groups);

      // HAVING
      if (havingStr) {
        const hTokens = havingStr.split(/\s+/);
        const { node } = parseCondition(hTokens, 0);
        agg.rows = agg.rows.filter(r => evalCondition(node, r));
      }

      // ORDER BY on aggregated results
      let finalRows = agg.rows;
      if (orderByStr) finalRows = applyOrderBy(finalRows, orderByStr);
      finalRows = finalRows.slice(0, limit);

      return {
        columns: agg.columns,
        rows: finalRows,
        rowCount: finalRows.length,
        executionMs: Date.now() - start,
      };
    }

    // ── Simple projection ──────────────────────────────────────────────
    const selectTokens = [selectStr];
    let projected = rows.map(r => projectRow(selectTokens, r));

    // Derive columns from first row
    const columns = projected.length > 0 ? Object.keys(projected[0]) : [];

    // ORDER BY
    if (orderByStr) projected = applyOrderBy(projected, orderByStr);

    // LIMIT
    projected = projected.slice(0, limit);

    return {
      columns,
      rows: projected,
      rowCount: projected.length,
      executionMs: Date.now() - start,
    };
  } catch (err) {
    return {
      columns: [], rows: [], rowCount: 0,
      executionMs: Date.now() - start,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ── FROM + JOIN builder ──────────────────────────────────────────────────────

function buildFromClause(fromClause: string): Row[] {
  // Parse: table [alias] [JOIN table [alias] ON cond]*
  const joinRegex = /(?:(?:INNER|LEFT|RIGHT|OUTER|CROSS)?\s*JOIN)\s+(\w+)\s+(\w+)?\s*ON\s+(.+?)(?=(?:(?:INNER|LEFT|RIGHT|OUTER|CROSS)?\s*JOIN)|$)/gi;

  // Extract base table
  const baseMatch = fromClause.match(/^(\w+)\s*(\w+)?/i);
  if (!baseMatch) throw new Error(`Cannot parse FROM: ${fromClause}`);
  const baseTable = baseMatch[1].toLowerCase();
  const baseAlias = baseMatch[2] ? baseMatch[2].toLowerCase() : baseTable;

  if (!(baseTable in DB)) throw new Error(`Unknown table: ${baseTable}`);

  // Prefix rows with alias
  let rows: Row[] = DB[baseTable].map(r => prefixRow(r, baseAlias));

  // Process JOINs
  let joinMatch: RegExpExecArray | null;
  while ((joinMatch = joinRegex.exec(fromClause)) !== null) {
    const joinTable = joinMatch[1].toLowerCase();
    const joinAlias = joinMatch[2] ? joinMatch[2].toLowerCase() : joinTable;
    const onCond    = joinMatch[3].trim();

    if (!(joinTable in DB)) throw new Error(`Unknown join table: ${joinTable}`);
    const joinRows = DB[joinTable].map(r => prefixRow(r, joinAlias));

    // Parse ON condition: left = right
    const onMatch = onCond.match(/(\S+)\s*=\s*(\S+)/);
    if (!onMatch) throw new Error(`Cannot parse JOIN ON: ${onCond}`);
    const onLeft  = onMatch[1].toLowerCase().replace(/\./g, '_dot_').replace('.', '.');
    const onRight = onMatch[2].toLowerCase().replace(/\./g, '_dot_').replace('.', '.');

    const resolveKey = (expr: string, row: Row): unknown => {
      const dot = expr.match(/^(\w+)\.(\w+)$/);
      if (dot) return row[dot[2]] ?? row[`${dot[1]}.${dot[2]}`] ?? null;
      return row[expr] ?? null;
    };

    const merged: Row[] = [];
    for (const left of rows) {
      for (const right of joinRows) {
        const combined = { ...left, ...right };
        const lv = resolveKey(onMatch[1].toLowerCase(), combined);
        const rv = resolveKey(onMatch[2].toLowerCase(), combined);
        if (lv !== null && rv !== null && String(lv) === String(rv)) {
          merged.push(combined);
        }
      }
    }
    rows = merged;
  }

  return rows;
}

function prefixRow(row: Row, alias: string): Row {
  const result: Row = {};
  for (const [k, v] of Object.entries(row)) {
    result[k.toLowerCase()] = v;            // unprefixed (for simple lookups)
    result[`${alias}.${k.toLowerCase()}`] = v; // prefixed (for qualified lookups)
  }
  return result;
}

// ── ORDER BY ─────────────────────────────────────────────────────────────────

function applyOrderBy(rows: Row[], orderByStr: string): Row[] {
  const parts = orderByStr.split(',').map(p => {
    const m = p.trim().match(/^(.+?)\s+(ASC|DESC)$/i);
    if (m) return { col: m[1].trim().toLowerCase(), dir: m[2].toUpperCase() as 'ASC' | 'DESC' };
    return { col: p.trim().toLowerCase(), dir: 'ASC' as const };
  });

  return [...rows].sort((a, b) => {
    for (const { col, dir } of parts) {
      const av = evalExpr(col, a);
      const bv = evalExpr(col, b);
      if (av === bv) continue;
      if (av === null) return 1;
      if (bv === null) return -1;
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv));
      return dir === 'ASC' ? cmp : -cmp;
    }
    return 0;
  });
}
