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

### Fase 1: "Ouro na Noite"
* Conceito inicial de fundo preto profundo com detalhes dourados.

### Fase 2: O Pivô para "Honey Theme"
* **A Mudança:** Invertemos a paleta para **Fundo Amarelo Mel Vibrante** (`#FDB90C`).
* **Contraste:** Textos e elementos em **Chocolate/Preto** (`#241000`) para leitura.
* **Textura:** Fundo "Favo de Mel" (Honeycomb) fixo com filtro escuro.

### Fase 3: Refinamento "Red Chic" (Design Final)
* **Bordas:** Reintrodução da **Linha Vermelha (`#D00000`)** para um acabamento de luxo nos cards e detalhes.
* **Tipografia:** Adoção de fontes com mais peso e espaçamento editorial (estilo revista).
* **Navbar:** Logo maximizada e hover interativo com ícone de favo de mel (`⬡`).

---

## 3. Evolução Estrutural e Funcionalidade

### Layout Zig-Zag e "Portais"
* As seções seguem fluxo alternado (Texto/Imagem).
* **Cards Grandes (Portais):** Ao clicar, expandem para um **Modal de Tela Cheia** (agora com fundo escuro para melhor contraste).
* **Níveis de Profundidade:**
    1.  **Zoom (Lightbox):** Para joias.
    2.  **Modo Revista:** Para histórias do atelier (Foto + Texto).

### Inteligência de Dados (Data-Driven)
* Substituímos loops simples por uma **Estrutura de Dados (Array de Objetos)** no JavaScript.
* **Filtros Dinâmicos:** O usuário agora pode filtrar o catálogo por categoria (Brincos, Nose Cuffs, etc.) sem recarregar a página.
* **Scroll Reveal:** As imagens aparecem suavemente conforme o usuário rola a página.

---

## 4. Mapa Técnico Atual (Status dos Arquivos)

* **`styles/_components/_zigzag.css`:** Controla o layout macro e os Cards Grandes.
* **`styles/_components/_highlights.css`:** Controla os Cards Pequenos (Bordas Vermelhas, Info Bar Chocolate).
* **`styles/_components/_navbar.css`:** Barra transparente com logo grande e interações avançadas.
* **`js/main.js`:** Contém a lógica de "Banco de Dados" local, filtros, modais e menu mobile.

---

## 5. Histórico de Atualizações (CHANGELOG)

### [30/11/2025] - A "Virada de Chave" Profissional
**Status: CONCLUÍDO (Pronto para Entrega)**

**Funcionalidades Implementadas:**
1.  **Catálogo Dinâmico:** Implementação de `productsData` e renderização inteligente.
2.  **Filtros de Categoria:** Criação de botões interativos que filtram as joias em tempo real.
3.  **Correção Mobile (UX):** O botão do Instagram agora obedece a hierarquia visual (abaixo da foto no celular, ao lado no PC).
4.  **SEO & Social:** Configuração de Open Graph Tags (Capa, Título e Descrição para compartilhamento no WhatsApp).

**Design & UI (Red Chic):**
1.  **Volta do Vermelho:** Bordas e detalhes em `#D00000` para sofisticação.
2.  **Contraste:** Fundo dos modais escurecido para destacar as joias.
3.  **Tipografia:** Ajustes de peso e espaçamento para leitura mais agradável.
4.  **Texto:** Alterado "Arte em arame" para "Arte em joia" nos tooltips.

---
*Próximos Passos (Pós-Entrega): Conectar com API real do Instagram e Google Analytics.*
