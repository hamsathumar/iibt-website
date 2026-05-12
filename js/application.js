/**
 * IIBT Campus Application Form with OTP Verification
 * Uses EmailJS for sending OTP and form submissions
 */

// ============================================
// EMAILJS CONFIGURATION - UPDATE THESE VALUES
// ============================================
const EMAILJS_CONFIG = {
  publicKey: "ONfIhipmIJ7zXkjFP",
  serviceId: "service_ajm96or",
  otpTemplateId: "template_tqtfjym",
  formTemplateId: "template_pg4mgaj"
};

// Admin email to receive applications
const ADMIN_EMAIL = "iibtcampus@gmail.com";

// OTP Configuration
const OTP_EXPIRY_MINUTES = 5;
let otpData = null;
let timerInterval = null;

// Initialize EmailJS
document.addEventListener("DOMContentLoaded", function() {
  if (EMAILJS_CONFIG.publicKey !== "YOUR_PUBLIC_KEY") {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }
});

/**
 * Generate a random 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Validate form fields before sending OTP
 */
function validateFormFields() {
  const fullName = document.getElementById("fullName").value.trim();
  const address = document.getElementById("address").value.trim();
  const nic = document.getElementById("nic").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const email = document.getElementById("email").value.trim();
  const course = document.getElementById("course").value;

  let isValid = true;
  clearErrors();

  // Full Name validation
  if (fullName.length < 3) {
    showError("fullNameError", "Please enter your full name (at least 3 characters)");
    isValid = false;
  }

  // Address validation
  if (address.length < 10) {
    showError("addressError", "Please enter your complete address (at least 10 characters)");
    isValid = false;
  }

  // NIC validation (Sri Lankan format: old 9 digits + V/X, new 12 digits)
  const nicOldPattern = /^[0-9]{9}[vVxX]$/;
  const nicNewPattern = /^[0-9]{12}$/;
  if (!nicOldPattern.test(nic) && !nicNewPattern.test(nic)) {
    showError("nicError", "Please enter a valid NIC number (e.g., 123456789V or 200012345678)");
    isValid = false;
  }

  // WhatsApp validation (at least 10 digits)
  const phonePattern = /^[0-9+\-\s]{10,15}$/;
  if (!phonePattern.test(whatsapp)) {
    showError("whatsappError", "Please enter a valid WhatsApp number");
    isValid = false;
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showError("emailError", "Please enter a valid email address");
    isValid = false;
  }

  // Course validation
  if (!course) {
    showError("courseError", "Please select a program");
    isValid = false;
  }

  return isValid;
}

/**
 * Show error message for a field
 */
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

/**
 * Clear all error messages
 */
function clearErrors() {
  const errorElements = document.querySelectorAll(".invalid-feedback");
  errorElements.forEach((el) => {
    el.textContent = "";
    el.style.display = "none";
  });
}

/**
 * Update OTP status message
 */
function updateOtpStatus(message, type) {
  const statusElement = document.getElementById("otpStatus");
  statusElement.textContent = message;
  statusElement.className = "otp-status mt-2";

  if (type === "success") {
    statusElement.classList.add("text-success");
  } else if (type === "error") {
    statusElement.classList.add("text-danger");
  } else if (type === "info") {
    statusElement.classList.add("text-info");
  }
}

/**
 * Start countdown timer
 */
function startTimer() {
  let timeLeft = OTP_EXPIRY_MINUTES * 60;
  const timerElement = document.getElementById("timerText");
  const timerContainer = document.getElementById("otpTimer");

  timerContainer.style.display = "flex";

  timerInterval = setInterval(function() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      otpData = null;
      updateOtpStatus("OTP has expired. Please request a new one.", "error");
      document.getElementById("sendOtpBtn").disabled = false;
      document.getElementById("sendOtpBtn").innerHTML = '<i class="fa fa-paper-plane me-2"></i>Resend OTP';
      document.getElementById("otpInputGroup").style.display = "none";
      timerContainer.style.display = "none";
    }

    timeLeft--;
  }, 1000);
}

/**
 * Stop countdown timer
 */
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

/**
 * Send OTP to user's email
 */
