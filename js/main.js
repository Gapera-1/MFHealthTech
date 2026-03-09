// ============================================
// MF HealthTech Industries - Main JavaScript
// ============================================

(function () {
    'use strict';

    // --- Utilities ---
    function debounce(func, wait) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () { func.apply(context, args); }, wait);
        };
    }

    // --- Mobile Menu ---
    var mobileMenuBtn = document.getElementById('mobile-menu-btn');
    var navMenu = document.querySelector('.nav-menu');

    function closeMobileMenu() {
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
        }
    }

    function toggleMobileMenu() {
        if (!mobileMenuBtn || !navMenu) return;
        var isActive = navMenu.classList.contains('active');
        mobileMenuBtn.classList.toggle('active', !isActive);
        navMenu.classList.toggle('active', !isActive);
        mobileMenuBtn.setAttribute('aria-expanded', String(!isActive));
        navMenu.setAttribute('aria-hidden', String(isActive));
    }

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        // Only hide nav from assistive tech on mobile
        if (window.innerWidth <= 768) {
            navMenu.setAttribute('aria-hidden', 'true');
        }
    }

    // Close menu on nav link click
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (
            navMenu &&
            navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)
        ) {
            closeMobileMenu();
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            closeMobileMenu();
            mobileMenuBtn.focus();
        }
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', debounce(function () {
        if (window.innerWidth > 768) {
            closeMobileMenu();
            if (navMenu) navMenu.removeAttribute('aria-hidden');
        } else if (navMenu && !navMenu.classList.contains('active')) {
            navMenu.setAttribute('aria-hidden', 'true');
        }
    }, 150));

    // --- Navbar Scroll Effect ---
    function setupNavbarScroll() {
        var navbar = document.querySelector('.navbar');
        if (!navbar) return;

        var onScroll = function () {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // --- Smooth Scrolling for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Scroll to Top Button ---
    function addScrollToTopButton() {
        var scrollBtn = document.createElement('button');
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>';
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.style.cssText =
            'position:fixed;bottom:30px;right:30px;width:50px;height:50px;' +
            'border-radius:50%;background:#0f62fe;' +
            'color:white;border:none;cursor:pointer;opacity:0;' +
            'visibility:hidden;transition:opacity 0.3s ease,visibility 0.3s ease,transform 0.3s ease;' +
            'z-index:999;box-shadow:0 4px 20px rgba(15,98,254,0.3);display:flex;' +
            'align-items:center;justify-content:center;';

        document.body.appendChild(scrollBtn);

        window.addEventListener('scroll', debounce(function () {
            if (window.scrollY > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        }, 100), { passive: true });

        scrollBtn.addEventListener('mouseenter', function () {
            scrollBtn.style.transform = 'translateY(-3px)';
        });
        scrollBtn.addEventListener('mouseleave', function () {
            scrollBtn.style.transform = 'translateY(0)';
        });

        scrollBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Animated Counter for Hero Stats ---
    function setupStatCounters() {
        if (!('IntersectionObserver' in window)) return;

        var statNumbers = document.querySelectorAll('.hero-stat-number');
        if (!statNumbers.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(function (el) { observer.observe(el); });
    }

    function animateCounter(el) {
        var text = el.textContent.trim();
        var suffix = '';
        var target = 0;
        var isDecimal = false;

        // Parse "500+", "2M+", "99.9%"
        var match = text.match(/^([\d.]+)([A-Za-z%+]*)\+?$/);
        if (!match) return;

        target = parseFloat(match[1]);
        suffix = match[2] || '';
        if (text.indexOf('+') !== -1 && suffix.indexOf('+') === -1) suffix += '+';
        isDecimal = match[1].indexOf('.') !== -1;

        var duration = 1500;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease-out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = eased * target;

            if (isDecimal) {
                el.textContent = current.toFixed(1) + suffix;
            } else {
                el.textContent = Math.floor(current) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = text;
            }
        }

        // Initialize to 0
        el.textContent = isDecimal ? '0.0' + suffix : '0' + suffix;
        requestAnimationFrame(step);
    }

    // --- Scroll Animations ---
    function setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        var animatedElements = document.querySelectorAll(
            '.feature-card, .mv-card, .value-card, .service-item, .join-card, ' +
            '.process-step, .stat-item, .info-card, .faq-item, .benefit-item, ' +
            '.leader-card, .section-badge, .section-header, .hero-stat, ' +
            '.testimonial-card, .position-card, .trusted-logos'
        );

        animatedElements.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(el);
        });
    }

    // Apply animation class
    function applyAnimateIn() {
        var style = document.createElement('style');
        style.textContent = '.animate-in { opacity: 1 !important; transform: translateY(0) !important; }';
        document.head.appendChild(style);
    }

    // --- Form Validation ---
    function validateForm(formId) {
        var form = document.getElementById(formId);
        if (!form) return false;

        var isValid = true;
        var formInputs = form.querySelectorAll('.form-input, .form-textarea');

        // Clear previous errors
        formInputs.forEach(function (input) {
            input.classList.remove('error');
            var errorMsg = input.parentElement.querySelector('.form-error');
            if (errorMsg) errorMsg.remove();
        });

        formInputs.forEach(function (input) {
            var value = input.value.trim();
            var fieldName = input.name || input.id;

            if (input.hasAttribute('required') && !value) {
                showError(input, fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/-/g, ' ') + ' is required');
                isValid = false;
                return;
            }

            if (input.type === 'email' && value) {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    showError(input, 'Please enter a valid email address');
                    isValid = false;
                    return;
                }
            }

            if (fieldName.includes('name') && value) {
                if (!/^[a-zA-Z\s''-]+$/.test(value)) {
                    showError(input, 'Name should contain only letters, spaces, hyphens, and apostrophes');
                    isValid = false;
                    return;
                }
            }

            if (input.hasAttribute('minlength') && value.length < parseInt(input.getAttribute('minlength'), 10)) {
                showError(input, 'Minimum ' + input.getAttribute('minlength') + ' characters required');
                isValid = false;
            }
        });

        return isValid;
    }

    function showError(input, message) {
        input.classList.add('error');
        var errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);
    }

    function handleContactForm(e) {
        e.preventDefault();
        var form = e.target;
        var formId = form.id || 'contact-form';

        // Honeypot check
        var honeypot = form.querySelector('input[name="website"]');
        if (honeypot && honeypot.value) return;

        if (!validateForm(formId)) return;

        var submitBtn = form.querySelector('button[type="submit"]');
        var originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span> Sending...';
        submitBtn.disabled = true;

        var formData = new FormData(form);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                if (data.success) {
                    showFormMessage(form, 'Thank you for your message! We will get back to you soon.', 'success');
                    form.reset();
                } else {
                    showFormMessage(form, 'Something went wrong. Please try again or email us directly.', 'error');
                }
            })
            .catch(function () {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showFormMessage(form, 'Network error. Please check your connection and try again.', 'error');
            });
    }

    function showFormMessage(form, message, type) {
        var existingMessage = form.querySelector('.success-message, .error-message');
        if (existingMessage) existingMessage.remove();

        var messageDiv = document.createElement('div');
        messageDiv.className = type + '-message';
        messageDiv.setAttribute('role', 'status');
        messageDiv.textContent = message;
        form.appendChild(messageDiv);

        setTimeout(function () {
            if (messageDiv.parentElement) messageDiv.remove();
        }, 5000);
    }

    // --- External Links Security ---
    function handleExternalLinks() {
        document.querySelectorAll('a[href^="http"]').forEach(function (link) {
            if (!link.href.includes(window.location.hostname)) {
                link.setAttribute('rel', 'noopener noreferrer');
                link.setAttribute('target', '_blank');
            }
        });
    }

    // --- FAQ Accordion ---
    function setupFaqAccordion() {
        var faqButtons = document.querySelectorAll('.faq-question');
        if (!faqButtons.length) return;

        faqButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                var isExpanded = this.getAttribute('aria-expanded') === 'true';
                var answer = this.nextElementSibling;

                // Close all others
                faqButtons.forEach(function (btn) {
                    btn.setAttribute('aria-expanded', 'false');
                    btn.parentElement.classList.remove('active');
                    btn.nextElementSibling.hidden = true;
                });

                // Toggle clicked
                if (!isExpanded) {
                    this.setAttribute('aria-expanded', 'true');
                    this.parentElement.classList.add('active');
                    answer.hidden = false;
                }
            });
        });
    }

    // --- Service Worker Registration ---
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(function () {
                // Service worker registration failed silently
            });
        }
    }

    // --- Initialize ---
    document.addEventListener('DOMContentLoaded', function () {
        applyAnimateIn();
        setupNavbarScroll();
        addScrollToTopButton();
        setupScrollAnimations();
        setupStatCounters();
        handleExternalLinks();
        setupFaqAccordion();

        var contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactForm);
        }
    });

    window.addEventListener('load', registerServiceWorker);
})();
