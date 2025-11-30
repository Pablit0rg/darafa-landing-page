# DaRafa Acessorios - O Dossie Completo do Projeto (MASTER LOG)

**Resumo Executivo:**
Este documento narra a evolucao completa do desenvolvimento da Landing Page para "DaRafa Acessorios". O projeto encontra-se na Versao 2.1 (Estavel), operando com funcionalidades de PWA e SEO, mantendo a integridade visual e de navegacao.

---

## 1. A Filosofia Inicial: Modularizacao
**Solucao:** Arquitetura CSS Modular (Maestro `main.css` importando componentes isolados).

---

## 2. Evolucao Visual (Red Chic)
* **Estilo Atual:** "Red Chic" (Fundo Chocolate, Bordas Vermelhas, Tipografia Editorial).
* **Status:** Implementado e consolidado.

---

## 3. Evolucao Estrutural e Funcionalidade
* **Core:** Layout Zig-Zag com "Portais" (Cards que expandem para Modais).
* **Navegacao:** Zoom de produto (Lightbox) e Modo Historia.
* **Performance:** Infinite Scroll e Lazy Loading ativos.

---

## 4. Mapa Tecnico Atual (Status dos Arquivos)
* **css/**: Estilizacao completa e modular.
* **js/main.js**: Motor da aplicacao contendo SEO, Metadados, Modo Offline, Busca e Logica de Renderizacao.

---

## 5. Historico de Atualizacoes (CHANGELOG)

### [30/11/2025] - Fase 3: Performance & SEO (Ajustes Taticos)
**Status: EM ANDAMENTO - VERSAO ESTAVEL RESTAURADA**

**Funcionalidades Entregues (Sucesso):**
1.  **SEO Avancado:** Injecao de JSON-LD para Rich Snippets.
2.  **Metadados Dinamicos:** Titulo da aba muda conforme o produto visualizado.
3.  **Modo Offline (PWA):** Deteccao de queda de internet com feedback visual (Grayscale).
4.  **Busca em Tempo Real:** Filtragem instantanea de produtos.
5.  **Ordenacao Dinamica:** Filtros A-Z, Z-A e Aleatorio.

**Incidentes e Reversoes (ROLLBACK):**
1.  **Lista de Desejos (Botoes no Card):** A adicao dos botoes de "Coracao" e "Compartilhar" dentro da area do minicard gerou conflito de eventos (Event Bubbling), impedindo que o usuario clicasse na foto para abrir o Zoom.
    * **Acao:** Funcionalidade revertida temporariamente para garantir que o Zoom (feature principal) funcione perfeitamente.
    * **Decisao:** Tarefa movida para o final da fila para refatoracao de UI/UX (possivelmente mover o botao para dentro do Modal aberto, em vez da capa).

---

## 6. PROXIMOS PASSOS (BACKLOG REORGANIZADO)
Objetivo: Priorizar estabilidade e funcionalidades que nao afetam o layout critico.

1.  **Links Compartilhaveis (URL State):** A URL mudar ao filtrar/buscar (sem quebrar a navegacao).
2.  **Pre-carregamento Preditivo (Prefetch):** Baixar imagens antes do clique.
3.  **Carregamento Adaptativo:** Ajuste de qualidade para redes lentas.
4.  **Exit Intent (Marketing):** Modal de recuperacao de saida (Desktop).
5.  **Blindagem de Links:** Seguranca para links externos.
6.  **Analytics Caseiro:** Rastreamento de cliques.
7.  **Focus Trap (Acessibilidade):** *Adiado (Conflito de Layout).*
8.  **Lista de Desejos (Wishlist):** *Adiado (Conflito de Clique no Card).*

---
*Ultima atualizacao: 30/11/2025 - Rollback estrategico realizado. O zoom dos cards esta funcionando perfeitamente.*
