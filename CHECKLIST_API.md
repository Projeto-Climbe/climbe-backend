# Checklist de Cobertura de Requisitos Funcionais - API Climbe

## 1. Autenticação e acesso
- [x] Login por e-mail e senha
- [ ] Página de login inicial obrigatória (frontend)

## 2. Autenticação via OAuth 2.0
- [x] Login com Google
- [x] Redirecionamento para tela de autorização
- [x] Recebimento de access_token e dados do usuário
- [x] Cadastro pendente para novos usuários
- [x] Notificação ao administrador (e-mail e sistema)
- [x] Controle de sessão por token JWT

## 3. Agenda e Calendário
- [x] Exibição automática da agenda semanal
- [x] Calendário mensal interativo
- [x] Agendamento de reuniões com pauta, empresa, data/hora, tipo presencial/online
- [x] Notificação por e-mail e sistema após agendamento

## 4. Gestão de Propostas Comerciais
- [x] Criação de propostas por cargos autorizados
- [x] Aprovação obrigatória pelo contratante
- [~] Geração automática de contrato após aceite (verificar fluxo)
- [~] Refazer proposta recusada (verificar fluxo)

## 5. Gestão Documental
- [~] Upload obrigatório de documentos (verificar endpoints de upload)
- [~] Validação obrigatória dos documentos (verificar lógica de validação)

## 6. Gestão de Planilha via Google Sheets
- [ ] Integração com Google Sheets
- [ ] Cópia automática da planilha
- [ ] Segurança das planilhas (bloqueio, perfis, etc)

## 7. Gerenciamento de Arquivos no Google Drive
- [ ] Integração com Google Drive
- [ ] Restrição de acesso a pastas

## 8. Relatórios e Reuniões
- [~] Anexo de PDF em relatórios (verificar upload/download)
- [x] Agendamento de reunião para apresentação de relatórios
- [~] Gestão automática de reuniões via API do Google

## 9. Notificações
- [x] Notificações automáticas por e-mail e sistema
- [~] Notificações para todos os eventos listados (verificar cobertura)

## 10. Cadastro de Empresa
- [x] Todos os campos obrigatórios
- [x] Verificação de unicidade do CNPJ
- [x] Mensagens de sucesso/erro
- [x] Edição de dados autorizada

## 11. Cadastro de usuário
- [x] Todos os campos obrigatórios
- [x] Seleção de permissões
- [x] Validação de duplicidade de CPF/e-mail
- [x] E-mail de boas-vindas
- [x] Restrição de cadastro por perfil administrativo


Legenda:
- [x] Implementado
- [~] Parcialmente implementado/precisa revisão
- [ ] Não implementado
