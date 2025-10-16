// arquivo: super-diagnostico-sheets.js
import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar environment
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middlewares
app.use(express.json());
app.use(express.static('public'));

// =============================================
// 🔧 CONFIGURAÇÕES E AUTENTICAÇÃO
// =============================================

class GoogleSheetsDiagnostico {
  constructor() {
    this.auth = null;
    this.drive = null;
    this.sheets = null;
  }

  getGoogleAuth() {
    const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;

    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      throw new Error('❌ Credenciais não encontradas no .env');
    }

    const formattedPrivateKey = GOOGLE_PRIVATE_KEY
      .replace(/\\n/g, '\n')
      .replace(/"/g, '')
      .trim();

    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: formattedPrivateKey,
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    this.drive = google.drive({ version: 'v3', auth: this.auth });
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    
    return this.auth;
  }

  // =============================================
  // 🔍 TESTES DE DIAGNÓSTICO
  // =============================================

  async testeAutenticacao() {
    console.log('🔐 TESTE 1 - Autenticação');
    try {
      await this.getGoogleAuth();
      const about = await this.drive.about.get({ fields: 'user,storageQuota' });
      
      return {
        sucesso: true,
        serviceAccount: about.data.user,
        storageQuota: about.data.storageQuota,
        mensagem: '✅ Autenticação bem-sucedida'
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message,
        mensagem: '❌ Falha na autenticação'
      };
    }
  }

  async testeAcessoPasta() {
    console.log('📁 TESTE 2 - Acesso à Pasta');
    try {
      const pasta = await this.drive.files.get({
        fileId: process.env.PASTA_DESTINO,
        fields: 'id,name,permissions,owners,capabilities'
      });

      return {
        sucesso: true,
        pasta: {
          id: pasta.data.id,
          nome: pasta.data.name,
          dono: pasta.data.owners[0].displayName,
          permissoes: pasta.data.permissions.length,
          podeEscrever: pasta.data.capabilities.canEdit
        },
        mensagem: '✅ Acesso à pasta OK'
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message,
        mensagem: '❌ Sem acesso à pasta'
      };
    }
  }

  async testeAcessoPlanilhaModelo() {
    console.log('📊 TESTE 3 - Acesso à Planilha Modelo');
    try {
      const planilha = await this.drive.files.get({
        fileId: process.env.SHEET_TEMPLATE_ID,
        fields: 'id,name,size,owners,capabilities'
      });

      // Testar leitura de dados da planilha
      const dados = await this.sheets.spreadsheets.get({
        spreadsheetId: process.env.SHEET_TEMPLATE_ID,
        fields: 'sheets.properties'
      });

      return {
        sucesso: true,
        planilha: {
          id: planilha.data.id,
          nome: planilha.data.name,
          tamanho: planilha.data.size,
          abas: dados.data.sheets.length,
          podeEditar: planilha.data.capabilities.canEdit
        },
        mensagem: '✅ Acesso à planilha modelo OK'
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message,
        mensagem: '❌ Sem acesso à planilha modelo'
      };
    }
  }

  async testePermissoesEscrita() {
    console.log('✏️ TESTE 4 - Permissões de Escrita');
    try {
      // Tentar criar um arquivo de teste
      const arquivoTeste = await this.drive.files.create({
        requestBody: {
          name: `Teste Permissão ${Date.now()}.txt`,
          parents: [process.env.PASTA_DESTINO],
          mimeType: 'text/plain'
        },
        media: {
          mimeType: 'text/plain',
          body: 'Arquivo de teste de permissões'
        },
        fields: 'id,name'
      });

      // Limpar - deletar arquivo de teste
      await this.drive.files.delete({ fileId: arquivoTeste.data.id });

      return {
        sucesso: true,
        mensagem: '✅ Permissões de escrita OK'
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message,
        mensagem: '❌ Sem permissões de escrita'
      };
    }
  }

