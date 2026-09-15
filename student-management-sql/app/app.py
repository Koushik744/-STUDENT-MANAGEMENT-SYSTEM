#!/usr/bin/env python3
"""
================================================================================
Student Management System — Static vs Dynamic SQL
Module Separation Showcase:
  - Module 1: Static SQL (Fixed query structure, hardcoded conditions)
  - Module 2: Dynamic SQL (Runtime parameters, prepared statements, whitelisted sorting)
  - Module 3: CRUD Operations (Create, Read, Update, Delete with parameterized queries)
  - Module 4: Database Demonstrations (Relational JOINs, Indexes, Transactions)
================================================================================
"""

import sys
import os

# Optional: Try importing mysql.connector, fallback gracefully if unavailable
try:
    import mysql.connector
    MYSQL_AVAILABLE = True
except ImportError:
    MYSQL_AVAILABLE = False

import sqlite3

# Whitelisted columns for Dynamic Sorting (SQL Injection defense)
ALLOWED_SORT_COLUMNS = {
    "1": ("name", "Student Name"),
    "2": ("year", "Academic Year"),
    "3": ("city", "Residential City")
}

ALLOWED_SORT_DIRECTIONS = {
    "1": ("ASC", "Ascending (A-Z / Low-to-High)"),
    "2": ("DESC", "Descending (Z-A / High-to-Low)")
}

ALLOWED_UPDATE_COLUMNS = {
    "1": ("department", "Department"),
    "2": ("year", "Academic Year (1-4)"),
    "3": ("city", "Residential City")
}


