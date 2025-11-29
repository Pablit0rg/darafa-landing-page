# DaRafa Acessórios - O Dossiê Completo do Projeto (MASTER LOG)

**Resumo Executivo:**
Este documento narra a evolução completa do desenvolvimento da Landing Page para "DaRafa Acessórios". O projeto saiu de um conceito monolítico simples para uma aplicação modular, interativa e com uma identidade visual proprietária ("Honey Theme").

---

## 1. A Filosofia Inicial: Modularização
**O Problema:** Projetos anteriores cresciam demais e se tornavam difíceis de manter.
**A Solução:** Adotamos uma **Arquitetura CSS Modular**.
* Não existe um "style.css" gigante.
* Existe um "Maestro" (`styles/main.css`) que importa pequenos arquivos específicos.
* **Estrutura:** `_base/` (Globais) e `_components/` (Navbar, Hero, ZigZag, etc.).

---

## 2. Evolução Visual (Do Escuro ao Mel)

### Fase 1: "Ouro na Noite" 🌑
* Conceito inicial de fundo preto profundo com detalhes dourados.

### Fase 2: O Pivô para "Honey Theme"
* **A Mudança:** Invertemos a paleta para **Fundo Amarelo Mel Vibrante** (`#FDB90C`).
* **Contraste:** Textos e elementos em **Chocolate/Preto** (`#241000`) para leitura.
* **Textura:** Fundo "Favo de Mel" (Honeycomb) fixo com filtro escuro.

### Fase 3: Refinamento "Red & Gold"
* **Bordas:** Definidas em **Vermelho Vivo (`#ff0000`)** fixo para alto contraste nos cards.
* **Cards:** Mini-cards com moldura preenchida (Padding + Fundo Chocolate).
* **Info Bars:** Fundo Chocolate com texto Amarelo.
* **Tipografia:** Subtítulos limpos na cor do texto e parágrafos justificados.

---

## 3. Evolução Estrutural e Funcionalidade

### Layout Zig-Zag e "Portais"
* As seções seguem fluxo alternado (Texto/Imagem).
* **Cards Grandes (Portais):** Ao clicar, expandem para um **Modal de Tela Cheia**.
* **Níveis de Profundidade:**
    1.  **Zoom (Lightbox):** Para joias.
    2.  **Modo Revista:** Para histórias do atelier (Foto + Texto).

### Automação do Catálogo
* Substituímos o HTML manual por um **Gerador JavaScript** que cria 50 cards automaticamente, facilitando a manutenção e performance.

---

## 4. Mapa Técnico Atual (Status dos Arquivos)

* **`styles/_components/_zigzag.css`:** Controla o layout macro e os Cards Grandes.
* **`styles/_components/_highlights.css`:** Controla os Cards Pequenos (Bordas Vermelhas, Info Bar Chocolate) e o Modal de História.
* **`styles/_components/_navbar.css`:** Barra transparente com links Chocolate (Hover sutil).
* **`js/main.js`:** Contém a lógica de geração de cards, modais e menu mobile.

---

## 5. BACKLOG DE PENDÊNCIAS (Próximos Passos)

** PRIORIDADE MÁXIMA (Correções):**
1.  **Conserto do HTML (Index):** A implementação do botão "Seguir no Instagram" na seção da Artista quebrou o layout ou ficou com código incompleto.
    * *Ação:* Revisar e reinserir o bloco HTML da seção Artista com o botão posicionado corretamente (abaixo da foto no mobile, ao lado no desktop).
2.  **Revisão de Código:** Garantir que nenhum arquivo CSS ou JS ficou cortado ou incompleto nas últimas atualizações.

** CONTEÚDO E AJUSTES:**
1.  **Escurecimento de Fundos:** Ajustar a opacidade/cor de fundo dos Modais (Atelier e Catálogo) para garantir que não fiquem translúcidos demais sobre o fundo de colmeia.
2.  **Conteúdo Real:** Inserir as 50 fotos reais e textos descritivos.

** FUTURO (Pós-Entrega):**
1.  **Automação Instagram:** Implementar API para puxar posts automaticamente.
2.  **SEO de Elite:** Configurar Meta Tags finais.

---
*Última atualização: 29/11/2025 (Sábado) - Status: Pausado para Correção de HTML*
