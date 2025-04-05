// Main application script

// DOM elements
const loginPage = document.getElementById("login-page")
const studentDashboard = document.getElementById("student-dashboard")
const facultyDashboard = document.getElementById("faculty-dashboard")
const adminDashboard = document.getElementById("admin-dashboard")
const loginForm = document.querySelector(".login-form-container")
const signupForm = document.getElementById("signup-form-container")
const passwordResetModal = document.getElementById("password-reset-modal")
const courseViewModal = document.getElementById("course-view-modal")
const assignmentViewModal = document.getElementById("assignment-view-modal")

// API functions
const login = async (email, password) => {
  const loginError = document.getElementById('loginError');
  const signInButton = document.getElementById('signInButton');
  
  try {
    signInButton.disabled = true;
    signInButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    loginError.style.display = 'none';

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      loginError.textContent = data.message || 'Login failed';
      loginError.style.display = 'block';
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    loginError.textContent = 'Network error - please try again';
    loginError.style.display = 'block';
    return { success: false, message: 'Network error' };
  } finally {
    signInButton.disabled = false;
    signInButton.textContent = 'Sign In';
  }
};

const resetPassword = async (email) => {
  const resetError = document.getElementById('resetError');
  const sendReset = document.getElementById('sendReset');
  
  try {
    sendReset.disabled = true;
    sendReset.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    resetError.style.display = 'none';

    const response = await fetch('/api/auth/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      resetError.textContent = data.message || 'Password reset failed';
      resetError.style.display = 'block';
    }
    
    return data;
  } catch (error) {
    console.error('Reset password error:', error);
    resetError.textContent = 'Network error - please try again';
    resetError.style.display = 'block';
    return { success: false, message: 'Network error' };
  } finally {
    sendReset.disabled = false;
    sendReset.textContent = 'Send Link';
  }
};

const logout = async () => {
  const logoutButtons = document.querySelectorAll('[id$="logout"]');
  
  try {
    logoutButtons.forEach(btn => {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
    });

    const response = await fetch('/api/auth/logout', {
      method: 'POST'
    });
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('Logout failed:', data.message);
      // Show error in console since logout buttons may not be visible
    }
    
    return data;
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, message: 'Network error' };
  } finally {
    logoutButtons.forEach(btn => {
      btn.disabled = false;
      btn.textContent = 'Log Out';
    });
  }
};

const initStudentDashboard = () => {
  // Replace with actual student dashboard initialization logic
  console.log("Initializing student dashboard")
}

const showStudentTab = (tabName) => {
  // Replace with actual student tab display logic
  console.log("Showing student tab:", tabName)
}

const initFacultyDashboard = () => {
  // Replace with actual faculty dashboard initialization logic
  console.log("Initializing faculty dashboard")
}

const showFacultyTab = (tabName) => {
  // Replace with actual faculty tab display logic
  console.log("Showing faculty tab:", tabName)
}

const initAdminDashboard = () => {
  // Replace with actual admin dashboard initialization logic
  console.log("Initializing admin dashboard")
}

const showAdminTab = (tabName) => {
  // Replace with actual admin tab display logic
  console.log("Showing admin tab:", tabName)
}

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  // Add event listeners for login form toggle
  document.getElementById("demo-student-btn").addEventListener("click", () => {
    showStudentDashboard()
  })

  document.getElementById("demo-faculty-btn").addEventListener("click", () => {
    showFacultyDashboard()
  })

  document.getElementById("demo-admin-btn").addEventListener("click", () => {
    showAdminDashboard()
  })

  // Toggle login form
  document.querySelector(".login-banner-content").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") return // Skip if button was clicked
    toggleLoginForm()
  })

  // Sign in button
  document.getElementById("signInButton").addEventListener("click", handleSignIn)

  // Sign up link
  document.getElementById("signup-link").addEventListener("click", (e) => {
    e.preventDefault()
    showSignUpForm()
  })

  // Login link
  document.getElementById("login-link").addEventListener("click", (e) => {
    e.preventDefault()
    showLoginForm()
  })

  // Forgot password link
  document.getElementById("forgot-password-link").addEventListener("click", (e) => {
    e.preventDefault()
    showPasswordResetModal()
  })

  // Password reset modal
  document.getElementById("send-reset").addEventListener("click", handleResetPassword)
  document.getElementById("cancel-reset").addEventListener("click", hidePasswordResetModal)

  // Close modals when clicking on X or outside
  document.querySelectorAll(".close-modal").forEach((closeBtn) => {
    closeBtn.addEventListener("click", function () {
      this.closest(".modal").style.display = "none"
    })
  })

  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none"
    }
  })

  // Logout buttons
  document.getElementById("student-logout").addEventListener("click", handleLogout)
  document.getElementById("faculty-logout").addEventListener("click", handleLogout)
  document.getElementById("admin-logout").addEventListener("click", handleLogout)
})

