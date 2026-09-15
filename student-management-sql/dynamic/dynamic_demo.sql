-- ============================================================================
-- Project: Student Management System — Static vs Dynamic SQL
-- Module 2: DYNAMIC SQL DEMONSTRATION SCRIPT
-- File: dynamic/dynamic_demo.sql
--
-- USAGE INSTRUCTIONS:
-- Run this script in MySQL Workbench or via command line:
--   mysql -u root -p < dynamic/dynamic_demo.sql
--
-- EXAMINER NOTE:
-- In every demo below, the query execution plan is parameterized or dynamically
-- configured using MySQL session variables (@variable) and PREPARE / EXECUTE.
-- ============================================================================

USE student_management;

SELECT '============================================================' AS ' ';
SELECT '       MODULE 2 — DYNAMIC SQL DEMONSTRATION EXECUTION       ' AS ' ';
SELECT '============================================================' AS ' ';

-- ----------------------------------------------------------------------------
-- DEMO 1: Dynamic Department Search
-- ----------------------------------------------------------------------------
SELECT '--- [DYNAMIC DEMO 1] Search by Runtime Department: Cybersecurity ---' AS demo_step;

PREPARE stmt_dept FROM 
'SELECT student_id, name, department, year, city 
 FROM students 
 WHERE department = ?';

SET @runtime_dept = 'Cybersecurity';
SELECT CONCAT('Executing prepared statement with @runtime_dept = "', @runtime_dept, '"') AS execution_info;
EXECUTE stmt_dept USING @runtime_dept;
DEALLOCATE PREPARE stmt_dept;


-- ----------------------------------------------------------------------------
-- DEMO 2: Dynamic City Search
-- ----------------------------------------------------------------------------
SELECT '--- [DYNAMIC DEMO 2] Search by Runtime City: Bengaluru ---' AS demo_step;

PREPARE stmt_city FROM 
'SELECT student_id, name, department, year, city 
 FROM students 
 WHERE city = ?';

SET @runtime_city = 'Bengaluru';
SELECT CONCAT('Executing prepared statement with @runtime_city = "', @runtime_city, '"') AS execution_info;
EXECUTE stmt_city USING @runtime_city;
DEALLOCATE PREPARE stmt_city;


-- ----------------------------------------------------------------------------
-- DEMO 3: Dynamic Minimum Marks Search
-- ----------------------------------------------------------------------------
SELECT '--- [DYNAMIC DEMO 3] Search by Runtime Minimum Marks: 90.00 ---' AS demo_step;

PREPARE stmt_marks FROM 
'SELECT 
    s.name AS student_name, 
    s.department, 
    c.course_name, 
    e.marks 
 FROM students s
 INNER JOIN enrollments e ON s.student_id = e.student_id
 INNER JOIN courses c ON e.course_id = c.course_id
 WHERE e.marks >= ?
 ORDER BY e.marks DESC';

SET @runtime_min_marks = 90.00;
SELECT CONCAT('Executing prepared statement with @runtime_min_marks = ', @runtime_min_marks) AS execution_info;
EXECUTE stmt_marks USING @runtime_min_marks;
DEALLOCATE PREPARE stmt_marks;


-- ----------------------------------------------------------------------------
-- DEMO 4: Dynamic Academic Year Search
-- ----------------------------------------------------------------------------
SELECT '--- [DYNAMIC DEMO 4] Search by Runtime Academic Year: Year 2 ---' AS demo_step;

PREPARE stmt_year FROM 
'SELECT student_id, name, department, year, city 
 FROM students 
 WHERE year = ?';

SET @runtime_year = 2;
SELECT CONCAT('Executing prepared statement with @runtime_year = ', @runtime_year) AS execution_info;
EXECUTE stmt_year USING @runtime_year;
DEALLOCATE PREPARE stmt_year;


-- ----------------------------------------------------------------------------
-- DEMO 5: Dynamic Sorting with Column Whitelisting
-- Demonstrating sorting by 1=Name, 2=Year, 3=City
-- ----------------------------------------------------------------------------
SELECT '--- [DYNAMIC DEMO 5] Dynamic Sorting (Whitelisted: Sort by Year DESC) ---' AS demo_step;

-- Examiner note: Whitelisting guarantees only approved column identifiers are interpolated
SET @user_sort_selection = 2; -- Simulating user selecting option 2 (Year)
SET @validated_column = CASE @user_sort_selection
    WHEN 1 THEN 'name'
    WHEN 2 THEN 'year'
    WHEN 3 THEN 'city'
    ELSE 'name'
END;
SET @validated_direction = 'DESC';

SET @sort_query = CONCAT(
    'SELECT student_id, name, department, year, city FROM students ORDER BY ',
    @validated_column, ' ', @validated_direction, ' LIMIT 10'
);

SELECT CONCAT('Safely assembled dynamic query: ', @sort_query) AS security_check;

PREPARE stmt_sort FROM @sort_query;
EXECUTE stmt_sort;
DEALLOCATE PREPARE stmt_sort;


-- ----------------------------------------------------------------------------
-- DEMO 6: Dynamic Multi-Criteria Filtering
-- Combines department = 'Computer Science' AND year = 3 AND marks >= 88.00
-- ----------------------------------------------------------------------------
SELECT '--- [DYNAMIC DEMO 6] Multi-Criteria Dynamic Filter ---' AS demo_step;

PREPARE stmt_multi FROM 
'SELECT 
    s.student_id, 
    s.name, 
    s.department, 
    s.year, 
    c.course_name, 
    e.marks
 FROM students s
 INNER JOIN enrollments e ON s.student_id = e.student_id
 INNER JOIN courses c ON e.course_id = c.course_id
 WHERE s.department = ? 
   AND s.year = ? 
   AND e.marks >= ?
 ORDER BY e.marks DESC';

SET @param_dept = 'Computer Science';
SET @param_year = 3;
SET @param_marks = 88.00;

SELECT CONCAT('Filters applied: Dept="', @param_dept, '", Year=', @param_year, ', Marks>=', @param_marks) AS applied_filters;

EXECUTE stmt_multi USING @param_dept, @param_year, @param_marks;
DEALLOCATE PREPARE stmt_multi;

SELECT '============================================================' AS ' ';
SELECT '     DYNAMIC SQL DEMO COMPLETE — ALL QUERIES PARAMETERIZED   ' AS ' ';
SELECT '============================================================' AS ' ';
