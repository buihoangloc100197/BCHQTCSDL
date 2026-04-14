// Update cart badge on all pages
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('ZorenbCart')) || [];
    const cartBadges = document.querySelectorAll('#cart-count');

    cartBadges.forEach(badge => {
        badge.textContent = cart.length;
    });

    console.log('✓ Cart badge updated:', cart.length);
}

// Update cart badge when page loads
document.addEventListener('DOMContentLoaded', updateCartBadge);

// Listen for storage changes from other tabs
window.addEventListener('storage', updateCartBadge);