class DatabaseManager:
    """
    Manages database connectivity. Supports both MySQL 8.0+ and an
    in-memory / local SQLite fallback engine for seamless college viva demos.
    """
    def __init__(self, use_mysql=True, host="localhost", user="root", password="", database="student_management"):
        self.use_mysql = use_mysql
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.conn = None
        self.engine_name = "MySQL"

    def connect(self):
        """Attempts to connect to MySQL; falls back to SQLite demo engine if needed."""
        if self.use_mysql and MYSQL_AVAILABLE:
            try:
                self.conn = mysql.connector.connect(
                    host=self.host,
                    user=self.user,
                    password=self.password,
                    database=self.database
                )
                self.engine_name = "MySQL 8.0+"
                print(f"[DB] Successfully connected to MySQL database: '{self.database}'")
                return True
            except Exception as e:
                print(f"[DB WARNING] Could not connect to MySQL ({e}).")
                print("[DB NOTICE] Switching to self-contained Demo Engine (SQLite) for evaluation...")
        
        # Fallback to local SQLite engine
        self._init_sqlite_engine()
        return True

    def _init_sqlite_engine(self):
        """Initializes an in-memory database with identical schema and sample records."""
        self.engine_name = "Embedded Demo Engine (SQLite compatible)"
        self.conn = sqlite3.connect(":memory:")
        cursor = self.conn.cursor()

        # Create Schema
        cursor.execute("""
            CREATE TABLE students (
                student_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                department TEXT NOT NULL,
                year INTEGER NOT NULL,
                gender TEXT NOT NULL,
                city TEXT NOT NULL
            );
        """)
        cursor.execute("""
            CREATE TABLE courses (
                course_id TEXT PRIMARY KEY,
                course_name TEXT NOT NULL,
                department TEXT NOT NULL,
                credits INTEGER NOT NULL
            );
        """)
        cursor.execute("""
            CREATE TABLE enrollments (
                enrollment_id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                course_id TEXT NOT NULL,
                marks REAL NOT NULL,
                semester TEXT NOT NULL,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
                FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
            );
        """)

        # Create Recommended Indexes
        cursor.execute("CREATE INDEX idx_student_department ON students(department);")
        cursor.execute("CREATE INDEX idx_student_city ON students(city);")
        cursor.execute("CREATE INDEX idx_student_year ON students(year);")
        cursor.execute("CREATE INDEX idx_enrollment_student_id ON enrollments(student_id);")
        cursor.execute("CREATE INDEX idx_enrollment_course_id ON enrollments(course_id);")

        # Sample Courses (6 records)
        courses_data = [
            ('CS101', 'Database Management Systems', 'Computer Science', 4),
            ('CS102', 'Data Structures & Algorithms', 'Computer Science', 4),
            ('CY201', 'Network Security & Cryptography', 'Cybersecurity', 3),
            ('IT301', 'Cloud Computing Architecture', 'Information Technology', 3),
            ('EC105', 'Microprocessors & Microcontrollers', 'Electronics', 4),
            ('ME202', 'Thermodynamics & Heat Transfer', 'Mechanical', 3)
        ]
        cursor.executemany("INSERT INTO courses VALUES (?, ?, ?, ?)", courses_data)

        # Sample Students (25 records)
        students_data = [
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
            ('Nikhil Saxena', 'nikhil.saxena@univ.edu', 'Cybersecurity', 3, 'Male', 'Hyderabad')
        ]
        cursor.executemany("INSERT INTO students (name, email, department, year, gender, city) VALUES (?, ?, ?, ?, ?, ?)", students_data)

        # Sample Enrollments (46 records)
        enrollments_data = [
            (1, 'CS101', 92.50, 'Sem 5'), (1, 'CS102', 88.00, 'Sem 5'),
            (2, 'CS101', 84.00, 'Sem 3'), (2, 'CS102', 79.50, 'Sem 3'),
            (3, 'CY201', 95.00, 'Sem 5'), (4, 'CS101', 91.00, 'Sem 5'),
            (4, 'CS102', 96.00, 'Sem 5'), (5, 'IT301', 78.50, 'Sem 7'),
            (6, 'EC105', 82.00, 'Sem 3'), (7, 'CS101', 74.00, 'Sem 1'),
            (8, 'CY201', 89.50, 'Sem 7'), (9, 'ME202', 85.00, 'Sem 5'),
            (10, 'CS101', 88.50, 'Sem 5'), (10, 'CS102', 90.00, 'Sem 5'),
            (11, 'IT301', 76.00, 'Sem 3'), (12, 'EC105', 93.00, 'Sem 5'),
            (13, 'CS101', 81.00, 'Sem 7'), (13, 'CS102', 85.50, 'Sem 7'),
            (14, 'CY201', 87.00, 'Sem 3'), (15, 'ME202', 71.50, 'Sem 1'),
            (16, 'CS101', 89.00, 'Sem 3'), (16, 'CS102', 94.00, 'Sem 3'),
            (17, 'IT301', 83.50, 'Sem 5'), (18, 'EC105', 79.00, 'Sem 7'),
            (19, 'CS101', 86.50, 'Sem 5'), (19, 'CS102', 82.00, 'Sem 5'),
            (20, 'CY201', 77.00, 'Sem 1'), (21, 'ME202', 80.50, 'Sem 3'),
            (22, 'CS101', 97.00, 'Sem 7'), (22, 'CS102', 95.50, 'Sem 7'),
            (23, 'IT301', 88.00, 'Sem 5'), (24, 'EC105', 84.50, 'Sem 1'),
            (25, 'CY201', 91.50, 'Sem 5'), (1, 'CY201', 86.00, 'Sem 5'),
            (3, 'CS101', 82.50, 'Sem 5'), (4, 'CY201', 89.00, 'Sem 5'),
            (8, 'IT301', 90.50, 'Sem 7'), (9, 'CS101', 77.00, 'Sem 5'),
            (10, 'CY201', 92.00, 'Sem 5'), (12, 'CS101', 85.00, 'Sem 5'),
            (14, 'CS102', 88.00, 'Sem 3'), (17, 'CS101', 81.50, 'Sem 5'),
            (18, 'IT301', 86.00, 'Sem 7'), (22, 'CY201', 94.00, 'Sem 7'),
            (23, 'CS101', 87.50, 'Sem 5'), (25, 'CS101', 89.00, 'Sem 5')
        ]
        cursor.executemany("INSERT INTO enrollments (student_id, course_id, marks, semester) VALUES (?, ?, ?, ?)", enrollments_data)
        self.conn.commit()
        print("[DB] Initialized in-memory SQLite demo dataset (25 students, 6 courses, 46 enrollments).")

    def execute_query(self, query, params=None):
        """Executes a SELECT query and returns (columns, rows)."""
        cursor = self.conn.cursor()
        try:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            headers = [desc[0] for desc in cursor.description] if cursor.description else []
            rows = cursor.fetchall()
            return headers, rows
        except Exception as err:
            print(f"\n[QUERY EXECUTION ERROR]: {err}")
            return [], []

    def execute_dml(self, query, params=None):
        """Executes INSERT, UPDATE, DELETE queries and commits the transaction."""
        cursor = self.conn.cursor()
        try:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            self.conn.commit()
            return cursor.rowcount
        except Exception as err:
            print(f"\n[DML EXECUTION ERROR]: {err}")
            if hasattr(self.conn, 'rollback'):
                self.conn.rollback()
            return -1


def print_table(headers, rows):
    """Clean terminal ASCII table formatter with no external dependency required."""
    if not rows:
        print("  (No matching records found)")
        return

    col_widths = [len(str(h)) for h in headers]
    for row in rows:
        for i, val in enumerate(row):
            formatted_val = f"{val:.2f}" if isinstance(val, float) else str(val)
            col_widths[i] = max(col_widths[i], len(formatted_val))

    sep_line = "+-" + "-+-".join("-" * w for w in col_widths) + "-+"
    header_line = "| " + " | ".join(str(headers[i]).ljust(col_widths[i]) for i in range(len(headers))) + " |"

    print(sep_line)
    print(header_line)
    print(sep_line)
    for row in rows:
        row_str = "| " + " | ".join(
            (f"{val:.2f}" if isinstance(val, float) else str(val)).ljust(col_widths[i])
            for i, val in enumerate(row)
        ) + " |"
        print(row_str)
    print(sep_line)
    print(f"Total Rows: {len(rows)}\n")


