# DaRafa Acessórios - Landing Page

Este projeto é uma landing page "one-page" (página única) criada para a marca de acessórios artesanais curitibana @darafa_cwb.

## Objetivo

O site funciona como uma galeria virtual e um portfólio digital, projetado para:
1.  Apresentar a identidade visual da marca.
2.  Exibir os produtos (joias artesanais, como "nose cuffs" e brincos) de forma elegante.
3.  Direcionar o tráfego de visitantes diretamente para o perfil do Instagram, que é o principal canal de vendas e catálogo.

## Conceito de Design: "Ouro na Noite"

A estética do site é baseada na identidade visual da marca (logo de abelha dourada sobre fundo preto). Usamos um tema escuro (preto total) para criar uma sensação de "galeria de arte noturna", onde os produtos e botões dourados se destacam como os pontos de luz e foco.

## Tecnologias Utilizadas

* **HTML5** (Estrutura semântica)
* **CSS3** (Estilização)
* **JavaScript** (Para futuras interações e animações)

## Estrutura de Arquivos Modular

Este projeto adota uma arquitetura CSS modular para facilitar a manutenção e o desenvolvimento ágil. Os estilos não estão em um único arquivo monolítico; eles são divididos por componentes.

* `styles/main.css`: É o "maestro" que apenas importa os outros arquivos.
* `styles/_base/`: Contém os resets, variáveis (cores, fontes) e estilos globais.
* `styles/_components/`: Cada seção do site (Hero, Galeria, Footer, etc.) tem seu próprio arquivo `.css`.

Para editar uma seção específica, edite apenas o arquivo de componente correspondente, e não o `main.css`.

## Como Executar

1.  Clone este repositório.
2.  Abra o arquivo `index.html` em qualquer navegador web moderno.
