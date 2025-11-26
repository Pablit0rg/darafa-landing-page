DEV_LOG_JORNADA_COMPLETA.md

DaRafa Acessórios - O Dossiê Completo do Projeto
Resumo Executivo: Este documento narra a evolução completa do desenvolvimento da Landing Page para "DaRafa Acessórios". O projeto saiu de um conceito monolítico simples para uma aplicação modular, interativa e com uma identidade visual proprietária ("Honey Theme").

1. A Filosofia Inicial: Modularização
O Problema: Projetos anteriores cresciam demais e se tornavam difíceis de manter (arquivos de 1000+ linhas). A Solução: Adotamos uma Arquitetura CSS Modular.

Não existe um "style.css" gigante.

Existe um "Maestro" (styles/main.css) que apenas importa pequenos arquivos específicos.

Estrutura de Pastas:

_base/: Configurações globais (Reset, Variáveis, Tipografia).

_components/: Cada pedaço do site tem seu arquivo (_navbar.css, _hero.css, etc.).

2. Evolução Visual (Do Escuro ao Mel)
Fase 1: "Ouro na Noite" (Gold in the Night)
Conceito: Fundo preto profundo (#050505) com detalhes em Dourado Metálico.

Objetivo: Passar luxo e exclusividade, como uma joalheria noturna.

Elementos: Fontes com serifa (Playfair Display), botões com gradiente dourado e sombras brilhantes (Glow).

Fase 2: O Pivô para "Honey Theme" (O Tema Atual)
A Mudança: Decidimos que o site precisava de mais personalidade e conexão com a marca (Abelha).

Ação: Invertemos completamente a paleta.

Novo Fundo: Amarelo Mel Vibrante (#FDB90C).

Novo Contraste: Textos e elementos gráficos em Chocolate/Preto (#241000) para leitura perfeita.

Textura: Implementamos um background de "Favo de Mel" (Honeycomb) fixo (background-attachment: fixed) com um filtro escuro para não brigar com o conteúdo.

3. Evolução Estrutural (Layout e UX)
De "Blocos Simples" para "Zig-Zag Interativo"
Inicialmente, as seções eram empilhadas. Mudamos para um layout Zig-Zag (Texto à Esquerda/Imagem à Direita, alternando) para melhorar o ritmo de leitura.

A Lógica dos "Cards Porta" (Feature Principal)
Decidimos não mostrar todas as fotos de uma vez. Criamos uma experiência de descoberta:

A Capa: O usuário vê um Card Grande (uma "Porta") com uma foto de capa.

A Ação: Ao clicar, o card expande (via JavaScript) para um Modal de Tela Cheia.

O Conteúdo Oculto: Só então o usuário vê o grid completo de joias ou fotos de bastidores.

Níveis de Profundidade (Deep Dive)
O JavaScript foi programado para lidar com dois tipos de conteúdo dentro dos modais:

Tipo 1 (Galeria): Ao clicar numa joia pequena, abre um Lightbox (Zoom na foto).

Tipo 2 (Atelier/História): Ao clicar numa foto de processo, abre o Modo Revista (Uma janela dividida com Foto Grande + Texto Explicativo).

4. Mapa Técnico dos Arquivos (O Código Atual)
Se precisar editar algo, vá direto ao arquivo responsável:

styles/_base/
_variables.css: Define a paleta "Mel & Chocolate" e fontes.

_global.css: Define o background de colmeia, o botão "Voltar ao Topo" e tipografia base.

_reset.css: Limpeza padrão de navegador.

styles/_components/
_navbar.css: Barra de navegação fixa. Atualmente configurada com as mesmas cores do rodapé (Sólida) para leitura clara.

_hero.css: Seção inicial. Contém a Logo 3D centralizada e animações de entrada. Removemos o brilho (glow) excessivo para limpar o visual.

_zigzag.css: (ARQUIVO CRÍTICO) Controla o layout das seções principais e o estilo do Modal de Expansão.

_highlights.css: Controla os grids internos (os mini-cards de joias) e a Barra de Informação (Nome/Descrição) que aparece sobre as fotos.

_uiverse-button.css: Botões com gradiente e animação de brilho.

_footer.css: Rodapé com assinatura e copyright.

js/
main.js: Cérebro único do site. Controla:

Menu Mobile.

Botão "Voltar ao Topo".

Lógica de abrir/fechar Modais.

Detecção inteligente de conteúdo (se é para abrir Zoom ou Modo Revista).

5. Pendências e Futuro (To-Do List)
Para o Lançamento:

[ ] Conteúdo Real: Substituir os placeholders (placehold.co) pelas fotos reais das joias e da Rafa.

[ ] Copywriting: Escrever os nomes e descrições reais de cada peça no HTML.

Para o Futuro (Pós-Entrega):

[ ] Automação Instagram: Implementar uma API ou Widget para puxar posts do Instagram automaticamente.

[ ] Visualizador 3D: Estudar a possibilidade de criar visualizações 3D reais das joias (giráveis).

---

### 26 de novembro de 2025 (Parte 3): Finalização Visual e Ajustes de UX

**Status:** 🏁 Projeto Visualmente Polido e Estável.

**O que foi feito hoje:**
* **Identidade Visual (Refinamento Honey):**
    * **Background:** Substituído o gradiente simples pela imagem de textura `honeycomb-background2.jpg`, aplicada com um filtro escuro (`overlay`) e fixação (`fixed`) para criar profundidade sem poluir a leitura.
    * **Logo:** Substituída a versão antiga pela versão final `logo-darafa-oficial.png` (fundo transparente).
    * **Interação Hero:** Removido o efeito excessivo de "glow" ao passar o mouse na logo, mantendo apenas um zoom sutil para um visual mais limpo e profissional.

* **Melhorias de Navegação (Navbar):**
    * **Estética:** A barra de navegação foi ajustada para ser **100% sólida e opaca**, copiando exatamente as cores do rodapé (Fundo Preto / Borda Cinza). Isso resolveu o problema de legibilidade sobre o fundo amarelo vibrante.
    * **Hover:** Ajustado o comportamento dos links para ficarem brancos ao passar o mouse, garantindo contraste.

* **Correções de Layout (Zig-Zag):**
    * **Alinhamento:** Forçado o alinhamento **justificado** nos textos descritivos das seções, inclusive na versão mobile, para manter a elegância editorial.
    * **Conteúdo Faltante:** Reinsuportado o parágrafo de descrição da seção "A Artista" que havia se perdido.

**Estado Atual:**
O site possui uma identidade visual forte, coesa e funcional. A navegação é clara, o contraste de leitura está otimizado e as interações (modais, zoom) funcionam perfeitamente.

**Próximos Passos:**
* [ ] **Conteúdo Final:** Substituir os placeholders restantes e textos de marcação pelos oficiais.
* [ ] **Deploy:** Publicação da versão final.
