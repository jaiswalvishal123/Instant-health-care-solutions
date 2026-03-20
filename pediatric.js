// pediatric.js - Complete Working Pediatric Care JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('Pediatric Care Page Loading...');
    initializePediatricApp();
    loadPediatricians();
    setupPediatricEventListeners();
    initializeVaccinationTabs();
    initializeGrowthChart();
    addResetButton();
});

// Global Variables for Pediatric Care
let selectedSymptoms = [];
let selectedSeverity = '';
let selectedPediatrician = null;
let selectedConsultationType = null;
let selectedTimeSlot = null;
let currentStep = 1;
let growthChart = null;

// Initialize Pediatric Application
function initializePediatricApp() {
    console.log('QuickCare Pediatric initialized');
    setMinDateForBooking();
    initializeSymptomsChecker();
    
    // Initialize all interactive elements
    initializeAllComponents();
}

// Initialize All Components
function initializeAllComponents() {
    // Initialize symptom options
    const symptomOptions = document.querySelectorAll('.symptom-option');
    symptomOptions.forEach(option => {
        option.addEventListener('click', function() {
            toggleSymptomSelection(this);
        });
    });

    // Initialize severity options
    const severityRadios = document.querySelectorAll('input[name="severity"]');
    severityRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            selectedSeverity = this.value;
            console.log('Selected severity:', selectedSeverity);
        });
    });

    // Initialize vaccination tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.textContent.toLowerCase().replace(' ', '-');
            openVaccinationTab(tabName);
        });
    });

    console.log('All pediatric components initialized');
}

// Setup Pediatric Event Listeners
function setupPediatricEventListeners() {
    // Filter pediatricians
    const specializationFilter = document.getElementById('specializationFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    
    if (specializationFilter) {
        specializationFilter.addEventListener('change', filterPediatricians);
    }
    
    if (experienceFilter) {
        experienceFilter.addEventListener('change', filterPediatricians);
    }

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Emergency button
    const emergencyBtn = document.querySelector('.emergency-btn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', openPediatricEmergency);
    }

    console.log('All event listeners setup successfully');
}

// Initialize Symptoms Checker
function initializeSymptomsChecker() {
    console.log('Initializing Pediatric Symptoms Checker...');
    
    // Symptom selection is already initialized in initializeAllComponents()
    
    // Form elements event listeners
    const symptomDuration = document.getElementById('symptomDuration');
    const feverTemperature = document.getElementById('feverTemperature');
    const additionalInfo = document.getElementById('additionalInfo');
    
    if (symptomDuration) {
        symptomDuration.addEventListener('change', function() {
            console.log('Symptom duration:', this.value);
        });
    }
    
    if (feverTemperature) {
        feverTemperature.addEventListener('change', function() {
            console.log('Fever temperature:', this.value);
        });
    }
    
    if (additionalInfo) {
        additionalInfo.addEventListener('input', function() {
            if (this.value.length > 0) {
                console.log('Additional info entered');
            }
        });
    }
}

// Toggle Symptom Selection - FIXED
function toggleSymptomSelection(element) {
    if (!element) {
        console.error('Symptom element not found');
        return;
    }

    const symptom = element.getAttribute('data-symptom');
    if (!symptom) {
        console.error('No symptom data found on element');
        return;
    }

    const index = selectedSymptoms.indexOf(symptom);
    
    if (index === -1) {
        // Add symptom
        selectedSymptoms.push(symptom);
        element.classList.add('active');
        element.style.backgroundColor = '#4CAF50';
        element.style.color = 'white';
        element.style.borderColor = '#4CAF50';
        element.style.transform = 'translateY(-5px) scale(1.05)';
    } else {
        // Remove symptom
        selectedSymptoms.splice(index, 1);
        element.classList.remove('active');
        element.style.backgroundColor = '#f8f9fa';
        element.style.color = '#333';
        element.style.borderColor = '#e1e5e9';
        element.style.transform = 'translateY(0) scale(1)';
    }
    
    console.log('Selected symptoms:', selectedSymptoms);
    updateSymptomCounter();
}

// Update Symptom Counter - FIXED
function updateSymptomCounter() {
    let symptomCounter = document.getElementById('symptomCounter');
    
    if (!symptomCounter) {
        symptomCounter = createSymptomCounter();
    }
    
    symptomCounter.textContent = `Selected Symptoms: ${selectedSymptoms.length}`;
    symptomCounter.style.display = selectedSymptoms.length > 0 ? 'block' : 'none';
}

