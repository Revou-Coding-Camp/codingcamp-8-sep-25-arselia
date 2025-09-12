document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initWelcomeMessage();
    initCurrentTime();
    initFormValidation();
    initSmoothScrolling();
    initAnimations();
});

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('.section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

function initWelcomeMessage() {
    const welcomeTitle = document.getElementById('welcome-title');
    const currentHour = new Date().getHours();
    let greeting = 'Hi';
    let name = 'Visitor';
    
    if (currentHour < 12) {
        greeting = 'Good Morning';
    } else if (currentHour < 18) {
        greeting = 'Good Afternoon';
    } else {
        greeting = 'Good Evening';
    }

    const savedName = getUserName();
    if (savedName) {
        name = savedName;
    } else {
        const userName = prompt('Welcome! Please enter your name:');
        if (userName && userName.trim() !== '') {
            name = userName.trim();
            saveUserName(name);
        }
    }

    welcomeTitle.textContent = `${greeting} ${name}, Welcome To Website`;
    
    typeWriter(welcomeTitle, `${greeting} ${name}, Welcome To Website`, 100);
}

// User name management functions
function getUserName() {
    // Since localStorage is not available, we'll store in a variable for the session
    return window.sessionUserName || null;
}

function saveUserName(name) {
    window.sessionUserName = name;
}

// Typewriter effect
function typeWriter(element, text, speed) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Current Time Display
function initCurrentTime() {
    const timeElement = document.getElementById('currentTime');
    
    function updateTime() {
        const now = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Jakarta',
            timeZoneName: 'short'
        };
        
        const formattedTime = now.toLocaleString('en-US', options);
        timeElement.textContent = formattedTime;
    }
    
    // Update time immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);
}

