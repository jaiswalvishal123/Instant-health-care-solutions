// Consultation Data
const consultationData = {
    types: {
        video: {
            name: "Video Consultation",
            price: 299,
            duration: "15-30 minutes",
            icon: "fas fa-video",
            description: "Face-to-face video call with doctor"
        },
        chat: {
            name: "Chat Consultation",
            price: 199,
            duration: "24/7 available",
            icon: "fas fa-comment-medical",
            description: "Text chat with doctors"
        },
        voice: {
            name: "Voice Call",
            price: 249,
            duration: "15 minutes",
            icon: "fas fa-phone-alt",
            description: "Phone call consultation"
        }
    },

    doctors: [
        {
            id: 1,
            name: "Dr. Rajesh Sharma",
            specialty: "General Physician",
            experience: "15+ years",
            rating: 4.5,
            reviews: 1234,
            fee: 299,
            available: true,
            availableToday: true,
            languages: ["Hindi", "English"],
            nextAvailable: "10:00 AM"
        },
        {
            id: 2,
            name: "Dr. Priya Patel",
            specialty: "Family Medicine",
            experience: "12+ years",
            rating: 4.8,
            reviews: 892,
            fee: 349,
            available: true,
            availableToday: true,
            languages: ["Hindi", "English", "Gujarati"],
            nextAvailable: "11:30 AM"
        },
        {
            id: 3,
            name: "Dr. Amit Kumar",
            specialty: "Internal Medicine",
            experience: "18+ years",
            rating: 4.9,
            reviews: 2156,
            fee: 399,
            available: false,
            availableToday: false,
            languages: ["Hindi", "English"],
            nextAvailable: "Tomorrow"
        },
        {
            id: 4,
            name: "Dr. Sunita Reddy",
            specialty: "General Practitioner",
            experience: "10+ years",
            rating: 4.7,
            reviews: 945,
            fee: 249,
            available: true,
            availableToday: true,
            languages: ["Hindi", "English", "Telugu"],
            nextAvailable: "2:00 PM"
        }
    ],

    symptoms: [
        "fever", "headache", "cough", "cold", "stomach", "body-pain", "breathing", "skin"
    ],

    timeSlots: [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
        "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
        "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"
    ]
};

// Current Booking State
let currentBooking = {
    type: null,
    doctor: null,
    patient: {},
    symptoms: [],
    timeSlot: null,
    date: null
};

// Initialize Page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    loadDoctors();
    setupDatePicker();
});

function initializePage() {
    console.log('Consultation page initialized');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('preferredDate').min = today;
    
    // Load initial data
    updateTimeSlots();
}

