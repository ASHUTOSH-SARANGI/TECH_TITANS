// Student dashboard functionality

// Sample data for student dashboard
const studentData = {
  courses: [
    {
      id: 1,
      title: "Advanced Mathematics",
      professor: "Prof. Sarah Johnson",
      schedule: "MWF 10:00 AM",
      progress: 75,
      category: "math",
      status: "in-progress",
    },
    {
      id: 2,
      title: "Physics 101",
      professor: "Prof. Michael Chen",
      schedule: "TTh 2:00 PM",
      progress: 45,
      category: "science",
      status: "in-progress",
    },
    {
      id: 3,
      title: "Computer Science Fundamentals",
      professor: "Prof. David Miller",
      schedule: "MWF 1:00 PM",
      progress: 60,
      category: "cs",
      status: "in-progress",
    },
    {
      id: 4,
      title: "World History",
      professor: "Prof. Emily Rodriguez",
      schedule: "TTh 11:00 AM",
      progress: 30,
      category: "history",
      status: "in-progress",
    },
  ],
  assignments: [
    {
      id: 1,
      title: "Physics Assignment #3",
      course: "Physics 101",
      dueDate: "Tomorrow, 11:59 PM",
      status: "pending",
    },
    {
      id: 2,
      title: "Math Quiz: Calculus",
      course: "Advanced Mathematics",
      dueDate: "In 3 days",
      status: "pending",
    },
    {
      id: 3,
      title: "CS Project Milestone",
      course: "Computer Science Fundamentals",
      dueDate: "Overdue by 1 day",
      status: "overdue",
    },
    {
      id: 4,
      title: "History Essay",
      course: "World History",
      dueDate: "Submitted on Apr 3",
      status: "completed",
      grade: "A-",
    },
  ],
  notifications: [
    {
      id: 1,
      text: "New assignment posted in Physics 101",
      time: "2 hours ago",
      icon: "fas fa-tasks",
    },
    {
      id: 2,
      text: "Your Math Quiz was graded: A-",
      time: "Yesterday",
      icon: "fas fa-chart-bar",
    },
    {
      id: 3,
      text: "Course registration opens next week",
      time: "2 days ago",
      icon: "fas fa-graduation-cap",
    },
    {
      id: 4,
      text: "CS class cancelled on Thursday",
      time: "1 day ago",
      icon: "fas fa-bullhorn",
    },
  ],
}

// Mock currentUser object (replace with actual user data retrieval)
const currentUser = {
  name: "John Doe",
  avatar: "JD",
}

// Initialize student dashboard
function initStudentDashboard() {
  // Update user info
  document.getElementById("student-name").textContent = currentUser.name
  document.getElementById("student-avatar").textContent = currentUser.avatar

  // Load dashboard data
  loadStudentDashboardData()

  // Add event listeners for tabs
  document.querySelectorAll(".sidebar-menu a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const tabName = this.getAttribute("data-tab")
      showStudentTab(tabName)
    })
  })

  // Add event listeners for course tabs
  document.querySelectorAll("[data-courses-tab]").forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabName = this.getAttribute("data-courses-tab")
      showCoursesTab(tabName)
    })
  })

  // Add event listeners for assignment tabs
  document.querySelectorAll("[data-assignments-tab]").forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabName = this.getAttribute("data-assignments-tab")
      showAssignmentsTab(tabName)
    })
  })
}

// Load student dashboard data
function loadStudentDashboardData() {
  // Load courses
  loadStudentCourses()

  // Load assignments
  loadStudentAssignments()

  // Load notifications
  loadStudentNotifications()
}

