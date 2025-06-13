// Definição dos níveis de fidelidade
export const loyaltyLevels = [
    {
        level: 1,
        name: "Iniciante",
        pointsRequired: 0,
        maxPoints: 500,
        benefits: [
            "Acesso ao marketplace",
            "Sistema de pontos básico"
        ]
    },
    {
        level: 2,
        name: "Colecionador",
        pointsRequired: 500,
        benefits: [
            "Todos os benefícios do nível anterior",
            "5% de desconto em taxas de serviço",
            "Prioridade no suporte"
        ]
    },
    {
        level: 3,
        name: "Entusiasta",
        pointsRequired: 10000,
        benefits: [
            "Todos os benefícios do nível anterior",
            "10% de desconto em taxas de serviço",
            "Acesso antecipado a novas skins"
        ]
    },
    {
        level: 4,
        name: "Veterano",
        pointsRequired: 20000,
        benefits: [
            "Todos os benefícios do nível anterior",
            "15% de desconto em taxas de serviço",
            "Cashback de 2% em todas as compras",
            "Badge exclusivo no perfil"
        ]
    },
    {
        level: 5,
        name: "Mestre",
        pointsRequired: 35000,
        benefits: [
            "Todos os benefícios do nível anterior",
            "20% de desconto em taxas de serviço",
            "Cashback de 3% em todas as compras",
            "Acesso a eventos exclusivos",
            "Programa de indicação com bônus"
        ]
    },
    {
        level: 6,
        name: "Lendário",
        pointsRequired: 50000,
        benefits: [
            "Todos os benefícios do nível anterior",
            "25% de desconto em taxas de serviço",
            "Cashback de 4% em todas as compras",
            "Suporte VIP 24/7",
            "Acesso a skins raras exclusivas"
        ]
    },
    {
        level: 7,
        name: "Élite",
        pointsRequired: 75000,
        benefits: [
            "Todos os benefícios do nível anterior",
            "30% de desconto em taxas de serviço",
            "Cashback de 5% em todas as compras",
            "Concierge personalizado",
            "Acesso a leilões exclusivos"
        ]
    },
    {
        level: 8,
        name: "Imperador",
        pointsRequired: 100000,
        benefits: [
            "Todos os benefícios do nível anterior",
            "35% de desconto em taxas de serviço",
            "Cashback de 6% em todas as compras",
            "Presentes mensais exclusivos",
            "Acesso a eventos presenciais"
        ]
    },
    {
        level: 9,
        name: "Lendário Supremo",
        pointsRequired: 150000,
        benefits: [
            "Todos os benefícios do nível anterior",
            "40% de desconto em taxas de serviço",
            "Cashback de 7% em todas as compras",
            "Programa de recompensas personalizado",
            "Acesso a skins únicas"
        ]
    },
    {
        level: 10,
        name: "GameSwap Master",
        pointsRequired: 250000,
        benefits: [
            "Todos os benefícios do nível anterior",
            "50% de desconto em taxas de serviço",
            "Cashback de 10% em todas as compras",
            "Gerente de conta dedicado",
            "Acesso a todas as funcionalidades premium",
            "Badge dourado exclusivo",
            "Presentes especiais trimestrais"
        ]
    }
];

// Função para obter o nível atual do usuário
export function getCurrentLevel(points) {
    for (let i = loyaltyLevels.length - 1; i >= 0; i--) {
        if (points >= loyaltyLevels[i].pointsRequired) {
            return loyaltyLevels[i];
        }
    }
    return loyaltyLevels[0];
}

// Função para obter o próximo nível
export function getNextLevel(points) {
    const currentLevel = getCurrentLevel(points);
    const nextLevelIndex = loyaltyLevels.findIndex(level => level.level === currentLevel.level + 1);
    return nextLevelIndex !== -1 ? loyaltyLevels[nextLevelIndex] : null;
}

// Função para calcular o progresso para o próximo nível
export function calculateLevelProgress(points) {
    const currentLevel = getCurrentLevel(points);
    const nextLevel = getNextLevel(points);
    
    if (!nextLevel) {
        return 100; // Já está no nível máximo
    }
    
    if (currentLevel.level === 1) {
        return (points / currentLevel.maxPoints) * 100;
    }
    
    const pointsForNextLevel = nextLevel.pointsRequired - currentLevel.pointsRequired;
    const pointsInCurrentLevel = points - currentLevel.pointsRequired;
    return (pointsInCurrentLevel / pointsForNextLevel) * 100;
}

// Função para obter os pontos necessários para o próximo nível
export function getPointsForNextLevel(points) {
    const currentLevel = getCurrentLevel(points);
    const nextLevel = getNextLevel(points);
    
    if (!nextLevel) {
        return 0; // Já está no nível máximo
    }
    
    if (currentLevel.level === 1) {
        return currentLevel.maxPoints - points;
    }
    
    return nextLevel.pointsRequired - points;
} 