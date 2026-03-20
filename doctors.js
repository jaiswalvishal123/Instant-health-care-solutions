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

// Search Functionality
const searchBox = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');

searchButton.addEventListener('click', performSearch);
searchBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

function performSearch() {
    const query = searchBox.value.trim();
    if (query) {
        alert(`Searching for doctors related to: "${query}"`);
        // In real implementation, you would filter doctors here
    }
}

// Filter Functionality
const filters = {
    speciality: document.getElementById('speciality'),
    experience: document.getElementById('experience'),
    availability: document.getElementById('availability')
};

Object.values(filters).forEach(filter => {
    filter.addEventListener('change', applyFilters);
});

function applyFilters() {
    const speciality = filters.speciality.value;
    const experience = filters.experience.value;
    const availability = filters.availability.value;
    
    console.log('Applying filters:', { speciality, experience, availability });
    // In real implementation, you would filter doctors based on these criteria
}

// Doctor Card Interactions
document.querySelectorAll('.book-consultation').forEach(button => {
    button.addEventListener('click', function() {
        const doctorName = this.closest('.doctor-card').querySelector('h3').textContent;
        const fees = this.closest('.doctor-card').querySelector('.fees strong').textContent;
        alert(`Booking Video Consultation with ${doctorName}\n${fees}\nRedirecting to payment...`);
    });
});

document.querySelectorAll('.book-appointment').forEach(button => {
    button.addEventListener('click', function() {
        const doctorName = this.closest('.doctor-card').querySelector('h3').textContent;
        const hospital = this.closest('.doctor-card').querySelector('.hospital').textContent;
        alert(`Booking Clinic Appointment with ${doctorName}\nAt: ${hospital}\nSelecting time slot...`);
    });
});

document.querySelectorAll('.view-profile').forEach(button => {
    button.addEventListener('click', function() {
        const doctorName = this.closest('.doctor-card').querySelector('h3').textContent;
        const speciality = this.closest('.doctor-card').querySelector('.speciality').textContent;
        alert(`Opening detailed profile of ${doctorName}\nSpeciality: ${speciality}`);
    });
});

// Specialty Card Filtering
document.querySelectorAll('.specialty-card').forEach(card => {
    card.addEventListener('click', function() {
        const specialty = this.getAttribute('data-specialty');
        const specialtyName = this.querySelector('h4').textContent;
        filters.speciality.value = specialty;
        applyFilters();
        alert(`Filtering doctors for: ${specialtyName}`);
    });
});

// Load More Functionality
document.querySelector('.load-more button').addEventListener('click', function() {
    this.textContent = 'Loading more doctors...';
    this.disabled = true;
    
    setTimeout(() => {
        alert('Loading more doctors...\nIn real implementation, this would fetch more doctor data from server.');
        this.textContent = 'Load More Doctors';
        this.disabled = false;
    }, 2000);
});

// Emergency Button
document.querySelector('.emergency-btn').addEventListener('click', () => {
    if (confirm('🚑 Emergency Helpline: 108\nCall emergency services?')) {
        window.location.href = 'tel:108';
    }
});

// Health Advisor CTA
document.querySelector('.btn-primary.btn-large').addEventListener('click', function() {
    alert('Connecting you with a health advisor...\nThey will help you find the right doctor for your needs.');
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Doctors Page Loaded');
    
    // Add some sample data to filters
    const doctorCounts = {
        cardiology: 45,
        neurology: 32,
        pediatrics: 67,
        orthopedics: 54,
        dermatology: 38,
        gynecology: 42
    };
    
    // Update doctor counts in specialty cards
    document.querySelectorAll('.specialty-card').forEach(card => {
        const specialty = card.getAttribute('data-specialty');
        const count = doctorCounts[specialty] || 0;
        card.querySelector('.doctor-count').textContent = `${count} Doctors`;
    });
});







