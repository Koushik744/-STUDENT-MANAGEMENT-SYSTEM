-- ============================================================================
-- Project: Student Management System — Static vs Dynamic SQL
-- File: database/sample_data.sql
-- Description: Realistic sample dataset (25 students, 6 courses, 45+ enrollments)
-- ============================================================================

USE student_management;

-- Clear previous records to avoid duplicates
DELETE FROM enrollments;
DELETE FROM courses;
DELETE FROM students;

-- Reset Auto-Increment Counters
ALTER TABLE students AUTO_INCREMENT = 1;
ALTER TABLE enrollments AUTO_INCREMENT = 1;

-- ============================================================================
-- 1. Insert Courses
-- ============================================================================
INSERT INTO courses (course_id, course_name, department, credits) VALUES
('CS101', 'Database Management Systems', 'Computer Science', 4),
('CS102', 'Data Structures & Algorithms', 'Computer Science', 4),
('CY201', 'Network Security & Cryptography', 'Cybersecurity', 3),
('IT301', 'Cloud Computing Architecture', 'Information Technology', 3),
('EC105', 'Microprocessors & Microcontrollers', 'Electronics', 4),
('ME202', 'Thermodynamics & Heat Transfer', 'Mechanical', 3);

-- ============================================================================
-- 2. Insert Students (25 Students with diverse years, cities, & departments)
-- ============================================================================
INSERT INTO students (name, email, department, year, gender, city) VALUES
('Aarav Sharma', 'aarav.sharma@univ.edu', 'Computer Science', 3, 'Male', 'Hyderabad'),
('Diya Patel', 'diya.patel@univ.edu', 'Computer Science', 2, 'Female', 'Bengaluru'),
('Rahul Varma', 'rahul.varma@univ.edu', 'Cybersecurity', 3, 'Male', 'Hyderabad'),
('Ananya Reddy', 'ananya.reddy@univ.edu', 'Computer Science', 3, 'Female', 'Hyderabad'),
('Vikram Joshi', 'vikram.joshi@univ.edu', 'Information Technology', 4, 'Male', 'Mumbai'),
('Sneha Nair', 'sneha.nair@univ.edu', 'Electronics', 2, 'Female', 'Chennai'),
('Rohan Kulkarni', 'rohan.kulkarni@univ.edu', 'Computer Science', 1, 'Male', 'Pune'),
('Pooja Mehta', 'pooja.mehta@univ.edu', 'Cybersecurity', 4, 'Female', 'Delhi'),
('Aditya Rao', 'aditya.rao@univ.edu', 'Mechanical', 3, 'Male', 'Hyderabad'),
('Ishita Sen', 'ishita.sen@univ.edu', 'Computer Science', 3, 'Female', 'Bengaluru'),
('Karan Malhotra', 'karan.malhotra@univ.edu', 'Information Technology', 2, 'Male', 'Delhi'),
('Tanvi Deshmukh', 'tanvi.deshmukh@univ.edu', 'Electronics', 3, 'Female', 'Pune'),
('Naveen Kumar', 'naveen.kumar@univ.edu', 'Computer Science', 4, 'Male', 'Hyderabad'),
('Meera Iyer', 'meera.iyer@univ.edu', 'Cybersecurity', 2, 'Female', 'Chennai'),
('Siddharth Das', 'siddharth.das@univ.edu', 'Mechanical', 1, 'Male', 'Mumbai'),
('Ritu Verma', 'ritu.verma@univ.edu', 'Computer Science', 2, 'Female', 'Hyderabad'),
('Gaurav Singhal', 'gaurav.singhal@univ.edu', 'Information Technology', 3, 'Male', 'Delhi'),
('Kavya Swaminathan', 'kavya.s@univ.edu', 'Electronics', 4, 'Female', 'Bengaluru'),
('Arjun Nair', 'arjun.nair@univ.edu', 'Computer Science', 3, 'Male', 'Chennai'),
('Divya Rathi', 'divya.rathi@univ.edu', 'Cybersecurity', 1, 'Female', 'Pune'),
('Manish Gupta', 'manish.gupta@univ.edu', 'Mechanical', 2, 'Male', 'Mumbai'),
('Pragya Tiwari', 'pragya.tiwari@univ.edu', 'Computer Science', 4, 'Female', 'Hyderabad'),
('Harish Pillai', 'harish.pillai@univ.edu', 'Information Technology', 3, 'Male', 'Bengaluru'),
('Swati Roy', 'swati.roy@univ.edu', 'Electronics', 1, 'Female', 'Delhi'),
('Nikhil Saxena', 'nikhil.saxena@univ.edu', 'Cybersecurity', 3, 'Male', 'Hyderabad');

-- ============================================================================
-- 3. Insert Enrollments (46 Records linking students to courses with marks)
-- ============================================================================
INSERT INTO enrollments (student_id, course_id, marks, semester) VALUES
(1, 'CS101', 92.50, 'Sem 5'),
(1, 'CS102', 88.00, 'Sem 5'),
(2, 'CS101', 84.00, 'Sem 3'),
(2, 'CS102', 79.50, 'Sem 3'),
(3, 'CY201', 95.00, 'Sem 5'),
(4, 'CS101', 91.00, 'Sem 5'),
(4, 'CS102', 96.00, 'Sem 5'),
(5, 'IT301', 78.50, 'Sem 7'),
(6, 'EC105', 82.00, 'Sem 3'),
(7, 'CS101', 74.00, 'Sem 1'),
(8, 'CY201', 89.50, 'Sem 7'),
(9, 'ME202', 85.00, 'Sem 5'),
(10, 'CS101', 88.50, 'Sem 5'),
(10, 'CS102', 90.00, 'Sem 5'),
(11, 'IT301', 76.00, 'Sem 3'),
(12, 'EC105', 93.00, 'Sem 5'),
(13, 'CS101', 81.00, 'Sem 7'),
(13, 'CS102', 85.50, 'Sem 7'),
(14, 'CY201', 87.00, 'Sem 3'),
(15, 'ME202', 71.50, 'Sem 1'),
(16, 'CS101', 89.00, 'Sem 3'),
(16, 'CS102', 94.00, 'Sem 3'),
(17, 'IT301', 83.50, 'Sem 5'),
(18, 'EC105', 79.00, 'Sem 7'),
(19, 'CS101', 86.50, 'Sem 5'),
(19, 'CS102', 82.00, 'Sem 5'),
(20, 'CY201', 77.00, 'Sem 1'),
(21, 'ME202', 80.50, 'Sem 3'),
(22, 'CS101', 97.00, 'Sem 7'),
(22, 'CS102', 95.50, 'Sem 7'),
(23, 'IT301', 88.00, 'Sem 5'),
(24, 'EC105', 84.50, 'Sem 1'),
(25, 'CY201', 91.50, 'Sem 5'),
(1, 'CY201', 86.00, 'Sem 5'),
(3, 'CS101', 82.50, 'Sem 5'),
(4, 'CY201', 89.00, 'Sem 5'),
(8, 'IT301', 90.50, 'Sem 7'),
(9, 'CS101', 77.00, 'Sem 5'),
(10, 'CY201', 92.00, 'Sem 5'),
(12, 'CS101', 85.00, 'Sem 5'),
(14, 'CS102', 88.00, 'Sem 3'),
(17, 'CS101', 81.50, 'Sem 5'),
(18, 'IT301', 86.00, 'Sem 7'),
(22, 'CY201', 94.00, 'Sem 7'),
(23, 'CS101', 87.50, 'Sem 5'),
(25, 'CS101', 89.00, 'Sem 5');
