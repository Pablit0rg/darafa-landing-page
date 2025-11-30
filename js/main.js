/**
 * DaRafa Acessórios - Main Script (Versão com Infinite Scroll)
 * * OTIMIZAÇÕES APLICADAS:
 * 1. Infinite Scroll Real (Carregamento progressivo) - NOVO!
 * 2. Ordenação Dinâmica
 * 3. Gestos de Swipe
 * 4. Compartilhamento Nativo & Links
 * 5. Wishlist & Busca
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 0. DADOS & CONFIGURAÇÕES
    // =========================================================
    const INSTAGRAM_TOKEN = ''; 
    const POSTS_LIMIT = 50; 
    const ITEMS_PER_PAGE = 12; // Número de itens por lote
    
    let wishlist = JSON.parse(localStorage.getItem('darafa_wishlist')) || [];
    let currentSort = 'default';
    
    // Variáveis de Estado do Infinite Scroll
    let activeData = []; // Dados atualmente filtrados/ordenados
    let loadedCount = 0; // Quantos já foram mostrados
    let scrollSentinel;  // O elemento invisível que vigia o fim da página

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
    // 1. OBSERVERS (LAZY IMAGE & INFINITE SCROLL)
    // =========================================================
    
    // Observer para Imagens (Lazy Load)
    const globalImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if(img.dataset.src) img.src = img.dataset.src;
                img.onload = () => { img.style.opacity = 1; img.classList.add('loaded'); };
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "200px 0px", threshold: 0.01 });

    // Observer para Infinite Scroll (O Sentinela)
    const infiniteScrollObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadNextBatch();
        }
    }, { rootMargin: "200px" });


    // =========================================================
    // 2. INICIALIZAÇÃO
    // =========================================================
    const galleryContainer = document.querySelector('#gallery-door .gallery-5-cols');
    
    if (galleryContainer) {
        initCatalog();
        initFilters();
        initControls(); 
        injectDynamicStyles(); 
        setTimeout(loadStateFromURL, 100);
    }

    window.addEventListener('popstate', loadStateFromURL);

    function updateURL(param, value) {
        const url = new URL(window.location);
        if (value && value !== 'all') url.searchParams.set(param, value);
        else url.searchParams.delete(param);
        
        if (param === 'filtro') url.searchParams.delete('busca');
        if (param === 'busca') url.searchParams.delete('filtro');
        
        window.history.pushState({}, '', url);
    }

    function loadStateFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const filtro = urlParams.get('filtro');
        const busca = urlParams.get('busca');

        if (filtro) {
            const btn = document.querySelector(`.filter-btn[data-filter="${filtro}"]`);
            if (btn) btn.click();
        } else if (busca) {
            const input = document.getElementById('js-search-input');
            if (input) {
                input.value = busca;
                input.dispatchEvent(new Event('input'));
                document.getElementById('gallery-section').scrollIntoView({behavior: 'smooth'});
            }
        } else {
            const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
            if(allBtn) allBtn.click();
        }
    }

    async function initCatalog() {
        if (INSTAGRAM_TOKEN) {
            try {
                await fetchInstagramPosts();
            } catch (error) { 
                activeData = [...productsData]; // Inicializa dados ativos
                resetAndRender();
            }
        } else {
            activeData = [...productsData];
            resetAndRender();
        }
    }

    // --- LÓGICA CORE DO INFINITE SCROLL ---
    
    // Função chamada quando mudamos filtros, busca ou ordenação (Reseta tudo)
    function resetAndRender(container = galleryContainer) {
        if (!container) return;
        
        container.innerHTML = ''; // Limpa a grade
        loadedCount = 0; // Reseta contador
        
        // Remove sentinela antigo se existir
        if(scrollSentinel) {
            infiniteScrollObserver.unobserve(scrollSentinel);
            scrollSentinel.remove();
            scrollSentinel = null;
        }

        if (activeData.length === 0) {
            container.innerHTML = '<p style="color:#241000; text-align:center; width:100%; grid-column: 1/-1; padding: 20px;">Nada encontrado.</p>';
            return;
        }

        loadNextBatch(container);
    }

    // Função que carrega o próximo lote (Chunk)
    function loadNextBatch(container = galleryContainer) {
        // Se já carregou tudo, para.
        if (loadedCount >= activeData.length) return;

        const nextBatch = activeData.slice(loadedCount, loadedCount + ITEMS_PER_PAGE);
        let htmlBuffer = '';

        nextBatch.forEach(item => {
            const isFav = wishlist.includes(item.id) ? 'active' : '';
            htmlBuffer += `
                <div class="gold-framebox" data-id="${item.id}" data-category="${item.category}" data-title="${item.title}" data-description="${item.description}">
                    <div class="card-actions">
                        <button class="action-btn share-btn" aria-label="Compartilhar" onclick="event.stopPropagation()">➦</button>
                        <button class="action-btn wishlist-btn ${isFav}" aria-label="Favoritar" onclick="event.stopPropagation()">♥</button>
                    </div>
                    <img class="lazy-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="${item.image}" alt="${item.title}" style="transition: opacity 0.8s ease; opacity: 0;">
                    <div class="card-info-bar">
                        <h3 class="info-title">${item.title}</h3>
                        <p class="info-desc">${item.description}</p>
                    </div>
                </div>
            `;
        });

        // Insere o HTML novo no final do container
        container.insertAdjacentHTML('beforeend', htmlBuffer);
        
        // Atualiza contagem
        loadedCount += nextBatch.length;

        // Reativa funcionalidades nos novos itens
        attachCardEvents(container);
        attachObserversAndPreload(container);

        // Gerencia o Sentinela (Cria ou Move para o final)
        manageSentinel(container);
    }

    function manageSentinel(container) {
        // Se ainda tem itens para carregar
        if (loadedCount < activeData.length) {
            if (!scrollSentinel) {
                scrollSentinel = document.createElement('div');
                scrollSentinel.id = 'scroll-sentinel';
                scrollSentinel.style.cssText = "width:100%; height:20px; grid-column: 1/-1;"; // Ocupa toda largura da grid
                // Insere logo APÓS o container da galeria (para não quebrar o grid layout)
                container.parentNode.appendChild(scrollSentinel);
                infiniteScrollObserver.observe(scrollSentinel);
            } else {
                // Move para o final (se necessário, mas o appendChild já move se já existe no DOM)
                container.parentNode.appendChild(scrollSentinel); 
            }
        } else {
            // Se acabou, mata o sentinela
            if(scrollSentinel) {
                infiniteScrollObserver.unobserve(scrollSentinel);
                scrollSentinel.remove();
                scrollSentinel = null;
            }
        }
    }

    function attachObserversAndPreload(container) {
        const images = container.querySelectorAll('.lazy-image:not(.observed)');
        images.forEach(img => {
            globalImageObserver.observe(img);
            img.classList.add('observed'); // Marca para não observar de novo
        });

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
    // 3. ESTILOS DINÂMICOS
    // =========================================================
    function injectDynamicStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .card-actions { position: absolute; top: 10px; right: 10px; z-index: 10; display: flex; gap: 8px; }
            .action-btn { background: rgba(36, 16, 0, 0.6); border: none; color: #fff; font-size: 1.1rem; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; justify-content: center; padding-top: 2px; backdrop-filter: blur(4px); }
            .action-btn:hover { background: #241000; transform: scale(1.1); }
            .wishlist-btn.active { color: #D00000; background: #fff; box-shadow: 0 0 10px rgba(208,0,0,0.5); }
            .share-btn { font-size: 1rem; }
            .share-btn:active { transform: scale(0.9); }
            .controls-wrapper { width: 100%; display: flex; justify-content: center; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; }
            #js-search-input { padding: 12px 25px; width: 100%; max-width: 300px; border-radius: 50px; border: 2px solid #241000; background: rgba(255,255,255,0.9); color: #241000; font-size: 1rem; outline: none; box-shadow: 0 4px 10px rgba(36,16,0,0.1); transition: all 0.3s ease; }
            #js-sort-select { padding: 12px 20px; border-radius: 50px; border: 2px solid #241000; background: #241000; color: #FDB90C; font-size: 0.9rem; font-weight: 600; cursor: pointer; outline: none; appearance: none; -webkit-appearance: none; text-align: center; box-shadow: 0 4px 10px rgba(36,16,0,0.2); }
            #js-sort-select:hover { background: #3a1a00; }
        `;
        document.head.appendChild(style);
    }

    function attachCardEvents(container) {
        // Remove listener antigo (clonagem é um jeito rápido de limpar eventos acumulados)
        // Mas como estamos usando delegação direta no container principal, apenas garantimos que
        // não estamos duplicando lógica. Aqui, como os cards são novos (HTML string), não tem duplicação.
        
        // A delegação global no 'overlay' ou 'gallery-door' cuida dos cliques.
        // Essa função fica aqui caso precisemos de eventos específicos por card no futuro.
    }

    async function shareProduct(card) {
        const title = card.dataset.title;
        const category = card.dataset.category;
        const shareUrl = `${window.location.origin}${window.location.pathname}?filtro=${category}`;
        const shareData = { title: `DaRafa: ${title}`, text: `Olha essa joia: ${title}`, url: shareUrl };
        try { if (navigator.share) await navigator.share(shareData); else { await navigator.clipboard.writeText(shareUrl); alert('Link copiado!'); } } catch (err) { console.warn('Erro share', err); }
    }

    function toggleWishlist(id, btnElement) {
        const index = wishlist.indexOf(id);
        if (index === -1) {
            wishlist.push(id);
            btnElement.classList.add('active');
            btnElement.style.transform = "scale(1.4)";
            setTimeout(() => btnElement.style.transform = "scale(1)", 200);
        } else {
            wishlist.splice(index, 1);
            btnElement.classList.remove('active');
        }
        localStorage.setItem('darafa_wishlist', JSON.stringify(wishlist));
        
        // Se estiver no filtro Favoritos, atualiza a lista
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter && activeFilter.dataset.filter === 'favorites') {
            // Atualiza activeData para refletir a nova wishlist
            activeData = productsData.filter(item => wishlist.includes(item.id));
            activeData = applySort(activeData);
            
            // Re-renderiza o container atual
            const parentContainer = btnElement.closest('.gallery-5-cols');
            if(parentContainer) resetAndRender(parentContainer);
        }
    }


    // =========================================================
    // 4. CONTROLES UNIFICADOS (COM ATUALIZAÇÃO DE DADOS)
    // =========================================================
    function initControls() {
        const filterContainer = document.querySelector('.catalog-filters');
        if (!filterContainer) return;

        const controlsWrapper = document.createElement('div');
        controlsWrapper.className = 'controls-wrapper';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'js-search-input';
        input.placeholder = 'Buscar joia...';
        input.addEventListener('focus', () => input.style.borderColor = '#CD4A00');
        input.addEventListener('blur', () => input.style.borderColor = '#241000');

        const sortSelect = document.createElement('select');
        sortSelect.id = 'js-sort-select';
        sortSelect.innerHTML = `<option value="default">✨ Relevância</option><option value="az">A - Z</option><option value="za">Z - A</option><option value="random">🎲 Aleatório</option>`;

        controlsWrapper.appendChild(input);
        controlsWrapper.appendChild(sortSelect);
        filterContainer.prepend(controlsWrapper);

        // Lógica de Busca + Ordenação Unificada
        const updateGridData = () => {
            const term = input.value.toLowerCase();
            const activeFilterBtn = document.querySelector('.filter-btn.active');
            const filterValue = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';

            // 1. Filtra por Categoria
            let filtered = productsData;
            if (filterValue === 'favorites') {
                filtered = productsData.filter(item => wishlist.includes(item.id));
            } else if (filterValue !== 'all') {
                filtered = productsData.filter(item => item.category === filterValue);
            }

            // 2. Filtra por Busca
            if (term) {
                filtered = filtered.filter(item => 
                    item.title.toLowerCase().includes(term) || 
                    item.description.toLowerCase().includes(term) ||
                    item.category.toLowerCase().includes(term)
                );
            }

            // 3. Aplica Ordenação
            activeData = applySort(filtered);

            // 4. Renderiza (Reseta Scroll)
            const parentModal = input.closest('.expansion-content');
            const targetGallery = parentModal ? parentModal.querySelector('.gallery-5-cols') : document.querySelector('#gallery-door .gallery-5-cols');
            
            resetAndRender(targetGallery);
        };

        input.addEventListener('input', (e) => {
            if(this.searchTimeout) clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                updateURL('busca', e.target.value.length > 0 ? e.target.value : null);
            }, 500);
            updateGridData();
        });

        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            updateGridData();
        });
    }

    function applySort(items) {
        let sortedItems = [...items];
        switch (currentSort) {
            case 'az': sortedItems.sort((a, b) => a.title.localeCompare(b.title)); break;
            case 'za': sortedItems.sort((a, b) => b.title.localeCompare(a.title)); break;
            case 'random': sortedItems.sort(() => Math.random() - 0.5); break;
            default: sortedItems.sort((a, b) => a.id - b.id);
        }
        return sortedItems;
    }


    // =========================================================
    // 5. FILTROS (ATUALIZADOS PARA INFINITE SCROLL)
    // =========================================================
    function initFilters() {
        const filterContainers = document.querySelectorAll('.catalog-filters');
        filterContainers.forEach(container => {
            if(!container.querySelector('[data-filter="favorites"]')) {
                const favBtn = document.createElement('button');
                favBtn.className = 'filter-btn';
                favBtn.dataset.filter = 'favorites';
                favBtn.innerText = '♥ Favoritos';
                favBtn.style.color = '#D00000';
                favBtn.style.borderColor = '#D00000';
                container.appendChild(favBtn);
            }
        });

        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const button = e.target;
                const filterValue = button.dataset.filter;
                updateURL('filtro', filterValue);

                // Limpa busca ao trocar filtro
                const searchInput = document.getElementById('js-search-input');
                if (searchInput) searchInput.value = '';

                // Atualiza Botões
                const container = button.closest('.catalog-filters');
                if(container) {
                    container.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                }

                // Prepara Dados
                if (filterValue === 'favorites') {
                    activeData = productsData.filter(item => wishlist.includes(item.id));
                } else if (filterValue === 'all') {
                    activeData = productsData;
                } else {
                    activeData = productsData.filter(item => item.category === filterValue);
                }
                
                activeData = applySort(activeData);

                // Renderiza
                const modalContent = button.closest('.expansion-content');
                const targetGallery = modalContent ? modalContent.querySelector('.gallery-5-cols') : document.querySelector('#gallery-door .gallery-5-cols');
                
                resetAndRender(targetGallery);
            }
        });
    }


    // =========================================================
    // 6. UX: MENU, SCROLL & PORTAIS
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

    const doors = document.querySelectorAll('.big-card-wrapper:not(.no-expand)');
    const body = document.body;

    doors.forEach(door => {
        door.addEventListener('click', function(e) {
            if(e.target.classList.contains('filter-btn') || 
               e.target.id === 'js-search-input' || 
               e.target.id === 'js-sort-select' ||
               e.target.classList.contains('action-btn')) return;
               
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

        let touchStartY = 0;
        let touchEndY = 0;
        overlay.addEventListener('touchstart', e => { touchStartY = e.changedTouches[0].screenY; }, {passive: true});
        overlay.addEventListener('touchend', e => { touchEndY = e.changedTouches[0].screenY; if (touchEndY - touchStartY > 60) close(); }, {passive: true});

        // Limpa controles duplicados
        const oldControls = overlay.querySelector('.controls-wrapper');
        if(oldControls) oldControls.remove();
        
        // Re-inicializa controles no modal
        const modalFilters = overlay.querySelector('.catalog-filters');
        if(modalFilters) {
             const controlsWrapper = document.createElement('div');
             controlsWrapper.className = 'controls-wrapper';
             
             const input = document.createElement('input');
             input.placeholder = 'Buscar joia...';
             input.style.cssText = "padding:12px 25px; width:100%; max-width:300px; border-radius:50px; border:2px solid #241000; background:rgba(255,255,255,0.9); color:#241000; font-size:1rem; outline:none;";
             
             const sortSelect = document.createElement('select');
             sortSelect.innerHTML = `<option value="default">✨ Relevância</option><option value="az">A - Z</option><option value="za">Z - A</option><option value="random">🎲 Aleatório</option>`;
             sortSelect.style.cssText = "padding:12px 20px; border-radius:50px; border:2px solid #241000; background:#241000; color:#FDB90C; font-size:0.9rem; font-weight:600; cursor:pointer;";
             
             controlsWrapper.appendChild(input);
             controlsWrapper.appendChild(sortSelect);
             modalFilters.prepend(controlsWrapper);

             // Define dados iniciais do modal
             const targetGallery = overlay.querySelector('.gallery-5-cols');
             
             // Função local de update do modal
             const updateModal = () => {
                 const term = input.value.toLowerCase();
                 // Filtra sempre do productsData original para não perder itens
                 let filtered = productsData.filter(item => item.title.toLowerCase().includes(term) || item.category.includes(term));
                 
                 // Aplica ordenação global
                 activeData = applySort(filtered);
                 resetAndRender(targetGallery);
             };

             input.addEventListener('input', updateModal);
             sortSelect.addEventListener('change', (e) => {
                 currentSort = e.target.value;
                 updateModal();
             });

             if(!modalFilters.querySelector('[data-filter="favorites"]')) {
                const favBtn = document.createElement('button');
                favBtn.className = 'filter-btn';
                favBtn.dataset.filter = 'favorites';
                favBtn.innerText = '♥ Favoritos';
                favBtn.style.color = '#D00000';
                favBtn.style.borderColor = '#D00000';
                modalFilters.appendChild(favBtn);
             }
             
             // Inicializa o modal com os dados atuais
             resetAndRender(targetGallery);
        }

        // Delegação de cliques no Modal
        overlay.addEventListener('click', (e) => {
            const btn = e.target;
            if (btn.classList.contains('wishlist-btn')) {
                e.stopPropagation();
                const card = btn.closest('.gold-framebox');
                toggleWishlist(parseInt(card.dataset.id), btn);
                return;
            }
            if (btn.classList.contains('share-btn')) {
                e.stopPropagation();
                shareProduct(btn.closest('.gold-framebox'));
                return;
            }

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

        let touchStartY = 0;
        let touchEndY = 0;
        viewer.addEventListener('touchstart', e => { touchStartY = e.changedTouches[0].screenY; }, {passive: true});
        viewer.addEventListener('touchend', e => { touchEndY = e.changedTouches[0].screenY; if (touchEndY - touchStartY > 60) closeViewer(); }, {passive: true});

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
