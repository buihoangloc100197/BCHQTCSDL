/* ========== CHECKOUT PAGE LOGIC ========== */

let currentStep = 1;
let checkoutData = {
    customer: {},
    payment: {},
    cart: []
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutData();
    loadCartData();
    renderReview();
});

// ========== STEPPER FUNCTIONS ==========

function goToStep(stepNumber) {
    currentStep = stepNumber;
    updateStepper();
    updateStepView();
}

function validateAndGoToStep(stepNumber) {
    if (stepNumber === 2) {
        if (!validateStep1()) return;
        saveCustomerInfo();
    } else if (stepNumber === 3) {
        if (!validateStep2()) return;
        savePaymentInfo();
        renderReview();
    }
    goToStep(stepNumber);
}

function updateStepper() {
    document.querySelectorAll('.stepper-step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        if (stepNum === currentStep) {
            step.classList.add('active');
        } else if (stepNum < currentStep) {
            step.classList.add('completed');
        }
    });
}

function updateStepView() {
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`step-${currentStep}`).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== VALIDATION FUNCTIONS ==========

function validateStep1() {
    const fields = {
        fullname: { label: 'Họ và tên', input: document.getElementById('fullname') },
        email: { label: 'Email', input: document.getElementById('email') },
        phone: { label: 'Số điện thoại', input: document.getElementById('phone') },
        address: { label: 'Địa chỉ', input: document.getElementById('address') },
        province: { label: 'Tỉnh/Thành phố', input: document.getElementById('province') },
        city: { label: 'Thành phố', input: document.getElementById('city') }
    };

    const errors = [];

    // Check for empty fields
    Object.keys(fields).forEach(key => {
        if (!fields[key].input.value.trim()) {
            errors.push(`❌ ${fields[key].label} không được để trống`);
        }
    });

    // Email validation
    const email = fields.email.input.value.trim();
    if (email && !isValidEmail(email)) {
        errors.push(`❌ Địa chỉ email không hợp lệ`);
    }

    // Phone validation
    const phone = fields.phone.input.value.trim();
    if (phone && !isValidPhone(phone)) {
        errors.push(`❌ Số điện thoại phải là 10-11 chữ số`);
    }

    // Show error message if there are errors
    const errorContainer = document.getElementById('form-error-message');
    if (errors.length > 0) {
        const errorList = errors.map(err => `<li>${err}</li>`).join('');
        errorContainer.innerHTML = `<strong>⚠️ Vui lòng sửa các lỗi sau:</strong><ul>${errorList}</ul>`;
        errorContainer.style.display = 'block';
        window.scrollTo({ top: errorContainer.offsetTop - 100, behavior: 'smooth' });
        return false;
    }

    // Hide error message if all is valid
    errorContainer.style.display = 'none';
    return true;
}

function validateStep2() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
    if (!paymentMethod) {
        alert('Vui lòng chọn phương thức thanh toán');
        return false;
    }

    const method = paymentMethod.value;
    if (method === 'credit-card') {
        return validateCreditCard();
    } else if (method === 'paypal') {
        return validatePayPal();
    }
    return true;
}

function validateCreditCard() {
    const cardNumber = document.getElementById('card-number')?.value || '';
    const cardName = document.getElementById('card-name')?.value || '';
    const cardExpiry = document.getElementById('card-expiry')?.value || '';
    const cardCvv = document.getElementById('card-cvv')?.value || '';

    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        alert('Vui lòng điền đầy đủ thông tin thẻ');
        return false;
    }

    if (!/^\d{13,19}/.test(cardNumber.replace(/\s/g, ''))) {
        alert('Số thẻ không hợp lệ');
        return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        alert('Thời hạn phải ở định dạng MM/YY');
        return false;
    }

    if (!/^\d{3}$/.test(cardCvv)) {
        alert('CVV phải là 3 chữ số');
        return false;
    }

    return true;
}

function validatePayPal() {
    const email = document.getElementById('paypal-email')?.value || '';
    if (!email || !isValidEmail(email)) {
        alert('Vui lòng nhập địa chỉ email PayPal hợp lệ');
        return false;
    }
    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[0-9]{10,11}$/.test(phone.replace(/\D/g, ''));
}

// ========== SAVE & LOAD FUNCTIONS ==========

function saveCustomerInfo() {
    checkoutData.customer = {
        fullname: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        province: document.getElementById('province').value,
        city: document.getElementById('city').value,
        notes: document.getElementById('notes').value
    };
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
}

function savePaymentInfo() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    checkoutData.payment = {
        method: paymentMethod
    };

    if (paymentMethod === 'credit-card') {
        checkoutData.payment.cardLast4 = document.getElementById('card-number').value.slice(-4);
    } else if (paymentMethod === 'paypal') {
        checkoutData.payment.email = document.getElementById('paypal-email').value;
    }

    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
}

function loadCheckoutData() {
    const saved = sessionStorage.getItem('checkoutData');
    if (saved) {
        checkoutData = JSON.parse(saved);
        // Pre-fill form if data exists
        if (checkoutData.customer) {
            Object.keys(checkoutData.customer).forEach(key => {
                const input = document.getElementById(key);
                if (input) input.value = checkoutData.customer[key];
            });
        }
    }
}

