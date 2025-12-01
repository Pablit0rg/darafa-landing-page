/**
 * DaRafa Acessórios - Main Script (Versão FASE 3 - Fix Infinite Scroll)
 * * CORREÇÃO: Scroll Infinito agora funciona corretamente dentro do Modal.
 * * * FUNCIONALIDADES:
 * Analytics, Toast, Teclado, Infinite Scroll, Ordenação, Swipe, Share, URL, Wishlist, Busca.
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 0. DADOS, CONFIGURAÇÕES & ANALYTICS
    // =========================================================
    const INSTAGRAM_TOKEN = ''; 
    const POSTS_LIMIT = 50; 
    const ITEMS_PER_PAGE = 12;
    
    // Estados Persistentes
    let wishlist = JSON.parse(localStorage.getItem('darafa_wishlist')) || [];
    let recentHistory = JSON.parse(localStorage.getItem('darafa_history')) || [];
    
    let analyticsData = JSON.parse(localStorage.getItem('darafa_analytics')) || {
        views: 0, searches: {}, categoryClicks: {}, productClicks: {}, interactions: { wishlist: 0, share: 0 }
    };
    
    let currentSort = 'default';
    let activeData = []; 
    let loadedCount = 0; 
    let scrollSentinel; // O elemento invisível que detecta o fim da página
    let currentViewerIndex = -1;

    // Variáveis para Metadados
    let originalTitle = document.title;
    let originalDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

    // --- ANALYTICS ---
    function trackEvent(type, label) {
        if (type === 'view') analyticsData.views++;
        if (type === 'search' && label) analyticsData.searches[label] = (analyticsData.searches[label] || 0) + 1;
        if (type === 'filter') analyticsData.categoryClicks[label] = (analyticsData.categoryClicks[label] || 0) + 1;
        if (type === 'product_click') analyticsData.productClicks[label] = (analyticsData.productClicks[label] || 0) + 1;
        if (type === 'interaction') analyticsData.interactions[label]++;
        localStorage.setItem('darafa_analytics', JSON.stringify(analyticsData));
    }
    window.showAnalytics = () => { console.table(analyticsData.categoryClicks); return analyticsData; };
    trackEvent('view');

    // --- DADOS DOS PRODUTOS (Simulação de 50 itens) ---
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
    // 1. SEO & METADADOS
    // =========================================================
    function initSEO() {
        const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
        const schema = {
            "@context": "https://schema.org", "@graph": [
                {
                    "@type": "JewelryStore", "name": "DaRafa Acessórios", "url": baseUrl,
                    "description": "Joias artesanais feitas à mão em Curitiba.",
                    "logo": baseUrl + "assets/images/logo.darafa.oficial.logo.png",
                    "sameAs": ["https://www.instagram.com/darafa_cwb/"],
                    "address": { "@type": "PostalAddress", "addressLocality": "Curitiba", "addressRegion": "PR", "addressCountry": "BR" }
                },
                {
                    "@type": "ItemList", "numberOfItems": productsData.length,
                    "itemListElement": productsData.map((item, index) => ({
                        "@type": "ListItem", "position": index + 1,
                        "item": {
                            "@type": "Product", "name": item.title, "description": item.description,
                            "image": baseUrl + item.image, "sku": `DARAF-${item.id}`,
                            "brand": { "@type": "Brand", "name": "DaRafa" },
                            "offers": { "@type": "Offer", "availability": "https://schema.org/InStock", "price": "0.00", "priceCurrency": "BRL" }
                        }
                    }))
                }
            ]
        };
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    function setPageMetadata(title, description) {
        document.title = `${title} | DaRafa`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', description);
    }

    function restorePageMetadata() {
        document.title = originalTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', originalDesc);
    }


    // =========================================================
    // 2. MODO OFFLINE (PWA)
    // =========================================================
    function initOfflineMode() {
        const style = document.createElement('style');
        style.innerHTML = `
            body.offline-mode { filter: grayscale(0.8); }
            body.offline-mode .toast-notification { filter: grayscale(0) !important; }
        `;
        document.head.appendChild(style);

        window.addEventListener('offline', () => {
            document.body.classList.add('offline-mode');
            showToast('⚠️ Você está offline. Modo leitura ativado.');
        });

        window.addEventListener('online', () => {
            document.body.classList.remove('offline-mode');
            showToast('🟢 Conexão restaurada! Atualizando...');
            setTimeout(() => {
                document.querySelectorAll('img').forEach(img => {
                    if (!img.complete || img.naturalWidth === 0) { const src = img.src; img.src = ''; img.src = src; }
                });
            }, 1000);
        });
    }


    // =========================================================
    // 3. INICIALIZAÇÃO GERAL
    // =========================================================
    // Container "Escondido" da página principal (Referência Base)
    const galleryContainer = document.querySelector('#gallery-door .gallery-5-cols');
    
    // Observer para Lazy Load de Imagens
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

    // --- CORREÇÃO DO INFINITE SCROLL ---
    // Agora o observer descobre qual container deve carregar
    const infiniteScrollObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            // O target é o Sentinela. O pai do sentinela é onde a galeria está.
            const sentinel = entries[0].target;
            // Buscamos a galeria vizinha ao sentinela dentro do mesmo pai (seja Modal ou Hidden)
            const targetContainer = sentinel.parentNode ? sentinel.parentNode.querySelector('.gallery-5-cols') : galleryContainer;
            
            if (targetContainer) {
                loadNextBatch(targetContainer);
            }
        }
    }, { rootMargin: "200px" });

    if (galleryContainer) {
        initSEO();
        initOfflineMode();
        initCatalog();
        initFilters();
        initControls(); 
        injectDynamicStyles(); 
        setTimeout(loadStateFromURL, 100);
        initKeyboardNavigation();
    }

    window.addEventListener('popstate', loadStateFromURL);

    // =========================================================
    // 4. LÓGICA DE CATÁLOGO & HISTÓRICO
    // =========================================================
    
    function addToHistory(id) {
        recentHistory = recentHistory.filter(itemId => itemId !== id);
        recentHistory.unshift(id);
        if (recentHistory.length > 6) recentHistory.pop();
        localStorage.setItem('darafa_history', JSON.stringify(recentHistory));
        
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter && activeFilter.dataset.filter === 'history') {
            activeData = productsData.filter(item => recentHistory.includes(item.id));
            activeData.sort((a, b) => recentHistory.indexOf(a.id) - recentHistory.indexOf(b.id));
            const container = document.querySelector('.expansion-overlay.active .gallery-5-cols') || galleryContainer;
            resetAndRender(container);
        }
    }

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
            }
        } else {
            const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
            if(allBtn) allBtn.click();
        }
    }

    async function initCatalog() {
        if (INSTAGRAM_TOKEN) {
            try { await fetchInstagramPosts(); } 
            catch (error) { activeData = [...productsData]; resetAndRender(); }
        } else {
            activeData = [...productsData];
            resetAndRender();
        }
    }

    // Reinicia a renderização no container especificado (Modal ou Hidden)
    function resetAndRender(container = galleryContainer) {
        if (!container) return;
        
        container.innerHTML = ''; 
        loadedCount = 0; 
        
        // Remove observador do sentinela antigo, se houver
        if(scrollSentinel) { 
            infiniteScrollObserver.unobserve(scrollSentinel); 
            scrollSentinel.remove(); 
            scrollSentinel = null; 
        }
        
        if (activeData.length === 0) {
            container.innerHTML = '<p style="color:#FDB90C; text-align:center; width:100%; grid-column: 1/-1; padding: 20px;">Nada encontrado aqui ainda.</p>';
            return;
        }
        
        // Carrega o primeiro lote
        loadNextBatch(container);
    }

    // Carrega mais itens no container especificado
    function loadNextBatch(container = galleryContainer) {
        if (loadedCount >= activeData.length) return;
        
        const nextBatch = activeData.slice(loadedCount, loadedCount + ITEMS_PER_PAGE);
        let htmlBuffer = '';

        nextBatch.forEach(item => {
            const isFav = wishlist.includes(item.id) ? 'active' : '';
            htmlBuffer += `
                <div class="gold-framebox" tabindex="0" data-id="${item.id}" data-category="${item.category}" data-title="${item.title}" data-description="${item.description}">
                    <div class="card-actions">
                        <button class="action-btn share-btn" aria-label="Compartilhar" tabindex="-1">➦</button>
                        <button class="action-btn wishlist-btn ${isFav}" aria-label="Favoritar" tabindex="-1">♥</button>
                    </div>
                    <img class="lazy-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="${item.image}" alt="${item.title}" style="transition: opacity 0.8s ease; opacity: 0;">
                    <div class="card-info-bar">
                        <h3 class="info-title">${item.title}</h3>
                        <p class="info-desc">${item.description}</p>
                    </div>
                </div>
            `;
        });

        container.insertAdjacentHTML('beforeend', htmlBuffer);
        loadedCount += nextBatch.length;
        
        attachCardEvents(container);
        attachObserversAndPreload(container);
        manageSentinel(container); // Adiciona o sentinela ao final deste container
    }

    function manageSentinel(container) {
        // Se ainda há itens para carregar
        if (loadedCount < activeData.length) {
            // Remove sentinela antigo se existir (para movê-lo para o fim)
            if (scrollSentinel) {
                infiniteScrollObserver.unobserve(scrollSentinel);
                scrollSentinel.remove();
            }

            // Cria novo sentinela
            scrollSentinel = document.createElement('div');
            scrollSentinel.id = 'scroll-sentinel';
            scrollSentinel.style.cssText = "width:100%; height:20px; grid-column: 1/-1; pointer-events: none;"; 
            
            // Adiciona AO PAI do container da galeria (para ficar abaixo do grid)
            // No modal: container.parentNode é .expansion-content
            if (container.parentNode) {
                container.parentNode.appendChild(scrollSentinel);
                infiniteScrollObserver.observe(scrollSentinel);
            }
        } else {
            // Se acabou tudo, limpa
            if(scrollSentinel) {
                infiniteScrollObserver.unobserve(scrollSentinel);
                scrollSentinel.remove();
                scrollSentinel = null;
            }
        }
    }

    function attachObserversAndPreload(container) {
        const images = container.querySelectorAll('.lazy-image:not(.observed)');
        images.forEach(img => { globalImageObserver.observe(img); img.classList.add('observed'); });
        
        // Preload no hover
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
    // 5. ESTILOS & INTERAÇÕES
    // =========================================================
    function injectDynamicStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .card-actions { position: absolute; top: 10px; right: 10px; z-index: 10; display: flex; gap: 8px; opacity: 0; transition: opacity 0.3s ease; }
            .gold-framebox:hover .card-actions, .gold-framebox:focus-within .card-actions { opacity: 1; }
            .gold-framebox:focus { outline: 2px solid #D00000; outline-offset: 2px; }
            .action-btn { background: rgba(36, 16, 0, 0.6); border: none; color: #fff; font-size: 1.1rem; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; justify-content: center; padding-top: 2px; backdrop-filter: blur(4px); }
            .action-btn:hover { background: #D00000; transform: scale(1.1); }
            .wishlist-btn.active { color: #D00000; background: #fff; box-shadow: 0 0 10px rgba(208,0,0,0.5); }
            .share-btn { font-size: 1rem; }
            .share-btn:active { transform: scale(0.9); }
            .controls-wrapper { width: 100%; display: flex; justify-content: center; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; }
            #js-search-input { padding: 12px 25px; width: 100%; max-width: 300px; border-radius: 50px; border: 2px solid #241000; background: rgba(255,255,255,0.9); color: #241000; font-size: 1rem; outline: none; box-shadow: 0 4px 10px rgba(36,16,0,0.1); transition: all 0.3s ease; }
            #js-sort-select { padding: 12px 20px; border-radius: 50px; border: 2px solid #241000; background: #241000; color: #FDB90C; font-size: 0.9rem; font-weight: 600; cursor: pointer; outline: none; appearance: none; -webkit-appearance: none; text-align: center; box-shadow: 0 4px 10px rgba(36,16,0,0.2); }
            #js-sort-select:hover { background: #3a1a00; }
            .toast-notification {
                position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(100px);
                background-color: #241000; color: #FDB90C; padding: 12px 24px;
                border-radius: 50px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                font-family: 'Poppins', sans-serif; font-size: 0.9rem; font-weight: 500;
                z-index: 5000; opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex; align-items: center; gap: 8px; border: 1px solid #FDB90C;
            }
            .toast-notification.show { transform: translateX(-50%) translateY(0); opacity: 1; }
        `;
        document.head.appendChild(style);
    }

    function showToast(message) {
        const oldToast = document.querySelector('.toast-notification');
        if(oldToast) oldToast.remove();
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
    }

    function attachCardEvents(container) {
        // Usa delegação de eventos para melhor performance
        // (Nota: O clique no card para abrir o zoom é tratado no listener do Modal Overlay)
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.action-btn');
            if (!btn) return;
            
            const card = btn.closest('.gold-framebox');
            if (!card) return;

            if (btn.classList.contains('wishlist-btn')) { 
                e.stopPropagation(); 
                toggleWishlist(parseInt(card.dataset.id), btn); 
            }
            else if (btn.classList.contains('share-btn')) { 
                e.stopPropagation(); 
                shareProduct(card); 
            }
        });
    }

    // --- FILTROS ---
    function initFilters() {
        // Função auxiliar para injetar botões se não existirem
        const injectButtons = (container) => {
             if(!container.querySelector('[data-filter="favorites"]')) {
                const favBtn = document.createElement('button');
                favBtn.className = 'filter-btn';
                favBtn.dataset.filter = 'favorites';
                favBtn.innerText = '♥ Favoritos';
                favBtn.style.color = '#D00000';
                favBtn.style.borderColor = '#D00000';
                container.appendChild(favBtn);
            }
            if(!container.querySelector('[data-filter="history"]')) {
                const histBtn = document.createElement('button');
                histBtn.className = 'filter-btn';
                histBtn.dataset.filter = 'history';
                histBtn.innerText = '🕒 Vistos';
                histBtn.style.color = '#241000';
                histBtn.style.borderColor = '#241000';
                container.appendChild(histBtn);
            }
        };

        const filterContainers = document.querySelectorAll('.catalog-filters');
        filterContainers.forEach(injectButtons);

        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const button = e.target;
                const filterValue = button.dataset.filter;
                updateURL('filtro', filterValue);
                trackEvent('filter', filterValue);

                const searchInput = document.getElementById('js-search-input');
                if (searchInput) searchInput.value = '';

                // Atualiza visual dos botões no container atual
                const container = button.closest('.catalog-filters');
                if(container) { container.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active')); button.classList.add('active'); }

                // Lógica de Filtragem
                if (filterValue === 'favorites') {
                    activeData = productsData.filter(item => wishlist.includes(item.id));
                } else if (filterValue === 'history') {
                    activeData = productsData.filter(item => recentHistory.includes(item.id));
                    activeData.sort((a, b) => recentHistory.indexOf(a.id) - recentHistory.indexOf(b.id));
                } else if (filterValue === 'all') {
                    activeData = productsData;
                } else {
                    activeData = productsData.filter(item => item.category === filterValue);
                }
                
                if (filterValue !== 'history') activeData = applySort(activeData);

                // IMPORTANTE: Reseta e renderiza no container correto (Modal ou Hidden)
                const modalContent = button.closest('.expansion-content');
                const targetGallery = modalContent ? modalContent.querySelector('.gallery-5-cols') : galleryContainer;
                resetAndRender(targetGallery);
            }
        });
    }

    function initControls() {
        const filterContainer = document.querySelector('.catalog-filters');
        if (!filterContainer) return;

        const controlsWrapper = document.createElement('div');
        controlsWrapper.className = 'controls-wrapper';

        const input = document.createElement('input');
        input.type = 'text'; input.id = 'js-search-input'; input.placeholder = 'Buscar joia...';
        input.addEventListener('focus', () => input.style.borderColor = '#CD4A00');
        input.addEventListener('blur', () => input.style.borderColor = '#241000');

        const sortSelect = document.createElement('select');
        sortSelect.id = 'js-sort-select';
        sortSelect.innerHTML = `<option value="default">✨ Relevância</option><option value="az">A - Z</option><option value="za">Z - A</option><option value="random">🎲 Aleatório</option>`;

        controlsWrapper.appendChild(input);
        controlsWrapper.appendChild(sortSelect);
        filterContainer.prepend(controlsWrapper);

        const updateGridData = () => {
            const term = input.value.toLowerCase();
            const activeFilterBtn = document.querySelector('.filter-btn.active');
            const filterValue = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';

            let filtered = productsData;
            if (filterValue === 'favorites') filtered = productsData.filter(item => wishlist.includes(item.id));
            else if (filterValue === 'history') filtered = productsData.filter(item => recentHistory.includes(item.id));
            else if (filterValue !== 'all') filtered = productsData.filter(item => item.category === filterValue);

            if (term) {
                if(term.length > 3) trackEvent('search', term);
                filtered = filtered.filter(item => item.title.toLowerCase().includes(term) || item.description.toLowerCase().includes(term) || item.category.toLowerCase().includes(term));
            }

            if (filterValue !== 'history') filtered = applySort(filtered);
            activeData = filtered;

            const parentModal = input.closest('.expansion-content');
            const targetGallery = parentModal ? parentModal.querySelector('.gallery-5-cols') : galleryContainer;
            resetAndRender(targetGallery);
        };

        input.addEventListener('input', (e) => {
            if(this.searchTimeout) clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => { updateURL('busca', e.target.value.length > 0 ? e.target.value : null); }, 500);
            updateGridData();
        });

        sortSelect.addEventListener('change', (e) => { currentSort = e.target.value; updateGridData(); });
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

    // --- UX: KEYBOARD, SWIPE, MODALS ---
    function initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (document.querySelector('.image-viewer-overlay.active')) {
                if (e.key === 'ArrowRight') navigateViewer(1);
                if (e.key === 'ArrowLeft') navigateViewer(-1);
                return;
            }
            if (e.key === 'Enter' && document.activeElement.classList.contains('gold-framebox')) {
                const card = document.activeElement;
                const img = card.querySelector('img');
                if (img) { trackEvent('product_click', card.dataset.title); openImageViewer(img.dataset.src || img.src, card.dataset.id); }
            }
        });
    }

    function navigateViewer(direction) {
        if (activeData.length === 0 || currentViewerIndex === -1) return;
        let newIndex = currentViewerIndex + direction;
        if (newIndex >= activeData.length) newIndex = 0;
        if (newIndex < 0) newIndex = activeData.length - 1;
        const nextItem = activeData[newIndex];
        currentViewerIndex = newIndex;
        const viewerImg = document.querySelector('.image-viewer-content');
        if (viewerImg) {
            viewerImg.style.opacity = 0.5;
            setTimeout(() => { viewerImg.src = nextItem.image; viewerImg.onload = () => viewerImg.style.opacity = 1; }, 200);
            setPageMetadata(nextItem.title, nextItem.description);
            addToHistory(nextItem.id); 
        }
    }

    async function shareProduct(card) {
        const title = card.dataset.title;
        const category = card.dataset.category;
        const shareUrl = `${window.location.origin}${window.location.pathname}?filtro=${category}`;
        trackEvent('interaction', 'share');
        const shareData = { title: `DaRafa: ${title}`, text: `Olha essa joia: ${title}`, url: shareUrl };
        try { if (navigator.share) await navigator.share(shareData); else { await navigator.clipboard.writeText(shareUrl); showToast('Link copiado! 📋'); } } catch (err) { console.warn('Erro share', err); }
    }

    function toggleWishlist(id, btnElement) {
        const index = wishlist.indexOf(id);
        if (index === -1) {
            wishlist.push(id);
            btnElement.classList.add('active');
            btnElement.style.transform = "scale(1.4)";
            setTimeout(() => btnElement.style.transform = "scale(1)", 200);
            showToast('Adicionado aos Favoritos ❤️');
            trackEvent('interaction', 'wishlist_add');
        } else {
            wishlist.splice(index, 1);
            btnElement.classList.remove('active');
            showToast('Removido dos Favoritos 💔');
            trackEvent('interaction', 'wishlist_remove');
        }
        localStorage.setItem('darafa_wishlist', JSON.stringify(wishlist));
        
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter && activeFilter.dataset.filter === 'favorites') {
            activeData = productsData.filter(item => wishlist.includes(item.id));
            activeData = applySort(activeData);
            // Atualiza onde foi clicado
            const parentContainer = btnElement.closest('.gallery-5-cols');
            if(parentContainer) resetAndRender(parentContainer);
        }
    }

    // --- MODAIS & PORTAIS ---
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) { func.apply(context, args); inThrottle = true; setTimeout(() => inThrottle = false, limit); }
        }
    }

    const backToTopBtn = document.getElementById('backToTop');
    if(backToTopBtn) window.addEventListener('scroll', throttle(() => { if (window.scrollY > 300) backToTopBtn.classList.add('visible'); else backToTopBtn.classList.remove('visible'); }, 100), { passive: true });

    const navbarToggler = document.getElementById('navbar-toggler');
    const navbarMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('.navbar-link');
    function toggleMenu() { if(navbarMenu && navbarToggler) { navbarMenu.classList.toggle('active'); navbarToggler.classList.toggle('is-active'); } }
    if(navbarToggler) navbarToggler.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
    navLinks.forEach(link => link.addEventListener('click', () => { if (navbarMenu.classList.contains('active')) toggleMenu(); }));
    document.addEventListener('click', (e) => { if (navbarMenu && navbarMenu.classList.contains('active') && !navbarMenu.contains(e.target) && !navbarToggler.contains(e.target)) toggleMenu(); });

    const doors = document.querySelectorAll('.big-card-wrapper:not(.no-expand)');
    const body = document.body;
    doors.forEach(door => {
        door.addEventListener('click', function(e) {
            if(e.target.classList.contains('filter-btn') || e.target.id === 'js-search-input' || e.target.id === 'js-sort-select' || e.target.classList.contains('action-btn')) return;
            e.preventDefault();
            const hiddenContentDiv = this.querySelector('.hidden-content');
            if (hiddenContentDiv) openExpansionModal(hiddenContentDiv.innerHTML);
        });
    });

    function openExpansionModal(contentHTML) {
        const overlay = document.createElement('div');
        overlay.className = 'expansion-overlay';
        overlay.innerHTML = `<button class="close-expansion">&times;</button><div class="expansion-content">${contentHTML}</div>`;
        body.appendChild(overlay);
        body.style.overflow = 'hidden'; 
        requestAnimationFrame(() => { overlay.classList.add('active'); });

        let touchStartY = 0; let touchEndY = 0;
        overlay.addEventListener('touchstart', e => { touchStartY = e.changedTouches[0].screenY; }, {passive: true});
        overlay.addEventListener('touchend', e => { touchEndY = e.changedTouches[0].screenY; if (touchEndY - touchStartY > 60) close(); }, {passive: true});

        const oldControls = overlay.querySelector('.controls-wrapper');
        if(oldControls) oldControls.remove();
        
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

             const updateModal = () => {
                 const term = input.value.toLowerCase();
                 let filtered = productsData.filter(item => item.title.toLowerCase().includes(term) || item.category.includes(term));
                 activeData = applySort(filtered);
                 const targetGallery = overlay.querySelector('.gallery-5-cols');
                 resetAndRender(targetGallery);
             };
             input.addEventListener('input', updateModal);
             sortSelect.addEventListener('change', (e) => { currentSort = e.target.value; updateModal(); });

             // Re-inject buttons inside modal
             if(!modalFilters.querySelector('[data-filter="favorites"]')) {
                const favBtn = document.createElement('button');
                favBtn.className = 'filter-btn';
                favBtn.dataset.filter = 'favorites';
                favBtn.innerText = '♥ Favoritos';
                favBtn.style.color = '#D00000';
                favBtn.style.borderColor = '#D00000';
                modalFilters.appendChild(favBtn);
             }
             if(!modalFilters.querySelector('[data-filter="history"]')) {
                const histBtn = document.createElement('button');
                histBtn.className = 'filter-btn';
                histBtn.dataset.filter = 'history';
                histBtn.innerText = '🕒 Vistos';
                histBtn.style.color = '#241000';
                histBtn.style.borderColor = '#241000';
                modalFilters.appendChild(histBtn);
             }

             const targetGallery = overlay.querySelector('.gallery-5-cols');
             resetAndRender(targetGallery);
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
        
        // Listener de eventos para o Modal (Zoom e Botões)
        overlay.addEventListener('click', (e) => {
            const btn = e.target.closest('.action-btn');
            
            // Tratamento dos botões (Delegação)
            if (btn) {
                const card = btn.closest('.gold-framebox');
                if (btn.classList.contains('wishlist-btn')) { e.stopPropagation(); toggleWishlist(parseInt(card.dataset.id), btn); return; }
                if (btn.classList.contains('share-btn')) { e.stopPropagation(); shareProduct(card); return; }
            }

            // Tratamento do clique no Card (Zoom)
            const card = e.target.closest('.gold-framebox');
            if (card && overlay.contains(card)) {
                e.stopPropagation();
                const img = card.querySelector('img');
                if (card.dataset.description && card.classList.contains('story-card')) {
                    openStoryMode(img.dataset.src || img.src, card.dataset.title, card.dataset.description);
                } else {
                    trackEvent('product_click', card.dataset.title);
                    if(img) openImageViewer(img.dataset.src || img.src, card.dataset.id);
                }
            }
        });

        const close = () => {
            restorePageMetadata(); 
            overlay.classList.remove('active');
            body.style.overflow = '';
            setTimeout(() => { if(overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 400);
        };
        overlay.querySelector('.close-expansion').addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay || e.target.classList.contains('expansion-content')) close(); });
        const closeOnEsc = (e) => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', closeOnEsc); } };
        document.addEventListener('keydown', closeOnEsc);
    }

    function openImageViewer(imageSrc, id) {
        addToHistory(id);
        const product = productsData.find(p => p.id == id);
        if (product) setPageMetadata(product.title, product.description);

        const foundIndex = activeData.findIndex(item => item.id == id);
        if (foundIndex !== -1) currentViewerIndex = foundIndex;
        createViewerOverlay(`<img src="${imageSrc}" class="image-viewer-content" style="max-height:90vh; max-width:90%; border:1px solid var(--color-gold-dark); box-shadow: 0 0 30px rgba(0,0,0,0.8);">`);
    }

    function openStoryMode(imageSrc, title, description) {
        setPageMetadata(title, description); 
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

        let touchStartY = 0; let touchEndY = 0;
        viewer.addEventListener('touchstart', e => { touchStartY = e.changedTouches[0].screenY; }, {passive: true});
        viewer.addEventListener('touchend', e => { touchEndY = e.changedTouches[0].screenY; if (touchEndY - touchStartY > 60) closeViewer(); }, {passive: true});

        const closeViewer = () => {
            restorePageMetadata(); 
            viewer.classList.remove('active');
            setTimeout(() => { if(viewer.parentNode) viewer.parentNode.removeChild(viewer); }, 300);
        };
        viewer.querySelector('.close-viewer').addEventListener('click', closeViewer);
        viewer.addEventListener('click', (e) => { if(e.target === viewer) closeViewer(); });
        const closeViewerOnEsc = (e) => { if (e.key === 'Escape') { closeViewer(); document.removeEventListener('keydown', closeViewerOnEsc); } };
        document.addEventListener('keydown', closeViewerOnEsc);
    }
});
