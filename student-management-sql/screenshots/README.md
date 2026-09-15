# Project Demonstration Outputs & Screenshots Guide

This directory is reserved for capturing and storing execution screenshots for your college lab report, project submission, and slide presentation.

---

## Recommended Screenshots to Capture for College Submission

| File Name | Description | What Examiner Looks For |
|---|---|---|
| `01_main_menu.png` | Main CLI Menu | Clear separation: `1. STATIC SQL MODULE` vs `2. DYNAMIC SQL MODULE` |
| `02_static_cs_students.png` | Static Query (CS Students) | Hardcoded `WHERE department = 'Computer Science'` query printed and table displayed |
| `03_static_high_marks.png` | Static Query (Marks > 80) | Fixed relational JOIN query with `marks > 80.00` |
| `04_dynamic_dept_search.png` | Dynamic Search by Department | Runtime input prompt (`Cybersecurity`), parameter binding, query execution |
| `05_dynamic_sorting_whitelist.png` | Dynamic Sorting with Whitelist | User choosing sort column (Name/Year/City) and console showing whitelist verification against SQL Injection |
| `06_mysql_workbench_static.png` | MySQL Workbench Static Demo | Running `static/static_demo.sql` directly in MySQL Workbench |
| `07_mysql_workbench_dynamic.png` | MySQL Workbench Dynamic Demo | Running `dynamic/dynamic_demo.sql` demonstrating `PREPARE`, `EXECUTE`, and `DEALLOCATE` |

---

## Sample Text Terminal Output Captures

### 1. Main Navigation Menu
```text
================================================================================
          STUDENT MANAGEMENT SYSTEM — STATIC VS DYNAMIC SQL
            Academic Project for Demonstration and Viva Voce
================================================================================

========================================
       STUDENT MANAGEMENT SYSTEM
========================================
Active Engine: Embedded Demo Engine (SQLite compatible) / MySQL 8.0+
----------------------------------------
1. STATIC SQL MODULE
2. DYNAMIC SQL MODULE
3. Exit
========================================
Enter your choice (1-3): 1
```

### 2. Static SQL Demonstration (Option 2: CS Students)
```text
======================================================================
MODULE 1 [STATIC SQL]: Static Query: Computer Science students (Fixed condition: department = 'Computer Science')
----------------------------------------------------------------------
EXAMINER NOTE: The SQL statement structure and predicates are hardcoded.
SQL EXECUTED:
SELECT student_id, name, email, year, gender, city FROM students WHERE department = 'Computer Science' ORDER BY name ASC
======================================================================
+------------+---------------+-------------------------+------+--------+-----------+
| student_id | name          | email                   | year | gender | city      |
+------------+---------------+-------------------------+------+--------+-----------+
| 1          | Aarav Sharma  | aarav.sharma@univ.edu   | 3    | Male   | Hyderabad |
| 4          | Ananya Reddy  | ananya.reddy@univ.edu   | 3    | Female | Hyderabad |
| 19         | Arjun Nair    | arjun.nair@univ.edu     | 3    | Male   | Chennai   |
| 2          | Diya Patel    | diya.patel@univ.edu     | 2    | Female | Bengaluru |
| 10         | Ishita Sen    | ishita.sen@univ.edu     | 3    | Female | Bengaluru |
| 13         | Naveen Kumar  | naveen.kumar@univ.edu   | 4    | Male   | Hyderabad |
| 22         | Pragya Tiwari | pragya.tiwari@univ.edu  | 4    | Female | Hyderabad |
| 16         | Ritu Verma    | ritu.verma@univ.edu     | 2    | Female | Hyderabad |
| 7          | Rohan Kulkarni| rohan.kulkarni@univ.edu | 1    | Male   | Pune      |
+------------+---------------+-------------------------+------+--------+-----------+
Total Rows: 9
```

### 3. Dynamic SQL Demonstration (Option 5: Dynamic Sorting with Whitelisting)
```text
--- DYNAMIC SORTING WITH SECURITY WHITELISTING ---
Select sort column:
  1. Sort by Name
  2. Sort by Year
  3. Sort by City
Enter choice (1-3): 2

Select sort direction:
  1. Ascending (ASC)
  2. Descending (DESC)
Enter choice (1-2, default=1): 2

======================================================================
MODULE 2 [DYNAMIC SQL]: Safe Dynamic Sorting (Identifier Whitelisting)
----------------------------------------------------------------------
[WHITELIST AUDIT] User Input: option '2' -> Resolved To: 'year'
[WHITELIST AUDIT] User Input: option '2' -> Resolved To: 'DESC'
[SECURITY RATIONALE] SQL bind parameters (?) cannot be used for column names or ASC/DESC.
                     Therefore, strict whitelisting is required to prevent SQL Injection.
SAFELY GENERATED SQL:
SELECT student_id, name, department, year, city FROM students ORDER BY year DESC
======================================================================
+------------+-------------------+------------------------+------+-----------+
| student_id | name              | department             | year | city      |
+------------+-------------------+------------------------+------+-----------+
| 5          | Vikram Joshi      | Information Technology | 4    | Mumbai    |
| 8          | Pooja Mehta       | Cybersecurity          | 4    | Delhi     |
| 13         | Naveen Kumar      | Computer Science       | 4    | Hyderabad |
| 18         | Kavya Swaminathan | Electronics            | 4    | Bengaluru |
| 22         | Pragya Tiwari     | Computer Science       | 4    | Hyderabad |
| 1          | Aarav Sharma      | Computer Science       | 3    | Hyderabad |
| 3          | Rahul Varma       | Cybersecurity          | 3    | Hyderabad |
| 4          | Ananya Reddy      | Computer Science       | 3    | Hyderabad |
| 9          | Aditya Rao        | Mechanical             | 3    | Hyderabad |
| 10         | Ishita Sen        | Computer Science       | 3    | Bengaluru |
+------------+-------------------+------------------------+------+-----------+
Total Rows: 25
```
