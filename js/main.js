/**
 * DaRafa Acessórios - Main Script (Consolidado)
 * Controla: Tema, Menu, Scroll, Expansão e Modais de Detalhe
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // 1. TEMA DARK / LIGHT (Troca de Cores)
    // =========================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Só executa se o botão existir no HTML
    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('i');
        const body = document.body;

        // Verifica se já tem preferência salva no navegador do usuário
        if (localStorage.getItem('theme') === 'light') {
            body.classList.add('light-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }

        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            
            // Troca o ícone e salva a preferência
            if (body.classList.contains('light-theme')) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            } else {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            }
        });
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
            const hiddenContentDiv = this.querySelector('.hidden-content');
            if (hiddenContentDiv) {
                openExpansionModal(hiddenContentDiv.innerHTML);
            }
        });
    });

    // Função que abre o Modal Principal (A Galeria/Atelier)
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
        const miniCards = overlay.querySelectorAll('.gold-framebox');
        miniCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation(); // Impede que feche a galeria
                
                const img = card.querySelector('img');
                
                // LÓGICA DE DECISÃO: É HISTÓRIA OU JOIA?
                if (card.dataset.description) {
                    // Tem descrição? Então é Modo Revista (Atelier)
                    openStoryMode(img.src, card.dataset.title, card.dataset.description);
                } else {
                    // Não tem descrição? Então é Zoom na Foto (Galeria)
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
            // Só fecha se não tiver um Nível 2 (zoom) aberto por cima
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
        viewer.className = 'image-viewer-overlay'; // Classe definida no CSS _zigzag.css
        
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

        // Eventos de fechamento
        const closeBtn = viewer.querySelector('.close-viewer');
        if(closeBtn) closeBtn.addEventListener('click', closeViewer);
        
        viewer.addEventListener('click', (e) => { 
            if(e.target === viewer) closeViewer(); 
        });
        
        const closeViewerOnEsc = (e) => {
            if (e.key === 'Escape') {
                closeViewer();
                e.stopPropagation(); // Impede que o ESC feche a galeria de trás também
                document.removeEventListener('keydown', closeViewerOnEsc);
            }
        };
        document.addEventListener('keydown', closeViewerOnEsc);
    }

});