function setupEventListeners() {
    // Emergency buttons
    document.querySelector('.emergency-btn').addEventListener('click', handleEmergency);
    document.querySelector('.btn-emergency').addEventListener('click', callEmergency);
    
    // Mobile menu
    document.querySelector('.hamburger').addEventListener('click', function() {
        document.querySelector('.nav-menu').classList.toggle('active');
    });
    
    // Symptoms selection
    document.querySelectorAll('.symptom-option').forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // Filters
    document.getElementById('availabilityFilter').addEventListener('change', filterDoctors);
    document.getElementById('experienceFilter').addEventListener('change', filterDoctors);
    
    // Consultation type selection in modal
    document.querySelectorAll('.type-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.type-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Date change
    document.getElementById('preferredDate').addEventListener('change', updateTimeSlots);
}

// Load Doctors
function loadDoctors() {
    const doctorsGrid = document.getElementById('doctorsGrid');
    doctorsGrid.innerHTML = '';
    
    consultationData.doctors.forEach(doctor => {
        const doctorCard = createDoctorCard(doctor);
        doctorsGrid.appendChild(doctorCard);
    });
}

function createDoctorCard(doctor) {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    card.innerHTML = `
        <div class="doctor-header">
            <div class="doctor-avatar">
                <i class="fas fa-user-md"></i>
            </div>
            <div class="doctor-info">
                <h3>${doctor.name}</h3>
                <p class="doctor-specialty">${doctor.specialty}</p>
            </div>
        </div>
        <div class="doctor-body">
            <div class="doctor-details">
                <div class="doctor-rating">
                    <i class="fas fa-star"></i>
                    <span>${doctor.rating} (${doctor.reviews} reviews)</span>
                </div>
                <p class="doctor-experience">${doctor.experience} experience</p>
                <p class="doctor-languages">Languages: ${doctor.languages.join(', ')}</p>
            </div>
            
            <div class="doctor-availability">
                <span class="availability-status ${doctor.available ? 'available' : 'unavailable'}">
                    <i class="fas fa-circle"></i>
                    ${doctor.available ? `Available Today • ${doctor.nextAvailable}` : 'Not Available Today'}
                </span>
            </div>
            
            <div class="doctor-fee">
                <strong>Consultation Fee: ₹${doctor.fee}</strong>
            </div>
            
            <div class="doctor-actions">
                <button class="btn-primary" onclick="bookDoctor(${doctor.id})" ${!doctor.available ? 'disabled' : ''}>
                    <i class="fas fa-calendar-check"></i>
                    Book Now
                </button>
                <button class="btn-outline" onclick="viewDoctorProfile(${doctor.id})">
                    <i class="fas fa-info-circle"></i>
                    Profile
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Filter Doctors
function filterDoctors() {
    const availabilityFilter = document.getElementById('availabilityFilter').value;
    const experienceFilter = document.getElementById('experienceFilter').value;
    
    const filteredDoctors = consultationData.doctors.filter(doctor => {
        let matchesAvailability = true;
        let matchesExperience = true;
        
        // Availability filter
        if (availabilityFilter === 'online') {
            matchesAvailability = doctor.available;
        } else if (availabilityFilter === 'today') {
            matchesAvailability = doctor.availableToday;
        }
        
        // Experience filter
        if (experienceFilter !== 'all') {
            const expYears = parseInt(doctor.experience);
            matchesExperience = expYears >= parseInt(experienceFilter);
        }
        
        return matchesAvailability && matchesExperience;
    });
    
    const doctorsGrid = document.getElementById('doctorsGrid');
    doctorsGrid.innerHTML = '';
    
    if (filteredDoctors.length === 0) {
        doctorsGrid.innerHTML = `
            <div class="no-doctors" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-user-md" style="font-size: 3rem; color: #bdc3c7; margin-bottom: 1rem;"></i>
                <h3>No doctors found</h3>
                <p>Try adjusting your filters</p>
            </div>
        `;
        return;
    }
    
    filteredDoctors.forEach(doctor => {
        const doctorCard = createDoctorCard(doctor);
        doctorsGrid.appendChild(doctorCard);
    });
}

// Consultation Type Selection
function selectConsultationType(type) {
    currentBooking.type = type;
    openBookingModal();
    showStep(1);
    
    // Set consultation type in modal
    document.querySelectorAll('.type-option').forEach(opt => opt.classList.remove('active'));
    document.getElementById(`type${type.charAt(0).toUpperCase() + type.slice(1)}`).classList.add('active');
}

// Book Doctor
function bookDoctor(doctorId) {
    const doctor = consultationData.doctors.find(d => d.id === doctorId);
    if (!doctor) return;
    
    currentBooking.doctor = doctor;
    openBookingModal();
    showStep(2);
    
    // Load doctors in selection
    loadDoctorSelection();
}

// Open Booking Modal
function openBookingModal() {
    document.getElementById('bookingModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    resetBooking();
}

function resetBooking() {
    currentBooking = {
        type: null,
        doctor: null,
        patient: {},
        symptoms: [],
        timeSlot: null,
        date: null
    };
    
    // Reset form
    document.getElementById('patientForm').reset();
    document.querySelectorAll('.type-option').forEach(opt => opt.classList.remove('active'));
    document.querySelectorAll('.doctor-option').forEach(opt => opt.classList.remove('active'));
    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('active'));
}

// Step Navigation
function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(`step${stepNumber}`).classList.add('active');
}

function nextStep(nextStepNumber) {
    // Validate current step before proceeding
    if (!validateStep(nextStepNumber - 1)) {
        return;
    }
    
    showStep(nextStepNumber);
    
    // Load data for next step if needed
    if (nextStepNumber === 2) {
        loadDoctorSelection();
    } else if (nextStepNumber === 4) {
        updateTimeSlots();
    }
}

function prevStep(prevStepNumber) {
    showStep(prevStepNumber);
}

function validateStep(stepNumber) {
    switch (stepNumber) {
        case 1:
            if (!currentBooking.type) {
                alert('Please select a consultation type');
                return false;
            }
            break;
            
        case 2:
            if (!currentBooking.doctor) {
                alert('Please select a doctor');
                return false;
            }
            break;
            
        case 3:
            const patientName = document.getElementById('patientName').value;
            const patientAge = document.getElementById('patientAge').value;
            const patientGender = document.getElementById('patientGender').value;
            const patientPhone = document.getElementById('patientPhone').value;
            
            if (!patientName || !patientAge || !patientGender || !patientPhone) {
                alert('Please fill all required patient details');
                return false;
            }
            
            // Save patient data
            currentBooking.patient = {
                name: patientName,
                age: patientAge,
                gender: patientGender,
                phone: patientPhone,
                email: document.getElementById('patientEmail').value,
                medicalHistory: document.getElementById('medicalHistory').value
            };
            break;
    }
    
    return true;
}

// Load Doctor Selection in Modal
function loadDoctorSelection() {
    const doctorSelection = document.getElementById('doctorSelection');
    doctorSelection.innerHTML = '';
    
    const availableDoctors = consultationData.doctors.filter(doctor => doctor.available);
    
    if (availableDoctors.length === 0) {
        doctorSelection.innerHTML = `
            <div class="no-doctors" style="text-align: center; padding: 2rem;">
                <i class="fas fa-user-md" style="font-size: 2rem; color: #bdc3c7; margin-bottom: 1rem;"></i>
                <p>No doctors available at the moment</p>
            </div>
        `;
        return;
    }
    
    availableDoctors.forEach(doctor => {
        const doctorOption = document.createElement('div');
        doctorOption.className = `doctor-option ${currentBooking.doctor && currentBooking.doctor.id === doctor.id ? 'active' : ''}`;
        doctorOption.onclick = () => selectDoctor(doctor);
        
        doctorOption.innerHTML = `
            <div class="doctor-option-avatar">
                <i class="fas fa-user-md"></i>
            </div>
            <div class="doctor-option-info">
                <h4>${doctor.name}</h4>
                <p>${doctor.specialty} • ${doctor.experience}</p>
                <p><strong>Fee: ₹${doctor.fee}</strong></p>
                <p class="rating"><i class="fas fa-star"></i> ${doctor.rating} (${doctor.reviews} reviews)</p>
            </div>
        `;
        
        doctorSelection.appendChild(doctorOption);
    });
}

function selectDoctor(doctor) {
    currentBooking.doctor = doctor;
    
    // Update UI
    document.querySelectorAll('.doctor-option').forEach(opt => opt.classList.remove('active'));
    event.target.closest('.doctor-option').classList.add('active');
}

// Setup Date Picker
function setupDatePicker() {
    const dateInput = document.getElementById('preferredDate');
    const today = new Date();
    dateInput.value = today.toISOString().split('T')[0];
    currentBooking.date = dateInput.value;
}

// Update Time Slots
function updateTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    const selectedDate = document.getElementById('preferredDate').value;
    currentBooking.date = selectedDate;
    
    timeSlotsContainer.innerHTML = '';
    
    const isToday = selectedDate === new Date().toISOString().split('T')[0];
    const currentTime = new Date();
    
    consultationData.timeSlots.forEach(slot => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = slot;
        
        // Check if time slot is in past for today
        if (isToday) {
            const [time, modifier] = slot.split(' ');
            let [hours, minutes] = time.split(':');
            
            if (modifier === 'PM' && hours !== '12') {
                hours = parseInt(hours) + 12;
            }
            if (modifier === 'AM' && hours === '12') {
                hours = 0;
            }
            
            const slotTime = new Date();
            slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            if (slotTime < currentTime) {
                timeSlot.classList.add('unavailable');
                timeSlot.title = 'This time slot has passed';
            } else {
                timeSlot.onclick = () => selectTimeSlot(slot);
            }
        } else {
            timeSlot.onclick = () => selectTimeSlot(slot);
        }
        
        timeSlotsContainer.appendChild(timeSlot);
    });
}

function selectTimeSlot(slot) {
    currentBooking.timeSlot = slot;
    
    // Update UI
    document.querySelectorAll('.time-slot').forEach(timeSlot => {
        timeSlot.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Analyze Symptoms
function analyzeSymptoms() {
    const selectedSymptoms = document.querySelectorAll('.symptom-option.active');
    const duration = document.getElementById('symptomDuration').value;
    const severity = document.querySelector('input[name="severity"]:checked');
    const additionalInfo = document.getElementById('additionalInfo').value;
    
    if (selectedSymptoms.length === 0) {
        alert('Please select at least one symptom');
        return;
    }
    
    if (!duration) {
        alert('Please select symptom duration');
        return;
    }
    
    if (!severity) {
        alert('Please select symptom severity');
        return;
    }
    
    // Collect symptoms data
    currentBooking.symptoms = Array.from(selectedSymptoms).map(symptom => 
        symptom.getAttribute('data-symptom')
    );
    
    currentBooking.symptomDetails = {
        duration: duration,
        severity: severity.value,
        additionalInfo: additionalInfo
    };
    
    // Show doctor recommendations based on symptoms
    recommendDoctors();
    openBookingModal();
    showStep(1);
}

function recommendDoctors() {
    // Simple recommendation logic based on symptoms
    const symptomCount = currentBooking.symptoms.length;
    const severity = currentBooking.symptomDetails.severity;
    
    let recommendedDoctors = consultationData.doctors.filter(doctor => doctor.available);
    
    // Sort by rating and experience for better doctors
    recommendedDoctors.sort((a, b) => {
        if (severity === 'severe') {
            // For severe symptoms, prefer more experienced doctors
            return parseInt(b.experience) - parseInt(a.experience);
        } else {
            // For mild/moderate, prefer higher rated doctors
            return b.rating - a.rating;
        }
    });
    
    // Update UI or show recommendation
    const message = `Based on your ${symptomCount} symptom(s) with ${severity} severity, we recommend consulting with our top general physicians.`;
    // You can show this message or automatically select a doctor
}

// Confirm Booking
function confirmBooking() {
    if (!currentBooking.timeSlot) {
        alert('Please select a time slot');
        return;
    }
    
    // Generate booking details
    const bookingId = 'BK' + Date.now();
    const consultationType = consultationData.types[currentBooking.type];
    
    const bookingDetails = `
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Patient:</strong> ${currentBooking.patient.name} (${currentBooking.patient.age} years)</p>
        <p><strong>Doctor:</strong> Dr. ${currentBooking.doctor.name}</p>
        <p><strong>Consultation:</strong> ${consultationType.name}</p>
        <p><strong>Date & Time:</strong> ${currentBooking.date} at ${currentBooking.timeSlot}</p>
        <p><strong>Fee:</strong> ₹${currentBooking.doctor.fee}</p>
        <p><strong>Contact:</strong> ${currentBooking.patient.phone}</p>
    `;
    
    document.getElementById('bookingDetails').innerHTML = bookingDetails;
    
    // Save booking to localStorage (simulating database)
    saveBookingToStorage(bookingId);
    
    // Show confirmation step
    showStep(5);
}

function saveBookingToStorage(bookingId) {
    const booking = {
        id: bookingId,
        ...currentBooking,
        status: 'confirmed',
        bookedAt: new Date().toISOString()
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('quickcare_bookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('quickcare_bookings', JSON.stringify(existingBookings));
    
    console.log('Booking saved:', booking);
}

// View Doctor Profile
function viewDoctorProfile(doctorId) {
    const doctor = consultationData.doctors.find(d => d.id === doctorId);
    if (!doctor) return;
    
    const profileHTML = `
        <h3>Dr. ${doctor.name}</h3>
        <p><strong>Specialty:</strong> ${doctor.specialty}</p>
        <p><strong>Experience:</strong> ${doctor.experience}</p>
        <p><strong>Rating:</strong> ${doctor.rating} ⭐ (${doctor.reviews} reviews)</p>
        <p><strong>Languages:</strong> ${doctor.languages.join(', ')}</p>
        <p><strong>Consultation Fee:</strong> ₹${doctor.fee}</p>
        <p><strong>Availability:</strong> ${doctor.available ? 'Available Today' : 'Not Available Today'}</p>
        
        <div style="margin-top: 1rem;">
            <button class="btn-primary" onclick="bookDoctor(${doctor.id})" ${!doctor.available ? 'disabled' : ''}>
                Book Consultation
            </button>
        </div>
    `;
    
    // You can implement a modal for doctor profile
    alert(`Doctor Profile:\n\n${doctor.name}\n${doctor.specialty}\n${doctor.experience} experience\nRating: ${doctor.rating}/5\nFee: ₹${doctor.fee}`);
}

// Emergency Functions
function handleEmergency() {
    if (confirm('🚑 Emergency Helpline: 108\nCall emergency services?')) {
        window.location.href = 'tel:108';
    }
}

function callEmergency() {
    if (confirm('🚨 Call Emergency Services at 108?')) {
        window.location.href = 'tel:108';
    }
}

// Utility Functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(time) {
    return time; // Already formatted
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeBookingModal();
    }
}

// Handle Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeBookingModal();
    }
});

// Export for global access
window.selectConsultationType = selectConsultationType;
window.bookDoctor = bookDoctor;
window.closeBookingModal = closeBookingModal;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.confirmBooking = confirmBooking;
window.analyzeSymptoms = analyzeSymptoms;
window.viewDoctorProfile = viewDoctorProfile;
window.callEmergency = callEmergency;
window.selectTimeSlot = selectTimeSlot;









// Symptoms Data with proper mapping
const symptomsData = {
    "fever": {
        name: "Fever",
        icon: "fas fa-thermometer-full",
        description: "High body temperature",
        commonCauses: ["Infection", "Viral", "Bacterial", "Inflammation"]
    },
    "headache": {
        name: "Headache", 
        icon: "fas fa-head-side-virus",
        description: "Pain in head or neck region",
        commonCauses: ["Tension", "Migraine", "Sinus", "Dehydration"]
    },
    "cough": {
        name: "Cough",
        icon: "fas fa-lungs-virus",
        description: "Respiratory reflex",
        commonCauses: ["Cold", "Allergy", "Infection", "Asthma"]
    },
    "cold": {
        name: "Cold",
        icon: "fas fa-wind",
        description: "Nasal congestion and runny nose",
        commonCauses: ["Viral infection", "Allergy", "Weather change"]
    },
    "stomach": {
        name: "Stomach Pain",
        icon: "fas fa-stomach",
        description: "Abdominal discomfort or pain",
        commonCauses: ["Indigestion", "Infection", "Gas", "Food poisoning"]
    },
    "body-pain": {
        name: "Body Pain",
        icon: "fas fa-bone",
        description: "Muscle or joint pain",
        commonCauses: ["Overexertion", "Viral infection", "Arthritis"]
    },
    "breathing": {
        name: "Breathing Issue",
        icon: "fas fa-wind",
        description: "Difficulty in breathing",
        commonCauses: ["Asthma", "Allergy", "Infection", "Anxiety"]
    },
    "skin": {
        name: "Skin Issue",
        icon: "fas fa-allergies",
        description: "Rashes, itching or skin problems",
        commonCauses: ["Allergy", "Infection", "Eczema", "Contact dermatitis"]
    }
};

// Updated initializePage function
function initializePage() {
    console.log('Consultation page initialized');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('preferredDate').min = today;
    
    // Load initial data
    updateTimeSlots();
    
    // Initialize symptoms grid
    initializeSymptomsGrid();
}

// New function to initialize symptoms grid
function initializeSymptomsGrid() {
    const symptomsGrid = document.querySelector('.symptoms-grid');
    symptomsGrid.innerHTML = '';
    
    Object.entries(symptomsData).forEach(([key, symptom]) => {
        const symptomOption = document.createElement('div');
        symptomOption.className = 'symptom-option';
        symptomOption.setAttribute('data-symptom', key);
        symptomOption.innerHTML = `
            <i class="${symptom.icon}"></i>
            <span>${symptom.name}</span>
        `;
        
        symptomOption.addEventListener('click', function() {
            toggleSymptomSelection(this, key);
        });
        
        symptomsGrid.appendChild(symptomOption);
    });
}

// Toggle symptom selection
function toggleSymptomSelection(element, symptomKey) {
    element.classList.toggle('active');
    
    const isActive = element.classList.contains('active');
    
    if (isActive) {
        if (!currentBooking.symptoms.includes(symptomKey)) {
            currentBooking.symptoms.push(symptomKey);
        }
    } else {
        currentBooking.symptoms = currentBooking.symptoms.filter(s => s !== symptomKey);
    }
    
    console.log('Selected symptoms:', currentBooking.symptoms);
    updateSymptomsSummary();
}

// Update symptoms summary (optional - for display)
function updateSymptomsSummary() {
    const selectedCount = currentBooking.symptoms.length;
    const symptomsCounter = document.getElementById('symptomsCounter') || createSymptomsCounter();
    
    symptomsCounter.textContent = `Selected: ${selectedCount} symptom(s)`;
    
    if (selectedCount > 0) {
        symptomsCounter.style.display = 'block';
    } else {
        symptomsCounter.style.display = 'none';
    }
}

// Create symptoms counter element
function createSymptomsCounter() {
    const counter = document.createElement('div');
    counter.id = 'symptomsCounter';
    counter.style.cssText = `
        background: #667eea;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: bold;
        margin-bottom: 1rem;
        display: none;
        text-align: center;
    `;
    
    const symptomsForm = document.querySelector('.symptoms-form');
    symptomsForm.insertBefore(counter, symptomsForm.firstChild);
    
    return counter;
}

// Updated analyzeSymptoms function
function analyzeSymptoms() {
    const selectedSymptoms = currentBooking.symptoms;
    const duration = document.getElementById('symptomDuration').value;
    const severity = document.querySelector('input[name="severity"]:checked');
    const additionalInfo = document.getElementById('additionalInfo').value;
    
    console.log('Analyzing symptoms:', {
        symptoms: selectedSymptoms,
        duration: duration,
        severity: severity ? severity.value : 'none',
        additionalInfo: additionalInfo
    });
    
    // Validation
    if (selectedSymptoms.length === 0) {
        showAlert('Please select at least one symptom', 'warning');
        return;
    }
    
    if (!duration) {
        showAlert('Please select symptom duration', 'warning');
        return;
    }
    
    if (!severity) {
        showAlert('Please select symptom severity', 'warning');
        return;
    }
    
    // Save symptom details
    currentBooking.symptomDetails = {
        duration: duration,
        severity: severity.value,
        additionalInfo: additionalInfo,
        selectedSymptoms: selectedSymptoms.map(key => symptomsData[key].name)
    };
    
    // Show analysis and recommendations
    showSymptomAnalysis();
    
    // Open booking modal
    openBookingModal();
    showStep(1);
}

// Show symptom analysis
function showSymptomAnalysis() {
    const severity = currentBooking.symptomDetails.severity;
    const symptomCount = currentBooking.symptoms.length;
    
    let recommendation = '';
    let urgency = '';
    
    // Determine urgency based on severity and symptoms
    if (severity === 'severe' || currentBooking.symptoms.includes('breathing')) {
        urgency = 'high';
        recommendation = '🚨 Based on your symptoms, we recommend immediate consultation. Please book with our senior physicians.';
    } else if (severity === 'moderate' || symptomCount > 2) {
        urgency = 'medium';
        recommendation = '⚠️ Your symptoms suggest you should consult a doctor soon. We recommend booking a consultation today.';
    } else {
        urgency = 'low';
        recommendation = '💡 Your symptoms appear mild. You can consult with any of our available doctors for proper diagnosis.';
    }
    
    // Show recommendation (you can display this in a modal or alert)
    console.log('Symptom Analysis:', recommendation);
    
    // Optional: Show in a custom alert
    showCustomAlert('Symptom Analysis', recommendation, urgency);
}

// Custom alert function
function showCustomAlert(title, message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert ${type}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'high' ? '#ff4757' : type === 'medium' ? '#f39c12' : '#667eea'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    alertDiv.innerHTML = `
        <h4 style="margin: 0 0 0.5rem 0;">${title}</h4>
        <p style="margin: 0; font-size: 0.9rem;">${message}</p>
        <button onclick="this.parentElement.remove()" style="
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1.2rem;
        ">&times;</button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

// Simple alert function
function showAlert(message, type = 'info') {
    alert(message);
}

// Updated setupEventListeners function
function setupEventListeners() {
    // Emergency buttons
    document.querySelector('.emergency-btn').addEventListener('click', handleEmergency);
    document.querySelector('.btn-emergency').addEventListener('click', callEmergency);
    
    // Mobile menu
    document.querySelector('.hamburger').addEventListener('click', function() {
        document.querySelector('.nav-menu').classList.toggle('active');
    });
    
    // Symptoms selection is now handled in initializeSymptomsGrid
    
    // Filters
    document.getElementById('availabilityFilter').addEventListener('change', filterDoctors);
    document.getElementById('experienceFilter').addEventListener('change', filterDoctors);
    
    // Consultation type selection in modal
    document.querySelectorAll('.type-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.type-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            currentBooking.type = this.id.replace('type', '').toLowerCase();
        });
    });
    
    // Date change
    document.getElementById('preferredDate').addEventListener('change', updateTimeSlots);
    
    // Severity selection
    document.querySelectorAll('input[name="severity"]').forEach(radio => {
        radio.addEventListener('change', function() {
            console.log('Severity selected:', this.value);
        });
    });
}

