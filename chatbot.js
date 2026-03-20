// Chatbot Data and Responses
const chatbotResponses = {
    greetings: [
        "Hello! I'm your Health Assistant. How can I help you today? 😊",
        "Hi there! I'm here to assist with your health concerns. What brings you here? 🏥",
        "Welcome! I'm your medical assistant. How can I support your health journey today?"
    ],
    
    appointments: {
        "book doctor appointment": "I can help you book an appointment! Would you like me to connect you with our booking system or find available doctors?",
        "find doctors near me": "I'll help you find doctors in your area. Please tell me your location or specialty needed.",
        "schedule appointment": "Great! Let me help you schedule an appointment. Which specialty do you need?"
    },
    
    symptoms: {
        "fever": "For fever: Rest well, drink plenty of fluids, and take paracetamol if needed. If fever persists beyond 3 days or is above 103°F, consult a doctor immediately.",
        "headache": "For headache: Rest in a quiet room, apply cold compress, stay hydrated. Avoid screen time. If severe or persistent, consult a doctor.",
        "cough": "For cough: Drink warm water with honey, use steam inhalation. Avoid cold foods. If cough persists beyond a week, see a doctor.",
        "cold": "For cold: Rest, drink warm fluids, use saline nasal drops. Vitamin C helps. If symptoms worsen, consult a doctor.",
        "stomach pain": "For stomach pain: Drink plenty of water, avoid spicy food. If pain is severe or persists, consult a doctor immediately.",
        "body pain": "For body pain: Rest, apply warm compress, gentle stretching. If accompanied by fever, consult a doctor."
    },
    
    emergencies: {
        "heart attack": "🚨 HEART ATTACK EMERGENCY: Call 108 immediately! Sit patient down, loosen tight clothing. If prescribed, give aspirin. Do not leave alone.",
        "accident": "🚨 ACCIDENT EMERGENCY: Call 108! Check breathing, stop bleeding with clean cloth. Do not move injured person unless in danger.",
        "breathing": "🚨 BREATHING EMERGENCY: Call 108! Help person sit upright, loosen clothing. If asthma inhaler available, assist with it.",
        "allergy": "🚨 SEVERE ALLERGY: Call 108! If epinephrine auto-injector available, use it immediately. Help person lie down with legs elevated."
    },
    
    medicines: {
        "order medicines": "I can help you order medicines! Please provide the medicine names or upload your prescription.",
        "medicine delivery": "We offer 2-hour medicine delivery. Please share your prescription and delivery address.",
        "prescription": "For prescription medicines, you'll need a valid prescription from a registered doctor."
    },
    
    general: {
        "hello": "Hello! How can I assist with your health today?",
        "hi": "Hi there! I'm your health assistant. What can I help you with?",
        "thanks": "You're welcome! 😊 Stay healthy and don't hesitate to reach out if you need more help.",
        "thank you": "You're welcome! Take care of your health. Let me know if you need anything else.",
        "help": "I can help you with: \n• Symptom checking\n• Doctor appointments\n• Medicine information\n• Emergency guidance\n• Health tips\nWhat do you need help with?",
        "bye": "Goodbye! Take care and stay healthy! 🏥"
    },
    
    fallback: "I understand you're looking for health assistance. Could you please provide more details about your concern? I can help with symptoms, appointments, medicines, or emergencies."
};

// Chat State
let chatState = {
    isMinimized: false,
    currentSymptoms: [],
    symptomSeverity: null,
    conversationHistory: []
};

// Initialize Chatbot
document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
    setupEventListeners();
});

function initializeChatbot() {
    // Add welcome message
    addBotMessage(getRandomResponse(chatbotResponses.greetings));
    
    // Load previous chat from localStorage
    loadChatHistory();
}

function setupEventListeners() {
    // Enter key to send message
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
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

// Send Message Function
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addUserMessage(message);
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message after delay
    setTimeout(() => {
        hideTypingIndicator();
        processMessage(message);
    }, 1000 + Math.random() * 1000);
}

// Send Quick Message
function sendQuickMessage(message) {
    document.getElementById('messageInput').value = message;
    sendMessage();
}

