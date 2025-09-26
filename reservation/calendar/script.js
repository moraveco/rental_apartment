class ReservationCalendar {
    constructor() {
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.selectedDates = [];
        this.unavailableDates = []; // will be loaded from API

        this.init();
    }

    async init() {
        await this.fetchReservations(); // fetch unavailable dates first
        this.generateCalendar();
        this.addEventListeners();
        this.updateSummary();
    }

    async fetchReservations() {
        try {
            const response = await fetch(
                `https://mymedevelopers.com/ReserveApi/reservation/monthlyReservations.php?year=${this.currentYear}&month=${this.currentMonth + 1}`
            );

            const data = await response.json();

            if (data.success && data.data && data.data.reservations) {
                const reservations = data.data.reservations;
                const blocked = [];

                reservations.forEach(res => {
                    const checkIn = new Date(res.check_in);
                    const checkOut = new Date(res.check_out);

                    // Loop through all days between check_in and check_out
                    let current = new Date(checkIn);
                    while (current < checkOut) {
                        blocked.push(this.formatDate(current));
                        current.setDate(current.getDate() + 1);
                    }
                });

                this.unavailableDates = blocked;
            } else {
                console.warn("No reservations found or invalid API response.");
                this.unavailableDates = [];
            }
        } catch (error) {
            console.error("Error fetching reservations:", error);
            this.unavailableDates = [];
        }
    }

    addEventListeners() {
        document.getElementById('prevMonth').addEventListener('click', async () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            await this.fetchReservations();
            this.generateCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', async () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            await this.fetchReservations();
            this.generateCalendar();
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

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Generate calendar days
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = currentDate.getDate();

            const dateString = this.formatDate(currentDate);

            // Add classes based on date status
            if (currentDate.getMonth() !== this.currentMonth) {
                dayElement.classList.add('other-month');
            } else if (currentDate < today) {
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

            // Add click event for available days
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
        this.updateSummary();
    }

    updateSummary() {
        const summarySection = document.getElementById('selectionSummary');
        const continueBtn = document.getElementById('continueBtn');
        const checkInDisplay = document.getElementById('checkInDisplay');
        const checkOutDisplay = document.getElementById('checkOutDisplay');
        const nightsDisplay = document.getElementById('nightsDisplay');

        if (this.selectedDates.length >= 1) {
            const checkIn = new Date(this.selectedDates[0]);
            checkInDisplay.textContent = checkIn.toLocaleDateString('cs-CZ', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            });
        } else {
            checkInDisplay.textContent = '-';
        }

        if (this.selectedDates.length >= 2) {
            const checkOut = new Date(this.selectedDates[1]);
            checkOutDisplay.textContent = checkOut.toLocaleDateString('cs-CZ', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            });

            const nights = Math.ceil((checkOut - new Date(this.selectedDates[0])) / (1000 * 60 * 60 * 24));
            nightsDisplay.textContent = `${nights} ${nights === 1 ? 'noc' : nights <= 4 ? 'noci' : 'nocí'}`;

            summarySection.style.display = 'block';
            continueBtn.disabled = false;
        } else {
            checkOutDisplay.textContent = '-';
            nightsDisplay.textContent = '0 nocí';

            if (this.selectedDates.length === 0) {
                summarySection.style.display = 'none';
            } else {
                summarySection.style.display = 'block';
            }
            continueBtn.disabled = true;
        }
    }

    getSelectedDates() {
        return {
            checkIn: this.selectedDates[0] || null,
            checkOut: this.selectedDates[1] || null
        };
    }
}

// Global variable to access calendar instance
let calendar;

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', () => {
    calendar = new ReservationCalendar();
});

// Continue to form function
function continueToForm() {
    const selectedDates = calendar.getSelectedDates();

    if (!selectedDates.checkIn || !selectedDates.checkOut) {
        alert('Prosím vyberte termín příjezdu a odjezdu.');
        return;
    }

    // Store selected dates in localStorage
    localStorage.setItem('reservationDates', JSON.stringify(selectedDates));

    // Navigate to the form page
    window.location.href = '/reservation/form/data.html';
}
