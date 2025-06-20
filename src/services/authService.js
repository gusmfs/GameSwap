// Simulação de uma API de autenticação
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const authService = {
  login: async (email, password) => {
    // Simular uma chamada de API
    await delay(1000);
    
    // Aqui você substituiria por uma chamada real à sua API
    if (email && password) {
      // Simulando um usuário retornado pela API
      const user = {
        id: '1',
        name: 'Usuário Teste',
        email: email,
        createdAt: new Date().toISOString(),
        inventory: [],
        transactions: []
      };
      
      return user;
    }
    
    throw new Error('Credenciais inválidas');
  },

  register: async (userData) => {
    // Simular uma chamada de API
    await delay(1000);
    
    // Aqui você substituiria por uma chamada real à sua API
    if (userData.email && userData.password && userData.name) {
      // Simulando um usuário criado
      const user = {
        id: '1',
        name: userData.name,
        email: userData.email,
        createdAt: new Date().toISOString(),
        inventory: [],
        transactions: []
      };
      
      return user;
    }
    
    throw new Error('Dados de registro inválidos');
  },

  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword: (password) => {
    return password.length >= 6;
  }
};

export default authService; 