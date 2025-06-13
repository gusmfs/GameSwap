document.addEventListener('DOMContentLoaded', function() {
    // Configuração da animação de fundo
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

    // Criar pixels iniciais
    for (let i = 0; i < numberOfPixels; i++) {
        animationContainer.appendChild(createPixel());
    }

    // Sistema de reciclagem dos pixels
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

    const form = document.getElementById('registerForm');
    const birthDateInput = document.getElementById('birthDate');
    const ageWarning = document.getElementById('ageWarning');
    const registerBtn = document.querySelector('.register-btn');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Função reutilizável para calcular idade
    function calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    // Validação de idade
    birthDateInput.addEventListener('change', function() {
        const birthDate = new Date(this.value);
        const age = calculateAge(birthDate);

        if (age < 18) {
            ageWarning.style.display = 'flex';
            this.setCustomValidity('É necessário ter 18 anos ou mais para se cadastrar.');
            updateRegisterButton();
        } else {
            ageWarning.style.display = 'none';
            this.setCustomValidity('');
            updateRegisterButton();
        }
    });

    // Validação de senha
    passwordInput.addEventListener('input', function() {
        validatePassword(this.value);
        updateRegisterButton();
    });

    confirmPasswordInput.addEventListener('input', function() {
        validatePasswordConfirmation();
        updateRegisterButton();
    });

    // Toggle visibilidade da senha
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    });

    // Validação do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Simular envio do formulário
        showLoading();
        setTimeout(() => {
            hideLoading();
            showSuccess('Cadastro realizado com sucesso!');
            // Redirecionar para a página de login após 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }, 1500);
    });

    function validatePassword(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        Object.keys(requirements).forEach(key => {
            const element = document.getElementById(key);
            if (requirements[key]) {
                element.classList.add('valid');
                element.querySelector('i').classList.remove('fa-times');
                element.querySelector('i').classList.add('fa-check');
            } else {
                element.classList.remove('valid');
                element.querySelector('i').classList.remove('fa-check');
                element.querySelector('i').classList.add('fa-times');
            }
        });

        return Object.values(requirements).every(req => req);
    }

    function validatePasswordConfirmation() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const confirmPasswordContainer = confirmPasswordInput.parentElement;
        const passwordMatchMessage = document.getElementById('password-match-message') || createPasswordMatchMessage();

        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                confirmPasswordInput.setCustomValidity('As senhas não coincidem');
                confirmPasswordContainer.classList.add('error');
                passwordMatchMessage.textContent = 'As senhas não coincidem';
                passwordMatchMessage.classList.remove('success');
                passwordMatchMessage.classList.add('error');
            } else {
                confirmPasswordInput.setCustomValidity('');
                confirmPasswordContainer.classList.remove('error');
                passwordMatchMessage.textContent = 'As senhas coincidem';
                passwordMatchMessage.classList.remove('error');
                passwordMatchMessage.classList.add('success');
            }
        } else {
            confirmPasswordInput.setCustomValidity('');
            confirmPasswordContainer.classList.remove('error');
            passwordMatchMessage.textContent = '';
            passwordMatchMessage.classList.remove('error', 'success');
        }
    }

    function createPasswordMatchMessage() {
        const message = document.createElement('div');
        message.id = 'password-match-message';
        message.className = 'password-match-message';
        confirmPasswordInput.parentElement.appendChild(message);
        return message;
    }

    function validateForm() {
        const birthDate = new Date(birthDateInput.value);
        const age = calculateAge(birthDate);

        if (age < 18) {
            showError('É necessário ter 18 anos ou mais para se cadastrar. Menores de idade não são permitidos na plataforma.');
            return false;
        }

        return true;
    }

    function updateRegisterButton() {
        const isFormValid = form.checkValidity();
        const isPasswordValid = validatePassword(passwordInput.value);
        const isPasswordConfirmed = passwordInput.value === confirmPasswordInput.value;
        const isTermsAccepted = document.getElementById('terms').checked;

        registerBtn.disabled = !(isFormValid && isPasswordValid && isPasswordConfirmed && isTermsAccepted);
    }

    function showLoading() {
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        registerBtn.disabled = true;
    }

    function hideLoading() {
        registerBtn.innerHTML = 'Criar Conta';
        registerBtn.disabled = false;
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        form.insertBefore(successDiv, form.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Inicializar validação do botão
    updateRegisterButton();
}); 