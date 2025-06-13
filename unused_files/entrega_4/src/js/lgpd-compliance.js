document.addEventListener('DOMContentLoaded', function() {
    // ===== Menu Toggle Logic =====
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // ===== Background Animation Setup =====
    const animationContainer = document.querySelector('.background-animation');
    const shapes = ['square', 'triangle', 'diamond', 'cross'];
    const colors = ['color1', 'color2', 'color3', 'color4', 'color5'];
    const numberOfPixels = 50;

    function createPixel() {
        const pixel = document.createElement('div');
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        pixel.className = `pixel ${randomShape} ${randomColor}`;
        
        const left = Math.random() * 100;
        pixel.style.left = `${left}%`;
        
        const duration = 10 + Math.random() * 15;
        const delay = Math.random() * 10;
        pixel.style.setProperty('--duration', `${duration}s`);
        pixel.style.setProperty('--delay', `${delay}s`);
        
        return pixel;
    }

    for (let i = 0; i < numberOfPixels; i++) {
        animationContainer.appendChild(createPixel());
    }

    setInterval(() => {
        const pixels = document.querySelectorAll('.pixel');
        pixels.forEach(pixel => {
            const computedStyle = window.getComputedStyle(pixel);
            const transform = computedStyle.getPropertyValue('transform');
            if (transform.includes('matrix') && parseFloat(transform.split(',')[5]) < 0) {
                pixel.remove();
                animationContainer.appendChild(createPixel());
            }
        });
    }, 1000);

    // ===== LGPD Compliance Logic =====
    const termsCheck = document.getElementById('terms-check');
    const privacyCheck = document.getElementById('privacy-check');
    const cookiesCheck = document.getElementById('cookies-check');
    const acceptBtn = document.getElementById('accept-btn');
    const declineBtn = document.getElementById('decline-btn');
    const successMessage = document.querySelector('.success-message');

    function updateAcceptButton() {
        acceptBtn.disabled = !(termsCheck.checked && privacyCheck.checked && cookiesCheck.checked);
    }

    termsCheck.addEventListener('change', updateAcceptButton);
    privacyCheck.addEventListener('change', updateAcceptButton);
    cookiesCheck.addEventListener('change', updateAcceptButton);

    acceptBtn.addEventListener('click', function() {
        localStorage.setItem('lgpdConsent', 'true');
        successMessage.style.display = 'block';
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 3000);
    });

    declineBtn.addEventListener('click', function() {
        window.location.href = 'lgpd-decline.html';
    });

    // Sistema de abas
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.querySelector(`#${tabId}`).classList.add('active');
        });
    });

    // Verificar se o usuário já consentiu
    if (localStorage.getItem('lgpdConsent') === 'true') {
        window.location.href = '../../index.html';
    }
}); 