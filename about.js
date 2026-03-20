// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Emergency Button
document.querySelector('.emergency-btn').addEventListener('click', () => {
    if (confirm('🚑 Emergency Helpline: 108\nCall emergency services?')) {
        window.location.href = 'tel:108';
    }
});


/*
// Partner With Us Button
document.querySelector('.btn-primary.btn-large').addEventListener('click', function() {
    alert('Thank you for your interest in partnering with QuickCare!\nOur team will contact you soon.');
});

// Careers Button
document.querySelector('.btn-secondary.btn-large').addEventListener('click', function() {
    alert('Exploring career opportunities at QuickCare...\nRedirecting to careers page.');
});

*/

// Partner and Careers Modal Functionality
const partnerBtn = document.getElementById('partnerBtn');
const careersBtn = document.getElementById('careersBtn');
const partnerModal = document.getElementById('partnerModal');
const careersModal = document.getElementById('careersModal');
const closeModals = document.querySelectorAll('.close-modal');
const partnerOptions = document.querySelectorAll('.partner-option');
const partnerTypeSelect = document.getElementById('partnerType');
const partnerForm = document.getElementById('partnerForm');
const applicationForm = document.getElementById('applicationForm');
const backToJobs = document.getElementById('backToJobs');
const applyJobButtons = document.querySelectorAll('.apply-job');

// Open Partner Modal
partnerBtn.addEventListener('click', () => {
    partnerModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

// Open Careers Modal
careersBtn.addEventListener('click', () => {
    careersModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    applicationForm.style.display = 'none';
    document.querySelector('.jobs-grid').style.display = 'grid';
});

// Close Modals
closeModals.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        partnerModal.style.display = 'none';
        careersModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === partnerModal) {
        partnerModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (e.target === careersModal) {
        careersModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Partner Option Selection
partnerOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove active class from all options
        partnerOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to clicked option
        option.classList.add('active');
        
        // Update select dropdown
        const partnerType = option.getAttribute('data-type');
        partnerTypeSelect.value = partnerType;
    });
});

// Partner Form Submission
partnerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        partnerType: document.getElementById('partnerType').value,
        orgName: document.getElementById('orgName').value,
        contactName: document.getElementById('contactName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        city: document.getElementById('city').value,
        experience: document.getElementById('experience').value,
        message: document.getElementById('message').value
    };
    
    // Validate form
    if (!formData.partnerType || !formData.contactName || !formData.email || !formData.phone || !formData.city) {
        alert('Please fill all required fields');
        return;
    }
    
    // Show loading state
    const submitBtn = partnerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        partnerForm.innerHTML = `
            <div class="success-message" style="display: block;">
                <i class="fas fa-check-circle"></i>
                <h3>Partnership Request Submitted!</h3>
                <p>Thank you for your interest in partnering with QuickCare. Our team will contact you within 24 hours.</p>
                <button class="btn-primary" onclick="closePartnerModal()">Close</button>
            </div>
        `;
    }, 2000);
});

// Job Application
applyJobButtons.forEach(button => {
    button.addEventListener('click', () => {
        const jobTitle = button.closest('.job-card').querySelector('h3').textContent;
        const jobType = button.getAttribute('data-job');
        
        // Hide jobs grid and show application form
        document.querySelector('.jobs-grid').style.display = 'none';
        applicationForm.style.display = 'block';
        document.getElementById('jobTitle').textContent = `Apply for: ${jobTitle}`;
        
        // Store job type in hidden field or data attribute
        applicationForm.setAttribute('data-job-type', jobType);
    });
});

// Back to Jobs
backToJobs.addEventListener('click', () => {
    applicationForm.style.display = 'none';
    document.querySelector('.jobs-grid').style.display = 'grid';
});

