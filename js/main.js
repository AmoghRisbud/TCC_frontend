/**
 * The Collective Counsel - Main JavaScript
 * Handles navigation, form validation, smooth scrolling, and animations
 */

'use strict';

// ===================================
// DOM Elements
// ===================================
const header = document.querySelector('.header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

// ===================================
// Navigation
// ===================================

/**
 * Toggle mobile navigation menu
 */
function toggleNav() {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isExpanded ? '' : 'hidden';
}

/**
 * Close mobile navigation menu
 */
function closeNav() {
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Handle scroll events for header styling
 */
function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/**
 * Smooth scroll to section
 * @param {Event} e - Click event
 */
function smoothScroll(e) {
    const href = e.currentTarget.getAttribute('href');
    
    if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            closeNav();
            
            // Update URL without triggering scroll
            history.pushState(null, null, href);
        }
    }
}

// ===================================
// Form Validation
// ===================================

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show error message for form field
 * @param {HTMLElement} field - Form field element
 * @param {string} message - Error message to display
 */
function showError(field, message) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.form-error');
    
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Clear error message for form field
 * @param {HTMLElement} field - Form field element
 */
function clearError(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.form-error');
    
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    
    if (errorElement) {
        errorElement.textContent = '';
    }
}

/**
 * Validate form field
 * @param {HTMLElement} field - Form field to validate
 * @returns {boolean} - Whether field is valid
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearError(field);
    
    // Required field validation
    if (field.required && !value) {
        showError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (fieldName === 'email' && value && !isValidEmail(value)) {
        showError(field, 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const fields = form.querySelectorAll('.form-input, .form-textarea');
    let isValid = true;
    
    // Validate all fields
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        // Simulate form submission
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Simulate API call delay
        setTimeout(() => {
            form.hidden = true;
            formSuccess.hidden = false;
            
            // Reset form for potential reuse
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }, 1500);
    }
}

// ===================================
// Scroll Animations
// ===================================

/**
 * Initialize intersection observer for scroll animations
 */
function initScrollAnimations() {
    // Scroll animations are handled by CSS
    // This function is kept for potential future enhancements
}

// ===================================
// Keyboard Navigation
// ===================================

/**
 * Handle keyboard navigation for accessibility
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyboardNav(e) {
    // Close mobile menu on Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeNav();
        navToggle.focus();
    }
}

// ===================================
// Initialization
// ===================================

/**
 * Initialize all functionality
 */
function init() {
    // Navigation event listeners
    if (navToggle) {
        navToggle.addEventListener('click', toggleNav);
    }
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Form validation
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation on blur
        const formFields = contactForm.querySelectorAll('.form-input, .form-textarea');
        formFields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(field);
                }
            });
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNav);
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initial scroll check
    handleScroll();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