// Create Symptom Counter - FIXED
function createSymptomCounter() {
    const counter = document.createElement('div');
    counter.id = 'symptomCounter';
    counter.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 10px 15px;
        border-radius: 20px;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        display: none;
    `;
    document.body.appendChild(counter);
    return counter;
}

// Analyze Child Symptoms - FIXED
function analyzeChildSymptoms() {
    console.log('Analyzing child symptoms...');
    
    const childAge = document.getElementById('childAge')?.value;
    const childWeight = document.getElementById('childWeight')?.value;
    const duration = document.getElementById('symptomDuration')?.value;
    const feverTemp = document.getElementById('feverTemperature')?.value;
    const additionalInfo = document.getElementById('additionalInfo')?.value;

    // Debug log
    console.log('Form data:', {
        age: childAge,
        weight: childWeight,
        symptoms: selectedSymptoms,
        severity: selectedSeverity,
        duration: duration,
        feverTemp: feverTemp,
        additionalInfo: additionalInfo
    });

    // Enhanced Validation
    let validationErrors = [];
    
    if (!childAge || childAge === '') {
        validationErrors.push('Please enter child\'s age');
    } else if (childAge < 0 || childAge > 18) {
        validationErrors.push('Please enter a valid age between 0-18 years');
    }
    
    if (selectedSymptoms.length === 0) {
        validationErrors.push('Please select at least one symptom');
    }
    
    if (!selectedSeverity) {
        validationErrors.push('Please select symptom severity');
    }
    
    if (!duration) {
        validationErrors.push('Please select symptom duration');
    }
    
    if (validationErrors.length > 0) {
        showAlert(validationErrors.join('<br>'), 'medium');
        return;
    }

    // Show loading state
    const analyzeBtn = document.querySelector('.btn-primary.btn-large');
    if (analyzeBtn) {
        const originalText = analyzeBtn.innerHTML;
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        analyzeBtn.disabled = true;

        // Simulate analysis process
        setTimeout(() => {
            // Analyze risk level
            const riskLevel = calculateChildRisk(childAge, selectedSymptoms, selectedSeverity, duration, feverTemp);
            
            // Show analysis result
            showChildRiskAnalysis(riskLevel, childAge, selectedSymptoms, selectedSeverity, duration, feverTemp);
            
            // Reset button
            analyzeBtn.innerHTML = originalText;
            analyzeBtn.disabled = false;
        }, 2000);
    }
}

// Calculate Child Risk Level - FIXED
function calculateChildRisk(age, symptoms, severity, duration, feverTemp) {
    console.log('Calculating child risk with:', { age, symptoms, severity, duration, feverTemp });
    
    let riskScore = 0;
    
    // Age factor (younger children are higher risk)
    const childAge = parseInt(age);
    if (childAge < 1) riskScore += 3; // Under 1 year
    else if (childAge < 3) riskScore += 2; // 1-3 years
    else if (childAge < 6) riskScore += 1; // 3-6 years
    
    // Symptom scoring
    const symptomScores = {
        'fever': { base: 2, high: 4 },
        'cough': { base: 1, severe: 2 },
        'cold': { base: 1, severe: 1 },
        'vomiting': { base: 2, persistent: 3 },
        'diarrhea': { base: 2, persistent: 3 },
        'rash': { base: 1, widespread: 2 },
        'ear-pain': { base: 1, severe: 2 },
        'poor-feeding': { base: 2, severe: 3 }
    };
    
    symptoms.forEach(symptom => {
        const score = symptomScores[symptom] ? symptomScores[symptom].base : 1;
        riskScore += score;
    });
    
    // Fever temperature multiplier
    if (feverTemp === 'high') riskScore += 3;
    else if (feverTemp === 'moderate') riskScore += 2;
    else if (feverTemp === 'mild') riskScore += 1;
    
    // Severity multiplier
    const severityMultipliers = {
        'mild': 1,
        'moderate': 1.5,
        'severe': 2
    };
    
    riskScore *= severityMultipliers[severity] || 1;
    
    // Duration factor
    if (duration === 'hours') riskScore *= 1.5;
    else if (duration === 'days-1') riskScore *= 1.2;
    
    console.log('Final risk score:', riskScore);
    
    // Risk determination
    if (riskScore >= 10) return 'critical';
    if (riskScore >= 7) return 'high';
    if (riskScore >= 4) return 'medium';
    return 'low';
}

// Show Child Risk Analysis - FIXED
function showChildRiskAnalysis(riskLevel, age, symptoms, severity, duration, feverTemp) {
    console.log('Showing child risk analysis:', riskLevel);
    
    const analysisResults = {
        'critical': {
            title: '🚨 CRITICAL - EMERGENCY CARE NEEDED 🚨',
            type: 'critical',
            message: 'IMMEDIATE MEDICAL ATTENTION REQUIRED!',
            recommendation: 'Your child shows symptoms that require urgent medical care. Please go to the nearest pediatric emergency or call emergency services immediately.',
            actions: ['Call Emergency', 'Find Nearest Hospital'],
            autoEmergency: true
        },
        'high': {
            title: '⚠️ HIGH RISK - URGENT CONSULTATION',
            type: 'high',
            message: 'Same-day pediatric consultation recommended',
            recommendation: 'Your child needs to see a pediatrician today. Book an urgent consultation or visit a pediatric clinic.',
            actions: ['Book Urgent Consult', 'View Pediatricians'],
            autoEmergency: false
        },
        'medium': {
            title: '🔶 MODERATE RISK - CONSULT SOON',
            type: 'medium',
            message: 'Schedule pediatric appointment within 24-48 hours',
            recommendation: 'Your child should be evaluated by a pediatrician soon. Monitor symptoms closely and seek care if they worsen.',
            actions: ['Book Consultation', 'Home Care Tips'],
            autoEmergency: false
        },
        'low': {
            title: '✅ LOW RISK - MONITOR AT HOME',
            type: 'low',
            message: 'Home care with monitoring recommended',
            recommendation: 'Your child\'s symptoms appear mild. Continue monitoring and consult if symptoms persist or worsen.',
            actions: ['Home Care Guide', 'Preventive Tips'],
            autoEmergency: false
        }
    };
    
    const result = analysisResults[riskLevel] || analysisResults['low'];
    
    // Create detailed analysis display
    const symptomNames = symptoms.map(s => {
        const names = {
            'fever': 'Fever',
            'cough': 'Cough',
            'cold': 'Cold & Runny Nose',
            'vomiting': 'Vomiting',
            'diarrhea': 'Diarrhea',
            'rash': 'Skin Rash',
            'ear-pain': 'Ear Pain',
            'poor-feeding': 'Poor Feeding'
        };
        return names[s] || s;
    }).join(', ');
    
    const feverNames = {
        'normal': 'Normal',
        'mild': 'Mild Fever (99-100.4°F)',
        'moderate': 'Moderate Fever (100.5-102°F)',
        'high': 'High Fever (Above 102°F)'
    };
    
    const severityNames = {
        'mild': 'Mild (Playing normally)',
        'moderate': 'Moderate (Less active)',
        'severe': 'Severe (Very irritable)'
    };
    
    const detailedHTML = `
        <div class="risk-analysis-result ${result.type}">
            <div class="risk-header">
                <h3>${result.title}</h3>
                <p><strong>Child's Age:</strong> ${age} years</p>
                <p><strong>${result.message}</strong></p>
            </div>
            
            <div class="risk-details">
                <h4>Assessment Details:</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Symptoms:</strong> ${symptomNames}
                    </div>
                    <div class="detail-item">
                        <strong>Severity:</strong> ${severityNames[severity] || severity}
                    </div>
                    <div class="detail-item">
                        <strong>Duration:</strong> ${duration.replace('-', ' ')}
                    </div>
                    <div class="detail-item">
                        <strong>Fever:</strong> ${feverNames[feverTemp] || 'Not specified'}
                    </div>
                </div>
            </div>
            
            <div class="recommendation">
                <h4>Pediatric Recommendation:</h4>
                <p>${result.recommendation}</p>
            </div>
            
            <div class="risk-actions">
                ${result.actions.map(action => 
                    `<button class="action-btn ${result.type}" onclick="handleChildRiskAction('${result.type}', '${action}')">
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
            openPediatricEmergency();
        }, 1500);
    }
}

// Handle Child Risk Actions - FIXED
function handleChildRiskAction(riskLevel, action) {
    console.log('Handling risk action:', action);
    
    switch(action) {
        case 'Call Emergency':
            callPediatricEmergency();
            break;
        case 'Find Nearest Hospital':
            findNearestHospital();
            break;
        case 'Book Urgent Consult':
        case 'Book Consultation':
            scrollToConsultation();
            break;
        case 'View Pediatricians':
            const pediatriciansSection = document.querySelector('.pediatricians-section');
            if (pediatriciansSection) {
                pediatriciansSection.scrollIntoView({ behavior: 'smooth' });
            }
            break;
        case 'Home Care Tips':
            showChildHomeCareTips();
            break;
        case 'Home Care Guide':
            showChildHomeCareGuide();
            break;
        case 'Preventive Tips':
            showChildPreventiveTips();
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// Find Nearest Hospital - NEW FUNCTION
function findNearestHospital() {
    showAlert('📍 Finding nearest pediatric hospitals...', 'high', 3000);
    
    // Simulate hospital search
    setTimeout(() => {
        const hospitals = [
            { name: 'Apollo Children\'s Hospital', distance: '2.3 km', time: '8 mins' },
            { name: 'Fortis Pediatric Center', distance: '3.1 km', time: '12 mins' },
            { name: 'Max Super Specialty', distance: '4.2 km', time: '15 mins' }
        ];
        
        const hospitalList = hospitals.map(h => 
            `<div style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.2);">
                <strong>${h.name}</strong><br>
                📍 ${h.distance} • ⏱️ ${h.time}
            </div>`
        ).join('');
        
        showDetailedAlert(`
            <h3>🏥 Nearest Pediatric Hospitals</h3>
            ${hospitalList}
            <p style="margin-top: 15px; font-size: 0.9em;">
                <em>Call ahead to confirm availability and emergency services</em>
            </p>
        `, 'high', 10000);
    }, 1500);
}

// Show Child Home Care Tips - NEW FUNCTION
function showChildHomeCareTips() {
    const tips = `
        <div class="home-care-tips">
            <h3>👶 Child Home Care Tips</h3>
            <div class="tips-list">
                <div class="tip-item">
                    <strong>Fever Management:</strong> Keep child hydrated, use lukewarm sponge baths
                </div>
                <div class="tip-item">
                    <strong>Comfort:</strong> Ensure rest, comfortable clothing, and quiet environment
                </div>
                <div class="tip-item">
                    <strong>Hydration:</strong> Offer small, frequent sips of water or ORS
                </div>
                <div class="tip-item">
                    <strong>Nutrition:</strong> Light, easy-to-digest foods like khichdi, soups
                </div>
                <div class="tip-item">
                    <strong>Monitoring:</strong> Check temperature every 4-6 hours
                </div>
            </div>
            <p style="margin-top: 15px; font-style: italic;">
                Contact your pediatrician if symptoms worsen or don't improve in 24 hours.
            </p>
        </div>
    `;
    
    showDetailedAlert(tips, 'medium', 12000);
}

// Show Child Home Care Guide - NEW FUNCTION
function showChildHomeCareGuide() {
    const guide = `
        <div class="home-care-guide">
            <h3>🏠 Complete Home Care Guide</h3>
            <div class="guide-sections">
                <div class="guide-section">
                    <h4>🛌 Rest & Comfort</h4>
                    <ul>
                        <li>Ensure adequate sleep and rest</li>
                        <li>Maintain comfortable room temperature</li>
                        <li>Use humidifier for cough/cold</li>
                    </ul>
                </div>
                <div class="guide-section">
                    <h4>💧 Hydration</h4>
                    <ul>
                        <li>Offer water, ORS, or clear fluids</li>
                        <li>Small frequent sips better than large amounts</li>
                        <li>Watch for signs of dehydration</li>
                    </ul>
                </div>
                <div class="guide-section">
                    <h4>🌡️ Symptom Monitoring</h4>
                    <ul>
                        <li>Check temperature regularly</li>
                        <li>Monitor breathing pattern</li>
                        <li>Watch for behavior changes</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    showDetailedAlert(guide, 'low', 15000);
}

// Show Child Preventive Tips - NEW FUNCTION
function showChildPreventiveTips() {
    const tips = `
        <div class="preventive-tips">
            <h3>💚 Child Health Preventive Tips</h3>
            <div class="tips-list">
                <div class="tip-item">
                    <strong>Balanced Diet:</strong> Fruits, vegetables, whole grains, proteins
                </div>
                <div class="tip-item">
                    <strong>Regular Exercise:</strong> Outdoor play and physical activity
                </div>
                <div class="tip-item">
                    <strong>Adequate Sleep:</strong> 10-12 hours for children, 14-16 for infants
                </div>
                <div class="tip-item">
                    <strong>Hygiene:</strong> Regular hand washing, clean environment
                </div>
                <div class="tip-item">
                    <strong>Vaccination:</strong> Complete immunization schedule
                </div>
                <div class="tip-item">
                    <strong>Regular Check-ups:</strong> Growth monitoring and health assessments
                </div>
            </div>
        </div>
    `;
    
    showDetailedAlert(tips, 'low', 12000);
}

// Vaccination Schedule Functions - FIXED
function initializeVaccinationTabs() {
    // Show first tab by default
    const firstTab = document.querySelector('.tab-pane');
    if (firstTab) {
        firstTab.classList.add('active');
    }
    
    const firstButton = document.querySelector('.tab-button');
    if (firstButton) {
        firstButton.classList.add('active');
    }
    
    console.log('Vaccination tabs initialized');
}

function openVaccinationTab(tabName) {
    console.log('Opening tab:', tabName);
    
    // Hide all tab panes
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab pane
    const selectedPane = document.getElementById(tabName);
    if (selectedPane) {
        selectedPane.classList.add('active');
    } else {
        console.error('Tab pane not found:', tabName);
    }
    
    // Activate selected button
    const clickedButton = event?.currentTarget;
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}

// Set Vaccination Reminder - NEW FUNCTION
function setVaccinationReminder() {
    const childName = document.getElementById('childName')?.value;
    const nextVaccine = document.getElementById('nextVaccine')?.value;
    
    if (!childName || !nextVaccine) {
        showAlert('Please enter child\'s name and select next vaccine', 'medium');
        return;
    }
    
    const vaccineNames = {
        '6-weeks': '6 Weeks Vaccines',
        '10-weeks': '10 Weeks Vaccines', 
        '14-weeks': '14 Weeks Vaccines',
        '6-months': '6 Months Vaccines',
        '9-months': '9 Months Vaccines'
    };
    
    showAlert(`
        🔔 Reminder Set Successfully!<br><br>
        <strong>Child:</strong> ${childName}<br>
        <strong>Next Vaccine:</strong> ${vaccineNames[nextVaccine]}<br><br>
        We'll remind you 3 days before the due date.
    `, 'low', 5000);
}

// Growth Tracker Functions - FIXED
function initializeGrowthChart() {
    const ctx = document.getElementById('growthChart');
    if (!ctx) {
        console.log('Growth chart canvas not found, skipping initialization');
        return;
    }
    
    try {
        growthChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Birth', '3M', '6M', '9M', '12M', '18M', '2Y', '3Y', '4Y', '5Y'],
                datasets: [{
                    label: 'Weight (kg) - 50th Percentile',
                    data: [3.3, 6.0, 7.8, 9.2, 10.2, 11.8, 12.8, 14.6, 16.3, 18.0],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'WHO Growth Standards - Boys',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Weight (kg)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Age'
                        }
                    }
                }
            }
        });
        console.log('Growth chart initialized successfully');
    } catch (error) {
        console.error('Error initializing growth chart:', error);
    }
}

