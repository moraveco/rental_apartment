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
/* ===== ADMIN KALENDÁŘ – izolovaný jen pro sekci #calendar ===== */
const AdminCalendar = (() => {
    const monthNames = [
        "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
        "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
    ];
    const dayNames = ["Po","Út","St","Čt","Pá","So","Ne"]; // ISO start v pondělí

    let inited = false;
    let state = {
        month: new Date().getMonth(),      // 0-11
        year: new Date().getFullYear()
    };

    // Bezpečně najdeme elementy pouze uvnitř sekce Kalendář
    const getEls = () => {
        const section = document.getElementById('calendar');
        if (!section) return {};
        return {
            section,
            grid: section.querySelector('#adminCalendarGrid'),
            label: section.querySelector('#adminMonthYearLabel'),
            prev: section.querySelector('#adminCalPrev'),
            next: section.querySelector('#adminCalNext')
        };
    };

    const setMonthLabel = (labelEl, month, year) => {
        if (labelEl) labelEl.textContent = `${monthNames[month]} ${year}`;
    };

    const addDayHeaders = (gridEl) => {
        dayNames.forEach(d => {
            const h = document.createElement('div');
            h.className = 'cal-head';
            h.textContent = d;
            gridEl.appendChild(h);
        });
    };

    const render = async () => {
        const { grid, label } = getEls();
        if (!grid || !label) return;

        grid.innerHTML = '';
        setMonthLabel(label, state.month, state.year);
        addDayHeaders(grid);

        // Výpočet posunu (pondělí = 0)
        const firstDate = new Date(state.year, state.month, 1);
        let firstDay = firstDate.getDay(); // 0=Ne ... 6=So
        firstDay = (firstDay === 0 ? 6 : firstDay - 1);
        const daysInMonth = new Date(state.year, state.month + 1, 0).getDate();

        // Načtení dat (rezervace/blokace) – obalte try/catch
        const monthStr = String(state.month + 1).padStart(2, '0');
        let reservations = [];
        let blocked = [];
        try {
            const [resRes, blkRes] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/reservations.php?month=${monthStr}&year=${state.year}`).then(r => r.json()).catch(() => ({})),
                fetch(`${API_BASE_URL}/admin/block-dates.php?month=${monthStr}&year=${state.year}`).then(r => r.json()).catch(() => ({}))
            ]);
            if (resRes && resRes.success) reservations = resRes.data || [];
            if (blkRes && blkRes.success) blocked = blkRes.data || [];
        } catch (e) {
            console.error('Chyba načítání kalendáře:', e);
        }

        // Indexace podle dne
        const resByDay = {};
        reservations.forEach(r => {
            const from = new Date(r.check_in);
            const to = new Date(r.check_out);
            const d = new Date(from);
            while (d <= to) {
                if (d.getMonth() === state.month && d.getFullYear() === state.year) {
                    const key = d.getDate();
                    (resByDay[key] ||= []).push(r);
                }
                d.setDate(d.getDate() + 1);
            }
        });
        const blkByDay = {};
        blocked.forEach(b => {
            const d = new Date(b.date);
            if (d.getMonth() === state.month && d.getFullYear() === state.year) {
                const key = d.getDate();
                (blkByDay[key] ||= []).push(b);
            }
        });

        // Prázdné buňky před 1. dnem
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'cal-empty';
            grid.appendChild(empty);
        }

        // Dny v měsíci
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.className = 'cal-day';
            cell.dataset.date = `${state.year}-${monthStr}-${String(day).padStart(2, '0')}`;

            const dn = document.createElement('div');
            dn.className = 'day-number';
            dn.textContent = day;
            cell.appendChild(dn);

            // Stav dne
            if (day === today.getDate() && state.month === today.getMonth() && state.year === today.getFullYear()) {
                cell.classList.add('today');
            }
            if (resByDay[day]?.length) cell.classList.add('reserved');
            if (!resByDay[day]?.length && blkByDay[day]?.length) cell.classList.add('blocked');

            // Zobrazit malé tagy (na mobilu se schovají)
            if (resByDay[day]?.length) {
                const t = document.createElement('div');
                t.className = 'tag';
                t.textContent = `${resByDay[day].length}× rezervace`;
                cell.appendChild(t);
            } else if (blkByDay[day]?.length) {
                const t = document.createElement('div');
                t.className = 'tag';
                t.textContent = 'Blokováno';
                cell.appendChild(t);
            }

            grid.appendChild(cell);
        }
    };

    const bindNav = () => {
        const { prev, next } = getEls();
        if (prev) {
            prev.addEventListener('click', () => {
                state.month--;
                if (state.month < 0) { state.month = 11; state.year--; }
                render();
            });
        }
        if (next) {
            next.addEventListener('click', () => {
                state.month++;
                if (state.month > 11) { state.month = 0; state.year++; }
                render();
            });
        }
    };

    // Inicializace pouze jednou a pouze pokud je sekce dostupná
    const init = () => {
        if (inited) return;
        const { section, grid, label } = getEls();
        if (!section || !grid || !label) return;

        inited = true;
        bindNav();
        render();
    };

    // Veřejné API
    return { init, render };
})();

/* Spusť kalendář pouze při zobrazení sekce Kalendář */
(function attachCalendarToSectionSwitch() {
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    const sections = document.querySelectorAll('.content-section');

    const showSection = (id) => {
        sections.forEach(s => s.classList.toggle('active', s.id === id));
        const title = document.getElementById('pageTitle');
        if (title) title.textContent = navLabelFor(id);

        if (id === 'calendar') {
            AdminCalendar.init();
        }
    };

    const navLabelFor = (id) => {
        const map = {
            dashboard: 'Dashboard',
            reservations: 'Rezervace',
            guests: 'Hosté',
            calendar: 'Kalendář',
            pricing: 'Ceník',
            reviews: 'Recenze',
            payments: 'Platby',
            reports: 'Reporty',
            invoices: 'Faktury',
            settings: 'Nastavení',
            users: 'Uživatelé',
            logs: 'Logy'
        };
        return map[id] || 'Sekce';
    };

    navItems.forEach(btn => {
        btn.addEventListener('click', () => {
            navItems.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const sectionId = btn.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // pokud je Kalendář aktivní už při načtení (např. přes hash/uložený stav)
    const initiallyActive = document.querySelector('.content-section.active');
    if (initiallyActive && initiallyActive.id === 'calendar') {
        AdminCalendar.init();
    }
})();