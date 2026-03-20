// cardiology.js - Complete JavaScript for QuickCare Cardiology Services

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadCardiologists();
    setupEventListeners();
    setMinDateForBooking();
});


// Initialize Application
function initializeApp() {
    console.log('QuickCare Cardiology initialized');
    
    // Set current date as minimum for booking
    const today = new Date();
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        dateInput.min = today.toISOString().split('T')[0];
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Symptom selection
    const symptomOptions = document.querySelectorAll('.symptom-option');
    symptomOptions.forEach(option => {
        option.addEventListener('click', function() {
            toggleSymptomSelection(this);
        });
    });
    
    // Severity selection
    const severityOptions = document.querySelectorAll('input[name="severity"]');
    severityOptions.forEach(option => {
        option.addEventListener('change', function() {
            selectedSeverity = this.value;
        });
    });
    
    // Filter cardiologists
    const specializationFilter = document.getElementById('specializationFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    
    if (specializationFilter) {
        specializationFilter.addEventListener('change', filterCardiologists);
    }
    
    if (experienceFilter) {
        experienceFilter.addEventListener('change', filterCardiologists);
    }
    
    // Consultation type selection
    const typeOptions = document.querySelectorAll('.type-option');
    typeOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectConsultationType(this.id.replace('type', '').toLowerCase());
        });
    });
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Toggle Symptom Selection
function toggleSymptomSelection(element) {
    const symptom = element.getAttribute('data-symptom');
    const index = selectedSymptoms.indexOf(symptom);
    
    if (index === -1) {
        selectedSymptoms.push(symptom);
        element.classList.add('active');
    } else {
        selectedSymptoms.splice(index, 1);
        element.classList.remove('active');
    }
    
    console.log('Selected symptoms:', selectedSymptoms);
}

// Analyze Cardiac Symptoms
function analyzeCardiacSymptoms() {
    const duration = document.getElementById('symptomDuration').value;
    const cardiacHistory = document.getElementById('cardiacHistory').value;
    const additionalInfo = document.getElementById('additionalInfo').value;
    
    // Validation
    if (selectedSymptoms.length === 0) {
        showAlert('Please select at least one symptom', 'medium');
        return;
    }
    
    if (!selectedSeverity) {
        showAlert('Please select symptom severity', 'medium');
        return;
    }
    
    if (!duration) {
        showAlert('Please select symptom duration', 'medium');
        return;
    }
    
    // Analyze risk level
    const riskLevel = calculateCardiacRisk(selectedSymptoms, selectedSeverity, duration, cardiacHistory);
    
    // Show analysis result
    showRiskAnalysis(riskLevel, selectedSymptoms, selectedSeverity, duration);
}

// Calculate Cardiac Risk Level
function calculateCardiacRisk(symptoms, severity, duration, history) {
    let riskScore = 0;
    
    // Symptom scoring
    const symptomScores = {
        'chest-pain': 3,
        'breathlessness': 2,
        'palpitations': 1,
        'dizziness': 1,
        'swelling': 1,
        'fatigue': 1,
        'sweating': 2,
        'arm-pain': 3
    };
    
    symptoms.forEach(symptom => {
        riskScore += symptomScores[symptom] || 1;
    });
    
    // Severity multiplier
    const severityMultipliers = {
        'mild': 1,
        'moderate': 1.5,
        'severe': 2
    };
    
    riskScore *= severityMultipliers[severity] || 1;
    
    // Duration factor
    if (duration === 'minutes' || duration === 'hours') {
        riskScore *= 1.5; // Acute symptoms are more concerning
    }
    
    // History factor
    const historyFactors = {
        'none': 1,
        'hypertension': 1.2,
        'diabetes': 1.3,
        'cholesterol': 1.1,
        'previous-heart-attack': 1.8,
        'family-history': 1.2
    };
    
    riskScore *= historyFactors[history] || 1;
    
    // Determine risk level
    if (riskScore >= 8) return 'high';
    if (riskScore >= 5) return 'medium';
    return 'low';
}

// Show Risk Analysis
function showRiskAnalysis(riskLevel, symptoms, severity, duration) {
    let message = '';
    let alertType = '';
    let recommendation = '';
    
    switch(riskLevel) {
        case 'high':
            message = '🚨 HIGH CARDIAC RISK DETECTED 🚨';
            alertType = 'high';
            recommendation = 'You may be experiencing cardiac symptoms that require IMMEDIATE medical attention. Please call emergency services or visit the nearest hospital immediately.';
            // Auto-open emergency modal for high risk
            setTimeout(() => openEmergencyCardiac(), 1000);
            break;
            
        case 'medium':
            message = '⚠️ MODERATE CARDIAC RISK DETECTED';
            alertType = 'medium';
            recommendation = 'Your symptoms suggest you should consult a cardiologist soon. We recommend booking an appointment within 24-48 hours.';
            break;
            
        case 'low':
            message = '✅ LOW CARDIAC RISK DETECTED';
            alertType = 'low';
            recommendation = 'Your symptoms appear to be low risk, but we still recommend consulting with a healthcare provider for proper evaluation.';
            break;
    }
    
    // Create detailed analysis message
    const detailedMessage = `
        <strong>${message}</strong><br><br>
        <strong>Selected Symptoms:</strong> ${symptoms.map(s => s.replace('-', ' ')).join(', ')}<br>
        <strong>Severity:</strong> ${severity}<br>
        <strong>Duration:</strong> ${duration}<br><br>
        <strong>Recommendation:</strong> ${recommendation}
    `;
    
    showAlert(detailedMessage, alertType, 10000);
    
    // For medium and low risk, suggest booking consultation
    if (riskLevel === 'medium' || riskLevel === 'low') {
        setTimeout(() => {
            if (confirm('Would you like to book a cardiology consultation?')) {
                scrollToConsultation();
            }
        }, 3000);
    }
}