function analyzeGrowth() {
    const age = document.getElementById('trackerAge')?.value;
    const weight = document.getElementById('trackerWeight')?.value;
    const height = document.getElementById('trackerHeight')?.value;
    
    if (!age || !weight || !height) {
        showAlert('Please enter all required growth details', 'medium');
        return;
    }
    
    // Calculate growth percentiles
    const weightPercentile = calculateWeightPercentile(parseInt(age), parseFloat(weight));
    const heightPercentile = calculateHeightPercentile(parseInt(age), parseFloat(height));
    
    // Display results
    displayGrowthResults(age, weight, height, weightPercentile, heightPercentile);
}

function calculateWeightPercentile(age, weight) {
    // Simplified percentile calculation based on WHO standards
    const standards = {
        0: { p5: 2.5, p50: 3.3, p95: 4.0 },
        6: { p5: 6.0, p50: 7.8, p95: 9.5 },
        12: { p5: 7.8, p50: 10.2, p95: 12.5 },
        24: { p5: 10.5, p50: 12.8, p95: 15.5 }
    };
    
    // Find closest age standard
    const ages = Object.keys(standards).map(Number);
    const closestAge = ages.reduce((prev, curr) => {
        return Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev;
    });
    
    const standard = standards[closestAge];
    if (!standard) return 50;
    
    if (weight <= standard.p5) return 5;
    if (weight <= standard.p50) return 50;
    if (weight <= standard.p95) return 95;
    return 97;
}

function calculateHeightPercentile(age, height) {
    // Simplified height percentile calculation
    const standards = {
        0: { p5: 45, p50: 50, p95: 55 },
        6: { p5: 62, p50: 67, p95: 72 },
        12: { p5: 71, p50: 76, p95: 81 },
        24: { p5: 82, p50: 87, p95: 92 }
    };
    
    const ages = Object.keys(standards).map(Number);
    const closestAge = ages.reduce((prev, curr) => {
        return Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev;
    });
    
    const standard = standards[closestAge];
    if (!standard) return 50;
    
    if (height <= standard.p5) return 5;
    if (height <= standard.p50) return 50;
    if (height <= standard.p95) return 95;
    return 97;
}

function displayGrowthResults(age, weight, height, weightPercentile, heightPercentile) {
    const resultsDiv = document.getElementById('growthResults');
    if (!resultsDiv) {
        console.error('Growth results container not found');
        return;
    }
    
    let weightStatus = 'Normal';
    let weightColor = '#4CAF50';
    if (weightPercentile < 5) {
        weightStatus = 'Underweight';
        weightColor = '#FF9800';
    } else if (weightPercentile > 95) {
        weightStatus = 'Overweight';
        weightColor = '#F44336';
    }
    
    let heightStatus = 'Normal';
    let heightColor = '#4CAF50';
    if (heightPercentile < 5) {
        heightStatus = 'Short Stature';
        heightColor = '#FF9800';
    } else if (heightPercentile > 95) {
        heightStatus = 'Tall Stature';
        heightColor = '#2196F3';
    }
    
    resultsDiv.innerHTML = `
        <div class="growth-results">
            <h3>📊 Growth Analysis Results</h3>
            <div class="result-item">
                <div class="result-metric">
                    <h4>Weight Analysis</h4>
                    <p>${weight} kg</p>
                </div>
                <div class="result-percentile" style="color: ${weightColor}">
                    <strong>${weightPercentile}th Percentile</strong>
                    <div class="status-badge" style="background: ${weightColor}">${weightStatus}</div>
                </div>
            </div>
            
            <div class="result-item">
                <div class="result-metric">
                    <h4>Height Analysis</h4>
                    <p>${height} cm</p>
                </div>
                <div class="result-percentile" style="color: ${heightColor}">
                    <strong>${heightPercentile}th Percentile</strong>
                    <div class="status-badge" style="background: ${heightColor}">${heightStatus}</div>
                </div>
            </div>
            
            <div class="growth-recommendation">
                <h4>👨‍⚕️ Pediatrician's Note:</h4>
                <p>${getGrowthRecommendation(weightStatus, heightStatus)}</p>
            </div>
        </div>
    `;
}

