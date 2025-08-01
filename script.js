// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon();

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Theme Toggle Functionality
themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeToggleBtn.querySelector('i');
    if (currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Modal Functions
function openLoginModal() {
    loginModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openRegisterModal() {
    registerModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeRegisterModal() {
    registerModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchToRegister() {
    closeLoginModal();
    openRegisterModal();
}

function switchToLogin() {
    closeRegisterModal();
    openLoginModal();
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        closeLoginModal();
    }
    if (e.target === registerModal) {
        closeRegisterModal();
    }
});

// Form Submissions
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login process
    showNotification('Login successful!', 'success');
    closeLoginModal();
    loginForm.reset();
    
    // Store user session
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    updateAuthButtons();
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Simulate registration process
    showNotification('Registration successful!', 'success');
    closeRegisterModal();
    registerForm.reset();
    
    // Store user session
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    updateAuthButtons();
});

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = 'var(--success-color)';
    } else if (type === 'error') {
        notification.style.backgroundColor = 'var(--error-color)';
    } else {
        notification.style.backgroundColor = 'var(--primary-color)';
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Update authentication buttons based on login status
function updateAuthButtons() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const authButtons = document.querySelector('.nav-auth');
    
    if (isLoggedIn) {
        const userName = localStorage.getItem('userName') || localStorage.getItem('userEmail');
        authButtons.innerHTML = `
            <span class="user-name">Welcome, ${userName}</span>
            <button class="btn-logout" onclick="logout()">Logout</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="btn-login" onclick="openLoginModal()">Login</button>
            <button class="btn-register" onclick="openRegisterModal()">Register</button>
        `;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    updateAuthButtons();
    showNotification('Logged out successfully', 'success');
}

// Level page navigation
function openLevelPage(level) {
    // Check if user is logged in
    if (localStorage.getItem('userLoggedIn') !== 'true') {
        showNotification('Please login to access education levels', 'error');
        openLoginModal();
        return;
    }
    
    // Create and open level page
    const levelPage = createLevelPage(level);
    document.body.innerHTML = levelPage;
    
    // Add back button functionality
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }
    
    // Initialize level page functionality
    initializeLevelPage(level);
}

