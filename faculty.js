// Faculty dashboard functionality

// Sample data for faculty dashboard
const facultyData = {
  courses: [
    {
      id: 1,
      title: "Advanced Mathematics",
      students: 32,
      schedule: "MWF 10:00 AM",
      status: "in-progress",
      category: "math",
    },
    {
      id: 2,
      title: "Calculus 101",
      students: 28,
      schedule: "TTh 1:00 PM",
      status: "in-progress",
      category: "math",
    },
    {
      id: 3,
      title: "Statistics for Data Science",
      students: 27,
      schedule: "MWF 2:00 PM",
      status: "upcoming",
      category: "math",
    },
  ],
  submissions: [
    {
      id: 1,
      title: "Calculus Assignment #2",
      course: "Calculus 101",
      student: "Alex Johnson",
      submittedDate: "Today, 9:15 AM",
      status: "pending",
    },
    {
      id: 2,
      title: "Advanced Math Quiz",
      course: "Advanced Mathematics",
      student: "Emma Wilson",
      submittedDate: "Yesterday, 4:30 PM",
      status: "pending",
    },
    {
      id: 3,
      title: "Statistics Project Proposal",
      course: "Statistics for Data Science",
      student: "Michael Brown",
      submittedDate: "Apr 3, 11:20 AM",
      status: "pending",
    },
    {
      id: 4,
      title: "Calculus Midterm",
      course: "Calculus 101",
      student: "Sophia Garcia",
      submittedDate: "Apr 2, 2:45 PM",
      status: "pending",
    },
  ],
  notifications: [
    {
      id: 1,
      text: "New assignment submission from Alex Johnson",
      time: "2 hours ago",
      icon: "fas fa-file-alt",
    },
    {
      id: 2,
      text: "Department meeting scheduled for Friday",
      time: "Yesterday",
      icon: "fas fa-calendar-alt",
    },
    {
      id: 3,
      text: "New course materials approval request",
      time: "2 days ago",
      icon: "fas fa-book",
    },
  ],
}

// Mock currentUser object (replace with actual user data retrieval)
const currentUser = {
  name: "John Doe",
  avatar: "JD",
}

// Initialize faculty dashboard
function initFacultyDashboard() {
  // Update user info
  document.getElementById("faculty-name").textContent = currentUser.name
  document.getElementById("faculty-avatar").textContent = currentUser.avatar

  // Load dashboard data
  loadFacultyDashboardData()

  // Add event listeners for tabs
  document.querySelectorAll("#faculty-dashboard .sidebar-menu a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const tabName = this.getAttribute("data-tab")
      showFacultyTab(tabName)
    })
  })

  // Add event listeners for quick action buttons
  document.getElementById("create-course-btn").addEventListener("click", showCreateCourseModal)
  document.getElementById("create-assignment-btn").addEventListener("click", showCreateAssignmentModal)
  document.getElementById("upload-materials-btn").addEventListener("click", showUploadMaterialsModal)
  document.getElementById("send-announcement-btn").addEventListener("click", showSendAnnouncementModal)
}

// Load faculty dashboard data
function loadFacultyDashboardData() {
  // Load courses
  loadFacultyCourses()

  // Load recent submissions
  loadRecentSubmissions()

  // Load notifications
  loadFacultyNotifications()

  // Update stats
  updateFacultyStats()
}

// Update faculty stats
function updateFacultyStats() {
  document.getElementById("faculty-courses-count").textContent = facultyData.courses.length

  // Calculate total students
  const totalStudents = facultyData.courses.reduce((total, course) => total + course.students, 0)
  document.getElementById("faculty-students-count").textContent = totalStudents

  // Count pending assignments
  document.getElementById("faculty-pending-assignments").textContent = facultyData.submissions.filter(
    (s) => s.status === "pending",
  ).length
}

// Load faculty courses
function loadFacultyCourses() {
  const courseList = document.getElementById("faculty-course-list")

  // Clear existing content
  courseList.innerHTML = ""

  // Populate course list
  facultyData.courses.forEach((course) => {
    const li = document.createElement("li")
    li.className = "course-item"

    li.innerHTML = `
      <div class="course-icon ${course.category}">${
        course.category === "math"
          ? "M"
          : course.category === "science"
            ? "S"
            : course.category === "history"
              ? "H"
              : "CS"
      }</div>
      <div class="course-details">
        <div class="course-title">${course.title}</div>
        <div class="course-info">${course.schedule} • ${course.students} students</div>
        <div class="course-info">Status: ${course.status === "in-progress" ? "In Progress" : "Upcoming"}</div>
      </div>
      <div class="course-actions">
        <button class="btn btn-outline btn-sm manage-course" data-course-id="${course.id}">Manage</button>
      </div>
    `

    // Add event listener to manage course button
    li.querySelector(".manage-course").addEventListener("click", () => {
      manageCourse(course.id)
    })

    courseList.appendChild(li)
  })
}

