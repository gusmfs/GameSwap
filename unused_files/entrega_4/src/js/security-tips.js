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

    // ===== Tip Cards Animation =====
    const tipCards = document.querySelectorAll('.tip-card');
    
    function checkScroll() {
        tipCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (cardTop < windowHeight * 0.8) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Verifica na carga inicial
}); 