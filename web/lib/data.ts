// Sample data from the Student Management System Python project
// Exact data as used in app/app.py _init_sqlite_engine()

export interface Student {
  student_id: number;
  name: string;
  email: string;
  department: string;
  year: number;
  gender: string;
  city: string;
}

export interface Course {
  course_id: string;
  course_name: string;
  department: string;
  credits: number;
}

export interface Enrollment {
  enrollment_id: number;
  student_id: number;
  course_id: string;
  marks: number;
  semester: string;
}

export const students: Student[] = [
  { student_id: 1,  name: 'Aarav Sharma',      email: 'aarav.sharma@univ.edu',      department: 'Computer Science',       year: 3, gender: 'Male',   city: 'Hyderabad' },
  { student_id: 2,  name: 'Diya Patel',         email: 'diya.patel@univ.edu',        department: 'Computer Science',       year: 2, gender: 'Female', city: 'Bengaluru' },
  { student_id: 3,  name: 'Rahul Varma',        email: 'rahul.varma@univ.edu',       department: 'Cybersecurity',          year: 3, gender: 'Male',   city: 'Hyderabad' },
  { student_id: 4,  name: 'Ananya Reddy',       email: 'ananya.reddy@univ.edu',      department: 'Computer Science',       year: 3, gender: 'Female', city: 'Hyderabad' },
  { student_id: 5,  name: 'Vikram Joshi',       email: 'vikram.joshi@univ.edu',      department: 'Information Technology', year: 4, gender: 'Male',   city: 'Mumbai' },
  { student_id: 6,  name: 'Sneha Nair',         email: 'sneha.nair@univ.edu',        department: 'Electronics',            year: 2, gender: 'Female', city: 'Chennai' },
  { student_id: 7,  name: 'Rohan Kulkarni',     email: 'rohan.kulkarni@univ.edu',    department: 'Computer Science',       year: 1, gender: 'Male',   city: 'Pune' },
  { student_id: 8,  name: 'Pooja Mehta',        email: 'pooja.mehta@univ.edu',       department: 'Cybersecurity',          year: 4, gender: 'Female', city: 'Delhi' },
  { student_id: 9,  name: 'Aditya Rao',         email: 'aditya.rao@univ.edu',        department: 'Mechanical',             year: 3, gender: 'Male',   city: 'Hyderabad' },
  { student_id: 10, name: 'Ishita Sen',         email: 'ishita.sen@univ.edu',        department: 'Computer Science',       year: 3, gender: 'Female', city: 'Bengaluru' },
  { student_id: 11, name: 'Karan Malhotra',     email: 'karan.malhotra@univ.edu',    department: 'Information Technology', year: 2, gender: 'Male',   city: 'Delhi' },
  { student_id: 12, name: 'Tanvi Deshmukh',     email: 'tanvi.deshmukh@univ.edu',    department: 'Electronics',            year: 3, gender: 'Female', city: 'Pune' },
  { student_id: 13, name: 'Naveen Kumar',       email: 'naveen.kumar@univ.edu',      department: 'Computer Science',       year: 4, gender: 'Male',   city: 'Hyderabad' },
  { student_id: 14, name: 'Meera Iyer',         email: 'meera.iyer@univ.edu',        department: 'Cybersecurity',          year: 2, gender: 'Female', city: 'Chennai' },
  { student_id: 15, name: 'Siddharth Das',      email: 'siddharth.das@univ.edu',     department: 'Mechanical',             year: 1, gender: 'Male',   city: 'Mumbai' },
  { student_id: 16, name: 'Ritu Verma',         email: 'ritu.verma@univ.edu',        department: 'Computer Science',       year: 2, gender: 'Female', city: 'Hyderabad' },
  { student_id: 17, name: 'Gaurav Singhal',     email: 'gaurav.singhal@univ.edu',    department: 'Information Technology', year: 3, gender: 'Male',   city: 'Delhi' },
  { student_id: 18, name: 'Kavya Swaminathan',  email: 'kavya.s@univ.edu',           department: 'Electronics',            year: 4, gender: 'Female', city: 'Bengaluru' },
  { student_id: 19, name: 'Arjun Nair',         email: 'arjun.nair@univ.edu',        department: 'Computer Science',       year: 3, gender: 'Male',   city: 'Chennai' },
  { student_id: 20, name: 'Divya Rathi',        email: 'divya.rathi@univ.edu',       department: 'Cybersecurity',          year: 1, gender: 'Female', city: 'Pune' },
  { student_id: 21, name: 'Manish Gupta',       email: 'manish.gupta@univ.edu',      department: 'Mechanical',             year: 2, gender: 'Male',   city: 'Mumbai' },
  { student_id: 22, name: 'Pragya Tiwari',      email: 'pragya.tiwari@univ.edu',     department: 'Computer Science',       year: 4, gender: 'Female', city: 'Hyderabad' },
  { student_id: 23, name: 'Harish Pillai',      email: 'harish.pillai@univ.edu',     department: 'Information Technology', year: 3, gender: 'Male',   city: 'Bengaluru' },
  { student_id: 24, name: 'Swati Roy',          email: 'swati.roy@univ.edu',         department: 'Electronics',            year: 1, gender: 'Female', city: 'Delhi' },
  { student_id: 25, name: 'Nikhil Saxena',      email: 'nikhil.saxena@univ.edu',     department: 'Cybersecurity',          year: 3, gender: 'Male',   city: 'Hyderabad' },
];

