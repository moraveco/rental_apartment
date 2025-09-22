// Payment method selection
document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', function () {
        // Remove selected class from all options
        document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));

        // Add selected class to clicked option
        this.classList.add('selected');

        // Check the radio button
        this.querySelector('input[type="radio"]').checked = true;

        // Show/hide payment forms
        const method = this.dataset.method;
        showPaymentForm(method);
    });
});

function showPaymentForm(method) {
    // Hide all forms
    document.getElementById('cardForm').style.display = 'none';
    document.getElementById('bankInfo').style.display = 'none';
    document.getElementById('paypalInfo').style.display = 'none';
    document.getElementById('cryptoInfo').style.display = 'none';

    // Show selected form
    switch (method) {
        case 'card':
            document.getElementById('cardForm').style.display = 'block';
            document.getElementById('cardForm').classList.add('show');
            break;
        case 'bank':
            document.getElementById('bankInfo').style.display = 'block';
            break;
        case 'paypal':
            document.getElementById('paypalInfo').style.display = 'block';
            break;
        case 'crypto':
            document.getElementById('cryptoInfo').style.display = 'block';
            break;
    }
}

// Card number formatting
document.getElementById('cardNumber').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue.length <= 19) {
        e.target.value = formattedValue;
    }
});

// Card expiry formatting
document.getElementById('cardExpiry').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
});

// CVV formatting
document.getElementById('cardCvv').addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// Form validation
function validateForm() {
    const selectedMethod = document.querySelector('input[name="payment"]:checked').value;
    const termsAccepted = document.getElementById('termsAccept').checked;

    if (!termsAccepted) {
        alert('Prosím odsouhlaste obchodní podmínky.');
        return false;
    }

    if (selectedMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardName = document.getElementById('cardName').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCvv = document.getElementById('cardCvv').value;

        if (!cardNumber || cardNumber.length < 15) {
            alert('Prosím zadejte platné číslo karty.');
            return false;
        }
        if (!cardName.trim()) {
            alert('Prosím zadejte jméno na kartě.');
            return false;
        }
        if (!cardExpiry || cardExpiry.length !== 5) {
            alert('Prosím zadejte platnost karty ve formátu MM/RR.');
            return false;
        }
        if (!cardCvv || cardCvv.length < 3) {
            alert('Prosím zadejte CVV kód.');
            return false;
        }
    }

    return true;
}

// Payment processing
document.getElementById('paymentBtn').addEventListener('click', function () {
    if (!validateForm()) {
        return;
    }

    const btn = this;
    const originalText = btn.innerHTML;

    // Disable button and show loading
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Zpracovává se...';

    // Simulate payment processing
    setTimeout(() => {
        // Show success modal
        document.getElementById('successModal').classList.add('show');

        // Reset button
        btn.disabled = false;
        btn.innerHTML = originalText;
    }, 3000);
});

// Close success modal
function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('show');
    // In real app, redirect to home page
    // window.location.href = '/';
}

// Real-time card type detection
document.getElementById('cardNumber').addEventListener('input', function (e) {
    const value = e.target.value.replace(/\s/g, '');
    let cardType = '';

    if (value.startsWith('4')) {
        cardType = 'visa';
    } else if (value.startsWith('5') || value.startsWith('2')) {
        cardType = 'mastercard';
    } else if (value.startsWith('3')) {
        cardType = 'amex';
    }

    // Update card logos highlighting
    document.querySelectorAll('.card-logo').forEach(logo => {
        logo.style.opacity = '0.5';
    });

    if (cardType === 'visa') {
        document.querySelector('.card-logo:nth-child(1)').style.opacity = '1';
    } else if (cardType === 'mastercard') {
        document.querySelector('.card-logo:nth-child(2)').style.opacity = '1';
    } else if (cardType === 'amex') {
        document.querySelector('.card-logo:nth-child(3)').style.opacity = '1';
    }
});

// Enhanced form interactions
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function () {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = 'var(--glow-gold)';
    });

    input.addEventListener('blur', function () {
        this.style.transform = 'translateY(0)';
    });
});

// Auto-tab for CVV
document.getElementById('cardCvv').addEventListener('input', function (e) {
    if (e.target.value.length === 3) {
        // Could auto-focus next field or validate
        e.target.blur();
    }
});

// Progress animation on load
window.addEventListener('load', function () {
    setTimeout(() => {
        document.querySelector('.progress-bar::after').style.width = '100%';
    }, 500);
});

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        document.getElementById('paymentBtn').click();
    }
    if (e.key === 'Escape') {
        if (document.getElementById('successModal').classList.contains('show')) {
            closeSuccessModal();
        }
    }
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

// Enhanced security indicators
function updateSecurityIndicators() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const securityBadge = document.querySelector('.security-badge');

    if (cardNumber.length > 0) {
        securityBadge.innerHTML = '<i class="fas fa-shield-check"></i> Spojení zabezpečeno 256-bit SSL';
        securityBadge.style.color = 'var(--success-green)';
    } else {
        securityBadge.innerHTML = '<i class="fas fa-shield-alt"></i> Zabezpečená platba SSL šifrováním';
        securityBadge.style.color = 'var(--success-green)';
    }
}

document.getElementById('cardNumber').addEventListener('input', updateSecurityIndicators);
