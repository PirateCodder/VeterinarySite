// ===== VETSİM VETERİNER KLİNİĞİ İNTERAKTİF ÖZELLİKLER =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MODERN HORIZONTAL SLIDER =====
    const sliderContainer = document.querySelector('.slider-container');
    const indicators = document.querySelectorAll('.indicator');
    const prevButton = document.querySelector('.slider-btn-prev');
    const nextButton = document.querySelector('.slider-btn-next');
    const totalSlides = 6;
    let currentSlide = 0;
    let slideInterval;
    let isTransitioning = false;

    function updateSlider() {
        if (isTransitioning) return;
        isTransitioning = true;

        // Transform değerini hesapla (her slide %16.6667)
        const translateX = -(currentSlide * 16.6667);
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
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Scroll animasyonu için elementleri seç
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

    // ===== PARALLAX EFEKTİ =====
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

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

    // ===== HEADER SCROLL EFEKTİ =====
    const header = document.querySelector('header');
    const topBar = document.querySelector('.top-bar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
            if (topBar) {
                topBar.style.transform = 'translateY(-100%)';
            }
        } else {
            header.classList.remove('scrolled');
            if (topBar) {
                topBar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    });

    // ===== YÜKLEME ANİMASYONLARI =====
    setTimeout(function() {
        document.body.classList.add('loaded');
    }, 100);

    // ===== KARTLARA HOVER EFEKTİ =====
    const cards = document.querySelectorAll('.kart, .iletisim-kart, .ulasim-kart');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // ===== ACİL BUTON ÖZEL EFEKTLERİ =====
    const acilButtons = document.querySelectorAll('.acil-buton, .mega-acil-buton');
    acilButtons.forEach(button => {
        // Hover efekti
        button.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.icon');
            if (icon) {
                icon.style.animation = 'bounce 0.6s ease-in-out';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.icon');
            if (icon) {
                icon.style.animation = '';
            }
        });
        
        // Tıklama efekti
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });

    // ===== LOGO ANİMASYONU =====
    const logo = document.querySelector('.logo');
    if (logo) {
        let clickCount = 0;
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            clickCount++;
            
            if (clickCount >= 5) {
                // Easter egg: 5 kere tıklanırsa özel animasyon
                this.style.animation = 'wiggle 1s ease-in-out';
                setTimeout(() => {
                    this.style.animation = '';
                    clickCount = 0;
                }, 1000);
            }
        });
    }

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

    // ===== TOAST BİLDİRİMLERİ =====
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--accent-color)' : 'var(--warning-color)'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // ===== LİNK TIKLAMALARı =====
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            showToast('Yol tarifi için yeni sekme açılıyor...', 'success');
        });
    });

    // ===== BAŞLANGıÇ MESAJI =====
    console.log(`
    🐾 VetSim Veteriner Kliniği 🐾
    
    ✨ İnteraktif özellikler aktif!
    🏥 Patili dostlarınızın sağlığı bizim önceliğimiz!
    📞 7/24 Acil Destek: 0507 008 20 70
    📍 İzmir Karşıyaka - 24 Saat Açık
    
    🎨 Özel animasyonlar ve hover efektleri
    ⌨️  Kısayollar: Ctrl+T (Acil Arama), ESC (Harita kapat)
    🖱️  Logo'ya 5 kere tıklayın! (Easter egg)
    
    👩🏻‍⚕️ Veteriner Hekim Elif Simge TAŞKÖPRÜ
    💝 Sevgi İyileştirir
    `);

    // Hoş geldin animasyonu
    setTimeout(() => {
        showToast('🐾 VetSim Veteriner Kliniği\'ne Hoş Geldiniz!', 'success');
    }, 1000);
});

// ===== YARDIMCI FONKSİYONLAR =====

// Debounce fonksiyonu
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

// Throttle fonksiyonu
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

// Performans için scroll handler'ı optimize et
const optimizedScrollHandler = throttle(function() {
    // Scroll bazlı animasyonlar için optimize edilmiş handler
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);