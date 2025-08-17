import app from './src/app.js';
import dotenv from 'dotenv';

// variáveis de ambiente
dotenv.config();

// porta do servidor
const PORT = process.env.PORT || 3000;

// servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});