// ===== VETSIM PREMIUM VETERINARY CLINIC ===== 
// Luxury Interactive Features & Animations

'use strict';

// ===== GLOBAL CONFIGURATION ===== 
const CONFIG = {
    animations: {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        stagger: 100
    },
    hero: {
        autoPlay: true,
        duration: 8000,
        transition: 1000
    },
    scroll: {
        threshold: 100,
        debounce: 16
    },
    counters: {
        duration: 2000,
        easing: 'easeOutQuart'
    }
};

// ===== UTILITY FUNCTIONS ===== 
class Utils {
    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    static easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    static isElementInViewport(el, threshold = 0) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return (
            rect.top <= windowHeight - threshold &&
            rect.bottom >= threshold
        );
    }

    static createElement(tag, className, content) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.innerHTML = content;
        return element;
    }

    static addMultipleEventListeners(element, events, handler) {
        events.split(' ').forEach(event => 
            element.addEventListener(event, handler)
        );
    }
}

// ===== LOADING SCREEN MANAGER ===== 
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.loadingBar = document.querySelector('.loading-bar');
        this.resources = [];
        this.loadedCount = 0;
        this.isLoaded = false;
    }

    init() {
        this.collectResources();
        this.startLoading();
        
        // Minimum loading time for smooth experience
        setTimeout(() => {
            this.complete();
        }, 400);
    }

    collectResources() {
        // Collect images
        const images = Array.from(document.querySelectorAll('img'));
        images.forEach(img => {
            if (!img.complete) {
                this.resources.push(img);
                img.addEventListener('load', () => this.onResourceLoad());
                img.addEventListener('error', () => this.onResourceLoad());
            }
        });

        // Add hero background images
        const heroSlides = document.querySelectorAll('.hero-slide');
        heroSlides.forEach(slide => {
            const bgImage = slide.dataset.bg;
            if (bgImage) {
                const img = new Image();
                img.src = bgImage;
                this.resources.push(img);
                img.addEventListener('load', () => this.onResourceLoad());
                img.addEventListener('error', () => this.onResourceLoad());
            }
        });
    }

    startLoading() {
        if (this.resources.length === 0) {
            this.updateProgress(100);
            return;
        }

        // Simulate progressive loading
        this.progressInterval = setInterval(() => {
            const progress = Math.min((this.loadedCount / this.resources.length) * 100, 95);
            this.updateProgress(progress);
        }, 50);
    }

    onResourceLoad() {
        this.loadedCount++;
        if (this.loadedCount >= this.resources.length) {
            this.updateProgress(100);
        }
    }

    updateProgress(progress) {
        if (this.loadingBar) {
            this.loadingBar.style.width = `${progress}%`;
        }
    }

    complete() {
        if (this.isLoaded) return;
        this.isLoaded = true;

        clearInterval(this.progressInterval);
        this.updateProgress(100);

        // Hide loading screen with smooth animation
        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.classList.add('hidden');
                
                // Initialize other components after loading
                setTimeout(() => {
                    document.body.classList.add('loaded');
                    this.initializeComponents();
                }, 500);
            }
        }, 300);
    }

    initializeComponents() {
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: CONFIG.animations.duration,
                easing: CONFIG.animations.easing,
                once: true,
                mirror: false,
                offset: 50,
                delay: 100
            });
        }

        // Initialize other managers
        navigationManager.init();
        heroManager.init();
        statsManager.init();
        scrollManager.init();
        interactionManager.init();
    }
}

// ===== NAVIGATION MANAGER ===== 
class NavigationManager {
    constructor() {
        this.nav = document.getElementById('premiumNav');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileToggle = document.getElementById('mobileMenuToggle');
        this.isScrolled = false;
        this.activeSection = 'hero';
    }

    init() {
        this.bindEvents();
        this.updateActiveLink();
    }

