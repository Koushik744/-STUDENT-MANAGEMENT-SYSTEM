-- ============================================================================
-- Project: Student Management System — Static vs Dynamic SQL
-- Module 2: DYNAMIC SQL
-- File: dynamic/dynamic_queries.sql
--
-- DEFINITION:
-- Dynamic SQL refers to SQL queries whose execution depends on runtime values,
-- parameters, or query fragments supplied at execution time.
-- In MySQL, Dynamic SQL is implemented using PREPARED STATEMENTS:
--   1. PREPARE: Parses, validates syntax, and creates a template execution plan.
--   2. SET: Binds runtime values to session variables.
--   3. EXECUTE: Evaluates the prepared statement using the runtime variables.
--   4. DEALLOCATE PREPARE: Releases statement resources from server memory.
--
-- SECURITY NOTE — SQL INJECTION PREVENTION:
-- By using parameterized placeholders (?), user input is treated strictly as DATA,
-- never as executable SQL CODE. Even if the user passes:
--   ' OR '1'='1
-- the database engine treats it as a literal string matching that exact text.
-- ============================================================================

USE student_management;

-- ----------------------------------------------------------------------------
-- 1. Dynamic Search By Department (User supplies @dept at runtime)
-- ----------------------------------------------------------------------------
-- Template Preparation:
PREPARE stmt_search_dept FROM 
'SELECT student_id, name, email, department, year, city 
 FROM students 
 WHERE department = ? 
 ORDER BY name ASC';

-- Runtime Execution Example:
SET @dept = 'Cybersecurity';
EXECUTE stmt_search_dept USING @dept;

-- Clean Up:
DEALLOCATE PREPARE stmt_search_dept;


-- ----------------------------------------------------------------------------
-- 2. Dynamic Search By City (User supplies @city at runtime)
-- ----------------------------------------------------------------------------
PREPARE stmt_search_city FROM 
'SELECT student_id, name, department, year, city 
 FROM students 
 WHERE city = ? 
 ORDER BY name ASC';

-- Runtime Execution Example:
SET @target_city = 'Bengaluru';
EXECUTE stmt_search_city USING @target_city;

-- Clean Up:
DEALLOCATE PREPARE stmt_search_city;


-- ----------------------------------------------------------------------------
-- 3. Dynamic Search By Minimum Marks (User supplies @min_marks at runtime)
-- ----------------------------------------------------------------------------
PREPARE stmt_min_marks FROM 
'SELECT 
    s.student_id, 
    s.name AS student_name, 
    s.department, 
    c.course_name, 
    e.marks, 
    e.semester
 FROM students s
 INNER JOIN enrollments e ON s.student_id = e.student_id
 INNER JOIN courses c ON e.course_id = c.course_id
 WHERE e.marks >= ?
 ORDER BY e.marks DESC';

-- Runtime Execution Example:
SET @min_score = 90.00;
EXECUTE stmt_min_marks USING @min_score;

-- Clean Up:
DEALLOCATE PREPARE stmt_min_marks;


-- ----------------------------------------------------------------------------
-- 4. Dynamic Search By Academic Year (User supplies @target_year at runtime)
-- ----------------------------------------------------------------------------
PREPARE stmt_search_year FROM 
'SELECT student_id, name, department, year, city 
 FROM students 
 WHERE year = ? 
 ORDER BY department ASC, name ASC';

-- Runtime Execution Example:
SET @target_year = 2;
EXECUTE stmt_search_year USING @target_year;

-- Clean Up:
DEALLOCATE PREPARE stmt_search_year;


-- ----------------------------------------------------------------------------
-- 5. Dynamic Sorting with Column Whitelisting
--
-- CRITICAL SECURITY CONCEPT — WHY WHITELISTING IS MANDATORY:
-- In standard SQL, bind parameter placeholders (?) can ONLY be used for DATA values
-- (literals in WHERE, HAVING, or INSERT). They CANNOT be used for identifiers such as:
--   - Table names
--   - Column names in SELECT or ORDER BY
--   - Sort direction (ASC / DESC)
--
-- If an application blindly concatenates user input:
--   query = "SELECT * FROM students ORDER BY " + user_input
-- an attacker can execute SQL Injection:
--   user_input = "name; DROP TABLE students; --"
--
-- THE SOLUTION — STRICT WHITELISTING:
-- Map allowed user choices (1 -> name, 2 -> year, 3 -> city) to a closed whitelist.
-- Any option not on the whitelist is rejected before query construction!
-- ----------------------------------------------------------------------------

-- Example of Safe Dynamic Query String Assembly in MySQL:
SET @sort_choice = 1; -- 1 = Name, 2 = Year, 3 = City

-- Safe column resolution via CASE/Whitelist logic:
SET @col_name = CASE @sort_choice
    WHEN 1 THEN 'name'
    WHEN 2 THEN 'year'
    WHEN 3 THEN 'city'
    ELSE 'name'
END;

SET @sort_dir = 'ASC'; -- Validated against whitelist: ('ASC', 'DESC')

-- Dynamically assemble query string using validated identifier:
SET @dynamic_sort_sql = CONCAT(
    'SELECT student_id, name, department, year, city FROM students ORDER BY ',
    @col_name, ' ', @sort_dir
);

PREPARE stmt_dynamic_sort FROM @dynamic_sort_sql;
EXECUTE stmt_dynamic_sort;
DEALLOCATE PREPARE stmt_dynamic_sort;


-- ----------------------------------------------------------------------------
-- 6. Dynamic Multi-Criteria Filtering
-- Allows optional filtering by Department, Year, and Min Marks simultaneously.
-- Unspecified fields are bypassed using NULL coalesce or dynamic WHERE clauses.
-- ----------------------------------------------------------------------------
PREPARE stmt_multi_filter FROM 
'SELECT 
    s.student_id, 
    s.name, 
    s.department, 
    s.year, 
    s.city, 
    ROUND(AVG(e.marks), 2) AS average_score
 FROM students s
 LEFT JOIN enrollments e ON s.student_id = e.student_id
 WHERE (? IS NULL OR s.department = ?)
   AND (? IS NULL OR s.year = ?)
   AND (? IS NULL OR e.marks >= ?)
 GROUP BY s.student_id, s.name, s.department, s.year, s.city
 ORDER BY s.name ASC';

-- Runtime Execution Example (e.g., Computer Science 3rd Years with marks >= 85):
SET @filter_dept1 = 'Computer Science';
SET @filter_dept2 = 'Computer Science';
SET @filter_year1 = 3;
SET @filter_year2 = 3;
SET @filter_mark1 = 85.00;
SET @filter_mark2 = 85.00;

EXECUTE stmt_multi_filter USING 
    @filter_dept1, @filter_dept2, 
    @filter_year1, @filter_year2, 
    @filter_mark1, @filter_mark2;

-- Clean Up:
DEALLOCATE PREPARE stmt_multi_filter;
