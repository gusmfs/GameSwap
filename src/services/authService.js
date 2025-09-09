// Simulação de uma API de autenticação
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ⚠️ ATENÇÃO: Esta é uma implementação de DEMONSTRAÇÃO
// Em produção, você DEVE:
// 1. Validar credenciais no backend
// 2. Usar JWT tokens assinados
// 3. Validar roles no servidor
// 4. Implementar rate limiting
// 5. Usar HTTPS

// Base de dados simulada de usuários (em produção, seria no backend)
const mockUsers = [
  {
    id: '1',
    email: 'admin@gameswap.com',
    password: 'admin123', // ⚠️ Em produção, senhas devem ser hasheadas
    name: 'Administrador',
    role: 'admin'
  },
  {
    id: '2', 
    email: 'admin@teste.com',
    password: 'admin123',
    name: 'Admin Teste',
    role: 'admin'
  },
  {
    id: '3',
    email: 'user@teste.com', 
    password: 'user123',
    name: 'Usuário Teste',
    role: 'user'
  }
];

const authService = {
  login: async (email, password) => {
    // Simular uma chamada de API
    await delay(1000);
    
    // ⚠️ VULNERABILIDADE: Em produção, valide no backend
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }
    
    // Buscar usuário na base simulada
    const user = mockUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    if (!user) {
      throw new Error('Email ou senha incorretos');
    }
    
    // Retornar dados do usuário (sem a senha)
    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      createdAt: new Date().toISOString(),
      inventory: [],
      transactions: []
    };
  },

  register: async (userData) => {
    // Simular uma chamada de API
    await delay(1000);
    
    // ⚠️ VULNERABILIDADE: Em produção, valide no backend
    if (!userData.email || !userData.password || !userData.name || !userData.birthDate || !userData.acceptTerms) {
      throw new Error('Dados de registro inválidos');
    }
    
    // Verificar se email já existe
    const existingUser = mockUsers.find(u => 
      u.email.toLowerCase() === userData.email.toLowerCase()
    );
    
    if (existingUser) {
      throw new Error('Email já está em uso');
    }
    
    // Criar novo usuário
    const newUser = {
      id: String(mockUsers.length + 1),
      name: userData.name,
      email: userData.email,
      password: userData.password, // ⚠️ Em produção, hash a senha
      birthDate: userData.birthDate,
      role: 'user', // Novos usuários sempre são 'user'
      createdAt: new Date().toISOString(),
      inventory: [],
      transactions: []
    };
    
    // Adicionar à base simulada
    mockUsers.push(newUser);
    
    // Retornar sem a senha
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
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
