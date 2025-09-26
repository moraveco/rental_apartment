// Reservation data management
class ReservationData {
    constructor() {
        this.pricePerNight = 1500;
        this.reservationDates = this.loadDatesFromStorage();
        this.nights = 0;
        this.init();
    }

    init() {
        this.calculateNights();
        this.updateBookingSummary();
        this.addEventListeners();

        // If no dates found, redirect back to calendar
        if (!this.reservationDates.checkIn || !this.reservationDates.checkOut) {
            alert('Nejprve musíte vybrat termín pobytu.');
            window.location.href = '../appointment.html';
            return;
        }
    }

    loadDatesFromStorage() {
        const storedDates = localStorage.getItem('reservationDates');
        if (storedDates) {
            return JSON.parse(storedDates);
        }
        return { checkIn: null, checkOut: null };
    }

    calculateNights() {
        if (this.reservationDates.checkIn && this.reservationDates.checkOut) {
            const checkIn = new Date(this.reservationDates.checkIn);
            const checkOut = new Date(this.reservationDates.checkOut);
            this.nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        }
    }

    updateBookingSummary() {
        const checkInElement = document.getElementById('checkInDate');
        const checkOutElement = document.getElementById('checkOutDate');
        const nightsElement = document.getElementById('nightsCount');
        const basePriceElement = document.getElementById('basePrice');
        const extrasPriceElement = document.getElementById('extrasPrice');
        const totalPriceElement = document.getElementById('totalPrice');
        const extraServicesRow = document.getElementById('extraServicesRow');

        // Update dates
        if (this.reservationDates.checkIn) {
            const checkIn = new Date(this.reservationDates.checkIn);
            checkInElement.textContent = checkIn.toLocaleDateString('cs-CZ', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }

        if (this.reservationDates.checkOut) {
            const checkOut = new Date(this.reservationDates.checkOut);
            checkOutElement.textContent = checkOut.toLocaleDateString('cs-CZ', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }

        // Update nights and base price
        nightsElement.textContent = `${this.nights} ${this.nights === 1 ? 'noc' : this.nights <= 4 ? 'noci' : 'nocí'}`;
        const basePrice = this.nights * this.pricePerNight;
        basePriceElement.textContent = `${basePrice.toLocaleString('cs-CZ')} Kč`;

        // Calculate extra services price
        let extrasPrice = 0;
        document.querySelectorAll('input[name="extras"]:checked').forEach(checkbox => {
            const price = parseInt(checkbox.dataset.price);
            if (checkbox.dataset.perDay === 'true') {
                extrasPrice += price * this.nights;
            } else {
                extrasPrice += price;
            }
        });

        // Update extras display
        if (extrasPrice > 0) {
            extraServicesRow.style.display = 'flex';
            extrasPriceElement.textContent = `${extrasPrice.toLocaleString('cs-CZ')} Kč`;
        } else {
            extraServicesRow.style.display = 'none';
        }

        // Update total price
        const totalPrice = basePrice + extrasPrice;
        totalPriceElement.textContent = `${totalPrice.toLocaleString('cs-CZ')} Kč`;
    }

    addEventListeners() {
        // Form submission
        document.getElementById('reservationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        // Extra services checkboxes
        document.querySelectorAll('input[name="extras"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateBookingSummary();
            });
        });

        // Form validation
        this.addFormValidation();
    }

    addFormValidation() {
        // Email validation
        document.getElementById('email').addEventListener('blur', function() {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailPattern.test(this.value)) {
                this.style.borderColor = 'var(--error-red)';
                this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            } else {
                this.style.borderColor = 'var(--glass-border)';
                this.style.boxShadow = 'none';
            }
        });

        // Phone validation
        document.getElementById('phone').addEventListener('blur', function() {
            const phonePattern = /^[+]?[\d\s\-\(\)]{9,}$/;
            if (this.value && !phonePattern.test(this.value)) {
                this.style.borderColor = 'var(--error-red)';
                this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            } else {
                this.style.borderColor = 'var(--glass-border)';
                this.style.boxShadow = 'none';
            }
        });

        // Form input animations
        document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-2px)';
            });

            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
            });
        });
    }

    handleFormSubmission() {
        // Get form data
        const formData = new FormData(document.getElementById('reservationForm'));
        const selectedExtras = Array.from(document.querySelectorAll('input[name="extras"]:checked')).map(cb => ({
            service: cb.value,
            price: parseInt(cb.dataset.price),
            perDay: cb.dataset.perDay === 'true'
        }));

        // Calculate total price
        let extrasPrice = 0;
        selectedExtras.forEach(extra => {
            if (extra.perDay) {
                extrasPrice += extra.price * this.nights;
            } else {
                extrasPrice += extra.price;
            }
        });

        const totalPrice = (this.nights * this.pricePerNight) + extrasPrice;

        const reservationData = {
            // Dates from previous step
            checkIn: this.reservationDates.checkIn,
            checkOut: this.reservationDates.checkOut,
            nights: this.nights,

            // Form data
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            guests: formData.get('guests'),
            purpose: formData.get('purpose'),
            notes: formData.get('notes'),

            // Extras and pricing
            extras: selectedExtras,
            basePrice: this.nights * this.pricePerNight,
            extrasPrice: extrasPrice,
            totalPrice: totalPrice
        };

        // Store all reservation data
        localStorage.setItem('fullReservationData', JSON.stringify(reservationData));

        // Animate button
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Zpracovává se...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Navigate to payment page
            window.location.href = '../payment/confirm.html';
        }, 1500);

        console.log('Reservation data:', reservationData);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ReservationData();
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

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        document.getElementById('submitBtn').click();
    }
});