// Updated recommendDoctors function
function recommendDoctors() {
    const symptomCount = currentBooking.symptoms.length;
    const severity = currentBooking.symptomDetails.severity;
    
    let recommendedDoctors = consultationData.doctors.filter(doctor => doctor.available);
    
    // Enhanced recommendation logic based on symptoms
    if (currentBooking.symptoms.includes('breathing') || severity === 'severe') {
        // For breathing issues or severe symptoms, recommend most experienced doctors
        recommendedDoctors = recommendedDoctors
            .filter(doctor => parseInt(doctor.experience) >= 10)
            .sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
    } else if (symptomCount > 2 || severity === 'moderate') {
        // For multiple symptoms or moderate severity, recommend highly rated doctors
        recommendedDoctors = recommendedDoctors.sort((a, b) => b.rating - a.rating);
    } else {
        // For mild symptoms, recommend affordable doctors
        recommendedDoctors = recommendedDoctors.sort((a, b) => a.fee - b.fee);
    }
    
    // Show recommendation message
    const message = `Based on your ${symptomCount} symptom(s) with ${severity} severity, we recommend consulting with ${recommendedDoctors.length} available doctor(s).`;
    showCustomAlert('Doctor Recommendation', message, severity === 'severe' ? 'high' : severity === 'moderate' ? 'medium' : 'low');
    
    return recommendedDoctors;
}