async function sendOTP() {
  // Check if EmailJS is configured
  if (EMAILJS_CONFIG.publicKey === "YOUR_PUBLIC_KEY") {
    alert("EmailJS is not configured yet. Please follow the setup guide to configure EmailJS credentials in js/application.js");
    return;
  }

  // Validate form fields first
  if (!validateFormFields()) {
    updateOtpStatus("Please fill in all required fields correctly.", "error");
    return;
  }

  const email = document.getElementById("email").value.trim();
  const fullName = document.getElementById("fullName").value.trim();
  const sendOtpBtn = document.getElementById("sendOtpBtn");

  // Disable button and show loading
  sendOtpBtn.disabled = true;
  sendOtpBtn.innerHTML = '<i class="fa fa-spinner fa-spin me-2"></i>Sending...';

  // Generate OTP
  const otp = generateOTP();

  // Store OTP with timestamp
  otpData = {
    code: otp,
    timestamp: Date.now(),
    email: email
  };

  try {
    // Send OTP via EmailJS
    const response = await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.otpTemplateId, {
      to_email: email,
      email: email,
      user_name: fullName,
      user_email: email,
      otp_code: otp,
      reply_to: email
    });

    console.log("OTP sent successfully:", response);

    // Show OTP input
    document.getElementById("otpInputGroup").style.display = "block";
    updateOtpStatus(`OTP sent to ${email}. Please check your inbox (and spam folder).`, "success");

    // Start timer
    stopTimer();
    startTimer();

    sendOtpBtn.innerHTML = '<i class="fa fa-check me-2"></i>OTP Sent';

  } catch (error) {
    console.error("Failed to send OTP - Full error:", error);
    console.error("Error text:", error.text);
    updateOtpStatus("Failed to send OTP: " + (error.text || error.message || "Please try again."), "error");
    sendOtpBtn.disabled = false;
    sendOtpBtn.innerHTML = '<i class="fa fa-paper-plane me-2"></i>Send OTP to Email';
    otpData = null;
  }
}

/**
 * Verify the OTP entered by user
 */
function verifyOTP() {
  const enteredOtp = document.getElementById("otpCode").value.trim();
  const verifyBtn = document.getElementById("verifyOtpBtn");

  if (!otpData) {
    updateOtpStatus("No OTP found. Please request a new OTP.", "error");
    return;
  }

  // Check if OTP has expired
  const elapsed = Date.now() - otpData.timestamp;
  if (elapsed > OTP_EXPIRY_MINUTES * 60 * 1000) {
    updateOtpStatus("OTP has expired. Please request a new one.", "error");
    otpData = null;
    document.getElementById("sendOtpBtn").disabled = false;
    document.getElementById("sendOtpBtn").innerHTML = '<i class="fa fa-paper-plane me-2"></i>Resend OTP';
    return;
  }

  // Verify OTP
  if (enteredOtp === otpData.code) {
    updateOtpStatus("Email verified successfully!", "success");
    stopTimer();

    // Hide OTP section and enable submit
    document.getElementById("otpInputGroup").style.display = "none";
    document.getElementById("otpTimer").style.display = "none";
    document.getElementById("sendOtpBtn").style.display = "none";
    document.getElementById("submitBtn").disabled = false;

    // Change OTP status to verified indicator
    document.querySelector(".otp-section").innerHTML = `
      <div class="verified-badge">
        <i class="fa fa-check-circle text-success me-2"></i>
        <span class="text-success">Email Verified</span>
      </div>
    `;

  } else {
    updateOtpStatus("Invalid OTP. Please try again.", "error");
    verifyBtn.classList.add("shake");
    setTimeout(() => verifyBtn.classList.remove("shake"), 500);
  }
}

/**
 * Submit the application form
 */
async function submitApplication() {
  // Check if EmailJS is configured
  if (EMAILJS_CONFIG.publicKey === "YOUR_PUBLIC_KEY") {
    alert("EmailJS is not configured yet. Please follow the setup guide.");
    return;
  }

  const submitBtn = document.getElementById("submitBtn");

  // Disable button and show loading
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin me-2"></i>Submitting...';

  // Get form data
  const formData = {
    user_name: document.getElementById("fullName").value.trim(),
    address: document.getElementById("address").value.trim(),
    nic: document.getElementById("nic").value.trim(),
    whatsapp: document.getElementById("whatsapp").value.trim(),
    email: document.getElementById("email").value.trim(),
    course: document.getElementById("course").value,
    submission_date: new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short"
    }),
    to_email: ADMIN_EMAIL
  };

  try {
    // Send form data via EmailJS
    await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.formTemplateId, formData);

    // Show success message
    document.getElementById("applicationForm").style.display = "none";
    document.getElementById("successMessage").style.display = "block";

  } catch (error) {
    console.error("Failed to submit application:", error);
    alert("Failed to submit application. Please try again or contact us directly.");
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa fa-paper-plane me-2"></i>Submit Application';
  }
}