// Show Custom Alert
function showAlert(message, type = 'medium', duration = 5000) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `custom-alert ${type}`;
    alert.innerHTML = message;
    
    // Add to DOM
    document.body.appendChild(alert);
    
    // Auto remove after duration
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, duration);
    
    // Allow manual dismissal
    alert.addEventListener('click', function() {
        this.remove();
    });
}

// Load Cardiologists Data
function loadCardiologists() {
    const cardiologistsGrid = document.getElementById('cardiologistsGrid');
    if (!cardiologistsGrid) return;
    
    // Sample cardiologists data
    const cardiologists = [
        {
            id: 1,
            name: "Dr. Rajesh Sharma",
            specialty: "Interventional Cardiologist",
            experience: 15,
            rating: 4.8,
            specialization: "interventional",
            availability: "Available Today",
            procedures: 2500,
            education: "MD, DM Cardiology - AIIMS Delhi"
        },
        {
            id: 2,
            name: "Dr. Priya Patel",
            specialty: "Non-Invasive Cardiologist",
            experience: 12,
            rating: 4.9,
            specialization: "non-invasive",
            availability: "Available Tomorrow",
            procedures: 1800,
            education: "MD, DM Cardiology - CMC Vellore"
        },
        {
            id: 3,
            name: "Dr. Amit Kumar",
            specialty: "Electrophysiologist",
            experience: 18,
            rating: 4.7,
            specialization: "electrophysiology",
            availability: "Available Today",
            procedures: 1200,
            education: "MD, DM Cardiology - PGIMER Chandigarh"
        },
        {
            id: 4,
            name: "Dr. Sunita Reddy",
            specialty: "Pediatric Cardiologist",
            experience: 14,
            rating: 4.9,
            specialization: "pediatric",
            availability: "Available Tomorrow",
            procedures: 900,
            education: "MD, DNB Pediatrics - AIIMS Delhi"
        },
        {
            id: 5,
            name: "Dr. Vikram Singh",
            specialty: "Interventional Cardiologist",
            experience: 22,
            rating: 4.8,
            specialization: "interventional",
            availability: "Available Today",
            procedures: 3500,
            education: "MD, DM Cardiology - Sir Ganga Ram Hospital"
        },
        {
            id: 6,
            name: "Dr. Anjali Mehta",
            specialty: "Non-Invasive Cardiologist",
            experience: 10,
            rating: 4.6,
            specialization: "non-invasive",
            availability: "Available Today",
            procedures: 1500,
            education: "MD, DM Cardiology - KEM Mumbai"
        }
    ];
    
    // Render cardiologists
    renderCardiologists(cardiologists);
    
    // Also load for booking modal
    loadCardiologistsForBooking(cardiologists);
}

