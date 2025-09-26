// Complete Payment System Script for Ubytování u Moravců
class PaymentProcessor {
    constructor() {
        this.reservationData = this.loadReservationData();
        this.reservationNumber = this.generateReservationNumber();

        // Bank details completely commented out
        /*
        this.bankDetails = {
            accountNumber: '2901234567/2010',
            iban: 'CZ87 2010 0000 0029 0123 4567',
            bic: 'FIOBCZPP',
            bankName: 'Fio banka, a.s.',
            recipient: 'Ubytování u Moravců s.r.o.'
        };
        */

        this.init();
    }

    init() {
        if (!this.reservationData || !this.reservationData.checkIn) {
            this.redirectToStart();
            return;
        }

        this.populateReservationSummary();
        // Commented out bank transfer UI
        // this.setupBankTransfer();
        this.addEventListeners();
        this.initializeForm();
    }

    loadReservationData() {
        const data = localStorage.getItem('fullReservationData');
        return data ? JSON.parse(data) : null;
    }

    generateReservationNumber() {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const day = String(new Date().getDate()).padStart(2, '0');
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        return `REZ${year}${month}${day}${randomNum}`;
    }

    getTotalAmount() {
        const data = this.reservationData;
        const subtotal = data.basePrice + data.extrasPrice;
        const vat = Math.round(subtotal * 0.21);
        return subtotal + vat;
    }

    redirectToStart() {
        alert('Nebyly nalezeny údaje o rezervaci. Přesměrováváme na začátek rezervace.');
        window.location.href = '../../appointment.html';
    }

    populateReservationSummary() {
        const data = this.reservationData;

        // Basic information
        document.getElementById('reservationNumber').innerHTML = `<i class="fas fa-hashtag"></i> ${this.reservationNumber}`;
        document.getElementById('guestName').textContent = `${data.firstName} ${data.lastName}`;
        document.getElementById('guestEmail').textContent = data.email;
        document.getElementById('guestPhone').textContent = data.phone;
        document.getElementById('guestCount').textContent = `${data.guests} ${data.guests == 1 ? 'host' : 'hosté'}`;

        // Purpose if provided
        if (data.purpose) {
            const purposeMap = {
                'vacation': 'Dovolená',
                'business': 'Služební cesta',
                'romantic': 'Romantický pobyt',
                'family': 'Rodinná návštěva',
                'other': 'Jiné'
            };
            document.getElementById('guestPurpose').textContent = purposeMap[data.purpose] || data.purpose;
            document.getElementById('purposeRow').style.display = 'flex';
        }

        // Dates
        const checkIn = new Date(data.checkIn);
        const checkOut = new Date(data.checkOut);

        document.getElementById('checkInDisplay').textContent = this.formatDate(checkIn);
        document.getElementById('checkOutDisplay').textContent = this.formatDate(checkOut);
        document.getElementById('nightsDisplay').textContent = `${data.nights} ${this.getNightsText(data.nights)}`;

        // Extras
        if (data.extras && data.extras.length > 0) {
            this.populateExtras(data);
        }

        // Pricing
        this.populatePricing(data);

        // Special notes
        if (data.notes && data.notes.trim()) {
            document.getElementById('specialNotes').textContent = data.notes;
            document.getElementById('notesSection').style.display = 'block';
        }
    }

