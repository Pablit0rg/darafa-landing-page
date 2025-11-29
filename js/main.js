/**
 * DaRafa Acessórios - Main Script (Versão Mestre)
 * * FUNCIONALIDADES:
 * 1. Catálogo Data-Driven (Baseado em Dados)
 * 2. Imagens Uniformizadas (4 Peças)
 * 3. Scroll Reveal / Lazy Loading (Aparece ao descer)
 * 4. Filtros de Categoria (Bônus)
 * 5. Menu Mobile, Portais e Modais
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 0. CONFIGURAÇÕES & DADOS
    // =========================================================
    const INSTAGRAM_TOKEN = ''; 
    const POSTS_LIMIT = 50; 

    // O "Banco de Dados" com a imagem padronizada (darafa-catalogo.jpg)
    const productsData = [
        {
            id: 1,
            category: 'nose-cuff',
            title: 'Nose Cuff Spirals',
            description: 'Design espiral em arame dourado, ajuste anatômico sem furos.',
            image: 'assets/images/darafa-catalogo.jpg'
        },
        {
            id: 2,
            category: 'brincos',
            title: 'Brinco Solar',
            description: 'Peça statement inspirada no sol, leve e marcante.',
            image: 'assets/images/darafa-catalogo.jpg'
        },
        {
            id: 3,
            category: 'body',
            title: 'Body Chain Lux',
            description: 'Corrente corporal para realçar a beleza natural.',
            image: 'assets/images/darafa-catalogo.jpg'
        },
        {
            id: 4,
            category: 'aneis',
            title: 'Anel Flow',
            description: 'Adapta-se a qualquer dedo com conforto e movimento.',
            image: 'assets/images/darafa-catalogo.jpg'
        },
        {
            id: 5,
            category: 'aneis',
            title: 'Anel Regulável Flow',
            description: 'Design orgânico que abraça o dedo com elegância.',
            image: 'assets/images/darafa-catalogo.jpg'
        },
        {
            id: 6,
            category: 'colar',
            title: 'Choker Minimal',
            description: 'Aro rígido dourado, elegância instantânea.',
            image: 'assets/images/darafa-catalogo.jpg'
        },
        {
            id: 7,
            category: 'nose-cuff',
            title: 'Nose Cuff Duplo',
            description: 'Duas voltas de arame para destaque extra.',
            image: 'assets/images/darafa-catalogo.jpg'
        },
        {
            id: 8,
            category: 'brincos',
            title: 'Maxi Brinco',
            description: 'Para quem não tem medo de brilhar.',
            image: 'assets/images/darafa-catalogo.jpg'
        }
        // Adicione mais itens aqui copiando o bloco acima...
    ];


    // =========================================================
    // 1. INICIALIZAÇÃO DO CATÁLOGO
    // =========================================================
    const galleryContainer = document.querySelector('#gallery-door .gallery-5-cols');
    
    if (galleryContainer) {
        initCatalog();
        initFilters(); // Inicia os filtros também
    }

    async function initCatalog() {
        if (INSTAGRAM_TOKEN) {
            try {
                await fetchInstagramPosts();
            } catch (error) {
                console.warn("Instagram offline, usando catálogo local.");
                renderLocalCatalog(productsData);
            }
        } else {
            renderLocalCatalog(productsData);
        }
        
        // CRUCIAL: Chama o observador APÓS criar os elementos para o efeito funcionar
        initLazyObserver();
    }

    // --- RENDERIZADOR (Gera o HTML) ---
    function renderLocalCatalog(items) {
        if (!galleryContainer) return;
        
        // Montamos uma string única para performance
        let fullHTML = '';
        
        items.forEach(item => {
            // Nota: style="opacity: 0" garante que comece invisível para o efeito acontecer
            fullHTML += `
                <div class="gold-framebox" data-category="${item.category}" data-title="${item.title}" data-description="${item.description}">
                    <img 
                        class="lazy-image" 
                        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                        data-src="${item.image}" 
                        alt="${item.title}"
                        style="transition: opacity 0.8s ease; opacity: 0;"
                    >
                    <div class="card-info-bar">
                        <h3 class="info-title">${item.title}</h3>
                        <p class="info-desc">${item.description}</p>
                    </div>
                </div>
            `;
        });
        
        galleryContainer.innerHTML = fullHTML;
    }


    // =========================================================
    // 2. A MÁGICA: SCROLL REVEAL (LAZY LOADER)
    // =========================================================
    function initLazyObserver() {
        const lazyImages = document.querySelectorAll('.lazy-image');

        // Configura o observador
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // 1. Troca o src falso pela imagem real
                    if(img.dataset.src) {
                        img.src = img.dataset.src;
                    }

                    // 2. Quando carregar, aplica a opacidade 1 (Efeito Fade In)
                    img.onload = () => {
                        img.style.opacity = 1;
                        img.classList.add('loaded');
                    };
                    
                    // 3. Para de observar essa imagem (já carregou)
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: "0px 0px -50px 0px", // Só carrega quando entrar um pouco na tela
            threshold: 0.1
        });

        // Aplica o observador em todas as imagens
        lazyImages.forEach(image => imageObserver.observe(image));
    }


    // =========================================================
    // 3. LÓGICA DE FILTROS (BÔNUS)
    // =========================================================
    function initFilters() {
        // Usa delegação de eventos no body (pois os botões podem estar dentro do Modal clonado)
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const button = e.target;
                const filterValue = button.dataset.filter;
                
                // 1. Visual do Botão
                const container = button.closest('.catalog-filters');
                if(container) {
                    container.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                }

                // 2. Filtragem dos Dados
                let filteredData;
                if (filterValue === 'all') {
                    filteredData = productsData;
                } else {
                    filteredData = productsData.filter(item => item.category === filterValue);
                }

                // 3. Atualiza a Galeria (Procura a galeria mais próxima do botão clicado)
                const modalContent = button.closest('.expansion-content'); // Se estiver no modal
                const targetGallery = modalContent 
                    ? modalContent.querySelector('.gallery-5-cols') 
                    : document.querySelector('#gallery-door .gallery-5-cols'); // Se estiver na home
                
                if(targetGallery) {
                    // Renderiza apenas os filtrados
                    let html = '';
                    filteredData.forEach(item => {
                        html += `
                            <div class="gold-framebox" data-category="${item.category}">
                                <img class="lazy-image" src="${item.image}" alt="${item.title}" style="opacity: 0; transition: opacity 0.5s ease;">
                                <div class="card-info-bar">
                                    <h3 class="info-title">${item.title}</h3>
                                    <p class="info-desc">${item.description}</p>
                                </div>
                            </div>
                        `;
                    });
                    targetGallery.innerHTML = html;
                    
                    // Reativa o efeito de aparecer suavemente para os novos itens
                    const newImages = targetGallery.querySelectorAll('.lazy-image');
                    setTimeout(() => {
                        newImages.forEach(img => img.style.opacity = 1);
                    }, 100);
                }
            }
        });
    }


    // =========================================================
    // 4. MENU MOBILE & UX
    // =========================================================
    const navbarToggler = document.getElementById('navbar-toggler');
    const navbarMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('.navbar-link');

    function toggleMenu() {
        if(navbarMenu && navbarToggler) {
            navbarMenu.classList.toggle('active');
            navbarToggler.classList.toggle('is-active');
        }
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

    document.addEventListener('click', (e) => {
        if (navbarMenu && navbarMenu.classList.contains('active') && 
            !navbarMenu.contains(e.target) && 
            !navbarToggler.contains(e.target)) {
            toggleMenu();
        }
    });

    // Botão Voltar ao Topo
    const backToTopBtn = document.getElementById('backToTop');
    if(backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backToTopBtn.classList.add('visible');
            else backToTopBtn.classList.remove('visible');
        });
    }


    // =========================================================
    // 5. SISTEMA DE PORTAL & MODAIS
    // =========================================================
    const doors = document.querySelectorAll('.big-card-wrapper:not(.no-expand)');
    const body = document.body;

    doors.forEach(door => {
        door.addEventListener('click', function(e) {
            // Evita abrir se clicou direto no botão de filtro dentro do card (caso raro)
            if(e.target.classList.contains('filter-btn')) return;

            e.preventDefault();
            const hiddenContentDiv = this.querySelector('.hidden-content');
            
            if (hiddenContentDiv) {
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
        body.style.overflow = 'hidden'; 

        requestAnimationFrame(() => { overlay.classList.add('active'); });

        // --- REATIVAR O EFEITO LAZY LOAD DENTRO DO MODAL ---
        // Como criamos novo HTML, precisamos avisar o observador
        const modalImages = overlay.querySelectorAll('.lazy-image');
        if(modalImages.length > 0) {
            const modalObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if(img.dataset.src) img.src = img.dataset.src;
                        img.onload = () => { img.style.opacity = 1; };
                        observer.unobserve(img);
                    }
                });
            }, { root: overlay, rootMargin: "50px" });
            
            modalImages.forEach(img => modalObserver.observe(img));
        }

        // --- CLIQUES NOS MINI CARDS (ZOOM / HISTÓRIA) ---
        // Usamos delegação de evento dentro do overlay para garantir funcionamento
        overlay.addEventListener('click', (e) => {
            const card = e.target.closest('.gold-framebox');
            if (card && overlay.contains(card)) {
                e.stopPropagation();
                const img = card.querySelector('img');
                
                if (card.dataset.description && card.classList.contains('story-card')) {
                    openStoryMode(img.dataset.src || img.src, card.dataset.title, card.dataset.description);
                } else {
                    if(img) openImageViewer(img.dataset.src || img.src);
                }
            }
        });

        // Fechar Modal
        const close = () => {
            overlay.classList.remove('active');
            body.style.overflow = '';
            setTimeout(() => { 
                if(overlay.parentNode) overlay.parentNode.removeChild(overlay); 
            }, 400);
        };

        overlay.querySelector('.close-expansion').addEventListener('click', close);
        
        // Clicar fora fecha (mas ignora cliques no conteúdo)
        overlay.addEventListener('click', (e) => { 
            if (e.target === overlay || e.target.classList.contains('expansion-content')) close(); 
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
    // 6. VISUALIZADORES (ZOOM)
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
