-- ============================================================================
-- Project: Student Management System — Static vs Dynamic SQL
-- Module 1: STATIC SQL
-- File: static/static_queries.sql
--
-- DEFINITION:
-- Static SQL refers to SQL queries whose complete structure, tables, columns,
-- and conditional criteria are hardcoded and predetermined prior to execution.
-- The database engine compiles, optimizes, and fixes the query execution plan
-- without relying on runtime user input or string concatenation.
--
-- STATIC SQL CHARACTERISTICS:
-- 1. Fixed text: No string interpolation (e.g., no f"WHERE id = {x}")
-- 2. Fixed criteria: Predetermined literal values (e.g., department = 'Computer Science')
-- 3. Fixed execution plan: Compiled ahead of time or on first execution
-- 4. High security: Immune to SQL injection vulnerabilities
-- ============================================================================

USE student_management;

-- ----------------------------------------------------------------------------
-- Query 1: Display All Students
-- Purpose: Retrieves complete student directory.
-- Why Static: Fixed query structure with no filtering criteria.
-- ----------------------------------------------------------------------------
SELECT 
    student_id, 
    name, 
    email, 
    department, 
    year, 
    gender, 
    city 
FROM students
ORDER BY student_id ASC;


-- ----------------------------------------------------------------------------
-- Query 2: Display Computer Science Students
-- Purpose: Filters students enrolled in the Computer Science department.
-- Why Static: Filter predicate (`department = 'Computer Science'`) is hardcoded.
-- ----------------------------------------------------------------------------
SELECT 
    student_id, 
    name, 
    email, 
    year, 
    gender, 
    city 
FROM students
WHERE department = 'Computer Science'
ORDER BY name ASC;


-- ----------------------------------------------------------------------------
-- Query 3: Display 3rd-Year Students
-- Purpose: Identifies all junior-year (3rd year) students across departments.
-- Why Static: Numerical condition (`year = 3`) is hardcoded into the query text.
-- ----------------------------------------------------------------------------
SELECT 
    student_id, 
    name, 
    department, 
    gender, 
    city 
FROM students
WHERE year = 3
ORDER BY department ASC, name ASC;


-- ----------------------------------------------------------------------------
-- Query 4: Display Students from Hyderabad
-- Purpose: Locates all students whose residential base is Hyderabad.
-- Why Static: Predetermined string literal 'Hyderabad' is embedded directly.
-- ----------------------------------------------------------------------------
SELECT 
    student_id, 
    name, 
    department, 
    year, 
    city 
FROM students
WHERE city = 'Hyderabad'
ORDER BY name ASC;


-- ----------------------------------------------------------------------------
-- Query 5: Display Students with Marks Above 80
-- Purpose: Identifies high achievers across courses using relational JOIN.
-- Why Static: Join predicates and score cutoff (`marks > 80.00`) are fixed.
-- ----------------------------------------------------------------------------
SELECT 
    s.student_id,
    s.name AS student_name,
    s.department,
    c.course_name,
    e.marks,
    e.semester
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
INNER JOIN courses c ON e.course_id = c.course_id
WHERE e.marks > 80.00
ORDER BY e.marks DESC;


-- ----------------------------------------------------------------------------
-- Query 6: Find Highest Marks
-- Purpose: Evaluates peak academic performance using aggregate MAX().
-- Why Static: Fixed aggregate function on the enrollments table.
-- ----------------------------------------------------------------------------
SELECT 
    MAX(marks) AS highest_marks,
    MIN(marks) AS lowest_marks
FROM enrollments;


-- ----------------------------------------------------------------------------
-- Query 7: Find Average Marks (Overall and By Department)
-- Purpose: Computes departmental benchmark scores using AVG() and GROUP BY.
-- Why Static: Grouping and aggregation logic are immutable at compile time.
-- ----------------------------------------------------------------------------
SELECT 
    s.department,
    COUNT(DISTINCT s.student_id) AS total_students_evaluated,
    ROUND(AVG(e.marks), 2) AS average_marks
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
GROUP BY s.department
ORDER BY average_marks DESC;


-- ----------------------------------------------------------------------------
-- Query 8: Count Students by Department
-- Purpose: Provides departmental headcount statistics using COUNT(*).
-- Why Static: Standard GROUP BY statement with predetermined grouping key.
-- ----------------------------------------------------------------------------
SELECT 
    department, 
    COUNT(*) AS student_count 
FROM students
GROUP BY department
ORDER BY student_count DESC;


-- ----------------------------------------------------------------------------
-- Query 9: Display Students Enrolled in a Specific Fixed Course ('CS101')
-- Purpose: Lists roster for 'Database Management Systems' (CS101).
-- Why Static: Course ID 'CS101' is permanently baked into the WHERE condition.
-- ----------------------------------------------------------------------------
SELECT 
    s.student_id,
    s.name AS student_name,
    s.department AS student_department,
    c.course_id,
    c.course_name,
    e.marks,
    e.semester
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
INNER JOIN courses c ON e.course_id = c.course_id
WHERE c.course_id = 'CS101'
ORDER BY e.marks DESC;
