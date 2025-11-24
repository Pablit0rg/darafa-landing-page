/**
 * DaRafa Acessórios - Main Script (Atualizado com Zoom)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENU MOBILE ---
    const navbarToggler = document.getElementById('navbar-toggler');
    const navbarMenu = document.getElementById('navbar-menu');
    if(navbarToggler){
        navbarToggler.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
        });
    }

    // --- 2. BOTÃO VOLTAR AO TOPO ---
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) backToTopBtn.classList.add('visible');
        else backToTopBtn.classList.remove('visible');
    });

    // --- 3. A MÁGICA: EXPANSÃO DOS CARDS (NÍVEL 1) ---
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
        body.style.overflow = 'hidden'; // Trava rolagem do site

        // Delay para animação
        requestAnimationFrame(() => {
            overlay.classList.add('active');
        });

        // --- CONFIGURA OS MINI CARDS PARA CLICAR (NÍVEL 2) ---
        // Importante: Chamamos isso aqui porque os cards acabaram de ser criados
        const miniCards = overlay.querySelectorAll('.gold-framebox');
        miniCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation(); // Não deixa fechar a galeria
                const img = card.querySelector('img');
                if(img) openImageViewer(img.src);
            });
        });

        // Função para fechar a Galeria
        const close = () => {
            overlay.classList.remove('active');
            body.style.overflow = '';
            setTimeout(() => {
                if(overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 400);
        };

        overlay.querySelector('.close-expansion').addEventListener('click', close);
        
        // Fecha se clicar fora do conteúdo (mas não se clicar num card)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.classList.contains('expansion-content')) {
                close();
            }
        });
        
        // Fecha com ESC
        const closeOnEsc = (e) => {
            if (e.key === 'Escape') {
                // Se o visualizador de imagem estiver aberto, não fecha a galeria
                if(!document.querySelector('.image-viewer-overlay.active')) {
                    close();
                    document.removeEventListener('keydown', closeOnEsc);
                }
            }
        };
        document.addEventListener('keydown', closeOnEsc);
    }

    // --- 4. VISUALIZADOR DE IMAGEM (NÍVEL 2 - LIGHTBOX) ---
    function openImageViewer(imageSrc) {
        const viewer = document.createElement('div');
        viewer.className = 'image-viewer-overlay';
        
        viewer.innerHTML = `
            <button class="close-viewer">&times;</button>
            <img src="${imageSrc}" class="image-viewer-content" alt="Visualização Ampliada">
        `;

        body.appendChild(viewer);

        requestAnimationFrame(() => {
            viewer.classList.add('active');
        });

        const closeViewer = () => {
            viewer.classList.remove('active');
            setTimeout(() => {
                if(viewer.parentNode) viewer.parentNode.removeChild(viewer);
            }, 300);
        };

        viewer.addEventListener('click', closeViewer);
        
        // Tecla ESC específica para o viewer
        const closeViewerOnEsc = (e) => {
            if (e.key === 'Escape') {
                closeViewer();
                e.stopPropagation(); // Impede que feche a galeria atrás
                document.removeEventListener('keydown', closeViewerOnEsc);
            }
        };
        document.addEventListener('keydown', closeViewerOnEsc);
    }

});
