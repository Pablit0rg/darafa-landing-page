/**
 * DaRafa Acessórios - Main Script (Versão com Busca em Tempo Real)
 * * OTIMIZAÇÕES APLICADAS:
 * 1. Busca em Tempo Real (NOVO!)
 * 2. Throttle no Scroll
 * 3. Passive Listeners
 * 4. Observer Singleton
 * 5. Smart Preload
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
    // 1. OBSERVER SINGLETON (PERFORMANCE)
    // =========================================================
    const globalImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if(img.dataset.src) img.src = img.dataset.src;
                img.onload = () => { img.style.opacity = 1; img.classList.add('loaded'); };
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "100px 0px", threshold: 0.01 });


    // =========================================================
    // 2. INICIALIZAÇÃO
    // =========================================================
    const galleryContainer = document.querySelector('#gallery-door .gallery-5-cols');
    
    if (galleryContainer) {
        initCatalog();
        initFilters();
        initSearchBar(); // Inicializa a nova busca
    }

    async function initCatalog() {
        if (INSTAGRAM_TOKEN) {
            try {
                await fetchInstagramPosts();
            } catch (error) { renderLocalCatalog(productsData); }
        } else {
            renderLocalCatalog(productsData);
        }
    }

    function renderLocalCatalog(items) {
        if (!galleryContainer) return;
        
        if (items.length === 0) {
            galleryContainer.innerHTML = '<p style="color:#241000; text-align:center; width:100%; grid-column: 1/-1;">Nenhuma joia encontrada com este termo.</p>';
            return;
        }

        let fullHTML = '';
        items.forEach(item => {
            fullHTML += `
                <div class="gold-framebox" data-category="${item.category}" data-title="${item.title}" data-description="${item.description}">
                    <img class="lazy-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="${item.image}" alt="${item.title}" style="transition: opacity 0.8s ease; opacity: 0;">
                    <div class="card-info-bar">
                        <h3 class="info-title">${item.title}</h3>
                        <p class="info-desc">${item.description}</p>
                    </div>
                </div>
            `;
        });
        
        galleryContainer.innerHTML = fullHTML;
        attachObserversAndPreload(galleryContainer);
    }

    function attachObserversAndPreload(container) {
        const images = container.querySelectorAll('.lazy-image');
        images.forEach(img => globalImageObserver.observe(img));

        const cards = container.querySelectorAll('.gold-framebox');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const img = card.querySelector('img');
                const src = img.dataset.src || img.src;
                const preload = new Image();
                preload.src = src;
            }, { once: true });
        });
    }


    // =========================================================
    // 3. BUSCA EM TEMPO REAL (NOVA TAREFA)
    // =========================================================
    function initSearchBar() {
        // Encontra onde colocar a barra (dentro dos filtros ou antes)
        // Vamos colocar ANTES dos botões de filtro para ficar elegante
        const filterContainer = document.querySelector('.catalog-filters');
        if (!filterContainer) return;

        // 1. Criar o Elemento Input via JS (Sem mexer no HTML)
        const searchContainer = document.createElement('div');
        searchContainer.style.width = '100%';
        searchContainer.style.display = 'flex';
        searchContainer.style.justifyContent = 'center';
        searchContainer.style.marginBottom = '20px';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'js-search-input';
        input.placeholder = 'Buscar joia (ex: solar, anel)...';
        
        // 2. Estilização via JS para não quebrar CSS (Tema Honey)
        input.style.padding = '12px 25px';
        input.style.width = '100%';
        input.style.maxWidth = '400px';
        input.style.borderRadius = '50px';
        input.style.border = '2px solid #241000'; // Borda Chocolate
        input.style.backgroundColor = 'rgba(255,255,255,0.9)';
        input.style.color = '#241000';
        input.style.fontFamily = 'inherit';
        input.style.fontSize = '1rem';
        input.style.outline = 'none';
        input.style.boxShadow = '0 4px 10px rgba(36, 16, 0, 0.1)';
        input.style.transition = 'all 0.3s ease';

        // Efeito de Foco
        input.addEventListener('focus', () => {
            input.style.borderColor = '#CD4A00'; // Laranja ao focar
            input.style.boxShadow = '0 6px 15px rgba(205, 74, 0, 0.2)';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = '#241000';
            input.style.boxShadow = '0 4px 10px rgba(36, 16, 0, 0.1)';
        });

        searchContainer.appendChild(input);
        
        // Insere no topo do container de filtros
        filterContainer.prepend(searchContainer);

        // 3. Lógica de Filtragem
        input.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            
            // Reseta visual dos botões de filtro para "Todos" se estiver digitando
            if (term.length > 0) {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            }

            // Filtra o Array Original
            const filtered = productsData.filter(item => {
                return item.title.toLowerCase().includes(term) || 
                       item.description.toLowerCase().includes(term) ||
                       item.category.toLowerCase().includes(term);
            });

            // Encontra a galeria ativa (pode ser a do modal ou da home)
            // Como o input está dentro do .catalog-filters, usamos ele como ref
            const parentModal = input.closest('.expansion-content');
            const targetGallery = parentModal 
                ? parentModal.querySelector('.gallery-5-cols') 
                : document.querySelector('#gallery-door .gallery-5-cols');

            if (targetGallery) {
                // Renderiza
                let html = '';
                if (filtered.length === 0) {
                    html = '<p style="color:#241000; text-align:center; width:100%; grid-column: 1/-1; padding: 20px;">Nenhuma joia encontrada com este termo.</p>';
                } else {
                    filtered.forEach(item => {
                        html += `
                            <div class="gold-framebox" data-category="${item.category}">
                                <img class="lazy-image" src="${item.image}" alt="${item.title}" style="opacity: 1;">
                                <div class="card-info-bar">
                                    <h3 class="info-title">${item.title}</h3>
                                    <p class="info-desc">${item.description}</p>
                                </div>
                            </div>
                        `;
                    });
                }
                targetGallery.innerHTML = html;
                
                // Reativa cliques para zoom
                // Nota: O clique do modal usa delegação (event bubbling) configurada no initPortal, 
                // então não precisamos re-adicionar listeners aqui se usarmos o html injection correto.
            }
        });
    }


    // =========================================================
    // 4. FILTROS (INTEGRADO COM A BUSCA)
    // =========================================================
    function initFilters() {
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const button = e.target;
                const filterValue = button.dataset.filter;
                
                // 1. Limpa a busca se clicar num filtro (UX)
                const searchInput = document.getElementById('js-search-input');
                if (searchInput) searchInput.value = '';

                // 2. Visual do Botão
                const container = button.closest('.catalog-filters');
                if(container) {
                    container.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                }

                // 3. Filtragem dos Dados
                let filteredData;
                if (filterValue === 'all') {
                    filteredData = productsData;
                } else {
                    filteredData = productsData.filter(item => item.category === filterValue);
                }

                // 4. Renderização
                const modalContent = button.closest('.expansion-content');
                const targetGallery = modalContent 
                    ? modalContent.querySelector('.gallery-5-cols') 
                    : document.querySelector('#gallery-door .gallery-5-cols');
                
                if(targetGallery) {
                    renderLocalCatalog(filteredData);
                    // Como renderLocalCatalog busca o container global por ID, aqui forçamos o HTML no target correto se for modal
                    if(modalContent) {
                        let html = '';
                        filteredData.forEach(item => {
                            html += `
                                <div class="gold-framebox" data-category="${item.category}">
                                    <img class="lazy-image" src="${item.image}" alt="${item.title}" style="opacity: 1;"> 
                                    <div class="card-info-bar">
                                        <h3 class="info-title">${item.title}</h3>
                                        <p class="info-desc">${item.description}</p>
                                    </div>
                                </div>
                            `;
                        });
                        targetGallery.innerHTML = html;
                    }
                }
            }
        });
    }


    // =========================================================
    // 5. UX: MENU & SCROLL
    // =========================================================
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

    const backToTopBtn = document.getElementById('backToTop');
    if(backToTopBtn) {
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 300) backToTopBtn.classList.add('visible');
            else backToTopBtn.classList.remove('visible');
        }, 100), { passive: true });
    }

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
    // 6. PORTAL & MODAIS
    // =========================================================
    const doors = document.querySelectorAll('.big-card-wrapper:not(.no-expand)');
    const body = document.body;

    doors.forEach(door => {
        door.addEventListener('click', function(e) {
            if(e.target.classList.contains('filter-btn') || e.target.id === 'js-search-input') return;
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

        // IMPORTANTE: Reativar a busca no novo HTML clonado
        // Como o HTML foi clonado, o input perdeu os eventos. Precisamos re-inicializar a busca dentro do modal.
        // Removemos o input antigo clonado para evitar duplicidade de IDs e criamos um novo limpo.
        const oldInput = overlay.querySelector('#js-search-input');
        if(oldInput && oldInput.parentNode) {
            oldInput.parentNode.remove(); // Remove o container da busca clonado
        }
        // Recria a busca dentro do modal
        const modalFilters = overlay.querySelector('.catalog-filters');
        if(modalFilters) {
             // Reutilizamos a lógica de criação, mas apontando para este container específico
             const searchContainer = document.createElement('div');
             searchContainer.style.cssText = "width:100%; display:flex; justify-content:center; margin-bottom:20px;";
             
             const input = document.createElement('input');
             input.type = 'text';
             input.placeholder = 'Buscar joia...';
             input.style.cssText = "padding:12px 25px; width:100%; max-width:400px; border-radius:50px; border:2px solid #241000; background:rgba(255,255,255,0.9); color:#241000; font-size:1rem; outline:none;";
             
             input.addEventListener('input', (e) => {
                 const term = e.target.value.toLowerCase();
                 const filtered = productsData.filter(item => item.title.toLowerCase().includes(term) || item.description.toLowerCase().includes(term) || item.category.includes(term));
                 const targetGallery = overlay.querySelector('.gallery-5-cols');
                 if(targetGallery) {
                     let html = '';
                     if(filtered.length === 0) html = '<p style="text-align:center; width:100%;">Nada encontrado.</p>';
                     else filtered.forEach(item => {
                         html += `<div class="gold-framebox" data-category="${item.category}"><img class="lazy-image" src="${item.image}" style="opacity:1;"><div class="card-info-bar"><h3 class="info-title">${item.title}</h3><p class="info-desc">${item.description}</p></div></div>`;
                     });
                     targetGallery.innerHTML = html;
                 }
             });
             
             searchContainer.appendChild(input);
             modalFilters.prepend(searchContainer);
        }

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