function getGrowthRecommendation(weightStatus, heightStatus) {
    if (weightStatus === 'Underweight' && heightStatus === 'Short Stature') {
        return 'Consult pediatrician for comprehensive growth assessment and nutritional guidance. Focus on calorie-dense foods and regular monitoring.';
    } else if (weightStatus === 'Underweight') {
        return 'Focus on nutrient-dense foods and monitor weight gain. Consider nutritional consultation for dietary planning.';
    } else if (weightStatus === 'Overweight') {
        return 'Promote active play and balanced nutrition. Limit screen time and sugary drinks. Encourage physical activities.';
    } else if (heightStatus === 'Short Stature') {
        return 'Monitor growth pattern. Ensure adequate nutrition and sleep. Consider endocrine evaluation if pattern continues.';
    } else {
        return 'Your child is growing well within expected parameters! Continue with balanced nutrition and regular physical activity.';
    }
}

function showGrowthChart(type) {
    if (!growthChart) {
        console.error('Growth chart not initialized');
        return;
    }
    
    // Update chart based on selected type
    const chartTabs = document.querySelectorAll('.chart-tab');
    chartTabs.forEach(tab => tab.classList.remove('active'));
    
    const clickedTab = event?.currentTarget;
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
    
    // Update chart data based on type
    const chartData = {
        'weight': {
            label: 'Weight (kg) - 50th Percentile',
            data: [3.3, 6.0, 7.8, 9.2, 10.2, 11.8, 12.8, 14.6, 16.3, 18.0],
            color: '#4CAF50'
        },
        'height': {
            label: 'Height (cm) - 50th Percentile', 
            data: [50, 62, 67, 72, 76, 82, 87, 94, 100, 107],
            color: '#2196F3'
        },
        'head': {
            label: 'Head Circumference (cm) - 50th Percentile',
            data: [35, 41, 44, 46, 47, 48, 49, 50, 51, 52],
            color: '#FF9800'
        }
    };
    
    const data = chartData[type] || chartData.weight;
    
    growthChart.data.datasets[0].label = data.label;
    growthChart.data.datasets[0].data = data.data;
    growthChart.data.datasets[0].borderColor = data.color;
    growthChart.data.datasets[0].backgroundColor = data.color + '20';
    
    growthChart.update();
    console.log('Growth chart updated for:', type);
}

// Pediatric Emergency Functions - FIXED
function openPediatricEmergency() {
    showChildEmergencyModal();
}

function callPediatricEmergency() {
    showAlert('📞 Calling Pediatric Emergency: 108 / 102', 'critical', 3000);
    
    // Simulate emergency call process
    setTimeout(() => {
        if (confirm('Connect to nearest pediatric emergency center?')) {
            showAlert('🔄 Connecting to pediatric emergency services...', 'critical', 2000);
            
            // Simulate connection
            setTimeout(() => {
                showDetailedAlert(`
                    <h3>🚑 Emergency Services Connected</h3>
                    <p><strong>Service:</strong> Pediatric Emergency Response</p>
                    <p><strong>Status:</strong> Ambulance dispatched</p>
                    <p><strong>ETA:</strong> 8-12 minutes</p>
                    <br>
                    <p><em>Please stay on the line and follow instructions...</em></p>
                `, 'critical', 8000);
            }, 2000);
        }
    }, 1000);
}

function showChildFirstAid() {
    const firstAidInfo = `
        <div class="child-first-aid">
            <h3>👶 Child Emergency First Aid</h3>
            <div class="first-aid-steps">
                <div class="aid-step">
                    <strong>High Fever:</strong> Sponge with lukewarm water, give prescribed fever medicine
                </div>
                <div class="aid-step">
                    <strong>Breathing Difficulty:</strong> Keep upright position, stay calm
                </div>
                <div class="aid-step">
                    <strong>Choking:</strong> Back blows and chest thrusts for infants
                </div>
                <div class="aid-step">
                    <strong>Burns:</strong> Cool with running water for 20 minutes
                </div>
                <div class="aid-step">
                    <strong>Seizures:</strong> Place on side, clear area, time the seizure
                </div>
                <div class="aid-step">
                    <strong>Allergic Reaction:</strong> Use epinephrine if prescribed, call emergency
                </div>
            </div>
            <p style="margin-top: 15px; font-style: italic; font-size: 0.9em;">
                <strong>Important:</strong> Always seek professional medical help for emergencies. 
                These are temporary measures until help arrives.
            </p>
        </div>
    `;
    
    showDetailedAlert(firstAidInfo, 'critical', 15000);
}

// Load Pediatricians - FIXED
function loadPediatricians() {
    const pediatriciansGrid = document.getElementById('pediatriciansGrid');
    if (!pediatriciansGrid) {
        console.log('Pediatricians grid not found');
        return;
    }
    
    const pediatricians = [
        {
            id: 1,
            name: "Dr. Anjali Sharma",
            specialty: "Pediatrician & Neonatologist",
            experience: 15,
            rating: 4.9,
            specialization: "neonatology",
            availability: "Available Today",
            education: "MD Pediatrics - AIIMS Delhi",
            procedures: 12000
        },
        {
            id: 2,
            name: "Dr. Rajiv Mehta", 
            specialty: "Pediatric Cardiologist",
            experience: 12,
            rating: 4.8,
            specialization: "cardiology",
            availability: "Available Tomorrow",
            education: "DM Pediatric Cardiology - PGI Chandigarh",
            procedures: 3500
        },
        {
            id: 3,
            name: "Dr. Priya Reddy",
            specialty: "Pediatric Neurologist",
            experience: 18,
            rating: 4.9,
            specialization: "neurology", 
            availability: "Available Today",
            education: "DM Pediatric Neurology - NIMHANS",
            procedures: 2800
        },
        {
            id: 4,
            name: "Dr. Sameer Joshi",
            specialty: "Pediatric Dentist",
            experience: 10,
            rating: 4.7,
            specialization: "dentistry",
            availability: "Available Tomorrow", 
            education: "MDS Pediatric Dentistry - Manipal",
            procedures: 5200
        }
    ];
    
    renderPediatricians(pediatricians);
}

