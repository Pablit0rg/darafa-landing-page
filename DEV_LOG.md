# 🐝 DaRafa Acessórios - O Dossiê Completo do Projeto (MASTER LOG)

**Resumo Executivo:**
Este documento narra a evolução completa do desenvolvimento da Landing Page para "DaRafa Acessórios". O projeto saiu de um conceito monolítico simples para uma aplicação modular, interativa e com uma identidade visual proprietária ("Honey Theme").

---

## 1. A Filosofia Inicial: Modularização
**O Problema:** Projetos anteriores cresciam demais e se tornavam difíceis de manter (arquivos de 1000+ linhas).
**A Solução:** Adotamos uma **Arquitetura CSS Modular**.
* Não existe um "style.css" gigante.
* Existe um "Maestro" (`styles/main.css`) que apenas importa pequenos arquivos específicos.
* **Estrutura de Pastas:**
    * `_base/`: Configurações globais (Reset, Variáveis, Tipografia).
    * `_components/`: Cada pedaço do site tem seu arquivo (`_navbar.css`, `_hero.css`, etc.).

---

## 2. Evolução Visual (Do Escuro ao Mel)

### Fase 1: "Ouro na Noite" (Gold in the Night) 🌑
* **Conceito:** Fundo preto profundo (`#050505`) com detalhes em Dourado Metálico.
* **Objetivo:** Passar luxo e exclusividade, como uma joalheria noturna.

### Fase 2: O Pivô para "Honey Theme" (O Tema Atual) 🍯
* **A Mudança:** Identidade visual baseada na cor da logo da Abelha.
* **Paleta Oficial:**
    * **Fundo:** Amarelo Mel Vibrante (`#FDB90C`).
    * **Contraste:** Textos e elementos gráficos em **Chocolate/Preto** (`#241000`) para leitura perfeita.
    * **Destaque:** Bordas e Linhas em **Vermelho Vivo (`#ff0000`)** fixo, criando um visual moderno e "street".
* **Textura:** Fundo de "Favo de Mel" (Honeycomb) fixo (`background-attachment: fixed`) com filtro escuro.

### Fase 3: Refinamento Final de UI (Red & Gold)
* **Cards:** Mini-cards com bordas vermelhas fixas e Barra de Informação em Chocolate com texto Amarelo.
* **Modais:** Fundo Amarelo Mel Sólido com bordas vermelhas, mantendo a consistência visual.
* **Navbar:** Transparente (Clean) com links em Chocolate que não somem no hover.

---

## 3. Evolução Estrutural (Layout e UX)

### Layout Zig-Zag
As seções principais ("Catálogo", "O Atelier", "A Artista") seguem um fluxo alternado (Texto à Esquerda/Imagem à Direita, e vice-versa) para melhorar o ritmo de leitura.

### A Lógica dos "Cards Porta" (Feature Principal) 🚪
Não mostramos todas as fotos de uma vez. Criamos uma experiência de descoberta:
1.  **A Capa:** O usuário vê um Card Grande (uma "Porta") com uma foto de capa e uma barra "Clique para expandir".
2.  **A Ação:** Ao clicar, o card expande (via JavaScript) para um **Modal de Tela Cheia**.
3.  **O Conteúdo Oculto:** O JS clona o conteúdo escondido (`.hidden-content`) e exibe no modal.

### Níveis de Profundidade (Deep Dive)
O JavaScript foi programado para lidar com dois tipos de conteúdo dentro dos modais:
* **Tipo 1 (Galeria):** Ao clicar numa joia pequena, abre um **Lightbox** (Zoom na foto).
* **Tipo 2 (Atelier/História):** Ao clicar numa foto de processo (que tem atributos `data-description`), abre o **Modo Revista** (Uma janela dividida com Foto Grande + Texto Explicativo).

---

## 4. Mapa Técnico dos Arquivos (O Código Atual)

Se precisar editar algo, vá direto ao arquivo responsável:

### 📂 `styles/_base/`
* `_variables.css`: Define a paleta "Mel & Chocolate" e fontes.
* `_global.css`: Define o background de colmeia, o botão "Voltar ao Topo" (Estilo Luxo) e tipografia base.
* `_reset.css`: Limpeza padrão de navegador.

### 📂 `styles/_components/`
* `_navbar.css`: Barra transparente. Links Chocolate.
* `_hero.css`: Seção inicial. Contém a Logo (Imagem) centralizada. Efeito de glow removido para limpeza visual.
* `_zigzag.css`: **(ARQUIVO CRÍTICO)** Controla o layout das seções principais, o estilo dos Cards Grandes e o **Modal de Expansão**.
* `_highlights.css`: Controla os grids internos (mini-cards), a **Barra de Informação** e o estilo do **Modo Revista**.
* `_uiverse-button.css`: Botões com gradiente Chocolate e texto Amarelo.
* `_footer.css`: Rodapé com assinatura e copyright.

### 📂 `js/`
* `main.js`: Cérebro único do site.
    1.  **Gerador de Catálogo:** Cria automaticamente 50 cards de joias ao carregar a página.
    2.  **Menu Mobile:** Controle do hambúrguer.
    3.  **Botão "Voltar ao Topo":** Scroll listener.
    4.  **Modais:** Lógica de abrir/fechar e detecção inteligente de conteúdo (Zoom vs Revista).

---

## 5. Pendências e Futuro (To-Do List)

**Para o Lançamento (Reta Final):**
* [ ] **Conteúdo Real:** Substituir os placeholders (`placehold.co`) pelas fotos reais das joias e da Rafa.
* [ ] **Copywriting:** Preencher o Array no JS com os nomes e descrições reais das 50 peças.
* [ ] **SEO:** Configurar Meta Tags e Alt Texts.

**Para o Futuro (Pós-Entrega):**
* [ ] **Automação Instagram:** Implementar uma API ou Widget para puxar posts do Instagram automaticamente.

---
*Log Finalizado em: 28/11/2025 - Versão: Honeycomb Production Ready*
