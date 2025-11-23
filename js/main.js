/**
 * DaRafa Acessórios - Main Script
 * Controla: Menu Mobile, Scroll Suave, Botão Topo e Expansão de Cards
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENU MOBILE ---
    const navbarToggler = document.getElementById('navbar-toggler');
    const navbarMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('.navbar-link');

    // Abrir/Fechar ao clicar no hambúrguer
    navbarToggler.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
        navbarToggler.classList.toggle('is-active');
    });

    // Fechar ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarMenu.classList.remove('active');
            navbarToggler.classList.remove('is-active');
        });
    });


    // --- 2. BOTÃO VOLTAR AO TOPO ---
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });


    // --- 3. A MÁGICA DA EXPANSÃO (CARDS) ---
    const doors = document.querySelectorAll('.big-card-wrapper:not(.no-expand)');
    const body = document.body;

    doors.forEach(door => {
        door.addEventListener('click', () => {
            // 1. Pega o conteúdo escondido dentro do card
            const hiddenContent = door.querySelector('.hidden-content').innerHTML;
            
            // 2. Chama a função para abrir o modal
            openExpansionModal(hiddenContent);
        });
    });

    function openExpansionModal(contentHTML) {
        // Cria o elemento do modal dinamicamente
        const overlay = document.createElement('div');
        overlay.className = 'expansion-overlay';
        
        overlay.innerHTML = `
            <button class="close-expansion" aria-label="Fechar">&times;</button>
            <div class="expansion-content">
                ${contentHTML}
            </div>
        `;

        // Adiciona ao corpo do site
        body.appendChild(overlay);
        
        // Trava a rolagem do site fundo
        body.style.overflow = 'hidden';

        // Pequeno delay para permitir a animação CSS (fade in)
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);

        // --- Fechar o Modal ---
        const closeBtn = overlay.querySelector('.close-expansion');
        
        function closeModal() {
            overlay.classList.remove('active');
            
            // Espera a animação terminar para remover do HTML
            setTimeout(() => {
                overlay.remove();
                body.style.overflow = ''; // Destrava a rolagem
            }, 400);
        }

        closeBtn.addEventListener('click', closeModal);
        
        // Fechar se clicar fora do conteúdo (no fundo escuro)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }
});