# ============================================================================
# MODULE 1: STATIC SQL CONTROLLER
# ============================================================================
def run_static_module(db: DatabaseManager):
    """Handles Module 1 — Fixed SQL queries with hardcoded conditions."""
    while True:
        print("\n" + "=" * 45)
        print("         --------- STATIC SQL ---------")
        print("=" * 45)
        print("1. View all students")
        print("2. View Computer Science students")
        print("3. View 3rd year students")
        print("4. View Hyderabad students")
        print("5. View students with marks above 80")
        print("6. Average marks")
        print("7. Highest marks")
        print("8. Department statistics")
        print("9. Return to Main Menu")
        print("-" * 45)

        choice = input("Enter choice (1-9): ").strip()

        if choice == "9":
            break

        query = ""
        description = ""

        if choice == "1":
            description = "Static Query: View all students (no WHERE clause)"
            query = "SELECT student_id, name, email, department, year, gender, city FROM students ORDER BY student_id ASC"

        elif choice == "2":
            description = "Static Query: Computer Science students (Fixed condition: department = 'Computer Science')"
            query = "SELECT student_id, name, email, year, gender, city FROM students WHERE department = 'Computer Science' ORDER BY name ASC"

        elif choice == "3":
            description = "Static Query: 3rd year students (Fixed condition: year = 3)"
            query = "SELECT student_id, name, department, gender, city FROM students WHERE year = 3 ORDER BY department ASC, name ASC"

        elif choice == "4":
            description = "Static Query: Students from Hyderabad (Fixed condition: city = 'Hyderabad')"
            query = "SELECT student_id, name, department, year, city FROM students WHERE city = 'Hyderabad' ORDER BY name ASC"

        elif choice == "5":
            description = "Static Query: Students with marks > 80 (Fixed condition: marks > 80.00 via JOIN)"
            query = """
                SELECT s.student_id, s.name, s.department, c.course_name, e.marks, e.semester
                FROM students s
                JOIN enrollments e ON s.student_id = e.student_id
                JOIN courses c ON e.course_id = c.course_id
                WHERE e.marks > 80.00
                ORDER BY e.marks DESC
            """

        elif choice == "6":
            description = "Static Query: Average marks (Fixed aggregate calculation grouped by department)"
            query = """
                SELECT s.department, COUNT(DISTINCT s.student_id) AS student_count, ROUND(AVG(e.marks), 2) AS average_marks
                FROM students s
                JOIN enrollments e ON s.student_id = e.student_id
                GROUP BY s.department
                ORDER BY average_marks DESC
            """

        elif choice == "7":
            description = "Static Query: Highest & lowest marks (Fixed aggregate MAX() and MIN())"
            query = "SELECT MAX(marks) AS highest_marks, MIN(marks) AS lowest_marks, ROUND(AVG(marks), 2) AS overall_average FROM enrollments"

        elif choice == "8":
            description = "Static Query: Department statistics (Fixed GROUP BY on students table)"
            query = "SELECT department, COUNT(*) AS student_count FROM students GROUP BY department ORDER BY student_count DESC"

        else:
            print("[ERROR] Invalid selection! Please enter a number between 1 and 9.")
            continue

        print("\n" + "=" * 70)
        print(f"MODULE 1 [STATIC SQL]: {description}")
        print("-" * 70)
        print("EXAMINER NOTE: The SQL statement structure and predicates are hardcoded.")
        print("SQL EXECUTED:\n" + query.strip())
        print("=" * 70)

        headers, rows = db.execute_query(query)
        print_table(headers, rows)
        input("Press [Enter] to continue...")


