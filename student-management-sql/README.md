# Student Management System — Static vs Dynamic SQL

A college-level Database Management Systems (DBMS) project demonstrating the architectural and practical differences between **Static SQL** and **Dynamic SQL**.

---

## 1. Project Title
**Student Management System — Static SQL vs Dynamic SQL**  
*Academic Mini-Project for DBMS / SQL Lab Demonstration & Viva Voce*

---

## 2. Problem Statement
In database application development, developers must choose between writing fixed SQL queries or constructing queries that adapt to user input at runtime. Novice developers often confuse static queries with dynamic queries, or mistakenly use string concatenation to build dynamic statements, which introduces severe security vulnerabilities like SQL Injection. 

This project solves this educational challenge by providing a clean, side-by-side implementation where **Static SQL** and **Dynamic SQL** are strictly isolated into independent modules, along with core CRUD operations, relational JOINs, database indexing, and transaction management.

---

## 3. Objective
1. **Clear Module Separation**: Isolate Static SQL (fixed statements) from Dynamic SQL (runtime parameterized statements) so examiners can evaluate each paradigm independently.
2. **Demonstrate Static SQL**: Execute predetermined queries with hardcoded filter criteria and aggregate functions.
3. **Demonstrate Dynamic SQL**: Use runtime parameters, prepared statements, and strict column whitelisting for dynamic sorting.
4. **Implement CRUD Operations**: Provide safe Create, Read, Update, and Delete actions with clear documentation of which operations use static vs dynamic queries.
5. **Demonstrate Relational Concepts**: Implement multi-table JOINs, performance indexes, and atomic transactions (`COMMIT` and `ROLLBACK`).

---

## 4. Technologies Used
- **Database Engine**: MySQL 8.0+ (with full SQL script support)
- **Application Language**: Python 3.8+
- **Database Connector**: `mysql-connector-python` (with built-in fallback SQLite demo engine for offline lab evaluations)
- **User Interface**: Interactive Terminal Command Line Interface (CLI)

---

## 5. Database Architecture
The system models a university academic environment using three relational tables:
- **`students`**: Stores student biographical and academic profile data.
- **`courses`**: Stores available courses and credit hours.
- **`enrollments`**: Relational junction table linking students to courses with semester exam marks.

Referential integrity is maintained with Primary Keys (`PK`) and Foreign Keys (`FK`) with `ON DELETE CASCADE` actions.

---

## 6. ER Diagram

### Visual ER Diagram
The visual diagram is stored in [`docs/ER_Diagram.png`](./docs/ER_Diagram.png):

```text
+-----------------------+          +-----------------------+          +-----------------------+
|       STUDENTS        |          |      ENROLLMENTS      |          |        COURSES        |
+-----------------------+          +-----------------------+          +-----------------------+
| PK student_id (INT)   | 1      N | PK enrollment_id (INT)| N      1 | PK course_id (VARCHAR)|
|    name (VARCHAR)     |<-------->| FK student_id (INT)   |<-------->|    course_name (VAR)  |
|    email (VARCHAR)    |          | FK course_id (VARCHAR)|          |    department (VAR)   |
|    department (VAR)   |          |    marks (DECIMAL)    |          |    credits (INT)      |
|    year (INT)         |          |    semester (VARCHAR) |          +-----------------------+
|    gender (VARCHAR)   |          +-----------------------+
|    city (VARCHAR)     |
+-----------------------+
```

### Relationships:
- **`STUDENTS` to `ENROLLMENTS`**: One-to-Many (`1 : N`). One student can enroll in multiple courses.
- **`COURSES` to `ENROLLMENTS`**: One-to-Many (`1 : N`). One course can have multiple student enrollments.

---

## 7. Database Tables

### Table 1: `students`
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `student_id` | `INT` | `PRIMARY KEY AUTO_INCREMENT` | Unique identifier for each student |
| `name` | `VARCHAR(100)` | `NOT NULL` | Full name of the student |
| `email` | `VARCHAR(100)` | `NOT NULL UNIQUE` | University email address |
| `department` | `VARCHAR(50)` | `NOT NULL` | Academic major |
| `year` | `INT` | `NOT NULL CHECK (year BETWEEN 1 AND 4)` | Current academic year |
| `gender` | `VARCHAR(10)` | `NOT NULL` | Gender |
| `city` | `VARCHAR(50)` | `NOT NULL` | Residential city |

