document.addEventListener('DOMContentLoaded', () => {
    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('#nav-menu');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Botões de ação
    const backButton = document.querySelector('.btn-back');
    const leaveButton = document.querySelector('.btn-leave');
    const supportButton = document.querySelector('.btn-support');

    // Voltar para os termos
    backButton.addEventListener('click', () => {
        window.location.href = '/pages/lgpd-compliance.html';
    });

    // Sair do site
    leaveButton.addEventListener('click', () => {
        window.location.href = 'https://www.google.com';
    });

    // Contatar suporte
    supportButton.addEventListener('click', () => {
        window.location.href = 'mailto:suporte@gameswap.com?subject=Suporte%20LGPD';
    });

    // Verificar se o usuário já consentiu
    if (localStorage.getItem('lgpdConsent') === 'true') {
        window.location.href = '/index.html';
    }

    // Elementos do DOM
    const btnBackToTerms = document.querySelector('.btn-back-to-terms');
    const btnLeaveSite = document.querySelector('.btn-leave-site');
    const btnReview = document.querySelector('.btn-review');
    const btnContact = document.querySelector('.btn-contact');
    const btnHome = document.querySelector('.btn-home');
    const declineCard = document.querySelector('.lgpd-decline-card');
    const alternativeCards = document.querySelectorAll('.alternative-card');
    const infoBox = document.querySelector('.info-box');

    // Função para voltar à página de termos
    function handleBackToTerms() {
        addClickEffect(btnBackToTerms);
        setTimeout(() => {
            window.location.href = './lgpd-compliance.html';
        }, 300);
    }

    // Função para sair do site
    function handleLeaveSite() {
        addClickEffect(btnLeaveSite);
        // Limpa dados de sessão
        sessionStorage.clear();
        localStorage.removeItem('lgpdConsent');
        
        // Adiciona efeito de fade out
        declineCard.style.opacity = '0';
        declineCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 500);
    }

    // Função para revisar termos
    function handleReview() {
        addClickEffect(btnReview);
        setTimeout(() => {
            window.location.href = './lgpd-compliance.html';
        }, 300);
    }

    // Função para contato
    function handleContact() {
        addClickEffect(btnContact);
        setTimeout(() => {
            window.location.href = './contact.html';
        }, 300);
    }

    // Função para ir para home
    function handleHome() {
        addClickEffect(btnHome);
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 300);
    }

    // Função para adicionar efeito de clique
    function addClickEffect(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }

    // Adiciona event listeners aos botões
    if (btnBackToTerms) {
        btnBackToTerms.addEventListener('click', handleBackToTerms);
    }

    if (btnLeaveSite) {
        btnLeaveSite.addEventListener('click', handleLeaveSite);
    }

    if (btnReview) {
        btnReview.addEventListener('click', handleReview);
    }

    if (btnContact) {
        btnContact.addEventListener('click', handleContact);
    }

    if (btnHome) {
        btnHome.addEventListener('click', handleHome);
    }

    // Animação de entrada dos elementos
    function animateElements() {
        const elements = [
            declineCard,
            ...alternativeCards,
            infoBox
        ];
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }

    // Efeito hover nos cards de alternativa
    function setupCardHoverEffects() {
        alternativeCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
                card.style.borderColor = 'rgba(108, 92, 231, 0.4)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
                card.style.borderColor = 'rgba(108, 92, 231, 0.2)';
            });
        });
    }

    // Efeito de digitação no texto informativo
    function typeWriterEffect() {
        const infoText = infoBox.querySelector('p');
        const text = infoText.textContent;
        infoText.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                infoText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }

    // Inicializa as animações
    animateElements();
    setupCardHoverEffects();
    typeWriterEffect();

    // Adiciona efeito de parallax suave
    window.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        declineCard.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
}); 