    formatDate(date) {
        return date.toLocaleDateString('cs-CZ', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    getNightsText(nights) {
        if (nights === 1) return 'noc';
        if (nights <= 4) return 'noci';
        return 'nocí';
    }

    populateExtras(data) {
        const extrasContainer = document.getElementById('extrasContainer');
        const extrasList = document.getElementById('extrasList');

        const extrasMap = {
            'airport': 'Transfer z letiště',
            'spa': 'Lázeňské balíčky',
            'dinner': 'Romantická večeře',
            'concierge': `Osobní concierge (${data.nights} ${data.nights <= 4 ? 'dny' : 'dnů'})`
        };

        extrasContainer.innerHTML = '';
        data.extras.forEach(extra => {
            const extraElement = document.createElement('div');
            extraElement.className = 'extra-item';

            const totalPrice = extra.perDay ? extra.price * data.nights : extra.price;

            extraElement.innerHTML = `
                <span class="extra-name">${extrasMap[extra.service] || extra.service}</span>
                <span class="extra-price">${totalPrice.toLocaleString('cs-CZ')} Kč</span>
            `;
            extrasContainer.appendChild(extraElement);
        });

        extrasList.style.display = 'block';
    }

    populatePricing(data) {
        document.getElementById('nightsPricing').textContent = `${data.nights} ${this.getNightsText(data.nights)}`;
        document.getElementById('basePriceDisplay').textContent = `${data.basePrice.toLocaleString('cs-CZ')} Kč`;

        if (data.extrasPrice > 0) {
            document.getElementById('extrasPriceDisplay').textContent = `${data.extrasPrice.toLocaleString('cs-CZ')} Kč`;
            document.getElementById('extrasPriceRow').style.display = 'flex';
        }

        const subtotal = data.basePrice + data.extrasPrice;
        const vat = Math.round(subtotal * 0.21);
        const finalPrice = subtotal + vat;

        document.getElementById('vatDisplay').textContent = `${vat.toLocaleString('cs-CZ')} Kč`;
        document.getElementById('finalPriceDisplay').textContent = `${finalPrice.toLocaleString('cs-CZ')} Kč`;
    }

    addEventListeners() {
        // Payment button click
        document.getElementById('paymentBtn').addEventListener('click', () => {
            this.processPayment();
        });

        // Terms checkbox validation
        document.getElementById('termsAccept').addEventListener('change', () => {
            this.validateForm();
        });
    }

    validateForm() {
        const termsAccepted = document.getElementById('termsAccept').checked;
        const paymentBtn = document.getElementById('paymentBtn');

        if (termsAccepted) {
            paymentBtn.disabled = false;
            paymentBtn.style.opacity = '1';
        } else {
            paymentBtn.disabled = true;
            paymentBtn.style.opacity = '0.6';
        }

        return termsAccepted;
    }

    initializeForm() {
        // Initialize and validate form
        this.validateForm();
        document.getElementById('paymentBtn').innerHTML = 'Potvrdit rezervaci';
    }

    processPayment() {
        if (!this.validateForm()) {
            this.showNotification('Prosím odsouhlaste obchodní podmínky.', 'error');
            return;
        }

        // Always create reservation via API directly
        this.createReservation();
    }

    async createReservation() {
        const btn = document.getElementById('paymentBtn');
        const originalText = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Vytvářím rezervaci...';

        try {
            const payload = {
                first_name: this.reservationData.firstName,
                last_name: this.reservationData.lastName,
                email: this.reservationData.email,
                phone: this.reservationData.phone,
                guest_count: this.reservationData.guests,
                purpose: this.reservationData.purpose,
                check_in: this.reservationData.checkIn,
                check_out: this.reservationData.checkOut,
                price_per_night: this.reservationData.pricePerNight,
                extras_price: this.reservationData.extrasPrice,
                special_requests: this.reservationData.notes,
                extras: this.reservationData.extras || []
            };

            console.log("Sending payload:", payload);

            const response = await fetch('https://mymedevelopers.com/ReserveApi/reservation/createReservation.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log("API Response:", result);

            if (!result.success) {
                throw new Error(result.message || "Chyba při vytváření rezervace.");
            }

            // Save completed reservation
            localStorage.setItem('completedReservation', JSON.stringify(result.data));

            btn.innerHTML = '<i class="fas fa-check"></i> Rezervace vytvořena!';

            setTimeout(() => {
                this.showSuccessModal();
                btn.innerHTML = originalText;
                btn.disabled = false;
                this.clearStoredData();
            }, 1000);

        } catch (error) {
            console.error(error);
            this.showNotification('Rezervaci se nepodařilo vytvořit: ' + error.message, 'error');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    showSuccessModal() {
        document.getElementById('confirmationCode').textContent = this.reservationNumber;
        document.getElementById('successModal').classList.add('show');

        this.showNotification('Rezervace byla úspěšně vytvořena!', 'success');
    }

    clearStoredData() {
        localStorage.removeItem('reservationDates');
        localStorage.removeItem('fullReservationData');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.95);
            padding: 16px 20px;
            border-radius: 12px;
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.paymentProcessor = new PaymentProcessor();
});

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('show');
}

function goHome() {
    window.location.href = '/';
}