### Table 2: `courses`
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `course_id` | `VARCHAR(10)` | `PRIMARY KEY` | Course identification code (e.g., CS101) |
| `course_name` | `VARCHAR(100)` | `NOT NULL` | Full course title |
| `department` | `VARCHAR(50)` | `NOT NULL` | Department offering the subject |
| `credits` | `INT` | `NOT NULL CHECK (credits > 0)` | Credit weight of the course |

### Table 3: `enrollments`
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `enrollment_id` | `INT` | `PRIMARY KEY AUTO_INCREMENT` | Unique enrollment record ID |
| `student_id` | `INT` | `FOREIGN KEY REFERENCES students(student_id)` | Enrolled student ID |
| `course_id` | `VARCHAR(10)` | `FOREIGN KEY REFERENCES courses(course_id)` | Registered course ID |
| `marks` | `DECIMAL(5, 2)` | `NOT NULL CHECK (marks BETWEEN 0 AND 100)` | Exam score |
| `semester` | `VARCHAR(20)` | `NOT NULL` | Academic semester |

---

## 8. Static SQL Module
Located in directory: [`static/`](./static/)  
Files: [`static/static_queries.sql`](./static/static_queries.sql), [`static/static_demo.sql`](./static/static_demo.sql)

### Definition
**Static SQL** means the query text, referenced columns, and search criteria are **predetermined and hardcoded** before execution.

### Rules of Static SQL
- Fixed SQL statements with predetermined conditions.
- No user-supplied parameters.
- No string concatenation.
- No `PREPARE` or `EXECUTE` commands.

### Static Query Examples:
1. **Display Computer Science Students:**
   ```sql
   SELECT student_id, name, email, year, city 
   FROM students 
   WHERE department = 'Computer Science' 
   ORDER BY name ASC;
   ```
2. **Display 3rd-Year Students:**
   ```sql
   SELECT student_id, name, department, year, city 
   FROM students 
   WHERE year = 3 
   ORDER BY department ASC, name ASC;
   ```
3. **Display Students from Hyderabad:**
   ```sql
   SELECT student_id, name, department, year, city 
   FROM students 
   WHERE city = 'Hyderabad' 
   ORDER BY name ASC;
   ```
4. **Highest & Lowest Marks:**
   ```sql
   SELECT MAX(marks) AS highest_marks, MIN(marks) AS lowest_marks 
   FROM enrollments;
   ```
5. **Headcount by Department:**
   ```sql
   SELECT department, COUNT(*) AS total_students 
   FROM students 
   GROUP BY department 
   ORDER BY total_students DESC;
   ```

---

## 9. Dynamic SQL Module
Located in directory: [`dynamic/`](./dynamic/)  
Files: [`dynamic/dynamic_queries.sql`](./dynamic/dynamic_queries.sql), [`dynamic/dynamic_demo.sql`](./dynamic/dynamic_demo.sql)

### Definition
**Dynamic SQL** means the query execution depends on values or conditions supplied at runtime.

### Dynamic Features:
1. **Search by Department**: Accepts department name at runtime.
2. **Search by City**: Accepts city name at runtime.
3. **Search by Minimum Marks**: Accepts minimum cutoff score at runtime.
4. **Search by Year**: Accepts academic year at runtime.
5. **Dynamic Sorting with Whitelisting**: Allows sorting by Name, Year, or City.
6. **Multi-criteria Filtering**: Allows combining multiple optional filters at runtime.

### Prepared Statements in MySQL:
```sql
-- Step 1: Prepare statement with parameter placeholder (?)
PREPARE stmt FROM 'SELECT * FROM students WHERE department = ?';

-- Step 2: Set runtime variable
SET @department = 'Cybersecurity';

-- Step 3: Execute query using runtime variable
EXECUTE stmt USING @department;

-- Step 4: Deallocate statement
DEALLOCATE PREPARE stmt;
```

---

## 10. CRUD Operations
The application supports standard data management operations with explicit classification:

| Operation | Action | Classification | Implementation |
|---|---|---|---|
| **CREATE** | Add a new student | Parameterized Dynamic SQL | `INSERT INTO students (...) VALUES (?, ?, ?, ?, ?, ?)` |
| **READ** | View all students | Static SQL | `SELECT ... FROM students ORDER BY student_id DESC` |
| **READ** | Search by ID | Parameterized Dynamic SQL | `SELECT ... FROM students WHERE student_id = ?` |
| **UPDATE** | Update department/year/city | Parameterized Dynamic SQL | `UPDATE students SET <col> = ? WHERE student_id = ?` |
| **DELETE** | Delete student by ID | Parameterized Dynamic SQL | `DELETE FROM students WHERE student_id = ?` |

