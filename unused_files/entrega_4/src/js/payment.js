import { processLoyaltyPoints, calculateLoyaltyPoints } from './loyalty-points.js';

// Função para formatar o número do cartão
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    let formattedValue = '';
    
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    input.value = formattedValue;
    updateCardPreview();
}

// Função para formatar a data de expiração
function formatExpirationDate(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    input.value = value;
    updateCardPreview();
}

// Função para formatar o nome do titular
function formatCardholderName(input) {
    input.value = input.value.toUpperCase();
    updateCardPreview();
}

// Função para atualizar o preview do cartão
function updateCardPreview() {
    const cardNumber = document.getElementById('card-number').value;
    const cardholderName = document.getElementById('card-holder').value;
    const expirationDate = document.getElementById('card-expiry').value;
    
    document.querySelector('.card-number').textContent = cardNumber || '**** **** **** ****';
    document.querySelector('.card-details').innerHTML = `
        <div>${cardholderName || 'NOME DO TITULAR'}</div>
        <div>${expirationDate || 'MM/AA'}</div>
    `;
}

// Função para validar a data de expiração
function validateExpirationDate(expirationDate) {
    const [month, year] = expirationDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        return false;
    }
    
    return true;
}

// Função para validar o número do cartão (validação básica)
function validateCardNumber(cardNumber) {
    // Remove caracteres não numéricos
    const digits = cardNumber.replace(/\D/g, '');
    
    // Verifica se tem entre 13 e 19 dígitos
    if (digits.length < 13 || digits.length > 19) {
        return false;
    }
    
    return true;
}

// Função para tokenizar os dados do cartão
/*async function tokenizeCard(cardData) {
    try {
        // Simulação de chamada à API de tokenização
        const response = await fetch('https://api.gameswap.com/tokenize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('authToken')
            },
            body: JSON.stringify(cardData)
        });
        
        if (!response.ok) {
            throw new Error('Erro na tokenização do cartão');
        }
        
        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('Erro na tokenização:', error);
        throw error;
    }
}*/

// Funções para gerenciar métodos de pagamento alternativos
function initializePaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const creditCardSection = document.getElementById('credit-card-section');
    const pixSection = document.getElementById('pix-payment-section');
    const applePaySection = document.getElementById('apple-pay-section');
    const paypalSection = document.getElementById('paypal-section');
    const paymentOptions = document.querySelectorAll('.payment-method-option');
    
    // Função para mostrar/esconder seções de pagamento
    function togglePaymentSections() {
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        // Esconder todas as seções
        creditCardSection.style.display = 'none';
        pixSection.style.display = 'none';
        applePaySection.style.display = 'none';
        paypalSection.style.display = 'none';
        
        // Remover classe selected de todas as opções
        paymentOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        // Mostrar a seção selecionada
        switch(selectedMethod) {
            case 'credit-card':
                creditCardSection.style.display = 'block';
                document.getElementById('credit-card-option').classList.add('selected');
                break;
            case 'pix':
                pixSection.style.display = 'block';
                document.getElementById('pix-option').classList.add('selected');
                generatePixQRCode();
                startPixCountdown();
                break;
            case 'apple-pay':
                applePaySection.style.display = 'block';
                document.getElementById('apple-pay-option').classList.add('selected');
                break;
            case 'paypal':
                paypalSection.style.display = 'block';
                document.getElementById('paypal-option').classList.add('selected');
                break;
        }
    }
    
    // Adicionar evento de clique para cada opção de pagamento
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radioInput = this.querySelector('input[type="radio"]');
            radioInput.checked = true;
            togglePaymentSections();
        });
    });
    
    // Adicionar evento de mudança para os radio buttons
    paymentMethods.forEach(method => {
        method.addEventListener('change', togglePaymentSections);
    });
    
    // Inicializar com o método padrão (cartão de crédito)
    document.getElementById('credit-card-option').classList.add('selected');
}

// Função para gerar QR Code do PIX
function generatePixQRCode() {
    // Pegar o valor total atual
    const totalElement = document.querySelector('.summary-total span:last-child');
    let totalValue = '0,00';
    
    if (totalElement) {
        totalValue = totalElement.textContent.replace('R$ ', '');
    }
    
    // Atualizar o QR Code com o valor atual
    const qrPlaceholder = document.querySelector('.qr-placeholder');
    qrPlaceholder.innerHTML = `
        <i class="fas fa-qrcode"></i>
        <p>QR Code gerado</p>
        <p class="qr-info">Valor: R$ ${totalValue}</p>
    `;
}

