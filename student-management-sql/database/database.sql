-- ============================================================================
-- Project: Student Management System — Static vs Dynamic SQL
-- File: database/database.sql
-- Description: Database schema creation script for MySQL 8.0+
-- ============================================================================

-- Step 1: Create Database
CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

-- Step 2: Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

-- ============================================================================
-- Table 1: students
-- Description: Stores core student details such as ID, name, email, department,
--              academic year, gender, and residential city.
-- ============================================================================
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(50) NOT NULL,
    year INT NOT NULL CHECK (year BETWEEN 1 AND 4),
    gender VARCHAR(10) NOT NULL,
    city VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Table 2: courses
-- Description: Stores academic courses offered by respective departments.
-- ============================================================================
CREATE TABLE courses (
    course_id VARCHAR(10) PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    credits INT NOT NULL CHECK (credits > 0)
);

-- ============================================================================
-- Table 3: enrollments
-- Description: Relational junction table mapping students to courses,
--              recording their exam marks and academic semester.
-- ============================================================================
CREATE TABLE enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    marks DECIMAL(5, 2) NOT NULL CHECK (marks >= 0 AND marks <= 100),
    semester VARCHAR(20) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- ============================================================================
-- Performance Indexes
-- Definition: An index helps the database find frequently searched records faster,
--             reducing the need to scan every row in the table.
-- ============================================================================
CREATE INDEX idx_student_department ON students(department);
CREATE INDEX idx_student_city ON students(city);
CREATE INDEX idx_student_year ON students(year);
CREATE INDEX idx_enrollment_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollment_course_id ON enrollments(course_id);