All modifications are committed safely to ensure data persistence.

---

## 11. JOIN Demonstrations
The project demonstrates relational operations across tables:

1. **3-Table JOIN (Student + Course + Marks)**:
   ```sql
   SELECT s.name AS student_name, c.course_name, e.marks, e.semester
   FROM students s
   JOIN enrollments e ON s.student_id = e.student_id
   JOIN courses c ON e.course_id = c.course_id
   ORDER BY s.name ASC;
   ```
2. **Course Enrollment Roster**:
   ```sql
   SELECT s.student_id, s.name, s.department, c.course_name, e.marks
   FROM students s
   JOIN enrollments e ON s.student_id = e.student_id
   JOIN courses c ON e.course_id = c.course_id
   WHERE c.course_id = 'CS101'
   ORDER BY e.marks DESC;
   ```
3. **Average Marks by Course**:
   ```sql
   SELECT c.course_id, c.course_name, COUNT(e.enrollment_id) AS total_enrolled, ROUND(AVG(e.marks), 2) AS avg_marks
   FROM courses c
   JOIN enrollments e ON c.course_id = e.course_id
   GROUP BY c.course_id, c.course_name
   ORDER BY avg_marks DESC;
   ```
4. **Average Marks by Department**:
   ```sql
   SELECT s.department, COUNT(DISTINCT s.student_id) AS student_count, ROUND(AVG(e.marks), 2) AS avg_marks
   FROM students s
   JOIN enrollments e ON s.student_id = e.student_id
   GROUP BY s.department
   ORDER BY avg_marks DESC;
   ```

---

## 12. Indexes
File: [`database/database.sql`](./database/database.sql)

> **Definition**: An index helps the database find frequently searched records faster, reducing the need to scan every row in the table.

### Created Indexes:
```sql
CREATE INDEX idx_student_department ON students(department);
CREATE INDEX idx_student_city ON students(city);
CREATE INDEX idx_student_year ON students(year);
CREATE INDEX idx_enrollment_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollment_course_id ON enrollments(course_id);
```

### Why these columns?
- `department`, `city`, and `year` are the most common search filters in the application.
- `student_id` and `course_id` are foreign keys frequently used in `JOIN` conditions.

---

## 13. Transactions
File: [`database/transactions.sql`](./database/transactions.sql)

A transaction executes a sequence of operations as a single unit of work (all-or-nothing):
- **`COMMIT`**: Saves all changes permanently.
- **`ROLLBACK`**: Undoes uncommitted changes if an error occurs.

### Example Flow:
```text
START TRANSACTION
       ↓
Insert enrollment record
       ↓
Verify record in session
       ↓
COMMIT (Permanent)  OR  ROLLBACK (Cancelled)
```

---

## 14. Static vs Dynamic SQL Comparison

| Feature | Static SQL | Dynamic SQL |
| :--- | :--- | :--- |
| **Query Structure** | Fixed before execution | Runtime-dependent |
| **Conditions** | Predetermined hardcoded values | User / runtime input |
| **Flexibility** | Low | High |
| **Complexity** | Simple | More complex |
| **Example** | `WHERE year = 3` | `WHERE year = ?` |
| **Prepared Statements** | Not required | Used (`PREPARE` / `EXECUTE`) |
| **User Input** | Not supported | Supported |
| **SQL Injection Risk** | Lower / None | Must be carefully handled |

---

## 15. SQL Injection and Parameterization

### The Danger of String Concatenation:
If user input is directly concatenated into a query string:
```python
# VULNERABLE:
query = "SELECT * FROM students WHERE department = '" + user_input + "'"
```
An input like `' OR '1'='1` changes the query logic to return all students.

### Safe Parameterization:
With prepared queries:
```python
# SECURE:
cursor.execute("SELECT * FROM students WHERE department = ?", (user_input,))
```
The input is treated strictly as data, neutralizing any injected SQL syntax.

### Why Dynamic Sorting Needs Whitelisting:
In SQL, placeholders (`?`) **cannot** be used for column names or sort directions:
```sql
-- INVALID SQL:
SELECT * FROM students ORDER BY ?;
```
Therefore, to allow dynamic sorting safely, user choices are mapped to a strict **whitelist**:
```python
ALLOWED_SORT_COLUMNS = {
    "1": ("name", "Student Name"),
    "2": ("year", "Academic Year"),
    "3": ("city", "Residential City")
}
```
Any option outside the whitelist is rejected before query construction.

