class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.loadTheme();
        this.initAnimations();
        this.initScrollEffects();
    }

    // Cache DOM Elements
    cacheDOM() {
        this.elements = {
            mobileMenu: document.getElementById('mobileMenu'),
            navMenu: document.querySelector('.nav-menu'),
            themeToggle: document.getElementById('themeToggle'),
            body: document.body,
            filterBtns: document.querySelectorAll('.filter-btn'),
            projectCards: document.querySelectorAll('.project-card'),
            skillFills: document.querySelectorAll('.skill-fill'),
            contactForm: document.getElementById('contactForm'),
            tabBtns: document.querySelectorAll('.tab-btn'),
            tabPanels: document.querySelectorAll('.tab-panel'),
            navbar: document.querySelector('.navbar'),
            sections: document.querySelectorAll('section[id]'),
            navLinks: document.querySelectorAll('.nav-link')
        };
    }

    // Event Bindings
    bindEvents() {
        // Mobile Menu
        this.elements.mobileMenu?.addEventListener('click', () => this.toggleMobileMenu());
        
        // Nav Links Close Mobile Menu
        this.elements.navMenu?.querySelectorAll('a').forEach(link => 
            link.addEventListener('click', () => this.closeMobileMenu())
        );

        // Smooth Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => 
            anchor.addEventListener('click', (e) => this.smoothScroll(e))
        );

        // Theme Toggle
        this.elements.themeToggle?.addEventListener('click', () => this.toggleTheme());

        // Project Filter
        this.elements.filterBtns.forEach(btn => 
            btn.addEventListener('click', () => this.filterProjects(btn))
        );

        // Contact Form
        this.elements.contactForm?.addEventListener('submit', (e) => this.handleContactForm(e));

        // About Tabs
        this.elements.tabBtns.forEach(btn => 
            btn.addEventListener('click', () => this.switchTab(btn))
        );
    }

    // Mobile Menu Toggle
    toggleMobileMenu() {
        this.elements.mobileMenu.classList.toggle('active');
        this.elements.navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    closeMobileMenu() {
        this.elements.mobileMenu.classList.remove('active');
        this.elements.navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    // Smooth Scrolling with Offset
    smoothScroll(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            this.closeMobileMenu();
        }
    }

    // Theme Management
    toggleTheme() {
        const currentTheme = this.elements.body.dataset.theme || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        this.elements.body.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon();
        this.updateNavbarBg();
    }

    updateThemeIcon() {
        const icon = this.elements.themeToggle.querySelector('i');
        icon.className = this.elements.body.dataset.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.elements.body.dataset.theme = savedTheme;
        this.updateThemeIcon();
        this.updateNavbarBg();
    }

    // Navbar Background
    updateNavbarBg() {
        const isDark = this.elements.body.dataset.theme === 'dark';
        const scrollThreshold = window.scrollY > 50;
        
        this.elements.navbar.style.background = scrollThreshold 
            ? (isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)')
            : (isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)');
        
        this.elements.navbar.style.backdropFilter = scrollThreshold ? 'blur(20px)' : 'blur(10px)';
    }

    // Project Filtering with Staggered Animation
    filterProjects(activeBtn) {
        this.elements.filterBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');

        const filterValue = activeBtn.dataset.filter;
        this.elements.projectCards.forEach((card, index) => {
            const matchesFilter = filterValue === 'all' || card.dataset.category === filterValue;
            
            if (matchesFilter) {
                setTimeout(() => card.classList.add('visible'), index * 120);
            } else {
                card.classList.remove('visible');
            }
        });
    }

    // About Tabs
    switchTab(activeBtn) {
        const targetTab = activeBtn.dataset.tab;
        
        // Reset all
        this.elements.tabBtns.forEach(btn => btn.classList.remove('active'));
        this.elements.tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Activate target
        activeBtn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    }

    // Contact Form Handler
    async handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const button = e.target.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        // Loading state
        button.textContent = 'Sending...';
        button.disabled = true;
        
        try {
            // Simulate API call (replace with real endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success feedback
            button.textContent = 'Sent! 🎉';
            button.style.background = 'var(--success, #10b981)';
            
            setTimeout(() => {
                e.target.reset();
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 2000);
            
        } catch (error) {
            button.textContent = 'Error! Try again';
            button.style.background = 'var(--error, #ef4444)';
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 2000);
        }
    }

    // Intersection Observer for Animations
    initAnimations() {
        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.15 });

        // Skills Animation
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.elements.skillFills.forEach((fill, index) => {
                        setTimeout(() => {
                            const width = fill.dataset.width;
                            fill.style.width = `${width}%`;
                            fill.textContent = `${width}%`;
                        }, index * 150);
                    });
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        // Observe elements
        document.querySelectorAll('.section, .project-card, .certificate-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            animateOnScroll.observe(el);
        });

        if (document.querySelector('.skills')) {
            skillsObserver.observe(document.querySelector('.skills'));
        }
    }

    // Scroll Effects
    initScrollEffects() {
        let ticking = false;
        
        const updateScroll = () => {
            this.updateNavbarBg();
            this.updateActiveNav();
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        }, { passive: true });
    }

    // Active Navigation Highlight
    updateActiveNav() {
        const scrollY = window.scrollY + window.innerHeight / 2;
        
        this.elements.sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isActive = rect.top <= 0 && rect.bottom >= 0;
            
            if (isActive) {
                const id = section.id;
                this.elements.navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Performance: Preload critical resources
if ('IntersectionObserver' in window) {
    console.log('✅ Modern browser detected - Full animations enabled');
} else {
    console.log('⚠️  Legacy browser - Basic functionality only');
}