-- ============================================================================
-- Project: Student Management System — Static vs Dynamic SQL
-- Module 1: STATIC SQL DEMONSTRATION SCRIPT
-- File: static/static_demo.sql
--
-- USAGE INSTRUCTIONS:
-- Run this script in MySQL Workbench, MySQL Command Line Client, or via bash:
--   mysql -u root -p < static/static_demo.sql
--
-- EXAMINER NOTE:
-- In every query below, notice that the entire SQL text—including table names,
-- column projections, join conditions, and filter criteria (e.g. 'Computer Science', 3)—
-- is 100% hardcoded. The database engine creates a static, immutable execution plan.
-- ============================================================================

USE student_management;

SELECT '============================================================' AS ' ';
SELECT '       MODULE 1 — STATIC SQL DEMONSTRATION EXECUTION        ' AS ' ';
SELECT '============================================================' AS ' ';

-- STEP 1: All Students
SELECT '--- [DEMO 1] Display All Students (Fixed SELECT without criteria) ---' AS demo_step;
SELECT student_id, name, department, year, city 
FROM students 
LIMIT 10;

-- STEP 2: Computer Science Students
SELECT '--- [DEMO 2] Fixed Filter: Computer Science Department ---' AS demo_step;
SELECT student_id, name, email, year, city 
FROM students 
WHERE department = 'Computer Science';

-- STEP 3: 3rd Year Students
SELECT '--- [DEMO 3] Fixed Filter: 3rd Year Students (year = 3) ---' AS demo_step;
SELECT student_id, name, department, year, city 
FROM students 
WHERE year = 3;

-- STEP 4: Hyderabad Students
SELECT '--- [DEMO 4] Fixed Filter: Students from Hyderabad ---' AS demo_step;
SELECT student_id, name, department, year, city 
FROM students 
WHERE city = 'Hyderabad';

-- STEP 5: Students With Marks > 80
SELECT '--- [DEMO 5] Fixed JOIN Filter: Marks > 80.00 ---' AS demo_step;
SELECT 
    s.name AS student_name, 
    c.course_name, 
    e.marks, 
    e.semester
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
INNER JOIN courses c ON e.course_id = c.course_id
WHERE e.marks > 80.00
LIMIT 10;

-- STEP 6: Highest and Lowest Marks
SELECT '--- [DEMO 6] Fixed Aggregation: MAX() and MIN() Marks ---' AS demo_step;
SELECT 
    MAX(marks) AS highest_marks, 
    MIN(marks) AS lowest_marks, 
    ROUND(AVG(marks), 2) AS overall_avg_marks
FROM enrollments;

-- STEP 7: Departmental Averages
SELECT '--- [DEMO 7] Fixed GROUP BY: Department Average Marks ---' AS demo_step;
SELECT 
    s.department, 
    COUNT(DISTINCT s.student_id) AS student_count, 
    ROUND(AVG(e.marks), 2) AS average_marks
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
GROUP BY s.department
ORDER BY average_marks DESC;

-- STEP 8: Headcount by Department
SELECT '--- [DEMO 8] Fixed GROUP BY: Count of Students per Department ---' AS demo_step;
SELECT department, COUNT(*) AS total_students 
FROM students 
GROUP BY department 
ORDER BY total_students DESC;

-- STEP 9: Specific Fixed Course ('CS101')
SELECT '--- [DEMO 9] Fixed Filter: Enrolled in Course CS101 ---' AS demo_step;
SELECT 
    s.student_id, 
    s.name, 
    c.course_name, 
    e.marks
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
INNER JOIN courses c ON e.course_id = c.course_id
WHERE c.course_id = 'CS101'
ORDER BY e.marks DESC;

SELECT '============================================================' AS ' ';
SELECT '     STATIC SQL DEMO COMPLETE — ALL CRITERIA WERE HARDCODED  ' AS ' ';
SELECT '============================================================' AS ' ';