// Render Cardiologists to Grid
function renderCardiologists(cardiologists) {
    const grid = document.getElementById('cardiologistsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    cardiologists.forEach(cardio => {
        const card = document.createElement('div');
        card.className = 'cardiologist-card';
        card.innerHTML = `
            <div class="cardiologist-header">
                <div class="cardiologist-avatar">
                    <i class="fas fa-user-md"></i>
                </div>
                <div class="cardiologist-info">
                    <h3>${cardio.name}</h3>
                    <div class="cardiologist-specialty">${cardio.specialty}</div>
                </div>
            </div>
            <div class="cardiologist-body">
                <div class="cardiologist-details">
                    <div class="cardiologist-rating">
                        <i class="fas fa-star"></i>
                        <span>${cardio.rating}/5</span>
                    </div>
                    <div class="cardiologist-experience">
                        <i class="fas fa-briefcase"></i>
                        ${cardio.experience}+ years experience
                    </div>
                    <div class="cardiologist-procedures">
                        <i class="fas fa-heart-pulse"></i>
                        ${cardio.procedures.toLocaleString()} procedures
                    </div>
                    <div class="cardiologist-specialization">
                        ${cardio.specialization.replace('-', ' ').toUpperCase()}
                    </div>
                </div>
                <div class="cardiologist-availability">
                    <span class="availability-status">${cardio.availability}</span>
                </div>
                <div class="cardiologist-actions">
                    <button class="btn-primary" onclick="bookCardiologist(${cardio.id})">
                        <i class="fas fa-calendar-check"></i>
                        Book Consultation
                    </button>
                    <button class="btn-outline" onclick="viewCardiologistProfile(${cardio.id})">
                        <i class="fas fa-user"></i>
                        Profile
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Load Cardiologists for Booking Modal
function loadCardiologistsForBooking(cardiologists) {
    const selectionContainer = document.getElementById('cardiologistSelection');
    if (!selectionContainer) return;
    
    selectionContainer.innerHTML = '';
    
    cardiologists.forEach(cardio => {
        const option = document.createElement('div');
        option.className = 'cardiologist-option';
        option.setAttribute('data-id', cardio.id);
        option.innerHTML = `
            <div class="cardiologist-option-avatar">
                <i class="fas fa-user-md"></i>
            </div>
            <div class="cardiologist-option-info">
                <h4>${cardio.name}</h4>
                <p>${cardio.specialty} • ${cardio.experience}+ years</p>
                <div class="cardiologist-rating">
                    <i class="fas fa-star"></i>
                    <span>${cardio.rating}</span>
                </div>
            </div>
        `;
        
        option.addEventListener('click', function() {
            selectCardiologistForBooking(cardio.id, this);
        });
        
        selectionContainer.appendChild(option);
    });
}

// Filter Cardiologists
function filterCardiologists() {
    const specialization = document.getElementById('specializationFilter').value;
    const experience = document.getElementById('experienceFilter').value;
    
    // In a real app, this would be an API call
    // For now, we'll simulate filtering
    const allCardiologists = document.querySelectorAll('.cardiologist-card');
    
    allCardiologists.forEach(card => {
        let showCard = true;
        
        // Filter by specialization
        if (specialization !== 'all') {
            const cardSpecialization = card.querySelector('.cardiologist-specialization').textContent.toLowerCase();
            if (!cardSpecialization.includes(specialization)) {
                showCard = false;
            }
        }
        
        // Filter by experience (this would need data attributes in real implementation)
        // For demo, we'll just show all
        
        card.style.display = showCard ? 'block' : 'none';
    });
}

// Select Cardiologist for Booking
function selectCardiologistForBooking(cardiologistId, element) {
    // Remove active class from all options
    const allOptions = document.querySelectorAll('.cardiologist-option');
    allOptions.forEach(opt => opt.classList.remove('active'));
    
    // Add active class to selected option
    element.classList.add('active');
    
    // Store selected cardiologist
    selectedCardiologist = cardiologistId;
    console.log('Selected cardiologist:', selectedCardiologist);
}

// Select Consultation Type
function selectConsultationType(type) {
    // Remove active class from all options
    const allOptions = document.querySelectorAll('.type-option');
    allOptions.forEach(opt => opt.classList.remove('active'));
    
    // Add active class to selected option
    document.getElementById(`type${type.charAt(0).toUpperCase() + type.slice(1)}`).classList.add('active');
    
    // Store selected type
    selectedConsultationType = type;
    console.log('Selected consultation type:', selectedConsultationType);
}

// Book Service
function bookService(serviceType) {
    // Map service types to consultation types
    const serviceMapping = {
        'cardiac-consultation': 'clinic',
        'echo-cardiogram': 'clinic',
        'stress-test': 'clinic',
        'angioplasty': 'clinic',
        'pacemaker': 'clinic'
    };
    
    const consultationType = serviceMapping[serviceType] || 'clinic';
    openBookingModal(consultationType);
}

// Book Cardiologist
function bookCardiologist(cardiologistId) {
    selectedCardiologist = cardiologistId;
    openBookingModal('clinic');
}

// View Cardiologist Profile
function viewCardiologistProfile(cardiologistId) {
    // In a real app, this would show a detailed profile
    showAlert(`Cardiologist profile view would open for ID: ${cardiologistId}`, 'medium');
}

// Open Booking Modal
function openBookingModal(type = null) {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;
    
    modal.style.display = 'block';
    
    // If type is specified, pre-select it
    if (type) {
        selectConsultationType(type);
        // Auto-advance to next step after a brief delay
        setTimeout(() => nextStep(2), 500);
    }
    
    // Reset to first step
    goToStep(1);
}

// Close Booking Modal
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Reset form
    resetBookingForm();
}

// Reset Booking Form
function resetBookingForm() {
    selectedSymptoms = [];
    selectedSeverity = '';
    selectedCardiologist = null;
    selectedConsultationType = null;
    selectedTimeSlot = null;
    currentStep = 1;
    
    // Reset UI elements
    document.querySelectorAll('.symptom-option').forEach(opt => opt.classList.remove('active'));
    document.querySelectorAll('input[name="severity"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('.type-option').forEach(opt => opt.classList.remove('active'));
    document.querySelectorAll('.cardiologist-option').forEach(opt => opt.classList.remove('active'));
    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('active'));
    
    // Reset form fields
    const form = document.getElementById('patientForm');
    if (form) form.reset();
    
    // Go back to first step
    goToStep(1);
}

// Navigation between steps
function goToStep(stepNumber) {
    // Hide all steps
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => step.classList.remove('active'));
    
    // Show target step
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
        currentStep = stepNumber;
        
        // Load time slots if we're on step 4
        if (stepNumber === 4) {
            loadTimeSlots();
        }
    }
}

function nextStep(nextStepNumber) {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
        return;
    }
    
    goToStep(nextStepNumber);
}

function prevStep(prevStepNumber) {
    goToStep(prevStepNumber);
}

// Validate Current Step
function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            if (!selectedConsultationType) {
                showAlert('Please select a consultation type', 'medium');
                return false;
            }
            break;
            
        case 2:
            if (!selectedCardiologist) {
                showAlert('Please select a cardiologist', 'medium');
                return false;
            }
            break;
            
        case 3:
            const name = document.getElementById('patientName').value;
            const age = document.getElementById('patientAge').value;
            const gender = document.getElementById('patientGender').value;
            const history = document.getElementById('cardiacHistoryForm').value;
            
            if (!name || !age || !gender || !history) {
                showAlert('Please fill all required fields', 'medium');
                return false;
            }
            
            if (age < 1 || age > 120) {
                showAlert('Please enter a valid age', 'medium');
                return false;
            }
            break;
            
        case 4:
            const date = document.getElementById('preferredDate').value;
            
            if (!date) {
                showAlert('Please select a date', 'medium');
                return false;
            }
            
            if (!selectedTimeSlot) {
                showAlert('Please select a time slot', 'medium');
                return false;
            }
            break;
    }
    
    return true;
}

// Load Time Slots
function loadTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    if (!timeSlotsContainer) return;
    
    // Generate time slots (9 AM to 5 PM, every 30 minutes)
    let timeSlotsHTML = '';
    for (let hour = 9; hour <= 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const displayTime = `${hour > 12 ? hour - 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
            
            // Randomly mark some slots as unavailable for demo
            const isAvailable = Math.random() > 0.3;
            
            timeSlotsHTML += `
                <div class="time-slot ${isAvailable ? '' : 'unavailable'}" 
                     data-time="${timeString}" 
                     ${isAvailable ? `onclick="selectTimeSlot('${timeString}', this)"` : ''}>
                    ${displayTime}
                </div>
            `;
        }
    }
    
    timeSlotsContainer.innerHTML = timeSlotsHTML;
}

