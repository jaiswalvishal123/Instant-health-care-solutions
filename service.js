// Services Data
const servicesData = [
    {
        id: 1,
        title: "Online Consultation",
        category: "consultation",
        icon: "fas fa-video",
        description: "Connect with top doctors via video call from the comfort of your home. 24/7 available.",
        price: "Starting at ₹199",
        duration: "15-30 mins",
        features: [
            "Instant video call",
            "Digital prescription",
            "500+ specialist doctors",
            "24/7 availability"
        ]
    },
    {
        id: 2,
        title: "Medicine Delivery",
        category: "wellness",
        icon: "fas fa-pills",
        description: "Get genuine medicines delivered to your doorstep within 2 hours. All brands available.",
        price: "Free delivery",
        duration: "2 hours",
        features: [
            "2-hour delivery",
            "Genuine medicines",
            "Cash on delivery",
            "Prescription required"
        ]
    },
    {
        id: 3,
        title: "Lab Tests at Home",
        category: "diagnostic",
        icon: "fas fa-flask",
        description: "Book diagnostic tests from certified labs. Home sample collection available with accurate reports.",
        price: "Upto 70% off",
        duration: "24 hours",
        features: [
            "Home sample collection",
            "Accurate reports",
            "2000+ tests available",
            "Digital reports"
        ]
    },
    {
        id: 4,
        title: "Emergency Care",
        category: "emergency",
        icon: "fas fa-ambulance",
        description: "24/7 emergency medical services with ambulance, ICU, and critical care facilities.",
        price: "Immediate care",
        duration: "24/7",
        features: [
            "24/7 ambulance",
            "ICU facilities",
            "Emergency doctors",
            "Critical care"
        ]
    },
    {
        id: 5,
        title: "Surgery Care",
        category: "surgery",
        icon: "fas fa-procedures",
        description: "Advanced surgical procedures with experienced surgeons and modern equipment.",
        price: "EMI available",
        duration: "Varies",
        features: [
            "Expert surgeons",
            "Advanced equipment",
            "Post-op care",
            "Insurance support"
        ]
    },
    {
        id: 6,
        title: "Health Checkup",
        category: "diagnostic",
        icon: "fas fa-stethoscope",
        description: "Comprehensive health packages with complete body checkup and doctor consultation.",
        price: "Starting at ₹999",
        duration: "2-3 hours",
        features: [
            "Complete body checkup",
            "Doctor consultation",
            "Detailed report",
            "Diet planning"
        ]
    },
    {
        id: 7,
        title: "Mental Health",
        category: "consultation",
        icon: "fas fa-brain",
        description: "Professional mental health support with certified psychologists and therapists.",
        price: "Starting at ₹499",
        duration: "45-60 mins",
        features: [
            "Certified psychologists",
            "Confidential sessions",
            "Therapy programs",
            "Support groups"
        ]
    },
    {
        id: 8,
        title: "Dental Care",
        category: "surgery",
        icon: "fas fa-tooth",
        description: "Complete dental care services including cleaning, filling, and advanced procedures.",
        price: "Starting at ₹299",
        duration: "30-60 mins",
        features: [
            "Teeth cleaning",
            "Root canal",
            "Dental implants",
            "Painless treatment"
        ]
    }
];

// DOM Elements
let currentService = null;

// Initialize Page
document.addEventListener('DOMContentLoaded', function() {
    loadServices('all');
    setupEventListeners();
    console.log('Services page loaded successfully');
});

// Load Services based on category
function loadServices(category) {
    const servicesGrid = document.getElementById('servicesGrid');
    const filteredServices = category === 'all' 
        ? servicesData 
        : servicesData.filter(service => service.category === category);

    servicesGrid.innerHTML = '';

    if (filteredServices.length === 0) {
        servicesGrid.innerHTML = `
            <div class="no-services">
                <i class="fas fa-search"></i>
                <h3>No services found</h3>
                <p>Try selecting a different category or search term</p>
            </div>
        `;
        return;
    }

    filteredServices.forEach(service => {
        const serviceCard = createServiceCard(service);
        servicesGrid.appendChild(serviceCard);
    });
}

// Create Service Card HTML
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.innerHTML = `
        <div class="service-header">
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h3>${service.title}</h3>
            <span class="service-category">${service.category}</span>
        </div>
        <div class="service-body">
            <p class="service-description">${service.description}</p>
            
            <ul class="service-features">
                ${service.features.map(feature => `
                    <li><i class="fas fa-check"></i> ${feature}</li>
                `).join('')}
            </ul>
            
            <div class="service-price">${service.price}</div>
            <div class="service-duration"><i class="fas fa-clock"></i> ${service.duration}</div>
            
            <div class="service-actions">
                <button class="btn-primary" onclick="bookService(${service.id})">
                    <i class="fas fa-calendar-check"></i>
                    Book Now
                </button>
                <button class="btn-outline" onclick="viewServiceDetails(${service.id})">
                    <i class="fas fa-info-circle"></i>
                    Details
                </button>
            </div>
        </div>
    `;
    return card;
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            loadServices(category);
        });
    });

    // Search functionality
    document.getElementById('serviceSearch').addEventListener('input', function(e) {
        searchServices();
    });

    // Booking form submission
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        confirmBooking();
    });

    // Emergency button
    document.querySelector('.emergency-btn').addEventListener('click', function() {
        if (confirm('🚑 Emergency Helpline: 108\nCall emergency services?')) {
            window.location.href = 'tel:108';
        }
    });

    // Mobile menu
    document.querySelector('.hamburger').addEventListener('click', function() {
        document.querySelector('.nav-menu').classList.toggle('active');
    });
}