function renderPediatricians(pediatricians) {
    const grid = document.getElementById('pediatriciansGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    pediatricians.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'cardiologist-card';
        card.innerHTML = `
            <div class="cardiologist-header">
                <div class="cardiologist-avatar">
                    <i class="fas fa-user-md"></i>
                </div>
                <div class="cardiologist-info">
                    <h3>${doc.name}</h3>
                    <div class="cardiologist-specialty">${doc.specialty}</div>
                </div>
            </div>
            <div class="cardiologist-body">
                <div class="cardiologist-details">
                    <div class="cardiologist-rating">
                        <i class="fas fa-star"></i>
                        <span>${doc.rating}/5</span>
                    </div>
                    <div class="cardiologist-experience">
                        <i class="fas fa-briefcase"></i>
                        ${doc.experience}+ years experience
                    </div>
                    <div class="cardiologist-education">
                        <i class="fas fa-graduation-cap"></i>
                        ${doc.education}
                    </div>
                    <div class="cardiologist-specialization">
                        ${doc.specialization.toUpperCase()}
                    </div>
                </div>
                <div class="cardiologist-availability">
                    <span class="availability-status">${doc.availability}</span>
                </div>
                <div class="cardiologist-actions">
                    <button class="btn-primary" onclick="bookPediatrician(${doc.id})">
                        <i class="fas fa-calendar-check"></i>
                        Book Consultation
                    </button>
                    <button class="btn-outline" onclick="viewPediatricianProfile(${doc.id})">
                        <i class="fas fa-user"></i>
                        Profile
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    
    console.log('Pediatricians loaded:', pediatricians.length);
}

// Filter Pediatricians - FIXED
function filterPediatricians() {
    const specialization = document.getElementById('specializationFilter')?.value || 'all';
    const experience = document.getElementById('experienceFilter')?.value || 'all';
    
    console.log('Filtering pediatricians by:', { specialization, experience });
    
    const cards = document.querySelectorAll('.cardiologist-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        let showCard = true;
        
        // Filter by specialization
        if (specialization !== 'all') {
            const specElement = card.querySelector('.cardiologist-specialization');
            if (specElement) {
                const cardSpecialization = specElement.textContent.toLowerCase();
                if (!cardSpecialization.includes(specialization)) {
                    showCard = false;
                }
            }
        }
        
        // Filter by experience (simplified - in real app would use data attributes)
        if (experience !== 'all') {
            const expElement = card.querySelector('.cardiologist-experience');
            if (expElement) {
                const expText = expElement.textContent;
                const expYears = parseInt(expText);
                if (expYears < parseInt(experience)) {
                    showCard = false;
                }
            }
        }
        
        card.style.display = showCard ? 'block' : 'none';
        if (showCard) visibleCount++;
    });
    
    console.log(`Filtered: ${visibleCount} pediatricians visible`);
}

// Book Pediatrician - NEW FUNCTION
function bookPediatrician(pediatricianId) {
    console.log('Booking pediatrician:', pediatricianId);
    selectedPediatrician = pediatricianId;
    openBookingModal('clinic');
}

// View Pediatrician Profile - NEW FUNCTION  
function viewPediatricianProfile(pediatricianId) {
    showAlert(`Opening profile for pediatrician ID: ${pediatricianId}`, 'medium');
    // In real app, this would open a detailed profile modal
}

// Book Service - NEW FUNCTION
function bookService(serviceType) {
    console.log('Booking service:', serviceType);
    
    const serviceNames = {
        'well-baby-checkup': 'Well-Baby Checkup',
        'vaccination': 'Vaccination Services', 
        'illness-care': 'Childhood Illness Care',
        'development-assessment': 'Development Assessment',
        'pediatric-cardiology': 'Pediatric Cardiology',
        'pediatric-dentistry': 'Pediatric Dentistry'
    };
    
    showAlert(`Booking ${serviceNames[serviceType] || serviceType}...`, 'low');
    scrollToConsultation();
}

// Book Pediatric Consultation - NEW FUNCTION
function bookPediatricConsultation(type) {
    selectedConsultationType = type;
    openBookingModal(type);
}

// Open Booking Modal - NEW FUNCTION
function openBookingModal(type) {
    showAlert(`Opening booking for ${type} consultation...`, 'low');
    // In real app, this would open the booking modal
    scrollToConsultation();
}

// Utility Functions - FIXED
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
    alert.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        padding: 1.5rem 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 3000;
        max-width: 500px;
        animation: slideInRight 0.5s ease;
        color: white;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        cursor: pointer;
    `;
    
    // Add specific background based on type
    const backgrounds = {
        'critical': 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
        'high': 'linear-gradient(135deg, #fd7e14 0%, #e55a00 100%)', 
        'medium': 'linear-gradient(135deg, #ffc107 0%, #e6a100 100%)',
        'low': 'linear-gradient(135deg, #28a745 0%, #218838 100%)'
    };
    
    alert.style.background = backgrounds[type] || backgrounds.medium;
    
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
    alert.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        z-index: 3000;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideInRight 0.5s ease;
        color: white;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        cursor: default;
    `;
    
    const backgrounds = {
        'critical': 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
        'high': 'linear-gradient(135deg, #fd7e14 0%, #e55a00 100%)',
        'medium': 'linear-gradient(135deg, #ffc107 0%, #e6a100 100%)',
        'low': 'linear-gradient(135deg, #28a745 0%, #218838 100%)'
    };
    
    alert.style.background = backgrounds[type] || backgrounds.medium;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 15px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        font-weight: bold;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
    `;
    closeBtn.onclick = function() {
        alert.remove();
    };
    alert.appendChild(closeBtn);
    
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

function resetSymptoms() {
    selectedSymptoms = [];
    selectedSeverity = '';
    
    // Reset UI elements
    const symptomOptions = document.querySelectorAll('.symptom-option');
    symptomOptions.forEach(opt => {
        opt.classList.remove('active');
        opt.style.backgroundColor = '#f8f9fa';
        opt.style.color = '#333';
        opt.style.borderColor = '#e1e5e9';
        opt.style.transform = 'translateY(0) scale(1)';
    });
    
    const severityRadios = document.querySelectorAll('input[name="severity"]');
    severityRadios.forEach(radio => {
        radio.checked = false;
    });
    
    // Reset form fields
    const childAge = document.getElementById('childAge');
    const childWeight = document.getElementById('childWeight');
    const symptomDuration = document.getElementById('symptomDuration');
    const feverTemperature = document.getElementById('feverTemperature');
    const additionalInfo = document.getElementById('additionalInfo');
    
    if (childAge) childAge.value = '';
    if (childWeight) childWeight.value = '';
    if (symptomDuration) symptomDuration.value = '';
    if (feverTemperature) feverTemperature.value = '';
    if (additionalInfo) additionalInfo.value = '';
    
    updateSymptomCounter();
    showAlert('Symptoms form has been reset', 'low');
}

function scrollToConsultation() {
    const section = document.getElementById('consultationSection');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.log('Consultation section not found');
    }
}

function setMinDateForBooking() {
    const today = new Date();
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        dateInput.min = today.toISOString().split('T')[0];
    }
}

function addResetButton() {
    const symptomsForm = document.querySelector('.symptoms-form');
    if (symptomsForm && !document.getElementById('resetSymptomsBtn')) {
        const analyzeBtn = symptomsForm.querySelector('.btn-primary.btn-large');
        if (analyzeBtn) {
            const resetBtn = document.createElement('button');
            resetBtn.type = 'button';
            resetBtn.id = 'resetSymptomsBtn';
            resetBtn.className = 'btn-outline';
            resetBtn.innerHTML = '<i class="fas fa-redo"></i> Reset Form';
            resetBtn.onclick = resetSymptoms;
            resetBtn.style.marginTop = '15px';
            resetBtn.style.width = '100%';
            analyzeBtn.parentNode.insertBefore(resetBtn, analyzeBtn.nextSibling);
        }
    }
}

// Show Child Emergency Modal - NEW FUNCTION
function showChildEmergencyModal() {
    const modalHTML = `
        <div class="emergency-modal-content">
            <div class="emergency-header">
                <i class="fas fa-ambulance"></i>
                <h2>Pediatric Emergency</h2>
            </div>
            <div class="emergency-instructions">
                <h3>🚨 CHILD EMERGENCY PROTOCOL 🚨</h3>
                <div class="instruction-steps">
                    <div class="instruction-step">
                        <span class="step-number">1</span>
                        <p><strong>Call Emergency:</strong> Dial 108 or 102 immediately</p>
                    </div>
                    <div class="instruction-step">
                        <span class="step-number">2</span>
                        <p><strong>Stay Calm:</strong> Keep child comfortable and monitor breathing</p>
                    </div>
                    <div class="instruction-step">
                        <span class="step-number">3</span>
                        <p><strong>Do Not Give Food/Drink:</strong> In case of emergency, avoid oral intake</p>
                    </div>
                    <div class="instruction-step">
                        <span class="step-number">4</span>
                        <p><strong>Gather Information:</strong> Have child's medical history ready</p>
                    </div>
                    <div class="instruction-step">
                        <span class="step-number">5</span>
                        <p><strong>Follow Instructions:</strong> Listen carefully to emergency operator</p>
                    </div>
                </div>
            </div>
            <div class="emergency-actions-modal">
                <button class="btn-emergency-large" onclick="callPediatricEmergency()">
                    <i class="fas fa-phone-alt"></i>
                    Call 108 Now
                </button>
                <button class="btn-outline" onclick="showChildFirstAid()">
                    <i class="fas fa-first-aid"></i>
                    Child First Aid Guide
                </button>
            </div>
        </div>
    `;
    
    showDetailedAlert(modalHTML, 'critical', 0); // 0 duration = won't auto-close
}

// Export all functions to global scope
window.analyzeChildSymptoms = analyzeChildSymptoms;
window.resetSymptoms = resetSymptoms;
window.openVaccinationTab = openVaccinationTab;
window.setVaccinationReminder = setVaccinationReminder;
window.analyzeGrowth = analyzeGrowth;
window.showGrowthChart = showGrowthChart;
window.openPediatricEmergency = openPediatricEmergency;
window.callPediatricEmergency = callPediatricEmergency;
window.showChildFirstAid = showChildFirstAid;
window.bookService = bookService;
window.bookPediatricConsultation = bookPediatricConsultation;
window.bookPediatrician = bookPediatrician;
window.viewPediatricianProfile = viewPediatricianProfile;
window.handleChildRiskAction = handleChildRiskAction;

console.log('Pediatric JavaScript loaded successfully!');