    bindEvents() {
        // Smooth scroll for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.scrollToElement(targetElement);
                    this.setActiveLink(link);
                }
            });
        });

        // Scroll event for nav styling
        const scrollHandler = Utils.throttle(() => {
            this.handleScroll();
        }, CONFIG.scroll.debounce);

        window.addEventListener('scroll', scrollHandler, { passive: true });

        // Mobile menu toggle
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;
        const shouldBeScrolled = scrollTop > CONFIG.scroll.threshold;

        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            this.nav.classList.toggle('scrolled', this.isScrolled);
        }

        // Update active section
        this.updateActiveSection();
    }

    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollTop;
            const sectionHeight = rect.height;

            if (scrollTop >= sectionTop - windowHeight / 3 && 
                scrollTop < sectionTop + sectionHeight - windowHeight / 3) {
                const sectionId = section.getAttribute('id');
                if (sectionId !== this.activeSection) {
                    this.activeSection = sectionId;
                    this.updateActiveLink();
                }
            }
        });
    }

    updateActiveLink() {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${this.activeSection}`;
            link.classList.toggle('active', isActive);
        });
    }

    setActiveLink(clickedLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    }

    scrollToElement(element) {
        const navHeight = this.nav.offsetHeight;
        const elementTop = element.offsetTop - navHeight;
        
        window.scrollTo({
            top: elementTop,
            behavior: 'smooth'
        });
    }

    toggleMobileMenu() {
        // Implementation for mobile menu (if needed)
        console.log('Mobile menu toggle');
    }
}

// ===== HERO SLIDER MANAGER ===== 
class HeroManager {
    constructor() {
        this.heroSection = document.querySelector('.hero-section');
        this.slides = document.querySelectorAll('.hero-slide');
        this.indicators = document.querySelectorAll('.hero-indicator');
        this.prevButton = document.getElementById('heroPrev');
        this.nextButton = document.getElementById('heroNext');
        
        this.currentSlide = 0;
        this.isTransitioning = false;
        this.autoPlayInterval = null;
        this.isPaused = false;
    }

    init() {
        if (!this.heroSection) return;

        this.setupSlideBackgrounds();
        this.bindEvents();
        this.startAutoPlay();
        this.preloadImages();
    }

    setupSlideBackgrounds() {
        this.slides.forEach(slide => {
            const bgImage = slide.dataset.bg;
            if (bgImage) {
                slide.style.backgroundImage = `url(${bgImage})`;
            }
        });
    }

    bindEvents() {
        // Navigation buttons
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => {
                this.previousSlide();
            });
        }

        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.nextSlide();
            });
        }

        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Pause on hover
        this.heroSection.addEventListener('mouseenter', () => {
            this.pauseAutoPlay();
        });

        this.heroSection.addEventListener('mouseleave', () => {
            this.resumeAutoPlay();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        // Touch/Swipe support
        this.addTouchSupport();

        // Page visibility API
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else {
                this.resumeAutoPlay();
            }
        });
    }

    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        const threshold = 50;

        this.heroSection.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.pauseAutoPlay();
        }, { passive: true });

        this.heroSection.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }

            setTimeout(() => this.resumeAutoPlay(), 1000);
        }, { passive: true });
    }

    preloadImages() {
        this.slides.forEach(slide => {
            const bgImage = slide.dataset.bg;
            if (bgImage) {
                const img = new Image();
                img.src = bgImage;
            }
        });
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;

        this.isTransitioning = true;
        
        // Update slides
        this.slides[this.currentSlide].classList.remove('active');
        this.slides[index].classList.add('active');

        // Update indicators
        this.indicators[this.currentSlide]?.classList.remove('active');
        this.indicators[index]?.classList.add('active');

        this.currentSlide = index;

        // Reset transition lock
        setTimeout(() => {
            this.isTransitioning = false;
        }, CONFIG.hero.transition);

        // Restart autoplay
        this.restartAutoPlay();
    }

    startAutoPlay() {
        if (!CONFIG.hero.autoPlay) return;
        
        this.autoPlayInterval = setInterval(() => {
            if (!this.isPaused) {
                this.nextSlide();
            }
        }, CONFIG.hero.duration);
    }

    pauseAutoPlay() {
        this.isPaused = true;
    }

    resumeAutoPlay() {
        this.isPaused = false;
    }

    restartAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }

    destroy() {
        clearInterval(this.autoPlayInterval);
    }
}

// ===== STATISTICS COUNTER MANAGER ===== 
class StatsManager {
    constructor() {
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.hasAnimated = false;
    }

    init() {
        if (this.statNumbers.length === 0) return;

        // Setup intersection observer for triggering animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.hasAnimated = true;
                    this.animateCounters();
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });

        this.statNumbers[0]?.parentElement.parentElement && 
        observer.observe(this.statNumbers[0].parentElement.parentElement);
    }

    animateCounters() {
        this.statNumbers.forEach((numberElement, index) => {
            const targetValue = parseInt(numberElement.dataset.count) || 0;
            const startTime = performance.now();
            const delay = index * CONFIG.animations.stagger;

            setTimeout(() => {
                this.animateNumber(numberElement, targetValue, startTime);
            }, delay);
        });
    }

    animateNumber(element, target, startTime) {
        const duration = CONFIG.counters.duration;
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = Utils.easeOutQuart(progress);
            
            const currentValue = Math.floor(target * easedProgress);
            element.textContent = this.formatNumber(currentValue);

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = this.formatNumber(target);
            }
        };

        requestAnimationFrame(updateNumber);
    }

    formatNumber(number) {
        // Add formatting logic if needed (e.g., thousands separator)
        return number.toString();
    }
}

// ===== SCROLL MANAGER ===== 
class ScrollManager {
    constructor() {
        this.backToTopButton = document.getElementById('backToTop');
        this.isVisible = false;
    }

    init() {
        if (!this.backToTopButton) return;

        this.bindEvents();
        this.handleScroll(); // Initial check
    }

    bindEvents() {
        // Throttled scroll handler
        const scrollHandler = Utils.throttle(() => {
            this.handleScroll();
        }, CONFIG.scroll.debounce);

        window.addEventListener('scroll', scrollHandler, { passive: true });

        // Back to top button click
        this.backToTopButton.addEventListener('click', () => {
            this.scrollToTop();
        });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;
        const shouldBeVisible = scrollTop > window.innerHeight / 2;

        if (shouldBeVisible !== this.isVisible) {
            this.isVisible = shouldBeVisible;
            this.backToTopButton.classList.toggle('visible', this.isVisible);
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ===== INTERACTION MANAGER ===== 
class InteractionManager {
    constructor() {
        this.rippleElements = document.querySelectorAll('[class*="btn"], [class*="button"]');
    }

    init() {
        this.setupRippleEffects();
        this.setupHoverEffects();
        this.setupFormEnhancements();
        this.setupImageLazyLoading();
        this.setupAccessibilityFeatures();
    }

    setupRippleEffects() {
        this.rippleElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRipple(e, element);
            });
        });
    }

    createRipple(event, element) {
        // Skip if element already has a ripple container
        if (element.querySelector('.btn-ripple')) return;

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = Utils.createElement('div', 'ripple-effect');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        // Add animation keyframes if not already present
        this.addRippleKeyframes();

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addRippleKeyframes() {
        if (document.getElementById('ripple-keyframes')) return;

        const style = Utils.createElement('style', null, `
            @keyframes ripple-animation {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `);
        style.id = 'ripple-keyframes';
        document.head.appendChild(style);
    }

    setupHoverEffects() {
        // Enhanced hover effects for service cards
        const serviceCards = document.querySelectorAll('.service-card, .featured-service, .gallery-item');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.enhanceCardHover(card, true);
            });

            card.addEventListener('mouseleave', () => {
                this.enhanceCardHover(card, false);
            });
        });
    }

    enhanceCardHover(card, isHovering) {
        const icon = card.querySelector('i, .service-icon, .card-icon');
        
        if (icon) {
            if (isHovering) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            } else {
                icon.style.transform = '';
            }
        }
    }

    setupFormEnhancements() {
        // Enhanced form interactions (if forms are added later)
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement?.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                input.parentElement?.classList.remove('focused');
                if (input.value) {
                    input.parentElement?.classList.add('filled');
                } else {
                    input.parentElement?.classList.remove('filled');
                }
            });
        });
    }

    setupImageLazyLoading() {
        // Enhanced image loading with progressive blur
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        img.style.filter = 'blur(10px)';
        img.style.transition = 'filter 0.3s ease';

        const imageLoader = new Image();
        imageLoader.onload = () => {
            img.src = src;
            img.style.filter = 'blur(0)';
            img.classList.add('loaded');
        };
        imageLoader.src = src;
    }

    setupAccessibilityFeatures() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Tab navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
            
            // Emergency call shortcut (Ctrl + E)
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                const emergencyButton = document.querySelector('a[href="tel:+905070082070"]');
                emergencyButton?.click();
            }
        });

        // Remove keyboard navigation class on mouse use
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Enhanced focus indicators
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.setAttribute('data-focused', 'true');
            });

            element.addEventListener('blur', () => {
                element.removeAttribute('data-focused');
            });
        });
    }
}

// ===== PERFORMANCE MONITOR ===== 
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: [],
            memory: [],
            timing: {}
        };
        this.isMonitoring = false;
    }

    start() {
        if (this.isMonitoring) return;
        this.isMonitoring = true;

        // FPS monitoring
        this.monitorFPS();
        
        // Memory monitoring (if available)
        if (performance.memory) {
            this.monitorMemory();
        }

        // Page timing
        this.recordPageTiming();
    }

    monitorFPS() {
        let lastTime = performance.now();
        let frames = 0;

        const tick = (currentTime) => {
            frames++;
            
            if (currentTime >= lastTime + 1000) {
                this.metrics.fps.push(frames);
                frames = 0;
                lastTime = currentTime;
                
                // Keep only last 60 seconds of data
                if (this.metrics.fps.length > 60) {
                    this.metrics.fps.shift();
                }
            }

            if (this.isMonitoring) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    }

    monitorMemory() {
        setInterval(() => {
            if (performance.memory) {
                this.metrics.memory.push({
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit,
                    timestamp: Date.now()
                });

                // Keep only last 5 minutes of data
                if (this.metrics.memory.length > 300) {
                    this.metrics.memory.shift();
                }
            }
        }, 1000);
    }

    recordPageTiming() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = performance.timing;
                this.metrics.timing = {
                    dns: timing.domainLookupEnd - timing.domainLookupStart,
                    connect: timing.connectEnd - timing.connectStart,
                    response: timing.responseEnd - timing.responseStart,
                    dom: timing.domContentLoadedEventEnd - timing.navigationStart,
                    load: timing.loadEventEnd - timing.navigationStart
                };

                if (process.env.NODE_ENV === 'development') {
                    console.log('Performance Metrics:', this.metrics.timing);
                }
            }, 0);
        });
    }

    getMetrics() {
        return {
            ...this.metrics,
            averageFPS: this.metrics.fps.length > 0 
                ? this.metrics.fps.reduce((a, b) => a + b, 0) / this.metrics.fps.length 
                : 0
        };
    }

    stop() {
        this.isMonitoring = false;
    }
}

// ===== GLOBAL MANAGERS INITIALIZATION ===== 
const loadingManager = new LoadingManager();
const navigationManager = new NavigationManager();
const heroManager = new HeroManager();
const statsManager = new StatsManager();
const scrollManager = new ScrollManager();
const interactionManager = new InteractionManager();
const performanceMonitor = new PerformanceMonitor();

// ===== APPLICATION INITIALIZATION ===== 
class VetSimApp {
    constructor() {
        this.isInitialized = false;
        this.managers = {
            loading: loadingManager,
            navigation: navigationManager,
            hero: heroManager,
            stats: statsManager,
            scroll: scrollManager,
            interaction: interactionManager,
            performance: performanceMonitor
        };
    }

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        // Start performance monitoring in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.managers.performance.start();
        }

        // Initialize loading manager (will handle other managers)
        this.managers.loading.init();

        // Global error handling
        this.setupErrorHandling();

        // Console greeting
        this.showConsoleGreeting();
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('VetSim Error:', e.error);
            // Could send to error tracking service
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('VetSim Unhandled Promise Rejection:', e.reason);
            // Could send to error tracking service
        });
    }

    showConsoleGreeting() {
        const styles = [
            'color: #6366f1',
            'font-size: 20px',
            'font-weight: bold',
            'text-shadow: 2px 2px 4px rgba(0,0,0,0.3)'
        ].join(';');

        console.log('%c🐾 VetSim Premium Veterinary Clinic', styles);
        console.log('%cWebsite loaded successfully! Premium experience activated.', 'color: #10b981; font-size: 14px;');
        console.log('%c💝 Made with love for our furry friends', 'color: #ec4899; font-size: 12px; font-style: italic;');
    }

    destroy() {
        // Cleanup all managers
        Object.values(this.managers).forEach(manager => {
            if (typeof manager.destroy === 'function') {
                manager.destroy();
            }
        });
        this.isInitialized = false;
    }
}

// ===== INITIALIZE APPLICATION ===== 
const vetSimApp = new VetSimApp();

// DOM Content Loaded Event
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        vetSimApp.init();
    });
} else {
    vetSimApp.init();
}

// Export for potential external use
window.VetSimApp = vetSimApp;

// ===== ADDITIONAL PREMIUM FEATURES ===== 

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
    script.onload = () => {
        window.__forceSmoothScrollPolyfill__ = true;
        window.smoothscroll.polyfill();
    };
    document.head.appendChild(script);
}

// Service Worker registration for PWA features (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is available
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

// Dark mode detection and handling
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Could add dark mode support here
    document.documentElement.setAttribute('data-theme', 'dark');
}

// Enhanced console commands for development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.vetSim = {
        version: '2.0.0',
        config: CONFIG,
        managers: vetSimApp.managers,
        utils: Utils,
        goToSlide: (index) => heroManager.goToSlide(index),
        getPerformance: () => performanceMonitor.getMetrics(),
        toggleAutoPlay: () => {
            CONFIG.hero.autoPlay = !CONFIG.hero.autoPlay;
            if (CONFIG.hero.autoPlay) {
                heroManager.startAutoPlay();
            } else {
                heroManager.destroy();
            }
        }
    };
    
    console.log('%cDeveloper Tools Available:', 'color: #f59e0b; font-weight: bold;');
    console.log('• vetSim.goToSlide(index) - Navigate to hero slide');
    console.log('• vetSim.getPerformance() - Get performance metrics');
    console.log('• vetSim.toggleAutoPlay() - Toggle hero autoplay');
    console.log('• vetSim.config - View configuration');
}
