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
    if (userData.email && userData.password && userData.name && userData.birthDate && userData.acceptTerms) {
      // Simulando um usuário criado
      const user = {
        id: '1',
        name: userData.name,
        email: userData.email,
        birthDate: userData.birthDate,
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
  },

  validateName: (name) => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      return 'Nome deve ter pelo menos 2 caracteres';
    }
    if (trimmedName.length > 50) {
      return 'Nome deve ter no máximo 50 caracteres';
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmedName)) {
      return 'Nome deve conter apenas letras e espaços';
    }
    return null;
  },

  validateBirthDate: (birthDate) => {
    if (!birthDate) {
      return 'Data de nascimento é obrigatória';
    }
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    if (age < 18) {
      return 'Você deve ter pelo menos 18 anos para se cadastrar';
    }
    if (age > 120) {
      return 'Data de nascimento inválida';
    }
    
    return null;
  },

  validateTerms: (acceptTerms) => {
    if (!acceptTerms) {
      return 'Você deve aceitar os termos de uso para continuar';
    }
    return null;
  }
};

export default authService; 