// Load recent submissions
function loadRecentSubmissions() {
  const submissionsList = document.getElementById("recent-submissions")

  // Clear existing content
  submissionsList.innerHTML = ""

  // Populate submissions list
  facultyData.submissions.forEach((submission) => {
    const li = document.createElement("li")
    li.className = "task-item"

    li.innerHTML = `
      <div class="task-status ${submission.status}"></div>
      <div class="task-details">
        <div class="task-title">${submission.title}</div>
        <div class="task-due">${submission.student} • ${submission.course}</div>
        <div class="task-due">Submitted: ${submission.submittedDate}</div>
      </div>
      <button class="btn btn-primary btn-sm grade-submission" data-submission-id="${submission.id}">Grade</button>
    `

    // Add event listener to grade submission button
    li.querySelector(".grade-submission").addEventListener("click", () => {
      gradeSubmission(submission.id)
    })

    submissionsList.appendChild(li)
  })
}

// Load faculty notifications
function loadFacultyNotifications() {
  const notificationList = document.getElementById("faculty-notification-list")

  // Clear existing content
  notificationList.innerHTML = ""

  // Populate notification list
  facultyData.notifications.forEach((notification) => {
    const li = document.createElement("li")
    li.className = "notification-item"

    li.innerHTML = `
      <div class="notification-icon">
        <i class="${notification.icon}"></i>
      </div>
      <div class="notification-details">
        <div class="notification-text">${notification.text}</div>
        <div class="notification-time">${notification.time}</div>
      </div>
    `

    notificationList.appendChild(li)
  })
}

// Show faculty tab
function showFacultyTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll(".faculty-tab-content").forEach((tab) => {
    tab.style.display = "none"
  })

  // Show selected tab content
  document.getElementById(`faculty-tab-${tabName}`).style.display = "block"

  // Update active tab in sidebar
  document.querySelectorAll("#faculty-dashboard .sidebar-menu a").forEach((link) => {
    link.classList.remove("active")
  })

  document.querySelector(`#faculty-dashboard .sidebar-menu a[data-tab="${tabName}"]`).classList.add("active")
}