// Process User Message
function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    let response = '';
    
    // Save to conversation history
    chatState.conversationHistory.push({
        type: 'user',
        message: message,
        timestamp: new Date().toISOString()
    });
    
    // Check for greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        response = getRandomResponse(chatbotResponses.greetings);
    }
    // Check for appointments
    else if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
        response = chatbotResponses.appointments['book doctor appointment'];
    }
    // Check for doctors
    else if (lowerMessage.includes('doctor') || lowerMessage.includes('find doctor')) {
        response = chatbotResponses.appointments['find doctors near me'];
    }
    // Check for symptoms
    else if (Object.keys(chatbotResponses.symptoms).some(symptom => lowerMessage.includes(symptom))) {
        const symptom = Object.keys(chatbotResponses.symptoms).find(s => lowerMessage.includes(s));
        response = chatbotResponses.symptoms[symptom];
        
        // Add follow-up question
        response += "\n\nWould you like me to help you book an appointment with a doctor?";
    }
    // Check for medicines
    else if (lowerMessage.includes('medicine') || lowerMessage.includes('prescription') || lowerMessage.includes('delivery')) {
        response = chatbotResponses.medicines['order medicines'];
    }
    // Check for emergencies
    else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('help immediately')) {
        response = "🚨 This sounds urgent! Please call emergency services at 108 immediately. I can also provide first aid guidance. What type of emergency are you facing?";
    }
    // Check for thanks
    else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        response = chatbotResponses.general['thanks'];
    }
    // Check for goodbye
    else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
        response = chatbotResponses.general['bye'];
    }
    // Check for help
    else if (lowerMessage.includes('help')) {
        response = chatbotResponses.general['help'];
    }
    // Fallback response
    else {
        response = chatbotResponses.fallback;
    }
    
    // Add bot response
    addBotMessage(response);
    
    // Save to localStorage
    saveChatHistory();
}

// Add User Message to Chat
function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    messageDiv.innerHTML = `
        <div>${message}</div>
        <div class="message-time">${timestamp}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    
    // Save to state
    chatState.conversationHistory.push({
        type: 'user',
        message: message,
        timestamp: new Date().toISOString()
    });
}

// Add Bot Message to Chat
function addBotMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    messageDiv.innerHTML = `
        <div>${formatMessage(message)}</div>
        <div class="message-time">${timestamp}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    
    // Save to state
    chatState.conversationHistory.push({
        type: 'bot',
        message: message,
        timestamp: new Date().toISOString()
    });
}

// Format message with line breaks
function formatMessage(message) {
    return message.replace(/\n/g, '<br>');
}

// Show Typing Indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

// Hide Typing Indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Scroll to Bottom of Chat
function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Toggle Chat Window
function toggleChat() {
    const chatbot = document.querySelector('.chatbot-container');
    const floatingBtn = document.querySelector('.floating-chatbot-btn');
    
    if (chatState.isMinimized) {
        chatbot.classList.remove('minimized');
        floatingBtn.style.display = 'none';
        chatState.isMinimized = false;
    } else {
        chatbot.classList.add('minimized');
        floatingBtn.style.display = 'flex';
        chatState.isMinimized = true;
    }
}

// Clear Chat
function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        
        // Clear conversation history
        chatState.conversationHistory = [];
        localStorage.removeItem('quickcare_chat_history');
        
        // Add welcome message
        addBotMessage(getRandomResponse(chatbotResponses.greetings));
    }
}

// Handle Key Press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Get Random Response from Array
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Symptoms Helper Functions
function showSymptomsHelper() {
    document.getElementById('symptomsModal').style.display = 'block';
}

