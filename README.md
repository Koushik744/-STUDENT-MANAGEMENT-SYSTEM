# Student Management System — Static vs Dynamic SQL

This repository contains two components:

| Component | Directory | Purpose |
|-----------|-----------|---------|
| **Python CLI** | `student-management-sql/` | Original college project — MySQL + Python demonstrating Static & Dynamic SQL |
| **Web Interface** | `web/` | Modern Next.js frontend — interactive SQL lab, ACID demo, analytics, deployable on Vercel |

---

## Vercel Deployment

The web interface is a Next.js application located in the `web/` directory.

**Vercel Root Directory:** `web`

### How to deploy on Vercel

1. Import this repository on [vercel.com](https://vercel.com)
2. Set **Root Directory** → `web`
3. Leave build settings as auto-detected (Next.js)

Or, since `vercel.json` at the repo root already sets `"rootDirectory": "web"`, Vercel will pick it up automatically on import.

**Build command:** `npm run build`  
**Install command:** `npm install`  
**Output directory:** `.next` (auto-detected)  
**Framework preset:** Next.js

> The Python CLI (`student-management-sql/app/app.py`) is **not** a Vercel API and is not deployed. It runs locally only.

---

## Web Interface Features

- Interactive SQL Lab (runs queries against embedded dataset in-browser)
- Static SQL — 9 queries with hardcoded literals
- Dynamic SQL — parameterized queries, `?` binding, whitelist sorting
- Security — SQL injection simulator (3 attack scenarios + defense)
- ACID Transactions — step-through COMMIT / ROLLBACK simulation
- Analytics — Recharts charts on the embedded 25-student dataset
- Database Explorer — DDL, column definitions, FK/indexes, data preview
- Architecture — ER diagram, 3NF schema

**No MySQL credentials are exposed.** All data in the web frontend is embedded demo data (25 students, 6 courses, 46 enrollments).

---

## Python CLI (local only)

```bash
cd student-management-sql
pip install -r requirements.txt
python app/app.py
```

Select Option 2 for the instant embedded demo mode, or Option 1 for a live MySQL 8.0+ server.

## Quick Links

- **Project Documentation**: [`student-management-sql/README.md`](./student-management-sql/README.md)
- **Database Schema**: [`student-management-sql/database/database.sql`](./student-management-sql/database/database.sql)
- **Static SQL**: [`student-management-sql/static/static_queries.sql`](./student-management-sql/static/static_queries.sql)
- **Dynamic SQL**: [`student-management-sql/dynamic/dynamic_queries.sql`](./student-management-sql/dynamic/dynamic_queries.sql)
- **Transactions**: [`student-management-sql/database/transactions.sql`](./student-management-sql/database/transactions.sql)
- **Web Frontend**: [`web/`](./web/)