// Application Form Submission
applicationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        jobType: applicationForm.getAttribute('data-job-type'),
        name: document.getElementById('applicantName').value,
        email: document.getElementById('applicantEmail').value,
        phone: document.getElementById('applicantPhone').value,
        resume: document.getElementById('resume').files[0]?.name,
        coverLetter: document.getElementById('coverLetter').value
    };
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.resume) {
        alert('Please fill all required fields including resume upload');
        return;
    }
    
    // Show loading state
    const submitBtn = applicationForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        applicationForm.innerHTML = `
            <div class="success-message" style="display: block;">
                <i class="fas fa-check-circle"></i>
                <h3>Application Submitted!</h3>
                <p>Thank you for applying to QuickCare. We will review your application and contact you soon.</p>
                <button class="btn-primary" onclick="closeCareersModal()">Close</button>
            </div>
        `;
    }, 2000);
});

// Close Modal Functions
function closePartnerModal() {
    partnerModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    // Reset form for next time
    setTimeout(() => {
        partnerForm.innerHTML = `
            <!-- Original form content here -->
            <div class="form-group">
                <label for="partnerType">Partnership Type</label>
                <select id="partnerType" required>
                    <option value="">Select Partnership Type</option>
                    <option value="doctor">Individual Doctor</option>
                    <option value="hospital">Hospital/Clinic</option>
                    <option value="diagnostic">Diagnostic Center</option>
                    <option value="pharmacy">Pharmacy</option>
                </select>
            </div>
            <!-- Include all other form fields -->
            <button type="submit" class="btn-primary btn-full">Submit Partnership Request</button>
        `;
        // Re-attach event listeners
        partnerForm.addEventListener('submit', arguments.callee);
    }, 500);
}

function closeCareersModal() {
    careersModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}
// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.mv-card, .team-card, .achievement-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    // Set initial state for animated elements
    const animatedElements = document.querySelectorAll('.mv-card, .team-card, .achievement-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger animations
    setTimeout(animateOnScroll, 100);
    
    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
    
    console.log('About Page Loaded Successfully');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});










// Enhanced Form Handling with Local Storage
partnerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        partnerType: document.getElementById('partnerType').value,
        orgName: document.getElementById('orgName').value,
        contactName: document.getElementById('contactName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        city: document.getElementById('city').value,
        experience: document.getElementById('experience').value,
        message: document.getElementById('message').value,
        submittedAt: new Date().toISOString(),
        id: Date.now() // Unique ID
    };
    
    // Validate form
    if (!formData.partnerType || !formData.contactName || !formData.email || !formData.phone || !formData.city) {
        alert('Please fill all required fields');
        return;
    }
    
    // Show loading state
    const submitBtn = partnerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call with local storage
    setTimeout(() => {
        // Save to local storage
        const existingData = JSON.parse(localStorage.getItem('quickcare_partnerships') || '[]');
        existingData.push(formData);
        localStorage.setItem('quickcare_partnerships', JSON.stringify(existingData));
        
        // Show detailed success message
        partnerForm.innerHTML = `
            <div class="success-message" style="display: block;">
                <i class="fas fa-check-circle"></i>
                <h3>Partnership Request Submitted Successfully! ✅</h3>
                
                <div class="confirmation-details">
                    <h4>Request Details:</h4>
                    <p><strong>Name:</strong> ${formData.contactName}</p>
                    <p><strong>Email:</strong> ${formData.email}</p>
                    <p><strong>Phone:</strong> ${formData.phone}</p>
                    <p><strong>Partnership Type:</strong> ${formData.partnerType}</p>
                    <p><strong>City:</strong> ${formData.city}</p>
                    <p><strong>Reference ID:</strong> QC${formData.id}</p>
                </div>
                
                <div class="next-steps">
                    <h4>What Happens Next?</h4>
                    <ul>
                        <li>📞 Our team will call you within 24 hours</li>
                        <li>📧 You'll receive confirmation email shortly</li>
                        <li>🤝 Partnership discussion scheduled</li>
                    </ul>
                </div>
                
                <p style="margin-top: 1rem; font-size: 0.9rem; color: #7f8c8d;">
                    <i class="fas fa-info-circle"></i>
                    For immediate assistance, call: <strong>1800-123-456</strong>
                </p>
                
                <button class="btn-primary" onclick="closePartnerModal()" style="margin-top: 1rem;">
                    Close & Continue
                </button>
            </div>
        `;
        
        // Log to console (for admin viewing)
        console.log('🚀 New Partnership Request:', formData);
        console.log('📊 Total Requests:', existingData.length);
        
        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('QuickCare - New Partnership Request', {
                body: `New request from ${formData.contactName} (${formData.partnerType})`,
                icon: '/favicon.ico'
            });
        }
        
    }, 2000);
});