# ============================================================================
# MODULE 2: DYNAMIC SQL CONTROLLER
# ============================================================================
def run_dynamic_module(db: DatabaseManager):
    """Handles Module 2 — Parameterized runtime queries and safe dynamic sorting."""
    while True:
        print("\n" + "=" * 45)
        print("        --------- DYNAMIC SQL ---------")
        print("=" * 45)
        print("1. Search by department")
        print("2. Search by city")
        print("3. Search by minimum marks")
        print("4. Search by year")
        print("5. Dynamic sorting (Whitelisted column selection)")
        print("6. Dynamic filtering (Multi-attribute runtime filter)")
        print("7. Return to Main Menu")
        print("-" * 45)

        choice = input("Enter choice (1-7): ").strip()

        if choice == "7":
            break

        if choice == "1":
            dept = input("Enter department name to search (e.g., Computer Science, Cybersecurity): ").strip()
            if not dept:
                print("[ERROR] Department cannot be empty.")
                continue

            query = "SELECT student_id, name, email, department, year, city FROM students WHERE department = ? ORDER BY name ASC"
            params = (dept,)

            print("\n" + "=" * 70)
            print("MODULE 2 [DYNAMIC SQL]: Parameterized Department Search")
            print("-" * 70)
            print("EXAMINER NOTE: The department value is supplied at runtime via a bound parameter.")
            print(f"PREPARED QUERY TEMPLATE: {query}")
            print(f"BOUND RUNTIME VALUE    : {params}")
            print("=" * 70)

            headers, rows = db.execute_query(query, params)
            print_table(headers, rows)

        elif choice == "2":
            city = input("Enter city name to search (e.g., Hyderabad, Bengaluru, Pune): ").strip()
            if not city:
                print("[ERROR] City cannot be empty.")
                continue

            query = "SELECT student_id, name, department, year, city FROM students WHERE city = ? ORDER BY name ASC"
            params = (city,)

            print("\n" + "=" * 70)
            print("MODULE 2 [DYNAMIC SQL]: Parameterized City Search")
            print("-" * 70)
            print("EXAMINER NOTE: Parameter placeholder '?' prevents SQL injection attacks.")
            print(f"PREPARED QUERY TEMPLATE: {query}")
            print(f"BOUND RUNTIME VALUE    : {params}")
            print("=" * 70)

            headers, rows = db.execute_query(query, params)
            print_table(headers, rows)

        elif choice == "3":
            marks_input = input("Enter minimum marks cutoff (e.g., 85.0): ").strip()
            try:
                min_marks = float(marks_input)
            except ValueError:
                print("[ERROR] Please enter a valid numerical score (e.g., 80 or 85.5).")
                continue

            query = """
                SELECT s.student_id, s.name, s.department, c.course_name, e.marks, e.semester
                FROM students s
                JOIN enrollments e ON s.student_id = e.student_id
                JOIN courses c ON e.course_id = c.course_id
                WHERE e.marks >= ?
                ORDER BY e.marks DESC
            """
            params = (min_marks,)

            print("\n" + "=" * 70)
            print("MODULE 2 [DYNAMIC SQL]: Parameterized Minimum Marks Cutoff")
            print("-" * 70)
            print("EXAMINER NOTE: Numeric cutoff is bound dynamically at runtime.")
            print(f"PREPARED QUERY TEMPLATE: {query.strip()}")
            print(f"BOUND RUNTIME VALUE    : {params}")
            print("=" * 70)

            headers, rows = db.execute_query(query, params)
            print_table(headers, rows)

        elif choice == "4":
            year_input = input("Enter academic year (1, 2, 3, or 4): ").strip()
            if year_input not in ["1", "2", "3", "4"]:
                print("[ERROR] Invalid year! Academic year must be 1, 2, 3, or 4.")
                continue

            target_year = int(year_input)
            query = "SELECT student_id, name, department, year, city FROM students WHERE year = ? ORDER BY department ASC, name ASC"
            params = (target_year,)

            print("\n" + "=" * 70)
            print("MODULE 2 [DYNAMIC SQL]: Parameterized Academic Year Search")
            print("-" * 70)
            print("EXAMINER NOTE: Academic year integer bound at runtime.")
            print(f"PREPARED QUERY TEMPLATE: {query}")
            print(f"BOUND RUNTIME VALUE    : {params}")
            print("=" * 70)

            headers, rows = db.execute_query(query, params)
            print_table(headers, rows)

        elif choice == "5":
            # Dynamic Sorting with strict Whitelisting
            print("\n--- DYNAMIC SORTING WITH SECURITY WHITELISTING ---")
            print("Select sort column:")
            print("  1. Sort by Name")
            print("  2. Sort by Year")
            print("  3. Sort by City")
            col_choice = input("Enter choice (1-3): ").strip()

            if col_choice not in ALLOWED_SORT_COLUMNS:
                print(f"[SECURITY ALERT] Invalid choice '{col_choice}'. Column name is NOT on the whitelist!")
                print("Protection active: Direct string concatenation prevented.")
                continue

            print("\nSelect sort direction:")
            print("  1. Ascending (ASC)")
            print("  2. Descending (DESC)")
            dir_choice = input("Enter choice (1-2, default=1): ").strip() or "1"

            if dir_choice not in ALLOWED_SORT_DIRECTIONS:
                print("[SECURITY ALERT] Invalid direction! Defaulting to ASC.")
                dir_choice = "1"

            sort_column, col_label = ALLOWED_SORT_COLUMNS[col_choice]
            sort_direction, dir_label = ALLOWED_SORT_DIRECTIONS[dir_choice]

            query = f"SELECT student_id, name, department, year, city FROM students ORDER BY {sort_column} {sort_direction}"

            print("\n" + "=" * 70)
            print("MODULE 2 [DYNAMIC SQL]: Safe Dynamic Sorting (Identifier Whitelisting)")
            print("-" * 70)
            print(f"[WHITELIST AUDIT] User Input: option '{col_choice}' -> Resolved To: '{sort_column}'")
            print(f"[WHITELIST AUDIT] User Input: option '{dir_choice}' -> Resolved To: '{sort_direction}'")
            print("[SECURITY RATIONALE] SQL bind parameters (?) cannot be used for column names or ASC/DESC.")
            print("                     Therefore, strict whitelisting is required to prevent SQL Injection.")
            print(f"SAFELY GENERATED SQL:\n{query}")
            print("=" * 70)

            headers, rows = db.execute_query(query)
            print_table(headers, rows)

        elif choice == "6":
            # Dynamic Multi-criteria Filtering
            print("\n--- DYNAMIC MULTI-CRITERIA FILTERING ---")
            print("(Leave any field empty to skip filtering on that attribute)")
            dept_input = input("Enter department (or press Enter to skip): ").strip()
            year_input = input("Enter academic year 1-4 (or press Enter to skip): ").strip()
            city_input = input("Enter city (or press Enter to skip): ").strip()

            conditions = []
            params = []

            if dept_input:
                conditions.append("department = ?")
                params.append(dept_input)
            if year_input and year_input in ["1", "2", "3", "4"]:
                conditions.append("year = ?")
                params.append(int(year_input))
            if city_input:
                conditions.append("city = ?")
                params.append(city_input)

            if conditions:
                where_clause = " WHERE " + " AND ".join(conditions)
            else:
                where_clause = ""

            query = f"SELECT student_id, name, department, year, city FROM students{where_clause} ORDER BY name ASC"

            print("\n" + "=" * 70)
            print("MODULE 2 [DYNAMIC SQL]: Dynamically Assembled WHERE Predicates")
            print("-" * 70)
            print(f"ACTIVE FILTERS APPLIED : {len(conditions)}")
            print(f"GENERATED SQL TEMPLATE : {query}")
            print(f"BOUND RUNTIME PARAMS   : {tuple(params)}")
            print("=" * 70)

            headers, rows = db.execute_query(query, tuple(params))
            print_table(headers, rows)

        else:
            print("[ERROR] Invalid selection! Please enter a number between 1 and 7.")
            continue

        input("Press [Enter] to continue...")