---

## 16. Project Structure

```text
student-management-sql/
│
├── README.md                  # Complete 24-section documentation & Viva guide
├── requirements.txt           # Python dependencies
│
├── database/
│   ├── database.sql           # Schema definition with foreign keys & indexes
│   ├── sample_data.sql        # 25 students, 6 courses, 46 enrollments
│   └── transactions.sql       # Transaction demonstration script (COMMIT / ROLLBACK)
│
├── static/
│   ├── static_queries.sql     # Documented fixed queries with predetermined criteria
│   └── static_demo.sql        # Batch executable static demo for MySQL
│
├── dynamic/
│   ├── dynamic_queries.sql    # Parameterized queries and whitelist analysis
│   └── dynamic_demo.sql       # Batch executable dynamic demo for MySQL
│
├── app/
│   └── app.py                 # Interactive Python CLI (Static, Dynamic, CRUD, Demonstrations)
│
├── docs/
│   └── ER_Diagram.png         # Generated Entity-Relationship diagram
│
└── screenshots/
    └── README.md              # Screenshot capture guide and sample text logs
```

---

## 17. Installation

### 1. Prerequisites
- Python 3.8 or higher installed on your computer.
- Optional: MySQL Server 8.0+ (if you wish to use MySQL mode).

### 2. Install Required Python Packages
```powershell
pip install mysql-connector-python tabulate
```

---

## 18. How to Run

### Option A — MySQL Mode (Live MySQL 8.0+ Server)

1. Open PowerShell or Command Prompt and connect to MySQL:
   ```powershell
   mysql -u root -p
   ```
2. Run the database setup files:
   ```sql
   SOURCE database/database.sql;
   SOURCE database/sample_data.sql;
   exit
   ```
3. Start the Python application:
   ```powershell
   python app/app.py
   ```
4. When prompted:
   ```text
   Select database mode (1 or 2, default=2): 1
   ```
   Enter your MySQL Host (`localhost`), User (`root`), Password, and Database Name (`student_management`).

---

### Option B — Demo Mode (Zero-Setup, Instant Viva Mode)

If MySQL is not installed or the service is not running on the lab computer, use the self-contained Demo Mode:

```powershell
cd "c:\Users\N Koushik\OneDrive\Desktop\new project\student-management-sql"
python app/app.py
```
When prompted:
```text
Select database mode (1 or 2, default=2): 2
```
The system will automatically initialize an in-memory SQLite database loaded with the exact same 25 students, 6 courses, 46 enrollments, and indexes.

---

## 19. Sample Output

### Main Application Menu:
```text
========================================
       STUDENT MANAGEMENT SYSTEM
========================================
Active Engine: MySQL 8.0+ / Embedded Demo Engine
----------------------------------------
1. STATIC SQL MODULE
2. DYNAMIC SQL MODULE
3. CRUD OPERATIONS
4. DATABASE DEMONSTRATIONS
5. Exit
========================================
Enter your choice (1-5):
```

### Static SQL Output (Computer Science Students):
```text
======================================================================
MODULE 1 [STATIC SQL]: Static Query: Computer Science students
----------------------------------------------------------------------
SQL EXECUTED:
SELECT student_id, name, email, year, gender, city FROM students WHERE department = 'Computer Science' ORDER BY name ASC
======================================================================
+------------+---------------+-----------------------+------+--------+-----------+
| student_id | name          | email                 | year | gender | city      |
+------------+---------------+-----------------------+------+--------+-----------+
| 1          | Aarav Sharma  | aarav.sharma@univ.edu | 3    | Male   | Hyderabad |
| 4          | Ananya Reddy  | ananya.reddy@univ.edu | 3    | Female | Hyderabad |
| 19         | Arjun Nair    | arjun.nair@univ.edu   | 3    | Male   | Chennai   |
| 2          | Diya Patel    | diya.patel@univ.edu   | 2    | Female | Bengaluru |
| 10         | Ishita Sen    | ishita.sen@univ.edu   | 3    | Female | Bengaluru |
| 13         | Naveen Kumar  | naveen.kumar@univ.edu | 4    | Male   | Hyderabad |
| 22         | Pragya Tiwari | pragya.tiwari@univ.edu| 4    | Female | Hyderabad |
| 16         | Ritu Verma    | ritu.verma@univ.edu   | 2    | Female | Hyderabad |
| 7          | Rohan Kulkarni| rohan.kulkarni@univ.ed| 1    | Male   | Pune      |
+------------+---------------+-----------------------+------+--------+-----------+
Total Rows: 9
```