// Form Validation and Submission
function initFormValidation() {
    const form = document.getElementById('messageForm');
    const nameInput = document.getElementById('nama');
    const dateInput = document.getElementById('tanggal');
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const messageInput = document.getElementById('pesan');
    const submitBtn = form.querySelector('.submit-btn');

    // Real-time validation
    nameInput.addEventListener('blur', () => validateName());
    nameInput.addEventListener('input', () => clearError('nama'));
    
    dateInput.addEventListener('change', () => validateDate());
    dateInput.addEventListener('input', () => clearError('tanggal'));
    
    genderInputs.forEach(radio => {
        radio.addEventListener('change', () => validateGender());
    });
    
    messageInput.addEventListener('blur', () => validateMessage());
    messageInput.addEventListener('input', () => clearError('pesan'));

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isValid = validateForm();
        
        if (isValid) {
            submitForm();
        } else {
            // Shake form to indicate errors
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 600);
        }
    });

    // Validation functions
    function validateName() {
        const name = nameInput.value.trim();
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        
        if (!name) {
            showError('nama', 'Nama harus diisi');
            return false;
        } else if (!nameRegex.test(name)) {
            showError('nama', 'Nama hanya boleh berisi huruf dan spasi (2-50 karakter)');
            return false;
        } else {
            clearError('nama');
            return true;
        }
    }

    function validateDate() {
        const date = dateInput.value;
        const today = new Date();
        const selectedDate = new Date(date);
        const minAge = new Date();
        minAge.setFullYear(minAge.getFullYear() - 100); // Maximum age 100 years
        
        if (!date) {
            showError('tanggal', 'Tanggal lahir harus diisi');
            return false;
        } else if (selectedDate >= today) {
            showError('tanggal', 'Tanggal lahir tidak boleh hari ini atau masa depan');
            return false;
        } else if (selectedDate < minAge) {
            showError('tanggal', 'Tanggal lahir tidak valid');
            return false;
        } else {
            clearError('tanggal');
            return true;
        }
    }

    function validateGender() {
        const selectedGender = document.querySelector('input[name="gender"]:checked');
        
        if (!selectedGender) {
            showError('gender', 'Jenis kelamin harus dipilih');
            return false;
        } else {
            clearError('gender');
            return true;
        }
    }

    function validateMessage() {
        const message = messageInput.value.trim();
        
        if (!message) {
            showError('pesan', 'Pesan harus diisi');
            return false;
        } else if (message.length < 10) {
            showError('pesan', 'Pesan minimal 10 karakter');
            return false;
        } else if (message.length > 500) {
            showError('pesan', 'Pesan maksimal 500 karakter');
            return false;
        } else {
            clearError('pesan');
            return true;
        }
    }

    function validateForm() {
        const nameValid = validateName();
        const dateValid = validateDate();
        const genderValid = validateGender();
        const messageValid = validateMessage();
        
        return nameValid && dateValid && genderValid && messageValid;
    }

    function showError(fieldName, message) {
        const field = document.getElementById(fieldName) || document.querySelector(`input[name="${fieldName}"]`);
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (field) {
            field.classList.add('error');
        }
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    function clearError(fieldName) {
        const field = document.getElementById(fieldName) || document.querySelector(`input[name="${fieldName}"]`);
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (field) {
            field.classList.remove('error');
        }
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    function submitForm() {
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate form submission delay
        setTimeout(() => {
            const formData = new FormData(form);
            const name = formData.get('nama');
            const date = formData.get('tanggal');
            const gender = formData.get('gender');
            const message = formData.get('pesan');
            
            // Calculate age
            const birthDate = new Date(date);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            // Format date for display
            const formattedDate = new Date(date).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            // Display submitted information
            const submittedInfo = document.getElementById('submittedInfo');
            const displayInfo = document.getElementById('displayInfo');
            
            displayInfo.innerHTML = `
                <div class="info-item">
                    <strong>Nama:</strong> ${name}
                </div>
                <div class="info-item">
                    <strong>Tanggal Lahir:</strong> ${formattedDate}
                </div>
                <div class="info-item">
                    <strong>Umur:</strong> ${age} tahun
                </div>
                <div class="info-item">
                    <strong>Jenis Kelamin:</strong> ${gender}
                </div>
                <div class="info-item">
                    <strong>Pesan:</strong> ${message}
                </div>
                <div class="info-item">
                    <strong>Waktu Submit:</strong> ${new Date().toLocaleString('id-ID', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })}
                </div>
            `;
            
            submittedInfo.style.display = 'block';
            submittedInfo.classList.add('form-success');
            
            // Reset form
            form.reset();
            
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Scroll to submitted info
            submittedInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Update welcome message with submitted name
            saveUserName(name);
            const welcomeTitle = document.getElementById('welcome-title');
            const currentHour = new Date().getHours();
            let greeting = 'Hi';
            
            if (currentHour < 12) {
                greeting = 'Good Morning';
            } else if (currentHour < 18) {
                greeting = 'Good Afternoon';
            } else {
                greeting = 'Good Evening';
            }
            
            welcomeTitle.textContent = `${greeting} ${name}, Welcome To Website`;
            
        }, 1500); // 1.5 second delay to simulate processing
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 70;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(
        '.hq-item, .profile-card, .vm-card, .service-card, .portfolio-item, .stat-item'
    );

    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .hq-item, .profile-card, .vm-card, .service-card, .portfolio-item, .stat-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .shake {
            animation: shake 0.6s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

// Utility Functions

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format phone number (if needed for future features)
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{4})(\d{4})(\d{4})$/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
}

// Email validation (if needed for future features)
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Character counter for textarea (utility function)
function addCharacterCounter(textareaId, maxLength) {
    const textarea = document.getElementById(textareaId);
    if (!textarea) return;
    
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = 'text-align: right; font-size: 0.9rem; color: #666; margin-top: 0.5rem;';
    
    textarea.parentNode.appendChild(counter);
    
    function updateCounter() {
        const remaining = maxLength - textarea.value.length;
        counter.textContent = `${textarea.value.length}/${maxLength} karakter`;
        counter.style.color = remaining < 50 ? '#e74c3c' : '#666';
    }
    
    textarea.addEventListener('input', updateCounter);
    updateCounter();
}

// Initialize character counter for message textarea
document.addEventListener('DOMContentLoaded', function() {
    addCharacterCounter('pesan', 500);
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}, 250));

// Error handling for development
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Console welcome message (for developers)
console.log('%c🚀 Website Loaded Successfully!', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%cDeveloped with ❤️ for RevoU Assignment', 'color: #764ba2; font-size: 12px;');