// Pediatric Service Booking Function - CORRECTED & WORKING
function bookService(serviceType) {
    console.log('Booking service initiated for:', serviceType);
    
    // Map service types to consultation types and details
    const serviceDetails = {
        'well-baby-checkup': {
            name: 'Well-Baby Checkup',
            defaultType: 'clinic',
            price: '₹800 - ₹1200',
            description: 'Comprehensive health assessment for infants and children'
        },
        'vaccination': {
            name: 'Vaccination Services',
            defaultType: 'clinic', 
            price: 'Varies by Vaccine',
            description: 'Complete immunization with certified vaccines'
        },
        'illness-care': {
            name: 'Childhood Illness Care',
            defaultType: 'clinic',
            price: '₹1000 - ₹2000',
            description: 'Treatment for common childhood diseases'
        },
        'development-assessment': {
            name: 'Development Assessment',
            defaultType: 'clinic',
            price: '₹1500 - ₹2500',
            description: 'Monitoring developmental milestones'
        },
        'pediatric-cardiology': {
            name: 'Pediatric Cardiology',
            defaultType: 'clinic',
            price: '₹2000 - ₹5000',
            description: 'Heart care for children with cardiac issues'
        },
        'pediatric-dentistry': {
            name: 'Pediatric Dentistry', 
            defaultType: 'clinic',
            price: '₹500 - ₹2000',
            description: 'Dental care specifically for children'
        }
    };

    const service = serviceDetails[serviceType] || {
        name: serviceType.replace('-', ' '),
        defaultType: 'clinic',
        price: 'Contact for Price',
        description: 'Pediatric consultation service'
    };

    // Store the selected service for booking process
    selectedService = serviceType;
    selectedConsultationType = service.defaultType;

    // Show confirmation message
    showAlert(`
        🎯 <strong>${service.name} Selected</strong><br><br>
        💰 <strong>Price:</strong> ${service.price}<br>
        📋 <strong>Description:</strong> ${service.description}<br><br>
        Opening booking system...
    `, 'low', 4000);

    // Open the booking modal
    setTimeout(() => {
        openBookingModal(service.defaultType);
        
        // Update modal title with service name
        const modalTitle = document.querySelector('#bookingModal h2');
        if (modalTitle) {
            modalTitle.innerHTML = `Book ${service.name}`;
        }
    }, 1500);

    console.log('Service booking flow completed for:', serviceType);
}

// Initialize Service Booking Buttons - Add this to your DOMContentLoaded event
function initializeServiceBooking() {
    console.log('Initializing service booking buttons...');
    
    // Add event listeners to all service booking buttons
    const serviceButtons = document.querySelectorAll('[onclick*="bookService"]');
    serviceButtons.forEach(button => {
        const originalOnClick = button.getAttribute('onclick');
        const serviceTypeMatch = originalOnClick.match(/bookService\('([^']+)'\)/);
        
        if (serviceTypeMatch) {
            const serviceType = serviceTypeMatch[1];
            button.removeAttribute('onclick');
            button.addEventListener('click', function() {
                bookService(serviceType);
            });
            console.log('Button initialized for service:', serviceType);
        }
    });
}

// Enhanced Booking Modal Function
function openBookingModal(consultationType) {
    console.log('Opening booking modal for:', consultationType);
    
    // Get the modal element
    const modal = document.getElementById('bookingModal');
    if (!modal) {
        console.error('Booking modal not found! Creating fallback...');
        showAlert('Booking system is loading... Please try again in a moment.', 'medium');
        return;
    }
    
    // Set the consultation type
    if (consultationType) {
        selectedConsultationType = consultationType;
        
        // Auto-select the consultation type in modal if it exists
        const typeElement = document.getElementById(`type${consultationType.charAt(0).toUpperCase() + consultationType.slice(1)}`);
        if (typeElement) {
            // Remove active class from all types
            document.querySelectorAll('.type-option').forEach(opt => {
                opt.classList.remove('active');
            });
            // Add active class to selected type
            typeElement.classList.add('active');
        }
    }
    
    // Show the modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Reset to first step
    goToStep(1);
    
    console.log('Booking modal opened successfully');
}

// Close Modal Function
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Step Navigation Function
function goToStep(stepNumber) {
    // Hide all steps
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => step.classList.remove('active'));
    
    // Show target step
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
        currentStep = stepNumber;
    }
// Pediatric Service Booking Function - CORRECTED & WORKING
function bookService(serviceType) {
    console.log('Booking service initiated for:', serviceType);
    
    // Map service types to consultation types and details
    const serviceDetails = {
        'well-baby-checkup': {
            name: 'Well-Baby Checkup',
            defaultType: 'clinic',
            price: '₹800 - ₹1200',
            description: 'Comprehensive health assessment for infants and children'
        },
        'vaccination': {
            name: 'Vaccination Services',
            defaultType: 'clinic', 
            price: 'Varies by Vaccine',
            description: 'Complete immunization with certified vaccines'
        },
        'illness-care': {
            name: 'Childhood Illness Care',
            defaultType: 'clinic',
            price: '₹1000 - ₹2000',
            description: 'Treatment for common childhood diseases'
        },
        'development-assessment': {
            name: 'Development Assessment',
            defaultType: 'clinic',
            price: '₹1500 - ₹2500',
            description: 'Monitoring developmental milestones'
        },
        'pediatric-cardiology': {
            name: 'Pediatric Cardiology',
            defaultType: 'clinic',
            price: '₹2000 - ₹5000',
            description: 'Heart care for children with cardiac issues'
        },
        'pediatric-dentistry': {
            name: 'Pediatric Dentistry', 
            defaultType: 'clinic',
            price: '₹500 - ₹2000',
            description: 'Dental care specifically for children'
        }
    };

    const service = serviceDetails[serviceType] || {
        name: serviceType.replace('-', ' '),
        defaultType: 'clinic',
        price: 'Contact for Price',
        description: 'Pediatric consultation service'
    };

    // Store the selected service for booking process
    selectedService = serviceType;
    selectedConsultationType = service.defaultType;

    // Show confirmation message
    showAlert(`
        🎯 <strong>${service.name} Selected</strong><br><br>
        💰 <strong>Price:</strong> ${service.price}<br>
        📋 <strong>Description:</strong> ${service.description}<br><br>
        Opening booking system...
    `, 'low', 4000);

    // Open the booking modal
    setTimeout(() => {
        openBookingModal(service.defaultType);
        
        // Update modal title with service name
        const modalTitle = document.querySelector('#bookingModal h2');
        if (modalTitle) {
            modalTitle.innerHTML = `Book ${service.name}`;
        }
    }, 1500);

    console.log('Service booking flow completed for:', serviceType);
}

// Initialize Service Booking Buttons - Add this to your DOMContentLoaded event
function initializeServiceBooking() {
    console.log('Initializing service booking buttons...');
    
    // Add event listeners to all service booking buttons
    const serviceButtons = document.querySelectorAll('[onclick*="bookService"]');
    serviceButtons.forEach(button => {
        const originalOnClick = button.getAttribute('onclick');
        const serviceTypeMatch = originalOnClick.match(/bookService\('([^']+)'\)/);
        
        if (serviceTypeMatch) {
            const serviceType = serviceTypeMatch[1];
            button.removeAttribute('onclick');
            button.addEventListener('click', function() {
                bookService(serviceType);
            });
            console.log('Button initialized for service:', serviceType);
        }
    });
}

// Enhanced Booking Modal Function
function openBookingModal(consultationType) {
    console.log('Opening booking modal for:', consultationType);
    
    // Get the modal element
    const modal = document.getElementById('bookingModal');
    if (!modal) {
        console.error('Booking modal not found! Creating fallback...');
        showAlert('Booking system is loading... Please try again in a moment.', 'medium');
        return;
    }
    
    // Set the consultation type
    if (consultationType) {
        selectedConsultationType = consultationType;
        
        // Auto-select the consultation type in modal if it exists
        const typeElement = document.getElementById(`type${consultationType.charAt(0).toUpperCase() + consultationType.slice(1)}`);
        if (typeElement) {
            // Remove active class from all types
            document.querySelectorAll('.type-option').forEach(opt => {
                opt.classList.remove('active');
            });
            // Add active class to selected type
            typeElement.classList.add('active');
        }
    }
    
    // Show the modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Reset to first step
    goToStep(1);
    
    console.log('Booking modal opened successfully');
}

