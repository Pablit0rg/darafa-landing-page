/**
 * DaRafa Acessórios - Main Script (Versão Data-Driven Uniformizada)
 * * ATUALIZAÇÃO:
 * - Todas as joias do catálogo agora usam a imagem de referência (4 peças).
 * - Mantida a estrutura de dados para fácil alteração futura.
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 0. CONFIGURAÇÕES GERAIS
    // =========================================================
    const INSTAGRAM_TOKEN = ''; // Seu Token aqui futuramente
    const POSTS_LIMIT = 50; 

    // =========================================================
    // 1. BASE DE DADOS (Seu Catálogo Virtual)
    // Todas as imagens apontam para 'darafa-catalogo.jpg' conforme solicitado.
    // =========================================================
    const productsData = [
        {
            id: 1,
            category: 'nose-cuff',
            title: 'Nose Cuff Spirals',
            description: 'Design espiral em arame dourado, ajuste anatômico sem necessidade de furos.',
            image: 'assets/images/darafa-catalogo.jpg' 
        },
        {
            id: 2,
            category: 'brincos',
            title: 'Brinco Solar',
            description: 'Peça statement inspirada no sol, leve, marcante e com acabamento martelado.',
            image: 'assets/images/darafa-catalogo.jpg'
        },
        {
            id: 3,
            category: 'body',
            title: 'Body Chain Lux',
            description: 'Corrente corporal para realçar a beleza natural no verão ou em ocasiões especiais.',
            image: 'assets/images/darafa-catalogo.jpg'
        },
        {
            id: 4,
            category: 'aneis',
            title: 'Anel Regulável Flow',
            description: 'Adapta-se a qualquer dedo com conforto, trazendo movimento orgânico.',
            image: 'assets/images/darafa-catalogo.jpg'
        },
        {
            id: 5,
            category: 'brincos',
            title: 'Argola Texturizada',
            description: 'Um clássico revisitado com texturas manuais que captam a luz.',
            image: 'assets/images/darafa-catalogo.jpg'
        },
        {
            id: 6,
            category: 'colar',
            title: 'Choker Minimal',
            description: 'Aro rígido dourado, elegância instantânea para qualquer composição.',
            image: 'assets/images/darafa-catalogo.jpg'
        },
        {
            id: 7,
            category: 'nose-cuff',
            title: 'Nose Cuff Duplo',
            description: 'Duas voltas de arame para destaque extra no visual.',
            image: 'assets/images/darafa-catalogo.jpg'
        },
        {
            id: 8,
            category: 'brincos',
            title: 'Maxi Brinco',
            description: 'Para quem não tem medo de brilhar e ocupar espaço.',
            image: 'assets/images/darafa-catalogo.jpg'
        }
    ];

    // =========================================================
    // 2. CONTROLE DE CONTEÚDO E RENDERIZAÇÃO
    // =========================================================
    const galleryContainer = document.querySelector('#gallery-door .gallery-5-cols');
    
    if (galleryContainer) {
        initCatalog();
    }

    async function initCatalog() {
        // Lógica de Fallback: Se não tem token, carrega o local direto
        if (INSTAGRAM_TOKEN) {
            try {
                await fetchInstagramPosts();
            } catch (error) {
                console.warn("Falha no Instagram, carregando catálogo local...", error);
                renderLocalCatalog(productsData);
            }
        } else {
            // Carregamento Padrão (Local)
            renderLocalCatalog(productsData);
        }
        
        // Inicia o observador de imagens (Lazy Load) após criar os elementos
        initLazyObserver();
    }

    // --- A. RENDERIZA O CATÁLOGO LOCAL ---
    function renderLocalCatalog(items) {
        if (!galleryContainer) return;
        galleryContainer.innerHTML = ''; // Limpa container

        items.forEach(item => {
            // Criação do HTML baseado nos dados do objeto
            const cardHTML = `
                <div class="gold-framebox" data-category="${item.category}" data-title="${item.title}" data-description="${item.description}">
                    <img 
                        class="lazy-image" 
                        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                        data-src="${item.image}" 
                        alt="${item.title}"
                        style="transition: opacity 0.5s ease; opacity: 0;"
                    >
                    <div class="card-info-bar">
                        <h3 class="info-title">${item.title}</h3>
                        <p class="info-desc">${item.description}</p>
                    </div>
                </div>
            `;
            galleryContainer.innerHTML += cardHTML;
        });
    }

    // --- B. BUSCA DO INSTAGRAM (MANTIDO) ---
    async function fetchInstagramPosts() {
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${INSTAGRAM_TOKEN}&limit=${POSTS_LIMIT}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro na resposta do Instagram');
        const data = await response.json();
        
        galleryContainer.innerHTML = '';

        data.data.forEach(post => {
            const imageUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
            const caption = post.caption ? post.caption : 'DaRafa Acessórios';
            const shortDesc = caption.length > 80 ? caption.substring(0, 80) + '...' : caption;

            const cardHTML = `
                <div class="gold-framebox">
                    <img 
                        class="lazy-image" 
                        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                        data-src="${imageUrl}" 
                        alt="Post Instagram"
                        style="transition: opacity 0.5s ease; opacity: 0;" 
                    >
                    <div class="card-info-bar">
                        <h3 class="info-title">Do Instagram</h3>
                        <p class="info-desc">${shortDesc}</p>
                    </div>
                </div>
            `;
            galleryContainer.innerHTML += cardHTML;
        });
    }

    // --- C. OBSERVADOR DE IMAGENS (LAZY LOADER) ---
    function initLazyObserver() {
        const lazyImages = document.querySelectorAll('.lazy-image');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src; // Carrega a imagem real
                    
                    img.onload = () => {
                        img.style.opacity = 1; // Efeito Fade-In
                        img.classList.add('loaded'); 
                    };
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: "50px 0px", 
            threshold: 0.01
        });

        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    }


    // =========================================================
    // 3. MENU MOBILE
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
    // 4. BOTÃO VOLTAR AO TOPO
    // =========================================================
    const backToTopBtn = document.getElementById('backToTop');

    if(backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backToTopBtn.classList.add('visible');
            else backToTopBtn.classList.remove('visible');
        });
    }


    // =========================================================
    // 5. SISTEMA DE PORTAL (EXPANSÃO DE CARDS)
    // =========================================================
    const doors = document.querySelectorAll('.big-card-wrapper:not(.no-expand)');
    const body = document.body;

    doors.forEach(door => {
        door.addEventListener('click', function(e) {
            e.preventDefault();
            const hiddenContentDiv = this.querySelector('.hidden-content');
            
            if (hiddenContentDiv) {
                // Clona o conteúdo para o Modal
                const contentHTML = hiddenContentDiv.innerHTML;
                openExpansionModal(contentHTML);
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
        body.style.overflow = 'hidden'; // Trava o scroll da página principal

        requestAnimationFrame(() => { overlay.classList.add('active'); });

        // --- REATIVAR LAZY LOAD DENTRO DO MODAL ---
        const modalImages = overlay.querySelectorAll('.lazy-image');
        if(modalImages.length > 0) {
            const modalObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if(img.dataset.src) {
                            img.src = img.dataset.src;
                            img.onload = () => { img.style.opacity = 1; };
                            observer.unobserve(img);
                        }
                    }
                });
            }, { root: overlay, rootMargin: "50px" });
            
            modalImages.forEach(img => modalObserver.observe(img));
        }

        // --- RE-BIND NOS MINI CARDS (CLIQUES DENTRO DO MODAL) ---
        const miniCards = overlay.querySelectorAll('.gold-framebox');
        miniCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                const img = card.querySelector('img');
                
                // Verifica se é um card de história ou produto
                if (card.dataset.description && card.classList.contains('story-card')) {
                    // Modo História (Atelier)
                    openStoryMode(img.dataset.src || img.src, card.dataset.title, card.dataset.description);
                } else {
                    // Modo Produto (Zoom simples)
                    if(img) openImageViewer(img.dataset.src || img.src);
                }
            });
        });

        // Função de Fechar
        const close = () => {
            overlay.classList.remove('active');
            body.style.overflow = '';
            setTimeout(() => { 
                if(overlay.parentNode) overlay.parentNode.removeChild(overlay); 
            }, 400);
        };

        overlay.querySelector('.close-expansion').addEventListener('click', close);
        overlay.addEventListener('click', (e) => { 
            if (e.target === overlay || e.target.classList.contains('expansion-content')) close(); 
        });
        
        // Fechar com ESC
        const closeOnEsc = (e) => {
            if (e.key === 'Escape' && !document.querySelector('.image-viewer-overlay.active')) {
                close();
                document.removeEventListener('keydown', closeOnEsc);
            }
        };
        document.addEventListener('keydown', closeOnEsc);
    }


    // =========================================================
    // 6. MODAIS DE DETALHE (ZOOM E HISTÓRIA)
    // =========================================================
    
    // Zoom Simples (Para produtos)
    function openImageViewer(imageSrc) {
        const content = `<img src="${imageSrc}" class="image-viewer-content" style="max-height:90vh; max-width:90%; border:1px solid var(--color-gold-dark); box-shadow: 0 0 30px rgba(0,0,0,0.8);">`;
        createViewerOverlay(content);
    }

    // Modo História (Foto + Texto lado a lado)
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

    // Cria o Overlay Genérico
    function createViewerOverlay(innerContent) {
        const viewer = document.createElement('div');
        viewer.className = 'image-viewer-overlay';
        viewer.innerHTML = `
            <button class="close-viewer" aria-label="Fechar" style="position:absolute; top:20px; right:30px; color:#fff; font-size:2rem; background:none; border:none; cursor:pointer; z-index:3001;">&times;</button>
            ${innerContent}
        `;
        body.appendChild(viewer);
        requestAnimationFrame(() => viewer.classList.add('active'));

        const closeViewer = () => {
            viewer.classList.remove('active');
            setTimeout(() => { if(viewer.parentNode) viewer.parentNode.removeChild(viewer); }, 300);
        };

        viewer.querySelector('.close-viewer').addEventListener('click', closeViewer);
        viewer.addEventListener('click', (e) => { if(e.target === viewer) closeViewer(); });
        
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