function closeSymptomsModal() {
    document.getElementById('symptomsModal').style.display = 'none';
    // Reset symptoms
    chatState.currentSymptoms = [];
    chatState.symptomSeverity = null;
    
    // Remove active classes
    document.querySelectorAll('.symptom-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

function selectSymptom(symptom) {
    const button = event.target;
    button.classList.toggle('active');
    
    if (chatState.currentSymptoms.includes(symptom)) {
        chatState.currentSymptoms = chatState.currentSymptoms.filter(s => s !== symptom);
    } else {
        chatState.currentSymptoms.push(symptom);
    }
}

function setSeverity(severity) {
    chatState.symptomSeverity = severity;
    
    // Update UI
    document.querySelectorAll('.symptom-btn').forEach(btn => {
        if (btn.textContent.toLowerCase() === severity) {
            btn.classList.add('active');
        } else if (['mild', 'moderate', 'severe'].includes(btn.textContent.toLowerCase())) {
            btn.classList.remove('active');
        }
    });
}

function analyzeSymptoms() {
    if (chatState.currentSymptoms.length === 0) {
        alert('Please select at least one symptom.');
        return;
    }
    
    if (!chatState.symptomSeverity) {
        alert('Please select symptom severity.');
        return;
    }
    
    const symptomsText = chatState.currentSymptoms.join(', ');
    const message = `I have ${symptomsText} (${chatState.symptomSeverity} severity)`;
    
    closeSymptomsModal();
    sendQuickMessage(message);
}

// Emergency Helper Functions
function showEmergencyHelper() {
    document.getElementById('emergencyModal').style.display = 'block';
}

function closeEmergencyModal() {
    document.getElementById('emergencyModal').style.display = 'none';
}

function handleEmergency(type) {
    const response = chatbotResponses.emergencies[type];
    closeEmergencyModal();
    addBotMessage(response);
}

function callEmergency() {
    if (confirm('🚨 Call Emergency Services at 108?')) {
        window.location.href = 'tel:108';
    }
}

// Medication Helper
function showMedicationHelper() {
    const message = "I can help with medication information! Please tell me:\n• Medicine name you're asking about\n• Your symptoms\n• Any allergies you have";
    addBotMessage(message);
}

// Save Chat History to LocalStorage
function saveChatHistory() {
    localStorage.setItem('quickcare_chat_history', JSON.stringify(chatState.conversationHistory));
}

// Load Chat History from LocalStorage
function loadChatHistory() {
    const savedHistory = localStorage.getItem('quickcare_chat_history');
    if (savedHistory) {
        const history = JSON.parse(savedHistory);
        history.forEach(item => {
            if (item.type === 'user') {
                addUserMessage(item.message);
            } else {
                addBotMessage(item.message);
            }
        });
    }
}

// Initialize when page loads
window.onload = function() {
    initializeChatbot();
};

// Medicine Information Database
const medicineDatabase = {
    "paracetamol": {
        name: "Paracetamol",
        brandNames: ["Crocin", "Calpol", "Panda", "Metacin"],
        type: "Pain Reliever & Fever Reducer",
        uses: ["Fever", "Mild to moderate pain", "Headache", "Body ache"],
        dosage: {
            adult: "500-1000mg every 4-6 hours",
            children: "10-15mg per kg body weight",
            maxDaily: "4000mg (4 grams)"
        },
        sideEffects: ["Rare: Liver damage with overdose", "Nausea", "Allergic reactions"],
        precautions: ["Don't exceed maximum dose", "Avoid alcohol", "Consult doctor if pregnant"],
        interactions: ["Alcohol increases liver risk", "Warfarin may interact"],
        priceRange: "₹10 - ₹50 for 10 tablets"
    },

    "ibuprofen": {
        name: "Ibuprofen",
        brandNames: ["Brufen", "Ibugesic", "Advil"],
        type: "NSAID (Non-Steroidal Anti-Inflammatory Drug)",
        uses: ["Pain", "Fever", "Inflammation", "Arthritis", "Menstrual cramps"],
        dosage: {
            adult: "200-400mg every 6-8 hours",
            children: "5-10mg per kg body weight",
            maxDaily: "1200mg"
        },
        sideEffects: ["Stomach pain", "Heartburn", "Nausea", "Increased bleeding risk"],
        precautions: ["Take with food", "Avoid in stomach ulcers", "Not for asthma patients"],
        interactions: ["Blood thinners", "Other NSAIDs", "ACE inhibitors"],
        priceRange: "₹30 - ₹100 for 10 tablets"
    },

    "amoxicillin": {
        name: "Amoxicillin",
        brandNames: ["Mox", "Amoxycillin", "Novamox"],
        type: "Antibiotic",
        uses: ["Bacterial infections", "Ear infections", "Throat infections", "UTI"],
        dosage: {
            adult: "250-500mg every 8 hours",
            children: "20-40mg per kg per day",
            course: "5-7 days (complete full course)"
        },
        sideEffects: ["Diarrhea", "Nausea", "Rash", "Allergic reactions"],
        precautions: ["Complete full course", "Take as prescribed", "Report allergies"],
        interactions: ["Birth control pills may be less effective"],
        priceRange: "₹50 - ₹150 for 10 capsules"
    },

    "omeprazole": {
        name: "Omeprazole",
        brandNames: ["Omez", "Risek", "Ocid"],
        type: "Proton Pump Inhibitor",
        uses: ["Acidity", "Heartburn", "GERD", "Stomach ulcers"],
        dosage: {
            adult: "20-40mg once daily before food",
            duration: "2-8 weeks as prescribed"
        },
        sideEffects: ["Headache", "Diarrhea", "Nausea", "Vitamin B12 deficiency long-term"],
        precautions: ["Take empty stomach", "Don't crush tablets", "Long-term use needs monitoring"],
        interactions: ["Clopidogrel", "Diazepam", "Warfarin"],
        priceRange: "₹40 - ₹120 for 10 capsules"
    },

    "cetirizine": {
        name: "Cetirizine",
        brandNames: ["Zyrtec", "Alatrol", "Cetzine"],
        type: "Antihistamine",
        uses: ["Allergies", "Hay fever", "Hives", "Itching"],
        dosage: {
            adult: "10mg once daily",
            children: "5mg once daily (above 6 years)"
        },
        sideEffects: ["Drowsiness", "Dry mouth", "Headache", "Fatigue"],
        precautions: ["Avoid alcohol", "May cause drowsiness", "Drive with caution"],
        interactions: ["Alcohol", "Other sedatives"],
        priceRange: "₹20 - ₹60 for 10 tablets"
    },

    "metformin": {
        name: "Metformin",
        brandNames: ["Glycomet", "Metfor", "Gluconorm"],
        type: "Anti-Diabetic",
        uses: ["Type 2 Diabetes", "PCOS", "Weight management"],
        dosage: {
            adult: "500-1000mg twice daily with meals",
            start: "Start with low dose, increase gradually"
        },
        sideEffects: ["Nausea", "Diarrhea", "Stomach upset", "Metallic taste"],
        precautions: ["Take with food", "Monitor kidney function", "Avoid in liver disease"],
        interactions: ["Alcohol", "Contrast dyes"],
        priceRange: "₹30 - ₹90 for 10 tablets"
    },

    "atorvastatin": {
        name: "Atorvastatin",
        brandNames: ["Atorva", "Lipitor", "Storvas"],
        type: "Cholesterol Lowering",
        uses: ["High cholesterol", "Heart disease prevention"],
        dosage: {
            adult: "10-80mg once daily at bedtime",
            monitoring: "Regular liver function tests needed"
        },
        sideEffects: ["Muscle pain", "Liver enzyme increase", "Headache", "Nausea"],
        precautions: ["Avoid grapefruit", "Monitor liver enzymes", "Report muscle pain"],
        interactions: ["Grapefruit juice", "Other cholesterol drugs"],
        priceRange: "₹50 - ₹200 for 10 tablets"
    },

    "vitamin c": {
        name: "Vitamin C",
        brandNames: ["Celin", "Limcee", "Ester-C"],
        type: "Vitamin Supplement",
        uses: ["Immunity boost", "Antioxidant", "Collagen production", "Wound healing"],
        dosage: {
            adult: "500-1000mg daily",
            children: "As per age and requirement"
        },
        sideEffects: ["Diarrhea (high doses)", "Stomach upset", "Kidney stones (long-term high dose)"],
        precautions: ["Take with food", "Don't exceed 2000mg daily"],
        interactions: ["Chemotherapy drugs", "Blood thinners"],
        priceRange: "₹20 - ₹100 for 10 tablets"
    },

    "azithromycin": {
        name: "Azithromycin",
        brandNames: ["Azee", "Zithromax", "Azipro"],
        type: "Antibiotic",
        uses: ["Respiratory infections", "Ear infections", "STDs", "Skin infections"],
        dosage: {
            adult: "500mg once daily for 3 days",
            children: "10mg per kg once daily for 3 days"
        },
        sideEffects: ["Diarrhea", "Nausea", "Stomach pain", "Headache"],
        precautions: ["Take 1 hour before or 2 hours after food", "Complete course"],
        interactions: ["Antacids", "Warfarin", "Digoxin"],
        priceRange: "₹60 - ₹180 for 3 tablets"
    },

    "dolo": {
        name: "Dolo 650",
        brandNames: ["Dolo 650"],
        type: "Paracetamol Brand",
        uses: ["Fever", "Pain relief", "Headache", "Body ache"],
        dosage: {
            adult: "1 tablet every 4-6 hours",
            maxDaily: "Not more than 4 tablets in 24 hours"
        },
        sideEffects: ["Very rare with proper dosage", "Liver damage with overdose"],
        precautions: ["Don't take with other paracetamol products", "Avoid alcohol"],
        interactions: ["Alcohol", "Warfarin"],
        priceRange: "₹15 - ₹30 for 15 tablets"
    }
};

// Common Medicine Synonyms
const medicineSynonyms = {
    "crocin": "paracetamol",
    "calpol": "paracetamol",
    "dolo": "paracetamol",
    "brufen": "ibuprofen",
    "advil": "ibuprofen",
    "mox": "amoxicillin",
    "novamox": "amoxicillin",
    "omez": "omeprazole",
    "ocid": "omeprazole",
    "zyrtec": "cetirizine",
    "cetzine": "cetirizine",
    "glycomet": "metformin",
    "lipitor": "atorvastatin",
    "atorva": "atorvastatin",
    "celin": "vitamin c",
    "limcee": "vitamin c",
    "azee": "azithromycin"
};

// Updated Chatbot Responses with Medicine Info
const chatbotResponse = {
    // ... previous greetings, appointments, symptoms, emergencies ...
    
    medicines: {
        "order medicines": "I can help you order medicines! Please provide the medicine names or upload your prescription.",
        "medicine delivery": "We offer 2-hour medicine delivery. Please share your prescription and delivery address.",
        "prescription": "For prescription medicines, you'll need a valid prescription from a registered doctor.",
        
        // Medicine information will be handled by the medicine database
    },
    
    // ... other sections ...
};

// New Medicine Search Function
function searchMedicine(medicineName) {
    const lowerName = medicineName.toLowerCase().trim();
    
    // Check synonyms first
    const actualName = medicineSynonyms[lowerName] || lowerName;
    
    if (medicineDatabase[actualName]) {
        return medicineDatabase[actualName];
    }
    
    // Fuzzy search
    for (const [key, medicine] of Object.entries(medicineDatabase)) {
        if (key.includes(actualName) || actualName.includes(key)) {
            return medicine;
        }
        
        // Check brand names
        if (medicine.brandNames.some(brand => 
            brand.toLowerCase().includes(actualName) || 
            actualName.includes(brand.toLowerCase())
        )) {
            return medicine;
        }
    }
    
    return null;
}

// Enhanced Process Message Function
function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    let response = '';
    
    // Save to conversation history
    chatState.conversationHistory.push({
        type: 'user',
        message: message,
        timestamp: new Date().toISOString()
    });
    
    // Check for medicine queries
    if (lowerMessage.includes('medicine') || 
        lowerMessage.includes('tablet') || 
        lowerMessage.includes('pill') ||
        lowerMessage.includes('drug') ||
        lowerMessage.includes('dose') ||
        lowerMessage.includes('side effect') ||
        Object.keys(medicineSynonyms).some(med => lowerMessage.includes(med)) ||
        Object.keys(medicineDatabase).some(med => lowerMessage.includes(med))) {
        
        const medicineInfo = extractMedicineInfo(lowerMessage);
        if (medicineInfo) {
            response = formatMedicineResponse(medicineInfo);
        } else {
            response = "I can provide information about medicines! Please tell me which medicine you're asking about. Examples: 'paracetamol', 'dolo 650', 'crocin side effects'";
        }
    }
    // ... rest of your existing message processing logic ...
    else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        response = getRandomResponse(chatbotResponses.greetings);
    }
    // ... other conditions ...
    else {
        response = chatbotResponses.fallback;
    }
    
    // Add bot response
    addBotMessage(response);
    
    // Save to localStorage
    saveChatHistory();
}

