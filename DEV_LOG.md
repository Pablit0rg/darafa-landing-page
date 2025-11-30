# DaRafa Acessorios - O Dossie Completo do Projeto (MASTER LOG)

**Resumo Executivo:**
Este documento narra a evolucao completa do desenvolvimento da Landing Page para "DaRafa Acessorios". O projeto evoluiu para uma Progressive Web App (PWA) simulada (Versao 2.1), operando com funcionalidades avancadas de SEO e UX, mantendo a estabilidade visual do tema "Red Chic".

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
* **Busca em Tempo Real:** Campo de pesquisa instantanea por titulo ou categoria.
* **Filtros Dinamicos:** O usuario pode filtrar o catalogo por categoria sem recarregar.
* **Scroll Reveal:** As imagens aparecem suavemente conforme o usuario rola a pagina.

---

## 4. Mapa Tecnico Atual (Status dos Arquivos)

* **styles/_base/_variables.css:** Paleta de cores atualizada (Red Chic).
* **styles/_components/_navbar.css:** Menu com logo gigante e hover vermelho.
* **styles/_components/_highlights.css:** Cards com bordas vermelhas fixas.
* **styles/_components/_footer.css:** Rodape organizado com hierarquia visual.
* **styles/_base/_global.css:** Tipografia editorial e titulos impactantes.
* **js/main.js:** Motor completo (Fase 2 Completa + SEO/Offline/Historico da Fase 3).

---

## 5. Historico de Atualizacoes (CHANGELOG)

### [30/11/2025] - Fase 3: Performance & SEO
**Status: EM ANDAMENTO (Funcionalidades Criticas Ativas)**

**Funcionalidades Entregues e Estaveis (Sucesso):**
1.  **SEO Avancado (Dados Estruturados):** Injecao de JSON-LD para Rich Snippets.
2.  **Metadados Dinamicos:** Titulo da aba muda conforme o produto visualizado.
3.  **Modo Offline (PWA):** Deteccao de queda de internet com feedback visual (Grayscale).
4.  **Historico "Visto Recentemente":** Rastreamento e filtro automatico dos ultimos produtos acessados.

**Incidentes (CORRIGIDOS/REVERTIDOS):**
1.  **Focus Trap (Acessibilidade):** A implementacao da "armadilha de foco" gerou conflito com o layout dos modais, impedindo a navegacao correta.
    * **Acao:** Rollback imediato (Ctrl+Z) para a versao estavel anterior.
    * **Decisao:** Funcionalidade movida para o final da fila de prioridades para depuracao isolada.

---

## 6. PROXIMOS PASSOS (BACKLOG AJUSTADO - FASE 3)
Objetivo: Concluir as otimizacoes de performance restante antes de revisitar a acessibilidade complexa.

1.  **Pre-carregamento Preditivo (Prefetch):** Baixar recursos antes do clique do usuario.
2.  **Carregamento Adaptativo:** Ajustar qualidade de midia baseada na rede (4G/Wifi).
3.  **Favicon Dinamico:** Notificacao visual na aba do navegador ao favoritar.
4.  **Exit Intent (Marketing):** Modal de recuperacao de saida (Desktop).
5.  **Blindagem de Links:** Automacao de seguranca para links externos.
6.  **Focus Trap (Acessibilidade):** *Adiado para revisao tecnica aprofundada.*

---

## 7. FUTURO (BACKEND & INFRA)
*Planejamento de Longo Prazo.*

1.  **Conexao com API Real:** Substituir o banco de dados local por Node.js/Firebase.
2.  **Painel Administrativo:** Area restrita para cadastro de produtos.
3.  **Checkout:** Integracao com gateway de pagamento.

---
*Ultima atualizacao: 30/11/2025 - Rollback de Acessibilidade realizado com sucesso. Sistema estavel.*