// Select Time Slot
function selectTimeSlot(time, element) {
    // Remove active class from all slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        if (!slot.classList.contains('unavailable')) {
            slot.classList.remove('active');
        }
    });
    
    // Add active class to selected slot
    element.classList.add('active');
    
    // Store selected time
    selectedTimeSlot = time;
    console.log('Selected time slot:', selectedTimeSlot);
}

// Confirm Cardiology Booking
function confirmCardiologyBooking() {
    // Validate all data
    if (!validateCurrentStep()) return;
    
    // Get patient details
    const patientName = document.getElementById('patientName').value;
    const patientAge = document.getElementById('patientAge').value;
    const patientGender = document.getElementById('patientGender').value;
    const cardiacHistory = document.getElementById('cardiacHistoryForm').value;
    const medications = document.getElementById('currentMedications').value;
    const preferredDate = document.getElementById('preferredDate').value;
    
    // Format date for display
    const dateObj = new Date(preferredDate);
    const formattedDate = dateObj.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Format time for display
    const [hours, minutes] = selectedTimeSlot.split(':');
    const hour = parseInt(hours);
    const displayTime = `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
    
    // Get consultation type display name
    const typeDisplayNames = {
        'video': 'Video Consultation',
        'clinic': 'Clinic Visit',
        'home': 'Home Visit'
    };
    
    // Get price based on type
    const prices = {
        'video': '₹1200',
        'clinic': '₹1500',
        'home': '₹2500'
    };
    
    // In a real app, we would get cardiologist details from an API
    const cardiologistName = "Selected Cardiologist"; // This would be dynamic
    
    // Show booking confirmation
    const bookingDetails = document.getElementById('bookingDetails');
    if (bookingDetails) {
        bookingDetails.innerHTML = `
            <p><strong>Patient Name:</strong> ${patientName}</p>
            <p><strong>Age & Gender:</strong> ${patientAge} years, ${patientGender}</p>
            <p><strong>Consultation Type:</strong> ${typeDisplayNames[selectedConsultationType]}</p>
            <p><strong>Cardiologist:</strong> ${cardiologistName}</p>
            <p><strong>Date & Time:</strong> ${formattedDate} at ${displayTime}</p>
            <p><strong>Amount:</strong> ${prices[selectedConsultationType]}</p>
            <p><strong>Cardiac History:</strong> ${cardiacHistory.replace('-', ' ')}</p>
            ${medications ? `<p><strong>Current Medications:</strong> ${medications}</p>` : ''}
        `;
    }
    
    // Move to confirmation step
    goToStep(5);
    
    // In a real app, we would send this data to the server here
    console.log('Booking confirmed:', {
        patientName,
        patientAge,
        patientGender,
        consultationType: selectedConsultationType,
        cardiologist: selectedCardiologist,
        date: preferredDate,
        time: selectedTimeSlot,
        cardiacHistory,
        medications
    });
    
    // Show success message
    showAlert('🎉 Cardiology consultation booked successfully!', 'low', 5000);
}

// Set Minimum Date for Booking
function setMinDateForBooking() {
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        const today = new Date();
        dateInput.min = today.toISOString().split('T')[0];
        
        // Set default to tomorrow
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
}

// Cardiac Emergency Functions
function openEmergencyCardiac() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeEmergencyModal() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function callCardiacEmergency() {
    // In a real app, this would initiate a phone call
    showAlert('📞 Calling Cardiac Emergency: 108 / 102', 'high', 3000);
    
    // Simulate calling emergency
    setTimeout(() => {
        if (confirm('Would you like us to share your location with emergency services?')) {
            showAlert('📍 Location shared with emergency services', 'high', 3000);
        }
    }, 1000);
}

function showFirstAidGuide() {
    const firstAidInfo = `
        <strong>Heart Attack First Aid:</strong><br><br>
        1. <strong>Call Emergency</strong> - Dial 108 or 102 immediately<br>
        2. <strong>Chew Aspirin</strong> - If available and not allergic<br>
        3. <strong>Stay Calm</strong> - Sit or lie down in a comfortable position<br>
        4. <strong>Loosen Clothing</strong> - Remove tight clothing<br>
        5. <strong>Don't Drive</strong> - Wait for emergency medical help<br>
        6. <strong>CPR if Needed</strong> - If person is unconscious and not breathing<br><br>
        <em>Do not give anything except aspirin unless directed by emergency services.</em>
    `;
    
    showAlert(firstAidInfo, 'high', 10000);
}

// Book Cardiology Consultation
function bookCardiologyConsultation(type) {
    selectedConsultationType = type;
    openBookingModal(type);
}

// Scroll to Consultation Section
function scrollToConsultation() {
    const section = document.getElementById('consultationSection');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close modals if clicked outside
window.addEventListener('click', function(event) {
    const bookingModal = document.getElementById('bookingModal');
    const emergencyModal = document.getElementById('emergencyModal');
    
    if (bookingModal && event.target === bookingModal) {
        closeBookingModal();
    }
    
    if (emergencyModal && event.target === emergencyModal) {
        closeEmergencyModal();
    }
});

// Emergency button in navbar
document.querySelector('.emergency-btn')?.addEventListener('click', openEmergencyCardiac);

// Export functions for global access (if needed in HTML)
window.openEmergencyCardiac = openEmergencyCardiac;
window.scrollToConsultation = scrollToConsultation;
window.analyzeCardiacSymptoms = analyzeCardiacSymptoms;
window.bookService = bookService;
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.selectTimeSlot = selectTimeSlot;
window.confirmCardiologyBooking = confirmCardiologyBooking;
window.callCardiacEmergency = callCardiacEmergency;
window.showFirstAidGuide = showFirstAidGuide;
window.bookCardiologyConsultation = bookCardiologyConsultation;






// cardiology.js - Fixed Cardiac Symptoms Functionality

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadCardiologists();
    setupEventListeners();
    setMinDateForBooking();
    initializeSymptomsChecker(); // New function for symptoms
});

// Global Variables
let selectedSymptoms = [];
let selectedSeverity = '';
let selectedCardiologist = null;
let selectedConsultationType = null;
let selectedTimeSlot = null;
let currentStep = 1;

// Initialize Application
function initializeApp() {
    console.log('QuickCare Cardiology initialized');
    
    // Set current date as minimum for booking
    const today = new Date();
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        dateInput.min = today.toISOString().split('T')[0];
    }
}

// Initialize Symptoms Checker - NEW FUNCTION
function initializeSymptomsChecker() {
    console.log('Initializing Symptoms Checker...');
    
    // Symptom selection
    const symptomOptions = document.querySelectorAll('.symptom-option');
    symptomOptions.forEach(option => {
        option.addEventListener('click', function() {
            toggleSymptomSelection(this);
        });
    });
    
    // Severity selection
    const severityOptions = document.querySelectorAll('input[name="severity"]');
    severityOptions.forEach(option => {
        option.addEventListener('change', function() {
            selectedSeverity = this.value;
            console.log('Selected severity:', selectedSeverity);
        });
    });
    
    // Form elements event listeners
    const symptomDuration = document.getElementById('symptomDuration');
    const cardiacHistory = document.getElementById('cardiacHistory');
    const additionalInfo = document.getElementById('additionalInfo');
    
    if (symptomDuration) {
        symptomDuration.addEventListener('change', function() {
            console.log('Symptom duration:', this.value);
        });
    }
    
    if (cardiacHistory) {
        cardiacHistory.addEventListener('change', function() {
            console.log('Cardiac history:', this.value);
        });
    }
    
    if (additionalInfo) {
        additionalInfo.addEventListener('input', function() {
            console.log('Additional info:', this.value);
        });
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter cardiologists
    const specializationFilter = document.getElementById('specializationFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    
    if (specializationFilter) {
        specializationFilter.addEventListener('change', filterCardiologists);
    }
    
    if (experienceFilter) {
        experienceFilter.addEventListener('change', filterCardiologists);
    }
    
    // Consultation type selection
    const typeOptions = document.querySelectorAll('.type-option');
    typeOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectConsultationType(this.id.replace('type', '').toLowerCase());
        });
    });
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Emergency button
    const emergencyBtn = document.querySelector('.emergency-btn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', openEmergencyCardiac);
    }
}

// Toggle Symptom Selection - IMPROVED FUNCTION
function toggleSymptomSelection(element) {
    const symptom = element.getAttribute('data-symptom');
    const index = selectedSymptoms.indexOf(symptom);
    
    if (index === -1) {
        selectedSymptoms.push(symptom);
        element.classList.add('active');
        element.style.backgroundColor = '#dc3545';
        element.style.color = 'white';
        element.style.borderColor = '#dc3545';
        element.style.transform = 'translateY(-2px)';
    } else {
        selectedSymptoms.splice(index, 1);
        element.classList.remove('active');
        element.style.backgroundColor = '#f8f9fa';
        element.style.color = '#333';
        element.style.borderColor = '#e1e5e9';
        element.style.transform = 'translateY(0)';
    }
    
    console.log('Selected symptoms:', selectedSymptoms);
    
    // Show real-time symptom count
    updateSymptomCounter();
}

// Update Symptom Counter - NEW FUNCTION
function updateSymptomCounter() {
    const symptomCounter = document.getElementById('symptomCounter') || createSymptomCounter();
    symptomCounter.textContent = `Selected Symptoms: ${selectedSymptoms.length}`;
    
    if (selectedSymptoms.length > 0) {
        symptomCounter.style.display = 'block';
    } else {
        symptomCounter.style.display = 'none';
    }
}

// Create Symptom Counter - NEW FUNCTION
function createSymptomCounter() {
    const counter = document.createElement('div');
    counter.id = 'symptomCounter';
    counter.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 10px 15px;
        border-radius: 20px;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        display: none;
    `;
    document.body.appendChild(counter);
    return counter;
}

