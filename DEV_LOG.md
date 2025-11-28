# Diário de Bordo do Projeto - DaRafa Landing Page

Este log documenta o progresso, as decisões e os próximos passos no desenvolvimento da landing page DaRafa.

---

### 15 de novembro de 2025: Kick-off e Estruturação
* **Status:** Início
* **Feito:** Planejamento, Setup Inicial, Estrutura de Pastas Modular.

---

### 24 de novembro de 2025: Interatividade e Lógica "Portal"
* **Status:** Fase 2 Concluída.
* **Feito:** Layout Zig-Zag, Lógica de Cards Expansíveis (JS), Modais de Nível 1 e 2.

---

### 26 de novembro de 2025: Pivô de Identidade "Honey"
* **Status:** Fase 3 Concluída.
* **Feito:** Mudança radical para Fundo Amarelo (#FDB90C), Texto Chocolate, Logo 3D.

---

### 27 de novembro de 2025: Refinamento Final de UI (Red & Gold)

**Status:** 🏁 Design System Finalizado e Congelado.

**O que foi feito hoje (Ajustes Finos):**
* **Identidade Visual (Ousada):**
    * **Bordas de Alto Contraste:** Substituída a borda dourada suave por uma **Borda Vermelha (`#ff0000`)** fixa nos mini-cards e modais, criando um destaque vibrante sobre o fundo amarelo.
    * **Subtítulo da Artista:** Estilizado com cor amarela e **contorno (text-shadow) marrom**, criando um efeito gráfico de destaque sem usar caixas.
* **Refinamento de Leitura:**
    * **Texto Justificado:** Aplicado alinhamento `justify` em todos os blocos de texto longos (Bio da Artista e Histórias do Atelier) para um visual editorial mais organizado.
    * **Navbar Sólida:** Removida a transparência da barra de navegação, adotando a cor sólida do tema para garantir legibilidade máxima dos links.
* **Consistência:**
    * As Barras de Informação (`.card-info-bar`) dos produtos agora seguem o padrão **Fundo Chocolate / Borda Vermelha**, alinhando-se com os botões e o restante da interface.

**Próximos Passos (Pós-Desenvolvimento):**
* [ ] **Conteúdo Real:** O site está pronto para receber as fotos finais e os textos descritivos de cada joia.
* [ ] **Integração:** Planejar a conexão com o Instagram no futuro.
* [ ] **Deploy:** Publicar a versão final.

---

---

### 26 de novembro de 2025 (Parte 5): Registro de Alternativa de Design (Botão Hard Shadow)

**Status:** 📝 Item adicionado ao Backlog de Testes.

**Nota de Design:**
Foi criada e validada uma variação do botão principal que pode ser testada na revisão final do projeto.

* **Estilo:** "Hard Shadow" (Sombra Dura/Brutalista Suave).
* **Características:**
    * Fundo Chocolate (`#241000`).
    * Texto Amarelo (`#FDB90C`).
    * Bordas levemente arredondadas (`border-radius: 8px`).
    * **Diferencial:** Sombra sólida deslocada na cor **Amarela (#FDB90C)** (mesma do fundo), criando um efeito de relevo tátil interessante.

**Ação Futura:**
* [ ] Testar a implementação do botão "Hard Shadow" com sombra amarela para ver se o contraste é suficiente ou se preferimos manter o gradiente atual.

---

### 24 de novembro de 2025: Reestruturação de Layout e Lógica "Portal"

**Status:** 🟡 Fase 2 (Interatividade) em andamento. Layout estrutural concluído.

**O que foi feito hoje:**
* **Mudança de Layout (Zig-Zag):** Alteramos a estrutura da home para um fluxo alternado (Texto/Imagem -> Imagem/Texto) para melhorar o ritmo visual e a narrativa.
* **Implementação do Conceito "Portal":**
    * Os cards grandes ("Galeria" e "Sobre") agora funcionam como botões gigantes.
    * Criada a lógica JavaScript (`main.js`) que clona o conteúdo oculto desses cards e o exibe em um **Modal de Tela Cheia**.
    * Adicionada a barra "Clique para expandir" que aparece ao passar o mouse (Hover), indicando interatividade.
* **Preparo para Conteúdo:** A estrutura HTML já prevê espaços para 15 joias na galeria e 4 destaques na seção "Sobre".

**Pendências Técnicas (Para resolver no final):**
* [ ] **Correção de Cores (Fundo Branco):** O modal e algumas seções estão com fundo branco/padrão. Precisamos reconectar as variáveis de cor (`var(--color-black-pure)`, etc.) nos arquivos CSS novos (`_zigzag.css`, `_highlights.css`) para voltar ao tema "Ouro na Noite".
* [ ] **Botão "Voltar ao Topo":** O JS está pronto, mas precisamos verificar se o CSS do botão está visível e posicionado corretamente.
* [ ] **Menu Mobile:** Testar a abertura/fechamento do menu hambúrguer com a nova estrutura.

**Próximos Passos (Conteúdo):**
* [ ] **Upload de Assets:** Subir as fotos reais da Rafa (Capa da Galeria, Capa do Sobre, Foto da Artista e as Joias).
* [ ] **Preenchimento:** Substituir os placeholders `placehold.co` pelas imagens reais.

---