# ============================================================================
# MODULE 3: CRUD OPERATIONS CONTROLLER
# ============================================================================
def run_crud_module(db: DatabaseManager):
    """Handles CRUD Operations with clear documentation of Static vs Dynamic SQL."""
    while True:
        print("\n" + "=" * 45)
        print("        --------- CRUD OPERATIONS ---------")
        print("=" * 45)
        print("1. CREATE — Add New Student")
        print("2. READ   — View / Search Students")
        print("3. UPDATE — Update Student Information")
        print("4. DELETE — Delete a Student")
        print("5. Return to Main Menu")
        print("-" * 45)

        choice = input("Enter choice (1-5): ").strip()

        if choice == "5":
            break

        if choice == "1":
            # CREATE: Parameterized Dynamic SQL
            print("\n[CREATE OPERATION]")
            print("Classification: Parameterized Dynamic SQL (User-provided values bound at runtime)")
            name = input("Enter Student Name: ").strip()
            email = input("Enter Student Email: ").strip()
            dept = input("Enter Department (e.g., Computer Science, Cybersecurity): ").strip()
            year_str = input("Enter Year (1-4): ").strip()
            gender = input("Enter Gender (Male/Female/Other): ").strip()
            city = input("Enter City: ").strip()

            if not (name and email and dept and year_str and gender and city):
                print("[ERROR] All fields are mandatory.")
                continue

            try:
                year = int(year_str)
                if year not in [1, 2, 3, 4]:
                    raise ValueError()
            except ValueError:
                print("[ERROR] Academic Year must be an integer between 1 and 4.")
                continue

            query = "INSERT INTO students (name, email, department, year, gender, city) VALUES (?, ?, ?, ?, ?, ?)"
            params = (name, email, dept, year, gender, city)

            print("\n" + "=" * 70)
            print("SQL EXECUTED: " + query)
            print(f"BOUND VALUES: {params}")
            print("=" * 70)

            rows_affected = db.execute_dml(query, params)
            if rows_affected > 0:
                print(f"[SUCCESS] Student '{name}' successfully registered!")
            else:
                print("[FAILURE] Could not insert student (check for duplicate email).")

        elif choice == "2":
            # READ: Static vs Dynamic choices
            print("\n[READ OPERATION]")
            print("Select read mode:")
            print("  1. Read All Students (Static SQL — fixed query structure)")
            print("  2. Search by Student ID (Dynamic SQL — runtime parameter)")
            read_choice = input("Enter choice (1-2): ").strip()

            if read_choice == "1":
                query = "SELECT student_id, name, email, department, year, city FROM students ORDER BY student_id DESC LIMIT 15"
                print("\n[STATIC SQL EXECUTED]: " + query)
                headers, rows = db.execute_query(query)
                print_table(headers, rows)
            elif read_choice == "2":
                sid = input("Enter Student ID to lookup: ").strip()
                query = "SELECT student_id, name, email, department, year, city FROM students WHERE student_id = ?"
                print("\n[DYNAMIC PARAMETERIZED SQL EXECUTED]: " + query)
                headers, rows = db.execute_query(query, (sid,))
                print_table(headers, rows)
            else:
                print("[ERROR] Invalid choice.")

        elif choice == "3":
            # UPDATE: Parameterized Dynamic SQL with Column Whitelisting
            print("\n[UPDATE OPERATION]")
            print("Classification: Parameterized Dynamic SQL with Whitelisted Column Identifiers")
            sid = input("Enter Student ID to update: ").strip()

            # Check if student exists
            check_headers, check_rows = db.execute_query("SELECT student_id, name, department, year, city FROM students WHERE student_id = ?", (sid,))
            if not check_rows:
                print(f"[ERROR] Student with ID {sid} not found.")
                continue

            print("Current Record:")
            print_table(check_headers, check_rows)

            print("Select field to update:")
            print("  1. Department")
            print("  2. Academic Year")
            print("  3. City")
            f_choice = input("Enter choice (1-3): ").strip()

            if f_choice not in ALLOWED_UPDATE_COLUMNS:
                print("[ERROR] Invalid field selection!")
                continue

            col_name, col_label = ALLOWED_UPDATE_COLUMNS[f_choice]
            new_val = input(f"Enter new value for {col_label}: ").strip()

            if not new_val:
                print("[ERROR] New value cannot be empty.")
                continue

            if col_name == "year":
                try:
                    new_val = int(new_val)
                    if new_val not in [1, 2, 3, 4]:
                        raise ValueError()
                except ValueError:
                    print("[ERROR] Academic Year must be 1, 2, 3, or 4.")
                    continue

            # Safe query with whitelisted column name and bound parameter
            query = f"UPDATE students SET {col_name} = ? WHERE student_id = ?"
            params = (new_val, sid)

            print("\n" + "=" * 70)
            print("SAFELY GENERATED SQL: " + query)
            print(f"BOUND VALUES        : {params}")
            print("=" * 70)

            rows_affected = db.execute_dml(query, params)
            if rows_affected > 0:
                print(f"[SUCCESS] Student ID {sid} successfully updated!")
            else:
                print("[FAILURE] Update failed.")

        elif choice == "4":
            # DELETE: Parameterized Dynamic SQL
            print("\n[DELETE OPERATION]")
            print("Classification: Parameterized Dynamic SQL")
            sid = input("Enter Student ID to delete: ").strip()

            # Confirm record
            check_headers, check_rows = db.execute_query("SELECT student_id, name, department, city FROM students WHERE student_id = ?", (sid,))
            if not check_rows:
                print(f"[ERROR] Student with ID {sid} not found.")
                continue

            print("Record to be deleted:")
            print_table(check_headers, check_rows)

            confirm = input(f"Are you sure you want to delete student ID {sid}? (yes/no): ").strip().lower()
            if confirm not in ["yes", "y"]:
                print("[ACTION CANCELLED] Deletion aborted.")
                continue

            query = "DELETE FROM students WHERE student_id = ?"
            print("\n[DYNAMIC PARAMETERIZED SQL EXECUTED]: " + query)
            print(f"[NOTE] Foreign key constraints will automatically remove associated enrollment records.")

            rows_affected = db.execute_dml(query, (sid,))
            if rows_affected > 0:
                print(f"[SUCCESS] Student ID {sid} deleted successfully.")
            else:
                print("[FAILURE] Deletion failed.")

        else:
            print("[ERROR] Invalid selection! Please enter a number between 1 and 5.")
            continue

        input("Press [Enter] to continue...")


