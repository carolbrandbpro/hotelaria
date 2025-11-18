# Nerd Work Tecnologia — Sistema Hoteleiro

Sistema completo para gestão hoteleira, com módulos de PMS (Quartos), PDV (Vendas), Estoque, Eventos, Financeiro e Restaurante, além de relatórios e configurações de marca (logo).

Este projeto contém dois pacotes:
- Frontend React (pasta raiz `d:\git\sistema_de_hotelaria`)
- Backend Node/Express (pasta `server/`), persistindo dados em arquivo local.

## Requisitos
- Node.js 16+ (recomendado 18 ou superior)
- NPM (instalado com Node)

## Instalação

Na raiz do projeto:
```
cd d:\git\sistema_de_hotelaria
npm install
```
O passo acima instala também as dependências do backend automaticamente (script `postinstall`).

## Passo a passo rápido

1) Copiar o arquivo de ambiente
```
copy .env.example .env
```
O `.env` já vem com `REACT_APP_API_BASE=http://localhost:3020/api`.

2) Subir backend + frontend
```
npm run dev
```
Isso inicia: API em `http://localhost:3020/api` e frontend em `http://localhost:3010/`.

3) Validar a API
- Abra `http://localhost:3020/api/health` no navegador (deve responder OK).
- No app, vá em `Configurações → Conexão da API`, confirme `http://localhost:3020/api`, clique em "Salvar API Base" e depois "Testar Conexão".

4) Se a porta 3010 estiver ocupada
```
npm run start:3070
```
Frontend em `http://localhost:3070/` (API permanece em `http://localhost:3020/api`).

## Acesso pelo Celular (QR)

Para abrir o sistema no celular dentro da mesma rede local:

- Inicie os serviços:
  - Backend: `npm run server:3020` (API em `http://localhost:3020/api`)
  - Frontend: `npm run start:3070` (App em `http://localhost:3070/`)
- No computador, abra `http://localhost:3056/acesso` para gerar o QR.
  - A página tenta detectar automaticamente o IPv4 ativo do seu PC via `GET /api/host`.
  - Se não detectar, informe manualmente o IP (obtido com `ipconfig`).
- No celular, escaneie o QR ou acesse diretamente `http://<IP-DO-PC>:3070/login`.

Observações importantes:
- No celular, não use `localhost`; sempre use o IP do PC.
- O Wi‑Fi deve permitir comunicação entre dispositivos (desative “AP/Guest isolation”).
- Libere a porta `3070/TCP` no Firewall do Windows, se necessário.
- Para verificar conectividade, use no PowerShell do PC: `Test-NetConnection <IP-DO-PC> -Port 3070`.

Endpoint auxiliar (backend): `GET http://localhost:3020/api/host`
- Retorna `{ ip, frontendPort, url }` com o melhor IPv4 local (ignora `127.0.0.1` e `169.254.x.x`).

## Execução (Desenvolvimento)

1) Iniciar Backend e Frontend juntos (recomendado)
```
cd d:\git\sistema_de_hotelaria
npm run dev
```
Isso inicia o backend na porta `3020` e o frontend na porta `3010`.

URLs:
- Frontend: `http://localhost:3010/`
- API Base: `http://localhost:3020/api`

Alternativas:
```
npm run dev:3020 # backend 3020 + frontend 3010 (mesmo do dev)
npm run dev:3056 # backend 5000 + frontend 3056
```

### Configurar o endereço da API (opcional)
O frontend detecta automaticamente a API (`REACT_APP_API_BASE`, `localStorage('api_base')`, `http://localhost:3020/api`, `http://localhost:5000/api`). Para garantir, você pode definir manualmente:
- PowerShell:
```
$env:REACT_APP_API_BASE='http://localhost:5000/api'; npm start
```
- CMD:
```
set REACT_APP_API_BASE=http://localhost:5000/api && npm start
```

### Variáveis de Ambiente (.env)
- O projeto inclui um `.env.example` com `REACT_APP_API_BASE=http://localhost:3020/api` como referência.
- Crie seu `.env` a partir do exemplo (o arquivo `.env` não é versionado):
  - PowerShell:
  ```
  Copy-Item .env.example .env
  ```
  - CMD:
  ```
  copy .env.example .env
  ```
- Em produção, defina `REACT_APP_API_BASE` para o domínio público da sua API (ex.: `https://api.seudominio.com/api`).
- Prioridade de detecção no frontend: `.env` (`REACT_APP_API_BASE`) → `localStorage('api_base')` → `http://localhost:3020/api` → `http://localhost:5000/api`.

## Onde os dados são salvos
- Backend: arquivo `d:\git\sistema_de_hotelaria\server\data.json` (config, módulos do dashboard e dados de `orders`, `sales`, `inventory`, `events`, `transactions`, `rooms`).
- Frontend (fallback quando o backend não responde): `localStorage` do navegador.
  - `auth_logged_in`, `auth_user`: estado de login
  - `cliente_config`: logo e dados básicos do cliente
  - `dashboard_modules_enabled`: visibilidade dos módulos
  - `users`: lista de usuários e papéis

## Login e Papéis
- Usuário padrão criado automaticamente: `admin` / `admin` (papel `administrador`).
- Papéis disponíveis e acessos:
  - `administrador`: acesso total; vê `Usuários` no menu.
  - `gerente`: sem acesso ao módulo `Financeiro`.
  - `relatorios`: sem acesso ao módulo `Financeiro`.
  - `cozinha`: interface dedicada; sem Sidebar/hambúrguer; direciona para `/cozinha`.
  - `garcom`: sem Sidebar/hambúrguer; acesso apenas a `/restaurante` e `/cozinha`; pós-login direciona para `/restaurante`.