// Doctors Database (Sample Data)
const doctorsData = {
    cardiology: [
        {
            name: "Dr. Rajesh Sharma",
            speciality: "Cardiologist",
            experience: "15+ years",
            rating: 4.5,
            reviews: 1234,
            hospital: "Apollo Hospital, Delhi",
            fees: "₹800",
            available: true,
            online: true
        },
        {
            name: "Dr. Amit Verma",
            speciality: "Cardiac Surgeon",
            experience: "12+ years",
            rating: 4.7,
            reviews: 856,
            hospital: "Max Hospital, Mumbai",
            fees: "₹1,500",
            available: true,
            online: false
        },
        {
            name: "Dr. Priya Singh",
            speciality: "Interventional Cardiologist",
            experience: "10+ years",
            rating: 4.8,
            reviews: 942,
            hospital: "Fortis Hospital, Bangalore",
            fees: "₹1,200",
            available: true,
            online: true
        }
    ],
    
    neurology: [
        {
            name: "Dr. Priya Patel",
            speciality: "Neurologist",
            experience: "12+ years",
            rating: 4.8,
            reviews: 892,
            hospital: "Max Hospital, Mumbai",
            fees: "₹1,200",
            available: true,
            online: false
        },
        {
            name: "Dr. Rohit Malhotra",
            speciality: "Neurosurgeon",
            experience: "18+ years",
            rating: 4.9,
            reviews: 1123,
            hospital: "AIIMS, Delhi",
            fees: "₹2,000",
            available: false,
            online: false
        }
    ],
    
    pediatrics: [
        {
            name: "Dr. Anil Kumar",
            speciality: "Pediatrician",
            experience: "18+ years",
            rating: 4.9,
            reviews: 2156,
            hospital: "Fortis Hospital, Bangalore",
            fees: "₹600",
            available: true,
            online: true
        },
        {
            name: "Dr. Sunita Reddy",
            speciality: "Child Specialist",
            experience: "14+ years",
            rating: 4.7,
            reviews: 1567,
            hospital: "Manipal Hospital, Bangalore",
            fees: "₹750",
            available: true,
            online: true
        }
    ],
    
    orthopedics: [
        {
            name: "Dr. Sanjay Gupta",
            speciality: "Orthopedic Surgeon",
            experience: "20+ years",
            rating: 4.6,
            reviews: 1789,
            hospital: "AIIMS, Delhi",
            fees: "₹1,000",
            available: true,
            online: true
        },
        {
            name: "Dr. Vikram Joshi",
            speciality: "Joint Replacement Specialist",
            experience: "15+ years",
            rating: 4.5,
            reviews: 1345,
            hospital: "Artemis Hospital, Gurgaon",
            fees: "₹1,800",
            available: true,
            online: false
        }
    ],
    
    dermatology: [
        {
            name: "Dr. Neha Mehta",
            speciality: "Dermatologist",
            experience: "8+ years",
            rating: 4.7,
            reviews: 945,
            hospital: "Artemis Hospital, Gurgaon",
            fees: "₹900",
            available: true,
            online: false
        }
    ],
    
    gynecology: [
        {
            name: "Dr. Sunita Reddy",
            speciality: "Gynecologist",
            experience: "14+ years",
            rating: 4.5,
            reviews: 1567,
            hospital: "Manipal Hospital, Bangalore",
            fees: "₹750",
            available: true,
            online: true
        },
        {
            name: "Dr. Anjali Kapoor",
            speciality: "Obstetrician",
            experience: "16+ years",
            rating: 4.8,
            reviews: 1890,
            hospital: "Apollo Hospital, Delhi",
            fees: "₹1,100",
            available: true,
            online: false
        }
    ]
};

// Specialization Details
const specializationDetails = {
    cardiology: {
        title: "Cardiology Specialists",
        description: "Expert heart care and cardiovascular treatments",
        icon: "fas fa-heart"
    },
    neurology: {
        title: "Neurology Specialists", 
        description: "Brain and nervous system care",
        icon: "fas fa-brain"
    },
    pediatrics: {
        title: "Pediatrics Specialists",
        description: "Child healthcare and development",
        icon: "fas fa-baby"
    },
    orthopedics: {
        title: "Orthopedics Specialists",
        description: "Bone, joint and muscle care",
        icon: "fas fa-bone"
    },
    dermatology: {
        title: "Dermatology Specialists",
        description: "Skin, hair and nail treatments",
        icon: "fas fa-allergies"
    },
    gynecology: {
        title: "Gynecology Specialists",
        description: "Women's health and wellness",
        icon: "fas fa-female"
    }
};

// Specialization Click Handler
document.querySelectorAll('.specialty-card').forEach(card => {
    card.addEventListener('click', function() {
        const specialty = this.getAttribute('data-specialty');
        showDoctorsBySpecialty(specialty);
    });
});

