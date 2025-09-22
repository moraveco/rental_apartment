
        // Custom Cursor
        const cursor = document.getElementById('cursor');
        const cursorFollower = document.getElementById('cursorFollower');

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 100);
        });

        // Scroll Progress
        window.addEventListener('scroll', () => {
            const scrollProgress = document.getElementById('scrollProgress');
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });

        // Navbar Scroll Effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Floating Book Button
        window.addEventListener('scroll', () => {
            const floatingBook = document.getElementById('floatingBook');
            if (window.scrollY > 800) {
                floatingBook.classList.add('visible');
            } else {
                floatingBook.classList.remove('visible');
            }
        });

        // Scroll to Section
        function scrollToSection(sectionId) {
            document.getElementById(sectionId).scrollIntoView({
                behavior: 'smooth'
            });
        }

        // Intersection Observer for Animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.section-title, .overview-text, .overview-visual, .feature-card').forEach(el => {
            observer.observe(el);
        });

        // Stagger feature card animations
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });

        // Gallery Slider Pause on Hover
        const gallerySlider = document.querySelector('.gallery-slider');
        gallerySlider.addEventListener('mouseenter', () => {
            gallerySlider.style.animationPlayState = 'paused';
        });
        gallerySlider.addEventListener('mouseleave', () => {
            gallerySlider.style.animationPlayState = 'running';
        });

        // Reviews Slider Auto-scroll
        const reviewsSlider = document.querySelector('.reviews-slider');
        let reviewScrollPosition = 0;

        function autoScrollReviews() {
            reviewScrollPosition += 1;
            if (reviewScrollPosition >= reviewsSlider.scrollWidth - reviewsSlider.clientWidth) {
                reviewScrollPosition = 0;
            }
            reviewsSlider.scrollLeft = reviewScrollPosition;
        }

        setInterval(autoScrollReviews, 50);

        // Pause auto-scroll on hover
        reviewsSlider.addEventListener('mouseenter', () => {
            clearInterval(autoScrollReviews);
        });

        // Contact Form Submission
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Add success animation
            const form = e.target;
            const button = form.querySelector('button');
            const originalText = button.textContent;
            
            button.textContent = 'Sending...';
            button.style.background = 'var(--primary-gold)';
            
            setTimeout(() => {
                button.textContent = 'Message Sent!';
                button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = 'linear-gradient(135deg, var(--primary-gold), var(--accent-copper))';
                    form.reset();
                }, 2000);
            }, 1000);
        });

        // Magnetic Button Effect
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });

        // Smooth Page Load Animation
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });

        // Mobile Touch Interactions
        if ('ontouchstart' in window) {
            document.querySelectorAll('.feature-card, .review-card, .contact-item').forEach(card => {
                card.addEventListener('touchstart', () => {
                    card.style.transform = 'scale(0.95)';
                });
                
                card.addEventListener('touchend', () => {
                    card.style.transform = 'scale(1)';
                });
            });
        }

        // Lazy Loading for Images (placeholder for future real images)
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Add fade-in animation when image loads
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);
                }
            });
        });

        // Observe gallery items and other image containers
        document.querySelectorAll('.gallery-item, .overview-image').forEach(img => {
            imageObserver.observe(img);
        });
// Hamburger Menu JavaScript
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const body = document.body;

// Toggle mobile menu
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

// Close mobile menu
function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    body.style.overflow = '';
}

// Event listeners
hamburger.addEventListener('click', toggleMobileMenu);
mobileOverlay.addEventListener('click', closeMobileMenu);

// Close menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Smooth scroll for navigation links
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