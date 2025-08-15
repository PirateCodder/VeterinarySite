// ===== VETSİM VETERİNER KLİNİĞİ İNTERAKTİF ÖZELLİKLER =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MODERN HORIZONTAL SLIDER =====
    const sliderContainer = document.querySelector('.slider-container');
    const indicators = document.querySelectorAll('.indicator');
    const prevButton = document.querySelector('.slider-btn-prev');
    const nextButton = document.querySelector('.slider-btn-next');
    const totalSlides = 4;
    let currentSlide = 0;
    let slideInterval;
    let isTransitioning = false;

    function updateSlider() {
        if (isTransitioning) return;
        isTransitioning = true;

        // Transform değerini hesapla (her slide %25)
        const translateX = -(currentSlide * 25);
        sliderContainer.style.transform = `translateX(${translateX}%)`;

        // Indicator'ları güncelle
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });

        // Animasyon bitimini bekle
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    function goToSlide(index) {
        if (index !== currentSlide && !isTransitioning) {
            currentSlide = index;
            updateSlider();
        }
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    // Slider başlat
    const slider = document.getElementById('slider');
    if (slider && sliderContainer) {
        startSlider();

        // Hover olayları
        slider.addEventListener('mouseenter', stopSlider);
        slider.addEventListener('mouseleave', startSlider);

        // Buton olayları
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                stopSlider();
                prevSlide();
                setTimeout(startSlider, 4000);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                stopSlider();
                nextSlide();
                setTimeout(startSlider, 4000);
            });
        }

        // Indicator olayları
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopSlider();
                goToSlide(index);
                setTimeout(startSlider, 4000);
            });
        });

        // Keyboard kontrolleri
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                stopSlider();
                prevSlide();
                setTimeout(startSlider, 4000);
            } else if (e.key === 'ArrowRight') {
                stopSlider();
                nextSlide();
                setTimeout(startSlider, 4000);
            }
        });

        // Touch/Swipe desteği
        let startX = 0;
        let endX = 0;

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopSlider();
        });

        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            setTimeout(startSlider, 4000);
        }

        // Sayfa görünürlük kontrolü
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopSlider();
            } else {
                startSlider();
            }
        });
    }

// ===== SCROLL ANİMASYONLARI =====
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Performance: tek seferlik animasyon
            }
        });
    }, observerOptions);

    // Scroll animasyonu için elementleri seç
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

    // ===== SMOOTH SCROLL =====
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== TELEFON NUMARASI ANİMASYONU =====
    const phoneButtons = document.querySelectorAll('a[href^="tel:"]');
    phoneButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Buton tıklandığında kısa bir animasyon
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Tıklama ses efekti (opsiyonel)
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        });
    });

    // ===== HEADER SCROLL EFEKTİ (OPTİMİZE EDİLMİŞ) =====
    const header = document.querySelector('header');
    let ticking = false;

    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });

    // ===== YÜKLEME ANİMASYONLARI =====
    setTimeout(function() {
        document.body.classList.add('loaded');
    }, 100);

    // ===== BASIT HOVER EFEKTLERİ (CSS'DE HALLEDİLDİ) =====
    // Hover efektleri CSS'de daha performanslı

    // ===== HARİTA İNTERAKTİVİTESİ =====
    const mapContainer = document.querySelector('.harita-container');
    if (mapContainer) {
        const iframe = mapContainer.querySelector('iframe');
        
        mapContainer.addEventListener('click', function() {
            iframe.style.pointerEvents = 'auto';
        });
        
        document.addEventListener('click', function(e) {
            if (!mapContainer.contains(e.target)) {
                iframe.style.pointerEvents = 'none';
            }
        });
    }

    // ===== KEYBOARD NAVİGASYON =====
    document.addEventListener('keydown', function(e) {
        // Escape tuşu ile haritayı kapat
        if (e.key === 'Escape') {
            const iframe = document.querySelector('.harita-container iframe');
            if (iframe) {
                iframe.style.pointerEvents = 'none';
            }
        }
        
        // Ctrl + Tel: Acil arama kısayolu
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            const phoneButton = document.querySelector('a[href="tel:+905070082070"]');
            if (phoneButton) {
                phoneButton.click();
            }
        }
    });

    // ===== LOADING STATES =====
    function showLoading(element) {
        element.classList.add('loading');
    }

    function hideLoading(element) {
        element.classList.remove('loading');
    }

    // ===== PRODUCTION İÇİN TEMİZLENDİ =====
    console.log('🐾 VetSim Veteriner Kliniği - Website loaded successfully!');
});

// ===== YARDIMCI FONKSİYONLAR (OPTİMİZE EDİLMİŞ) =====

// Sadece kullanılan throttle fonksiyonu
function throttle(func, limit) {
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
