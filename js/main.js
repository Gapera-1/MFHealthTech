// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        const isExpanded = mobileMenuBtn.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        navMenu.setAttribute('aria-hidden', !isExpanded);
    });
    
    // Initialize ARIA attributes
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation Link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    let isValid = true;
    const formInputs = form.querySelectorAll('.form-input, .form-textarea');
    
    // Clear previous errors
    formInputs.forEach(input => {
        input.classList.remove('error');
        const errorMsg = input.parentElement.querySelector('.form-error');
        if (errorMsg) {
            errorMsg.remove();
        }
    });

    // Validate each field
    formInputs.forEach(input => {
        const value = input.value.trim();
        const fieldName = input.name || input.id;
        
        // Required field validation
        if (input.hasAttribute('required') && !value) {
            showError(input, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
            isValid = false;
            return;
        }

        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(input, 'Please enter a valid email address');
                isValid = false;
                return;
            }
        }

        // Name validation (letters only)
        if (fieldName.includes('name') && value) {
            const nameRegex = /^[a-zA-Z\s]+$/;
            if (!nameRegex.test(value)) {
                showError(input, 'Name should contain only letters and spaces');
                isValid = false;
                return;
            }
        }

        // Minimum length validation
        if (input.hasAttribute('minlength') && value.length < parseInt(input.getAttribute('minlength'))) {
            showError(input, `Minimum ${input.getAttribute('minlength')} characters required`);
            isValid = false;
            return;
        }
    });

    return isValid;
}

function showError(input, message) {
    input.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    
    input.parentElement.appendChild(errorDiv);
}

// Contact Form Handler
function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formId = form.id || 'contact-form';
    
    if (!validateForm(formId)) {
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    form.classList.add('loading');

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        form.classList.remove('loading');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Show success message
        showFormMessage(form, 'Thank you for your message! We will get back to you soon.', 'success');
        
        // Reset form
        form.reset();
    }, 2000);
}

function showFormMessage(form, message, type) {
    // Remove existing messages
    const existingMessage = form.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    form.appendChild(messageDiv);

    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 5000);
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
function addScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2563eb 0%, #10b981 100%);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(scrollBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });

    scrollBtn.addEventListener('click', scrollToTop);
}

// Intersection Observer for animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and other elements
    const animatedElements = document.querySelectorAll('.feature-card, .mv-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add scroll to top button
    addScrollToTopButton();

    // Setup scroll animations
    setupScrollAnimations();

    // Setup contact form if it exists
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);

    // Add hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .mv-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on window resize if desktop
    if (window.innerWidth > 768 && mobileMenuBtn && navMenu) {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Enhanced responsive functionality
function handleResponsiveLayout() {
    const screenWidth = window.innerWidth;
    
    // Add responsive classes based on screen size
    if (screenWidth <= 768) {
        document.body.classList.add('mobile-layout');
    } else {
        document.body.classList.remove('mobile-layout');
    }
    
    // Adjust hero section height for different screen sizes
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        if (screenWidth <= 480) {
            heroSection.style.minHeight = '60vh';
        } else if (screenWidth <= 768) {
            heroSection.style.minHeight = '70vh';
        } else {
            heroSection.style.minHeight = '100vh';
        }
    }
}

// Initial call
handleResponsiveLayout();

// Listen for resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResponsiveLayout, 250);
});

// Touch event support for better mobile experience
document.addEventListener('touchstart', function() {}, true);

// Prevent double tap zoom on iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Enhanced scroll behavior for mobile
if ('ontouchstart' in window || navigator.maxTouchPoints) {
    // On mobile devices, use passive listeners for better performance
    window.addEventListener('scroll', debouncedScrollHandler, { passive: true });
} else {
    // On desktop, use the original scroll handler
    window.addEventListener('scroll', debouncedScrollHandler);
}

// Improved mobile menu toggle with ARIA attributes
function toggleMobileMenu() {
    if (mobileMenuBtn && navMenu) {
        const isActive = navMenu.classList.contains('active');
        
        mobileMenuBtn.classList.toggle('active', !isActive);
        navMenu.classList.toggle('active', !isActive);
        
        // Set ARIA attributes for accessibility
        mobileMenuBtn.setAttribute('aria-expanded', !isActive);
        navMenu.setAttribute('aria-hidden', isActive);
    }
}

