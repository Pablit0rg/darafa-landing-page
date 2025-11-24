---

### 24 de novembro de 2025: Implementação da Lógica "Portal" e Experiência Interativa

**Status:** Fase 2 (Interatividade Avançada) Concluída.

**O que foi feito hoje:**
* **Reestruturação de Layout (Zig-Zag):** Alteramos o fluxo da página para um padrão "Z" (Texto/Imagem alternados) para melhorar o ritmo de leitura e a estética visual.
* **Conceito "Card Porta":** Implementada a lógica onde os Cards Grandes da página inicial funcionam como "portas" que, ao serem clicadas, expandem um Modal de tela cheia revelando o conteúdo oculto.
* **Níveis de Interação (Deep Dive):**
    * **Nível 1 (Expansão):** O Card Grande abre a galeria interna.
    * **Nível 2 (Galeria):** Clicar em uma joia abre um *Lightbox* (Zoom) para ver detalhes.
    * **Nível 2 (Sobre):** Clicar em uma foto de processo abre o *Modo Revista* (Story Mode), uma janela dividida com foto e texto descritivo detalhado.
* **Micro-interações de UX:**
    * Adicionadas "Barras de Informação" (Info Bars) nos cards de joias para exibir Nome e Descrição curta.
    * Adicionados "Badges" (Etiquetas) nos cards de processo indicando "Ler História".
* **JavaScript:** Centralizado no `main.js` para controlar Menu Mobile, Scroll, Modais, Lightbox e detecção de conteúdo (História vs. Imagem).

**Próximos Passos (Next Steps):**
* [ ] **Identidade Visual:** Recriar a logo da "Abelha" do zero com efeito dourado/neon para combinar com o site.
* [ ] **Assets:** Substituir os placeholders pelas fotos reais da cliente.
* [ ] **Deploy:** Verificar a build final na Vercel.