## Principais Rotas
- `/` Dashboard (módulos visíveis por papel)
- `/pms` Quartos
- `/pdv` Vendas
- `/stocks` Estoque
- `/eventos` Eventos
- `/financeiro` Financeiro (bloqueado para `gerente` e `relatorios`)
- `/restaurante` Restaurante (QR Code, pedidos)
- `/cozinha` Cozinha (painel de preparo)
- `/configuracoes` Configurações
- `/usuarios` Usuários (apenas `administrador`)
- `/login` Login

## Configurações de Marca (Logo)
- O sistema suporta `logoDataUrl` (base64) via `/api/config`.
- Em falha do backend, a logo é lida/grava em `localStorage('cliente_config')`.

## Troubleshooting
- API não detectada: defina `REACT_APP_API_BASE` (ver seção acima) e reinicie o frontend.
- CORS em desenvolvimento: o backend aceita origens `localhost` por padrão.
- Cache visual: faça hard reload no navegador (`Ctrl+Shift+R`).
- Dados não persistem: verifique se o servidor (`server/`) está rodando e se o arquivo `data.json` é gravável.

## Responsividade
- Layout responsivo com Bootstrap 5; Sidebar colapsa em telas pequenas com overlay.
- O botão hambúrguer é ocultado para os papéis `cozinha` e `garcom`.
- O header mostra o tipo de login e o botão `Logout`; na rota `/login`, o botão `Login` não é exibido.

---
Qualquer dúvida ou ajuste de comportamento por papel, portas ou persistência, pode ser feito rapidamente editando `src/App.js`, `src/components/Sidebar.js`, `src/components/Navbar.js` e `src/services/api.js`.

## Novidades de UI e Chat

- Configurações — Identidade Visual
  - Nome/Razão Social, CNPJ e Logo alinhados lado a lado, sem valores padrão automáticos.
  - Dois cards separados: "Nome da agenda" e "Tempo médio da cozinha (min)".
- WhatsApp — Mensagens em cards
  - Cards responsivos (1, 2 ou 3 por linha) para “Novo Pedido”, “Pedido Aceito”, “Em Preparo” e “Entregue”.
  - O card “Entregue” ocupa a largura inteira da linha e contém três colunas (principal, quarto, mesa).
  - Tokens suportados: `{local}` `{itens}` `{total}` `{horario}` `{previsao}` `{restante}` `{link}` `{numeroPedido}` `{responsavel}`.
- Chat interno
  - Aba "Sala (todos)": envia e exibe mensagens do canal geral (`toSector='geral'`).
  - Aba "Setor": mantém filtro de setor e seleção de destino.
  - Botão "Limpar": apaga apenas histórico local do usuário.
  - Controles de som: `🔔/🔕` e slider de volume com persistência por usuário.

### Como usar o Chat

1. Clique no balão 💬 na página para abrir o chat.
2. Selecione a aba:
   - "Sala (todos)" para broadcast geral.
   - "Setor" para falar com setores específicos (Cozinha, Balcão, etc.).
3. Use "Limpar" para apagar seu histórico local (mensagens novas continuam chegando).
4. Ajuste o som com o ícone `🔔/🔕` e o slider de volume (preferências guardadas em `localStorage`).

### Dicas de Configuração

- API Base: defina em Configurações → Conexão da API. Ex.: `http://192.168.1.23:3020/api`.
- Se o teste `/api/health` falhar no navegador, confirme que o backend está rodando e que a URL está correta. O erro de saúde não afeta o layout.
- CNPJ: opcional; se informado, a validação exige 14 dígitos.
## WhatsApp: Override e Fallback

- Objetivo: garantir envio via WhatsApp mesmo sem número no PMS e permitir ao operador inserir/ajustar rapidamente o destino.
- Utilitários padronizados em `src/utils/whatsapp.js`:
  - `limparNumero`: remove caracteres não numéricos, mantendo apenas dígitos.
  - `gerarLinkWhatsApp`: cria o link de abertura com número (quando disponível) e texto; se o número não existir, abre o WhatsApp com o texto (fallback).
  - `obterWhatsAppPrincipalDoQuartoId`: retorna o número prioritário do PMS para um quarto específico.
- Comportamento por página:
  - `Restaurante`: campo “WhatsApp (opcional)” no rodapé do modal de detalhes. Prioriza o número digitado; se vazio, usa PMS; se indisponível, fallback sem número.
  - `Cozinha`: campo “WhatsApp (opcional)” acima dos botões de WhatsApp nos cards. Prioriza o número digitado; se vazio, usa PMS; se indisponível, fallback sem número.
  - `PMS`: botões “Conversar” no contato principal e por hóspede sempre abrem o WhatsApp; quando não há número cadastrado, utiliza apenas o texto predefinido (fallback), mantendo a ação disponível.
  - `PDV`: já possui campo “WhatsApp do Cliente (opcional)” e faz override quando preenchido; no modo faturar-quarto, usa o WhatsApp principal do PMS.
- Diretrizes de implementação:
  - Sempre limpar o input com `limparNumero` antes de enviar.
  - Prioridade de número: 1) digitado; 2) PMS; 3) fallback sem número (abre WhatsApp apenas com texto).
  - Centralizar montagem de links em `gerarLinkWhatsApp`.
- Validação sugerida:
  - `http://localhost:3056/restaurante`, `http://localhost:3010/cozinha`, `http://localhost:3070/pdv`.
  - Testar com e sem número no PMS e com diferentes formatos de input (parênteses/traços/espacos).