export const courses: Course[] = [
  { course_id: 'CS101', course_name: 'Database Management Systems',      department: 'Computer Science',       credits: 4 },
  { course_id: 'CS102', course_name: 'Data Structures & Algorithms',     department: 'Computer Science',       credits: 4 },
  { course_id: 'CY201', course_name: 'Network Security & Cryptography',  department: 'Cybersecurity',          credits: 3 },
  { course_id: 'IT301', course_name: 'Cloud Computing Architecture',     department: 'Information Technology', credits: 3 },
  { course_id: 'EC105', course_name: 'Microprocessors & Microcontrollers',department: 'Electronics',            credits: 4 },
  { course_id: 'ME202', course_name: 'Thermodynamics & Heat Transfer',   department: 'Mechanical',             credits: 3 },
];

export const enrollments: Enrollment[] = [
  { enrollment_id: 1,  student_id: 1,  course_id: 'CS101', marks: 92.50, semester: 'Sem 5' },
  { enrollment_id: 2,  student_id: 1,  course_id: 'CS102', marks: 88.00, semester: 'Sem 5' },
  { enrollment_id: 3,  student_id: 2,  course_id: 'CS101', marks: 84.00, semester: 'Sem 3' },
  { enrollment_id: 4,  student_id: 2,  course_id: 'CS102', marks: 79.50, semester: 'Sem 3' },
  { enrollment_id: 5,  student_id: 3,  course_id: 'CY201', marks: 95.00, semester: 'Sem 5' },
  { enrollment_id: 6,  student_id: 4,  course_id: 'CS101', marks: 91.00, semester: 'Sem 5' },
  { enrollment_id: 7,  student_id: 4,  course_id: 'CS102', marks: 96.00, semester: 'Sem 5' },
  { enrollment_id: 8,  student_id: 5,  course_id: 'IT301', marks: 78.50, semester: 'Sem 7' },
  { enrollment_id: 9,  student_id: 6,  course_id: 'EC105', marks: 82.00, semester: 'Sem 3' },
  { enrollment_id: 10, student_id: 7,  course_id: 'CS101', marks: 74.00, semester: 'Sem 1' },
  { enrollment_id: 11, student_id: 8,  course_id: 'CY201', marks: 89.50, semester: 'Sem 7' },
  { enrollment_id: 12, student_id: 9,  course_id: 'ME202', marks: 85.00, semester: 'Sem 5' },
  { enrollment_id: 13, student_id: 10, course_id: 'CS101', marks: 88.50, semester: 'Sem 5' },
  { enrollment_id: 14, student_id: 10, course_id: 'CS102', marks: 90.00, semester: 'Sem 5' },
  { enrollment_id: 15, student_id: 11, course_id: 'IT301', marks: 76.00, semester: 'Sem 3' },
  { enrollment_id: 16, student_id: 12, course_id: 'EC105', marks: 93.00, semester: 'Sem 5' },
  { enrollment_id: 17, student_id: 13, course_id: 'CS101', marks: 81.00, semester: 'Sem 7' },
  { enrollment_id: 18, student_id: 13, course_id: 'CS102', marks: 85.50, semester: 'Sem 7' },
  { enrollment_id: 19, student_id: 14, course_id: 'CY201', marks: 87.00, semester: 'Sem 3' },
  { enrollment_id: 20, student_id: 15, course_id: 'ME202', marks: 71.50, semester: 'Sem 1' },
  { enrollment_id: 21, student_id: 16, course_id: 'CS101', marks: 89.00, semester: 'Sem 3' },
  { enrollment_id: 22, student_id: 16, course_id: 'CS102', marks: 94.00, semester: 'Sem 3' },
  { enrollment_id: 23, student_id: 17, course_id: 'IT301', marks: 83.50, semester: 'Sem 5' },
  { enrollment_id: 24, student_id: 18, course_id: 'EC105', marks: 79.00, semester: 'Sem 7' },
  { enrollment_id: 25, student_id: 19, course_id: 'CS101', marks: 86.50, semester: 'Sem 5' },
  { enrollment_id: 26, student_id: 19, course_id: 'CS102', marks: 82.00, semester: 'Sem 5' },
  { enrollment_id: 27, student_id: 20, course_id: 'CY201', marks: 77.00, semester: 'Sem 1' },
  { enrollment_id: 28, student_id: 21, course_id: 'ME202', marks: 80.50, semester: 'Sem 3' },
  { enrollment_id: 29, student_id: 22, course_id: 'CS101', marks: 97.00, semester: 'Sem 7' },
  { enrollment_id: 30, student_id: 22, course_id: 'CS102', marks: 95.50, semester: 'Sem 7' },
  { enrollment_id: 31, student_id: 23, course_id: 'IT301', marks: 88.00, semester: 'Sem 5' },
  { enrollment_id: 32, student_id: 24, course_id: 'EC105', marks: 84.50, semester: 'Sem 1' },
  { enrollment_id: 33, student_id: 25, course_id: 'CY201', marks: 91.50, semester: 'Sem 5' },
  { enrollment_id: 34, student_id: 1,  course_id: 'CY201', marks: 86.00, semester: 'Sem 5' },
  { enrollment_id: 35, student_id: 3,  course_id: 'CS101', marks: 82.50, semester: 'Sem 5' },
  { enrollment_id: 36, student_id: 4,  course_id: 'CY201', marks: 89.00, semester: 'Sem 5' },
  { enrollment_id: 37, student_id: 8,  course_id: 'IT301', marks: 90.50, semester: 'Sem 7' },
  { enrollment_id: 38, student_id: 9,  course_id: 'CS101', marks: 77.00, semester: 'Sem 5' },
  { enrollment_id: 39, student_id: 10, course_id: 'CY201', marks: 92.00, semester: 'Sem 5' },
  { enrollment_id: 40, student_id: 12, course_id: 'CS101', marks: 85.00, semester: 'Sem 5' },
  { enrollment_id: 41, student_id: 14, course_id: 'CS102', marks: 88.00, semester: 'Sem 3' },
  { enrollment_id: 42, student_id: 17, course_id: 'CS101', marks: 81.50, semester: 'Sem 5' },
  { enrollment_id: 43, student_id: 18, course_id: 'IT301', marks: 86.00, semester: 'Sem 7' },
  { enrollment_id: 44, student_id: 22, course_id: 'CY201', marks: 94.00, semester: 'Sem 7' },
  { enrollment_id: 45, student_id: 23, course_id: 'CS101', marks: 87.50, semester: 'Sem 5' },
  { enrollment_id: 46, student_id: 25, course_id: 'CS101', marks: 89.00, semester: 'Sem 5' },
];

