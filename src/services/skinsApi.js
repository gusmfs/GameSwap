const API_BASE_URL = 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en';

// Função para buscar todas as skins
export const fetchSkins = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/skins_not_grouped.json`);
    if (!response.ok) {
      throw new Error('Erro ao buscar skins');
    }
    const data = await response.json();
    
    // Adicionar preços fictícios para fins acadêmicos
    return data.map(skin => ({
      ...skin,
      price: generateRandomPrice(skin.rarity?.name || 'Industrial Grade'),
      market_price: generateRandomPrice(skin.rarity?.name || 'Industrial Grade') * 0.85
    }));
  } catch (error) {
    console.error('Erro ao buscar skins:', error);
    throw error;
  }
};

// Função para buscar skins por categoria/filtros
export const fetchSkinsByFilter = async (filters = {}) => {
  try {
    const skins = await fetchSkins();
    let filteredSkins = skins;

    // Filtrar por nome
    if (filters.search) {
      filteredSkins = filteredSkins.filter(skin => 
        skin.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtrar por raridade
    if (filters.rarity) {
      filteredSkins = filteredSkins.filter(skin => 
        skin.rarity?.name === filters.rarity
      );
    }

    // Filtrar por arma
    if (filters.weapon) {
      filteredSkins = filteredSkins.filter(skin => 
        skin.weapon?.name === filters.weapon
      );
    }

    // Filtrar por desgaste
    if (filters.wear) {
      filteredSkins = filteredSkins.filter(skin => 
        skin.wear?.name === filters.wear
      );
    }

    // Filtrar por tipo (StatTrak, Souvenir, Normal)
    if (filters.type) {
      if (filters.type === 'StatTrak') {
        filteredSkins = filteredSkins.filter(skin => skin.stattrak === true);
      } else if (filters.type === 'Souvenir') {
        filteredSkins = filteredSkins.filter(skin => skin.souvenir === true);
      } else if (filters.type === 'Normal') {
        filteredSkins = filteredSkins.filter(skin => !skin.stattrak && !skin.souvenir);
      }
    }

    // Ordenar
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          filteredSkins.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filteredSkins.sort((a, b) => b.price - a.price);
          break;
        case 'name_asc':
          filteredSkins.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          filteredSkins.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          break;
      }
    }

    return filteredSkins;
  } catch (error) {
    console.error('Erro ao buscar skins filtradas:', error);
    throw error;
  }
};

// Função para gerar preços aleatórios baseados na raridade
const generateRandomPrice = (rarity) => {
  const rarityPrices = {
    'Consumer Grade': { min: 0.03, max: 2.0 },
    'Industrial Grade': { min: 0.5, max: 10.0 },
    'Mil-Spec Grade': { min: 2.0, max: 50.0 },
    'Restricted': { min: 10.0, max: 200.0 },
    'Classified': { min: 50.0, max: 800.0 },
    'Covert': { min: 200.0, max: 5000.0 },
    'Contraband': { min: 1000.0, max: 50000.0 }
  };

  const priceRange = rarityPrices[rarity] || rarityPrices['Industrial Grade'];
  const price = Math.random() * (priceRange.max - priceRange.min) + priceRange.min;
  
  return parseFloat(price.toFixed(2));
};

// Função para buscar raridades disponíveis
export const fetchRarities = async () => {
  try {
    const skins = await fetchSkins();
    const rarities = [...new Set(skins.map(skin => skin.rarity?.name).filter(Boolean))];
    return rarities.sort();
  } catch (error) {
    console.error('Erro ao buscar raridades:', error);
    throw error;
  }
};

// Função para buscar armas disponíveis
export const fetchWeapons = async () => {
  try {
    const skins = await fetchSkins();
    const weapons = [...new Set(skins.map(skin => skin.weapon?.name).filter(Boolean))];
    return weapons.sort();
  } catch (error) {
    console.error('Erro ao buscar armas:', error);
    throw error;
  }
};

// Função para buscar desgastes disponíveis
export const fetchWears = async () => {
  try {
    const skins = await fetchSkins();
    const wears = [...new Set(skins.map(skin => skin.wear?.name).filter(Boolean))];
    return wears.sort();
  } catch (error) {
    console.error('Erro ao buscar desgastes:', error);
    throw error;
  }
}; 