// Manage course
function manageCourse(courseId) {
  // Find course by ID
  const course = facultyData.courses.find((c) => c.id === Number.parseInt(courseId))

  if (!course) return

  // Populate course view modal
  const courseViewContent = document.getElementById("course-view-content")

  courseViewContent.innerHTML = `
    <h2>${course.title}</h2>
    <p><strong>Schedule:</strong> ${course.schedule}</p>
    <p><strong>Students:</strong> ${course.students}</p>
    <p><strong>Status:</strong> ${course.status === "in-progress" ? "In Progress" : "Upcoming"}</p>
    
    <div class="tabs" style="margin-top: 20px;">
      <div class="tab active" data-course-tab="content">Course Content</div>
      <div class="tab" data-course-tab="students">Students</div>
      <div class="tab" data-course-tab="assignments">Assignments</div>
      <div class="tab" data-course-tab="grades">Grades</div>
    </div>
    
    <div id="course-tab-content" class="tab-content active">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3>Course Modules</h3>
        <button class="btn btn-primary btn-sm">
          <i class="fas fa-plus"></i> Add Module
        </button>
      </div>
      
      <ul class="module-list">
        <li class="module-item">
          <div class="module-header">
            <div class="module-number">1</div>
            <div class="module-title">Introduction to ${course.title}</div>
            <div style="margin-left: auto; display: flex; gap: 5px;">
              <button class="btn btn-sm btn-outline">Edit</button>
              <i class="fas fa-chevron-down"></i>
            </div>
          </div>
          <div class="module-content">
            <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
              <button class="btn btn-sm btn-outline">
                <i class="fas fa-plus"></i> Add Content
              </button>
            </div>
            <ul class="lesson-list">
              <li class="lesson-item">
                <i class="fas fa-play-circle lesson-icon"></i>
                <span>Lecture 1: Course Overview</span>
                <div style="margin-left: auto;">
                  <button class="btn btn-sm btn-outline">Edit</button>
                </div>
              </li>
              <li class="lesson-item">
                <i class="fas fa-file-pdf lesson-icon"></i>
                <span>Course Syllabus</span>
                <div style="margin-left: auto;">
                  <button class="btn btn-sm btn-outline">Edit</button>
                </div>
              </li>
              <li class="lesson-item">
                <i class="fas fa-tasks lesson-icon"></i>
                <span>Introduction Quiz</span>
                <div style="margin-left: auto;">
                  <button class="btn btn-sm btn-outline">Edit</button>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li class="module-item">
          <div class="module-header">
            <div class="module-number">2</div>
            <div class="module-title">Core Concepts</div>
            <div style="margin-left: auto; display: flex; gap: 5px;">
              <button class="btn btn-sm btn-outline">Edit</button>
              <i class="fas fa-chevron-down"></i>
            </div>
          </div>
          <div class="module-content">
            <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
              <button class="btn btn-sm btn-outline">
                <i class="fas fa-plus"></i> Add Content
              </button>
            </div>
            <ul class="lesson-list">
              <li class="lesson-item">
                <i class="fas fa-play-circle lesson-icon"></i>
                <span>Lecture 2: Fundamental Principles</span>
                <div style="margin-left: auto;">
                  <button class="btn btn-sm btn-outline">Edit</button>
                </div>
              </li>
              <li class="lesson-item">
                <i class="fas fa-play-circle lesson-icon"></i>
                <span>Lecture 3: Advanced Applications</span>
                <div style="margin-left: auto;">
                  <button class="btn btn-sm btn-outline">Edit</button>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    
    <div id="course-tab-students" class="tab-content">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3>Enrolled Students</h3>
        <div>
          <input type="text" placeholder="Search students..." class="form-control" style="display: inline-block; width: auto;">
          <button class="btn btn-primary btn-sm">
            <i class="fas fa-plus"></i> Add Student
          </button>
        </div>
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Progress</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>S1001</td>
            <td>Alex Johnson</td>
            <td>alex.j@example.com</td>
            <td>
              <div class="progress-container" style="width: 100px;">
                <div class="progress-bar" style="width: 75%;"></div>
              </div>
              <span>75%</span>
            </td>
            <td>A-</td>
            <td>
              <button class="btn btn-sm btn-outline">View</button>
            </td>
          </tr>
          <tr>
            <td>S1002</td>
            <td>Emma Wilson</td>
            <td>emma.w@example.com</td>
            <td>
              <div class="progress-container" style="width: 100px;">
                <div class="progress-bar" style="width: 90%;"></div>
              </div>
              <span>90%</span>
            </td>
            <td>A</td>
            <td>
              <button class="btn btn-sm btn-outline">View</button>
            </td>
          </tr>
          <tr>
            <td>S1003</td>
            <td>Michael Brown</td>
            <td>michael.b@example.com</td>
            <td>
              <div class="progress-container" style="width: 100px;">
                <div class="progress-bar" style="width: 60%;"></div>
              </div>
              <span>60%</span>
            </td>
            <td>B</td>
            <td>
              <button class="btn btn-sm btn-outline">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div id="course-tab-assignments" class="tab-content">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3>Course Assignments</h3>
        <button class="btn btn-primary btn-sm">
          <i class="fas fa-plus"></i> Create Assignment
        </button>
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Due Date</th>
            <th>Type</th>
            <th>Submissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Assignment #1: Fundamentals</td>
            <td>Apr 10, 2023</td>
            <td>Homework</td>
            <td>28/32 submitted</td>
            <td>
              <button class="btn btn-sm btn-outline">Edit</button>
              <button class="btn btn-sm btn-outline">View</button>
            </td>
          </tr>
          <tr>
            <td>Quiz #1: Introduction</td>
            <td>Apr 5, 2023</td>
            <td>Quiz</td>
            <td>32/32 submitted</td>
            <td>
              <button class="btn btn-sm btn-outline">Edit</button>
              <button class="btn btn-sm btn-outline">View</button>
            </td>
          </tr>
          <tr>
            <td>Midterm Exam</td>
            <td>Apr 20, 2023</td>
            <td>Exam</td>
            <td>Not yet open</td>
            <td>
              <button class="btn btn-sm btn-outline">Edit</button>
              <button class="btn btn-sm btn-outline">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div id="course-tab-grades" class="tab-content">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3>Grade Book</h3>
        <div>
          <button class="btn btn-outline btn-sm">Export Grades</button>
          <button class="btn btn-primary btn-sm">Update Grades</button>
        </div>
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Assignment #1</th>
            <th>Quiz #1</th>
            <th>Midterm</th>
            <th>Overall Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alex Johnson</td>
            <td>85%</td>
            <td>92%</td>
            <td>-</td>
            <td>A-</td>
          </tr>
          <tr>
            <td>Emma Wilson</td>
            <td>95%</td>
            <td>98%</td>
            <td>-</td>
            <td>A</td>
          </tr>
          <tr>
            <td>Michael Brown</td>
            <td>75%</td>
            <td>82%</td>
            <td>-</td>
            <td>B</td>
          </tr>
        </tbody>
      </table>
    </div>
  `

  // Add event listeners to module headers
  courseViewContent.querySelectorAll(".module-header").forEach((header) => {
    header.addEventListener("click", function () {
      const content = this.nextElementSibling
      content.classList.toggle("active")

      // Toggle icon
      const icon = this.querySelector("i.fas")
      if (content.classList.contains("active")) {
        icon.classList.replace("fa-chevron-down", "fa-chevron-up")
      } else {
        icon.classList.replace("fa-chevron-up", "fa-chevron-down")
      }
    })
  })

  // Add event listeners to course tabs
  courseViewContent.querySelectorAll("[data-course-tab]").forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabName = this.getAttribute("data-course-tab")

      // Hide all course tab contents
      courseViewContent.querySelectorAll('[id^="course-tab-"]').forEach((content) => {
        content.classList.remove("active")
      })

      // Show selected course tab content
      courseViewContent.querySelector(`#course-tab-${tabName}`).classList.add("active")

      // Update active tab
      courseViewContent.querySelectorAll("[data-course-tab]").forEach((t) => {
        t.classList.remove("active")
      })

      this.classList.add("active")
    })
  })

  // Show modal
  const modal = document.getElementById("course-view-modal")
  modal.style.display = "block"
}

