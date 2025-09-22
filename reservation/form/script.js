// Calendar functionality
class ReservationCalendar {
    constructor() {
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.selectedDates = [];
        this.unavailableDates = [
            '2025-08-15', '2025-08-16', '2025-08-17',
            '2025-08-22', '2025-08-23',
            '2025-09-05', '2025-09-06', '2025-09-07'
        ];
        this.pricePerNight = 1500;
        this.extraPrices = {
            airport: 800,
            spa: 1200,
            dinner: 2500,
            concierge: 600
        };

        this.init();
    }

    init() {
        this.generateCalendar();
        this.addEventListeners();
        this.updateBookingSummary();
    }

    addEventListeners() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            this.generateCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this.generateCalendar();
        });

        // Form submission
        document.getElementById('reservationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        // Extra services
        document.querySelectorAll('input[name="extras"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateBookingSummary();
            });
        });
    }

    generateCalendar() {
        const monthNames = [
            'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
            'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
        ];

        const dayNames = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

        document.getElementById('monthYear').textContent =
            `${monthNames[this.currentMonth]} ${this.currentYear}`;

        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - (firstDay.getDay() + 6) % 7);

        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';

        // Add day headers
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Generate calendar days
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = currentDate.getDate();

            const dateString = this.formatDate(currentDate);
            const today = new Date();

            // Add classes based on date status
            if (currentDate.getMonth() !== this.currentMonth) {
                dayElement.classList.add('other-month');
            } else if (currentDate < today.setHours(0, 0, 0, 0)) {
                dayElement.classList.add('unavailable');
            } else if (this.unavailableDates.includes(dateString)) {
                dayElement.classList.add('unavailable');
            } else if (this.selectedDates.includes(dateString)) {
                dayElement.classList.add('selected');
            } else if (this.isInRange(dateString)) {
                dayElement.classList.add('in-range');
            }

            if (this.isToday(currentDate)) {
                dayElement.classList.add('today');
            }

            // Add price indicator
            if (currentDate.getMonth() === this.currentMonth &&
                currentDate >= today.setHours(0, 0, 0, 0) &&
                !this.unavailableDates.includes(dateString)) {
                dayElement.setAttribute('data-price', '1500');
            }

            // Add click event
            if (!dayElement.classList.contains('unavailable') &&
                !dayElement.classList.contains('other-month')) {
                dayElement.addEventListener('click', () => {
                    this.selectDate(dateString);
                });
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    isInRange(dateString) {
        if (this.selectedDates.length !== 2) return false;
        const date = new Date(dateString);
        const start = new Date(this.selectedDates[0]);
        const end = new Date(this.selectedDates[1]);
        return date > start && date < end;
    }

    selectDate(dateString) {
        if (this.selectedDates.length === 0) {
            this.selectedDates.push(dateString);
        } else if (this.selectedDates.length === 1) {
            const firstDate = new Date(this.selectedDates[0]);
            const secondDate = new Date(dateString);

            if (secondDate > firstDate) {
                this.selectedDates.push(dateString);
            } else {
                this.selectedDates = [dateString];
            }
        } else {
            this.selectedDates = [dateString];
        }

        this.generateCalendar();
        this.updateBookingSummary();
    }

    updateBookingSummary() {
        const checkInElement = document.getElementById('checkInDate');
        const checkOutElement = document.getElementById('checkOutDate');
        const nightsElement = document.getElementById('nightsCount');
        const totalPriceElement = document.getElementById('totalPrice');

        if (this.selectedDates.length >= 1) {
            const checkIn = new Date(this.selectedDates[0]);
            checkInElement.textContent = checkIn.toLocaleDateString('cs-CZ');
        } else {
            checkInElement.textContent = 'Nevybráno';
        }

        if (this.selectedDates.length >= 2) {
            const checkOut = new Date(this.selectedDates[1]);
            checkOutElement.textContent = checkOut.toLocaleDateString('cs-CZ');

            const nights = Math.ceil((checkOut - new Date(this.selectedDates[0])) / (1000 * 60 * 60 * 24));
            nightsElement.textContent = nights;

            // Calculate total price
            let totalPrice = nights * this.pricePerNight;

            // Add extra services
            document.querySelectorAll('input[name="extras"]:checked').forEach(checkbox => {
                const service = checkbox.value;
                if (service === 'concierge') {
                    totalPrice += this.extraPrices[service] * nights;
                } else {
                    totalPrice += this.extraPrices[service];
                }
            });

            totalPriceElement.textContent = `${totalPrice.toLocaleString('cs-CZ')} Kč`;
        } else {
            checkOutElement.textContent = 'Nevybráno';
            nightsElement.textContent = '0';
            totalPriceElement.textContent = '0 Kč';
        }
    }

    handleFormSubmission() {
        // Validate dates
        if (this.selectedDates.length < 2) {
            alert('Prosím vyberte termín příjezdu a odjezdu.');
            return;
        }

        // Get form data
        const formData = new FormData(document.getElementById('reservationForm'));
        const reservationData = {
            checkIn: this.selectedDates[0],
            checkOut: this.selectedDates[1],
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            guests: formData.get('guests'),
            purpose: formData.get('purpose'),
            extras: Array.from(document.querySelectorAll('input[name="extras"]:checked')).map(cb => cb.value),
            notes: formData.get('notes')
        };

        // Simulate form submission
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Odesílání...';
        submitBtn.disabled = true;

        setTimeout(() => {
            this.showSuccessMessage();
            submitBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Odeslat rezervaci';
            submitBtn.disabled = false;

            // Reset form
            document.getElementById('reservationForm').reset();
            this.selectedDates = [];
            this.generateCalendar();
            this.updateBookingSummary();
        }, 2000);

        console.log('Reservation data:', reservationData);
    }

    showSuccessMessage() {
        const successMessage = document.getElementById('successMessage');
        successMessage.classList.add('show');

        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 4000);
    }
}

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ReservationCalendar();
});

// Smooth scrolling for any anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add loading animation to form inputs
document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'translateY(-2px)';
    });

    input.addEventListener('blur', function () {
        this.parentElement.style.transform = 'translateY(0)';
    });
});

// Enhanced form validation
document.getElementById('email').addEventListener('blur', function () {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value && !emailPattern.test(this.value)) {
        this.style.borderColor = 'var(--error-red)';
        this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    } else {
        this.style.borderColor = 'var(--glass-border)';
        this.style.boxShadow = 'none';
    }
});

document.getElementById('phone').addEventListener('blur', function () {
    const phonePattern = /^[+]?[\d\s\-\(\)]{9,}$/;
    if (this.value && !phonePattern.test(this.value)) {
        this.style.borderColor = 'var(--error-red)';
        this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    } else {
        this.style.borderColor = 'var(--glass-border)';
        this.style.boxShadow = 'none';
    }
});
