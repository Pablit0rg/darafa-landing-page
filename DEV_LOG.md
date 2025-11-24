# MEMÓRIA TÉCNICA DO PROJETO: DaRafa Acessórios

Este documento resume a arquitetura, decisões de design e funcionalidades do projeto para referência futura rápida.

---

## 1. Conceito e Identidade
* **Tema:** "Ouro na Noite" (Gold in the Night).
* **Estética:** Luxo, Minimalismo, Fundo Preto Profundo (`#050505`), Detalhes em Dourado (`#C6A36B` e `#FFD277`).
* **Objetivo:** Landing Page tipo "One-Page" focada em exibir o catálogo como obras de arte e contar a história do processo manual.

## 2. Arquitetura de Arquivos (CSS Modular)
O projeto NÃO usa um CSS único. Ele usa um sistema de importação via `main.css`.

* **`styles/main.css`:** O "Maestro". Apenas importa os arquivos abaixo.
* **`styles/_base/`:**
    * `_reset.css`: Limpeza padrão.
    * `_variables.css`: Cores (Gold/Black), Fontes (Playfair/Poppins) e Espaçamentos.
    * `_global.css`: Configuração do Body, Scroll Suave e Botão "Voltar ao Topo".
* **`styles/_components/`:**
    * `_navbar.css`: Barra fixa com efeito vidro e menu mobile.
    * `_hero.css`: Seção inicial com Logo 3D centralizada.
    * `_zigzag.css`: **(CRÍTICO)** Controla o layout das seções (Texto vs Card Grande) e o Modal de Expansão.
    * `_highlights.css`: Controla os grids internos (mini-cards) e a barra de informações (`.card-info-bar`).
    * `_uiverse-button.css`: Botão especial animado "Let's Go".
    * `_footer.css`: Rodapé simples.

## 3. Lógica Funcional (JavaScript: `js/main.js`)
O JS centraliza todas as interações. Não há scripts inline.

1.  **Lógica "Portal" (Expansão Nível 1):**
    * Os "Cards Grandes" (`.big-card-wrapper`) na home são botões.
    * Ao clicar, o JS busca o conteúdo oculto (`.hidden-content`) dentro do card.
    * Ele clona esse conteúdo e injeta em um Modal de Tela Cheia (`.expansion-overlay`).
2.  **Lógica de Detalhes (Expansão Nível 2):**
    * Dentro do Modal aberto, existem mini-cards (`.gold-framebox`).
    * **Se for Joia:** Clicar abre um Lightbox simples (Zoom na foto).
    * **Se for História (Atelier):** O card possui atributos `data-title` e `data-description`. Clicar abre o "Modo Revista" (Janela dividida Texto + Foto).
3.  **Utilidades:**
    * Menu Mobile (Hambúrguer).
    * Botão "Voltar ao Topo" (aparece após scroll > 300px).

## 4. Estrutura das Seções (HTML)
O layout segue um padrão **Zig-Zag** controlado por classes CSS:

1.  **Hero:** Logo 3D + Título + CTA.
2.  **Catálogo (Galeria):** Layout `section-reversed` (Card na Esquerda, Texto na Direita).
3.  **O Atelier (Sobre):** Layout Padrão (Texto na Esquerda, Card na Direita).
4.  **A Artista:** Layout `section-reversed` (Card na Esquerda, Texto na Direita). *Nota: O card desta seção possui a classe `.no-expand` e não é clicável.*

## 5. Status Atual & Pendências
*  **Estrutura:** Completa e Funcional.
*  **Design:** Finalizado (Logo 3D implementada).
*  **Funcionalidade:** Modais e Navegação 100%.
*  **Conteúdo:** O site usa imagens `placehold.co` e textos genéricos.
    * **Próximo Passo:** Substituir pelos arquivos reais das fotos da Rafa e descrições reais das joias.

---
*Última atualização: 24/11/2025*
