// ===================================
// MICRO-INTERACTIONS SYSTEM
// ===================================

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.main-nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;
            
            // Add haptic-like visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// SCROLL-TRIGGERED ANIMATIONS
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe publication cards with staggered animation
document.querySelectorAll('.publication-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    observer.observe(card);
});

// Observe publication items with staggered animation
document.querySelectorAll('.publication-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s`;
    observer.observe(item);
});

// Observe presentation items with staggered animation
document.querySelectorAll('.presentation-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s`;
    observer.observe(item);
});

// Observe media cards with staggered animation
document.querySelectorAll('.media-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s`;
    observer.observe(card);
});

// Observe section titles
document.querySelectorAll('.section-title').forEach(title => {
    title.style.opacity = '0';
    title.style.transform = 'translateY(20px)';
    title.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(title);
});

// ===================================
// NAVIGATION MICRO-INTERACTIONS
// ===================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
    const scrollPosition = window.scrollY + 150;

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

window.addEventListener('scroll', updateActiveLink);

// Smart navigation hide/show
let lastScroll = 0;
const nav = document.querySelector('.main-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 100) {
        nav.style.transform = 'translateY(-100%)';
    } else {
        nav.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// ===================================
// BUTTON HOVER MICRO-INTERACTIONS
// ===================================

// Primary button interactions
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        this.style.transform = 'translateY(-2px) scale(1.02)';
    });
    
    button.addEventListener('mouseleave', function(e) {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    button.addEventListener('mousedown', function(e) {
        this.style.transform = 'translateY(0) scale(0.98)';
    });
    
    button.addEventListener('mouseup', function(e) {
        this.style.transform = 'translateY(-2px) scale(1.02)';
    });
});

// Contact link interactions
document.querySelectorAll('.contact-link').forEach(link => {
    link.addEventListener('mouseenter', function(e) {
        const icon = document.createElement('span');
        icon.textContent = '→';
        icon.style.marginLeft = '8px';
        icon.style.display = 'inline-block';
        icon.style.transition = 'transform 0.3s ease';
        icon.className = 'link-arrow';
        
        if (!this.querySelector('.link-arrow')) {
            this.appendChild(icon);
            setTimeout(() => {
                icon.style.transform = 'translateX(4px)';
            }, 10);
        }
    });
    
    link.addEventListener('mouseleave', function(e) {
        const arrow = this.querySelector('.link-arrow');
        if (arrow) {
            arrow.style.transform = 'translateX(-8px)';
            arrow.style.opacity = '0';
            setTimeout(() => arrow.remove(), 300);
        }
    });
});

// ===================================
// CARD TILT EFFECT (3D)
// ===================================

document.querySelectorAll('.publication-card, .media-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===================================
// IMAGE ZOOM ON HOVER
// ===================================

document.querySelectorAll('.pub-image img, .image-frame img').forEach(img => {
    img.parentElement.addEventListener('mouseenter', function() {
        img.style.transform = 'scale(1.1)';
    });
    
    img.parentElement.addEventListener('mouseleave', function() {
        img.style.transform = 'scale(1)';
    });
});

// ===================================
// LINK RIPPLE EFFECT
// ===================================

document.querySelectorAll('.pub-link, .media-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(193, 125, 74, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        ripple.style.opacity = '1';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.style.transform = 'scale(2)';
            ripple.style.opacity = '0';
        }, 10);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===================================
// PARALLAX SCROLL EFFECTS
// ===================================

const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
}

// Parallax for book cover
const bookCover = document.querySelector('.book-cover');
if (bookCover) {
    window.addEventListener('scroll', () => {
        const rect = bookCover.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        if (scrollPercent > 0 && scrollPercent < 1) {
            const translateY = (scrollPercent - 0.5) * 30;
            bookCover.style.transform = `translateY(${translateY}px)`;
        }
    });
}

// ===================================
// TYPING INDICATOR FOR EMAIL
// ===================================

const emailLink = document.querySelector('a[href^="mailto"]');
if (emailLink) {
    emailLink.addEventListener('mouseenter', function() {
        const dots = document.createElement('span');
        dots.className = 'typing-dots';
        dots.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        dots.style.marginLeft = '4px';
        
        const style = document.createElement('style');
        style.textContent = `
            .typing-dots span {
                animation: blink 1.4s infinite;
                opacity: 0;
            }
            .typing-dots span:nth-child(2) {
                animation-delay: 0.2s;
            }
            .typing-dots span:nth-child(3) {
                animation-delay: 0.4s;
            }
            @keyframes blink {
                0%, 60%, 100% { opacity: 0; }
                30% { opacity: 1; }
            }
        `;
        
        if (!document.querySelector('.typing-dots-style')) {
            style.className = 'typing-dots-style';
            document.head.appendChild(style);
        }
        
        if (!this.querySelector('.typing-dots')) {
            this.appendChild(dots);
        }
    });
    
    emailLink.addEventListener('mouseleave', function() {
        const dots = this.querySelector('.typing-dots');
        if (dots) dots.remove();
    });
}

// ===================================
// SCROLL PROGRESS INDICATOR
// ===================================

const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(90deg, #c17d4a, #8b5a3c)';
    progressBar.style.transformOrigin = 'left';
    progressBar.style.transform = 'scaleX(0)';
    progressBar.style.transition = 'transform 0.1s ease-out';
    progressBar.style.zIndex = '10000';
    progressBar.style.width = '100%';
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        progressBar.style.transform = `scaleX(${scrollPercent})`;
    });
};

createScrollProgress();

// ===================================
// SMOOTH PAGE LOAD ANIMATION
// ===================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Animate hero elements
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.greeting, .name, .tribal-affiliation, .intro-lead, .intro-body, .future-position, .hero-image');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 200);
});

// ===================================
// CURSOR TRAIL EFFECT (SUBTLE)
// ===================================

let cursorTrail = [];
const maxTrailLength = 8;

document.addEventListener('mousemove', (e) => {
    // Only on larger screens
    if (window.innerWidth < 768) return;
    
    cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
    
    if (cursorTrail.length > maxTrailLength) {
        cursorTrail.shift();
    }
});

// ===================================
// CREDENTIAL ITEMS COUNTER ANIMATION
// ===================================

const animateCredentials = () => {
    const credentialValues = document.querySelectorAll('.credential-value');
    
    const credentialObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    entry.target.classList.add('counted');
                }, 100);
            }
        });
    }, { threshold: 0.5 });
    
    credentialValues.forEach(item => credentialObserver.observe(item));
};

animateCredentials();

// ===================================
// BOOK COVER FLOAT ANIMATION
// ===================================

if (bookCover) {
    let floatDirection = 1;
    let floatPosition = 0;
    
    setInterval(() => {
        floatPosition += 0.5 * floatDirection;
        if (floatPosition > 10 || floatPosition < -10) {
            floatDirection *= -1;
        }
        bookCover.style.transform = `translateY(${floatPosition}px)`;
    }, 50);
}