// Application Form with Enhanced Feedback
applicationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const resumeFile = document.getElementById('resume').files[0];
    const formData = {
        jobType: applicationForm.getAttribute('data-job-type'),
        name: document.getElementById('applicantName').value,
        email: document.getElementById('applicantEmail').value,
        phone: document.getElementById('applicantPhone').value,
        resume: resumeFile ? resumeFile.name : 'No file',
        coverLetter: document.getElementById('coverLetter').value,
        appliedAt: new Date().toISOString(),
        applicationId: 'APP' + Date.now()
    };
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !resumeFile) {
        alert('Please fill all required fields including resume upload');
        return;
    }
    
    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = resumeFile.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes('.' + fileExtension)) {
        alert('Please upload PDF, DOC, or DOCX files only');
        return;
    }
    
    // Show loading state
    const submitBtn = applicationForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading & Submitting...';
    submitBtn.disabled = true;
    
    // Simulate file upload and submission
    setTimeout(() => {
        // Save to local storage
        const existingApplications = JSON.parse(localStorage.getItem('quickcare_applications') || '[]');
        existingApplications.push(formData);
        localStorage.setItem('quickcare_applications', JSON.stringify(existingApplications));
        
        // Show detailed success message
        applicationForm.innerHTML = `
            <div class="success-message" style="display: block;">
                <i class="fas fa-check-circle"></i>
                <h3>Application Submitted Successfully! 🎉</h3>
                
                <div class="confirmation-details">
                    <h4>Application Summary:</h4>
                    <p><strong>Applicant:</strong> ${formData.name}</p>
                    <p><strong>Email:</strong> ${formData.email}</p>
                    <p><strong>Phone:</strong> ${formData.phone}</p>
                    <p><strong>Resume:</strong> ${formData.resume} ✅ Uploaded</p>
                    <p><strong>Application ID:</strong> ${formData.applicationId}</p>
                </div>
                
                <div class="next-steps">
                    <h4>Next Steps:</h4>
                    <ul>
                        <li>📧 You'll receive confirmation email</li>
                        <li>👥 HR team will review your application</li>
                        <li>📞 Interview call within 3-5 business days</li>
                    </ul>
                </div>
                
                <p style="margin-top: 1rem; font-size: 0.9rem; color: #7f8c8d;">
                    <i class="fas fa-envelope"></i>
                    For queries: <strong>careers@quickcare.com</strong>
                </p>
                
                <button class="btn-primary" onclick="closeCareersModal()" style="margin-top: 1rem;">
                    Close
                </button>
            </div>
        `;
        
        // Log to console
        console.log('📝 New Job Application:', formData);
        console.log('📊 Total Applications:', existingApplications.length);
        
    }, 3000);
});

// View Stored Data (Admin Function)
function viewStoredData() {
    const partnerships = JSON.parse(localStorage.getItem('quickcare_partnerships') || '[]');
    const applications = JSON.parse(localStorage.getItem('quickcare_applications') || '[]');
    
    console.log('🤝 Partnership Requests:', partnerships);
    console.log('💼 Job Applications:', applications);
    
    // You can also display this in a modal for admin view
    alert(`Partnership Requests: ${partnerships.length}\nJob Applications: ${applications.length}\nCheck console for details.`);
}

// Add this button in your admin panel
// <button onclick="viewStoredData()" class="btn-outline">View Submissions</button>







