import { getCurrentLevel, getNextLevel, calculateLevelProgress, getPointsForNextLevel } from './loyalty-levels.js';

// Função para atualizar a exibição dos pontos
function updatePointsDisplay() {
    // Recupera os pontos do localStorage
    const totalPoints = parseInt(localStorage.getItem('loyaltyPoints')) || 0;
    
    // Atualiza o valor total de pontos
    const pointsElement = document.getElementById('total-points');
    if (pointsElement) {
        pointsElement.textContent = totalPoints.toLocaleString('pt-BR');
    }
    
    // Obtém o nível atual e o próximo nível
    const currentLevel = getCurrentLevel(totalPoints);
    const nextLevel = getNextLevel(totalPoints);
    
    // Atualiza o nome do nível atual
    const levelNameElement = document.getElementById('current-level-name');
    if (levelNameElement) {
        levelNameElement.textContent = currentLevel.name;
    }
    
    // Atualiza a barra de progresso
    const progressBar = document.getElementById('points-progress');
    if (progressBar) {
        const progress = calculateLevelProgress(totalPoints);
        progressBar.style.width = `${progress}%`;
    }
    
    // Atualiza os pontos necessários para o próximo nível
    const nextLevelPoints = document.getElementById('next-level-points');
    if (nextLevelPoints) {
        if (nextLevel) {
            const remainingPoints = getPointsForNextLevel(totalPoints);
            if (currentLevel.level === 1) {
                nextLevelPoints.textContent = `${remainingPoints.toLocaleString('pt-BR')} pontos para atingir o nível ${nextLevel.name}`;
            } else {
                nextLevelPoints.textContent = `${remainingPoints.toLocaleString('pt-BR')} pontos para ${nextLevel.name}`;
            }
        } else {
            nextLevelPoints.textContent = "Nível máximo alcançado!";
        }
    }
    
    // Atualiza a lista de benefícios
    const benefitsList = document.getElementById('loyalty-benefits');
    if (benefitsList) {
        benefitsList.innerHTML = '';
        currentLevel.benefits.forEach(benefit => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i> ${benefit}`;
            benefitsList.appendChild(li);
        });
        
        // Adiciona benefícios do próximo nível se houver
        if (nextLevel) {
            const nextLevelHeader = document.createElement('li');
            nextLevelHeader.className = 'next-level-benefits';
            nextLevelHeader.innerHTML = `<h4>Benefícios do próximo nível (${nextLevel.name}):</h4>`;
            benefitsList.appendChild(nextLevelHeader);
            
            nextLevel.benefits.forEach(benefit => {
                if (!currentLevel.benefits.includes(benefit)) {
                    const li = document.createElement('li');
                    li.className = 'next-benefit';
                    li.innerHTML = `<i class="fas fa-lock"></i> ${benefit}`;
                    benefitsList.appendChild(li);
                }
            });
        }
    }
}

// Atualiza a exibição quando a página carregar
document.addEventListener('DOMContentLoaded', updatePointsDisplay);

// Atualiza a exibição quando houver mudanças no localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'loyaltyPoints') {
        updatePointsDisplay();
    }
}); 