---

## 20. Viva Demonstration

Follow this 8-step sequence during your project evaluation:

- **Step 1: Create Database** — Show `database/database.sql` and explain table structures and primary/foreign keys.
- **Step 2: Insert Sample Data** — Show `database/sample_data.sql` with 25 realistic student records.
- **Step 3: Run Static SQL** — Select Menu Option `1` ➔ Option `3` (`WHERE year = 3`).  
  *Explanation: "The query structure is predetermined before execution, so this is Static SQL."*
- **Step 4: Run Dynamic SQL** — Select Menu Option `2` ➔ Option `1` ➔ Enter `Cybersecurity`.  
  *Explanation: "The value is supplied at runtime and bound using prepared parameters."*
- **Step 5: Demonstrate Dynamic Sorting** — Select Menu Option `2` ➔ Option `5` (Sort by Year).  
  *Explanation: "Because column names cannot use '?' placeholders, we enforce strict whitelist validation."*
- **Step 6: Demonstrate a JOIN** — Select Menu Option `4` ➔ Option `1` ➔ Option `1` (3-Table JOIN).  
  *Explanation: "This joins students, enrollments, and courses to display student grades."*
- **Step 7: Demonstrate a Transaction** — Select Menu Option `4` ➔ Option `3` (Test COMMIT and ROLLBACK).  
  *Explanation: "This demonstrates atomicity: uncommitted changes can be undone with ROLLBACK."*
- **Step 8: Show the ER Diagram** — Show `docs/ER_Diagram.png` illustrating the `1 : N` relationships.

---

## 21. Viva Questions & Answers

### Q1: What is the main difference between Static SQL and Dynamic SQL?
> **Answer**: Static SQL has fixed query text and conditions hardcoded before execution. Dynamic SQL accepts runtime input or assembles statements dynamically at execution time.

### Q2: What are prepared statements and why are they used?
> **Answer**: Prepared statements compile the SQL template with parameter placeholders (`?`) first. Runtime values are sent separately as data, which prevents SQL injection.

### Q3: Why can't we use a placeholder (`?`) for column names in `ORDER BY`?
> **Answer**: In SQL standards, placeholders are only valid for data values (expressions), not for structural identifiers like column names, table names, or keywords (`ASC`/`DESC`).

### Q4: How did you make dynamic sorting safe against SQL injection?
> **Answer**: By using an **identifier whitelist**. The user chooses from fixed options (1=Name, 2=Year, 3=City), and the application validates that the column exists on an approved list before applying it.

### Q5: What is a Foreign Key constraint?
> **Answer**: A foreign key links a column in a child table (`enrollments.student_id`) to the primary key of a parent table (`students.student_id`), preventing invalid or orphaned records.

### Q6: What does `ON DELETE CASCADE` do?
> **Answer**: If a parent student record is deleted from the `students` table, the database automatically deletes all linked enrollment records for that student.

### Q7: What is an index and why did you add one?
> **Answer**: An index is a data structure that helps the database find records faster without scanning the entire table. We indexed `department`, `city`, and `year` because they are frequently filtered.

### Q8: What are the ACID properties of a transaction?
> **Answer**:
> - **Atomicity**: All operations succeed, or all are rolled back.
> - **Consistency**: The database moves from one valid state to another.
> - **Isolation**: Concurrent transactions do not conflict.
> - **Durability**: Committed data persists even after system crashes.

---

## 22. Limitations
- The project focuses on learning DBMS concepts; it does not implement user login roles or web-based dashboards.
- The command-line interface is optimized for single-session terminal interaction.

---

## 23. Future Enhancements
- Adding a lightweight Web UI (e.g., Flask or FastAPI).
- Adding support for bulk CSV student data import/export.
- Implementing role-based access control (Admin vs Student viewing).

---

## 24. Conclusion
This project clearly demonstrates the separation, advantages, and trade-offs between **Static SQL** and **Dynamic SQL**. By combining fixed reporting queries, parameterized runtime filtering, safe whitelisted sorting, CRUD operations, relational JOINs, and transactions, it provides an end-to-end practical showcase of core database engineering concepts.