// Analyze Cardiac Symptoms - COMPLETELY REWRITTEN
function analyzeCardiacSymptoms() {
    console.log('Analyzing cardiac symptoms...');
    
    const duration = document.getElementById('symptomDuration').value;
    const cardiacHistory = document.getElementById('cardiacHistory').value;
    const additionalInfo = document.getElementById('additionalInfo').value;
    
    console.log('Form data:', {
        symptoms: selectedSymptoms,
        severity: selectedSeverity,
        duration: duration,
        history: cardiacHistory,
        additionalInfo: additionalInfo
    });
    
    // Enhanced Validation
    let validationErrors = [];
    
    if (selectedSymptoms.length === 0) {
        validationErrors.push('Please select at least one symptom');
    }
    
    if (!selectedSeverity) {
        validationErrors.push('Please select symptom severity');
    }
    
    if (!duration) {
        validationErrors.push('Please select symptom duration');
    }
    
    if (!cardiacHistory) {
        validationErrors.push('Please select cardiac history');
    }
    
    if (validationErrors.length > 0) {
        showAlert(validationErrors.join('<br>'), 'medium');
        return;
    }
    
    // Show loading state
    const analyzeBtn = document.querySelector('.btn-primary.btn-large');
    const originalText = analyzeBtn.innerHTML;
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    analyzeBtn.disabled = true;
    
    // Simulate analysis process
    setTimeout(() => {
        // Analyze risk level
        const riskLevel = calculateCardiacRisk(selectedSymptoms, selectedSeverity, duration, cardiacHistory);
        
        // Show analysis result
        showRiskAnalysis(riskLevel, selectedSymptoms, selectedSeverity, duration, cardiacHistory);
        
        // Reset button
        analyzeBtn.innerHTML = originalText;
        analyzeBtn.disabled = false;
    }, 2000);
}

