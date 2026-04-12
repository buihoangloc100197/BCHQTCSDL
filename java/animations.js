/**
 * LUXURY MOTION SYSTEM - animations.js
 * Hệ thống điều khiển chuyển động cho ZORENB Luxury Showroom.
 * Sử dụng Intersection Observer để kích hoạt các hiệu ứng "Scroll-Reveal".
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cấu hình Intersection Observer
    const revealOptions = {
        threshold: 0.15, // Kích hoạt khi 15% phần tử xuất hiện trong khung hình
        rootMargin: '0px 0px -50px 0px' // Kích hoạt sớm hơn 50px trước khi phần tử chạm mép dưới
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Thêm class 'active' để kích hoạt CSS Transition
                entry.target.classList.add('active');
                
                // Nếu muốn hiệu ứng chỉ chạy một lần, gỡ bỏ theo dõi sau khi kích hoạt
                // observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    // 2. Tìm và theo dõi tất cả các phần tử có class 'reveal' hoặc 'fade-in'
    const revealElements = document.querySelectorAll('.reveal, .fade-in, .product-card');
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Smart Header Logic: Tự động ẩn khi cuộn xuống, hiện khi cuộn lên
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.site-header');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Thêm nền mờ khi không ở đỉnh trang
        if (currentScrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Ẩn Header khi cuộn xuống, Hiện khi cuộn lên
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;

        // 4. Hiệu ứng Parallax nhẹ cho Hero background
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.transform = `translateY(${currentScrollY * 0.3}px)`;
        }
    });

    // 5. Magnetic Button Effect cho các nút chính
    const magneticBtns = document.querySelectorAll('.heritage-cta, .btn-auth, .register-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0)`;
        });
    });

    // 6. AI Typewriter Effect
    function typeWriter(elementId, delay = 50) {
        const el = document.getElementById(elementId);
        if (!el) return;

        const text = el.getAttribute('data-text');
        if (!text) return;
        
        el.innerHTML = '';
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        el.appendChild(cursor);

        let i = 0;
        function type() {
            if (i < text.length) {
                cursor.before(text.charAt(i));
                i++;
                setTimeout(type, delay + (Math.random() * 50)); // Thêm chút ngẫu hứng AI
            }
        }
        type();
    }

    // Kích hoạt hiệu ứng gõ chữ khi trang đã sẵn sàng
    setTimeout(() => typeWriter('hero-slogan-main', 80), 1000);
    setTimeout(() => typeWriter('hero-slogan-sub', 40), 2500);
});
