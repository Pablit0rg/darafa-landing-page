/**
 * DaRafa Acessórios - Main Script
 * Controla: Menu Mobile, Scroll Suave, Botão Topo e a Mágica dos Cards Expansíveis
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // 1. MENU MOBILE (Hambúrguer)
    // =========================================================
    const navbarToggler = document.getElementById('navbar-toggler');
    const navbarMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('.navbar-link');

    // Função para alternar o menu
    function toggleMenu() {
        navbarMenu.classList.toggle('active');
        navbarToggler.classList.toggle('is-active'); // Se houver animação no ícone
    }

    // Clique no botão hambúrguer
    if (navbarToggler) {
        navbarToggler.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita bugs de clique duplo
            toggleMenu();
        });
    }

    // Fechar o menu ao clicar em qualquer link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Fechar ao clicar fora do menu (opcional, mas boa prática)
    document.addEventListener('click', (e) => {
        if (navbarMenu.classList.contains('active') && 
            !navbarMenu.contains(e.target) && 
            !navbarToggler.contains(e.target)) {
            toggleMenu();
        }
    });


    // =========================================================
    // 2. BOTÃO VOLTAR AO TOPO
    // =========================================================
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            // Se rolar mais de 300px, mostra o botão
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
    }


    // =========================================================
    // 3. A MÁGICA: EXPANSÃO DOS CARDS (PORTAL)
    // =========================================================
    
    // Seleciona todos os cards grandes que NÃO tenham a classe 'no-expand'
    const doors = document.querySelectorAll('.big-card-wrapper:not(.no-expand)');
    const body = document.body;

    doors.forEach(door => {
        door.addEventListener('click', function(e) {
            // Impede cliques acidentais se estiver arrastando (opcional)
            e.preventDefault();

            // 1. Encontra o conteúdo escondido dentro deste card específico
            const hiddenContentDiv = this.querySelector('.hidden-content');
            
            if (hiddenContentDiv) {
                // Pega o HTML de dentro (o grid de fotos)
                const contentHTML = hiddenContentDiv.innerHTML;
                
                // 2. Chama a função que abre o modal com esse conteúdo
                openExpansionModal(contentHTML);
            }
        });
    });

    // Função que cria e abre o Modal
    function openExpansionModal(contentHTML) {
        // Cria o elemento Overlay (Fundo escuro)
        const overlay = document.createElement('div');
        overlay.className = 'expansion-overlay';
        
        // Preenche o overlay com o botão fechar e o conteúdo
        overlay.innerHTML = `
            <button class="close-expansion" aria-label="Fechar Modal">
                <i class="fas fa-times"></i> </button>
            <div class="expansion-content">
                ${contentHTML}
            </div>
        `;

        // Adiciona ao final do corpo do site
        body.appendChild(overlay);
        
        // Trava a rolagem do site principal
        body.style.overflow = 'hidden';

        // Pequeno delay para permitir a animação CSS (fade in) funcionar
        requestAnimationFrame(() => {
            overlay.classList.add('active');
        });

        // --- Lógica para Fechar ---
        const closeBtn = overlay.querySelector('.close-expansion');

        function closeModal() {
            // Remove a classe ativa para animar a saída
            overlay.classList.remove('active');
            
            // Destrava a rolagem
            body.style.overflow = '';

            // Espera a animação (0.4s) terminar antes de remover do HTML
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 400);
        }

        // Fechar ao clicar no X
        closeBtn.addEventListener('click', closeModal);
        
        // Fechar ao clicar no fundo escuro (fora do conteúdo)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });

        // Fechar ao apertar a tecla ESC
        document.addEventListener('keydown', function closeOnEsc(e) {
            if (e.key === 'Escape') {
                closeModal();
                // Remove este ouvinte para não acumular
                document.removeEventListener('keydown', closeOnEsc);
            }
        });
    }

});