// Calculate Cardiac Risk Level - IMPROVED ALGORITHM
function calculateCardiacRisk(symptoms, severity, duration, history) {
    console.log('Calculating risk with:', { symptoms, severity, duration, history });
    
    let riskScore = 0;
    
    // Enhanced Symptom scoring with weights
    const symptomScores = {
        'chest-pain': { base: 3, acute: 4 },
        'breathlessness': { base: 2, acute: 3 },
        'palpitations': { base: 1, acute: 2 },
        'dizziness': { base: 1, acute: 2 },
        'swelling': { base: 1, acute: 1 },
        'fatigue': { base: 1, acute: 1 },
        'sweating': { base: 2, acute: 3 },
        'arm-pain': { base: 3, acute: 4 }
    };
    
    symptoms.forEach(symptom => {
        const isAcute = duration === 'minutes' || duration === 'hours';
        const score = symptomScores[symptom] ? 
                     (isAcute ? symptomScores[symptom].acute : symptomScores[symptom].base) : 1;
        riskScore += score;
    });
    
    // Severity multiplier
    const severityMultipliers = {
        'mild': 1,
        'moderate': 1.5,
        'severe': 2
    };
    
    riskScore *= severityMultipliers[severity] || 1;
    
    // Duration factor
    if (duration === 'minutes') riskScore *= 2;
    else if (duration === 'hours') riskScore *= 1.8;
    else if (duration === 'days') riskScore *= 1.3;
    
    // History factor
    const historyFactors = {
        'none': 1,
        'hypertension': 1.3,
        'diabetes': 1.4,
        'cholesterol': 1.2,
        'previous-heart-attack': 2.0,
        'family-history': 1.3
    };
    
    riskScore *= historyFactors[history] || 1;
    
    console.log('Final risk score:', riskScore);
    
    // Enhanced risk determination
    if (riskScore >= 12) return 'critical';
    if (riskScore >= 8) return 'high';
    if (riskScore >= 5) return 'medium';
    return 'low';
}

