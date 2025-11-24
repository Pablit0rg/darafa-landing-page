/**
 * DaRafa Acessórios - Main Script (Limpo)
 * Controla: Menu, Scroll, Expansão e Modais de Detalhe
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // 1. MENU MOBILE (Hambúrguer)
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
    // 2. BOTÃO VOLTAR AO TOPO
    // =========================================================
    const backToTopBtn = document.getElementById('backToTop');

    if(backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backToTopBtn.classList.add('visible');
            else backToTopBtn.classList.remove('visible');
        });
    }


    // =========================================================
    // 3. A MÁGICA: EXPANSÃO DOS CARDS (NÍVEL 1 - PORTAL)
    // =========================================================
    const doors = document.querySelectorAll('.big-card-wrapper:not(.no-expand)');
    const body = document.body;

    doors.forEach(door => {
        door.addEventListener('click', function(e) {
            e.preventDefault();
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
        body.style.overflow = 'hidden';

        requestAnimationFrame(() => { overlay.classList.add('active'); });

        // --- CLIQUE NOS MINI CARDS (NÍVEL 2) ---
        const miniCards = overlay.querySelectorAll('.gold-framebox');
        miniCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const img = card.querySelector('img');
                
                if (card.dataset.description) {
                    openStoryMode(img.src, card.dataset.title, card.dataset.description);
                } else {
                    if(img) openImageViewer(img.src);
                }
            });
        });

        const close = () => {
            overlay.classList.remove('active');
            body.style.overflow = '';
            setTimeout(() => { 
                if(overlay.parentNode) overlay.parentNode.removeChild(overlay); 
            }, 400);
        };

        overlay.querySelector('.close-expansion').addEventListener('click', close);
        overlay.addEventListener('click', (e) => { 
            if (e.target === overlay || e.target.classList.contains('expansion-content')) {
                close(); 
            }
        });
        
        const closeOnEsc = (e) => {
            if (e.key === 'Escape' && !document.querySelector('.image-viewer-overlay.active')) {
                close();
                document.removeEventListener('keydown', closeOnEsc);
            }
        };
        document.addEventListener('keydown', closeOnEsc);
    }


    // =========================================================
    // 4. MODAIS DE DETALHE (NÍVEL 2)
    // =========================================================

    function openImageViewer(imageSrc) {
        const content = `<img src="${imageSrc}" class="image-viewer-content" style="max-height:90vh; max-width:90%; border:1px solid var(--color-gold-dark); box-shadow: 0 0 30px rgba(0,0,0,0.8);">`;
        createViewerOverlay(content);
    }

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
