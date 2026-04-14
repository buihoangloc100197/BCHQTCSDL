// Update cart badge on all pages
function updateCartBadge() {
    const cartData = localStorage.getItem('ZorenbCart');
    console.log('🛒 Cart localStorage data:', cartData);
    const cart = JSON.parse(cartData) || [];
    console.log('🛒 Parsed cart array:', cart);
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