// Show Risk Analysis - ENHANCED FUNCTION
function showRiskAnalysis(riskLevel, symptoms, severity, duration, history) {
    console.log('Showing risk analysis:', riskLevel);
    
    const analysisResults = {
        'critical': {
            title: '🚨 CRITICAL CARDIAC RISK 🚨',
            type: 'critical',
            message: 'IMMEDIATE MEDICAL ATTENTION REQUIRED!',
            recommendation: 'You are experiencing symptoms that indicate a potential cardiac emergency. Please call emergency services (108/102) immediately or go to the nearest hospital. Do not delay.',
            actions: ['Call Emergency', 'Open Emergency Guide'],
            autoEmergency: true
        },
        'high': {
            title: '⚠️ HIGH CARDIAC RISK DETECTED',
            type: 'high',
            message: 'Urgent medical consultation recommended',
            recommendation: 'Your symptoms suggest a high probability of cardiac issues. We strongly recommend seeking medical attention within the next few hours. Book an emergency consultation now.',
            actions: ['Book Emergency Consult', 'View Cardiologists'],
            autoEmergency: false
        },
        'medium': {
            title: '🔶 MODERATE CARDIAC RISK DETECTED',
            type: 'medium',
            message: 'Consultation recommended within 24-48 hours',
            recommendation: 'Your symptoms indicate moderate risk. Schedule a cardiology consultation soon for proper evaluation and preventive care.',
            actions: ['Book Consultation', 'Learn More'],
            autoEmergency: false
        },
        'low': {
            title: '✅ LOW CARDIAC RISK DETECTED',
            type: 'low',
            message: 'Routine check-up recommended',
            recommendation: 'While your current symptoms appear low risk, we recommend a routine cardiac check-up for preventive healthcare and peace of mind.',
            actions: ['Book Check-up', 'Preventive Tips'],
            autoEmergency: false
        }
    };
    
    const result = analysisResults[riskLevel] || analysisResults['low'];
    
    // Create detailed analysis display
    const symptomNames = symptoms.map(s => {
        const names = {
            'chest-pain': 'Chest Pain',
            'breathlessness': 'Breathlessness',
            'palpitations': 'Palpitations',
            'dizziness': 'Dizziness',
            'swelling': 'Swelling in Legs',
            'fatigue': 'Extreme Fatigue',
            'sweating': 'Cold Sweats',
            'arm-pain': 'Arm/Jaw Pain'
        };
        return names[s] || s;
    }).join(', ');
    
    const historyNames = {
        'none': 'No cardiac history',
        'hypertension': 'High Blood Pressure',
        'diabetes': 'Diabetes',
        'cholesterol': 'High Cholesterol',
        'previous-heart-attack': 'Previous Heart Issue',
        'family-history': 'Family History'
    };
    
    const detailedHTML = `
        <div class="risk-analysis-result ${result.type}">
            <div class="risk-header">
                <h3>${result.title}</h3>
                <p><strong>${result.message}</strong></p>
            </div>
            
            <div class="risk-details">
                <h4>Assessment Details:</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Symptoms:</strong> ${symptomNames}
                    </div>
                    <div class="detail-item">
                        <strong>Severity:</strong> ${severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </div>
                    <div class="detail-item">
                        <strong>Duration:</strong> ${duration}
                    </div>
                    <div class="detail-item">
                        <strong>History:</strong> ${historyNames[history] || history}
                    </div>
                </div>
            </div>
            
            <div class="recommendation">
                <h4>Recommendation:</h4>
                <p>${result.recommendation}</p>
            </div>
            
            <div class="risk-actions">
                ${result.actions.map(action => 
                    `<button class="action-btn ${result.type}" onclick="handleRiskAction('${result.type}', '${action}')">
                        ${action}
                    </button>`
                ).join('')}
            </div>
        </div>
    `;
    
    // Show the analysis
    showDetailedAlert(detailedHTML, result.type);
    
    // Auto-open emergency for critical cases
    if (result.autoEmergency) {
        setTimeout(() => {
            openEmergencyCardiac();
        }, 1500);
    }
    
    // Suggest booking for medium and low risk
    if (riskLevel === 'medium' || riskLevel === 'low') {
        setTimeout(() => {
            if (confirm('Would you like to book a cardiology consultation based on your symptoms?')) {
                scrollToConsultation();
            }
        }, 3000);
    }
}

// Handle Risk Actions - NEW FUNCTION
function handleRiskAction(riskLevel, action) {
    switch(action) {
        case 'Call Emergency':
            callCardiacEmergency();
            break;
        case 'Open Emergency Guide':
            showFirstAidGuide();
            break;
        case 'Book Emergency Consult':
            openBookingModal('clinic');
            break;
        case 'Book Consultation':
        case 'Book Check-up':
            scrollToConsultation();
            break;
        case 'View Cardiologists':
            document.querySelector('.cardiologists-section').scrollIntoView({ behavior: 'smooth' });
            break;
        case 'Preventive Tips':
            showPreventiveTips();
            break;
        case 'Learn More':
            showCardiacEducation();
            break;
    }
}

