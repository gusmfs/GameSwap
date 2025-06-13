document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.banner-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const nextButton = carousel.querySelector('.carousel-control.next');
    const prevButton = carousel.querySelector('.carousel-control.prev');
    const indicatorsContainer = carousel.querySelector('.carousel-indicators');
    
    let currentSlide = 0;
    let slideInterval;
    const slideDelay = 5000; // 5 segundos entre slides

    // Criar indicadores dinamicamente
    slides.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.classList.add('indicator');
        indicator.setAttribute('aria-label', `Ir para banner ${index + 1}`);
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));

    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        updateIndicators();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Event listeners para os botões
    nextButton.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    // Auto-play
    function startInterval() {
        slideInterval = setInterval(nextSlide, slideDelay);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    // Pausar auto-play quando o mouse estiver sobre o carrossel
    carousel.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    carousel.addEventListener('mouseleave', () => {
        startInterval();
    });

    // Iniciar auto-play
    startInterval();

    // Suporte para teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetInterval();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetInterval();
        }
    });
}); 