// Toggle login form
function toggleLoginForm() {
  loginForm.classList.toggle("hidden")
  document.querySelector(".login-banner-content").classList.toggle("shifted")
}

// Show sign up form
function showSignUpForm() {
  loginForm.classList.add("hidden")
  signupForm.classList.remove("hidden")
  document.querySelector(".login-banner-content").classList.add("shifted")
}

// Show login form
function showLoginForm() {
  signupForm.classList.add("hidden")
  loginForm.classList.remove("hidden")
}

// Show password reset modal
function showPasswordResetModal() {
  passwordResetModal.style.display = "block"
}

// Hide password reset modal
function hidePasswordResetModal() {
  passwordResetModal.style.display = "none"
}

// Handle sign in
function handleSignIn() {
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const errorElement = document.getElementById("loginError")

  // Reset error state
  errorElement.style.display = "none"
  document.getElementById("email").style.borderColor = ""
  document.getElementById("password").style.borderColor = ""

  // Validate inputs
  if (!email) {
    showError("Email is required", "email")
    return
  }

  if (!password) {
    showError("Password is required", "password")
    return
  }

  // Attempt login
  const result = login(email, password)

  if (result.success) {
    // Hide login page
    loginPage.style.display = "none"

    // Show appropriate dashboard based on user role
    if (result.user.role === "student") {
      showStudentDashboard()
    } else if (result.user.role === "faculty") {
      showFacultyDashboard()
    } else if (result.user.role === "admin") {
      showAdminDashboard()
    }
  } else {
    showError(
      'Invalid email or password. <a href="#" onclick="showPasswordResetModal(); return false;">Reset password?</a>',
    )
  }

  function showError(message, field = null) {
    errorElement.innerHTML = message
    errorElement.style.display = "block"
    if (field) {
      document.getElementById(field).style.borderColor = "var(--danger)"
    }
  }
}

// Handle reset password
function handleResetPassword() {
  const email = document.getElementById("resetEmail").value

  if (!email) {
    alert("Please enter your email")
    return
  }

  // Call reset password function
  const result = resetPassword(email)

  if (result.success) {
    alert(result.message)
    hidePasswordResetModal()
  } else {
    alert("Error: " + result.message)
  }
}

// Handle logout
function handleLogout() {
  // Call logout function
  const result = logout()

  if (result.success) {
    // Hide all dashboards
    studentDashboard.style.display = "none"
    facultyDashboard.style.display = "none"
    adminDashboard.style.display = "none"

    // Show login page
    loginPage.style.display = "flex"
    loginForm.classList.add("hidden")
    document.querySelector(".login-banner-content").classList.remove("shifted")

    // Clear login form
    document.getElementById("email").value = ""
    document.getElementById("password").value = ""
    document.getElementById("loginError").style.display = "none"
  }
}

// Show student dashboard
function showStudentDashboard() {
  // Hide other pages
  loginPage.style.display = "none"
  facultyDashboard.style.display = "none"
  adminDashboard.style.display = "none"

  // Show student dashboard
  studentDashboard.style.display = "block"

  // Initialize student dashboard
  initStudentDashboard()

  // Show dashboard tab
  showStudentTab("dashboard")
}

// Show faculty dashboard
function showFacultyDashboard() {
  // Hide other pages
  loginPage.style.display = "none"
  studentDashboard.style.display = "none"
  adminDashboard.style.display = "none"

  // Show faculty dashboard
  facultyDashboard.style.display = "block"

  // Initialize faculty dashboard
  initFacultyDashboard()

  // Show dashboard tab
  showFacultyTab("dashboard")
}

// Show admin dashboard
function showAdminDashboard() {
  // Hide other pages
  loginPage.style.display = "none"
  studentDashboard.style.display = "none"
  facultyDashboard.style.display = "none"

  // Show admin dashboard
  adminDashboard.style.display = "block"

  // Initialize admin dashboard
  initAdminDashboard()

  // Show dashboard tab
  showAdminTab("dashboard")
}

