-- EduConnect Database Schema

-- Drop database if exists (for clean setup)
DROP DATABASE IF EXISTS educonnect_db;

-- Create database
CREATE DATABASE educonnect_db;

-- Use database
USE educonnect_db;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'faculty', 'admin') NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  faculty_id INT,
  status ENUM('upcoming', 'in-progress', 'completed') DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Enrollments table (many-to-many relationship between students and courses)
CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  progress INT DEFAULT 0,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY (student_id, course_id)
);

-- Modules table (course content organization)
CREATE TABLE modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  position INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Content items table (lectures, documents, videos, quizzes, assignments)
CREATE TABLE content_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  type ENUM('lecture', 'document', 'video', 'quiz', 'assignment') NOT NULL,
  content TEXT,
  file_path VARCHAR(255),
  position INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- Assignments table
CREATE TABLE assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  due_date DATETIME NOT NULL,
  total_points INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Submissions table
CREATE TABLE submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT NOT NULL,
  student_id INT NOT NULL,
  file_path VARCHAR(255),
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  grade INT,
  feedback TEXT,
  status ENUM('submitted', 'graded') DEFAULT 'submitted',
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Announcements table
CREATE TABLE announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data

-- Insert admin user
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@educonnect.com', '$2b$10$7JfKRNV6h0DF/aYjJGKsOuSZl0X8RQRj/Sbr8xY2NeTrack9QQhK6', 'admin');

-- Insert faculty users
INSERT INTO users (name, email, password, role) VALUES 
('Sarah Johnson', 'faculty@educonnect.com', '$2b$10$7JfKRNV6h0DF/aYjJGKsOuSZl0X8RQRj/Sbr8xY2NeTrack9QQhK6', 'faculty'),
('Michael Chen', 'michael.chen@educonnect.com', '$2b$10$7JfKRNV6h0DF/aYjJGKsOuSZl0X8RQRj/Sbr8xY2NeTrack9QQhK6', 'faculty'),
('David Miller', 'david.miller@educonnect.com', '$2b$10$7JfKRNV6h0DF/aYjJGKsOuSZl0X8RQRj/Sbr8xY2NeTrack9QQhK6', 'faculty');

-- Insert student users
INSERT INTO users (name, email, password, role) VALUES 
('John Doe', 'student@educonnect.com', '$2b$10$7JfKRNV6h0DF/aYjJGKsOuSZl0X8RQRj/Sbr8xY2NeTrack9QQhK6', 'student'),
('Emma Wilson', 'emma.wilson@educonnect.com', '$2b$10$7JfKRNV6h0DF/aYjJGKsOuSZl0X8RQRj/Sbr8xY2NeTrack9QQhK6', 'student'),
('Alex Johnson', 'alex.johnson@educonnect.com', '$2b$10$7JfKRNV6h0DF/aYjJGKsOuSZl0X8RQRj/Sbr8xY2NeTrack9QQhK6', 'student');

-- Insert courses
INSERT INTO courses (title, description, faculty_id, status) VALUES 
('Advanced Mathematics', 'A comprehensive course covering advanced mathematical concepts including calculus, linear algebra, and differential equations.', 2, 'in-progress'),
('Physics 101', 'An introductory course to physics covering mechanics, thermodynamics, and electromagnetism.', 3, 'in-progress'),
('Computer Science Fundamentals', 'Introduction to computer science concepts, algorithms, and programming basics.', 4, 'in-progress'),
('World History', 'A survey of world history from ancient civilizations to modern times.', 2, 'in-progress');

-- Enroll students in courses
INSERT INTO enrollments (student_id, course_id, progress) VALUES 
(5, 1, 75), -- John Doe in Advanced Mathematics
(5, 2, 45), -- John Doe in Physics 101
(5, 3, 60), -- John Doe in Computer Science Fundamentals
(5, 4, 30), -- John Doe in World History
(6, 1, 90), -- Emma Wilson in Advanced Mathematics
(6, 3, 85), -- Emma Wilson in Computer Science Fundamentals
(7, 2, 70), -- Alex Johnson in Physics 101
(7, 4, 65); -- Alex Johnson in World History

-- Insert modules for Advanced Mathematics
INSERT INTO modules (course_id, title, position) VALUES 
(1, 'Introduction to Advanced Mathematics', 1),
(1, 'Calculus Concepts', 2),
(1, 'Linear Algebra', 3);

-- Insert content items for Advanced Mathematics modules
INSERT INTO content_items (module_id, title, type, content, position) VALUES 
(1, 'Course Overview', 'lecture', 'Introduction to the course and overview of topics to be covered.', 1),
(1, 'Course Syllabus', 'document', 'Detailed syllabus with grading policy and schedule.', 2),
(1, 'Introduction Quiz', 'quiz', 'Quiz to test basic mathematical knowledge.', 3),
(2, 'Derivatives and Integrals', 'lecture', 'Comprehensive overview of derivatives and integrals.', 1),
(2, 'Applications of Calculus', 'lecture', 'Real-world applications of calculus concepts.', 2),
(2, 'Calculus Practice Problems', 'assignment', 'Set of practice problems to reinforce calculus concepts.', 3);

-- Insert assignments
INSERT INTO assignments (course_id, title, description, due_date) VALUES 
(1, 'Calculus Assignment #1', 'Complete problems 1-20 in Chapter 3 of the textbook.', '2023-04-15 23:59:59'),
(1, 'Math Quiz: Calculus', 'Online quiz covering derivatives and integrals.', '2023-04-20 23:59:59'),
(2, 'Physics Assignment #3', 'Lab report on the pendulum experiment.', '2023-04-10 23:59:59'),
(3, 'CS Project Milestone', 'Submit the first milestone of your programming project.', '2023-04-05 23:59:59'),
(4, 'History Essay', 'Write a 5-page essay on a historical event of your choice.', '2023-04-03 23:59:59');

-- Insert submissions
INSERT INTO submissions (assignment_id, student_id, status, grade, feedback) VALUES 
(5, 5, 'graded', 92, 'Excellent work! Your analysis was thorough and well-structured.');

-- Insert announcements
INSERT INTO announcements (user_id, course_id, title, content) VALUES 
(2, 1, 'Welcome to Advanced Mathematics', 'Welcome to the course! Please review the syllabus and complete the introduction quiz by Friday.'),
(3, 2, 'Physics Lab Schedule', 'The physics lab sessions will begin next week. Please check the schedule and sign up for a time slot.'),
(4, 3, 'Programming Project Groups', 'Project groups have been assigned. Please check the course page for your group members.');

-- Insert notifications
INSERT INTO notifications (user_id, title, content) VALUES 
(5, 'New assignment posted', 'A new assignment has been posted in Physics 101.'),
(5, 'Assignment graded', 'Your History Essay has been graded. You received an A-.'),
(6, 'Course registration', 'Course registration for next semester opens next week.'),
(5, 'Class cancelled', 'CS class on Thursday has been cancelled.');