// Grade submission
function gradeSubmission(submissionId) {
  // Find submission by ID
  const submission = facultyData.submissions.find((s) => s.id === Number.parseInt(submissionId))

  if (!submission) return

  // Populate assignment view modal
  const assignmentViewContent = document.getElementById("assignment-view-content")

  assignmentViewContent.innerHTML = `
    <h2>Grade Submission</h2>
    <p><strong>Assignment:</strong> ${submission.title}</p>
    <p><strong>Course:</strong> ${submission.course}</p>
    <p><strong>Student:</strong> ${submission.student}</p>
    <p><strong>Submitted:</strong> ${submission.submittedDate}</p>
    
    <div style="margin: 20px 0; padding: 15px; background-color: var(--bg-light); border-radius: 5px;">
      <h3>Submission Details</h3>
      <p>The student has submitted the following files:</p>
      
      <ul style="margin-top: 10px; list-style: none;">
        <li style="display: flex; align-items: center; margin-bottom: 10px;">
          <i class="fas fa-file-pdf" style="margin-right: 10px; color: var(--danger);"></i>
          <span>${submission.title.replace(/#/g, "")}_${submission.student.split(" ")[0]}.pdf</span>
          <button class="btn btn-sm btn-outline" style="margin-left: auto;">View</button>
        </li>
        <li style="display: flex; align-items: center;">
          <i class="fas fa-file-excel" style="margin-right: 10px; color: var(--success);"></i>
          <span>Calculations_${submission.student.split(" ")[0]}.xlsx</span>
          <button class="btn btn-sm btn-outline" style="margin-left: auto;">View</button>
        </li>
      </ul>
    </div>
    
    <div style="margin: 20px 0;">
      <h3>Grading</h3>
      
      <div class="form-group">
        <label for="grade-score">Score</label>
        <input type="number" id="grade-score" class="form-control" min="0" max="100" placeholder="Enter score (0-100)" style="width: 200px;">
      </div>
      
      <div class="form-group">
        <label for="grade-feedback">Feedback</label>
        <textarea id="grade-feedback" class="form-control" rows="4" placeholder="Provide feedback to the student"></textarea>
      </div>
    </div>
    
    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
      <button class="btn btn-outline">Save Draft</button>
      <button class="btn btn-primary">Submit Grade</button>
    </div>
  `

  // Show modal
  const modal = document.getElementById("assignment-view-modal")
  modal.style.display = "block"
}

// Show create course modal
function showCreateCourseModal() {
  // Implement course creation modal
  alert("Create course functionality will be implemented here")
}

// Show create assignment modal
function showCreateAssignmentModal() {
  // Implement assignment creation modal
  alert("Create assignment functionality will be implemented here")
}

// Show upload materials modal
function showUploadMaterialsModal() {
  // Implement materials upload modal
  alert("Upload materials functionality will be implemented here")
}

// Show send announcement modal
function showSendAnnouncementModal() {
  // Implement announcement modal
  alert("Send announcement functionality will be implemented here")
}

// Export functions for use in other modules
if (typeof module !== "undefined") {
  module.exports = {
    initFacultyDashboard,
    loadFacultyDashboardData,
    showFacultyTab,
  }
}

