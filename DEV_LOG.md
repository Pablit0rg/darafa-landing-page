# DaRafa Acessorios - O Dossie Completo do Projeto (MASTER LOG)

**Resumo Executivo:**
Este documento narra a evolucao completa do desenvolvimento da Landing Page para "DaRafa Acessorios". O projeto evoluiu de uma pagina estatica para uma Progressive Web App (PWA) simulada (Versao 2.0), e agora avanca para a Fase 3 com foco em SEO Tecnico, Escalabilidade e Performance Empresarial.

---

## 1. A Filosofia Inicial: Modularizacao
**O Problema:** Projetos anteriores cresciam demais e se tornavam dificeis de manter.
**A Solucao:** Adotamos uma **Arquitetura CSS Modular**.
* Nao existe um "style.css" gigante.
* Existe um "Maestro" (styles/main.css) que importa pequenos arquivos especificos.
* **Estrutura:** _base/ (Globais) e _components/ (Navbar, Hero, ZigZag, etc.).

---

## 2. Evolucao Visual (Do Escuro ao Vermelho Luxo)

### Fase 1: "Ouro na Noite"
* Conceito inicial de fundo preto profundo com detalhes dourados.

### Fase 2: "Honey Theme" (Legado)
* Fundo Amarelo Mel Vibrante (#FDB90C) com contraste em Chocolate.

### Fase 3: "Red Chic" (VERSAO ATUAL ESTAVEL)
* **Conceito:** Elevacao da marca para um patamar de "Alta Costura" e exclusividade.
* **A Cor do Poder:** Introducao do Vermelho Sangue (#D00000) em bordas, hovers e detalhes finos.
* **Tipografia:** Titulos imponentes e paragrafos com espacamento editorial.
* **Navbar:** Logo maximizada e interacao com icone de favo de mel.

---

## 3. Evolucao Estrutural e Funcionalidade

### Layout Zig-Zag e "Portais"
* As secoes seguem fluxo alternado (Texto/Imagem).
* **Cards Grandes (Portais):** Ao clicar, expandem para um **Modal de Tela Cheia** (com fundo escuro para leitura).
* **Niveis de Profundidade:**
    1.  **Zoom (Lightbox):** Para joias.
    2.  **Modo Revista:** Para historias do atelier (Foto + Texto).

### Inteligencia de Dados (Data-Driven)
* Substituimos loops simples por uma **Estrutura de Dados (Array de Objetos)** no JavaScript.
* **Scroll Reveal:** As imagens aparecem suavemente conforme o usuario rola a pagina.

---

## 4. Mapa Tecnico Atual (Status dos Arquivos)

* **styles/_base/_variables.css:** Paleta de cores atualizada (Red Chic).
* **styles/_components/_navbar.css:** Menu com logo gigante e hover vermelho.
* **styles/_components/_highlights.css:** Cards com bordas vermelhas fixas.
* **styles/_components/_footer.css:** Rodape organizado com hierarquia visual.
* **styles/_base/_global.css:** Tipografia editorial e titulos impactantes.
* **js/main.js:** Motor completo da aplicacao (Fase 2 concluida).

---

## 5. Historico de Atualizacoes (CHANGELOG)

### [30/11/2025] - A Revolucao JavaScript (Fase 2 - Concluida)
**Status: CONCLUIDO (Versao 2.0)**

**Funcionalidades Implementadas (10/10):**
1.  **Busca em Tempo Real:** Campo de pesquisa instantanea por titulo ou categoria.
2.  **Lista de Desejos (Wishlist):** Persistencia de favoritos usando LocalStorage.
3.  **Links Compartilhaveis (URL State):** A URL muda dinamicamente ao filtrar ou buscar.
4.  **Compartilhamento Nativo:** Uso da Web Share API para mobile.
5.  **Gestos de Swipe:** Fechamento de modais arrastando o dedo para baixo (Mobile UX).
6.  **Ordenacao Dinamica:** Opcoes para ordenar produtos (A-Z, Z-A, Aleatorio, Relevancia).
7.  **Infinite Scroll:** Carregamento progressivo de itens (lotes de 12) para performance.
8.  **Navegacao por Teclado:** Acessibilidade total (Setas, Enter, Esc).
9.  **Notificacoes Toast:** Feedback visual flutuante para acoes do usuario.
10. **Analytics Caseiro:** Rastreamento local de visualizacoes, buscas e cliques.

---

## 6. PROXIMOS PASSOS (BACKLOG FASE 3 - PERFORMANCE & SEO)
Objetivo: Implementar 10 melhorias de nivel empresarial focadas em Google, Velocidade e Retencao.

1.  **SEO Avancado (Dados Estruturados):** Injecao de JSON-LD para Rich Snippets no Google.
2.  **Metadados Dinamicos:** Alteracao do titulo da aba e descricao conforme o produto visualizado.
3.  **Modo Offline (PWA):** Deteccao de queda de internet e adaptacao da interface.
4.  **Historico "Visto Recentemente":** Widget para lembrar o usuario dos ultimos produtos acessados.
5.  **Focus Trap (Acessibilidade):** Prender o foco do teclado dentro dos modais abertos.
6.  **Pre-carregamento Preditivo:** Baixar recursos antes do clique do usuario (Prefetch).
7.  **Carregamento Adaptativo:** Ajustar a qualidade de midia baseada na velocidade da rede (4G/Wifi).
8.  **Favicon Dinamico:** Notificacao visual na aba do navegador (bolinha vermelha) ao favoritar.
9.  **Exit Intent (Marketing):** Modal de recuperacao quando o mouse do usuario sai da tela (Desktop).
10. **Blindagem de Links:** Automacao de seguranca (noopener noreferrer) para links externos.

---

## 7. FUTURO (BACKEND & INFRA)
*Planejamento de Longo Prazo.*

1.  **Conexao com API Real:** Substituir o banco de dados local por Node.js/Firebase.
2.  **Painel Administrativo:** Area restrita para cadastro de produtos.
3.  **Checkout:** Integracao com gateway de pagamento.

---
*Ultima atualizacao: 30/11/2025 - Fase 2 entregue com sucesso. Iniciando planejamento da Fase 3.*
