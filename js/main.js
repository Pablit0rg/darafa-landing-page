/**
 * DaRafa Acessórios - Main Script (Versão MESTRE UNIFICADA - Fases 2 & 3)
 * * FUNCIONALIDADES ATIVAS:
 * --- FASE 2 (UX & App-like) ---
 * 1. Busca em Tempo Real
 * 2. Wishlist (Favoritos)
 * 3. Links Compartilháveis (URL)
 * 4. Compartilhamento Nativo
 * 5. Swipe Gestures
 * 6. Ordenação Dinâmica
 * 7. Infinite Scroll
 * 8. Navegação Teclado
 * 9. Toast Notifications
 * 10. Analytics Caseiro
 * --- FASE 3 (Performance & SEO) ---
 * 11. SEO Avançado (JSON-LD)
 * 12. Metadados Dinâmicos
 * 13. Modo Offline (PWA)
 * 14. Histórico Recente
 * 15. Focus Trap (Acessibilidade) - NOVO!
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 0. DADOS, CONFIGURAÇÕES & ESTADO
    // =========================================================
    const INSTAGRAM_TOKEN = ''; 
    const POSTS_LIMIT = 50; 
    const ITEMS_PER_PAGE = 12;
    
    // Persistência
    let wishlist = JSON.parse(localStorage.getItem('darafa_wishlist')) || [];
    let recentHistory = JSON.parse(localStorage.getItem('darafa_history')) || [];
    let analyticsData = JSON.parse(localStorage.getItem('darafa_analytics')) || {
        views: 0, searches: {}, categoryClicks: {}, productClicks: {}, interactions: { wishlist: 0, share: 0 }
    };

    // Estado da Sessão
    let currentSort = 'default';
    let activeData = []; 
    let loadedCount = 0; 
    let scrollSentinel;
    let currentViewerIndex = -1;
    let currentModal = null; // Para o Focus Trap

    // SEO Backup
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
    window.showAnalytics = () => analyticsData;
    trackEvent('view');

    // --- DADOS DOS PRODUTOS ---
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

    // Gerador de Dados Mock
    const categories = ['nose-cuff', 'brincos', 'aneis', 'colar'];
    for (let i = productsData.length + 1; i <= 50; i++) {
        productsData.push({
            id: i,
            category: categories[i % categories.length],
            title: `Joia Exclusiva ${i}`,
            description: 'Peça artesanal feita à mão com design exclusivo DaRafa.',
            image: 'assets/images/darafa-catalogo.jpg'
        });
    }


    // =========================================================
    // 1. PHASE 3 FEATURES (SEO, OFFLINE, HISTORY)
    // =========================================================
    function initSEO() {
        const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
        const schema = {
            "@context": "https://schema.org", "@type": "JewelryStore",
            "name": "DaRafa Acessórios", "url": baseUrl,
            "description": "Joias artesanais feitas à mão em Curitiba.",
            "logo": baseUrl + "assets/images/logo.darafa.oficial.logo.png",
            "sameAs": ["https://www.instagram.com/darafa_cwb/"],
            "address": { "@type": "PostalAddress", "addressLocality": "Curitiba", "addressRegion": "PR", "addressCountry": "BR" },
            "hasOfferCatalog": {
                "@type": "OfferCatalog", "name": "Catálogo DaRafa",
                "itemListElement": productsData.slice(0, 10).map(p => ({
                    "@type": "Offer", "itemOffered": { "@type": "Product", "name": p.title, "image": baseUrl + p.image }
                }))
            }
        };
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    function initOfflineMode() {
        const style = document.createElement('style');
        style.innerHTML = `body.offline-mode { filter: grayscale(0.8); } body.offline-mode .toast-notification { filter: grayscale(0) !important; }`;
        document.head.appendChild(style);
        window.addEventListener('offline', () => { document.body.classList.add('offline-mode'); showToast('⚠️ Você está offline. Modo leitura.'); });
        window.addEventListener('online', () => { document.body.classList.remove('offline-mode'); showToast('🟢 Conexão restaurada!'); });
    }

    function addToHistory(id) {
        recentHistory = recentHistory.filter(itemId => itemId !== id);
        recentHistory.unshift(id);
        if (recentHistory.length > 6) recentHistory.pop();
        localStorage.setItem('darafa_history', JSON.stringify(recentHistory));
    }

    function setPageMetadata(title, description) {
        document.title = `${title} | DaRafa`;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', description);
    }
    function restorePageMetadata() {
        document.title = originalTitle;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', originalDesc);
    }


    // =========================================================
    // 2. INICIALIZAÇÃO CORE
    // =========================================================
    const galleryContainer = document.querySelector('#gallery-door .gallery-5-cols');
    
    // Observers
    const globalImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if(img.dataset.src) img.src = img.dataset.src;
                img.onload = () => { img.style.opacity = 1; };
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "200px 0px" });

    const infiniteScrollObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) loadNextBatch();
    }, { rootMargin: "200px" });

    if (galleryContainer) {
        initSEO();
        initOfflineMode();
        initCatalog();
        initFilters();
        initControls(); 
        injectDynamicStyles(); 
        setTimeout(loadStateFromURL, 100);
        initGlobalEvents(); // Teclado e Focus Trap
    }

    window.addEventListener('popstate', loadStateFromURL);


    // =========================================================
    // 3. LÓGICA DE DADOS & RENDER
    // =========================================================
    async function initCatalog() {
        activeData = [...productsData];
        resetAndRender();
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
        const params = new URLSearchParams(window.location.search);
        const filtro = params.get('filtro');
        const busca = params.get('busca');
        if (filtro) {
            const btn = document.querySelector(`.filter-btn[data-filter="${filtro}"]`);
            if (btn) btn.click();
        } else if (busca) {
            const input = document.getElementById('js-search-input');
            if (input) { input.value = busca; input.dispatchEvent(new Event('input')); }
        }
    }

    function resetAndRender(container = galleryContainer) {
        if (!container) return;
        container.innerHTML = ''; 
        loadedCount = 0; 
        if(scrollSentinel) { infiniteScrollObserver.unobserve(scrollSentinel); scrollSentinel.remove(); scrollSentinel = null; }
        if (activeData.length === 0) {
            container.innerHTML = '<p style="color:#241000; text-align:center; grid-column: 1/-1; padding: 20px;">Nada encontrado.</p>';
            return;
        }
        loadNextBatch(container);
    }

    function loadNextBatch(container = galleryContainer) {
        if (loadedCount >= activeData.length) return;
        const nextBatch = activeData.slice(loadedCount, loadedCount + ITEMS_PER_PAGE);
        let html = '';
        nextBatch.forEach(item => {
            const isFav = wishlist.includes(item.id) ? 'active' : '';
            // tabindex="0" para Focus Trap funcionar
            html += `
                <div class="gold-framebox" tabindex="0" data-id="${item.id}" data-title="${item.title}" data-desc="${item.description}" data-cat="${item.category}">
                    <div class="card-actions">
                        <button class="action-btn share-btn" aria-label="Compartilhar" tabindex="0">➦</button>
                        <button class="action-btn wishlist-btn ${isFav}" aria-label="Favoritar" tabindex="0">♥</button>
                    </div>
                    <img class="lazy-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="${item.image}" style="opacity: 0; transition: opacity 0.5s;">
                    <div class="card-info-bar"><h3 class="info-title">${item.title}</h3><p class="info-desc">${item.description}</p></div>
                </div>`;
        });
        container.insertAdjacentHTML('beforeend', html);
        loadedCount += nextBatch.length;
        
        // Re-liga observers
        container.querySelectorAll('.lazy-image:not(.observed)').forEach(img => {
            globalImageObserver.observe(img); img.classList.add('observed');
        });
        
        // Sentinela
        if (loadedCount < activeData.length) {
            if (!scrollSentinel) {
                scrollSentinel = document.createElement('div');
                scrollSentinel.style.gridColumn = '1/-1'; scrollSentinel.style.height = '20px';
                container.parentNode.appendChild(scrollSentinel);
                infiniteScrollObserver.observe(scrollSentinel);
            } else container.parentNode.appendChild(scrollSentinel);
        }
    }


    // =========================================================
    // 4. UI: ESTILOS & CONTROLES
    // =========================================================
    function injectDynamicStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .card-actions { position: absolute; top: 10px; right: 10px; z-index: 10; display: flex; gap: 8px; opacity: 0; transition: opacity 0.3s; }
            .gold-framebox:hover .card-actions, .gold-framebox:focus-within .card-actions { opacity: 1; }
            .gold-framebox:focus { outline: 2px solid #D00000; outline-offset: 2px; }
            .action-btn { background: rgba(36, 16, 0, 0.6); border: none; color: #fff; font-size: 1.1rem; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
            .action-btn:hover { background: #241000; transform: scale(1.1); }
            .wishlist-btn.active { color: #D00000; background: #fff; }
            .controls-wrapper { width: 100%; display: flex; justify-content: center; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; }
            #js-search-input { padding: 12px 25px; width: 100%; max-width: 300px; border-radius: 50px; border: 2px solid #241000; background: rgba(255,255,255,0.9); outline: none; }
            #js-sort-select { padding: 12px 20px; border-radius: 50px; border: 2px solid #241000; background: #241000; color: #FDB90C; cursor: pointer; }
            .toast-notification { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(100px); background: #241000; color: #FDB90C; padding: 12px 24px; border-radius: 50px; z-index: 5000; opacity: 0; transition: all 0.4s; border: 1px solid #FDB90C; }
            .toast-notification.show { transform: translateX(-50%) translateY(0); opacity: 1; }
        `;
        document.head.appendChild(style);
    }

    function initControls() {
        const container = document.querySelector('.catalog-filters');
        if (!container) return;
        const wrapper = document.createElement('div'); wrapper.className = 'controls-wrapper';
        
        const input = document.createElement('input'); 
        input.id = 'js-search-input'; input.placeholder = 'Buscar joia...';
        
        const select = document.createElement('select'); 
        select.id = 'js-sort-select';
        select.innerHTML = `<option value="default">✨ Relevância</option><option value="az">A - Z</option><option value="za">Z - A</option><option value="random">🎲 Aleatório</option>`;
        
        wrapper.append(input, select);
        container.prepend(wrapper);

        const updateData = () => {
            const term = input.value.toLowerCase();
            const filter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
            
            let data = productsData;
            if (filter === 'favorites') data = data.filter(p => wishlist.includes(p.id));
            else if (filter === 'history') data = data.filter(p => recentHistory.includes(p.id));
            else if (filter !== 'all') data = data.filter(p => p.category === filter);

            if (term) data = data.filter(p => p.title.toLowerCase().includes(term) || p.category.includes(term));
            
            if (filter !== 'history') { // Ordenação
                if (currentSort === 'az') data.sort((a,b) => a.title.localeCompare(b.title));
                else if (currentSort === 'za') data.sort((a,b) => b.title.localeCompare(a.title));
                else if (currentSort === 'random') data.sort(() => Math.random() - 0.5);
                else data.sort((a,b) => a.id - b.id);
            } else {
                data.sort((a,b) => recentHistory.indexOf(a.id) - recentHistory.indexOf(b.id));
            }
            
            activeData = data;
            // Acha a galeria correta (Modal ou Home)
            const modal = input.closest('.expansion-content');
            resetAndRender(modal ? modal.querySelector('.gallery-5-cols') : galleryContainer);
        };

        input.addEventListener('input', () => { setTimeout(() => updateURL('busca', input.value || null), 500); updateData(); });
        select.addEventListener('change', (e) => { currentSort = e.target.value; updateData(); });
    }

    function initFilters() {
        const containers = document.querySelectorAll('.catalog-filters');
        containers.forEach(c => {
            if(!c.querySelector('[data-filter="favorites"]')) {
                c.innerHTML += `<button class="filter-btn" data-filter="favorites" style="color:#D00000;border-color:#D00000">♥ Favoritos</button>`;
                c.innerHTML += `<button class="filter-btn" data-filter="history" style="color:#241000;border-color:#241000">🕒 Vistos</button>`;
            }
        });

        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const btn = e.target;
                const filter = btn.dataset.filter;
                updateURL('filtro', filter);
                trackEvent('filter', filter);
                
                // Atualiza UI
                const wrapper = btn.closest('.catalog-filters');
                if(wrapper) { wrapper.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); }
                
                // Dispara atualização via input event para reaproveitar lógica
                document.getElementById('js-search-input').dispatchEvent(new Event('input'));
            }
        });
    }


    // =========================================================
    // 5. INTERAÇÕES & TOAST
    // =========================================================
    function showToast(msg) {
        const old = document.querySelector('.toast-notification'); if(old) old.remove();
        const toast = document.createElement('div'); toast.className = 'toast-notification'; toast.innerText = msg;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
    }

    function toggleWishlist(id, btn) {
        const idx = wishlist.indexOf(id);
        if (idx === -1) {
            wishlist.push(id); btn.classList.add('active'); showToast('Salvo em Favoritos ❤️');
            btn.style.transform = "scale(1.4)"; setTimeout(() => btn.style.transform = "scale(1)", 200);
            trackEvent('interaction', 'wishlist');
        } else {
            wishlist.splice(idx, 1); btn.classList.remove('active'); showToast('Removido dos Favoritos');
        }
        localStorage.setItem('darafa_wishlist', JSON.stringify(wishlist));
        // Se estiver no filtro favoritos, atualiza
        if(document.querySelector('.filter-btn.active')?.dataset.filter === 'favorites') {
            document.getElementById('js-search-input').dispatchEvent(new Event('input'));
        }
    }

    // Delegação Global de Cliques
    document.body.addEventListener('click', async (e) => {
        const btn = e.target;
        // Wishlist
        if (btn.classList.contains('wishlist-btn')) {
            e.stopPropagation();
            toggleWishlist(parseInt(btn.closest('.gold-framebox').dataset.id), btn);
            return;
        }
        // Share
        if (btn.classList.contains('share-btn')) {
            e.stopPropagation();
            const card = btn.closest('.gold-framebox');
            const url = `${window.location.origin}?filtro=${card.dataset.cat}`;
            const data = { title: 'DaRafa', text: card.dataset.title, url: url };
            try { if(navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(url); showToast('Link copiado!'); } } catch(err){}
            trackEvent('interaction', 'share');
            return;
        }
        // Card Click (Open Viewer)
        const card = btn.closest('.gold-framebox');
        if (card && !btn.closest('.expansion-overlay')) { // Se não for modal expandido
            // Lógica para abrir o modal de expansão (Portal) já existe no initPortal
            return; 
        }
        // Se já está no modal expandido e clica num card -> Zoom
        if (card && btn.closest('.expansion-overlay')) {
            const img = card.querySelector('img');
            openImageViewer(img.dataset.src || img.src, card.dataset.id);
            trackEvent('product_click', card.dataset.title);
        }
    });


    // =========================================================
    // 6. ACESSIBILIDADE GLOBAL (TECLADO & FOCUS TRAP) [NOVO]
    // =========================================================
    function initGlobalEvents() {
        // Keyboard Nav
        document.addEventListener('keydown', (e) => {
            if (document.querySelector('.image-viewer-overlay.active')) {
                if (e.key === 'ArrowRight') navigateViewer(1);
                if (e.key === 'ArrowLeft') navigateViewer(-1);
                if (e.key === 'Escape') return; // Fechamento já tratado
            }
            // Enter no card
            if (e.key === 'Enter' && document.activeElement.classList.contains('gold-framebox')) {
                document.activeElement.click();
            }
            // Focus Trap Logic
            if (currentModal && e.key === 'Tab') {
                trapFocus(e, currentModal);
            }
        });
    }

    // --- FOCUS TRAP (TAREFA 05) ---
    function trapFocus(e, modal) {
        const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusables.length === 0) return;
        
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) { 
            if (document.activeElement === first) { last.focus(); e.preventDefault(); }
        } else {
            if (document.activeElement === last) { first.focus(); e.preventDefault(); }
        }
    }

    // =========================================================
    // 7. MODAIS (UPDATED WITH TRAP & SWIPE)
    // =========================================================
    
    // Viewer Image
    function openImageViewer(src, id) {
        addToHistory(id);
        const product = productsData.find(p => p.id == id);
        if(product) setPageMetadata(product.title, product.description);
        
        // Encontra indice para slideshow
        const found = activeData.findIndex(p => p.id == id);
        if(found !== -1) currentViewerIndex = found;

        const content = `<img src="${src}" class="image-viewer-content" style="max-height:90vh;max-width:90%;border:1px solid #CD4A00;box-shadow:0 0 30px #000;">`;
        createOverlay(content, 'image-viewer');
    }

    function navigateViewer(dir) {
        if(activeData.length === 0) return;
        let idx = currentViewerIndex + dir;
        if(idx >= activeData.length) idx = 0;
        if(idx < 0) idx = activeData.length -1;
        currentViewerIndex = idx;
        
        const imgEl = document.querySelector('.image-viewer-content');
        if(imgEl) {
            imgEl.style.opacity = 0.5;
            setTimeout(() => {
                imgEl.src = activeData[idx].image;
                imgEl.onload = () => imgEl.style.opacity = 1;
                setPageMetadata(activeData[idx].title, activeData[idx].description);
                addToHistory(activeData[idx].id);
            }, 200);
        }
    }

    // Generic Overlay Creator
    function createOverlay(contentHTML, type) {
        const overlay = document.createElement('div');
        overlay.className = type === 'image-viewer' ? 'image-viewer-overlay' : 'expansion-overlay';
        overlay.innerHTML = `<button class="close-expansion" style="position:fixed;top:20px;right:30px;font-size:3rem;color:#D00000;background:none;border:none;cursor:pointer;z-index:2001;">&times;</button>
                             <div class="${type === 'image-viewer' ? '' : 'expansion-content'}">${contentHTML}</div>`;
        
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => overlay.classList.add('active'));
        
        // Ativa Focus Trap
        currentModal = overlay;
        const closeBtn = overlay.querySelector('button');
        if(closeBtn) closeBtn.focus();

        // Swipe Gesture
        let ty = 0;
        overlay.addEventListener('touchstart', e => ty = e.changedTouches[0].screenY, {passive:true});
        overlay.addEventListener('touchend', e => { if(e.changedTouches[0].screenY - ty > 60) close(); }, {passive:true});

        const close = () => {
            restorePageMetadata();
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            currentModal = null; // Libera Trap
            setTimeout(() => overlay.remove(), 400);
        };

        overlay.querySelector('.close-expansion').onclick = close;
        overlay.onclick = (e) => { if(e.target === overlay) close(); };
        
        // Se for o modal de expansão, precisa reinicializar controles lá dentro
        if (type !== 'image-viewer') {
            // Remove controles antigos clonados e cria novos
            const oldCtrls = overlay.querySelector('.controls-wrapper');
            if(oldCtrls) oldCtrls.remove();
            
            // Injeta controles novamente no modal (reutiliza initControls lógica se adaptada, 
            // mas aqui chamamos initControls que busca por classe e injeta. 
            // Como agora temos 2 .catalog-filters, ele vai injetar no segundo também)
            initControls(); // O script é inteligente para injetar onde falta
            
            // Inicia renderização do modal
            const gallery = overlay.querySelector('.gallery-5-cols');
            resetAndRender(gallery);
        }
    }

    // Portal Trigger
    document.querySelectorAll('.big-card-wrapper:not(.no-expand)').forEach(door => {
        door.addEventListener('click', (e) => {
            if(e.target.closest('.click-bar') || e.target.closest('.card-cover')) {
                e.preventDefault();
                const content = door.querySelector('.hidden-content').innerHTML;
                createOverlay(content, 'expansion');
            }
        });
    });
});
