document.addEventListener('DOMContentLoaded', function() {
    // Alternar visibilidade da senha
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('#password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulação de login - dados em produção viriam do backend
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Validações básicas
            if (!email || !password) {
                alert('Por favor, preencha todos os campos!');
                return;
            }
            
            // Simular autenticação
            setTimeout(function() {
                // Simular armazenamento de token de autenticação
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                
                // Simular resposta de autenticação bem-sucedida
                alert('Login realizado com sucesso!');
                
                // Redirecionar para a página inicial
                window.location.href = '../../index.html';
            }, 1000);
        });
    }

    // Botões de login social
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'Steam';
            alert(`Autenticação com ${provider} não implementada nesta versão.`);
        });
    });

    // Animação de fundo
    createBackgroundAnimation();
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