// Close Modal Function
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Step Navigation Function
function goToStep(stepNumber) {
    // Hide all steps
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => step.classList.remove('active'));
    
    // Show target step
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
        currentStep = stepNumber;
    }
}

// Pediatric Service Booking Function - CORRECTED & WORKING
function bookService(serviceType) {
    console.log('Booking service initiated for:', serviceType);
    
    // Map service types to consultation types and details
    const serviceDetails = {
        'well-baby-checkup': {
            name: 'Well-Baby Checkup',
            defaultType: 'clinic',
            price: '₹800 - ₹1200',
            description: 'Comprehensive health assessment for infants and children'
        },
        'vaccination': {
            name: 'Vaccination Services',
            defaultType: 'clinic', 
            price: 'Varies by Vaccine',
            description: 'Complete immunization with certified vaccines'
        },
        'illness-care': {
            name: 'Childhood Illness Care',
            defaultType: 'clinic',
            price: '₹1000 - ₹2000',
            description: 'Treatment for common childhood diseases'
        },
        'development-assessment': {
            name: 'Development Assessment',
            defaultType: 'clinic',
            price: '₹1500 - ₹2500',
            description: 'Monitoring developmental milestones'
        },
        'pediatric-cardiology': {
            name: 'Pediatric Cardiology',
            defaultType: 'clinic',
            price: '₹2000 - ₹5000',
            description: 'Heart care for children with cardiac issues'
        },
        'pediatric-dentistry': {
            name: 'Pediatric Dentistry', 
            defaultType: 'clinic',
            price: '₹500 - ₹2000',
            description: 'Dental care specifically for children'
        }
    };

    const service = serviceDetails[serviceType] || {
        name: serviceType.replace('-', ' '),
        defaultType: 'clinic',
        price: 'Contact for Price',
        description: 'Pediatric consultation service'
    };

    // Store the selected service for booking process
    selectedService = serviceType;
    selectedConsultationType = service.defaultType;

    // Show confirmation message
    showAlert(`
        🎯 <strong>${service.name} Selected</strong><br><br>
        💰 <strong>Price:</strong> ${service.price}<br>
        📋 <strong>Description:</strong> ${service.description}<br><br>
        Opening booking system...
    `, 'low', 4000);

    // Open the booking modal
    setTimeout(() => {
        openBookingModal(service.defaultType);
        
        // Update modal title with service name
        const modalTitle = document.querySelector('#bookingModal h2');
        if (modalTitle) {
            modalTitle.innerHTML = `Book ${service.name}`;
        }
    }, 1500);

    console.log('Service booking flow completed for:', serviceType);
}

// Initialize Service Booking Buttons - Add this to your DOMContentLoaded event
function initializeServiceBooking() {
    console.log('Initializing service booking buttons...');
    
    // Add event listeners to all service booking buttons
    const serviceButtons = document.querySelectorAll('[onclick*="bookService"]');
    serviceButtons.forEach(button => {
        const originalOnClick = button.getAttribute('onclick');
        const serviceTypeMatch = originalOnClick.match(/bookService\('([^']+)'\)/);
        
        if (serviceTypeMatch) {
            const serviceType = serviceTypeMatch[1];
            button.removeAttribute('onclick');
            button.addEventListener('click', function() {
                bookService(serviceType);
            });
            console.log('Button initialized for service:', serviceType);
        }
    });
}

// Enhanced Booking Modal Function
function openBookingModal(consultationType) {
    console.log('Opening booking modal for:', consultationType);
    
    // Get the modal element
    const modal = document.getElementById('bookingModal');
    if (!modal) {
        console.error('Booking modal not found! Creating fallback...');
        showAlert('Booking system is loading... Please try again in a moment.', 'medium');
        return;
    }
    
    // Set the consultation type
    if (consultationType) {
        selectedConsultationType = consultationType;
        
        // Auto-select the consultation type in modal if it exists
        const typeElement = document.getElementById(`type${consultationType.charAt(0).toUpperCase() + consultationType.slice(1)}`);
        if (typeElement) {
            // Remove active class from all types
            document.querySelectorAll('.type-option').forEach(opt => {
                opt.classList.remove('active');
            });
            // Add active class to selected type
            typeElement.classList.add('active');
        }
    }
    
    // Show the modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Reset to first step
    goToStep(1);
    
    console.log('Booking modal opened successfully');
}

// Close Modal Function
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Step Navigation Function
function goToStep(stepNumber) {
    // Hide all steps
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => step.classList.remove('active'));
    
    // Show target step
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
        currentStep = stepNumber;
    }
}}





// Pediatricians Data Loader
function loadPediatricians() {
    const pediatriciansGrid = document.getElementById('pediatriciansGrid');
    if (!pediatriciansGrid) return;

    // Sample pediatricians data
    const pediatricians = [
        {
            id: 1,
            name: "Dr. Anjali Sharma",
            specialty: "Pediatrician & Neonatologist",
            experience: 15,
            rating: 4.9,
            specialization: "neonatology",
            availability: "Available Today",
            education: "MD Pediatrics - AIIMS Delhi",
            procedures: "12,000+",
            status: "online"
        },
        {
            id: 2,
            name: "Dr. Rajiv Mehta",
            specialty: "Pediatric Cardiologist", 
            experience: 12,
            rating: 4.8,
            specialization: "cardiology",
            availability: "Available Tomorrow",
            education: "DM Pediatric Cardiology - PGI Chandigarh",
            procedures: "3,500+",
            status: "online"
        },
        {
            id: 3,
            name: "Dr. Priya Reddy",
            specialty: "Pediatric Neurologist",
            experience: 18,
            rating: 4.9,
            specialization: "neurology",
            availability: "Available Today", 
            education: "DM Pediatric Neurology - NIMHANS",
            procedures: "2,800+",
            status: "busy"
        },
        {
            id: 4,
            name: "Dr. Sameer Joshi",
            specialty: "Pediatric Dentist",
            experience: 10,
            rating: 4.7,
            specialization: "dentistry",
            availability: "Available Tomorrow",
            education: "MDS Pediatric Dentistry - Manipal",
            procedures: "5,200+",
            status: "online"
        }
    ];

    renderPediatricians(pediatricians);
}

function renderPediatricians(pediatricians) {
    const grid = document.getElementById('pediatriciansGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    pediatricians.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'pediatrician-card';
        card.setAttribute('data-specialization', doc.specialization);
        
        card.innerHTML = `
            <div class="pediatrician-header">
                <div class="pediatrician-avatar">
                    <i class="fas fa-user-md"></i>
                </div>
                <div class="pediatrician-info">
                    <h3>${doc.name}</h3>
                    <div class="pediatrician-specialty">${doc.specialty}</div>
                </div>
            </div>
            <div class="pediatrician-body">
                <div class="pediatrician-details">
                    <div class="pediatrician-rating">
                        <i class="fas fa-star"></i>
                        <span>${doc.rating}/5</span>
                        <span class="status-indicator status-${doc.status}"></span>
                    </div>
                    <div class="pediatrician-experience">
                        <i class="fas fa-briefcase"></i>
                        ${doc.experience}+ years experience
                    </div>
                    <div class="pediatrician-education">
                        <i class="fas fa-graduation-cap"></i>
                        ${doc.education}
                    </div>
                    <div class="pediatrician-procedures">
                        <i class="fas fa-procedures"></i>
                        ${doc.procedures} procedures
                    </div>
                    <div class="pediatrician-specialization">
                        ${doc.specialization}
                    </div>
                </div>
                <div class="pediatrician-availability">
                    <span class="availability-status ${doc.availability.includes('Today') ? 'available' : 'busy'}">
                        ${doc.availability}
                    </span>
                </div>
                <div class="pediatrician-actions">
                    <button class="btn-primary" onclick="bookPediatrician(${doc.id})">
                        <i class="fas fa-calendar-check"></i>
                        Book Consultation
                    </button>
                    <button class="btn-outline" onclick="viewPediatricianProfile(${doc.id})">
                        <i class="fas fa-user"></i>
                        Profile
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// DOM ready pe load karein
document.addEventListener('DOMContentLoaded', function() {
    loadPediatricians();
});








// Pediatricians Filter Function - COMPLETE FIX
function filterPediatricians() {
    console.log('Filtering pediatricians...');
    
    const specialization = document.getElementById('specializationFilter').value;
    const experience = document.getElementById('experienceFilter').value;
    const pediatricianCards = document.querySelectorAll('.pediatrician-card');
    
    let visibleCount = 0;
    
    pediatricianCards.forEach(card => {
        const cardSpecialization = card.getAttribute('data-specialization');
        const experienceText = card.querySelector('.pediatrician-experience').textContent;
        const experienceYears = parseInt(experienceText.match(/\d+/)[0]);
        
        let showCard = true;
        
        // Filter by specialization
        if (specialization !== 'all' && cardSpecialization !== specialization) {
            showCard = false;
        }
        
        // Filter by experience
        if (experience !== 'all' && experienceYears < parseInt(experience)) {
            showCard = false;
        }
        
        // Show/hide card with animation
        if (showCard) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
            visibleCount++;
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Show no results message if needed
    showNoResultsMessage(visibleCount);
    console.log(`Filter completed: ${visibleCount} pediatricians visible`);
}

// Show No Results Message
function showNoResultsMessage(visibleCount) {
    let noResultsDiv = document.getElementById('noResultsMessage');
    
    if (visibleCount === 0) {
        if (!noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.id = 'noResultsMessage';
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>No Pediatricians Found</h3>
                <p>Try adjusting your filters to see more results.</p>
                <button class="btn-outline" onclick="resetFilters()">Reset Filters</button>
            `;
            document.getElementById('pediatriciansGrid').appendChild(noResultsDiv);
        }
    } else if (noResultsDiv) {
        noResultsDiv.remove();
    }
}

