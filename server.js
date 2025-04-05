// Main server file for the EduConnect e-learning platform
const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const session = require("express-session")
const mysql = require("mysql2")
const bcrypt = require("bcrypt")
const multer = require("multer")
const fs = require("fs")

// Create Express app
const app = express()
const PORT = process.env.PORT || 3305

// Configure middleware
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    secret: "educonnect-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, // 1 hour
  }),
)

// Configure file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "uploads")
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})
const upload = multer({ storage: storage })

// Database connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "nigam!@#$123", // Default password
  database: "mysql", // Default system database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Check database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("\n\nDATABASE CONNECTION ERROR:", err)
    console.error("\nTROUBLESHOOTING STEPS:")
    console.error("1. Verify MySQL service is running")
    console.error("2. Check your MySQL root password")
    console.error("3. Create database manually:")
    console.error("   - mysql -u root -p")
    console.error("   - CREATE DATABASE e_learningdb;")
    console.error("   - CREATE USER 'educonnect'@'localhost' IDENTIFIED BY 'password';")
    console.error("   - GRANT ALL ON e_learningdb.* TO 'educonnect'@'localhost';")
    console.error("4. Then update these credentials in server.js\n")
    return
  }
  console.log("Connected to MySQL system database")
  connection.release()

  // Try connecting to our app database
  const appDb = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "nigam!@#$123",
    database: "e_learningdb",
  })

  appDb.getConnection((err, conn) => {
    if (err) {
      console.error("\nCould not connect to e_learningdb:", err.message)
      console.error("Please create the database first (see instructions above)\n")
      return
    }
    console.log("Successfully connected to e_learningdb")
    conn.release()
    initDatabase()
  })
})

// Initialize database tables
function initDatabase() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('student', 'faculty', 'admin') NOT NULL,
      status ENUM('active', 'inactive') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS courses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      faculty_id INT,
      status ENUM('upcoming', 'in-progress', 'completed') DEFAULT 'upcoming',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE SET NULL
    )`,

    `CREATE TABLE IF NOT EXISTS enrollments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      course_id INT NOT NULL,
      enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      progress INT DEFAULT 0,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
      UNIQUE KEY (student_id, course_id)
    )`,

    `CREATE TABLE IF NOT EXISTS modules (
      id INT AUTO_INCREMENT PRIMARY KEY,
      course_id INT NOT NULL,
      title VARCHAR(100) NOT NULL,
      position INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS content_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      module_id INT NOT NULL,
      title VARCHAR(100) NOT NULL,
      type ENUM('lecture', 'document', 'video', 'quiz', 'assignment') NOT NULL,
      content TEXT,
      file_path VARCHAR(255),
      position INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS assignments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      course_id INT NOT NULL,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      due_date DATETIME NOT NULL,
      total_points INT DEFAULT 100,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS submissions (
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
    )`,

    `CREATE TABLE IF NOT EXISTS announcements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      course_id INT,
      title VARCHAR(100) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(100) NOT NULL,
      content TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
  ]

  tables.forEach((query) => {
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error creating table:", err)
      }
    })
  })

  // Insert default admin user if not exists
  db.query('SELECT * FROM users WHERE email = "admin@educonnect.com"', (err, results) => {
    if (err) {
      console.error("Error checking for admin user:", err)
      return
    }

    if (results.length === 0) {
      // Create default admin user
      bcrypt.hash("admin123", 10, (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err)
          return
        }

        const adminUser = {
          name: "Admin User",
          email: "admin@educonnect.com",
          password: hash,
          role: "admin",
        }

        db.query("INSERT INTO users SET ?", adminUser, (err, result) => {
          if (err) {
            console.error("Error creating admin user:", err)
            return
          }
          console.log("Default admin user created")
        })
      })
    }
  })
}

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next()
  }
  res.status(401).json({ success: false, message: "Not authenticated" })
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    return next()
  }
  res.status(403).json({ success: false, message: "Not authorized" })
}

function isFaculty(req, res, next) {
  if (req.session.user && (req.session.user.role === "faculty" || req.session.user.role === "admin")) {
    return next()
  }
  res.status(403).json({ success: false, message: "Not authorized" })
}

// API Routes

// Auth routes
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" })
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Error during login:", err)
      return res.status(500).json({ success: false, message: "Server error" })
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password" })
    }

    const user = results[0]

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err)
        return res.status(500).json({ success: false, message: "Server error" })
      }

      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid email or password" })
      }

      // Create session
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    })
  })
})

app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" })
  }

  // Check if email already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Error checking email:", err)
      return res.status(500).json({ success: false, message: "Server error" })
    }

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Email already in use" })
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err)
        return res.status(500).json({ success: false, message: "Server error" })
      }

      const newUser = {
        name,
        email,
        password: hash,
        role,
      }

      db.query("INSERT INTO users SET ?", newUser, (err, result) => {
        if (err) {
          console.error("Error creating user:", err)
          return res.status(500).json({ success: false, message: "Server error" })
        }

        res.json({ success: true, message: "Registration successful" })
      })
    })
  })
})

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err)
      return res.status(500).json({ success: false, message: "Server error" })
    }

    res.json({ success: true, message: "Logged out successfully" })
  })
})