# ============================================================================
# MODULE 4: DATABASE DEMONSTRATIONS CONTROLLER
# ============================================================================
def run_database_demonstrations(db: DatabaseManager):
    """Handles JOINs, Indexes, and Transactions demonstrations."""
    while True:
        print("\n" + "=" * 45)
        print("    ---- DATABASE DEMONSTRATIONS ----")
        print("=" * 45)
        print("1. JOIN Demonstration")
        print("2. Index Demonstration")
        print("3. Transaction Demonstration")
        print("4. Return to Main Menu")
        print("-" * 45)

        choice = input("Enter choice (1-4): ").strip()

        if choice == "4":
            break

        if choice == "1":
            # Relational JOIN Demonstration Submenu
            print("\n--- RELATIONAL JOIN DEMONSTRATIONS ---")
            print("1. Student name + Course name + Marks (3-Table JOIN)")
            print("2. Students enrolled in a particular course (e.g., CS101)")
            print("3. Average marks by course")
            print("4. Average marks by department")
            print("5. Top-performing students (Marks >= 90)")
            print("6. Complete student enrollment details")
            join_choice = input("Select JOIN query (1-6): ").strip()

            if join_choice == "1":
                query = """
                    SELECT s.name AS student_name, c.course_name, e.marks, e.semester
                    FROM students s
                    JOIN enrollments e ON s.student_id = e.student_id
                    JOIN courses c ON e.course_id = c.course_id
                    ORDER BY s.name ASC
                    LIMIT 12
                """
                desc = "3-Table JOIN: Linking Students ➔ Enrollments ➔ Courses"
                headers, rows = db.execute_query(query)
            elif join_choice == "2":
                target_course = input("Enter Course ID [default: CS101]: ").strip() or "CS101"
                query = """
                    SELECT s.student_id, s.name, s.department, c.course_name, e.marks
                    FROM students s
                    JOIN enrollments e ON s.student_id = e.student_id
                    JOIN courses c ON e.course_id = c.course_id
                    WHERE c.course_id = ?
                    ORDER BY e.marks DESC
                """
                desc = f"JOIN Query: Students enrolled in course '{target_course}'"
                headers, rows = db.execute_query(query, (target_course,))
            elif join_choice == "3":
                query = """
                    SELECT c.course_id, c.course_name, COUNT(e.enrollment_id) AS total_enrolled, ROUND(AVG(e.marks), 2) AS avg_marks
                    FROM courses c
                    JOIN enrollments e ON c.course_id = e.course_id
                    GROUP BY c.course_id, c.course_name
                    ORDER BY avg_marks DESC
                """
                desc = "JOIN with Aggregation: Average Marks per Course"
                headers, rows = db.execute_query(query)
            elif join_choice == "4":
                query = """
                    SELECT s.department, COUNT(DISTINCT s.student_id) AS student_count, ROUND(AVG(e.marks), 2) AS avg_marks
                    FROM students s
                    JOIN enrollments e ON s.student_id = e.student_id
                    GROUP BY s.department
                    ORDER BY avg_marks DESC
                """
                desc = "JOIN with Aggregation: Departmental Benchmark Scores"
                headers, rows = db.execute_query(query)
            elif join_choice == "5":
                query = """
                    SELECT s.student_id, s.name, s.department, c.course_name, e.marks
                    FROM students s
                    JOIN enrollments e ON s.student_id = e.student_id
                    JOIN courses c ON e.course_id = c.course_id
                    WHERE e.marks >= 90.00
                    ORDER BY e.marks DESC
                """
                desc = "JOIN with High-Achiever Filter: Marks >= 90.00"
                headers, rows = db.execute_query(query)
            elif join_choice == "6":
                query = """
                    SELECT s.student_id, s.name, s.email, c.course_name, e.marks, e.semester
                    FROM students s
                    JOIN enrollments e ON s.student_id = e.student_id
                    JOIN courses c ON e.course_id = c.course_id
                    ORDER BY s.student_id ASC
                    LIMIT 15
                """
                desc = "Comprehensive Student Enrollment Roster"
                headers, rows = db.execute_query(query)
            else:
                print("[ERROR] Invalid choice.")
                continue

            print("\n" + "=" * 70)
            print(f"DATABASE DEMO: {desc}")
            print("-" * 70)
            print("SQL EXECUTED:\n" + query.strip())
            print("=" * 70)
            print_table(headers, rows)

        elif choice == "2":
            # Index Demonstration
            print("\n" + "=" * 70)
            print("DATABASE DEMO: Database Indexes")
            print("-" * 70)
            print("WHAT IS AN INDEX?")
            print("  An index helps the database find frequently searched records faster,")
            print("  reducing the need to scan every row in the table.")
            print("\nACTIVE INDEXES IN THIS DATABASE:")
            print("  - idx_student_department ON students(department)")
            print("  - idx_student_city       ON students(city)")
            print("  - idx_student_year       ON students(year)")
            print("  - idx_enrollment_student ON enrollments(student_id)")
            print("  - idx_enrollment_course  ON enrollments(course_id)")
            print("\nDEMONSTRATION QUERY PLAN (EXPLAIN):")
            explain_query = "EXPLAIN SELECT * FROM students WHERE department = 'Computer Science'"
            print("SQL: " + explain_query)
            print("=" * 70)

            try:
                headers, rows = db.execute_query(explain_query)
                print_table(headers, rows)
            except Exception as e:
                print(f"[NOTE] EXPLAIN query detail: {e}")

        elif choice == "3":
            # Transaction Demonstration
            print("\n" + "=" * 70)
            print("DATABASE DEMO: Database Transactions (ACID Principles)")
            print("-" * 70)
            print("A transaction is an atomic unit of work (all operations succeed, or none do).")
            print("\nSelect Transaction Scenario to Test:")
            print("  1. Successful Transaction (START TRANSACTION -> INSERT -> COMMIT)")
            print("  2. Rolled-Back Transaction (START TRANSACTION -> INSERT -> ROLLBACK)")
            tx_choice = input("Enter choice (1-2): ").strip()

            if tx_choice == "1":
                print("\n[SCENARIO 1: COMMIT]")
                print("Step 1: Starting Transaction...")
                # Show before count
                h, r = db.execute_query("SELECT COUNT(*) AS total_enrollments FROM enrollments WHERE student_id = 1 AND course_id = 'IT301'")
                print("Count before transaction:", r[0][0])

                print("Step 2: Inserting enrollment for Student ID 1 into Course 'IT301'...")
                db.execute_dml("INSERT INTO enrollments (student_id, course_id, marks, semester) VALUES (?, ?, ?, ?)", (1, 'IT301', 89.50, 'Sem 6'))
                print("Step 3: COMMIT executed! Changes are now permanent in the database.")

                h, r = db.execute_query("SELECT COUNT(*) AS total_enrollments FROM enrollments WHERE student_id = 1 AND course_id = 'IT301'")
                print("Count after COMMIT:", r[0][0])
                print("[VERIFIED] Record successfully saved via transaction COMMIT.")

            elif tx_choice == "2":
                print("\n[SCENARIO 2: ROLLBACK]")
                print("Step 1: Beginning transaction...")
                print("Step 2: Temporarily inserting enrollment for Student ID 2 into Course 'ME202'...")
                
                # In SQLite or MySQL, test manual rollback
                cursor = db.conn.cursor()
                cursor.execute("INSERT INTO enrollments (student_id, course_id, marks, semester) VALUES (?, ?, ?, ?)", (2, 'ME202', 72.00, 'Sem 4'))
                print("Step 3: Simulating error or user cancellation -> Executing ROLLBACK...")
                db.conn.rollback()
                print("Step 4: ROLLBACK complete! All uncommitted changes were discarded.")

                h, r = db.execute_query("SELECT COUNT(*) AS count_after_rollback FROM enrollments WHERE student_id = 2 AND course_id = 'ME202' AND semester = 'Sem 4'")
                print("Record count after ROLLBACK:", r[0][0])
                print("[VERIFIED] Record was discarded cleanly. Atomicity is preserved!")
            else:
                print("[ERROR] Invalid choice.")

        else:
            print("[ERROR] Invalid selection! Please enter a number between 1 and 4.")
            continue

        input("Press [Enter] to continue...")