// Update mobile menu button if it exists
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    if (
        navMenu && 
        navMenu.classList.contains('active') && 
        !navMenu.contains(event.target) && 
        !mobileMenuBtn.contains(event.target)
    ) {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
    }
});

// Close mobile menu with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
        mobileMenuBtn.focus(); // Return focus to the toggle button
    }
});

// Optimize animations for mobile devices
function isMobileDevice() {
    return window.innerWidth <= 768;
}

// Reduce animations on mobile for better performance
if (isMobileDevice()) {
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
} else {
    document.documentElement.style.setProperty('--animation-duration', '0.6s');
}

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// Performance optimizations
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const loadAllImages = () => {
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        };
        window.addEventListener('load', loadAllImages);
    }
}

// Implement image preloading for critical resources
function preloadCriticalResources() {
    const criticalImages = [
        'assets/images/logo.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Optimize resource loading based on connection speed
function optimizeForConnection() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType.includes('slow')) {
            document.body.classList.add('slow-connection');
        }
    }
}

// Optimize DOM ready execution with performance consideration
function initializeApp() {
    // Add loading="lazy" to all images for native lazy loading
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Optimize for connection speed
    optimizeForConnection();
    
    // Initialize lazy loading
    lazyLoadImages();
}

// Use requestIdleCallback for non-critical initialization
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        initializeApp();
    });
} else {
    // Fallback for browsers that don't support requestIdleCallback
    document.addEventListener('DOMContentLoaded', initializeApp);
}

// Add performance monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                // Log performance metrics
                console.log(`Page load time: ${loadTime}ms`);
                
                // You can send this data to analytics if needed
                // analytics.track('performance', { loadTime });
            }, 0);
        });
    }
}

// Call performance measurement
measurePerformance();

// Implement a simple image gallery lightbox for portfolio images
function initImageLightbox() {
    const images = document.querySelectorAll('img[data-lightbox]');
    
    images.forEach(img => {
        img.style.cursor = 'pointer';
        
        img.addEventListener('click', () => {
            // Create lightbox overlay
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.zIndex = '9999';
            overlay.style.cursor = 'pointer';
            
            // Create image in lightbox
            const lightboxImg = new Image();
            lightboxImg.src = img.src;
            lightboxImg.style.maxWidth = '90%';
            lightboxImg.style.maxHeight = '90%';
            lightboxImg.style.objectFit = 'contain';
            
            // Add to overlay
            overlay.appendChild(lightboxImg);
            
            // Close on click
            overlay.addEventListener('click', () => {
                document.body.removeChild(overlay);
            });
            
            // Add to page
            document.body.appendChild(overlay);
        });
    });
}

// Initialize lightbox if images exist
if (document.querySelectorAll('img[data-lightbox]').length > 0) {
    initImageLightbox();
}

// Add a simple analytics tracking snippet
function trackPageView() {
    // Placeholder for analytics tracking
    // In production, you would connect this to Google Analytics, etc.
    console.log('Page view tracked');
}

// Track initial page view
trackPageView();

// Add a function to handle external links
function handleExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    
    links.forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.setAttribute('rel', 'noopener noreferrer');
            link.setAttribute('target', '_blank');
        }
    });
}

// Handle external links
handleExternalLinks();

// Add smooth scrolling enhancement
function enhanceSmoothScrolling() {
    // Check if smooth scrolling is supported
    if ('scrollBehavior' in document.documentElement.style) {
        // Native smooth scrolling is supported
        return;
    }
    
    // Fallback for browsers that don't support smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Simple polyfill for smooth scrolling
                const startY = window.pageYOffset;
                const targetY = targetElement.offsetTop - 70; // Account for fixed header
                const distance = targetY - startY;
                const duration = 500; // ms
                let startTime = null;
                
                const animation = (currentTime) => {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    
                    // Ease-in-out function
                    const easeInOutCubic = progress < 0.5 
                        ? 4 * progress * progress * progress 
                        : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
                    
                    window.scrollTo(0, startY + distance * easeInOutCubic);
                    
                    if (progress < 1) {
                        requestAnimationFrame(animation);
                    }
                };
                
                requestAnimationFrame(animation);
            }
        });
    });
}

// Enhance smooth scrolling
enhanceSmoothScrolling();

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuBtn && navMenu) {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Performance optimization - Debounce scroll events
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

// Debounced scroll handler
const debouncedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);
