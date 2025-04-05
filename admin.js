// Admin dashboard functionality

// Sample data for admin dashboard
const adminData = {
  users: [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@educonnect.com",
      role: "student",
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@educonnect.com",
      role: "faculty",
      status: "active",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael.chen@educonnect.com",
      role: "faculty",
      status: "active",
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.wilson@educonnect.com",
      role: "student",
      status: "active",
    },
    {
      id: 5,
      name: "David Miller",
      email: "david.miller@educonnect.com",
      role: "faculty",
      status: "active",
    },
    {
      id: 6,
      name: "Admin User",
      email: "admin@educonnect.com",
      role: "admin",
      status: "active",
    },
  ],
  activities: [
    {
      id: 1,
      text: "New user registered: Emma Wilson",
      time: "2 hours ago",
      icon: "fas fa-user-plus",
    },
    {
      id: 2,
      text: "Course 'Advanced Mathematics' created by Sarah Johnson",
      time: "Yesterday",
      icon: "fas fa-book",
    },
    {
      id: 3,
      text: "System backup completed successfully",
      time: "2 days ago",
      icon: "fas fa-database",
    },
    {
      id: 4,
      text: "User support ticket #1234 resolved",
      time: "3 days ago",
      icon: "fas fa-ticket-alt",
    },
    {
      id: 5,
      text: "New announcement posted by David Miller",
      time: "4 days ago",
      icon: "fas fa-bullhorn",
    },
  ],
}

// Mock currentUser object for demonstration purposes
const currentUser = {
  name: "Admin User",
  avatar: "A",
}

// Initialize admin dashboard
function initAdminDashboard() {
  // Update user info
  document.getElementById("admin-name").textContent = currentUser.name
  document.getElementById("admin-avatar").textContent = currentUser.avatar

  // Load dashboard data
  loadAdminDashboardData()

  // Add event listeners for tabs
  document.querySelectorAll("#admin-dashboard .sidebar-menu a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const tabName = this.getAttribute("data-tab")
      showAdminTab(tabName)
    })
  })

  // Add event listeners for user tabs
  document.querySelectorAll("[data-users-tab]").forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabName = this.getAttribute("data-users-tab")
      showUsersTab(tabName)
    })
  })

  // Add event listeners for quick action buttons
  document.getElementById("add-user-btn").addEventListener("click", showAddUserModal)
  document.getElementById("add-user-btn-tab").addEventListener("click", showAddUserModal)
  document.getElementById("add-course-btn").addEventListener("click", showAddCourseModal)
  document.getElementById("system-backup-btn").addEventListener("click", performSystemBackup)
  document.getElementById("global-announcement-btn").addEventListener("click", showGlobalAnnouncementModal)
}

// Load admin dashboard data
function loadAdminDashboardData() {
  // Load activities
  loadAdminActivities()

  // Load users
  loadAdminUsers()

  // Update stats
  updateAdminStats()
}

// Update admin stats
function updateAdminStats() {
  // Count users by role
  const students = adminData.users.filter((user) => user.role === "student").length
  const faculty = adminData.users.filter((user) => user.role === "faculty").length
  const admins = adminData.users.filter((user) => user.role === "admin").length

  document.getElementById("total-users").textContent = adminData.users.length
  document.getElementById("total-users").nextElementSibling.textContent =
    `Students: ${students}, Faculty: ${faculty}, Admins: ${admins}`
}

// Load admin activities
function loadAdminActivities() {
  const activitiesList = document.getElementById("admin-activities")

  // Clear existing content
  activitiesList.innerHTML = ""

  // Populate activities list
  adminData.activities.forEach((activity) => {
    const li = document.createElement("li")
    li.className = "notification-item"

    li.innerHTML = `
      <div class="notification-icon">
        <i class="${activity.icon}"></i>
      </div>
      <div class="notification-details">
        <div class="notification-text">${activity.text}</div>
        <div class="notification-time">${activity.time}</div>
      </div>
    `

    activitiesList.appendChild(li)
  })
}

// Load admin users
function loadAdminUsers() {
  const allUsersTable = document.getElementById("all-users-table")

  // Clear existing content
  allUsersTable.innerHTML = ""

  // Populate users table
  adminData.users.forEach((user) => {
    const tr = document.createElement("tr")

    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
      <td>
        <span class="badge" style="
          background-color: ${user.status === "active" ? "var(--success)" : "var(--danger)"};
          color: white;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
        ">
          ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline edit-user" data-user-id="${user.id}">Edit</button>
        <button class="btn btn-sm btn-outline view-user" data-user-id="${user.id}">View</button>
      </td>
    `

    // Add event listeners to buttons
    tr.querySelector(".edit-user").addEventListener("click", () => {
      editUser(user.id)
    })

    tr.querySelector(".view-user").addEventListener("click", () => {
      viewUser(user.id)
    })

    allUsersTable.appendChild(tr)
  })
}

// Show admin tab
function showAdminTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll(".admin-tab-content").forEach((tab) => {
    tab.style.display = "none"
  })

  // Show selected tab content
  document.getElementById(`admin-tab-${tabName}`).style.display = "block"

  // Update active tab in sidebar
  document.querySelectorAll("#admin-dashboard .sidebar-menu a").forEach((link) => {
    link.classList.remove("active")
  })

  document.querySelector(`#admin-dashboard .sidebar-menu a[data-tab="${tabName}"]`).classList.add("active")
}

// Show users tab
function showUsersTab(tabName) {
  // Hide all user tab contents
  document.querySelectorAll('[id^="users-tab-"]').forEach((tab) => {
    tab.classList.remove("active")
  })

  // Show selected user tab content
  document.getElementById(`users-tab-${tabName}`).classList.add("active")

  // Update active tab
  document.querySelectorAll("[data-users-tab]").forEach((tab) => {
    tab.classList.remove("active")
  })

  document.querySelector(`[data-users-tab="${tabName}"]`).classList.add("active")
}

// Edit user
function editUser(userId) {
  // Find user by ID
  const user = adminData.users.find((u) => u.id === Number.parseInt(userId))

  if (!user) return

  // Implement user edit functionality
  alert(`Edit user: ${user.name}`)
}

// View user
function viewUser(userId) {
  // Find user by ID
  const user = adminData.users.find((u) => u.id === Number.parseInt(userId))

  if (!user) return

  // Implement user view functionality
  alert(`View user: ${user.name}`)
}

// Show add user modal
function showAddUserModal() {
  // Implement add user modal
  alert("Add user functionality will be implemented here")
}

// Show add course modal
function showAddCourseModal() {
  // Implement add course modal
  alert("Add course functionality will be implemented here")
}

// Perform system backup
function performSystemBackup() {
  // Implement system backup functionality
  alert("System backup initiated")

  // Simulate backup process
  setTimeout(() => {
    alert("System backup completed successfully")

    // Add activity
    adminData.activities.unshift({
      id: adminData.activities.length + 1,
      text: "System backup completed successfully",
      time: "Just now",
      icon: "fas fa-database",
    })

    // Reload activities
    loadAdminActivities()
  }, 2000)
}

// Show global announcement modal
function showGlobalAnnouncementModal() {
  // Implement global announcement modal
  alert("Global announcement functionality will be implemented here")
}

// Export functions for use in other modules
if (typeof module !== "undefined") {
  module.exports = {
    initAdminDashboard,
    loadAdminDashboardData,
    showAdminTab,
  }
}

