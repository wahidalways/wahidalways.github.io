/**
 * Portfolio Website JavaScript
 * Handles navigation, animations, form submission, and interactive features
 */

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupContactForm();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupIntersectionObserver();
        
        // Initialize after DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeAnimations();
            });
        } else {
            this.initializeAnimations();
        }
    }

    /**
     * Setup navigation functionality
     * Handles active states and scroll-to-section behavior
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        // Handle navigation link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    this.scrollToSection(targetSection);
                    this.setActiveNavLink(link);
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavOnScroll(sections, navLinks);
            this.updateNavbarBackground();
        });
    }

    /**
     * Scroll to a specific section with offset for fixed navbar
     */
    scrollToSection(section) {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = section.offsetTop - navbarHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Set active navigation link
     */
    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    /**
     * Update active navigation link based on scroll position
     */
    updateActiveNavOnScroll(sections, navLinks) {
        const scrollPos = window.scrollY + 100;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const correspondingLink = document.querySelector(`a[href="#${section.id}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    /**
     * Update navbar background opacity based on scroll
     */
    updateNavbarBackground() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.scrollY > 50;

        if (navbar) {
            navbar.style.background = scrolled 
                ? 'rgba(255, 255, 255, 0.98)' 
                : 'rgba(255, 255, 255, 0.95)';
                
            // Handle dark mode
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                navbar.style.background = scrolled 
                    ? 'rgba(31, 33, 33, 0.98)' 
                    : 'rgba(31, 33, 33, 0.95)';
            }
        }
    }

    /**
     * Setup mobile menu functionality
     */
    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
                
                mobileToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');
                
                // Update icon
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-feather', navMenu.classList.contains('active') ? 'x' : 'menu');
                    // Re-initialize feather icons
                    if (typeof feather !== 'undefined') {
                        feather.replace();
                    }
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-feather', 'menu');
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
            }
        }
    }

    /**
     * Setup smooth scrolling for internal links
     */
    setupSmoothScrolling() {
        // Handle all internal anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && link.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.scrollToSection(targetElement);
                }
            }
        });
    }

    /**
     * Setup scroll-triggered animations
     */
    setupScrollAnimations() {
        // Add animation classes to elements
        const animatedElements = document.querySelectorAll(
            '.experience-card, .skill-card, .project-card, .education-item, .bio-card, .stat-item'
        );
        
        animatedElements.forEach(el => {
            if (!el.classList.contains('fade-in')) {
                el.classList.add('fade-in');
            }
        });
        
        // Setup education timeline items
        const educationItems = document.querySelectorAll('.education-item');
        const educationCards = document.querySelectorAll('.education-card');
        const fadeInElements = document.querySelectorAll('.fade-in');
        
        console.log('EDUCATION SETUP: Education items found:', educationItems.length);
        console.log('EDUCATION SETUP: Education cards found:', educationCards.length);
        console.log('EDUCATION SETUP: Fade-in elements found:', fadeInElements.length);
        
        // Ensure education items have proper animation setup
        educationItems.forEach((item, index) => {
            console.log(`EDUCATION SETUP: Setting up timeline item ${index + 1}`);
            if (!item.classList.contains('fade-in')) {
                item.classList.add('fade-in');
            }
            // Set initial state for smooth animation
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 200}ms`;
        });
        
        // Ensure education cards are properly set up
        educationCards.forEach((card, index) => {
            console.log(`EDUCATION SETUP: Setting up education card ${index + 1}`);
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.visibility = 'visible';
            card.style.display = 'block';
        });
        
        // Verify education section exists and log its content
        const educationSection = document.getElementById('education');
        if (educationSection) {
            console.log('EDUCATION SETUP: Education section found, content length:', educationSection.innerHTML.length);
            const educationJourney = educationSection.querySelector('.education-journey');
            if (educationJourney) {
                console.log('EDUCATION SETUP: Education journey found with', educationJourney.children.length, 'items');
            } else {
                console.error('EDUCATION SETUP: Education journey not found!');
            }
        } else {
            console.error('EDUCATION SETUP: Education section not found!');
        }
    }

    /**
     * Setup Intersection Observer for scroll animations
     */
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: [0.1, 0.25, 0.5], // Multiple thresholds for smoother animations
            rootMargin: '0px 0px -50px 0px' // Reduced margin for earlier trigger
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add staggered delay for skill cards
                    if (entry.target.classList.contains('skill-card')) {
                        const skillCards = Array.from(document.querySelectorAll('.skill-card'));
                        const cardIndex = skillCards.indexOf(entry.target);
                        const delay = cardIndex * 150; // 150ms stagger
                        
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translate3d(0, 0, 0)';
                        }, delay);
                    } else {
                        entry.target.classList.add('visible');
                    }
                    
                    // Special handling for timeline items
                    if (entry.target.classList.contains('timeline-item')) {
                        console.log('Timeline item becoming visible:', entry.target);
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                    
                    // Animate stat numbers
                    if (entry.target.classList.contains('stat-item')) {
                        this.animateStatNumbers(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements with fade-in class
        const fadeInElements = document.querySelectorAll('.fade-in');
        console.log('Setting up intersection observer for', fadeInElements.length, 'elements');
        
        fadeInElements.forEach(el => {
            observer.observe(el);
            // Special debug for education cards
            if (el.classList.contains('education-card')) {
                console.log('Observing education card:', el);
            }
        });
        
        // Enhanced backup animation trigger for education timeline
        setTimeout(() => {
            const educationSection = document.getElementById('education');
            const educationJourney = document.querySelector('.education-journey');
            const educationItems = document.querySelectorAll('.education-item');
            const educationCards = document.querySelectorAll('.education-card');
            
            console.log('EDUCATION BACKUP: Checking', educationItems.length, 'education items');
            console.log('EDUCATION BACKUP: Education journey exists:', !!educationJourney);
            
            // Ensure education journey is fully visible
            if (educationJourney) {
                educationJourney.style.cssText += 'opacity: 1 !important; visibility: visible !important; display: block !important;';
                console.log('EDUCATION BACKUP: Education journey visibility forced');
            }
            
            // Animate education items with staggered timing
            educationItems.forEach((item, index) => {
                console.log(`EDUCATION BACKUP: Item ${index + 1} visibility check:`, {
                    hasVisible: item.classList.contains('visible'),
                    opacity: item.style.opacity || getComputedStyle(item).opacity,
                    display: item.style.display || getComputedStyle(item).display
                });
                
                // Trigger smooth animation for each timeline item
                setTimeout(() => {
                    item.classList.add('visible');
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    console.log(`EDUCATION BACKUP: Animating education item ${index + 1}`);
                }, index * 200);
            });
            
            // Ensure education cards are visible
            educationCards.forEach((card, index) => {
                card.style.cssText += 'opacity: 1 !important; visibility: visible !important; display: block !important;';
                console.log(`EDUCATION BACKUP: Force-showing education card ${index + 1}`);
            });
            
            // Verify education section structure
            if (educationSection) {
                educationSection.style.cssText += 'opacity: 1 !important; visibility: visible !important; display: block !important;';
                
                const rect = educationSection.getBoundingClientRect();
                console.log('EDUCATION BACKUP: Section bounds:', rect);
                console.log('EDUCATION BACKUP: Section innerHTML length:', educationSection.innerHTML.length);
            }
        }, 500);
        
        // Additional backup check for timeline design
        setTimeout(() => {
            const allEducationElements = document.querySelectorAll('#education .education-card, #education .education-item, #education .education-journey');
            allEducationElements.forEach(el => {
                if (el.classList.contains('education-journey')) {
                    el.style.cssText += 'opacity: 1 !important; visibility: visible !important; display: block !important;';
                } else {
                    el.style.cssText += 'opacity: 1 !important; visibility: visible !important; display: block !important; transform: translateY(0) !important;';
                }
            });
            
            // Ensure proper positioning for timeline items
            const educationItems = document.querySelectorAll('#education .education-item');
            educationItems.forEach((item, index) => {
                item.classList.add('visible');
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
            
            console.log('EDUCATION FINAL BACKUP: Applied !important styles to', allEducationElements.length, 'elements');
        }, 2000);
    }

    /**
     * Initialize animations after page load
     */
    initializeAnimations() {
        // Enhanced stagger animations with hardware acceleration
        const cards = document.querySelectorAll('.fade-in');
        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 150}ms`; // Increased for smoother stagger
            card.style.opacity = '0';
            card.style.transform = 'translate3d(0, 30px, 0)';
            card.style.willChange = 'transform, opacity';
        });

        // Special handling for skill cards with buttery smooth animations
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transitionDelay = `${index * 150}ms`;
            card.style.transform = 'translate3d(0, 0, 0)';
            card.style.willChange = 'transform, opacity, box-shadow';
        });

        // Special handling for education section to ensure visibility
        this.initEducationSection();

        // Initialize floating icons animation
        this.initFloatingIcons();
        
        // Initialize enhanced scroll animations
        this.setupEnhancedScrollAnimations();
        
        // Initialize scroll progress indicator
        this.initScrollProgress();
        
        // Initialize enhanced button animations
        this.initButtonAnimations();
        
        // Initialize performance optimizations
        this.initPerformanceOptimizations();
        
        // Initialize responsive animations
        this.initResponsiveAnimations();
        
        // Initialize smooth scroll reveal effects
        this.initSmoothScrollReveals();
    }

    /**
     * Initialize floating icons with buttery smooth animations
     */
    initFloatingIcons() {
        const floatingIcons = document.querySelectorAll('.floating-icon');
        
        floatingIcons.forEach((icon, index) => {
            // Enhanced positioning with better distribution
            const positions = [
                { x: 8, y: 15, scale: 1, rotation: 0 },
                { x: 85, y: 20, scale: 0.9, rotation: 15 },
                { x: 12, y: 65, scale: 1.1, rotation: -10 },
                { x: 88, y: 70, scale: 0.95, rotation: 8 },
                { x: 6, y: 45, scale: 1.05, rotation: -5 },
                { x: 90, y: 50, scale: 0.85, rotation: 12 }
            ];
            
            const position = positions[index] || { 
                x: Math.random() * 80 + 10, 
                y: Math.random() * 60 + 20,
                scale: 0.8 + Math.random() * 0.4,
                rotation: Math.random() * 20 - 10
            };
            
            icon.style.left = `${position.x}%`;
            icon.style.top = `${position.y}%`;
            icon.style.transform = `translate3d(0, 0, 0) scale(${position.scale}) rotate(${position.rotation}deg)`;
            icon.style.willChange = 'transform, opacity';
            
            // Enhanced staggered animation with hardware acceleration
            icon.style.animationDelay = `${index * 0.6}s`;
            icon.style.opacity = '0';
            
            // Animate in with buttery smooth timing
            setTimeout(() => {
                icon.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                icon.style.opacity = '1';
                
                // Add floating animation class
                icon.classList.add('floating-active');
            }, index * 150); // Optimized delay for smoother sequence
            
            // Enhanced hover interactions with buttery smooth momentum
            let isHovering = false;
            
            icon.addEventListener('mouseenter', () => {
                isHovering = true;
                icon.style.animationPlayState = 'paused';
                icon.style.transform = `translate3d(0, -8px, 0) scale(${position.scale * 1.15}) rotate(${position.rotation + 12}deg)`;
                icon.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                icon.style.zIndex = '10';
            });
            
            icon.addEventListener('mouseleave', () => {
                isHovering = false;
                icon.style.animationPlayState = 'running';
                icon.style.transform = `translate3d(0, 0, 0) scale(${position.scale}) rotate(${position.rotation}deg)`;
                icon.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                icon.style.zIndex = '1';
            });
            
            // Add buttery smooth parallax effect on scroll
            let ticking = false;
            const updateParallax = () => {
                if (!isHovering) {
                    const scrolled = window.pageYOffset;
                    const parallax = scrolled * (0.05 + index * 0.015);
                    icon.style.transform = `translate3d(0, ${parallax}px, 0) scale(${position.scale}) rotate(${position.rotation}deg)`;
                }
                ticking = false;
            };
            
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            });
        });
    }

    /**
     * Setup contact form functionality
     */
    setupContactForm() {
        const contactForm = document.querySelector('.contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm);
            });

            // Add input validation feedback
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateInput(input));
                input.addEventListener('input', () => this.clearValidationError(input));
            });
        }
    }

    /**
     * Validate individual form input
     */
    validateInput(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        this.clearValidationError(input);

        // Validate based on input type
        switch (input.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'text':
                if (input.hasAttribute('required') && !value) {
                    isValid = false;
                    errorMessage = 'This field is required';
                }
                break;
        }

        // Check textarea
        if (input.tagName.toLowerCase() === 'textarea' && input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Please enter your message';
        }

        if (!isValid) {
            this.showValidationError(input, errorMessage);
        }

        return isValid;
    }

    /**
     * Show validation error for input
     */
    showValidationError(input, message) {
        input.style.borderColor = 'var(--color-error)';
        
        // Create or update error message
        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                color: var(--color-error);
                font-size: var(--font-size-xs);
                margin-top: var(--space-4);
                display: block;
            `;
            input.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    /**
     * Clear validation error for input
     */
    clearValidationError(input) {
        input.style.borderColor = '';
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Handle form submission
     */
    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Validate all inputs
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Please correct the errors above', 'error');
            return;
        }

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i data-feather="loader" style="animation: spin 1s linear infinite;"></i> Sending...';
        submitButton.disabled = true;

        // Re-initialize feather icons for the loader
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset form
            form.reset();
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Re-initialize feather icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }

            // Show success message
            this.showNotification(
                'Thank you for your message! I\'ll get back to you soon.',
                'success'
            );

            // Log form data (for development - remove in production)
            console.log('Form submitted with data:', data);
        }, 2000);
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: var(--space-16) var(--space-24);
            border-radius: var(--radius-lg);
            color: var(--color-white);
            font-weight: var(--font-weight-medium);
            box-shadow: var(--shadow-lg);
            transform: translateX(100%);
            transition: transform var(--duration-normal) var(--ease-standard);
            max-width: 400px;
        `;

        // Set background color based on type
        const colors = {
            success: 'var(--color-success)',
            error: 'var(--color-error)',
            info: 'var(--color-info)'
        };
        notification.style.background = colors[type] || colors.info;

        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    /**
     * Initialize buttery smooth scroll progress indicator
     */
    initScrollProgress() {
        // Create scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #EF233C, #D90429);
            z-index: 10001;
            transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: width;
            transform: translate3d(0, 0, 0);
        `;
        document.body.appendChild(progressBar);

        // Buttery smooth progress updates with requestAnimationFrame
        let ticking = false;
        
        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            // Use transform for better performance
            const clampedPercent = Math.min(Math.max(scrollPercent, 0), 100);
            progressBar.style.width = clampedPercent + '%';
            
            // Add subtle glow effect during scroll
            if (scrollPercent > 0) {
                progressBar.style.boxShadow = `0 0 10px rgba(239, 35, 60, ${Math.min(scrollPercent / 100, 0.5)})`;
            } else {
                progressBar.style.boxShadow = 'none';
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Initialize enhanced button animations
     */
    initButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Add ripple effect on click
            button.addEventListener('click', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: translate(-50%, -50%);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 600);
            });
            
            // Add magnetic effect for primary buttons
            if (button.classList.contains('btn--primary') || button.classList.contains('btn-primary')) {
                button.addEventListener('mousemove', (e) => {
                    const rect = button.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`;
                });
                
                button.addEventListener('mouseleave', () => {
                    button.style.transform = 'translate(0, 0) scale(1)';
                });
            }
        });
        
        // Add ripple animation CSS
        if (!document.querySelector('#ripple-animation-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation-style';
            style.textContent = `
                @keyframes ripple {
                    0% {
                        width: 0;
                        height: 0;
                        opacity: 1;
                    }
                    100% {
                        width: 300px;
                        height: 300px;
                        opacity: 0;
                    }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Initialize performance optimizations for buttery smooth animations
     */
    initPerformanceOptimizations() {
        // Optimize animations for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
            
            // Disable complex animations
            const style = document.createElement('style');
            style.textContent = `
                .reduced-motion * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
            return;
        }
        
        // Add will-change properties for better performance
        const animatedElements = document.querySelectorAll('.skill-card, .btn, .floating-icon, .nav-link');
        animatedElements.forEach(el => {
            el.style.willChange = 'transform, opacity, box-shadow';
        });
        
        // Use requestAnimationFrame for smooth scroll-based animations
        let ticking = false;
        let lastScrollY = 0;
        
        const updateScrollAnimations = () => {
            const scrollY = window.pageYOffset;
            const scrollDelta = scrollY - lastScrollY;
            
            // Update floating icons parallax
            const floatingIcons = document.querySelectorAll('.floating-icon');
            floatingIcons.forEach((icon, index) => {
                const parallaxSpeed = 0.02 + (index * 0.01);
                const translateY = scrollY * parallaxSpeed;
                icon.style.transform = `translate3d(0, ${translateY}px, 0)`;
            });
            
            lastScrollY = scrollY;
            ticking = false;
        };
        
        const requestScrollTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };
        
        // Throttle scroll events with requestAnimationFrame
        window.addEventListener('scroll', requestScrollTick, { passive: true });
        
        // Intersection Observer performance optimization
        if ('IntersectionObserver' in window) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!prefersReducedMotion) {
                this.initIntersectionBasedAnimations();
            }
        }
    }
    
    /**
     * Initialize intersection-based animations for better performance
     */
    initIntersectionBasedAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Add smooth reveal class
                    element.classList.add('animate-in');
                    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    element.style.opacity = '1';
                    element.style.transform = 'translate3d(0, 0, 0) scale(1)';
                    
                    // Remove observer after animation
                    observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements that need smooth reveals
        const elementsToObserve = document.querySelectorAll('.skill-card, .project-card, .experience-card, .bio-card, .timeline-item');
        elementsToObserve.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translate3d(0, 30px, 0) scale(0.95)';
            observer.observe(el);
        });
    }

    /**
     * Initialize responsive animations with buttery smooth mobile optimization
     */
    initResponsiveAnimations() {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        const handleResponsiveAnimations = (e) => {
            const skillCards = document.querySelectorAll('.skill-card');
            const allCards = document.querySelectorAll('.fade-in');
            
            if (e.matches) {
                // Mobile: Optimized animations for performance
                skillCards.forEach((card, index) => {
                    card.style.transitionDelay = `${index * 100}ms`; // Reduced delay
                    card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'; // Faster on mobile
                });
                
                allCards.forEach((card, index) => {
                    card.style.transitionDelay = `${index * 75}ms`;
                    card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                });
            } else {
                // Desktop: Full buttery smooth animations
                skillCards.forEach((card, index) => {
                    card.style.transitionDelay = `${index * 150}ms`; // Staggered for skills
                    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                });
                
                allCards.forEach((card, index) => {
                    card.style.transitionDelay = `${index * 100}ms`;
                    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                });
            }
        };
        
        mediaQuery.addListener(handleResponsiveAnimations);
        handleResponsiveAnimations(mediaQuery);
        
        // Handle device orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                handleResponsiveAnimations(mediaQuery);
            }, 100);
        });
    }
}



// Add resize handler for responsive features
window.addEventListener('resize', () => {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768) {
        portfolioApp.closeMobileMenu();
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        portfolioApp.closeMobileMenu();
    }
});

// Handle CV download buttons (replace with actual CV file)
document.addEventListener('click', (e) => {
    if (e.target.closest('a[aria-label*="Download CV"]') || 
        e.target.closest('.btn').textContent.includes('Download CV')) {
        e.preventDefault();
        
        // Show message about CV download
        portfolioApp.showNotification(
            'CV download will be available soon. Please contact me directly for my resume.', 
            'info'
        );
        
        // In a real implementation, this would trigger the actual download:
        // window.open('/path/to/cv.pdf', '_blank');
    }
});

// Handle project case study links
document.addEventListener('click', (e) => {
    if (e.target.closest('.project-link')) {
        e.preventDefault();
        portfolioApp.showNotification(
            'Detailed case studies are coming soon. Contact me to learn more about these projects.',
            'info'
        );
        
        // In a real implementation, this would navigate to the case study:
        // window.location.href = '/case-studies/' + projectId;
    }
});

/**
 * Initialize Education Section specifically
 * Ensures education grid cards are properly animated and visible
 */
PortfolioApp.prototype.initEducationSection = function() {
    const educationSection = document.getElementById('education');
    const educationCards = document.querySelectorAll('.education-card');
    
    console.log('Initializing education section...', educationCards.length, 'education cards found');
    
    // Ensure all education cards have proper animation setup
    educationCards.forEach((card, index) => {
        // Add fade-in class if not present
        if (!card.classList.contains('fade-in')) {
            card.classList.add('fade-in');
        }
        
        // Set initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.transitionDelay = `${index * 150}ms`;
        
        // Debug log
        console.log(`Education card ${index + 1} initialized with classes:`, card.className);
    });
    
    // Force immediate visibility check if section is already in viewport
    if (educationSection) {
        const rect = educationSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            console.log('Education section is in viewport, making cards visible immediately');
            educationCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 150);
            });
        }
    }
};

// Enhanced setup for buttery smooth scroll animations
PortfolioApp.prototype.setupEnhancedScrollAnimations = function() {
    // Enhanced intersection observer with multiple thresholds for smoother animations
    const observerOptions = {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: '0px 0px -30px 0px' // Reduced for earlier triggers
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;
            const ratio = entry.intersectionRatio;
            
            if (entry.isIntersecting) {
                // Enhanced staggered delay with buttery smooth timing
                let delay = 0;
                
                if (element.classList.contains('skill-card')) {
                    const skillCards = Array.from(document.querySelectorAll('.skill-card'));
                    delay = skillCards.indexOf(element) * 150; // Increased stagger for skills
                } else {
                    delay = Array.from(element.parentNode.children).indexOf(element) * 100;
                }
                
                setTimeout(() => {
                    element.classList.add('visible');
                    element.style.opacity = '1';
                    element.style.transform = 'translate3d(0, 0, 0)';
                    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                }, delay);
                
                // Add special effects for specific elements
                if (element.classList.contains('stat-number')) {
                    setTimeout(() => {
                        this.animateCounter(element);
                    }, delay + 200);
                }
                
                if (element.classList.contains('skill-card')) {
                    setTimeout(() => {
                        this.animateSkillCard(element);
                    }, delay + 300);
                }
            }
            
            // Buttery smooth parallax effect based on intersection ratio
            if (element.classList.contains('floating-icon')) {
                const translateY = (1 - ratio) * 15;
                element.style.transform = `translate3d(0, ${translateY}px, 0)`;
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .floating-icon').forEach(el => {
        observer.observe(el);
        // Special debug for timeline items
        if (el.classList.contains('timeline-item')) {
            console.log('Observing timeline item:', el);
        }
    });
};

/**
 * Initialize smooth scroll reveal effects
 */
PortfolioApp.prototype.initSmoothScrollReveals = function() {
    // Add smooth reveal for sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.willChange = 'transform, opacity';
        section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    // Enhanced skill card reveals
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        card.style.transform = 'translate3d(0, 40px, 0) scale(0.95)';
        card.style.opacity = '0';
        card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 150}ms`;
        card.style.willChange = 'transform, opacity, box-shadow';
    });
    
    // Enhanced education card reveals
    const educationCards = document.querySelectorAll('.education-card');
    educationCards.forEach((card, index) => {
        card.style.transform = 'translate3d(0, 30px, 0)';
        card.style.opacity = '0';
        card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 150}ms`;
        card.style.willChange = 'transform, opacity';
    });
};

// Enhanced counter animation for statistics
PortfolioApp.prototype.animateCounter = function(element) {
    const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
    const suffix = element.textContent.includes('%') ? '%' : 
                  element.textContent.includes('+') ? '+' : '';
    
    const duration = 2500; // Slightly longer for smoother effect
    const increment = target / (duration / 16);
    let current = 0;
    
    // Add initial scale effect
    element.style.transform = 'scale(0.8)';
    element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                
                // Final bounce effect
                element.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 150);
            }
            
            element.textContent = Math.round(current) + suffix;
        }, 16);
    }, 100);
};

// Enhanced skill card animation with buttery smooth effects
PortfolioApp.prototype.animateSkillCard = function(element) {
    const skillItems = element.querySelectorAll('.skill-list li');
    const skillIcon = element.querySelector('.skill-icon');
    
    // Animate skill icon first
    if (skillIcon) {
        skillIcon.style.transform = 'scale(1.1) rotate(5deg)';
        skillIcon.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            skillIcon.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
    }
    
    // Then animate skill items with stagger
    skillItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translate3d(-20px, 0, 0) scale(0.95)';
        item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translate3d(0, 0, 0) scale(1)';
        }, index * 100 + 150); // Delay after icon animation
    });
};

// Enhanced timeline item animation for education section
PortfolioApp.prototype.animateTimelineItem = function(element) {
    const educationCard = element.querySelector('.education-card');
    const timelineDot = element.querySelector('::before');
    
    if (educationCard) {
        // Add a subtle bounce effect to the card
        educationCard.style.transform = 'translateY(0) scale(1.02)';
        educationCard.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            educationCard.style.transform = 'translateY(0) scale(1)';
        }, 200);
        
        // Animate card elements with stagger
        const cardElements = educationCard.querySelectorAll('.education-period, .education-degree, .education-school, .education-details, .education-grade, .education-status');
        cardElements.forEach((elem, index) => {
            elem.style.opacity = '0';
            elem.style.transform = 'translateY(10px)';
            elem.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                elem.style.opacity = '1';
                elem.style.transform = 'translateY(0)';
            }, index * 50 + 100);
        });
    }
};

/**
 * Animate stat numbers with enhanced counter
 */
PortfolioApp.prototype.animateStatNumbers = function(statItem) {
    const statNumber = statItem.querySelector('.stat-number');
    if (!statNumber) return;
    
    const target = parseInt(statNumber.textContent.replace(/[^0-9]/g, ''));
    const suffix = statNumber.textContent.includes('%') ? '%' : 
                  statNumber.textContent.includes('+') ? '+' : '';
    
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        statNumber.textContent = Math.round(current) + suffix;
        
        // Add scaling effect during counting
        const scale = 1 + (current / target) * 0.1;
        statNumber.style.transform = `scale(${Math.min(scale, 1.1)})`;
        statNumber.style.transition = 'transform 0.1s ease';
    }, 16);
    
    // Reset scale after animation
    setTimeout(() => {
        statNumber.style.transform = 'scale(1)';
        statNumber.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }, duration + 200);
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}