function loadCartData() {
    const cart = JSON.parse(localStorage.getItem('ZorenbCart')) || [];
    checkoutData.cart = cart;
}

// ========== PAYMENT METHOD TOGGLE ==========

function togglePaymentForm(method) {
    const paymentDetails = document.getElementById('payment-details');
    paymentDetails.style.display = 'block';

    const forms = document.querySelectorAll('.payment-form');
    forms.forEach(form => form.style.display = 'none');

    const selectedForm = document.getElementById(`${method}-form`);
    if (selectedForm) selectedForm.style.display = 'block';
}

// ========== REVIEW & RENDERING ==========

function renderReview() {
    renderCartItems();
    renderCustomerInfo();
    renderPaymentMethod();
    renderOrderSummary();
}

function renderCartItems() {
    const container = document.getElementById('review-cart-items');
    if (!checkoutData.cart || checkoutData.cart.length === 0) {
        container.innerHTML = '<p>Không có sản phẩm trong giỏ hàng</p>';
        return;
    }

    let total = 0;
    const itemsHtml = checkoutData.cart.map(item => {
        const price = parseFloat(item.price.replace('$', '').replace(',', ''));
        const itemTotal = price * item.qty;
        total += itemTotal;
        return `
            <div class="review-item">
                <div>
                    <div class="review-item-name">${item.name}</div>
                    <div style="font-size: 1.1rem; color: #666; margin-top: 0.5rem;">Số lượng: ${item.qty}</div>
                </div>
                <div class="review-item-price">$${itemTotal.toLocaleString()}</div>
            </div>
        `;
    }).join('');

    container.innerHTML = itemsHtml;
}

function renderCustomerInfo() {
    const container = document.getElementById('review-customer-info');
    const info = checkoutData.customer;

    container.innerHTML = `
        <div class="review-info-row">
            <span class="review-info-label">Họ và Tên:</span> ${info.fullname || '—'}
        </div>
        <div class="review-info-row">
            <span class="review-info-label">Email:</span> ${info.email || '—'}
        </div>
        <div class="review-info-row">
            <span class="review-info-label">Điện Thoại:</span> ${info.phone || '—'}
        </div>
        <div class="review-info-row">
            <span class="review-info-label">Địa Chỉ:</span> ${info.address || '—'}
        </div>
        <div class="review-info-row">
            <span class="review-info-label">Tỉnh/Thành Phố:</span> ${info.province || '—'}
        </div>
        <div class="review-info-row">
            <span class="review-info-label">Thành Phố:</span> ${info.city || '—'}
        </div>
        ${info.notes ? `<div class="review-info-row"><span class="review-info-label">Ghi Chú:</span> ${info.notes}</div>` : ''}
    `;
}

function renderPaymentMethod() {
    const container = document.getElementById('review-payment-method');
    const payment = checkoutData.payment;
    let methodText = '—';
    let details = '';

    if (payment.method === 'credit-card') {
        methodText = 'Thẻ Tín Dụng';
        details = `Kết thúc bằng: ${payment.cardLast4}`;
    } else if (payment.method === 'paypal') {
        methodText = 'PayPal';
        details = `Email: ${payment.email}`;
    } else if (payment.method === 'bank-transfer') {
        methodText = 'Chuyển Khoản Ngân Hàng';
        details = 'Vietcombank';
    }

    container.innerHTML = `
        <div class="review-payment-row">
            <span class="review-payment-label">Phương Thức:</span> ${methodText}
        </div>
        ${details ? `<div class="review-payment-row">${details}</div>` : ''}
    `;
}

function renderOrderSummary() {
    const container = document.getElementById('review-summary');
    let subtotal = 0;

    checkoutData.cart.forEach(item => {
        const price = parseFloat(item.price.replace('$', '').replace(',', ''));
        subtotal += price * item.qty;
    });

    container.innerHTML = `
        <div class="summary-row">
            <span>Tạm Tính</span>
            <span>$${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>Vận Chuyển</span>
            <span>Free</span>
        </div>
        <div class="summary-row">
            <span>Thuế</span>
            <span>$0</span>
        </div>
        <div class="summary-total">
            <span>Tổng Cộng</span>
            <span>$${subtotal.toLocaleString()}</span>
        </div>
    `;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
}

// ========== SUBMIT CHECKOUT ==========

function completeCheckout() {
    if (!checkoutData.customer || !checkoutData.payment || checkoutData.cart.length === 0) {
        alert('Vui lòng hoàn thành tất cả các bước');
        return;
    }

    // Store order in localStorage for reference
    const orderId = `ZNB-${Date.now()}`;
    const orderData = {
        orderId,
        timestamp: new Date().toISOString(),
        ...checkoutData
    };
    localStorage.setItem('lastOrder', JSON.stringify(orderData));

    // Clear cart and checkout session
    localStorage.removeItem('ZorenbCart');
    sessionStorage.removeItem('checkoutData');

    // Redirect to thank you page
    window.location.href = 'thankyou.html';
}