// User routes
app.get("/api/users", isAdmin, (req, res) => {
  db.query("SELECT id, name, email, role, status, created_at FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err)
      return res.status(500).json({ success: false, message: "Server error" })
    }

    res.json({ success: true, users: results })
  })
})

app.get("/api/users/:id", isAuthenticated, (req, res) => {
  const userId = req.params.id

  // Only allow users to view their own profile unless admin
  if (req.session.user.id != userId && req.session.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Not authorized" })
  }

  db.query("SELECT id, name, email, role, status, created_at FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err)
      return res.status(500).json({ success: false, message: "Server error" })
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    res.json({ success: true, user: results[0] })
  })
})

// Course routes
app.get("/api/courses", isAuthenticated, (req, res) => {
  let query
  let params = []

  if (req.session.user.role === "student") {
    // Students can only see courses they're enrolled in
    query = `
      SELECT c.*, u.name as faculty_name
      FROM courses c
      JOIN users u ON c.faculty_id = u.id
      JOIN enrollments e ON c.id = e.course_id
      WHERE e.student_id = ?
    `
    params = [req.session.user.id]
  } else if (req.session.user.role === "faculty") {
    // Faculty can only see courses they teach
    query = `
      SELECT c.*, u.name as faculty_name
      FROM courses c
      JOIN users u ON c.faculty_id = u.id
      WHERE c.faculty_id = ?
    `
    params = [req.session.user.id]
  } else {
    // Admins can see all courses
    query = `
      SELECT c.*, u.name as faculty_name
      FROM courses c
      JOIN users u ON c.faculty_id = u.id
    `
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching courses:", err)
      return res.status(500).json({ success: false, message: "Server error" })
    }

    res.json({ success: true, courses: results })
  })
})

app.post("/api/courses", isFaculty, (req, res) => {
  const { title, description } = req.body

  if (!title) {
    return res.status(400).json({ success: false, message: "Course title is required" })
  }

  const newCourse = {
    title,
    description,
    faculty_id: req.session.user.id,
    status: "upcoming",
  }

  db.query("INSERT INTO courses SET ?", newCourse, (err, result) => {
    if (err) {
      console.error("Error creating course:", err)
      return res.status(500).json({ success: false, message: "Server error" })
    }

    res.json({ success: true, courseId: result.insertId, message: "Course created successfully" })
  })
})

// Assignment routes
app.post("/api/assignments", isFaculty, (req, res) => {
  const { courseId, title, description, dueDate, totalPoints } = req.body

  if (!courseId || !title || !dueDate) {
    return res.status(400).json({ success: false, message: "Course ID, title, and due date are required" })
  }

  // Check if the faculty is teaching this course
  db.query("SELECT * FROM courses WHERE id = ? AND faculty_id = ?", [courseId, req.session.user.id], (err, results) => {
    if (err) {
      console.error("Error checking course:", err)
      return res.status(500).json({ success: false, message: "Server error" })
    }

    if (results.length === 0 && req.session.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to add assignments to this course" })
    }

    const newAssignment = {
      course_id: courseId,
      title,
      description,
      due_date: dueDate,
      total_points: totalPoints || 100,
    }

    db.query("INSERT INTO assignments SET ?", newAssignment, (err, result) => {
      if (err) {
        console.error("Error creating assignment:", err)
        return res.status(500).json({ success: false, message: "Server error" })
      }

      res.json({ success: true, assignmentId: result.insertId, message: "Assignment created successfully" })
    })
  })
})

// Submission routes
app.post("/api/submissions", isAuthenticated, upload.single("file"), (req, res) => {
  const { assignmentId } = req.body
  const studentId = req.session.user.id

  if (!assignmentId) {
    return res.status(400).json({ success: false, message: "Assignment ID is required" })
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: "File is required" })
  }

  // Check if student is enrolled in the course
  db.query(
    `
    SELECT e.* FROM enrollments e
    JOIN assignments a ON a.course_id = e.course_id
    WHERE a.id = ? AND e.student_id = ?
  `,
    [assignmentId, studentId],
    (err, results) => {
      if (err) {
        console.error("Error checking enrollment:", err)
        return res.status(500).json({ success: false, message: "Server error" })
      }

      if (results.length === 0) {
        return res.status(403).json({ success: false, message: "Not enrolled in this course" })
      }

      const newSubmission = {
        assignment_id: assignmentId,
        student_id: studentId,
        file_path: req.file.path,
      }

      db.query("INSERT INTO submissions SET ?", newSubmission, (err, result) => {
        if (err) {
          console.error("Error creating submission:", err)
          return res.status(500).json({ success: false, message: "Server error" })
        }

        res.json({ success: true, submissionId: result.insertId, message: "Assignment submitted successfully" })
      })
    },
  )
})

// Serve the main HTML file for all routes (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Start the server with error handling
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`)
    console.error('Please close any other running instances or choose a different port')
    process.exit(1)
  } else {
    console.error('Server error:', err)
    process.exit(1)
  }
})

process.on('SIGINT', () => {
  console.log('\nShutting down server...')
  server.close()
  process.exit()
})

module.exports = app