  async testeCriacaoCopia() {
    console.log('🔄 TESTE 5 - Criação de Cópia');
    try {
      const nomeCopia = `Cópia Teste ${new Date().toLocaleString('pt-BR')}`;
      
      const resposta = await this.drive.files.copy({
        fileId: process.env.SHEET_TEMPLATE_ID,
        requestBody: {
          name: nomeCopia,
          parents: [process.env.PASTA_DESTINO],
        },
      });

      this.ultimaCopiaId = resposta.data.id;

      return {
        sucesso: true,
        copia: {
          id: resposta.data.id,
          nome: nomeCopia,
          link: `https://docs.google.com/spreadsheets/d/${resposta.data.id}/edit`
        },
        mensagem: '✅ Cópia criada com sucesso!'
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message,
        mensagem: '❌ Falha ao criar cópia'
      };
    }
  }

  async testeListagemArquivos() {
    console.log('📋 TESTE 6 - Listagem de Arquivos');
    try {
      const arquivos = await this.drive.files.list({
        q: `'${process.env.PASTA_DESTINO}' in parents`,
        fields: 'files(id, name, mimeType, createdTime)',
        orderBy: 'createdTime desc',
        pageSize: 10
      });

      return {
        sucesso: true,
        total: arquivos.data.files.length,
        arquivos: arquivos.data.files,
        mensagem: `✅ Listagem OK - ${arquivos.data.files.length} arquivos encontrados`
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message,
        mensagem: '❌ Falha ao listar arquivos'
      };
    }
  }

  async diagnosticoCompleto() {
    console.log('🎯 INICIANDO DIAGNÓSTICO COMPLETO\n');
    
    const resultados = {
      timestamp: new Date().toISOString(),
      testes: []
    };

    // Executar todos os testes em sequência
    const testes = [
      { nome: 'Autenticação', metodo: this.testeAutenticacao.bind(this) },
      { nome: 'Acesso à Pasta', metodo: this.testeAcessoPasta.bind(this) },
      { nome: 'Acesso ao Modelo', metodo: this.testeAcessoPlanilhaModelo.bind(this) },
      { nome: 'Permissões Escrita', metodo: this.testePermissoesEscrita.bind(this) },
      { nome: 'Listagem Arquivos', metodo: this.testeListagemArquivos.bind(this) },
      { nome: 'Criação de Cópia', metodo: this.testeCriacaoCopia.bind(this) }
    ];

    for (const teste of testes) {
      console.log(`\n🔍 Executando: ${teste.nome}`);
      const resultado = await teste.metodo();
      resultados.testes.push({
        nome: teste.nome,
        ...resultado
      });
      
      // Se um teste falhar, para a execução
      if (!resultado.sucesso && teste.nome !== 'Criação de Cópia') {
        resultado.mensagem += ' ⚠️ Teste crítico falhou';
        break;
      }
    }

    console.log('\n📊 DIAGNÓSTICO FINALIZADO');
    return resultados;
  }
}

// =============================================
// 🌐 ROTAS EXPRESS
// =============================================

const diagnostico = new GoogleSheetsDiagnostico();

// Rota principal - Interface Web
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'super-diagnostico.html'));
});

// Rota de diagnóstico completo
app.get('/api/diagnostico', async (req, res) => {
  try {
    const resultados = await diagnostico.diagnosticoCompleto();
    res.json(resultados);
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      erro: erro.message
    });
  }
});

// Rota para criar cópia apenas
app.get('/api/criar-copia', async (req, res) => {
  try {
    const resultado = await diagnostico.testeCriacaoCopia();
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      erro: erro.message
    });
  }
});

// Rota para listar arquivos
app.get('/api/listar-arquivos', async (req, res) => {
  try {
    const resultado = await diagnostico.testeListagemArquivos();
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      erro: erro.message
    });
  }
});

// Rota de saúde
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    variaveis: {
      PASTA_DESTINO: process.env.PASTA_DESTINO ? '✅ Configurada' : '❌ Faltando',
      SHEET_TEMPLATE_ID: process.env.SHEET_TEMPLATE_ID ? '✅ Configurado' : '❌ Faltando',
      GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL ? '✅ Configurado' : '❌ Faltando'
    }
  });
});