// Show Doctors by Specialty
function showDoctorsBySpecialty(specialty) {
    // Show loading state
    document.getElementById('filteredDoctorsGrid').innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading ${specializationDetails[specialty].title}...</p>
        </div>
    `;
    
    // Show filtered section
    document.getElementById('filteredDoctors').style.display = 'block';
    
    // Scroll to filtered section
    document.getElementById('filteredDoctors').scrollIntoView({ 
        behavior: 'smooth' 
    });
    
    // Update header
    document.getElementById('specialtyTitle').textContent = specializationDetails[specialty].title;
    document.getElementById('specialtyDescription').textContent = specializationDetails[specialty].description;
    
    // Highlight active specialty card
    document.querySelectorAll('.specialty-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`[data-specialty="${specialty}"]`).classList.add('active');
    
    // Simulate API call delay
    setTimeout(() => {
        displayFilteredDoctors(specialty);
    }, 1000);
}

// Display Filtered Doctors
function displayFilteredDoctors(specialty) {
    const doctors = doctorsData[specialty] || [];
    const doctorsGrid = document.getElementById('filteredDoctorsGrid');
    
    if (doctors.length === 0) {
        doctorsGrid.innerHTML = `
            <div class="no-doctors">
                <i class="fas fa-user-md"></i>
                <h3>No Doctors Available</h3>
                <p>Sorry, no doctors found for this specialization at the moment.</p>
                <button class="btn-primary" onclick="showAllSpecialties()">
                    Browse Other Specializations
                </button>
            </div>
        `;
        return;
    }
    
    let doctorsHTML = '';
    
    doctors.forEach(doctor => {
        doctorsHTML += `
            <div class="doctor-card">
                <div class="doctor-image">
                    <i class="fas fa-user-md"></i>
                    <div class="online-status ${doctor.online ? 'online' : 'offline'}"></div>
                </div>
                <div class="doctor-info">
                    <h3>${doctor.name}</h3>
                    <p class="speciality">${doctor.speciality}</p>
                    <p class="experience">${doctor.experience} experience</p>
                    <div class="rating">
                        ${generateStarRating(doctor.rating)}
                        <span>${doctor.rating} (${doctor.reviews} reviews)</span>
                    </div>
                    <div class="hospital">
                        <i class="fas fa-hospital"></i>
                        ${doctor.hospital}
                    </div>
                    <div class="fees">
                        <strong>Consultation: ${doctor.fees}</strong>
                    </div>
                </div>
                <div class="doctor-actions">
                    <button class="btn-primary book-consultation">
                        <i class="fas fa-video"></i>
                        Video Consult
                    </button>
                    <button class="btn-outline book-appointment">
                        <i class="fas fa-calendar-check"></i>
                        Clinic Visit
                    </button>
                </div>
                <div class="availability">
                    <span class="${doctor.available ? 'available' : 'not-available'}">
                        ${doctor.available ? 'Available Today' : 'Not Available'}
                    </span>
                </div>
            </div>
        `;
    });
    
    doctorsGrid.innerHTML = doctorsHTML;
    
    // Re-attach event listeners to new buttons
    attachDoctorCardEvents();
}

// Generate Star Rating HTML
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Back to Specialties
document.querySelector('.back-to-specialties').addEventListener('click', showAllSpecialties);

function showAllSpecialties() {
    document.getElementById('filteredDoctors').style.display = 'none';
    document.querySelectorAll('.specialty-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Scroll back to specialties
    document.querySelector('.specialties-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Attach events to doctor cards
function attachDoctorCardEvents() {
    document.querySelectorAll('.book-consultation').forEach(button => {
        button.addEventListener('click', function() {
            const doctorName = this.closest('.doctor-card').querySelector('h3').textContent;
            const fees = this.closest('.doctor-card').querySelector('.fees strong').textContent;
            alert(`Booking Video Consultation with ${doctorName}\n${fees}\nRedirecting to payment...`);
        });
    });

    document.querySelectorAll('.book-appointment').forEach(button => {
        button.addEventListener('click', function() {
            const doctorName = this.closest('.doctor-card').querySelector('h3').textContent;
            const hospital = this.closest('.doctor-card').querySelector('.hospital').textContent;
            alert(`Booking Clinic Appointment with ${doctorName}\nAt: ${hospital}\nSelecting time slot...`);
        });
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Specialization Filter System Loaded');
    attachDoctorCardEvents();
});