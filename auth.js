// Authentication related functions

// Demo valid credentials
const validCredentials = {
  student: { email: "student@educonnect.com", password: "student123" },
  faculty: { email: "faculty@educonnect.com", password: "faculty123" },
  admin: { email: "admin@educonnect.com", password: "admin123" },
}

// Initialize authentication state
let currentUser = null

// Check if user is logged in
function isLoggedIn() {
  return currentUser !== null
}

// Get current user role
function getUserRole() {
  return currentUser ? currentUser.role : null
}

// Login function
function login(email, password) {
  // Check credentials against valid credentials
  if (email === validCredentials.student.email && password === validCredentials.student.password) {
    currentUser = {
      id: 1,
      name: "John Doe",
      email: email,
      role: "student",
      avatar: "JD",
    }
    return { success: true, user: currentUser }
  } else if (email === validCredentials.faculty.email && password === validCredentials.faculty.password) {
    currentUser = {
      id: 2,
      name: "Sarah Johnson",
      email: email,
      role: "faculty",
      avatar: "SJ",
    }
    return { success: true, user: currentUser }
  } else if (email === validCredentials.admin.email && password === validCredentials.admin.password) {
    currentUser = {
      id: 3,
      name: "Admin User",
      email: email,
      role: "admin",
      avatar: "AD",
    }
    return { success: true, user: currentUser }
  }

  return { success: false, message: "Invalid email or password" }
}

// Logout function
function logout() {
  currentUser = null
  return { success: true }
}

// Register function
function register(userData) {
  // In a real app, this would validate and save to the database
  // For demo purposes, we'll just return success
  return { success: true, message: "Registration successful! Please login." }
}

// Reset password function
function resetPassword(email) {
  // In a real app, this would send a reset email
  // For demo purposes, we'll just return success
  return { success: true, message: `Password reset link sent to ${email}` }
}

// Export functions for use in other modules
if (typeof module !== "undefined") {
  module.exports = {
    login,
    logout,
    isLoggedIn,
    getUserRole,
    register,
    resetPassword,
  }
}