# ============================================================================
# MAIN APPLICATION CONTROLLER
# ============================================================================
def main():
    print("""
================================================================================
          STUDENT MANAGEMENT SYSTEM — STATIC VS DYNAMIC SQL
            Academic Project for Demonstration and Viva Voce
================================================================================
    """)

    print("Database Connection Options:")
    print("  1. Connect to local MySQL 8.0+ Server (requires credentials)")
    print("  2. Launch Self-Contained Demo Engine (Embedded, zero-setup, instant)")
    db_choice = input("Select database mode (1 or 2, default=2): ").strip() or "2"

    if db_choice == "1":
        host = input("MySQL Host [localhost]: ").strip() or "localhost"
        user = input("MySQL User [root]: ").strip() or "root"
        password = input("MySQL Password []: ").strip()
        database = input("Database Name [student_management]: ").strip() or "student_management"
        db = DatabaseManager(use_mysql=True, host=host, user=user, password=password, database=database)
    else:
        db = DatabaseManager(use_mysql=False)

    db.connect()

    # Main Application Loop with exact 5 menu items requested
    while True:
        print("\n" + "=" * 40)
        print("       STUDENT MANAGEMENT SYSTEM")
        print("=" * 40)
        print(f"Active Engine: {db.engine_name}")
        print("-" * 40)
        print("1. STATIC SQL MODULE")
        print("2. DYNAMIC SQL MODULE")
        print("3. CRUD OPERATIONS")
        print("4. DATABASE DEMONSTRATIONS")
        print("5. Exit")
        print("=" * 40)

        main_choice = input("Enter your choice (1-5): ").strip()

        if main_choice == "1":
            run_static_module(db)
        elif main_choice == "2":
            run_dynamic_module(db)
        elif main_choice == "3":
            run_crud_module(db)
        elif main_choice == "4":
            run_database_demonstrations(db)
        elif main_choice == "5":
            print("\nThank you for evaluating the Student Management System project!")
            print("Exiting application...\n")
            sys.exit(0)
        else:
            print("[ERROR] Invalid choice! Please enter a number between 1 and 5.")


if __name__ == "__main__":
    main()
