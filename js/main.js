/**
 * DaRafa Acessórios - Main Script (Final)
 * Funcionalidades:
 * 1. Geração Automática do Catálogo (50 Itens)
 * 2. Menu Mobile
 * 3. Botão Voltar ao Topo
 * 4. Lógica de Expansão de Cards (Portal)
 * 5. Modais de Detalhe (Zoom e Revista)
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. GERADOR DE CATÁLOGO (50 ITENS AUTOMÁTICOS)
    // =========================================================
    const galleryContainer = document.querySelector('#gallery-door .gallery-5-cols');
    
    if (galleryContainer) {
        // Limpa qualquer conteúdo inicial (para não duplicar)
        galleryContainer.innerHTML = '';
        
        // Cria 50 cards automaticamente
        for (let i = 1; i <= 50; i++) {
            // Monta o HTML de um card
            const cardHTML = `
                <div class="gold-framebox">
                    <img src="https://placehold.co/300x400/0e0e0e/C6A36B?text=Joia+${i}" alt="Joia ${i} da Coleção">
                    <div class="card-info-bar">
                        <h3 class="info-title">Joia Exclusiva ${i}</h3>
                        <p class="info-desc">Design artesanal em arame dourado, peça única da coleção DaRafa.</p>
                    </div>
                </div>
            `;
            // Adiciona ao container
            galleryContainer.innerHTML += cardHTML;
        }
    }


    // =========================================================
    // 2. MENU MOBILE (Hambúrguer)
    // =========================================================
    const navbarToggler = document.getElementById('navbar-toggler');
    const navbarMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('.navbar-link');

    function toggleMenu() {
        navbarMenu.classList.toggle('active');
        navbarToggler.classList.toggle('is-active');
    }

    if(navbarToggler){
        navbarToggler.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Fecha o menu ao clicar num link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarMenu.classList.contains('active')) toggleMenu();
        });
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
        if (navbarMenu && navbarMenu.classList.contains('active') && 
            !navbarMenu.contains(e.target) && 
            !navbarToggler.contains(e.target)) {
            toggleMenu();
        }
    });


    // =========================================================
    // 3. BOTÃO VOLTAR AO TOPO
    // =========================================================
    const backToTopBtn = document.getElementById('backToTop');

    if(backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backToTopBtn.classList.add('visible');
            else backToTopBtn.classList.remove('visible');
        });
    }


    // =========================================================
    // 4. A MÁGICA: EXPANSÃO DOS CARDS (NÍVEL 1 - PORTAL)
    // =========================================================
    const doors = document.querySelectorAll('.big-card-wrapper:not(.no-expand)');
    const body = document.body;

    doors.forEach(door => {
        door.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Busca o conteúdo escondido dentro deste card específico
            // (Agora ele pega os 50 itens que acabamos de gerar lá em cima)
            const hiddenContentDiv = this.querySelector('.hidden-content');
            
            if (hiddenContentDiv) {
                openExpansionModal(hiddenContentDiv.innerHTML);
            }
        });
    });

    function openExpansionModal(contentHTML) {
        const overlay = document.createElement('div');
        overlay.className = 'expansion-overlay';
        
        overlay.innerHTML = `
            <button class="close-expansion" aria-label="Fechar">&times;</button>
            <div class="expansion-content">
                ${contentHTML}
            </div>
        `;

        body.appendChild(overlay);
        body.style.overflow = 'hidden'; // Trava rolagem do fundo

        // Animação de entrada
        requestAnimationFrame(() => { overlay.classList.add('active'); });

        // --- CONFIGURA CLIQUE NOS MINI CARDS (NÍVEL 2) ---
        // Precisamos re-selecionar os cards agora que eles existem dentro do modal
        const miniCards = overlay.querySelectorAll('.gold-framebox');
        
        miniCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation(); // Impede que feche a galeria
                
                const img = card.querySelector('img');
                
                // LÓGICA DE DECISÃO: É HISTÓRIA OU JOIA?
                if (card.dataset.description) {
                    // Tem descrição longa? Então é Modo Revista (Atelier)
                    openStoryMode(img.src, card.dataset.title, card.dataset.description);
                } else {
                    // Não tem? Então é Zoom na Foto (Galeria Gerada Automaticamente)
                    if(img) openImageViewer(img.src);
                }
            });
        });

        // Função interna para fechar este modal
        const close = () => {
            overlay.classList.remove('active');
            body.style.overflow = '';
            setTimeout(() => { 
                if(overlay.parentNode) overlay.parentNode.removeChild(overlay); 
            }, 400);
        };

        overlay.querySelector('.close-expansion').addEventListener('click', close);
        
        // Fecha se clicar no fundo escuro (mas não no conteúdo)
        overlay.addEventListener('click', (e) => { 
            if (e.target === overlay || e.target.classList.contains('expansion-content')) {
                close(); 
            }
        });
        
        // Fecha com ESC
        const closeOnEsc = (e) => {
            if (e.key === 'Escape' && !document.querySelector('.image-viewer-overlay.active')) {
                close();
                document.removeEventListener('keydown', closeOnEsc);
            }
        };
        document.addEventListener('keydown', closeOnEsc);
    }


    // =========================================================
    // 5. MODAIS DE DETALHE (NÍVEL 2)
    // =========================================================

    // TIPO A: Visualizador Simples (Zoom na Foto)
    function openImageViewer(imageSrc) {
        const content = `<img src="${imageSrc}" class="image-viewer-content" style="max-height:90vh; max-width:90%; border:1px solid var(--color-gold-dark); box-shadow: 0 0 30px rgba(0,0,0,0.8);">`;
        createViewerOverlay(content);
    }

    // TIPO B: Modo Revista (Foto + Texto)
    function openStoryMode(imageSrc, title, description) {
        const content = `
            <div class="story-viewer-content">
                <div class="story-image-col">
                    <img src="${imageSrc}" alt="${title}">
                </div>
                <div class="story-text-col">
                    <h3 class="story-title">${title}</h3>
                    <p class="story-desc">${description}</p>
                </div>
            </div>
        `;
        createViewerOverlay(content);
    }

    // Função Genérica para criar o Overlay do Nível 2 (acima de tudo)
    function createViewerOverlay(innerContent) {
        const viewer = document.createElement('div');
        viewer.className = 'image-viewer-overlay';
        
        viewer.innerHTML = `
            <button class="close-viewer" aria-label="Fechar" style="position:absolute; top:20px; right:30px; color:#fff; font-size:2rem; background:none; border:none; cursor:pointer; z-index:3001;">
                &times;
            </button>
            ${innerContent}
        `;
        
        body.appendChild(viewer);
        
        requestAnimationFrame(() => viewer.classList.add('active'));

        const closeViewer = () => {
            viewer.classList.remove('active');
            setTimeout(() => { 
                if(viewer.parentNode) viewer.parentNode.removeChild(viewer); 
            }, 300);
        };

        const closeBtn = viewer.querySelector('.close-viewer');
        if(closeBtn) closeBtn.addEventListener('click', closeViewer);
        
        viewer.addEventListener('click', (e) => { 
            if(e.target === viewer) closeViewer(); 
        });
        
        const closeViewerOnEsc = (e) => {
            if (e.key === 'Escape') {
                closeViewer();
                e.stopPropagation();
                document.removeEventListener('keydown', closeViewerOnEsc);
            }
        };
        document.addEventListener('keydown', closeViewerOnEsc);
    }

});
