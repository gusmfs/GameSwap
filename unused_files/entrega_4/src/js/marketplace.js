document.addEventListener('DOMContentLoaded', function() {
    // ===== Lógica do Toggle do Menu =====
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
        
        // Atualiza os atributos ARIA para acessibilidade
        const expanded = navMenu.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', expanded);
        
        // Previne o scroll quando o menu está aberto em dispositivos móveis
        if (expanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Fecha o menu ao clicar em links (para mobile)
    const navLinks = document.querySelectorAll('#nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 950) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
                menuToggle.setAttribute('aria-expanded', false);
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', function(event) {
        const isMenuToggle = event.target === menuToggle || menuToggle.contains(event.target);
        const isNavMenu = event.target === navMenu || navMenu.contains(event.target);
        
        if (!isMenuToggle && !isNavMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            menuToggle.setAttribute('aria-expanded', false);
            document.body.style.overflow = 'auto';
        }
    });
    
    // Trata o redimensionamento da janela para o menu
    window.addEventListener('resize', function() {
        if (window.innerWidth > 950) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            menuToggle.setAttribute('aria-expanded', false);
            document.body.style.overflow = 'auto';
        }
    });
    
    // ===== Lógica do Toggle do Filtro para Mobile =====
    const filterToggle = document.getElementById('filter-toggle');
    const filterSidebar = document.getElementById('filter-sidebar');
    const filterOverlay = document.getElementById('filter-overlay');
    const applyFilters = document.getElementById('apply-filters');
    const closeFilters = document.getElementById('close-filters');
    const clearFiltersButton = document.querySelector('.clear-filters');
    const closeFilterBtn = document.getElementById('close-filter-btn');
    
    // Função para abrir o menu de filtros
    function openFilterMenu() {
        filterToggle.classList.add('active');
        filterSidebar.classList.add('active');
        filterOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Função para fechar o menu de filtros
    function closeFilterMenu() {
        filterToggle.classList.remove('active');
        filterSidebar.classList.remove('active');
        filterOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Função para alternar o sidebar
    function toggleFilterSidebar() {
        const sidebar = document.getElementById('filter-sidebar');
        const overlay = document.getElementById('filter-overlay');
        const toggleBtn = document.getElementById('filter-toggle');
        
        if (sidebar && overlay && toggleBtn) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            toggleBtn.classList.toggle('active');
            
            // Previne o scroll do body quando o sidebar está aberto
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        }
    }

    // Event listeners para o sidebar
    document.addEventListener('DOMContentLoaded', function() {
        const filterToggle = document.getElementById('filter-toggle');
        const filterOverlay = document.getElementById('filter-overlay');
        const closeFilterBtn = document.getElementById('close-filter-btn');
        
        if (filterToggle) {
            filterToggle.addEventListener('click', function(e) {
            e.stopPropagation();
                toggleFilterSidebar();
        });
    }

    if (filterOverlay) {
            filterOverlay.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleFilterSidebar();
        });
    }

        if (closeFilterBtn) {
            closeFilterBtn.addEventListener('click', function(e) {
            e.stopPropagation();
                toggleFilterSidebar();
        });
    }
    
        // Fecha o sidebar ao redimensionar a janela para desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 950) {
                const sidebar = document.getElementById('filter-sidebar');
                const overlay = document.getElementById('filter-overlay');
                const toggleBtn = document.getElementById('filter-toggle');
                
                if (sidebar && overlay && toggleBtn) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                    toggleBtn.classList.remove('active');
                    document.body.style.overflow = '';
            }
        }
        });
    });

    // Aplica os filtros e fecha a barra lateral em mobile
    if (applyFilters) {
        applyFilters.addEventListener('click', function(e) {
            e.stopPropagation();
            aplicarFuncaoFiltro();
            if (window.innerWidth <= 950) {
                closeFilterMenu();
            }
        });
    }

    // Trata o redimensionamento da janela
    window.addEventListener('resize', function() {
        if (window.innerWidth > 950) {
            closeFilterMenu();
        }
    });
    
    // Função para aplicar os filtros
    function aplicarFuncaoFiltro() {
        const selectedGames = Array.from(document.querySelectorAll('input[name="game"]:checked')).map(cb => cb.value);
        const selectedQualities = Array.from(document.querySelectorAll('input[name="quality"]:checked')).map(cb => cb.value);
        const selectedRarities = Array.from(document.querySelectorAll('input[name="rarity"]:checked')).map(cb => cb.value);
        const selectedSellers = Array.from(document.querySelectorAll('input[name="seller"]:checked')).map(cb => cb.value);
        
        const minPrice = parseFloat(document.querySelector('.price-min').value) || 0;
        const maxPrice = parseFloat(document.querySelector('.price-max').value) || Infinity;
        const sortBy = document.querySelector('.sort-select').value;
        
        // Filtrar os itens
        let filteredItems = featuredItems.filter(item => {
            const itemPrice = parseFloat(item.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
            
            const matchesGame = selectedGames.length === 0 || selectedGames.includes(item.game.toLowerCase());
            const matchesQuality = selectedQualities.length === 0 || selectedQualities.includes(item.quality.toLowerCase().replace(' ', '-'));
            const matchesPrice = itemPrice >= minPrice && itemPrice <= maxPrice;
            const matchesSeller = selectedSellers.length === 0 || selectedSellers.includes(item.seller.badge);
            
            return matchesGame && matchesQuality && matchesPrice && matchesSeller;
        });
        
        // Ordenar os itens
        filteredItems.sort((a, b) => {
            const priceA = parseFloat(a.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
            const priceB = parseFloat(b.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
            
            switch(sortBy) {
                case 'price-asc':
                    return priceA - priceB;
                case 'price-desc':
                    return priceB - priceA;
                case 'popular':
                    return parseInt(b.seller.sales) - parseInt(a.seller.sales);
                case 'rating':
                    return parseFloat(b.seller.rating) - parseFloat(a.seller.rating);
                default:
                    return 0;
            }
        });
        
        // Atualizar a exibição
        const itemsGrid = document.getElementById('featured-items-grid');
        if (itemsGrid) {
            itemsGrid.innerHTML = '';
            filteredItems.forEach(item => {
                itemsGrid.innerHTML += createItemCard(item);
            });
            
            // Reativar os event listeners dos cards
            document.querySelectorAll('.item-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    if (!e.target.closest('.btn-buy') && !e.target.closest('.btn-trade')) {
                        const itemId = parseInt(this.dataset.id);
                        const item = filteredItems.find(i => i.id === itemId);
                        if (item) {
                            openModal(item);
                        }
                    }
                });
            });
        }
    }
    
    // Limpar todos os filtros
    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', function() {
            // Limpar checkboxes
            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Limpar inputs de preço
            document.querySelector('.price-min').value = '';
            document.querySelector('.price-max').value = '';
            
            // Resetar range slider
            const rangeSlider = document.querySelector('.range-slider');
            if (rangeSlider) rangeSlider.value = rangeSlider.max;
            
            // Resetar select de ordenação
            document.querySelector('.sort-select').value = 'price-asc';
            
            // Aplicar os filtros limpos
            aplicarFuncaoFiltro();
        });
    }
    
    // Atualizar o range slider quando os inputs de preço mudarem
    const priceInputs = document.querySelectorAll('.price-inputs input');
    const rangeSlider = document.querySelector('.range-slider');
    
    if (priceInputs && rangeSlider) {
        priceInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.classList.contains('price-max')) {
                    rangeSlider.value = this.value || rangeSlider.max;
                }
                aplicarFuncaoFiltro();
            });
        });
        
        rangeSlider.addEventListener('input', function() {
            document.querySelector('.price-max').value = this.value;
            aplicarFuncaoFiltro();
        });
    }
    
    // Aplicar filtros quando qualquer checkbox for alterado
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', aplicarFuncaoFiltro);
    });
    
    // Aplicar filtros quando a ordenação for alterada
    document.querySelector('.sort-select').addEventListener('change', aplicarFuncaoFiltro);

    // ===== Funcionalidade de busca =====
    const searchInput = document.getElementById('search-input');
    const searchButton = document.querySelector('.search-button');
    
    // Função para realizar a busca
    function realizarBusca() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Se o campo de busca estiver vazio, apenas reaplica os filtros normais
            aplicarFuncaoFiltro();
            return;
        }
        
        // Aplica os filtros normais primeiro
        let filteredItems = featuredItems.filter(item => {
            const itemPrice = parseFloat(item.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
            
            const selectedGames = Array.from(document.querySelectorAll('input[name="game"]:checked')).map(cb => cb.value);
            const selectedQualities = Array.from(document.querySelectorAll('input[name="quality"]:checked')).map(cb => cb.value);
            const selectedRarities = Array.from(document.querySelectorAll('input[name="rarity"]:checked')).map(cb => cb.value);
            const selectedSellers = Array.from(document.querySelectorAll('input[name="seller"]:checked')).map(cb => cb.value);
            
            const minPrice = parseFloat(document.querySelector('.price-min').value) || 0;
            const maxPrice = parseFloat(document.querySelector('.price-max').value) || Infinity;
            
            const matchesGame = selectedGames.length === 0 || selectedGames.includes(item.game.toLowerCase());
            const matchesQuality = selectedQualities.length === 0 || selectedQualities.includes(item.quality.toLowerCase().replace(' ', '-'));
            const matchesPrice = itemPrice >= minPrice && itemPrice <= maxPrice;
            const matchesSeller = selectedSellers.length === 0 || selectedSellers.includes(item.seller.badge);
            
            return matchesGame && matchesQuality && matchesPrice && matchesSeller;
        });
        
        // Agora filtra com base no termo de busca
        filteredItems = filteredItems.filter(item => {
            return (
                item.name.toLowerCase().includes(searchTerm) ||
                item.game.toLowerCase().includes(searchTerm) ||
                item.quality.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                item.seller.name.toLowerCase().includes(searchTerm)
            );
        });
        
        // Ordenar os itens
        const sortBy = document.querySelector('.sort-select').value;
        filteredItems.sort((a, b) => {
            const priceA = parseFloat(a.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
            const priceB = parseFloat(b.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
            
            switch(sortBy) {
                case 'price-asc':
                    return priceA - priceB;
                case 'price-desc':
                    return priceB - priceA;
                case 'popular':
                    return parseInt(b.seller.sales) - parseInt(a.seller.sales);
                case 'rating':
                    return parseFloat(b.seller.rating) - parseFloat(a.seller.rating);
                default:
                    return 0;
            }
        });
        
        // Atualizar a exibição
        const itemsGrid = document.getElementById('featured-items-grid');
        if (itemsGrid) {
            itemsGrid.innerHTML = '';
            
            if (filteredItems.length === 0) {
                // Exibe mensagem de nenhum resultado encontrado
                itemsGrid.innerHTML = `<div class="no-results">Nenhum resultado encontrado para "${searchTerm}"</div>`;
            } else {
                filteredItems.forEach(item => {
                    itemsGrid.innerHTML += createItemCard(item);
                });
                
                // Reativar os event listeners dos cards
                document.querySelectorAll('.item-card').forEach(card => {
                    card.addEventListener('click', function(e) {
                        if (!e.target.closest('.btn-buy') && !e.target.closest('.btn-trade')) {
                            const itemId = parseInt(this.dataset.id);
                            const item = filteredItems.find(i => i.id === itemId);
                            if (item) {
                                openModal(item);
                            }
                        }
                    });
                });
            }
        }
    }
    
    // Event listener para o botão de busca
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            realizarBusca();
        });
    }
    
    // Event listener para a tecla Enter no campo de busca
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                realizarBusca();
            }
        });
        
        // Pesquisa automática ao digitar com pequeno delay
        let timeoutId;
        searchInput.addEventListener('input', function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                realizarBusca();
            }, 500); // Espera 500ms após o usuário parar de digitar
        });
    }

    // ===== Dados de Exemplo =====
    const featuredItems = [
        {
            id: 1,
            name: "M4A1-S | Cyrex",
            game: "CS:GO",
            price: "R$ 129,90",
            image: "../assets/skins/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlZG0kfjmML7VqWZU7Mxkh6eQodr23lKx_BZqZ2vyLIa.webp",
            seller: {
                name: "EliteSkins",
                rating: "4.9",
                sales: "2000",
                badge: "gold"
            },
            quality: "Factory New",
            description: "Skin rara e cobiçada, perfeita para colecionadores. Condição impecável e sem arranhões."
        },
        {
            id: 2,
            name: "AWP | Dragon Lore",
            game: "CS:GO",
            price: "R$ 2.999,90",
            image: "../assets/skins/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTj5X09ujgL-HmOXxDLfYkWNFpp0i07iQpN733wLi_URlZj_xItW.webp",
            seller: {
                name: "RareSkins",
                rating: "5.0",
                sales: "+10000 vendas",
                badge: "platinum"
            },
            quality: "Factory New",
            description: "Uma das skins mais raras e valiosas do CS:GO. Condição perfeita e autenticidade garantida."
        },
        {
            id: 7,
            name: "M4A4 | Howl",
            game: "CS:GO",
            price: "R$ 1.999,90",
            image: "../assets/skins/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FABz7P7YKAJR-N2kmImMn-PLP7LWnn8fvsEn3u3Dotv22FC1_Uc_Ym_yJIO.webp",
            seller: {
                name: "SkinKing",
                rating: "5.0",
                sales: "+5000 vendas",
                badge: "platinum"
            },
            quality: "Minimal Wear",
            description: "Skin lendária e extremamente rara. Uma das mais cobiçadas do jogo."
        },
        {
            id: 8,
            name: "AK-47 | Fire Serpent",
            game: "CS:GO",
            price: "R$ 899,90",
            image: "../assets/skins/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FABz7P7YKAJR-N2kmImMn-PLP7LWnn8fvsEn3u3Dotv22FC1_Uc_Ym_yJIO.webp",
            seller: {
                name: "EliteSkins",
                rating: "4.9",
                sales: "+2000 vendas",
                badge: "gold"
            },
            quality: "Field-Tested",
            description: "Skin icônica com design único. Uma das mais populares do jogo."
        },
        {
            id: 9,
            name: "USP-S | Kill Confirmed",
            game: "CS:GO",
            price: "R$ 159,90",
            image: "../assets/skins/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJlZG0lfvhNr_um25V4dB8xLqZoNqn21bkqUM6Zm77J4WUdVU2Y1nW_.webp",
            seller: {
                name: "ProGamerStore",
                rating: "4.8",
                sales: "+2500 vendas",
                badge: "gold"
            },
            quality: "Minimal Wear",
            description: "Skin com design moderno e detalhes impressionantes."
        },
        {
            id: 10,
            name: "Desert Eagle | Blaze",
            game: "CS:GO",
            price: "R$ 299,90",
            image: "../assets/skins/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTj5X09ujgL-HmOXxDLfYkWNFpp0i07iQpN733wLi_URlZj_xItW.webp",
            seller: {
                name: "GameMasterBR",
                rating: "4.9",
                sales: "+1000 vendas",
                badge: "gold"
            },
            quality: "Factory New",
            description: "Skin com design flamejante e cores vibrantes."
        },
        {
            id: 11,
            name: "AWP | Medusa",
            game: "CS:GO",
            price: "R$ 1.499,90",
            image: "../assets/skins/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTj5X09ujgL-HmOXxDLfYkWNFpp0i07iQpN733wLi_URlZj_xItW.webp",
            seller: {
                name: "RareSkins",
                rating: "5.0",
                sales: "+10000 vendas",
                badge: "platinum"
            },
            quality: "Minimal Wear",
            description: "Skin lendária com design inspirado na mitologia grega."
        },
        {
            id: 12,
            name: "AK-47 | Vulcan",
            game: "CS:GO",
            price: "R$ 399,90",
            image: "../assets/skins/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTj5X09ujgL-HmOXxDLfYkWNFpp0i07iQpN733wLi_URlZj_xItW.webp",
            seller: {
                name: "SkinKing",
                rating: "5.0",
                sales: "+5000 vendas",
                badge: "platinum"
            },
            quality: "Field-Tested",
            description: "Skin com design futurista e cores vibrantes."
        }
    ];

    const trendingItems = [
        {
            id: 3,
            name: "AWP | Dragon Lore",
            game: "CS:GO",
            price: "R$ 2.999,90",
            image: "../assets/skins/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTj5X09ujgL-HmOXxDLfYkWNFpp0i07iQpN733wLi_URlZj_xItW.webp",
            quality: "Factory New",
            seller: {
                name: "RareSkins",
                badge: "platinum",
                rating: 5.0,
                sales: 10000
            }
        },
        {
            id: 4,
            name: "AK-47 | Fire Serpent",
            game: "CS:GO",
            price: "R$ 899,90",
            image: "../assets/skins/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FABz7P7YKAJR-N2kmImMn-PLP7LWnn8fvsEn3u3Dotv22FC1_Uc_Ym_yJIO.webp",
            quality: "Minimal Wear",
            seller: {
                name: "EliteSkins",
                badge: "gold",
                rating: 4.9,
                sales: 2000
            }
        },
        {
            id: 5,
            name: "USP-S | Kill Confirmed",
            game: "CS:GO",
            price: "R$ 159,90",
            image: "../assets/skins/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJlZG0lfvhNr_um25V4dB8xLqZoNqn21bkqUM6Zm77J4WUdVU2Y1nW_.webp",
            quality: "Minimal Wear",
            seller: {
                name: "ProGamerStore",
                badge: "gold",
                rating: 4.8,
                sales: 2500
            }
        },
        {
            id: 6,
            name: "Desert Eagle | Blaze",
            game: "CS:GO",
            price: "R$ 299,90",
            image: "../assets/skins/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTj5X09ujgL-HmOXxDLfYkWNFpp0i07iQpN733wLi_URlZj_xItW.webp",
            quality: "Factory New",
            seller: {
                name: "GameMasterBR",
                badge: "gold",
                rating: 4.9,
                sales: 1000
            }
        }
    ];

    // ===== Funções de Renderização =====
    function createItemCard(item) {
        return `
            <div class="item-card" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-overlay">
                        <span class="item-price">${item.price}</span>
                    </div>
                </div>
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>${item.game}</p>
                    <div class="seller-info">
                        <div class="seller-badge ${item.seller.badge}">
                            <i class="fas fa-${item.seller.badge === 'platinum' ? 'gem' : 'crown'}"></i>
                            <span>${item.seller.badge.charAt(0).toUpperCase() + item.seller.badge.slice(1)}</span>
                        </div>
                        <div class="seller-details">
                            <p class="seller-name">${item.seller.name}</p>
                            <div class="seller-stats">
                                <span class="rating"><i class="fas fa-star"></i> ${item.seller.rating}</span>
                                <span class="sales">+${item.seller.sales} vendas</span>
                            </div>
                        </div>
                    </div>
                    <div class="security-badges">
                        <span class="badge"><i class="fas fa-shield-alt"></i> Verificado</span>
                        <span class="badge"><i class="fas fa-lock"></i> Seguro</span>
                    </div>
                    <div class="item-actions">
                        <button class="btn-buy">Comprar</button>
                        <button class="btn-add-cart" onclick="addToCart(${item.id})">
                            <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function createTrendingCard(item) {
        return `
            <div class="trending-card" data-id="${item.id}">
                <div class="trending-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="trending-info">
                    <h3>${item.name}</h3>
                    <p>${item.game} | ${item.quality}</p>
                    <div class="trending-price">${item.price}</div>
                </div>
            </div>
        `;
    }

    // ===== Funções de Renderização =====
    function renderFeaturedItems() {
        const featuredItemsGrid = document.getElementById('featured-items-grid');
        if (!featuredItemsGrid) return;
        
        let html = '';
        
        featuredItems.forEach(item => {
            html += createItemCard(item);
        });
        
        featuredItemsGrid.innerHTML = html;
        
        // Adicionar event listeners para os cartões
        document.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.btn-buy') && !e.target.closest('.btn-trade')) {
                    const itemId = parseInt(this.dataset.id);
                    const item = featuredItems.find(i => i.id === itemId) || trendingItems.find(i => i.id === itemId);
                    if (item) {
                        openModal(item);
                    }
                }
            });
        });
    }

    function renderTrendingItems() {
        const trendingGrid = document.getElementById('trending-grid');
        if (!trendingGrid) return;
        
        let html = '';
        
        trendingItems.forEach(item => {
            html += createTrendingCard(item);
        });
        
        trendingGrid.innerHTML = html;
        createDots();
        adjustItemsPerSlide();
    }

    // ===== Modal de Produto =====
    const modal = document.getElementById('product-modal');
    const closeModal = modal ? modal.querySelector('.close-modal') : null;

    function openModal(item) {
        if (!modal) return;
        
        const modalProductName = document.getElementById('modal-product-name');
        const modalProductGame = document.getElementById('modal-product-game');
        const modalProductPrice = document.getElementById('modal-product-price');
        const modalProductImage = document.getElementById('modal-product-image');
        const modalProductQuality = document.getElementById('modal-product-quality');
        const modalSellerName = document.getElementById('modal-seller-name');
        const modalSellerRating = document.getElementById('modal-seller-rating');
        const modalSellerSales = document.getElementById('modal-seller-sales');
        const modalSellerBadge = document.getElementById('modal-seller-badge');
        
        if (modalProductName) modalProductName.textContent = item.name;
        if (modalProductGame) modalProductGame.textContent = item.game;
        if (modalProductPrice) modalProductPrice.textContent = item.price;
        if (modalProductImage) modalProductImage.src = item.image;
        if (modalProductQuality) modalProductQuality.textContent = item.quality;
        if (modalSellerName) modalSellerName.textContent = item.seller.name;
        if (modalSellerRating) modalSellerRating.innerHTML = `<i class="fas fa-star"></i> ${item.seller.rating}`;
        if (modalSellerSales) modalSellerSales.textContent = `+${item.seller.sales} vendas`;
        
        if (modalSellerBadge) {
            modalSellerBadge.innerHTML = `
                <div class="seller-badge ${item.seller.badge}">
                    <i class="fas fa-${item.seller.badge === 'platinum' ? 'gem' : 'crown'}"></i>
                    <span>${item.seller.badge === 'platinum' ? 'Platinum' : 'Gold'}</span>
                </div>
            `;
        }

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Event Listeners para o modal
    if (modal) {
        document.addEventListener('click', function(e) {
            const itemCard = e.target.closest('.item-card');
            const trendingCard = e.target.closest('.trending-card');
            
            // Se o clique foi em um botão "Comprar" dentro de um item, abra o modal primeiro
            if (e.target.classList.contains('btn-buy') || e.target.classList.contains('btn-trade')) {
                if (itemCard) {
                    const itemId = parseInt(itemCard.dataset.id);
                    let item = featuredItems.find(i => i.id === itemId);
                    if (!item) {
                        item = trendingItems.find(i => i.id === itemId);
                    }
                    
                    if (item) {
                        // Se for clique em botão de comprar, abrimos o modal primeiro
                        e.preventDefault();
                        openModal(item);
                        return; // Retorna para não executar o restante da função
                    }
                }
            }
            
            // Para cliques em outros elementos do card
            if (itemCard && !e.target.classList.contains('btn-buy') && !e.target.classList.contains('btn-trade')) {
                const itemId = parseInt(itemCard.dataset.id);
                const item = featuredItems.find(i => i.id === itemId);
                if (item) openModal(item);
            } else if (trendingCard) {
                const itemId = parseInt(trendingCard.dataset.id);
                const item = trendingItems.find(i => i.id === itemId);
                if (item) openModal(item);
            }
        });

        if (closeModal) {
            closeModal.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Modal product action buttons
        const modalBuyButton = document.querySelector('.modal-actions .btn-buy');
        const modalAddToCartButton = document.querySelector('.modal-actions .btn-add-to-cart');

        if (modalBuyButton) {
            modalBuyButton.addEventListener('click', function() {
                const modalProductName = document.getElementById('modal-product-name');
                if (!modalProductName) return;
                
                const itemName = modalProductName.textContent;
                const item = featuredItems.find(i => i.name === itemName) || trendingItems.find(i => i.name === itemName);
                
                if (item) {
                    localStorage.setItem('currentPurchase', JSON.stringify({
                        items: [item]
                    }));
                    window.location.href = '../pages/payment.html';
                }
            });
        }

        if (modalAddToCartButton) {
            modalAddToCartButton.addEventListener('click', function() {
                const modalProductName = document.getElementById('modal-product-name');
                if (!modalProductName) return;
                
                const itemName = modalProductName.textContent;
                const item = featuredItems.find(i => i.name === itemName) || trendingItems.find(i => i.name === itemName);
                
                if (item) {
                    addToCart(item);
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    alert('Item adicionado ao carrinho!');
                }
            });
        }
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

    function addToCart(item) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
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

    // Event Listeners para botões de compra e troca
    document.addEventListener('click', function(e) {
        // Lógica específica para os botões de compra direta e troca fora do modal
        if (e.target.classList.contains('btn-buy') && !e.target.closest('.modal-actions')) {
            // Se o botão está dentro do modal, ignoramos (será tratado por outro listener)
            if (e.target.closest('.modal-content')) return;
            
            const itemCard = e.target.closest('.item-card');
            if (itemCard) {
                const itemId = parseInt(itemCard.dataset.id);
                let item = featuredItems.find(i => i.id === itemId);
                if (!item) {
                    item = trendingItems.find(i => i.id === itemId);
                }

                if (item) {
                    e.preventDefault();
                    openModal(item);
                }
            }
        } else if (e.target.classList.contains('btn-trade') && !e.target.closest('.modal-actions')) {
            // Se o botão está dentro do modal, ignoramos (será tratado por outro listener)
            if (e.target.closest('.modal-content')) return;
            
            const itemCard = e.target.closest('.item-card');
            if (itemCard) {
                const itemId = parseInt(itemCard.dataset.id);
                // Se não conseguirmos encontrar nos featured items, tentamos nos trending items
                let item = featuredItems.find(i => i.id === itemId);
                if (!item) {
                    item = trendingItems.find(i => i.id === itemId);
                }

                if (item) {
                    alert(`Proposta de troca para ${item.name} enviada com sucesso! O vendedor irá revisar sua oferta em breve.`);
                }
            }
        }
    });

    // ===== Carrossel de Tendências =====
    const carousel = document.querySelector('.trending-grid');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    let itemsPerSlide = 4;
    const itemWidth = 250;
    const gap = 16;
    
    function createDots() {
        if (!dotsContainer || !carousel) return;
        
        const totalItems = document.querySelectorAll('.trending-grid .trending-card').length;
        const totalSlides = Math.ceil(totalItems / itemsPerSlide);
        
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        }
        
        // Adicionar event listeners aos pontos
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
    }
    
    function updateCarousel() {
        if (!carousel) return;
        
        const offset = currentIndex * (itemsPerSlide * (itemWidth + gap));
        carousel.style.transform = `translateX(-${offset}px)`;
        
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
        }
        
        if (nextBtn && carousel) {
            nextBtn.disabled = currentIndex >= Math.ceil(carousel.children.length / itemsPerSlide) - 1;
        }
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!carousel) return;
            
            const maxIndex = Math.ceil(carousel.children.length / itemsPerSlide) - 1;
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });
    }
    
    function adjustItemsPerSlide() {
        const width = window.innerWidth;
        if (width < 768) {
            itemsPerSlide = 1;
        } else if (width < 1024) {
            itemsPerSlide = 2;
        } else if (width < 1400) {
            itemsPerSlide = 3;
        } else {
            itemsPerSlide = 4;
        }
        updateCarousel();
    }
    
    if (carousel) {
        window.addEventListener('resize', adjustItemsPerSlide);
    }

    // Adiciona a classe active ao link da página atual
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ===== Inicialização =====
    renderFeaturedItems();
    renderTrendingItems();
    updateCartCount();
    if (dotsContainer) createDots();
    updateCarousel();
    adjustItemsPerSlide();

    // Carregar dados da compra atual
    const currentPurchase = JSON.parse(localStorage.getItem('currentPurchase'));
    const cartItemsSummary = document.getElementById('cart-items-summary');
    
    if (cartItemsSummary && currentPurchase) {
        // Limpar o conteúdo atual
        cartItemsSummary.innerHTML = '';
        
        // Criar elemento para o item
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item-summary';
        itemElement.innerHTML = `
            <div class="item-image">
                <img src="${currentPurchase.image}" alt="${currentPurchase.name}">
            </div>
            <div class="item-details">
                <h3>${currentPurchase.name}</h3>
                <p class="item-price">${currentPurchase.price}</p>
            </div>
        `;
        cartItemsSummary.appendChild(itemElement);
    } else if (cartItemsSummary) {
        // Se não houver compra atual, mostrar mensagem
        cartItemsSummary.innerHTML = '<p class="empty-cart">Nenhum item selecionado para compra</p>';
    }
    
    // Inicializar métodos de pagamento
    initializePaymentMethods();
}); 