// Simular um banco de dados local usando localStorage
const INVENTORY_KEY = 'gameswap_inventory';

// Função para gerar um ID único
const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Função para buscar todos os itens do inventário
export const fetchInventoryItems = () => {
  try {
    const items = JSON.parse(localStorage.getItem(INVENTORY_KEY) || '[]');
    return items;
  } catch (error) {
    console.error('Erro ao buscar itens do inventário:', error);
    return [];
  }
};

// Função para adicionar um novo item ao inventário
export const addInventoryItem = (item) => {
  try {
    const items = fetchInventoryItems();
    const newItem = {
      ...item,
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: 'active' // active, sold, trading
    };
    items.push(newItem);
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
    return newItem;
  } catch (error) {
    console.error('Erro ao adicionar item ao inventário:', error);
    throw error;
  }
};

// Função para atualizar um item do inventário
export const updateInventoryItem = (itemId, updates) => {
  try {
    const items = fetchInventoryItems();
    const index = items.findIndex(item => item.id === itemId);
    if (index === -1) throw new Error('Item não encontrado');
    
    items[index] = { ...items[index], ...updates };
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
    return items[index];
  } catch (error) {
    console.error('Erro ao atualizar item do inventário:', error);
    throw error;
  }
};

// Função para remover um item do inventário
export const removeInventoryItem = (itemId) => {
  try {
    const items = fetchInventoryItems();
    const filteredItems = items.filter(item => item.id !== itemId);
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(filteredItems));
    return true;
  } catch (error) {
    console.error('Erro ao remover item do inventário:', error);
    throw error;
  }
};

// Função para marcar um item como vendido
export const markItemAsSold = (itemId) => {
  return updateInventoryItem(itemId, {
    status: 'sold',
    soldAt: new Date().toISOString()
  });
};

// Função para obter estatísticas do inventário
export const getInventoryStats = () => {
  try {
    const items = fetchInventoryItems();
    const soldItems = items.filter(item => item.status === 'sold');
    
    const totalSold = soldItems.length;
    const totalEarnings = soldItems.reduce((acc, item) => acc + parseFloat(item.price), 0);
    const activeItems = items.filter(item => item.status === 'active').length;
    
    return {
      totalSold,
      totalEarnings,
      activeItems
    };
  } catch (error) {
    console.error('Erro ao calcular estatísticas do inventário:', error);
    return {
      totalSold: 0,
      totalEarnings: 0,
      activeItems: 0
    };
  }
}; 