// Extract Medicine Information from Message
function extractMedicineInfo(message) {
    // Common medicine-related patterns
    const medicinePatterns = [
        /(?:information|details|about)\s+(.+?)(?:\s|$)/,
        /(?:side effects|side effect)\s+of\s+(.+?)(?:\s|$)/,
        /(?:dose|dosage)\s+of\s+(.+?)(?:\s|$)/,
        /(?:uses|benefits)\s+of\s+(.+?)(?:\s|$)/,
        /(?:price|cost)\s+of\s+(.+?)(?:\s|$)/,
        /^(.+?)(?:\s+side effects?|\s+dose|\s+uses|\s+price|\s+information)/
    ];
    
    let medicineName = '';
    
    // Try to extract medicine name using patterns
    for (const pattern of medicinePatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
            medicineName = match[1].trim();
            break;
        }
    }
    
    // If no pattern matched, try direct medicine names
    if (!medicineName) {
        const words = message.split(' ');
        for (const word of words) {
            if (searchMedicine(word)) {
                medicineName = word;
                break;
            }
        }
    }
    
    return medicineName ? searchMedicine(medicineName) : null;
}

// Format Medicine Response
function formatMedicineResponse(medicine) {
    return `
💊 **${medicine.name}** ${medicine.brandNames.length > 0 ? `(${medicine.brandNames.join(', ')})` : ''}

**Type:** ${medicine.type}
**Uses:** ${medicine.uses.join(', ')}

**💡 Dosage Information:**
${Object.entries(medicine.dosage).map(([key, value]) => `• ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`).join('\n')}

**⚠️ Side Effects:**
${Array.isArray(medicine.sideEffects) ? medicine.sideEffects.map(effect => `• ${effect}`).join('\n') : `• ${medicine.sideEffects}`}

**🔒 Precautions:**
${Array.isArray(medicine.precautions) ? medicine.precautions.map(precaution => `• ${precaution}`).join('\n') : `• ${medicine.precautions}`}

${medicine.interactions ? `**🚫 Interactions:**\n${Array.isArray(medicine.interactions) ? medicine.interactions.map(interaction => `• ${interaction}`).join('\n') : `• ${medicine.interactions}`}` : ''}

${medicine.priceRange ? `**💰 Price Range:** ${medicine.priceRange}` : ''}

**📝 Important:** This is general information. Always consult a doctor before taking any medicine.
    `.trim();
}