// Reset symptoms when modal closes
function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Don't reset symptoms completely, just clear the selection UI
    document.querySelectorAll('.symptom-option.active').forEach(option => {
        option.classList.remove('active');
    });
    
    // Reset other booking data but keep symptoms for analysis
    const symptomsBackup = currentBooking.symptoms;
    const symptomDetailsBackup = currentBooking.symptomDetails;
    
    currentBooking = {
        type: null,
        doctor: null,
        patient: {},
        symptoms: symptomsBackup || [],
        symptomDetails: symptomDetailsBackup || {},
        timeSlot: null,
        date: null
    };
}

// Add CSS for custom alerts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .symptom-option {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .symptom-option.active {
        background: #667eea !important;
        color: white !important;
        border-color: #667eea !important;
        transform: scale(1.05);
    }
    
    .symptom-option:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .severity-option input:checked + .severity-label {
        transform: scale(1.05);
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    }
`;
document.head.appendChild(style);

// Test function to check symptoms functionality
function testSymptoms() {
    console.log('Testing symptoms functionality...');
    console.log('Current symptoms:', currentBooking.symptoms);
    console.log('Symptoms data:', symptomsData);
    
    // Simulate clicking a symptom
    const firstSymptom = document.querySelector('.symptom-option');
    if (firstSymptom) {
        firstSymptom.click();
        console.log('First symptom clicked');
    }
}

// Call test on load for debugging
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(testSymptoms, 1000);
});






// Updated analyzeSymptoms function
function analyzeSymptoms() {
    const selectedSymptoms = currentBooking.symptoms;
    const duration = document.getElementById('symptomDuration').value;
    const severity = document.querySelector('input[name="severity"]:checked');
    const additionalInfo = document.getElementById('additionalInfo').value;
    
    console.log('Analyzing symptoms:', {
        symptoms: selectedSymptoms,
        duration: duration,
        severity: severity ? severity.value : 'none',
        additionalInfo: additionalInfo
    });
    
    // Validation
    if (selectedSymptoms.length === 0) {
        showAlert('Please select at least one symptom', 'warning');
        return;
    }
    
    if (!duration) {
        showAlert('Please select symptom duration', 'warning');
        return;
    }
    
    if (!severity) {
        showAlert('Please select symptom severity', 'warning');
        return;
    }
    
    // Save symptom details
    currentBooking.symptomDetails = {
        duration: duration,
        severity: severity.value,
        additionalInfo: additionalInfo,
        selectedSymptoms: selectedSymptoms.map(key => symptomsData[key].name)
    };
    
    // Get recommended doctors based on symptoms
    const recommendedDoctors = recommendDoctors();
    
    // Show analysis and open booking modal with recommended doctors
    showSymptomAnalysis(recommendedDoctors);
    
    // Open booking modal
    openBookingModal();
    showStep(1);
}

// Updated recommendDoctors function - Now returns doctors list
function recommendDoctors() {
    const symptomCount = currentBooking.symptoms.length;
    const severity = currentBooking.symptomDetails.severity;
    
    let recommendedDoctors = consultationData.doctors.filter(doctor => doctor.available);
    
    console.log('Available doctors:', recommendedDoctors);
    
    // Enhanced recommendation logic based on symptoms
    if (currentBooking.symptoms.includes('breathing') || severity === 'severe') {
        // For breathing issues or severe symptoms, recommend most experienced doctors
        recommendedDoctors = recommendedDoctors
            .filter(doctor => parseInt(doctor.experience) >= 10)
            .sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
        
        console.log('Recommended for severe symptoms:', recommendedDoctors);
    } else if (symptomCount > 2 || severity === 'moderate') {
        // For multiple symptoms or moderate severity, recommend highly rated doctors
        recommendedDoctors = recommendedDoctors.sort((a, b) => b.rating - a.rating);
        console.log('Recommended for moderate symptoms:', recommendedDoctors);
    } else {
        // For mild symptoms, recommend affordable doctors
        recommendedDoctors = recommendedDoctors.sort((a, b) => a.fee - b.fee);
        console.log('Recommended for mild symptoms:', recommendedDoctors);
    }
    
    return recommendedDoctors;
}

// Updated showSymptomAnalysis function
function showSymptomAnalysis(recommendedDoctors) {
    const severity = currentBooking.symptomDetails.severity;
    const symptomCount = currentBooking.symptoms.length;
    
    let recommendation = '';
    let urgency = '';
    
    // Determine urgency based on severity and symptoms
    if (severity === 'severe' || currentBooking.symptoms.includes('breathing')) {
        urgency = 'high';
        recommendation = `🚨 Based on your ${symptomCount} symptom(s) with severe severity, we recommend immediate consultation with our senior physicians.`;
    } else if (severity === 'moderate' || symptomCount > 2) {
        urgency = 'medium';
        recommendation = `⚠️ Your ${symptomCount} symptom(s) suggest you should consult a doctor soon. We have ${recommendedDoctors.length} doctors available.`;
    } else {
        urgency = 'low';
        recommendation = `💡 Your ${symptomCount} symptom(s) appear mild. You can consult with any of our ${recommendedDoctors.length} available doctors.`;
    }
    
    // Show recommendation
    showCustomAlert('Symptom Analysis', recommendation, urgency);
    
    // Store recommended doctors for use in booking modal
    currentBooking.recommendedDoctors = recommendedDoctors;
}

// Updated nextStep function - Load recommended doctors when moving to step 2
function nextStep(nextStepNumber) {
    // Validate current step before proceeding
    if (!validateStep(nextStepNumber - 1)) {
        return;
    }
    
    showStep(nextStepNumber);
    
    // Load data for next step if needed
    if (nextStepNumber === 2) {
        // Use recommended doctors if available, otherwise all available doctors
        const doctorsToShow = currentBooking.recommendedDoctors || 
                             consultationData.doctors.filter(doctor => doctor.available);
        loadDoctorSelection(doctorsToShow);
    } else if (nextStepNumber === 4) {
        updateTimeSlots();
    }
}

// Updated loadDoctorSelection function - Accept doctors list as parameter
function loadDoctorSelection(doctorsList = null) {
    const doctorSelection = document.getElementById('doctorSelection');
    doctorSelection.innerHTML = '';
    
    const doctorsToShow = doctorsList || consultationData.doctors.filter(doctor => doctor.available);
    
    console.log('Loading doctors in selection:', doctorsToShow);
    
    if (doctorsToShow.length === 0) {
        doctorSelection.innerHTML = `
            <div class="no-doctors" style="text-align: center; padding: 2rem;">
                <i class="fas fa-user-md" style="font-size: 2rem; color: #bdc3c7; margin-bottom: 1rem;"></i>
                <p>No doctors available at the moment</p>
                <p style="font-size: 0.9rem; color: #7f8c8d;">Please try again later or contact emergency services</p>
            </div>
        `;
        return;
    }
    
    doctorsToShow.forEach(doctor => {
        const doctorOption = document.createElement('div');
        doctorOption.className = `doctor-option ${currentBooking.doctor && currentBooking.doctor.id === doctor.id ? 'active' : ''}`;
        doctorOption.onclick = () => selectDoctor(doctor);
        
        doctorOption.innerHTML = `
            <div class="doctor-option-avatar">
                <i class="fas fa-user-md"></i>
            </div>
            <div class="doctor-option-info">
                <h4>${doctor.name}</h4>
                <p>${doctor.specialty} • ${doctor.experience}</p>
                <p><strong>Fee: ₹${doctor.fee}</strong></p>
                <p class="rating"><i class="fas fa-star"></i> ${doctor.rating} (${doctor.reviews} reviews)</p>
                <p class="availability"><i class="fas fa-clock"></i> Next: ${doctor.nextAvailable}</p>
            </div>
        `;
        
        doctorSelection.appendChild(doctorOption);
    });
}

// Updated selectDoctor function
function selectDoctor(doctor) {
    currentBooking.doctor = doctor;
    
    // Update UI
    document.querySelectorAll('.doctor-option').forEach(opt => opt.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    console.log('Doctor selected:', doctor.name);
}

// Add this function to debug and check available doctors
function checkAvailableDoctors() {
    const availableDoctors = consultationData.doctors.filter(doctor => doctor.available);
    console.log('Available doctors:', availableDoctors);
    
    if (availableDoctors.length === 0) {
        console.warn('No doctors available in the data');
        // Let's add some test doctors if none are available
        if (consultationData.doctors.length === 0) {
            console.log('Adding test doctors...');
            consultationData.doctors = [
                {
                    id: 1,
                    name: "Dr. Rajesh Sharma",
                    specialty: "General Physician",
                    experience: "15+ years",
                    rating: 4.5,
                    reviews: 1234,
                    fee: 299,
                    available: true,
                    availableToday: true,
                    languages: ["Hindi", "English"],
                    nextAvailable: "10:00 AM"
                },
                {
                    id: 2,
                    name: "Dr. Priya Patel",
                    specialty: "Family Medicine",
                    experience: "12+ years",
                    rating: 4.8,
                    reviews: 892,
                    fee: 349,
                    available: true,
                    availableToday: true,
                    languages: ["Hindi", "English", "Gujarati"],
                    nextAvailable: "11:30 AM"
                }
            ];
        }
    }
    
    return availableDoctors;
}

// Update initializePage to check doctors
function initializePage() {
    console.log('Consultation page initialized');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('preferredDate').min = today;
    
    // Check available doctors
    checkAvailableDoctors();
    
    // Load initial data
    updateTimeSlots();
    
    // Initialize symptoms grid
    initializeSymptomsGrid();
    
    // Load doctors in main grid
    loadDoctors();
}

// Enhanced showCustomAlert function
function showCustomAlert(title, message, type = 'info') {
    // Remove existing alerts
    document.querySelectorAll('.custom-alert').forEach(alert => alert.remove());
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert ${type}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'high' ? '#ff4757' : type === 'medium' ? '#f39c12' : '#667eea'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    alertDiv.innerHTML = `
        <h4 style="margin: 0 0 0.5rem 0;">${title}</h4>
        <p style="margin: 0; font-size: 0.9rem;">${message}</p>
        <button onclick="this.parentElement.remove()" style="
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1.2rem;
        ">&times;</button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

