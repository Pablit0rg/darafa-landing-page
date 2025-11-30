/**
 * DaRafa Acessórios - Main Script (Versão com Wishlist)
 * * OTIMIZAÇÕES APLICADAS:
 * 1. Lista de Desejos (Wishlist) com LocalStorage (NOVO!)
 * 2. Filtro "Favoritos" Dinâmico (NOVO!)
 * 3. Busca em Tempo Real
 * 4. Performance (Throttle, Passive, Observer)
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 0. DADOS & CONFIGURAÇÕES
    // =========================================================
    const INSTAGRAM_TOKEN = ''; 
    const POSTS_LIMIT = 50; 
    
    // Carrega favoritos salvos ou cria lista vazia
    let wishlist = JSON.parse(localStorage.getItem('darafa_wishlist')) || [];

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

    // COMPLETADOR DE LISTA
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
    // 1. OBSERVER SINGLETON
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
        initSearchBar(); 
        injectWishlistStyles(); // Estilos do coração via JS
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

    // --- RENDERIZADOR (Agora com Coração) ---
    function renderLocalCatalog(items) {
        if (!galleryContainer) return;
        
        if (items.length === 0) {
            galleryContainer.innerHTML = '<p style="color:#241000; text-align:center; width:100%; grid-column: 1/-1; padding: 20px; font-weight:600;">Nenhuma joia encontrada.</p>';
            return;
        }

        let fullHTML = '';
        items.forEach(item => {
            // Verifica se está na wishlist para pintar o coração
            const isFav = wishlist.includes(item.id) ? 'active' : '';
            
            fullHTML += `
                <div class="gold-framebox" data-id="${item.id}" data-category="${item.category}" data-title="${item.title}" data-description="${item.description}">
                    
                    <button class="wishlist-btn ${isFav}" aria-label="Favoritar" onclick="event.stopPropagation()">
                        ♥
                    </button>

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
        attachWishlistEvents(galleryContainer); // Liga os cliques nos corações
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
    // 3. WISHLIST LÓGICA & ESTILOS (JS PURO)
    // =========================================================
    
    // Injeta CSS do coração dinamicamente (sem mexer no CSS externo)
    function injectWishlistStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .wishlist-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(36, 16, 0, 0.6);
                border: none;
                color: #fff;
                font-size: 1.2rem;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                cursor: pointer;
                z-index: 10;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex;
                align-items: center;
                justify-content: center;
                padding-top: 2px;
            }
            .wishlist-btn:hover {
                background: #241000;
                transform: scale(1.1);
            }
            .wishlist-btn.active {
                color: #D00000; /* Vermelho Chic */
                background: #fff;
                box-shadow: 0 0 10px rgba(208,0,0,0.5);
            }
        `;
        document.head.appendChild(style);
    }

    function attachWishlistEvents(container) {
        // Delegação de evento dentro do container (para pegar cliques novos)
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('wishlist-btn')) {
                e.stopPropagation(); // Não abre o modal
                const btn = e.target;
                const card = btn.closest('.gold-framebox');
                const id = parseInt(card.dataset.id);

                toggleWishlist(id, btn);
            }
        });
    }

    function toggleWishlist(id, btnElement) {
        const index = wishlist.indexOf(id);
        
        if (index === -1) {
            // Adiciona
            wishlist.push(id);
            btnElement.classList.add('active');
            // Animaçãozinha de pulso
            btnElement.style.transform = "scale(1.4)";
            setTimeout(() => btnElement.style.transform = "scale(1)", 200);
        } else {
            // Remove
            wishlist.splice(index, 1);
            btnElement.classList.remove('active');
        }

        // Salva no navegador
        localStorage.setItem('darafa_wishlist', JSON.stringify(wishlist));
        
        // Se estivermos vendo a aba "Favoritos", remove o item da tela instantaneamente
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter && activeFilter.dataset.filter === 'favorites') {
            // Re-renderiza a lista de favoritos
            const filtered = productsData.filter(item => wishlist.includes(item.id));
            // Acha o container pai (Modal ou Home)
            const parentContainer = btnElement.closest('.gallery-5-cols');
            // Pequeno hack: chama o renderizador direto naquele container
            // Mas para simplificar, simulamos um clique no filtro de novo
            if(parentContainer) {
               // Renderiza manualmente apenas no container atual para não piscar tudo
               if(filtered.length === 0) {
                   parentContainer.innerHTML = '<p style="color:#241000; text-align:center; width:100%; grid-column: 1/-1; padding:20px;">Você ainda não tem favoritos.</p>';
               } else {
                   // Remove apenas o card da tela (mais elegante)
                   const card = btnElement.closest('.gold-framebox');
                   card.style.opacity = '0';
                   setTimeout(() => card.remove(), 300);
               }
            }
        }
    }


    // =========================================================
    // 4. BUSCA EM TEMPO REAL
    // =========================================================
    function initSearchBar() {
        const filterContainer = document.querySelector('.catalog-filters');
        if (!filterContainer) return;

        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = "width:100%; display:flex; justify-content:center; margin-bottom:20px;";

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'js-search-input';
        input.placeholder = 'Buscar joia...';
        input.style.cssText = "padding:12px 25px; width:100%; max-width:400px; border-radius:50px; border:2px solid #241000; background:rgba(255,255,255,0.9); color:#241000; font-size:1rem; outline:none; box-shadow:0 4px 10px rgba(36,16,0,0.1); transition:all 0.3s ease;";

        input.addEventListener('focus', () => input.style.borderColor = '#CD4A00');
        input.addEventListener('blur', () => input.style.borderColor = '#241000');

        searchContainer.appendChild(input);
        filterContainer.prepend(searchContainer);

        input.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            if (term.length > 0) document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));

            const filtered = productsData.filter(item => 
                item.title.toLowerCase().includes(term) || 
                item.description.toLowerCase().includes(term) ||
                item.category.toLowerCase().includes(term)
            );

            const parentModal = input.closest('.expansion-content');
            const targetGallery = parentModal ? parentModal.querySelector('.gallery-5-cols') : document.querySelector('#gallery-door .gallery-5-cols');

            if (targetGallery) {
                renderLocalCatalogWrapper(targetGallery, filtered);
            }
        });
    }

    // Wrapper para reutilizar a renderização em elementos específicos
    function renderLocalCatalogWrapper(container, data) {
        if (!container) return;
        
        if (data.length === 0) {
            container.innerHTML = '<p style="color:#241000; text-align:center; width:100%; grid-column: 1/-1; padding:20px;">Nada encontrado.</p>';
            return;
        }

        let fullHTML = '';
        data.forEach(item => {
            const isFav = wishlist.includes(item.id) ? 'active' : '';
            fullHTML += `
                <div class="gold-framebox" data-id="${item.id}" data-category="${item.category}">
                    <button class="wishlist-btn ${isFav}" aria-label="Favoritar" onclick="event.stopPropagation()">♥</button>
                    <img class="lazy-image" src="${item.image}" alt="${item.title}" style="opacity: 1;">
                    <div class="card-info-bar">
                        <h3 class="info-title">${item.title}</h3>
                        <p class="info-desc">${item.description}</p>
                    </div>
                </div>
            `;
        });
        container.innerHTML = fullHTML;
        attachWishlistEvents(container); // Reativa corações nos filtrados
    }


    // =========================================================
    // 5. FILTROS (Com Botão Favoritos Extra)
    // =========================================================
    function initFilters() {
        // Injeta o botão "Favoritos" dinamicamente se não existir
        const filterContainers = document.querySelectorAll('.catalog-filters');
        filterContainers.forEach(container => {
            if(!container.querySelector('[data-filter="favorites"]')) {
                const favBtn = document.createElement('button');
                favBtn.className = 'filter-btn';
                favBtn.dataset.filter = 'favorites';
                favBtn.innerText = '♥ Favoritos';
                favBtn.style.color = '#D00000'; // Destaque vermelho
                favBtn.style.borderColor = '#D00000';
                container.appendChild(favBtn);
            }
        });

        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const button = e.target;
                const filterValue = button.dataset.filter;
                
                const searchInput = document.getElementById('js-search-input');
                if (searchInput) searchInput.value = '';

                const container = button.closest('.catalog-filters');
                if(container) {
                    container.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                }

                let filteredData;
                
                // Lógica Especial para Favoritos
                if (filterValue === 'favorites') {
                    filteredData = productsData.filter(item => wishlist.includes(item.id));
                } else if (filterValue === 'all') {
                    filteredData = productsData;
                } else {
                    filteredData = productsData.filter(item => item.category === filterValue);
                }

                const modalContent = button.closest('.expansion-content');
                const targetGallery = modalContent ? modalContent.querySelector('.gallery-5-cols') : document.querySelector('#gallery-door .gallery-5-cols');
                
                if(targetGallery) {
                    renderLocalCatalogWrapper(targetGallery, filteredData);
                }
            }
        });
    }


    // =========================================================
    // 6. UX & PORTAIS (Mantido)
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

    if(navbarToggler) navbarToggler.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
    navLinks.forEach(link => link.addEventListener('click', () => { if (navbarMenu.classList.contains('active')) toggleMenu(); }));
    document.addEventListener('click', (e) => {
        if (navbarMenu && navbarMenu.classList.contains('active') && !navbarMenu.contains(e.target) && !navbarToggler.contains(e.target)) toggleMenu();
    });

    // PORTAL
    const doors = document.querySelectorAll('.big-card-wrapper:not(.no-expand)');
    const body = document.body;

    doors.forEach(door => {
        door.addEventListener('click', function(e) {
            // Ignora cliques em elementos interativos dentro do card
            if(e.target.classList.contains('filter-btn') || 
               e.target.id === 'js-search-input' || 
               e.target.classList.contains('wishlist-btn')) return;
               
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

        // Remove input antigo duplicado e reinjeta busca + favoritos no modal
        const oldInput = overlay.querySelector('#js-search-input');
        if(oldInput && oldInput.parentNode) oldInput.parentNode.remove();
        
        // Re-inject search logic into modal (simplified for brevity, re-using logic would be ideal)
        // Por hora, apenas chamamos initSearchBar novamente que ele acha o container certo
        // Mas como initSearchBar busca por classe, pode pegar o errado.
        // Vamos forçar a injeção manual aqui para garantir:
        const modalFilters = overlay.querySelector('.catalog-filters');
        if(modalFilters) {
             const searchContainer = document.createElement('div');
             searchContainer.style.cssText = "width:100%; display:flex; justify-content:center; margin-bottom:20px;";
             const input = document.createElement('input');
             input.placeholder = 'Buscar joia...';
             input.style.cssText = "padding:12px 25px; width:100%; max-width:400px; border-radius:50px; border:2px solid #241000; background:rgba(255,255,255,0.9); color:#241000; font-size:1rem; outline:none;";
             input.addEventListener('input', (e) => {
                 const term = e.target.value.toLowerCase();
                 const filtered = productsData.filter(item => item.title.toLowerCase().includes(term) || item.category.includes(term));
                 const targetGallery = overlay.querySelector('.gallery-5-cols');
                 renderLocalCatalogWrapper(targetGallery, filtered);
             });
             searchContainer.appendChild(input);
             modalFilters.prepend(searchContainer);

             // Injeta botão favoritos no modal também
             if(!modalFilters.querySelector('[data-filter="favorites"]')) {
                const favBtn = document.createElement('button');
                favBtn.className = 'filter-btn';
                favBtn.dataset.filter = 'favorites';
                favBtn.innerText = '♥ Favoritos';
                favBtn.style.color = '#D00000';
                favBtn.style.borderColor = '#D00000';
                modalFilters.appendChild(favBtn);
             }
        }

        // Reativa Lazy Load
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
        
        // Liga eventos de wishlist no modal
        const modalGallery = overlay.querySelector('.gallery-5-cols');
        if(modalGallery) attachWishlistEvents(modalGallery);

        // Cliques gerais
        overlay.addEventListener('click', (e) => {
            // Se clicou no coração, já foi tratado pelo attachWishlistEvents
            if (e.target.classList.contains('wishlist-btn')) return;

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
        const closeOnEsc = (e) => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', closeOnEsc); } };
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
        const closeViewerOnEsc = (e) => { if (e.key === 'Escape') { closeViewer(); document.removeEventListener('keydown', closeViewerOnEsc); } };
        document.addEventListener('keydown', closeViewerOnEsc);
    }
});