// Load student courses
function loadStudentCourses() {
  const dashboardCourseList = document.getElementById("dashboard-course-list")
  const allCoursesList = document.getElementById("all-courses-list")
  const inProgressCoursesList = document.getElementById("in-progress-courses-list")
  const completedCoursesList = document.getElementById("completed-courses-list")

  // Clear existing content
  dashboardCourseList.innerHTML = ""
  allCoursesList.innerHTML = ""
  inProgressCoursesList.innerHTML = ""
  completedCoursesList.innerHTML = ""

  // Populate course lists
  studentData.courses.forEach((course) => {
    // Create course item for dashboard
    const dashboardCourseItem = createCourseItem(course)
    dashboardCourseList.appendChild(dashboardCourseItem)

    // Create course item for all courses tab
    const allCoursesItem = createCourseItem(course)
    allCoursesList.appendChild(allCoursesItem)

    // Add to appropriate status list
    if (course.status === "in-progress") {
      const inProgressItem = createCourseItem(course)
      inProgressCoursesList.appendChild(inProgressItem)
    } else if (course.status === "completed") {
      const completedItem = createCourseItem(course)
      completedCoursesList.appendChild(completedItem)
    }
  })
}

// Create course item element
function createCourseItem(course) {
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
      <div class="course-info">${course.professor} • ${course.schedule}</div>
      <div class="progress-container">
        <div class="progress-bar" style="width: ${course.progress}%;"></div>
      </div>
      <div class="course-info">${course.progress}% completed</div>
    </div>
    <div class="course-actions">
      <button class="btn btn-outline btn-sm view-course" data-course-id="${course.id}">View</button>
    </div>
  `

  // Add event listener to view course button
  li.querySelector(".view-course").addEventListener("click", () => {
    viewCourse(course.id)
  })

  return li
}

// Load student assignments
function loadStudentAssignments() {
  const upcomingDeadlines = document.getElementById("upcoming-deadlines")
  const pendingAssignments = document.getElementById("pending-assignments-list")
  const submittedAssignments = document.getElementById("submitted-assignments-list")
  const gradedAssignments = document.getElementById("graded-assignments-list")

  // Clear existing content
  upcomingDeadlines.innerHTML = ""
  pendingAssignments.innerHTML = ""
  submittedAssignments.innerHTML = ""
  gradedAssignments.innerHTML = ""

  // Populate assignment lists
  studentData.assignments.forEach((assignment) => {
    // Create assignment item for upcoming deadlines
    if (assignment.status === "pending" || assignment.status === "overdue") {
      const deadlineItem = document.createElement("li")
      deadlineItem.className = "task-item"

      deadlineItem.innerHTML = `
        <div class="task-status ${assignment.status}"></div>
        <div class="task-details">
          <div class="task-title">${assignment.title}</div>
          <div class="task-due">${assignment.dueDate}</div>
        </div>
        <button class="btn btn-primary btn-sm view-assignment" data-assignment-id="${assignment.id}">
          ${assignment.status === "pending" ? "Submit" : "Submit Late"}
        </button>
      `

      upcomingDeadlines.appendChild(deadlineItem)

      // Add to pending assignments tab
      const pendingItem = deadlineItem.cloneNode(true)
      pendingAssignments.appendChild(pendingItem)
    } else if (assignment.status === "submitted") {
      // Add to submitted assignments tab
      const submittedItem = document.createElement("li")
      submittedItem.className = "task-item"

      submittedItem.innerHTML = `
        <div class="task-status ${assignment.status}"></div>
        <div class="task-details">
          <div class="task-title">${assignment.title}</div>
          <div class="task-due">Submitted - Awaiting Grade</div>
        </div>
        <button class="btn btn-outline btn-sm view-assignment" data-assignment-id="${assignment.id}">View</button>
      `

      submittedAssignments.appendChild(submittedItem)
    } else if (assignment.status === "completed") {
      // Add to graded assignments tab
      const gradedItem = document.createElement("li")
      gradedItem.className = "task-item"

      gradedItem.innerHTML = `
        <div class="task-status ${assignment.status}"></div>
        <div class="task-details">
          <div class="task-title">${assignment.title}</div>
          <div class="task-due">${assignment.dueDate} - Grade: ${assignment.grade}</div>
        </div>
        <button class="btn btn-outline btn-sm view-assignment" data-assignment-id="${assignment.id}">View</button>
      `

      gradedAssignments.appendChild(gradedItem)

      // Add to upcoming deadlines if it's a recent submission
      const deadlineItem = gradedItem.cloneNode(true)
      upcomingDeadlines.appendChild(deadlineItem)
    }
  })

  // Add event listeners to view assignment buttons
  document.querySelectorAll(".view-assignment").forEach((button) => {
    button.addEventListener("click", function () {
      const assignmentId = this.getAttribute("data-assignment-id")
      viewAssignment(assignmentId)
    })
  })
}

// Load student notifications
function loadStudentNotifications() {
  const notificationList = document.getElementById("notification-list")

  // Clear existing content
  notificationList.innerHTML = ""

  // Populate notification list
  studentData.notifications.forEach((notification) => {
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

// Show student tab
function showStudentTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll(".student-tab-content").forEach((tab) => {
    tab.style.display = "none"
  })

  // Show selected tab content
  document.getElementById(`student-tab-${tabName}`).style.display = "block"

  // Update active tab in sidebar
  document.querySelectorAll(".sidebar-menu a").forEach((link) => {
    link.classList.remove("active")
  })

  document.querySelector(`.sidebar-menu a[data-tab="${tabName}"]`).classList.add("active")
}

// Show courses tab
function showCoursesTab(tabName) {
  // Hide all course tab contents
  document.querySelectorAll('[id^="courses-tab-"]').forEach((tab) => {
    tab.classList.remove("active")
  })

  // Show selected course tab content
  document.getElementById(`courses-tab-${tabName}`).classList.add("active")

  // Update active tab
  document.querySelectorAll("[data-courses-tab]").forEach((tab) => {
    tab.classList.remove("active")
  })

  document.querySelector(`[data-courses-tab="${tabName}"]`).classList.add("active")
}

// Show assignments tab
function showAssignmentsTab(tabName) {
  // Hide all assignment tab contents
  document.querySelectorAll('[id^="assignments-tab-"]').forEach((tab) => {
    tab.classList.remove("active")
  })

  // Show selected assignment tab content
  document.getElementById(`assignments-tab-${tabName}`).classList.add("active")

  // Update active tab
  document.querySelectorAll("[data-assignments-tab]").forEach((tab) => {
    tab.classList.remove("active")
  })

  document.querySelector(`[data-assignments-tab="${tabName}"]`).classList.add("active")
}

// View course details
function viewCourse(courseId) {
  // Find course by ID
  const course = studentData.courses.find((c) => c.id === Number.parseInt(courseId))

  if (!course) return

  // Populate course view modal
  const courseViewContent = document.getElementById("course-view-content")

  courseViewContent.innerHTML = `
    <h2>${course.title}</h2>
    <p><strong>Professor:</strong> ${course.professor}</p>
    <p><strong>Schedule:</strong> ${course.schedule}</p>
    <p><strong>Progress:</strong> ${course.progress}%</p>
    
    <div class="progress-container">
      <div class="progress-bar" style="width: ${course.progress}%;"></div>
    </div>
    
    <h3 style="margin-top: 20px;">Course Content</h3>
    
    <ul class="module-list">
      <li class="module-item">
        <div class="module-header">
          <div class="module-number">1</div>
          <div class="module-title">Introduction to ${course.title}</div>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="module-content">
          <ul class="lesson-list">
            <li class="lesson-item">
              <i class="fas fa-play-circle lesson-icon"></i>
              <span>Lecture 1: Course Overview</span>
            </li>
            <li class="lesson-item">
              <i class="fas fa-file-pdf lesson-icon"></i>
              <span>Course Syllabus</span>
            </li>
            <li class="lesson-item">
              <i class="fas fa-tasks lesson-icon"></i>
              <span>Introduction Quiz</span>
            </li>
          </ul>
        </div>
      </li>
      <li class="module-item">
        <div class="module-header">
          <div class="module-number">2</div>
          <div class="module-title">Core Concepts</div>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="module-content">
          <ul class="lesson-list">
            <li class="lesson-item">
              <i class="fas fa-play-circle lesson-icon"></i>
              <span>Lecture 2: Fundamental Principles</span>
            </li>
            <li class="lesson-item">
              <i class="fas fa-play-circle lesson-icon"></i>
              <span>Lecture 3: Advanced Applications</span>
            </li>
            <li class="lesson-item">
              <i class="fas fa-file-pdf lesson-icon"></i>
              <span>Reading Materials</span>
            </li>
            <li class="lesson-item">
              <i class="fas fa-tasks lesson-icon"></i>
              <span>Module Assignment</span>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  `

  // Add event listeners to module headers
  courseViewContent.querySelectorAll(".module-header").forEach((header) => {
    header.addEventListener("click", function () {
      const content = this.nextElementSibling
      content.classList.toggle("active")

      // Toggle icon
      const icon = this.querySelector("i")
      if (content.classList.contains("active")) {
        icon.classList.replace("fa-chevron-down", "fa-chevron-up")
      } else {
        icon.classList.replace("fa-chevron-up", "fa-chevron-down")
      }
    })
  })

  // Show modal
  const modal = document.getElementById("course-view-modal")
  modal.style.display = "block"
}

// View assignment details
function viewAssignment(assignmentId) {
  // Find assignment by ID
  const assignment = studentData.assignments.find((a) => a.id === Number.parseInt(assignmentId))

  if (!assignment) return

  // Populate assignment view modal
  const assignmentViewContent = document.getElementById("assignment-view-content")

  assignmentViewContent.innerHTML = `
    <h2>${assignment.title}</h2>
    <p><strong>Course:</strong> ${assignment.course}</p>
    <p><strong>Due Date:</strong> ${assignment.dueDate}</p>
    <p><strong>Status:</strong> ${assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}</p>
    
    <div style="margin: 20px 0;">
      <h3>Assignment Description</h3>
      <p>Complete the following tasks related to ${assignment.course}. Make sure to follow all instructions carefully and submit your work before the deadline.</p>
      
      <ul style="margin-top: 10px; margin-left: 20px;">
        <li>Task 1: Research and analyze the core concepts</li>
        <li>Task 2: Complete the practice problems</li>
        <li>Task 3: Write a summary of your findings</li>
      </ul>
    </div>
    
    ${
      assignment.status === "pending" || assignment.status === "overdue"
        ? `
      <div class="file-upload">
        <i class="fas fa-cloud-upload-alt" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <p>Drag and drop your files here or click to browse</p>
        <input type="file" style="display: none;" id="assignment-file">
      </div>
      
      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
        <button class="btn btn-outline">Save Draft</button>
        <button class="btn btn-primary">Submit Assignment</button>
      </div>
    `
        : assignment.status === "completed"
          ? `
      <div style="margin: 20px 0; padding: 15px; background-color: var(--bg-light); border-radius: 5px;">
        <h3>Feedback</h3>
        <p>Great work on this assignment! Your analysis was thorough and well-structured.</p>
        <p style="margin-top: 10px;"><strong>Grade:</strong> ${assignment.grade}</p>
      </div>
      
      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
        <button class="btn btn-outline">Download Submission</button>
        <button class="btn btn-primary">View Detailed Feedback</button>
      </div>
    `
          : `
      <div style="margin: 20px 0; padding: 15px; background-color: var(--bg-light); border-radius: 5px;">
        <h3>Submission Status</h3>
        <p>Your assignment has been submitted and is awaiting grading.</p>
        <p style="margin-top: 10px;"><strong>Submitted on:</strong> April 3, 2023</p>
      </div>
      
      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
        <button class="btn btn-outline">Download Submission</button>
      </div>
    `
    }
  `

  // Add event listener to file upload area
  if (assignment.status === "pending" || assignment.status === "overdue") {
    const fileUpload = assignmentViewContent.querySelector(".file-upload")
    const fileInput = assignmentViewContent.querySelector("#assignment-file")

    fileUpload.addEventListener("click", () => {
      fileInput.click()
    })

    fileInput.addEventListener("change", function () {
      if (this.files.length > 0) {
        fileUpload.innerHTML = `
          <i class="fas fa-file-alt" style="font-size: 2rem; margin-bottom: 10px;"></i>
          <p>${this.files[0].name}</p>
          <p style="font-size: 0.8rem; color: #6c757d;">Click to change file</p>
        `
      }
    })
  }

  // Show modal
  const modal = document.getElementById("assignment-view-modal")
  modal.style.display = "block"
}

// Export functions for use in other modules
if (typeof module !== "undefined") {
  module.exports = {
    initStudentDashboard,
    loadStudentDashboardData,
    showStudentTab,
  }
}

