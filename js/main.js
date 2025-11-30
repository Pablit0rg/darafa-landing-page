/**
 * DaRafa Acessórios - Main Script (High Performance Edition)
 * * OTIMIZAÇÕES APLICADAS:
 * 1. Throttle no Scroll (Economia de CPU)
 * 2. Passive Listeners (Scroll liso no mobile)
 * 3. Observer Singleton (Economia de Memória RAM)
 * 4. Smart Preload (Carregamento antecipado no hover)
 * 5. Renderização Atômica (Menos reflow no navegador)
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 0. DADOS & CONFIGURAÇÕES
    // =========================================================
    const INSTAGRAM_TOKEN = ''; 
    const POSTS_LIMIT = 50; 

    // LISTA MANUAL (Core)
    const productsData = [
        { id: 1, category: 'nose-cuff', title: 'Nose Cuff Spirals', description: 'Design espiral em arame dourado, ajuste anatômico sem furos.', image: 'assets/images/darafa-catalogo.jpg' },
        { id: 2, category: 'brincos', title: 'Brinco Solar', description: 'Peça statement inspirada no sol, leve e marcante.', image: 'assets/images/darafa-catalogo.jpg' },
        { id: 3, category: 'body', title: 'Body Chain Lux', description: 'Corrente corporal para realçar a beleza natural.', image: 'assets/images/darafa-catalogo.jpg' },
        { id: 4, category: 'aneis', title: 'Anel Flow', description: 'Adapta-se a qualquer dedo com conforto e movimento.', image: 'assets/images/darafa-catalogo.jpg' },
        { id: 5, category: 'aneis', title: 'Anel Regulável Flow', description: 'Design orgânico que abraça o dedo com elegância.', image: 'assets/images/darafa-catalogo.jpg' },
        { id: 6, category: 'colar', title: 'Choker Minimal', description: 'Aro rígido dourado, elegância instantânea.', image: 'assets/images/darafa-catalogo.jpg' },
        { id: 7, category: 'nose-cuff', title: 'Nose Cuff Duplo', description: 'Duas voltas de arame para destaque extra.', image: 'assets/images/darafa-catalogo.jpg' },
        { id: 8, category: 'brincos', title: 'Maxi Brinco', description: 'Para quem não tem medo de brilhar.', image: 'assets/images/darafa-catalogo.jpg' }
    ];

    // COMPLETADOR DE LISTA (GERA ATÉ 50 ITENS)
    const categoriasExemplo = ['nose-cuff', 'brincos', 'aneis', 'colar'];
    for (let i = productsData.length + 1; i <= 50; i++) {
        const cat = categoriasExemplo[i % categoriasExemplo.length];
        productsData.push({
            id: i,
            category: cat,
            title: `Joia Exclusiva ${i}`,
            description: 'Peça artesanal feita à mão com design exclusivo DaRafa.',
            image: 'assets/images/darafa-catalogo.jpg'
        });
    }


    // =========================================================
    // 1. OBSERVER SINGLETON (PERFORMANCE DE MEMÓRIA)
    // Criamos UM vigia para o site todo, em vez de vários.
    // =========================================================
    const globalImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Troca src falso pelo real
                if(img.dataset.src) {
                    img.src = img.dataset.src;
                }

                // Efeito Fade-In quando carregar
                img.onload = () => {
                    img.style.opacity = 1;
                    img.classList.add('loaded');
                };
                
                // Para de vigiar esta imagem (missão cumprida)
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: "100px 0px", // Carrega 100px antes de aparecer
        threshold: 0.01
    });


    // =========================================================
    // 2. INICIALIZAÇÃO
    // =========================================================
    const galleryContainer = document.querySelector('#gallery-door .gallery-5-cols');
    
    if (galleryContainer) {
        initCatalog();
        initFilters();
    }

    async function initCatalog() {
        if (INSTAGRAM_TOKEN) {
            try {
                await fetchInstagramPosts();
            } catch (error) {
                renderLocalCatalog(productsData);
            }
        } else {
            renderLocalCatalog(productsData);
        }
    }

    // --- RENDERIZADOR OTIMIZADO ---
    function renderLocalCatalog(items) {
        if (!galleryContainer) return;
        
        // Constrói HTML na memória (mais rápido que tocar no DOM várias vezes)
        let fullHTML = '';
        
        items.forEach(item => {
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
        
        // Injeção Atômica (Uma única atualização de tela)
        galleryContainer.innerHTML = fullHTML;
        
        // Ativa os observadores e o Preload Inteligente nos novos elementos
        attachObserversAndPreload(galleryContainer);
    }

    // Função auxiliar para ligar o Observer e o Preload
    function attachObserversAndPreload(container) {
        const images = container.querySelectorAll('.lazy-image');
        images.forEach(img => globalImageObserver.observe(img));

        // SMART PRELOAD: Baixa a imagem no hover do mouse
        const cards = container.querySelectorAll('.gold-framebox');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const img = card.querySelector('img');
                const src = img.dataset.src || img.src;
                // Cria um objeto de imagem fantasma para forçar o cache do navegador
                const preload = new Image();
                preload.src = src;
            }, { once: true }); // Só precisa fazer isso na primeira vez que passa o mouse
        });
    }


    // =========================================================
    // 3. FILTROS
    // =========================================================
    function initFilters() {
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const button = e.target;
                const filterValue = button.dataset.filter;
                
                // UX: Troca classe active
                const container = button.closest('.catalog-filters');
                if(container) {
                    container.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                }

                // Lógica de Dados
                let filteredData;
                if (filterValue === 'all') {
                    filteredData = productsData;
                } else {
                    filteredData = productsData.filter(item => item.category === filterValue);
                }

                // Renderização no Alvo
                const modalContent = button.closest('.expansion-content');
                const targetGallery = modalContent 
                    ? modalContent.querySelector('.gallery-5-cols') 
                    : document.querySelector('#gallery-door .gallery-5-cols');
                
                if(targetGallery) {
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
                    
                    // Reativa observadores para os itens filtrados
                    attachObserversAndPreload(targetGallery);
                }
            }
        });
    }


    // =========================================================
    // 4. UX: MENU MOBILE & BOTÃO TOPO (THROTTLED)
    // =========================================================
    
    // THROTTLE FUNCTION (O Limitador de Velocidade)
    // Garante que uma função rode no máximo 1 vez a cada X milissegundos
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Botão Voltar ao Topo com Throttle + Passive Listener
    const backToTopBtn = document.getElementById('backToTop');
    if(backToTopBtn) {
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 300) backToTopBtn.classList.add('visible');
            else backToTopBtn.classList.remove('visible');
        }, 100), { passive: true }); // { passive: true } deixa o scroll liso no mobile
    }

    // Menu Mobile
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
        navbarToggler.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => { if (navbarMenu.classList.contains('active')) toggleMenu(); });
    });

    document.addEventListener('click', (e) => {
        if (navbarMenu && navbarMenu.classList.contains('active') && 
            !navbarMenu.contains(e.target) && !navbarToggler.contains(e.target)) {
            toggleMenu();
        }
    });


    // =========================================================
    // 5. SISTEMA DE PORTAL & MODAIS
    // =========================================================
    const doors = document.querySelectorAll('.big-card-wrapper:not(.no-expand)');
    const body = document.body;

    doors.forEach(door => {
        door.addEventListener('click', function(e) {
            if(e.target.classList.contains('filter-btn')) return;
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
        overlay.innerHTML = `<button class="close-expansion">&times;</button><div class="expansion-content">${contentHTML}</div>`;
        body.appendChild(overlay);
        body.style.overflow = 'hidden'; 
        requestAnimationFrame(() => { overlay.classList.add('active'); });

        // Reativa observadores DENTRO do Modal (pois é HTML novo)
        // Usamos o mesmo observer global (Singleton)
        const modalContainer = overlay.querySelector('.expansion-content');
        if(modalContainer) attachObserversAndPreload(modalContainer);

        // Delegação de cliques para Zoom/História
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

        const close = () => {
            overlay.classList.remove('active');
            body.style.overflow = '';
            setTimeout(() => { if(overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 400);
        };

        overlay.querySelector('.close-expansion').addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay || e.target.classList.contains('expansion-content')) close(); });
        
        const closeOnEsc = (e) => {
            if (e.key === 'Escape' && !document.querySelector('.image-viewer-overlay.active')) {
                close();
                document.removeEventListener('keydown', closeOnEsc);
            }
        };
        document.addEventListener('keydown', closeOnEsc);
    }

    // VIEWER E STORY MODE
    function openImageViewer(imageSrc) {
        createViewerOverlay(`<img src="${imageSrc}" class="image-viewer-content" style="max-height:90vh; max-width:90%; border:1px solid var(--color-gold-dark); box-shadow: 0 0 30px rgba(0,0,0,0.8);">`);
    }

    function openStoryMode(imageSrc, title, description) {
        createViewerOverlay(`
            <div class="story-viewer-content">
                <div class="story-image-col"><img src="${imageSrc}" alt="${title}"></div>
                <div class="story-text-col"><h3 class="story-title">${title}</h3><p class="story-desc">${description}</p></div>
            </div>
        `);
    }

    function createViewerOverlay(innerContent) {
        const viewer = document.createElement('div');
        viewer.className = 'image-viewer-overlay';
        viewer.innerHTML = `<button class="close-viewer" style="position:absolute; top:20px; right:30px; color:#fff; font-size:2rem; background:none; border:none; cursor:pointer; z-index:3001;">&times;</button>${innerContent}`;
        body.appendChild(viewer);
        requestAnimationFrame(() => viewer.classList.add('active'));

        const closeViewer = () => {
            viewer.classList.remove('active');
            setTimeout(() => { if(viewer.parentNode) viewer.parentNode.removeChild(viewer); }, 300);
        };
        viewer.querySelector('.close-viewer').addEventListener('click', closeViewer);
        viewer.addEventListener('click', (e) => { if(e.target === viewer) closeViewer(); });
        const closeViewerOnEsc = (e) => {
            if (e.key === 'Escape') { closeViewer(); document.removeEventListener('keydown', closeViewerOnEsc); }
        };
        document.addEventListener('keydown', closeViewerOnEsc);
    }
});