function createLevelPage(level) {
    const levelData = {
        primary: {
            title: 'Primary Schools',
            icon: 'fas fa-child',
            schools: [
                { name: 'St. Mary Primary School', location: 'Dar es Salaam', students: 450 },
                { name: 'Kilimanjaro Primary', location: 'Arusha', students: 380 },
                { name: 'Zanzibar Primary School', location: 'Zanzibar', students: 320 },
                { name: 'Mwanza Primary Academy', location: 'Mwanza', students: 410 },
                { name: 'Tanga Primary School', location: 'Tanga', students: 290 }
            ]
        },
        secondary: {
            title: 'Secondary Schools',
            icon: 'fas fa-user-graduate',
            schools: [
                { name: 'St. Joseph Secondary', location: 'Dar es Salaam', students: 280 },
                { name: 'Arusha Secondary School', location: 'Arusha', students: 320 },
                { name: 'Mwanza High School', location: 'Mwanza', students: 350 },
                { name: 'Tanga Secondary', location: 'Tanga', students: 240 },
                { name: 'Dodoma Secondary School', location: 'Dodoma', students: 290 }
            ]
        },
        vocational: {
            title: 'Vocational Training Colleges',
            icon: 'fas fa-tools',
            schools: [
                { name: 'Dar Technical College', location: 'Dar es Salaam', students: 180 },
                { name: 'Arusha Vocational Institute', location: 'Arusha', students: 150 },
                { name: 'Mwanza Technical College', location: 'Mwanza', students: 200 },
                { name: 'Tanga Skills Center', location: 'Tanga', students: 120 },
                { name: 'Dodoma Vocational School', location: 'Dodoma', students: 160 }
            ]
        },
        university: {
            title: 'Universities',
            icon: 'fas fa-university',
            schools: [
                { name: 'University of Dar es Salaam', location: 'Dar es Salaam', students: 2500 },
                { name: 'Arusha University', location: 'Arusha', students: 1800 },
                { name: 'Mwanza University', location: 'Mwanza', students: 2200 },
                { name: 'Tanga University', location: 'Tanga', students: 1500 },
                { name: 'Dodoma University', location: 'Dodoma', students: 1900 }
            ]
        }
    };
    
    const data = levelData[level];
    
    return `
        <nav class="navbar">
            <div class="nav-container">
                <div class="nav-logo">
                    <h2><i class="fas fa-graduation-cap"></i> ELIMU KUSOMA</h2>
                </div>
                <button class="back-btn btn-primary">
                    <i class="fas fa-arrow-left"></i> Back to Home
                </button>
                <div class="theme-toggle">
                    <button id="theme-toggle-btn">
                        <i class="fas fa-moon"></i>
                    </button>
                </div>
            </div>
        </nav>
        
        <div class="level-page">
            <div class="container">
                <div class="level-header">
                    <div class="level-icon-large">
                        <i class="${data.icon}"></i>
                    </div>
                    <h1>${data.title}</h1>
                    <p>Choose an institution to view live sessions, timetables, and recorded content</p>
                </div>
                
                <div class="schools-grid">
                    ${data.schools.map(school => `
                        <div class="school-card" onclick="openSchoolPage('${school.name}', '${level}')">
                            <div class="school-info">
                                <h3>${school.name}</h3>
                                <p><i class="fas fa-map-marker-alt"></i> ${school.location}</p>
                                <p><i class="fas fa-users"></i> ${school.students} Students</p>
                            </div>
                            <div class="school-actions">
                                <button class="btn-primary">View Institution</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <style>
            .level-page {
                padding-top: 100px;
                min-height: 100vh;
                background-color: var(--background-color);
            }
            
            .level-header {
                text-align: center;
                margin-bottom: 3rem;
            }
            
            .level-icon-large {
                font-size: 4rem;
                color: var(--primary-color);
                margin-bottom: 1rem;
            }
            
            .level-header h1 {
                font-size: 2.5rem;
                color: var(--text-primary);
                margin-bottom: 1rem;
            }
            
            .level-header p {
                color: var(--text-secondary);
                font-size: 1.1rem;
            }
            
            .schools-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 2rem;
            }
            
            .school-card {
                background-color: var(--surface-color);
                border-radius: 12px;
                padding: 2rem;
                box-shadow: 0 4px 6px var(--shadow-color);
                transition: all var(--transition-normal);
                cursor: pointer;
                border: 2px solid transparent;
            }
            
            .school-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px var(--shadow-color);
                border-color: var(--primary-color);
            }
            
            .school-info h3 {
                color: var(--text-primary);
                font-size: 1.25rem;
                margin-bottom: 0.5rem;
            }
            
            .school-info p {
                color: var(--text-secondary);
                margin-bottom: 0.25rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .school-actions {
                margin-top: 1rem;
            }
            
            .back-btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            @media (max-width: 768px) {
                .schools-grid {
                    grid-template-columns: 1fr;
                }
                
                .level-header h1 {
                    font-size: 2rem;
                }
            }
        </style>
    `;
}

function openSchoolPage(schoolName, level) {
    const schoolPage = createSchoolPage(schoolName, level);
    document.body.innerHTML = schoolPage;
    
    // Add back button functionality
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            openLevelPage(level);
        });
    }
    
    // Initialize school page functionality
    initializeSchoolPage(schoolName);
}

function createSchoolPage(schoolName, level) {
    return `
        <nav class="navbar">
            <div class="nav-container">
                <div class="nav-logo">
                    <h2><i class="fas fa-graduation-cap"></i> ELIMU KUSOMA</h2>
                </div>
                <button class="back-btn btn-primary">
                    <i class="fas fa-arrow-left"></i> Back to ${level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
                <div class="theme-toggle">
                    <button id="theme-toggle-btn">
                        <i class="fas fa-moon"></i>
                    </button>
                </div>
            </div>
        </nav>
        
        <div class="school-page">
            <div class="container">
                <div class="school-header">
                    <h1>${schoolName}</h1>
                    <p>Live sessions, timetables, and recorded content</p>
                </div>
                
                <div class="school-tabs">
                    <button class="tab-btn active" onclick="switchTab('live')">Live Sessions</button>
                    <button class="tab-btn" onclick="switchTab('timetable')">Timetable</button>
                    <button class="tab-btn" onclick="switchTab('recorded')">Recorded Sessions</button>
                    <button class="tab-btn" onclick="switchTab('talents')">Talents & Activities</button>
                </div>
                
                <div class="tab-content">
                    <div id="live-tab" class="tab-panel active">
                        <div class="live-session">
                            <h3>Current Live Session</h3>
                            <div class="video-container">
                                <video controls>
                                    <source src="class-session1.mp4" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div class="session-info">
                                <h4>Mathematics - Grade 7</h4>
                                <p><i class="fas fa-clock"></i> 09:00 AM - 10:30 AM</p>
                                <p><i class="fas fa-user"></i> Teacher: Mr. John Doe</p>
                                <p><i class="fas fa-users"></i> 45 Students Online</p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="timetable-tab" class="tab-panel">
                        <h3>Weekly Timetable</h3>
                        <div class="timetable">
                            <div class="timetable-day">
                                <h4>Monday</h4>
                                <div class="timetable-sessions">
                                    <div class="session">
                                        <span class="time">08:00 - 09:30</span>
                                        <span class="subject">Mathematics</span>
                                        <span class="teacher">Mr. John Doe</span>
                                    </div>
                                    <div class="session">
                                        <span class="time">10:00 - 11:30</span>
                                        <span class="subject">English</span>
                                        <span class="teacher">Ms. Sarah Smith</span>
                                    </div>
                                    <div class="session">
                                        <span class="time">14:00 - 15:30</span>
                                        <span class="subject">Science</span>
                                        <span class="teacher">Mr. David Wilson</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="timetable-day">
                                <h4>Tuesday</h4>
                                <div class="timetable-sessions">
                                    <div class="session">
                                        <span class="time">08:00 - 09:30</span>
                                        <span class="subject">History</span>
                                        <span class="teacher">Ms. Mary Johnson</span>
                                    </div>
                                    <div class="session">
                                        <span class="time">10:00 - 11:30</span>
                                        <span class="subject">Geography</span>
                                        <span class="teacher">Mr. Robert Brown</span>
                                    </div>
                                    <div class="session">
                                        <span class="time">14:00 - 15:30</span>
                                        <span class="subject">Physical Education</span>
                                        <span class="teacher">Mr. James Wilson</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="recorded-tab" class="tab-panel">
                        <h3>Recorded Sessions</h3>
                        <div class="recorded-sessions">
                            <div class="session-card">
                                <div class="session-thumbnail">
                                    <i class="fas fa-play-circle"></i>
                                </div>
                                <div class="session-details">
                                    <h4>Mathematics - Algebra Basics</h4>
                                    <p><i class="fas fa-calendar"></i> March 15, 2024</p>
                                    <p><i class="fas fa-clock"></i> 1 hour 30 minutes</p>
                                    <p><i class="fas fa-user"></i> Mr. John Doe</p>
                                </div>
                                <button class="btn-primary">Watch</button>
                            </div>
                            
                            <div class="session-card">
                                <div class="session-thumbnail">
                                    <i class="fas fa-play-circle"></i>
                                </div>
                                <div class="session-details">
                                    <h4>English - Grammar Review</h4>
                                    <p><i class="fas fa-calendar"></i> March 14, 2024</p>
                                    <p><i class="fas fa-clock"></i> 1 hour 15 minutes</p>
                                    <p><i class="fas fa-user"></i> Ms. Sarah Smith</p>
                                </div>
                                <button class="btn-primary">Watch</button>
                            </div>
                            
                            <div class="session-card">
                                <div class="session-thumbnail">
                                    <i class="fas fa-play-circle"></i>
                                </div>
                                <div class="session-details">
                                    <h4>Science - Chemistry Lab</h4>
                                    <p><i class="fas fa-calendar"></i> March 13, 2024</p>
                                    <p><i class="fas fa-clock"></i> 1 hour 45 minutes</p>
                                    <p><i class="fas fa-user"></i> Mr. David Wilson</p>
                                </div>
                                <button class="btn-primary">Watch</button>
                            </div>
                        </div>
                    </div>
                    
                    <div id="talents-tab" class="tab-panel">
                        <h3>Talents & Activities</h3>
                        <div class="talents-grid">
                            <div class="talent-card">
                                <div class="talent-icon">
                                    <i class="fas fa-music"></i>
                                </div>
                                <h4>Music Club</h4>
                                <p>Students showcase their musical talents</p>
                                <p><i class="fas fa-users"></i> 25 Members</p>
                                <button class="btn-secondary">Join Club</button>
                            </div>
                            
                            <div class="talent-card">
                                <div class="talent-icon">
                                    <i class="fas fa-palette"></i>
                                </div>
                                <h4>Art & Craft</h4>
                                <p>Creative expression through visual arts</p>
                                <p><i class="fas fa-users"></i> 18 Members</p>
                                <button class="btn-secondary">Join Club</button>
                            </div>
                            
                            <div class="talent-card">
                                <div class="talent-icon">
                                    <i class="fas fa-futbol"></i>
                                </div>
                                <h4>Sports Team</h4>
                                <p>Football, basketball, and athletics</p>
                                <p><i class="fas fa-users"></i> 35 Members</p>
                                <button class="btn-secondary">Join Team</button>
                            </div>
                            
                            <div class="talent-card">
                                <div class="talent-icon">
                                    <i class="fas fa-theater-masks"></i>
                                </div>
                                <h4>Drama Club</h4>
                                <p>Theatrical performances and acting</p>
                                <p><i class="fas fa-users"></i> 22 Members</p>
                                <button class="btn-secondary">Join Club</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            .school-page {
                padding-top: 100px;
                min-height: 100vh;
                background-color: var(--background-color);
            }
            
            .school-header {
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .school-header h1 {
                font-size: 2.5rem;
                color: var(--text-primary);
                margin-bottom: 0.5rem;
            }
            
            .school-header p {
                color: var(--text-secondary);
                font-size: 1.1rem;
            }
            
            .school-tabs {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            }
            
            .tab-btn {
                padding: 0.75rem 1.5rem;
                border: none;
                background-color: var(--surface-color);
                color: var(--text-primary);
                border-radius: 8px;
                cursor: pointer;
                transition: all var(--transition-fast);
                font-weight: 500;
            }
            
            .tab-btn.active {
                background-color: var(--primary-color);
                color: white;
            }
            
            .tab-btn:hover:not(.active) {
                background-color: var(--border-color);
            }
            
            .tab-panel {
                display: none;
            }
            
            .tab-panel.active {
                display: block;
            }
            
            .live-session {
                background-color: var(--surface-color);
                border-radius: 12px;
                padding: 2rem;
                box-shadow: 0 4px 6px var(--shadow-color);
            }
            
            .video-container {
                margin-bottom: 1rem;
            }
            
            .video-container video {
                width: 100%;
                border-radius: 8px;
            }
            
            .session-info h4 {
                color: var(--text-primary);
                margin-bottom: 0.5rem;
            }
            
            .session-info p {
                color: var(--text-secondary);
                margin-bottom: 0.25rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .timetable {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
            }
            
            .timetable-day {
                background-color: var(--surface-color);
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 4px 6px var(--shadow-color);
            }
            
            .timetable-day h4 {
                color: var(--primary-color);
                margin-bottom: 1rem;
                font-size: 1.25rem;
            }
            
            .session {
                display: grid;
                grid-template-columns: 1fr 2fr 1fr;
                gap: 1rem;
                padding: 0.75rem;
                border-bottom: 1px solid var(--border-color);
                align-items: center;
            }

            .live-session > h3{
            margin-bottom:1rem;
    }
            
            .session:last-child {
                border-bottom: none;
            }
            
            .time {
                font-weight: 600;
                color: var(--primary-color);
            }
            
            .subject {
                font-weight: 500;
                color: var(--text-primary);
            }
            
            .teacher {
                color: var(--text-secondary);
                font-size: 0.875rem;
            }
            
            .recorded-sessions {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 1.5rem;
            }
            
            .session-card {
                background-color: var(--surface-color);
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 4px 6px var(--shadow-color);
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .session-thumbnail {
                font-size: 3rem;
                color: var(--primary-color);
            }
            
            .session-details {
                flex: 1;
            }

           
            
            .session-details h4 {
                color: var(--text-primary);
                margin-bottom: 0.5rem;
            }
            
            .session-details p {
                color: var(--text-secondary);
                margin-bottom: 0.25rem;
                font-size: 0.875rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .talents-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 2rem;
            }
            
            .talent-card {
                background-color: var(--surface-color);
                border-radius: 12px;
                padding: 2rem;
                text-align: center;
                box-shadow: 0 4px 6px var(--shadow-color);
                transition: all var(--transition-normal);
            }
            
            .talent-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px var(--shadow-color);
            }
            
            .talent-icon {
                font-size: 3rem;
                color: var(--primary-color);
                margin-bottom: 1rem;
            }
            
            .talent-card h4 {
                color: var(--text-primary);
                margin-bottom: 0.5rem;
            }
            
            .talent-card p {
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
            }
            
            @media (max-width: 768px) {
                .school-tabs {
                    flex-direction: column;
                }
                
                .timetable {
                    grid-template-columns: 1fr;
                }
                
                .session {
                    grid-template-columns: 1fr;
                    gap: 0.5rem;
                }
                
                .recorded-sessions {
                    grid-template-columns: 1fr;
                }
                
                .session-card {
                    flex-direction: column;
                    text-align: center;
                }
                
                .talents-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    `;
}

function switchTab(tabName) {
    // Hide all tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab panel
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

function initializeLevelPage(level) {
    // Re-initialize theme toggle
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            updateThemeIcon();
        });
    }
}

function initializeSchoolPage(schoolName) {
    // Re-initialize theme toggle
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            updateThemeIcon();
        });
    }
}

// Smooth scrolling
function scrollToLevels() {
    document.getElementById('levels').scrollIntoView({
        behavior: 'smooth'
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthButtons();
    
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .user-name {
        color: var(--text-primary);
        font-weight: 500;
        margin-right: 1rem;
    }
    
    .btn-logout {
        background-color: var(--error-color);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all var(--transition-fast);
    }
    
    .btn-logout:hover {
        background-color: #dc2626;
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style); 