// Show Detailed Alert - NEW FUNCTION
function showDetailedAlert(content, type = 'medium', duration = 15000) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `custom-alert ${type} detailed-alert`;
    alert.innerHTML = content;
    
    // Add styles for detailed alert
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 3000;
        max-width: 500px;
        animation: slideInRight 0.3s ease;
        color: white;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    // Add specific styles based on type
    const backgroundColors = {
        'critical': '#dc3545',
        'high': '#fd7e14',
        'medium': '#ffc107',
        'low': '#28a745'
    };
    
    alert.style.background = backgroundColors[type] || '#fd7e14';
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        font-weight: bold;
    `;
    closeBtn.onclick = function() {
        alert.remove();
    };
    alert.appendChild(closeBtn);
    
    // Add internal styling
    const style = document.createElement('style');
    style.textContent = `
        .risk-analysis-result h3 { margin: 0 0 15px 0; font-size: 1.3em; }
        .risk-analysis-result h4 { margin: 15px 0 8px 0; font-size: 1.1em; }
        .detail-grid { display: grid; gap: 8px; margin: 10px 0; }
        .detail-item { padding: 5px 0; }
        .recommendation { background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin: 15px 0; }
        .risk-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 15px; }
        .action-btn { 
            padding: 8px 15px; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer; 
            font-weight: bold;
            transition: all 0.3s ease;
        }
        .action-btn.critical { background: #fff; color: #dc3545; }
        .action-btn.high { background: #fff; color: #fd7e14; }
        .action-btn.medium { background: #fff; color: #856404; }
        .action-btn.low { background: #fff; color: #28a745; }
        .action-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
    `;
    alert.appendChild(style);
    
    // Add to DOM
    document.body.appendChild(alert);
    
    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, duration);
    }
}

// Show Preventive Tips - NEW FUNCTION
function showPreventiveTips() {
    const tips = `
        <div class="preventive-tips">
            <h3>💚 Heart Health Preventive Tips</h3>
            <div class="tips-list">
                <div class="tip-item">
                    <strong>Healthy Diet:</strong> Eat fruits, vegetables, whole grains, and lean proteins
                </div>
                <div class="tip-item">
                    <strong>Regular Exercise:</strong> 30 minutes of moderate activity most days
                </div>
                <div class="tip-item">
                    <strong>Manage Stress:</strong> Practice relaxation techniques like meditation
                </div>
                <div class="tip-item">
                    <strong>Regular Check-ups:</strong> Monitor blood pressure and cholesterol
                </div>
                <div class="tip-item">
                    <strong>Avoid Smoking:</strong> Quit smoking and avoid secondhand smoke
                </div>
                <div class="tip-item">
                    <strong>Limit Alcohol:</strong> Drink in moderation
                </div>
                <div class="tip-item">
                    <strong>Maintain Healthy Weight:</strong> Achieve and maintain optimal BMI
                </div>
            </div>
        </div>
    `;
    
    showDetailedAlert(tips, 'low', 10000);
}

// Show Cardiac Education - NEW FUNCTION
function showCardiacEducation() {
    const education = `
        <div class="cardiac-education">
            <h3>📚 Understanding Cardiac Symptoms</h3>
            <div class="education-content">
                <div class="education-item">
                    <strong>Chest Pain:</strong> Can indicate angina or heart attack
                </div>
                <div class="education-item">
                    <strong>Breathlessness:</strong> May signal heart failure or arrhythmia
                </div>
                <div class="education-item">
                    <strong>Palpitations:</strong> Could be arrhythmias or electrical issues
                </div>
                <div class="education-item">
                    <strong>Swelling:</strong> Often related to heart failure
                </div>
                <div class="education-item">
                    <strong>When to Seek Help:</strong> Any sudden, severe, or persistent symptoms
                </div>
            </div>
            <p style="margin-top: 15px; font-style: italic;">
                Always consult a healthcare professional for proper diagnosis.
            </p>
        </div>
    `;
    
    showDetailedAlert(education, 'medium', 10000);
}

// Show Alert (Basic) - IMPROVED FUNCTION
function showAlert(message, type = 'medium', duration = 5000) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `custom-alert ${type}`;
    alert.innerHTML = message;
    
    // Add to DOM
    document.body.appendChild(alert);
    
    // Auto remove after duration
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, duration);
    
    // Allow manual dismissal
    alert.addEventListener('click', function() {
        this.remove();
    });
}

// ... (Rest of the functions remain the same as previous implementation)
// Load Cardiologists, Booking System, Emergency Functions, etc.

// Reset Symptoms - NEW FUNCTION
function resetSymptoms() {
    selectedSymptoms = [];
    selectedSeverity = '';
    
    // Reset UI
    document.querySelectorAll('.symptom-option').forEach(opt => {
        opt.classList.remove('active');
        opt.style.backgroundColor = '#f8f9fa';
        opt.style.color = '#333';
        opt.style.borderColor = '#e1e5e9';
        opt.style.transform = 'translateY(0)';
    });
    
    document.querySelectorAll('input[name="severity"]').forEach(radio => {
        radio.checked = false;
    });
    
    document.getElementById('symptomDuration').value = '';
    document.getElementById('cardiacHistory').value = '';
    document.getElementById('additionalInfo').value = '';
    
    updateSymptomCounter();
    
    showAlert('Symptoms form has been reset', 'low');
}

// Add Reset Button to HTML (You'll need to add this to your HTML)
function addResetButton() {
    const symptomsForm = document.querySelector('.symptoms-form');
    if (symptomsForm && !document.getElementById('resetSymptomsBtn')) {
        const resetBtn = document.createElement('button');
        resetBtn.id = 'resetSymptomsBtn';
        resetBtn.className = 'btn-outline';
        resetBtn.innerHTML = '<i class="fas fa-redo"></i> Reset Symptoms';
        resetBtn.onclick = resetSymptoms;
        resetBtn.style.marginTop = '10px';
        symptomsForm.appendChild(resetBtn);
    }
}

// Initialize reset button when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addResetButton, 1000);
});

// Export functions for global access
window.analyzeCardiacSymptoms = analyzeCardiacSymptoms;
window.resetSymptoms = resetSymptoms;
// ... other window exports