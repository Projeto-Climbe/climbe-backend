const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API da Climbe Investimentos',
    version: '1.0.0',
    description: 'Documentação da API para o sistema de gestão da Climbe Investimentos.',
    contact: {
      name: 'Suporte Climbe',
      url: 'https://www.climbe.com.br',
      email: 'contato@climbe.com.br',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api', // Altere a porta se necessário
      description: 'Servidor de Desenvolvimento',
    },
  ],
  components: {
    securitySchemes: {
      AppToken: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization', // ou "Authorization" se preferir
        description: 'Token de acesso da aplicação',
      },
    },
  },
  security: [
    {
      AppToken: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  // CORREÇÃO: Mude o caminho para apontar para os arquivos .yaml
  apis: ['./src/docs/*.yaml'], 
};

export default options;