// Add emergency fallback function
function showEmergencyFallback() {
    const message = `
        <div style="text-align: center; padding: 2rem;">
            <i class="fas fa-user-md" style="font-size: 3rem; color: #bdc3c7; margin-bottom: 1rem;"></i>
            <h3 style="color: #2c3e50; margin-bottom: 1rem;">No Doctors Available Online</h3>
            <p style="color: #7f8c8d; margin-bottom: 1.5rem;">
                All our online doctors are currently busy. Please try the following options:
            </p>
            <div style="display: grid; gap: 1rem;">
                <button class="btn-primary" onclick="callEmergency()">
                    <i class="fas fa-phone-alt"></i>
                    Call Emergency: 108
                </button>
                <button class="btn-outline" onclick="closeBookingModal()">
                    <i class="fas fa-clock"></i>
                    Try Again Later
                </button>
            </div>
        </div>
    `;
    
    const doctorSelection = document.getElementById('doctorSelection');
    doctorSelection.innerHTML = message;
}

// Update loadDoctorSelection to show fallback
function loadDoctorSelection(doctorsList = null) {
    const doctorSelection = document.getElementById('doctorSelection');
    doctorSelection.innerHTML = '';
    
    const doctorsToShow = doctorsList || consultationData.doctors.filter(doctor => doctor.available);
    
    console.log('Loading doctors in selection:', doctorsToShow);
    
    if (doctorsToShow.length === 0) {
        showEmergencyFallback();
        return;
    }
    
    doctorsToShow.forEach(doctor => {
        const doctorOption = document.createElement('div');
        doctorOption.className = `doctor-option ${currentBooking.doctor && currentBooking.doctor.id === doctor.id ? 'active' : ''}`;
        doctorOption.onclick = () => selectDoctor(doctor);
        
        doctorOption.innerHTML = `
            <div class="doctor-option-avatar">
                <i class="fas fa-user-md"></i>
            </div>
            <div class="doctor-option-info">
                <h4>${doctor.name}</h4>
                <p>${doctor.specialty} • ${doctor.experience}</p>
                <p><strong>Fee: ₹${doctor.fee}</strong></p>
                <p class="rating"><i class="fas fa-star"></i> ${doctor.rating} (${doctor.reviews} reviews)</p>
                <p class="availability"><i class="fas fa-clock"></i> Next: ${doctor.nextAvailable}</p>
            </div>
        `;
        
        doctorSelection.appendChild(doctorOption);
    });
}

// Test function for symptoms analysis
function testAnalyzeSymptoms() {
    console.log('Testing analyze symptoms functionality...');
    
    // Simulate selecting symptoms
    currentBooking.symptoms = ['fever', 'headache'];
    currentBooking.symptomDetails = {
        duration: '1-3-days',
        severity: 'moderate',
        additionalInfo: 'Test symptoms'
    };
    
    const recommendedDoctors = recommendDoctors();
    console.log('Recommended doctors:', recommendedDoctors);
    
    if (recommendedDoctors.length > 0) {
        console.log('✅ Symptoms analysis working correctly');
        showCustomAlert('Test Successful', 'Symptoms analysis is working! Found ' + recommendedDoctors.length + ' doctors.', 'low');
    } else {
        console.warn('❌ No doctors found in analysis');
        showCustomAlert('Test Warning', 'No doctors available in test data', 'medium');
    }
}

// Call test on load for debugging
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('Page loaded, testing symptoms functionality...');
        testAnalyzeSymptoms();
    }, 2000);
});