// Enhanced Medication Helper
function showMedicationHelper() {
    const message = `💊 **Medicine Information Helper**

I can provide detailed information about:
• Medicine uses and dosage
• Side effects and precautions
• Drug interactions
• Price information

**Popular Medicines I Know:**
• Paracetamol (Crocin, Calpol, Dolo)
• Ibuprofen (Brufen, Advil)
• Amoxicillin (Mox, Novamox)
• Omeprazole (Omez, Ocid)
• Cetirizine (Zyrtec, Cetzine)
• Metformin (Glycomet)
• Atorvastatin (Lipitor, Atorva)
• Vitamin C (Celin, Limcee)
• Azithromycin (Azee)
• Dolo 650

Just ask me about any medicine! Example: "paracetamol side effects" or "dolo 650 dosage"`;
    
    addBotMessage(message);
}

// Add Quick Medicine Buttons
function addMedicineQuickButtons() {
    const quickActions = document.getElementById('quickActions');
    
    const medicineButtons = `
        <button class="quick-btn" onclick="sendQuickMessage('paracetamol information')">
            <i class="fas fa-pills"></i>
            Paracetamol
        </button>
        <button class="quick-btn" onclick="sendQuickMessage('dolo 650 side effects')">
            <i class="fas fa-pills"></i>
            Dolo 650
        </button>
        <button class="quick-btn" onclick="sendQuickMessage('amoxicillin uses')">
            <i class="fas fa-pills"></i>
            Amoxicillin
        </button>
        <button class="quick-btn" onclick="sendQuickMessage('medicine information')">
            <i class="fas fa-info-circle"></i>
            Medicine Help
        </button>
    `;
    
    quickActions.innerHTML += medicineButtons;
}

// Update initialization to include medicine buttons
function initializeChatbot() {
    // Add welcome message
    addBotMessage(getRandomResponse(chatbotResponses.greetings));
    
    // Load previous chat from localStorage
    loadChatHistory();
    
    // Add medicine quick buttons
    addMedicineQuickButtons();
}

// Test Medicine Queries - You can use these for testing:
/*
- "paracetamol side effects"
- "dolo 650 dosage"
- "crocin information"
- "amoxicillin uses"
- "brufen side effects"
- "what is metformin used for"
- "omeprazole price"
- "vitamin c benefits"
*/