// Search Services
function searchServices() {
    const searchTerm = document.getElementById('serviceSearch').value.toLowerCase();
    const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-category');
    
    const filteredServices = servicesData.filter(service => {
        const matchesSearch = service.title.toLowerCase().includes(searchTerm) ||
                            service.description.toLowerCase().includes(searchTerm) ||
                            service.features.some(feature => feature.toLowerCase().includes(searchTerm));
        const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const servicesGrid = document.getElementById('servicesGrid');
    servicesGrid.innerHTML = '';

    if (filteredServices.length === 0) {
        servicesGrid.innerHTML = `
            <div class="no-services">
                <i class="fas fa-search"></i>
                <h3>No services found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }

    filteredServices.forEach(service => {
        const serviceCard = createServiceCard(service);
        servicesGrid.appendChild(serviceCard);
    });
}

// Book Service
function bookService(serviceId) {
    currentService = servicesData.find(service => service.id === serviceId);
    
    if (!currentService) return;

    // Update modal title and service info
    document.getElementById('modalTitle').textContent = `Book ${currentService.title}`;
    
    document.getElementById('serviceInfo').innerHTML = `
        <h4>${currentService.title}</h4>
        <div class="service-price-large">${currentService.price}</div>
        <p>${currentService.description}</p>
        <p><strong>Duration:</strong> ${currentService.duration}</p>
    `;

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').min = today;

    // Open modal
    document.getElementById('bookingModal').style.display = 'block';
}

// View Service Details
function viewServiceDetails(serviceId) {
    const service = servicesData.find(s => s.id === serviceId);
    
    if (!service) return;

    const detailsHTML = `
        <h3>${service.title}</h3>
        <div class="service-price-large">${service.price}</div>
        <p><strong>Category:</strong> ${service.category}</p>
        <p><strong>Duration:</strong> ${service.duration}</p>
        <p>${service.description}</p>
        
        <h4 style="margin-top: 1rem;">Features:</h4>
        <ul class="service-features">
            ${service.features.map(feature => `
                <li><i class="fas fa-check"></i> ${feature}</li>
            `).join('')}
        </ul>
        
        <div style="margin-top: 1.5rem;">
            <button class="btn-primary" onclick="bookService(${service.id}); closeServiceDetails();">
                <i class="fas fa-calendar-check"></i>
                Book This Service
            </button>
        </div>
    `;

    // You can implement a details modal here
    alert(`Service Details:\n\n${service.title}\n\n${service.description}\n\nPrice: ${service.price}\nDuration: ${service.duration}`);
}

// Confirm Booking
function confirmBooking() {
    const formData = {
        service: currentService.title,
        patientName: document.getElementById('patientName').value,
        patientPhone: document.getElementById('patientPhone').value,
        patientEmail: document.getElementById('patientEmail').value,
        appointmentDate: document.getElementById('appointmentDate').value,
        appointmentTime: document.getElementById('appointmentTime').value,
        symptoms: document.getElementById('symptoms').value,
        bookingId: 'BK' + Date.now(),
        bookingTime: new Date().toLocaleString()
    };

    // Save to localStorage (simulating database)
    const existingBookings = JSON.parse(localStorage.getItem('quickcare_bookings') || '[]');
    existingBookings.push(formData);
    localStorage.setItem('quickcare_bookings', JSON.stringify(existingBookings));

    // Show success modal
    showSuccessModal(formData);
}

// Show Success Modal
function showSuccessModal(bookingData) {
    document.getElementById('bookingModal').style.display = 'none';
    
    document.getElementById('successMessage').textContent = 
        `Thank you ${bookingData.patientName}! Your ${bookingData.service} has been scheduled successfully.`;
    
    document.getElementById('bookingDetails').innerHTML = `
        <p><strong>Booking ID:</strong> ${bookingData.bookingId}</p>
        <p><strong>Service:</strong> ${bookingData.service}</p>
        <p><strong>Date & Time:</strong> ${bookingData.appointmentDate} at ${bookingData.appointmentTime}</p>
        <p><strong>Contact:</strong> ${bookingData.patientPhone}</p>
    `;

    document.getElementById('successModal').style.display = 'block';

    // Reset form
    document.getElementById('bookingForm').reset();
}

// Close Modals
function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
    currentService = null;
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

function closeServiceDetails() {
    // Implement if you add a details modal
}

// View All Bookings (for testing)
function viewAllBookings() {
    const bookings = JSON.parse(localStorage.getItem('quickcare_bookings') || '[]');
    console.log('All Bookings:', bookings);
    alert(`Total Bookings: ${bookings.length}\nCheck console for details.`);
}