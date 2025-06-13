// Função para calcular pontos de fidelidade
export function calculateLoyaltyPoints(purchaseValue) {
    // 1 ponto por real gasto
    return Math.floor(purchaseValue);
}

// Função para atualizar os pontos do usuário
export function updateUserPoints(points) {
    const currentPoints = parseInt(localStorage.getItem('loyaltyPoints')) || 0;
    const newTotal = currentPoints + points;
    localStorage.setItem('loyaltyPoints', newTotal.toString());
    return newTotal;
}

// Função para exibir os pontos na interface
export function displayLoyaltyPoints(points) {
    const pointsElement = document.getElementById('total-points');
    if (pointsElement) {
        pointsElement.textContent = points.toLocaleString('pt-BR');
    }
}

// Função para processar os pontos de uma compra
export function processLoyaltyPoints(purchaseValue) {
    const earnedPoints = calculateLoyaltyPoints(purchaseValue);
    const totalPoints = updateUserPoints(earnedPoints);
    displayLoyaltyPoints(totalPoints);
    return {
        earnedPoints,
        totalPoints
    };
} 