document.addEventListener('DOMContentLoaded', function() {
    // ===== Sistema de Abas =====
    const menuItems = document.querySelectorAll('.menu-item');
    const tabContents = document.querySelectorAll('.tab-content');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items and contents
            menuItems.forEach(i => i.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked item and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });

    // ===== Upload de Avatar =====
    const changeAvatarBtn = document.getElementById('change-avatar');
    const avatarImg = document.getElementById('profile-avatar-img');

    changeAvatarBtn.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarImg.src = e.target.result;
                    // Aqui você pode adicionar a lógica para salvar a imagem no servidor
                };
                reader.readAsDataURL(file);
            }
        });
        
        input.click();
    });

    // ===== Validação de Formulários =====
    const personalForm = document.getElementById('personal-form');
    const securityForm = document.getElementById('security-form');
    const notificationsForm = document.getElementById('notifications-form');

    // Validação do formulário de dados pessoais
    personalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validatePersonalForm()) {
            showLoading(this.querySelector('.btn-save'));
            // Simular salvamento
            setTimeout(() => {
                hideLoading(this.querySelector('.btn-save'));
                showSuccess('Dados atualizados com sucesso!');
            }, 1500);
        }
    });

    // Validação do formulário de segurança
    securityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateSecurityForm()) {
            showLoading(this.querySelector('.btn-save'));
            // Simular alteração de senha
            setTimeout(() => {
                hideLoading(this.querySelector('.btn-save'));
                showSuccess('Senha alterada com sucesso!');
            }, 1500);
        }
    });

    // Validação do formulário de notificações
    notificationsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showLoading(this.querySelector('.btn-save'));
        // Simular salvamento de preferências
        setTimeout(() => {
            hideLoading(this.querySelector('.btn-save'));
            showSuccess('Preferências salvas com sucesso!');
        }, 1500);
    });

    // ===== Funções de Validação =====
    function validatePersonalForm() {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const document = document.getElementById('document').value;
        const birthDate = document.getElementById('birthDate').value;

        if (!fullName || !email || !document || !birthDate) {
            showError('Por favor, preencha todos os campos obrigatórios.');
            return false;
        }

        if (!validateEmail(email)) {
            showError('Por favor, insira um e-mail válido.');
            return false;
        }

        if (!validateDocument(document)) {
            showError('Por favor, insira um CPF válido.');
            return false;
        }

        return true;
    }

    function validateSecurityForm() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            showError('Por favor, preencha todos os campos.');
            return false;
        }

        if (newPassword !== confirmPassword) {
            showError('As senhas não coincidem.');
            return false;
        }

        if (!validatePassword(newPassword)) {
            showError('A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.');
            return false;
        }

        return true;
    }

    // ===== Funções Auxiliares =====
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateDocument(document) {
        // Implementação básica de validação de CPF
        const re = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
        return re.test(document);
    }

    function validatePassword(password) {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    }

    function showLoading(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        button.disabled = true;
        button.dataset.originalText = originalText;
    }

    function hideLoading(button) {
        button.innerHTML = button.dataset.originalText;
        button.disabled = false;
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        document.querySelector('.profile-main').insertBefore(errorDiv, document.querySelector('.profile-main').firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        document.querySelector('.profile-main').insertBefore(successDiv, document.querySelector('.profile-main').firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // ===== Carrinho de Compras =====
    const cartButton = document.getElementById('cart-button');
    const cartCount = document.querySelector('.cart-count');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const checkoutButton = document.getElementById('btn-checkout');

    // Atualizar contador do carrinho
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount.textContent = cart.length;
    }

    // Atualizar itens do carrinho
    function updateCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItemsContainer.innerHTML = '';
        
        let total = 0;
        
        cart.forEach((item, index) => {
            const price = parseFloat(item.price.toString().replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
            total += price;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>${item.game}</p>
                    <span class="cart-item-price">R$ ${price.toFixed(2).replace('.', ',')}</span>
                </div>
                <button class="remove-item" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        totalPrice.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
                updatedCart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                updateCartCount();
                updateCartItems();
            });
        });
    }

    // Event Listeners para o carrinho
    cartButton.addEventListener('click', function() {
        updateCartItems();
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    closeCart.addEventListener('click', function() {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Botão de checkout
    checkoutButton.addEventListener('click', function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length > 0) {
            // Salvar os itens do carrinho como currentPurchase
            localStorage.setItem('currentPurchase', JSON.stringify({
                items: cart
            }));
            window.location.href = '../pages/payment.html';
        } else {
            alert('Seu carrinho está vazio!');
        }
    });

    // Atualizar contador do carrinho ao carregar a página
    window.addEventListener('load', function() {
        updateCartCount();
    });
});
