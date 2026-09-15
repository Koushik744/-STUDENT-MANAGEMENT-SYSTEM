-- ============================================================================
-- Project: Student Management System — Static vs Dynamic SQL
-- File: database/transactions.sql
-- Description: Simple transaction demonstration for college DBMS viva
-- ============================================================================

USE student_management;

-- ----------------------------------------------------------------------------
-- What is a Database Transaction?
-- A transaction is a sequence of one or more SQL operations executed as a
-- single atomic unit of work. It follows the ACID properties:
--   Atomicity   : All operations succeed, or none do (all-or-nothing).
--   Consistency : The database transitions from one valid state to another.
--   Isolation   : Concurrent transactions do not interfere with each other.
--   Durability  : Committed changes are permanent, even after a system crash.
-- ----------------------------------------------------------------------------

-- ============================================================================
-- SCENARIO 1: Successful Transaction (COMMIT)
-- Enrolling a student in a course and verifying that changes become permanent.
-- ============================================================================

SELECT '--- [SCENARIO 1] Starting Successful Transaction ---' AS transaction_stage;

-- Step 1: Begin the transaction
START TRANSACTION;

-- Step 2: Insert a new enrollment record for Student ID 1 into Course 'IT301'
INSERT INTO enrollments (student_id, course_id, marks, semester) 
VALUES (1, 'IT301', 89.50, 'Sem 6');

-- Step 3: Verify the record is visible inside the current active transaction
SELECT * 
FROM enrollments 
WHERE student_id = 1 AND course_id = 'IT301' AND semester = 'Sem 6';

-- Step 4: Commit changes permanently to the database
COMMIT;

SELECT '--- [SCENARIO 1] Transaction Committed Successfully! Data is permanent. ---' AS transaction_stage;

-- Verify after COMMIT
SELECT enrollment_id, student_id, course_id, marks, semester 
FROM enrollments 
WHERE student_id = 1 AND course_id = 'IT301' AND semester = 'Sem 6';


-- ============================================================================
-- SCENARIO 2: Failed / Cancelled Transaction (ROLLBACK)
-- Demonstrating how ROLLBACK undoes changes when an issue occurs.
-- ============================================================================

SELECT '--- [SCENARIO 2] Starting Transaction that will be Rolled Back ---' AS transaction_stage;

-- Step 1: Begin the transaction
START TRANSACTION;

-- Step 2: Insert a temporary enrollment record for Student ID 2
INSERT INTO enrollments (student_id, course_id, marks, semester) 
VALUES (2, 'ME202', 72.00, 'Sem 4');

-- Step 3: Check that the record appears temporarily within this session
SELECT * 
FROM enrollments 
WHERE student_id = 2 AND course_id = 'ME202' AND semester = 'Sem 4';

-- Step 4: Simulate a business rule violation or user cancellation -> ROLLBACK
ROLLBACK;

SELECT '--- [SCENARIO 2] ROLLBACK Executed! All uncommitted changes were undone. ---' AS transaction_stage;

-- Step 5: Verify that the record does NOT exist in the database after ROLLBACK
SELECT COUNT(*) AS record_count_after_rollback 
FROM enrollments 
WHERE student_id = 2 AND course_id = 'ME202' AND semester = 'Sem 4';
