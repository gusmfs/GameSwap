/**
 * Formata um valor numérico como moeda brasileira (BRL)
 * @param {number} price - Valor a ser formatado
 * @returns {string} Valor formatado como "R$ X.XXX,XX"
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(price)) {
    return 'R$ 0,00';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

export default formatPrice;