// ── Analytics helpers ───────────────────────────────────────────────────────

export function getStudentsByDepartment() {
  const map: Record<string, number> = {};
  for (const s of students) {
    map[s.department] = (map[s.department] || 0) + 1;
  }
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getAvgMarksByCourse() {
  const map: Record<string, { sum: number; count: number; name: string }> = {};
  for (const e of enrollments) {
    const c = courses.find(c => c.course_id === e.course_id);
    if (!c) continue;
    if (!map[e.course_id]) map[e.course_id] = { sum: 0, count: 0, name: c.course_id };
    map[e.course_id].sum += e.marks;
    map[e.course_id].count++;
  }
  return Object.values(map)
    .map(({ name, sum, count }) => ({ name, avg: Math.round((sum / count) * 100) / 100 }))
    .sort((a, b) => b.avg - a.avg);
}

export function getEnrollmentDistribution() {
  const map: Record<string, number> = {};
  for (const e of enrollments) {
    map[e.course_id] = (map[e.course_id] || 0) + 1;
  }
  return Object.entries(map)
    .map(([id, value]) => ({
      name: id,
      value,
      full: courses.find(c => c.course_id === id)?.course_name ?? id,
    }))
    .sort((a, b) => b.value - a.value);
}

export function getMarksBand() {
  const bands = { '90-100': 0, '80-89': 0, '70-79': 0, '< 70': 0 };
  for (const e of enrollments) {
    if (e.marks >= 90) bands['90-100']++;
    else if (e.marks >= 80) bands['80-89']++;
    else if (e.marks >= 70) bands['70-79']++;
    else bands['< 70']++;
  }
  return Object.entries(bands).map(([name, value]) => ({ name, value }));
}

export const stats = {
  totalStudents: students.length,
  totalCourses: courses.length,
  totalEnrollments: enrollments.length,
  avgMarks: Math.round((enrollments.reduce((s, e) => s + e.marks, 0) / enrollments.length) * 100) / 100,
  highAchievers: enrollments.filter(e => e.marks >= 90).length,
  departments: [...new Set(students.map(s => s.department))].length,
};

// ── Schema definition (for database explorer) ──────────────────────────────

export const schema = {
  students: {
    description: 'Core student biographical and academic profile data',
    rowCount: students.length,
    columns: [
      { name: 'student_id', type: 'INT', constraints: 'PRIMARY KEY AUTO_INCREMENT', description: 'Unique student identifier' },
      { name: 'name',       type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Full name of the student' },
      { name: 'email',      type: 'VARCHAR(100)', constraints: 'NOT NULL UNIQUE', description: 'University email address' },
      { name: 'department', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Academic department / major' },
      { name: 'year',       type: 'INT', constraints: 'NOT NULL CHECK (year BETWEEN 1 AND 4)', description: 'Current academic year' },
      { name: 'gender',     type: 'VARCHAR(10)', constraints: 'NOT NULL', description: 'Gender' },
      { name: 'city',       type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Residential city' },
    ],
    indexes: ['idx_student_department ON (department)', 'idx_student_city ON (city)', 'idx_student_year ON (year)'],
    foreignKeys: [],
  },
  courses: {
    description: 'Academic courses offered by respective departments',
    rowCount: courses.length,
    columns: [
      { name: 'course_id',   type: 'VARCHAR(10)', constraints: 'PRIMARY KEY', description: 'Course code (e.g., CS101)' },
      { name: 'course_name', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Full course title' },
      { name: 'department',  type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Department offering the course' },
      { name: 'credits',     type: 'INT', constraints: 'NOT NULL CHECK (credits > 0)', description: 'Credit weight' },
    ],
    indexes: [],
    foreignKeys: [],
  },
  enrollments: {
    description: 'Junction table mapping students to courses with semester marks',
    rowCount: enrollments.length,
    columns: [
      { name: 'enrollment_id', type: 'INT', constraints: 'PRIMARY KEY AUTO_INCREMENT', description: 'Unique enrollment ID' },
      { name: 'student_id',    type: 'INT', constraints: 'NOT NULL FK→students', description: 'Enrolled student reference' },
      { name: 'course_id',     type: 'VARCHAR(10)', constraints: 'NOT NULL FK→courses', description: 'Registered course reference' },
      { name: 'marks',         type: 'DECIMAL(5,2)', constraints: 'NOT NULL CHECK (0–100)', description: 'Exam score' },
      { name: 'semester',      type: 'VARCHAR(20)', constraints: 'NOT NULL', description: 'Academic semester' },
    ],
    indexes: ['idx_enrollment_student_id ON (student_id)', 'idx_enrollment_course_id ON (course_id)'],
    foreignKeys: [
      'FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE',
      'FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE',
    ],
  },
};
