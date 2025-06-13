document.addEventListener('DOMContentLoaded', function() {
    // Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Carrinho de Compras
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

    // Preview de imagem
    const imageInput = document.getElementById('itemImage');
    const imagePreview = document.getElementById('imagePreview');

    imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button class="remove-preview">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                // Adicionar evento para remover preview
                const removePreview = imagePreview.querySelector('.remove-preview');
                removePreview.addEventListener('click', function() {
                    imagePreview.innerHTML = '';
                    imageInput.value = '';
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // Formulário de anúncio
    const itemForm = document.getElementById('itemForm');
    const activeItems = document.getElementById('active-items');
    const soldItems = document.getElementById('sold-items');
    const totalSold = document.getElementById('total-sold');
    const totalEarnings = document.getElementById('total-earnings');

    itemForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('itemName').value,
            game: document.getElementById('game').value,
            quality: document.getElementById('quality').value,
            price: document.getElementById('price').value,
            description: document.getElementById('description').value,
            image: imagePreview.querySelector('img')?.src || '../assets/default-item.png'
        };

        // Adicionar item ao inventário ativo
        const itemElement = createItemElement(formData);
        activeItems.insertBefore(itemElement, activeItems.firstChild);

        // Resetar formulário
        itemForm.reset();
        imagePreview.innerHTML = '';

        // Mostrar mensagem de sucesso
        showSuccess('Item anunciado com sucesso!');
    });

    function createItemElement(item) {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4';
        
        col.innerHTML = `
            <div class="card item-card">
                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${item.game}</p>
                    <p class="card-text">Qualidade: ${item.quality}</p>
                    <p class="card-text">Preço: R$ ${parseFloat(item.price).toFixed(2).replace('.', ',')}</p>
                    <div class="item-actions">
                        <button class="btn btn-primary btn-sm">Editar</button>
                        <button class="btn btn-danger btn-sm">Remover</button>
                    </div>
                </div>
            </div>
        `;
        
        return col;
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success alert-dismissible fade show';
        successDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.querySelector('.inventory-container').insertBefore(successDiv, document.querySelector('.inventory-container').firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Carregar itens do carrinho
    const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const currentPurchase = JSON.parse(localStorage.getItem('currentPurchase'));
    const cartItemsSummary = document.getElementById('cart-items-summary');
    
    if (cartItemsSummary) {
        // Limpar o conteúdo atual
        cartItemsSummary.innerHTML = '';
        
        // Se houver uma compra atual, mostrar apenas ela
        if (currentPurchase && currentPurchase.items && currentPurchase.items.length > 0) {
            const item = currentPurchase.items[0];
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item-summary';
            itemElement.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">R$ ${parseFloat(item.price).toFixed(2).replace('.', ',')}</p>
                </div>
            `;
            cartItemsSummary.appendChild(itemElement);
        } 
        // Se não houver compra atual, mostrar todos os itens do carrinho
        else if (storedCartItems.length > 0) {
            storedCartItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item-summary';
                itemElement.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="item-price">R$ ${parseFloat(item.price).toFixed(2).replace('.', ',')}</p>
                    </div>
                `;
                cartItemsSummary.appendChild(itemElement);
            });
        } else {
            // Se não houver itens, mostrar mensagem
            cartItemsSummary.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        }
    }
    
    // Inicializar métodos de pagamento
    initializePaymentMethods();
}); 