// =============================================
// 🚀 INICIALIZAÇÃO
// =============================================

app.listen(PORT, () => {
  console.log(`
🎯 SUPER DIAGNÓSTICO GOOGLE SHEETS
📍 Servidor rodando: http://localhost:${PORT}
📊 Endpoints disponíveis:
   📍 http://localhost:${PORT} (Interface Web)
   🔍 http://localhost:${PORT}/api/diagnostico (Diagnóstico Completo)
   📄 http://localhost:${PORT}/api/criar-copia (Criar Cópia)
   📋 http://localhost:${PORT}/api/listar-arquivos (Listar Arquivos)
   ❤️ http://localhost:${PORT}/api/status (Status)

⚙️ Variáveis de ambiente carregadas:
   PASTA_DESTINO: ${process.env.PASTA_DESTINO ? '✅' : '❌'}
   SHEET_TEMPLATE_ID: ${process.env.SHEET_TEMPLATE_ID ? '✅' : '❌'}
   GOOGLE_CLIENT_EMAIL: ${process.env.GOOGLE_CLIENT_EMAIL ? '✅' : '❌'}
  `);
});

// =============================================
// 📁 HTML PARA INTERFACE WEB
// =============================================

import fs from 'fs';

const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Super Diagnóstico Google Sheets</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            opacity: 0.9;
            font-size: 1.1em;
        }
        .controls {
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .btn-primary { 
            background: #3498db; 
            color: white; 
        }
        .btn-primary:hover { background: #2980b9; }
        .btn-success { 
            background: #27ae60; 
            color: white; 
        }
        .btn-success:hover { background: #219a52; }
        .btn-info { 
            background: #17a2b8; 
            color: white; 
        }
        .btn-info:hover { background: #138496; }
        .content {
            padding: 30px;
        }
        .test-result {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }
        .test-result.success { border-color: #27ae60; background: #d5f4e6; }
        .test-result.error { border-color: #e74c3c; background: #fadbd8; }
        .test-result.running { border-color: #3498db; background: #d6eaf8; }
        .test-name {
            font-size: 1.3em;
            font-weight: bold;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .test-message { margin: 10px 0; }
        .test-details { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 5px; 
            margin-top: 10px;
            display: none;
        }
        .json-pre {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 14px;
        }
        .status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
        }
        .status-success { background: #27ae60; }
        .status-error { background: #e74c3c; }
        .status-running { background: #3498db; animation: pulse 1.5s infinite; }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        .progress-bar {
            width: 100%;
            height: 6px;
            background: #e9ecef;
            border-radius: 3px;
            margin: 10px 0;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3498db, #27ae60);
            width: 0%;
            transition: width 0.5s ease;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔧 Super Diagnóstico Google Sheets</h1>
            <p>Teste completo de autenticação, permissões e criação de planilhas</p>
        </div>
        
        <div class="controls">
            <button class="btn btn-primary" onclick="executarDiagnostico()">
                🎯 Executar Diagnóstico Completo
            </button>
            <button class="btn btn-success" onclick="criarCopia()">
                📄 Criar Cópia da Planilha
            </button>
            <button class="btn btn-info" onclick="listarArquivos()">
                📋 Listar Arquivos
            </button>
        </div>

        <div class="content">
            <div id="progress" class="progress-bar" style="display: none;">
                <div class="progress-fill" id="progressFill"></div>
            </div>
            
            <div id="results">
                <div class="test-result">
                    <div class="test-name">
                        <span class="status-indicator status-running"></span>
                        Aguardando testes...
                    </div>
                    <div class="test-message">
                        Clique em "Executar Diagnóstico Completo" para começar
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        async function executarDiagnostico() {
            const resultsDiv = document.getElementById('results');
            const progress = document.getElementById('progress');
            const progressFill = document.getElementById('progressFill');
            
            progress.style.display = 'block';
            resultsDiv.innerHTML = '<div class="test-result running"><div class="test-name"><span class="status-indicator status-running"></span>Executando diagnóstico...</div></div>';
            
            try {
                const response = await fetch('/api/diagnostico');
                const data = await response.json();
                
                displayResults(data);
            } catch (error) {
                resultsDiv.innerHTML = \`
                    <div class="test-result error">
                        <div class="test-name">
                            <span class="status-indicator status-error"></span>
                            Erro no diagnóstico
                        </div>
                        <div class="test-message">\${error.message}</div>
                    </div>
                \`;
            } finally {
                progress.style.display = 'none';
            }
        }

        async function criarCopia() {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '<div class="test-result running"><div class="test-name"><span class="status-indicator status-running"></span>Criando cópia...</div></div>';
            
            try {
                const response = await fetch('/api/criar-copia');
                const data = await response.json();
                
                displaySingleResult('Criação de Cópia', data);
            } catch (error) {
                displaySingleResult('Criação de Cópia', { sucesso: false, erro: error.message });
            }
        }

        async function listarArquivos() {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '<div class="test-result running"><div class="test-name"><span class="status-indicator status-running"></span>Listando arquivos...</div></div>';
            
            try {
                const response = await fetch('/api/listar-arquivos');
                const data = await response.json();
                
                displaySingleResult('Listagem de Arquivos', data);
            } catch (error) {
                displaySingleResult('Listagem de Arquivos', { sucesso: false, erro: error.message });
            }
        }

        function displayResults(data) {
            const resultsDiv = document.getElementById('results');
            let html = '';
            
            data.testes.forEach((teste, index) => {
                const statusClass = teste.sucesso ? 'success' : 'error';
                const statusIcon = teste.sucesso ? '✅' : '❌';
                
                html += \`
                    <div class="test-result \${statusClass}">
                        <div class="test-name">
                            <span class="status-indicator status-\${statusClass}"></span>
                            \${teste.nome}
                        </div>
                        <div class="test-message">
                            <strong>\${statusIcon} \${teste.mensagem}</strong>
                        </div>
                        <button onclick="toggleDetails('\${teste.nome}-\${index}')" style="margin-top: 10px; padding: 5px 10px; background: #3498db; color: white; border: none; border-radius: 3px; cursor: pointer;">
                            📊 Detalhes
                        </button>
                        <div id="\${teste.nome}-\${index}" class="test-details">
                            <pre class="json-pre">\${JSON.stringify(teste, null, 2)}</pre>
                        </div>
                    </div>
                \`;
            });
            
            resultsDiv.innerHTML = html;
        }

        function displaySingleResult(nome, data) {
            const resultsDiv = document.getElementById('results');
            const statusClass = data.sucesso ? 'success' : 'error';
            const statusIcon = data.sucesso ? '✅' : '❌';
            
            resultsDiv.innerHTML = \`
                <div class="test-result \${statusClass}">
                    <div class="test-name">
                        <span class="status-indicator status-\${statusClass}"></span>
                        \${nome}
                    </div>
                    <div class="test-message">
                        <strong>\${statusIcon} \${data.mensagem || data.erro || 'Operação concluída'}</strong>
                    </div>
                    <button onclick="toggleDetails('single-result')" style="margin-top: 10px; padding: 5px 10px; background: #3498db; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        📊 Detalhes
                    </button>
                    <div id="single-result" class="test-details">
                        <pre class="json-pre">\${JSON.stringify(data, null, 2)}</pre>
                    </div>
                </div>
            \`;
        }

        function toggleDetails(id) {
            const element = document.getElementById(id);
            element.style.display = element.style.display === 'block' ? 'none' : 'block';
        }
    </script>
</body>
</html>
`;

// Criar arquivo HTML se não existir
const htmlPath = path.join(__dirname, 'super-diagnostico.html');
if (!fs.existsSync(htmlPath)) {
  fs.writeFileSync(htmlPath, htmlContent);
  console.log('📁 Arquivo HTML de interface criado: super-diagnostico.html');
}

export default GoogleSheetsDiagnostico;