// Reset Filters
function resetFilters() {
    document.getElementById('specializationFilter').value = 'all';
    document.getElementById('experienceFilter').value = 'all';
    filterPediatricians();
    showAlert('Filters have been reset', 'low');
}

// Initialize Filters
function initializeFilters() {
    const specializationFilter = document.getElementById('specializationFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    
    if (specializationFilter) {
        specializationFilter.addEventListener('change', filterPediatricians);
    }
    
    if (experienceFilter) {
        experienceFilter.addEventListener('change', filterPediatricians);
    }
    
    console.log('Pediatrician filters initialized');
}

// Enhanced Pediatrician Data with Specializations
function loadPediatriciansWithSpecializations() {
    const pediatricians = [
        {
            id: 1,
            name: "Dr. Anjali Sharma",
            specialty: "Pediatrician & Neonatologist",
            experience: 15,
            rating: 4.9,
            specialization: "neonatology",
            availability: "Available Today",
            education: "MD Pediatrics - AIIMS Delhi",
            procedures: "12,000+"
        },
        {
            id: 2,
            name: "Dr. Rajiv Mehta",
            specialty: "Pediatric Cardiologist", 
            experience: 12,
            rating: 4.8,
            specialization: "cardiology",
            availability: "Available Tomorrow",
            education: "DM Pediatric Cardiology - PGI Chandigarh",
            procedures: "3,500+"
        },
        {
            id: 3,
            name: "Dr. Priya Reddy",
            specialty: "Pediatric Neurologist",
            experience: 18,
            rating: 4.9,
            specialization: "neurology",
            availability: "Available Today", 
            education: "DM Pediatric Neurology - NIMHANS",
            procedures: "2,800+"
        },
        {
            id: 4,
            name: "Dr. Sameer Joshi",
            specialty: "Pediatric Dentist",
            experience: 10,
            rating: 4.7,
            specialization: "dentistry",
            availability: "Available Tomorrow",
            education: "MDS Pediatric Dentistry - Manipal",
            procedures: "5,200+"
        },
        {
            id: 5,
            name: "Dr. Arjun Kapoor",
            specialty: "Developmental Pediatrician",
            experience: 14,
            rating: 4.8,
            specialization: "developmental",
            availability: "Available Today",
            education: "MD Pediatrics - CMC Vellore",
            procedures: "8,300+"
        },
        {
            id: 6,
            name: "Dr. Sneha Desai",
            specialty: "Pediatric Gastroenterologist",
            experience: 11,
            rating: 4.7,
            specialization: "gastroenterology",
            availability: "Available Tomorrow",
            education: "DM Pediatric Gastroenterology - SGPGI",
            procedures: "4,100+"
        }
    ];
    
    renderPediatriciansWithSpecializations(pediatricians);
}

// Render Pediatricians with Specialization Data Attributes
function renderPediatriciansWithSpecializations(pediatricians) {
    const grid = document.getElementById('pediatriciansGrid');
    if (!grid) {
        console.error('Pediatricians grid not found!');
        return;
    }
    
    grid.innerHTML = '';
    
    pediatricians.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'pediatrician-card';
        card.setAttribute('data-specialization', doc.specialization);
        
        card.innerHTML = `
            <div class="pediatrician-header">
                <div class="pediatrician-avatar">
                    <i class="fas fa-user-md"></i>
                </div>
                <div class="pediatrician-info">
                    <h3>${doc.name}</h3>
                    <div class="pediatrician-specialty">${doc.specialty}</div>
                </div>
            </div>
            <div class="pediatrician-body">
                <div class="pediatrician-details">
                    <div class="pediatrician-rating">
                        <i class="fas fa-star"></i>
                        <span>${doc.rating}/5</span>
                    </div>
                    <div class="pediatrician-experience">
                        <i class="fas fa-briefcase"></i>
                        ${doc.experience}+ years experience
                    </div>
                    <div class="pediatrician-education">
                        <i class="fas fa-graduation-cap"></i>
                        ${doc.education}
                    </div>
                    <div class="pediatrician-specialization">
                        ${doc.specialization.replace('-', ' ').toUpperCase()}
                    </div>
                </div>
                <div class="pediatrician-availability">
                    <span class="availability-status">${doc.availability}</span>
                </div>
                <div class="pediatrician-actions">
                    <button class="btn-primary" onclick="bookPediatrician(${doc.id})">
                        <i class="fas fa-calendar-check"></i>
                        Book Consultation
                    </button>
                    <button class="btn-outline" onclick="viewPediatricianProfile(${doc.id})">
                        <i class="fas fa-user"></i>
                        Profile
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    
    console.log('Pediatricians rendered with specializations:', pediatricians.length);
}

// Add this to your existing DOMContentLoaded function
document.addEventListener('DOMContentLoaded', function() {
    initializePediatricApp();
    loadPediatriciansWithSpecializations(); // REPLACE the old load function
    setupPediatricEventListeners();
    initializeFilters(); // ADD THIS LINE
    initializeVaccinationTabs();
    initializeGrowthChart();
    initializeServiceBooking();
});








// Wait for the page to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to all "Book Consultation" buttons
    document.querySelectorAll('.book-consult-btn').forEach(button => {
        button.addEventListener('click', function() {
            const pediatricianId = this.getAttribute('data-pediatrician-id');
            bookPediatrician(pediatricianId);
        });
    });
});
// Define your pediatricians data (this could also come from an API)
const pediatriciansData = {
    1: {
        id: 1,
        name: "Dr. Anjali Sharma",
        specialty: "Pediatrician & Neonatologist",
        // ... add other properties like experience, education, etc.
    },
    2: {
        id: 2,
        name: "Dr. Rajiv Mehta",
        specialty: "Pediatric Cardiologist",
        // ... add other properties
    }
};

// Function to handle booking
function bookPediatrician(pediatricianId) {
    console.log('Booking pediatrician:', pediatricianId); // Check if function is called
    
    const pediatrician = pediatriciansData[pediatricianId];
    if (!pediatrician) {
        alert('Pediatrician not found!');
        return;
    }
    
    // Add your code to open the booking form/modal here
    // For example: openBookingModal(pediatrician);
    alert(`Opening booking form for ${pediatrician.name}`); // Temporary feedback
}

// Function to view the profile
function viewPediatricianProfile(pediatricianId) {
    console.log('Viewing profile for pediatrician:', pediatricianId); // Check if function is called
    
    const pediatrician = pediatriciansData[pediatricianId];
    if (!pediatrician) {
        alert('Pediatrician profile not found!');
        return;
    }
    
    // Add your code to open the profile modal here
    // For example: openProfileModal(pediatrician);
    alert(`Showing profile for ${pediatrician.name}`); // Temporary feedback
}