// Função para iniciar o contador regressivo do PIX
function startPixCountdown() {
    const countdownElement = document.querySelector('.countdown');
    let minutes = 15;
    let seconds = 0;
    
    const countdownInterval = setInterval(() => {
        if (seconds === 0) {
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (minutes === 0 && seconds === 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = 'Expirado';
            countdownElement.style.color = '#e74c3c';
            
            // Gerar novo QR Code após expiração
            setTimeout(() => {
                generatePixQRCode();
                startPixCountdown();
            }, 2000);
        }
    }, 1000);
}

// Função para copiar o código PIX
function copyPixCode() {
    const codeDisplay = document.querySelector('.code-display');
    const codeText = codeDisplay.textContent;
    
    navigator.clipboard.writeText(codeText).then(() => {
        const copyButton = document.querySelector('.btn-copy-code');
        const originalText = copyButton.innerHTML;
        
        copyButton.innerHTML = '<i class="fas fa-check"></i> Código copiado!';
        
        setTimeout(() => {
            copyButton.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar o código: ', err);
    });
}

// Função para processar pagamento com Apple Pay
function processApplePay() {
    // Verificar se o Apple Pay está disponível
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
        showLoading();
        
        // Simulação de processamento
        setTimeout(() => {
            hideLoading();
            showSuccess('Pagamento com Apple Pay processado com sucesso!');
        }, 2000);
    } else {
        showError('Apple Pay não está disponível neste dispositivo.');
    }
}

// Função para processar pagamento com PayPal
function processPayPal() {
    showLoading();
    
    // Simulação de redirecionamento para o PayPal
    setTimeout(() => {
        hideLoading();
        showSuccess('Pagamento com PayPal processado com sucesso!');
    }, 2000);
}

// Função para processar pagamento com PIX
function processPix() {
    showLoading();
    
    // Simulação de processamento do PIX
    setTimeout(() => {
        hideLoading();
        showSuccess('Pagamento com PIX processado com sucesso!');
    }, 2000);
}

// Modificar a função processPayment para incluir o processamento de pontos
async function processPayment(event) {
    event.preventDefault();
    
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // Obter o valor total da compra
    const totalElement = document.querySelector('.summary-total span:last-child');
    const totalValue = parseFloat(totalElement.textContent.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
            
    // Processar os pontos de fidelidade
    const pointsResult = processLoyaltyPoints(totalValue);
                
    // Atualizar os pontos no localStorage
    const currentPoints = parseInt(localStorage.getItem('loyaltyPoints')) || 0;
    const newTotalPoints = currentPoints + pointsResult.earnedPoints;
    localStorage.setItem('loyaltyPoints', newTotalPoints.toString());
                
    // Mostrar mensagem de sucesso
    showSuccess(`Pagamento processado com sucesso! Você ganhou ${pointsResult.earnedPoints.toLocaleString('pt-BR')} pontos de fidelidade!`);
    
    // Limpar carrinho após pagamento bem-sucedido
    localStorage.removeItem('cart');
    localStorage.removeItem('currentPurchase');
    
    // Redirecionar para a página de perfil após 2 segundos
    setTimeout(() => {
        window.location.href = './profile.html';
    }, 2000);
}

// Funções auxiliares para feedback visual
function showLoading() {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading-overlay';
    loadingElement.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Processando pagamento...</p>
    `;
    document.body.appendChild(loadingElement);
}

function hideLoading() {
    const loadingElement = document.querySelector('.loading-overlay');
    if (loadingElement) {
        loadingElement.remove();
    }
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.querySelector('.payment-card').appendChild(errorElement);
    
    setTimeout(() => {
        errorElement.remove();
    }, 3000);
}

function showSuccess(message) {
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;
    document.querySelector('.payment-card').appendChild(successElement);
    
    setTimeout(() => {
        successElement.remove();
    }, 3000);
}

// Função para atualizar o resumo do pagamento
function updatePaymentSummary() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const currentPurchase = JSON.parse(localStorage.getItem('currentPurchase'));
    const cartItemsSummary = document.getElementById('cart-items-summary');
    
    if (cartItemsSummary) {
        // Limpar o conteúdo atual
        cartItemsSummary.innerHTML = '';
        
        let subtotal = 0;
        
        // Se houver uma compra atual, mostrar apenas ela
        if (currentPurchase) {
            // Verificar se é um item único ou um array de itens
            const itemsToShow = currentPurchase.items || [currentPurchase];
            
            itemsToShow.forEach(item => {
                const price = parseFloat(item.price.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
                subtotal += price;
                
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item-summary';
                itemElement.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="item-price">${item.price}</p>
                    </div>
                `;
                cartItemsSummary.appendChild(itemElement);
            });
        }
        // Se não houver compra atual, mostrar todos os itens do carrinho
        else if (cartItems.length > 0) {
            cartItems.forEach(item => {
                const price = parseFloat(item.price.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
                subtotal += price;
                
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item-summary';
                itemElement.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="item-price">${item.price}</p>
                    </div>
                `;
                cartItemsSummary.appendChild(itemElement);
            });
        } else {
            // Se não houver itens, mostrar mensagem
            cartItemsSummary.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        }
        
        // Calcular taxa de serviço (5% do subtotal)
        const serviceFee = subtotal * 0.05;
        
        // Calcular total
        const total = subtotal + serviceFee;
        
        // Calcular pontos que serão ganhos (1 ponto por real)
        const pointsToEarn = Math.floor(total);
        
        // Atualizar valores na interface
        const subtotalElement = document.getElementById('subtotal-value');
        const serviceFeeElement = document.getElementById('service-fee-value');
        const totalElement = document.getElementById('total-value');
        const pointsElement = document.getElementById('points-earned-value');

        if (subtotalElement) subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        if (serviceFeeElement) serviceFeeElement.textContent = `R$ ${serviceFee.toFixed(2).replace('.', ',')}`;
        if (totalElement) totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        if (pointsElement) pointsElement.textContent = pointsToEarn.toLocaleString('pt-BR');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o resumo do pagamento
    updatePaymentSummary();
    
    // Inicializar métodos de pagamento
    initializePaymentMethods();
    
    // Adicionar listener para o formulário de pagamento
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', processPayment);
    }
    
    // Adicionar listener para atualizar o resumo quando houver mudanças
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart' || e.key === 'currentPurchase') {
            updatePaymentSummary();
        }
    });
}); 