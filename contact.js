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

// Initialize Map
function initMap() {
    // Delhi coordinates (you can change this to your location)
    const quickcareLocation = [28.6139, 77.2090];
    
    // Create map
    const map = L.map('map').setView(quickcareLocation, 15);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add marker
    const marker = L.marker(quickcareLocation).addTo(map);
    marker.bindPopup(`
        <div style="text-align: center;">
            <h3 style="margin: 0 0 10px 0; color: #667eea;">QuickCare Healthcare</h3>
            <p style="margin: 0;">123 Healthcare Street<br>Medical District, Delhi</p>
            <button onclick="getDirections()" style="background: #667eea; color: white; border: none; padding: 8px 15px; border-radius: 5px; margin-top: 10px; cursor: pointer;">
                Get Directions
            </button>
        </div>
    `).openPopup();
    
    // Add circle around location
    L.circle(quickcareLocation, {
        color: '#667eea',
        fillColor: '#667eea',
        fillOpacity: 0.1,
        radius: 500
    }).addTo(map);
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.subject || !formData.message) {
        alert('Please fill all required fields');
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call (replace with actual backend)
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // For demo purposes, we'll simulate success
        setTimeout(() => {
            contactForm.innerHTML = `
                <div class="success-message" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: #27ae60; margin-bottom: 1rem;"></i>
                    <h3 style="color: #2c3e50; margin-bottom: 1rem;">Message Sent Successfully!</h3>
                    <p style="color: #7f8c8d; margin-bottom: 2rem;">Thank you ${formData.firstName}! We'll get back to you within 24 hours.</p>
                    <button class="btn-primary" onclick="location.reload()">Send Another Message</button>
                </div>
            `;
        }, 2000);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to send message. Please try again.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Emergency Button
document.querySelector('.btn-emergency').addEventListener('click', () => {
    if (confirm('🚑 Call Emergency Services: 108\nAre you sure you want to call?')) {
        window.location.href = 'tel:108';
    }
});

// Get Directions Function
function getDirections() {
    const destination = '28.6139,77.2090'; // Your coordinates
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
        window.open(`https://maps.google.com/maps?daddr=${destination}`);
    } else {
        window.open(`https://www.google.com/maps/dir//${destination}`);
    }
}

// Get Directions Button
document.querySelector('.btn-secondary').addEventListener('click', getDirections);

// Emergency Button in Navbar
document.querySelector('.emergency-btn').addEventListener('click', () => {
    if (confirm('🚑 Emergency Helpline: 108\nCall emergency services?')) {
        window.location.href = 'tel:108';
    }
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    console.log('Contact page loaded successfully');
});