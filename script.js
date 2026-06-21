/* ==========================================
   PARTICLES BACKGROUND
   ========================================== */
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = Math.min(80, Math.floor((this.canvas.width * this.canvas.height) / 15000));
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.1,
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p) => {
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Mouse interaction
            if (this.mouse.x !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.x += dx * force * 0.02;
                    p.y += dy * force * 0.02;
                }
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
            this.ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

/* ==========================================
   TYPING EFFECT
   ========================================== */
class TypeWriter {
    constructor(element, words, typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2000) {
        this.element = element;
        this.words = words;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.pauseDuration = pauseDuration;
        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const currentWord = this.words[this.wordIndex];

        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentWord.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let delay = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

        if (!this.isDeleting && this.charIndex === currentWord.length) {
            delay = this.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            delay = 400;
        }

        setTimeout(() => this.type(), delay);
    }
}

/* ==========================================
   SCROLL ANIMATIONS (Intersection Observer)
   ========================================== */
class ScrollAnimator {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.dataset.delay || 0;
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, parseInt(delay));
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        document.querySelectorAll('[data-animate]').forEach((el) => {
            this.observer.observe(el);
        });
    }
}

/* ==========================================
   COUNTER ANIMATION
   ========================================== */
class CounterAnimator {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        document.querySelectorAll('[data-count]').forEach((el) => {
            this.observer.observe(el);
        });
    }

    animateCounter(el) {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };

        requestAnimationFrame(update);
    }
}

/* ==========================================
   NAVBAR
   ========================================== */
class Navbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.toggle = document.getElementById('nav-toggle');
        this.links = document.getElementById('nav-links');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section, .hero');

        this.bindEvents();
        this.onScroll();
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.onScroll());

        this.toggle.addEventListener('click', () => {
            this.toggle.classList.toggle('active');
            this.links.classList.toggle('active');
        });

        this.navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                this.toggle.classList.remove('active');
                this.links.classList.remove('active');
            });
        });
    }

    onScroll() {
        // Scrolled style
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Active section
        let current = '';
        this.sections.forEach((section) => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

/* ==========================================
   CONTACT FORM
   ========================================== */
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const btn = this.form.querySelector('.btn');
        const originalText = btn.innerHTML;

        btn.innerHTML = `<span>Message Sent! ✓</span>`;
        btn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            this.form.reset();
        }, 3000);
    }
}

/* ==========================================
   SMOOTH REVEAL ON LOAD
   ========================================== */
function initHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero [data-animate]');
    heroElements.forEach((el) => {
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
            el.classList.add('visible');
        }, 300 + parseInt(delay));
    });
}

/* ==========================================
   INITIALIZATION
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Particles
    const canvas = document.getElementById('particles-canvas');
    if (canvas) new ParticleSystem(canvas);

    // Typing effect
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        new TypeWriter(typedEl, [
            'Computer Vision Engineer',
            'Machine Learning Expert',
            'Deep Learning Specialist',
            'AI Solutions Architect',
        ]);
    }

    // Navbar
    new Navbar();

    // Scroll animations
    new ScrollAnimator();

    // Counter animations
    new CounterAnimator();

    // Contact form
    new ContactForm();

    // Hero animation on load
    initHeroAnimations();
});
