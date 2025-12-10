// --- IMPORTANDO O FIREBASE (Direto da Nuvem) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- SUA CHAVE DE ACESSO ---
const firebaseConfig = {
  apiKey: "AIzaSyDnFiPNolgHVa53jhRreQo6pTVtOAGf1IE",
  authDomain: "darafa-store.firebaseapp.com",
  projectId: "darafa-store",
  storageBucket: "darafa-store.firebasestorage.app",
  messagingSenderId: "530277681068",
  appId: "1:530277681068:web:26bd0a20ad47ec5b8d1c09",
  measurementId: "G-ED1N4DPLP7"
};

// --- INICIANDO O SISTEMA ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Esse é o nosso Banco de Dados!

console.log("🔥 Firebase Conectado com Sucesso!");

/**
 * DaRafa Acessórios - Main Script...
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
    let isLowEndConnection = false;
    
    // Analytics Profundo
    let analyticsData = JSON.parse(localStorage.getItem('darafa_analytics')) || {
        views: 0, 
        searches: {}, 
        categoryClicks: {}, 
        productClicks: {}, 
        interactions: { wishlist: 0, share: 0, exit_shown: 0, exit_clicked: 0 },
        sectionsViewed: { hero: 0, catalogo: 0, atelier: 0, artista: 0 }
    };
    
    let currentSort = 'default';
    let activeData = []; 
    let loadedCount = 0; 
    let scrollSentinel; 
    let currentViewerIndex = -1;
    let currentViewerId = null;

    let originalTitle = document.title;
    let originalDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

    // --- FUNÇÕES DE ANALYTICS ---
    function trackEvent(type, label) {
        if (type === 'view') analyticsData.views++;
        if (type === 'search' && label) analyticsData.searches[label] = (analyticsData.searches[label] || 0) + 1;
        if (type === 'filter') analyticsData.categoryClicks[label] = (analyticsData.categoryClicks[label] || 0) + 1;
        if (type === 'product_click') analyticsData.productClicks[label] = (analyticsData.productClicks[label] || 0) + 1;
        if (type === 'interaction') {
            if (label.includes('exit')) {
                if(label === 'exit_intent_shown') analyticsData.interactions.exit_shown++;
                if(label === 'exit_intent_clicked') analyticsData.interactions.exit_clicked++;
            } else {
                analyticsData.interactions[label] = (analyticsData.interactions[label] || 0) + 1;
            }
        }
        if (type === 'section') analyticsData.sectionsViewed[label] = (analyticsData.sectionsViewed[label] || 0) + 1;
        
        saveAnalytics();
    }

    function saveAnalytics() {
        localStorage.setItem('darafa_analytics', JSON.stringify(analyticsData));
    }

    // Comando Secreto Global para o Console
    window.relatorio = () => {
        console.group('%cRELATÓRIO DARAFA', 'color: #FDB90C; font-size: 20px; background: #241000; padding: 10px; border-radius: 5px;');
        console.log(`Visitas Totais: ${analyticsData.views}`);
        console.log('Interações:', analyticsData.interactions);
        
        console.group('Top 5 Produtos');
        const sortedProducts = Object.entries(analyticsData.productClicks).sort((a,b) => b[1] - a[1]).slice(0,5);
        console.table(sortedProducts);
        console.groupEnd();

        console.group('Categorias Mais Buscadas');
        console.table(analyticsData.categoryClicks);
        console.groupEnd();

        console.group('Mapa de Calor (Seções)');
        console.table(analyticsData.sectionsViewed);
        console.groupEnd();
        
        console.groupEnd();
        return "Dados carregados com sucesso!";
    };
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
    // 1. PERFORMANCE & SEO
    // =========================================================
    function checkConnection() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            if (conn.saveData || conn.effectiveType.includes('2g')) {
                isLowEndConnection = true;
                console.log('DaRafa: Modo Econômico Ativado');
            }
        }
    }

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

    function initOfflineMode() {
        const style = document.createElement('style');
        style.innerHTML = `
            body.offline-mode { filter: grayscale(0.8); }
            body.offline-mode .toast-notification { filter: grayscale(0) !important; }
        `;
        document.head.appendChild(style);
        window.addEventListener('offline', () => { document.body.classList.add('offline-mode'); showToast('Você está offline. Modo leitura ativado.'); });
        window.addEventListener('online', () => {
            document.body.classList.remove('offline-mode');
            showToast('Conexão restaurada! Atualizando...');
            setTimeout(() => { document.querySelectorAll('img').forEach(img => { if (!img.complete || img.naturalWidth === 0) { const src = img.src; img.src = ''; img.src = src; } }); }, 1000);
        });
    }

// [NOVO] Banner de Consentimento LGPD (Design "Preguiça Zen" - Uiverse)
    function initCookieConsent() {
        // Verifica se já existe uma decisão salva (seja Aceite ou Recusa)
        if (localStorage.getItem('darafa_lgpd_status')) return;

        const banner = document.createElement('div');
        banner.className = 'cookie-card';
        
        // HTML da Ilustração + Texto (Traduzido e Funcional)
        banner.innerHTML = `
            <div class="cookie-illustration">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 46" height="46" width="65">
                    <path stroke="#241000" fill="#FDB90C" d="M49.157 15.69L44.58.655l-12.422 1.96L21.044.654l-8.499 2.615-6.538 5.23-4.576 9.153v11.114l4.576 8.5 7.846 5.23 10.46 1.96 7.845-2.614 9.153 2.615 11.768-2.615 7.846-7.846 1.96-5.884.655-7.191-7.846-1.308-6.537-3.922z"></path>
                    <path fill="#CD4A00" d="M32.286 3.749c-6.94 3.65-11.69 11.053-11.69 19.591 0 8.137 4.313 15.242 10.724 19.052a20.513 20.513 0 01-8.723 1.937c-11.598 0-21-9.626-21-21.5 0-11.875 9.402-21.5 21-21.5 3.495 0 6.79.874 9.689 2.42z" clip-rule="evenodd" fill-rule="evenodd"></path>
                    <path fill="#241000" d="M64.472 20.305a.954.954 0 00-1.172-.824 4.508 4.508 0 01-3.958-.934.953.953 0 00-1.076-.11c-.46.252-.977.383-1.502.382a3.154 3.154 0 01-2.97-2.11.954.954 0 00-.833-.634 4.54 4.54 0 01-4.205-4.507c.002-.23.022-.46.06-.687a.952.952 0 00-.213-.767 3.497 3.497 0 01-.614-3.5.953.953 0 00-.382-1.138 3.522 3.522 0 01-1.5-3.992.951.951 0 00-.762-1.227A22.611 22.611 0 0032.3 2.16 22.41 22.41 0 0022.657.001a22.654 22.654 0 109.648 43.15 22.644 22.644 0 0032.167-22.847zM22.657 43.4a20.746 20.746 0 110-41.493c2.566-.004 5.11.473 7.501 1.407a22.64 22.64 0 00.003 38.682 20.6 20.6 0 01-7.504 1.404zm19.286 0a20.746 20.746 0 112.131-41.384 5.417 5.417 0 001.918 4.635 5.346 5.346 0 00-.133 1.182A5.441 5.441 0 0046.879 11a5.804 5.804 0 00-.028.568 6.456 6.456 0 005.38 6.345 5.053 5.053 0 006.378 2.472 6.412 6.412 0 004.05 1.12 20.768 20.768 0 01-20.716 21.897z"></path>
                    <path fill="#241000" d="M54.962 34.3a17.719 17.719 0 01-2.602 2.378.954.954 0 001.14 1.53 19.637 19.637 0 002.884-2.634.955.955 0 00-1.422-1.274z"></path>
                    <path stroke-width="1.8" stroke="#241000" fill="#CD4A00" d="M44.5 32.829c-.512 0-1.574.215-2 .5-.426.284-.342.263-.537.736a2.59 2.59 0 104.98.99c0-.686-.458-1.241-.943-1.726-.485-.486-.814-.5-1.5-.5zm-30.916-2.5c-.296 0-.912.134-1.159.311-.246.177-.197.164-.31.459a1.725 1.725 0 00-.086.932c.058.312.2.6.41.825.21.226.477.38.768.442.291.062.593.03.867-.092s.508-.329.673-.594a1.7 1.7 0 00.253-.896c0-.428-.266-.774-.547-1.076-.281-.302-.471-.31-.869-.311zm17.805-11.375c-.143-.492-.647-1.451-1.04-1.78-.392-.33-.348-.255-.857-.31a2.588 2.588 0 10.441 5.06c.66-.194 1.064-.788 1.395-1.39.33-.601.252-.92.06-1.58zm-22 2c-.143-.492-.647-1.451-1.04-1.78-.391-.33-.347-.255-.856-.31a2.589 2.589 0 10.44 5.06c.66-.194 1.064-.788 1.395-1.39.33-.601.252-.92.06-1.58zM38.112 7.329c-.395 0-1.216.179-1.545.415-.328.236-.263.218-.415.611-.151.393-.19.826-.114 1.243.078.417.268.8.548 1.1.28.301.636.506 1.024.59.388.082.79.04 1.155-.123.366-.163.678-.438.898-.792.22-.354.337-.77.337-1.195 0-.57-.354-1.031-.73-1.434-.374-.403-.628-.415-1.158-.415zm-19.123.703c.023-.296-.062-.92-.219-1.18-.157-.26-.148-.21-.432-.347a1.726 1.726 0 00-.922-.159 1.654 1.654 0 00-.856.344 1.471 1.471 0 00-.501.73c-.085.285-.077.589.023.872.1.282.287.532.538.718a1.7 1.7 0 00.873.323c.427.033.793-.204 1.116-.46.324-.256.347-.445.38-.841z"></path>
                    <path fill="#241000" d="M15.027 15.605a.954.954 0 00-1.553 1.108l1.332 1.863a.955.955 0 001.705-.77.955.955 0 00-.153-.34l-1.331-1.861z"></path>
                    <path fill="#241000" d="M43.31 23.21a.954.954 0 101.553-1.11l-1.266-1.772a.954.954 0 10-1.552 1.11l1.266 1.772z"></path>
                    <path fill="#241000" d="M19.672 35.374a.954.954 0 00-.954.953v2.363a.954.954 0 001.907 0v-2.362a.954.954 0 00-.953-.954z"></path>
                    <path fill="#241000" d="M33.129 29.18l-2.803 1.065a.953.953 0 00-.053 1.764.957.957 0 00.73.022l2.803-1.065a.953.953 0 00-.677-1.783v-.003zm24.373-3.628l-2.167.823a.956.956 0 00-.054 1.764.954.954 0 00.73.021l2.169-.823a.954.954 0 10-.678-1.784v-.001z"></path>
                </svg>
            </div>
            
            <h5 class="cookie-title">Sua privacidade importa</h5>
            
            <p class="cookie-text">
                Nós usamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa Política de Privacidade.
            </p>
            
            <div class="cookie-actions">
                <button id="reject-cookies" class="cookie-btn-options">Recusar</button>
                <button id="accept-cookies" class="cookie-btn-accept">Aceitar</button>
            </div>
        `;
        
        // CSS Puro do Banner
        const style = document.createElement('style');
        style.innerHTML = `
            .cookie-card {
                position: fixed; bottom: 20px; right: 20px;
                width: 300px; max-width: 90%;
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 4px 6px -1px rgba(60,64,67,0.3), 0 2px 4px -1px rgba(60,64,67,0.15);
                padding: 24px;
                display: flex; flex-direction: column; align-items: center;
                z-index: 9999;
                font-family: 'Poppins', sans-serif;
                animation: slideUp 0.5s ease-out;
            }
            
            .cookie-illustration {
                margin-top: -64px;
                margin-bottom: 20px;
                filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
            }
            
            .cookie-title {
                font-size: 0.95rem; font-weight: 600; color: #241000;
                margin-bottom: 8px; text-align: left; width: 100%;
            }
            
            .cookie-text {
                font-size: 0.85rem; color: #555;
                text-align: justify; line-height: 1.5; margin-bottom: 16px;
                width: 100%;
            }
            
            .cookie-actions {
                width: 100%; display: flex; justify-content: space-between; align-items: center;
            }
            
            .cookie-btn-options {
                background: none; border: none; font-size: 0.85rem;
                font-weight: 600; color: #666; cursor: pointer;
                transition: color 0.2s;
            }
            .cookie-btn-options:hover { color: #D00000; text-decoration: underline; }
            
            .cookie-btn-accept {
                background: #FDB90C; color: #241000;
                border: none; padding: 8px 32px; border-radius: 8px;
                font-weight: 600; font-size: 0.85rem; cursor: pointer;
                transition: all 0.2s;
            }
            .cookie-btn-accept:hover {
                background: #241000; color: #FDB90C;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            }
            
            @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            
            @media(max-width: 600px) {
                .cookie-card { left: 50%; right: auto; transform: translateX(-50%); bottom: 10px; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(banner);

        // Função para remover o banner com animação
        const closeBanner = () => {
            banner.style.transition = 'all 0.5s ease';
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(20px)';
            setTimeout(() => banner.remove(), 500);
        };

        // 1. Botão ACEITAR (Salva 'accepted' e fecha)
        document.getElementById('accept-cookies').addEventListener('click', () => {
            localStorage.setItem('darafa_lgpd_status', 'accepted');
            closeBanner();
            trackEvent('interaction', 'lgpd_accept');
            showToast('Preferências salvas! Obrigado.');
        });

        // 2. Botão RECUSAR (Salva 'rejected' e fecha)
        document.getElementById('reject-cookies').addEventListener('click', () => {
            localStorage.setItem('darafa_lgpd_status', 'rejected');
            closeBanner();
            // Não trackeamos evento aqui para respeitar a privacidade, ou usamos um label genérico
            showToast('Cookies não essenciais desativados.');
        });
    }

    // =========================================================
    // 3. INICIALIZAÇÃO GERAL
    // =========================================================
    const galleryContainer = document.querySelector('#gallery-door .gallery-5-cols');
    
    // Observer de Lazy Load
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

    // Observer de Scroll Infinito
    const infiniteScrollObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            const sentinel = entries[0].target;
            const targetContainer = sentinel.parentNode ? sentinel.parentNode.querySelector('.gallery-5-cols') : galleryContainer;
            if (targetContainer) loadNextBatch(targetContainer);
        }
    }, { rootMargin: "200px" });

    // Observer de Seções (Analytics Scroll Spy)
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const sectionId = entry.target.id;
                // Mapeia IDs para nomes amigáveis
                const sectionName = sectionId === 'gallery-section' ? 'catalogo' : 
                                    sectionId === 'about-section' ? 'atelier' : 
                                    sectionId === 'artist-section' ? 'artista' : 'hero';
                trackEvent('section', sectionName);
            }
        });
    }, { threshold: 0.5 });

    if (galleryContainer) {
        checkConnection(); 
        initSEO();
        initOfflineMode();
        initCookieConsent();
        initCatalog();
        initFilters();
        initControls();
        injectDynamicStyles();
        
        // Ativa o Scroll Spy nas seções principais
        document.querySelectorAll('section, header').forEach(sec => sectionObserver.observe(sec));

        if(isLowEndConnection) {
            setTimeout(() => showToast('Modo Econômico ativado'), 2000);
        }

        setTimeout(loadStateFromURL, 100); 
        initKeyboardNavigation();
    }

    window.addEventListener('popstate', loadStateFromURL);

    // =========================================================
    // 4. EXIT INTENT
    // =========================================================
    function initExitIntent() {
        if (sessionStorage.getItem('darafa_exit_shown')) return;
        if (isLowEndConnection) return; 

        document.addEventListener('mouseleave', (e) => {
            if (e.clientY < 10 && !sessionStorage.getItem('darafa_exit_shown')) {
                showExitModal();
                sessionStorage.setItem('darafa_exit_shown', 'true');
                trackEvent('interaction', 'exit_intent_shown');
            }
        });
    }

    function showExitModal() {
        const overlay = document.createElement('div');
        overlay.className = 'exit-overlay';
        overlay.innerHTML = `
            <div class="exit-modal">
                <button class="close-exit">&times;</button>
                <div class="exit-content">
                    <h3>Espere!</h3>
                    <p>Não vá embora sem conferir nossos lançamentos exclusivos no Instagram.</p>
                    <a href="https://www.instagram.com/darafa_cwb/" target="_blank" class="exit-btn">Seguir @darafa_cwb</a>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('active'));

        const closeBtn = overlay.querySelector('.close-exit');
        const actionBtn = overlay.querySelector('.exit-btn');
        
        const close = () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 400);
        };

        closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if(e.target === overlay) close(); });
        actionBtn.addEventListener('click', () => {
            trackEvent('interaction', 'exit_intent_clicked');
            close();
        });
    }

    // =========================================================
    // 5. LÓGICA DE URL STATE & HISTORY
    // =========================================================
    function addToHistory(id) {
        recentHistory = recentHistory.filter(itemId => itemId !== id);
        recentHistory.unshift(id);
        if (recentHistory.length > 6) recentHistory.pop();
        localStorage.setItem('darafa_history', JSON.stringify(recentHistory));
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
        const id = urlParams.get('id');
        
        // [NOVO] Lógica para ler o Link Mágico do Pedido (Para a Rafa ver)
        const pedidoIds = urlParams.get('pedido');

        if (pedidoIds) {
            // Se tem pedido na URL, força o modo "Pedido Recebido"
            const ids = pedidoIds.split(',').map(Number);
            activeData = productsData.filter(p => ids.includes(p.id));
            
            // Atualiza o título da seção para avisar
            const title = document.querySelector('.section-title');
            if(title) title.innerText = "Itens do Pedido";
            
            // Limpa a busca e filtros visuais
            const input = document.getElementById('js-search-input');
            if(input) input.value = '';
            
            // Renderiza direto
            resetAndRender(galleryContainer);
            showToast('Visualizando itens selecionados pelo cliente');
            return; // Para aqui e não faz o resto
        }

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
            if(allBtn && !id) allBtn.click(); 
        }

        if (id) {
            const product = productsData.find(p => p.id == parseInt(id));
            if (product) {
                setTimeout(() => openImageViewer(product.image, product.id), 200);
            }
        }
    }

    // =========================================================
    // 6. RENDERIZAÇÃO DO CATÁLOGO
    // =========================================================
    // --- NOVA VERSÃO: Buscando do Banco de Dados ---
    async function initCatalog() {
        console.log("🔄 TENTANDO CONECTAR AO FIREBASE...");
        
        try {
            // 1. Acessa a coleção 'produtos'
            const produtosRef = collection(db, "produtos");
            const snapshot = await getDocs(produtosRef);
            
            const produtosDoBanco = [];

            // 2. Converte os dados
            snapshot.forEach(doc => {
                const dados = doc.data();
                produtosDoBanco.push({ ...dados });
            });

            // 3. Verifica se achou algo
            if (produtosDoBanco.length > 0) {
                console.log("✅ SUCESSO! Produtos vindos da Nuvem:", produtosDoBanco);
                activeData = produtosDoBanco; // Substitui os dados fixos
            } else {
                console.warn("⚠️ Banco vazio. Usando dados locais de teste.");
                activeData = [...productsData]; // Fallback
            }

        } catch (error) {
            console.error("❌ ERRO FATAL NO FIREBASE:", error);
            activeData = [...productsData]; // Proteção para o site não quebrar
        }

        // 4. Desenha na tela
        resetAndRender();
    }

    function resetAndRender(container = galleryContainer) {
        if (!container) return;
        container.innerHTML = ''; 
        loadedCount = 0; 
        if(scrollSentinel) { infiniteScrollObserver.unobserve(scrollSentinel); scrollSentinel.remove(); scrollSentinel = null; }
        if (activeData.length === 0) { container.innerHTML = '<p style="color:#FDB90C; text-align:center; width:100%; grid-column: 1/-1; padding: 20px;">Nada encontrado aqui ainda.</p>'; return; }
        loadNextBatch(container);
    }

    function loadNextBatch(container = galleryContainer) {
        if (loadedCount >= activeData.length) return;
        const nextBatch = activeData.slice(loadedCount, loadedCount + ITEMS_PER_PAGE);
        let htmlBuffer = '';
        nextBatch.forEach(item => {
            // [NOVO] Verifica se este item já está na lista de favoritos
            const isFav = wishlist.includes(item.id);
            // [NOVO] Se for favorito, cria o HTML do coraçãozinho, senão fica vazio
            const favMarker = isFav ? '<span class="fav-marker" style="position:absolute; top:8px; right:8px; color:#D00000; font-size:1.2rem; z-index:10; text-shadow:0 2px 5px rgba(0,0,0,0.5);">♥</span>' : '';

            htmlBuffer += `
                <div class="gold-framebox" tabindex="0" data-id="${item.id}" data-category="${item.category}" data-title="${item.title}" data-description="${item.description}">
                    ${favMarker} <img class="lazy-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="${item.image}" alt="${item.title}" style="transition: opacity 0.8s ease; opacity: 0;">
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
        manageSentinel(container);
    }

    function manageSentinel(container) {
        if (loadedCount < activeData.length) {
            if (scrollSentinel) { infiniteScrollObserver.unobserve(scrollSentinel); scrollSentinel.remove(); }
            scrollSentinel = document.createElement('div');
            scrollSentinel.id = 'scroll-sentinel';
            scrollSentinel.style.cssText = "width:100%; height:20px; grid-column: 1/-1; pointer-events: none;"; 
            if (container.parentNode) { container.parentNode.appendChild(scrollSentinel); infiniteScrollObserver.observe(scrollSentinel); }
        } else { if(scrollSentinel) { infiniteScrollObserver.unobserve(scrollSentinel); scrollSentinel.remove(); scrollSentinel = null; } }
    }

    // --- PREFETCH ADAPTATIVO ---
    function attachObserversAndPreload(container) {
        const images = container.querySelectorAll('.lazy-image:not(.observed)');
        images.forEach(img => { globalImageObserver.observe(img); img.classList.add('observed'); });
        
        if (!isLowEndConnection) {
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
    }

    // =========================================================
    // 7. ESTILOS & CONTROLES
    // =========================================================
    function injectDynamicStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* --- NAVBAR DO CATÁLOGO (ESTILO ILHA FLUTUANTE) --- */
            .catalog-navbar {
                position: sticky;
                top: 20px; 
                z-index: 500;
                width: 95%;
                max-width: 1000px;
                margin: 0 auto 30px auto; 
                background: #241000; 
                border: 1px solid #FDB90C;   
                box-shadow: 0 10px 40px rgba(0,0,0,0.8);
                display: flex;
                justify-content: space-between; 
                align-items: center;
                padding: 12px 20px;
                gap: 15px;
                border-radius: 50px; 
                transition: all 0.3s ease;
            }

            /* --- A NÉVOA MÁGICA (FADE MASK) --- */
            /* Isso cria um degradê no topo do modal que "come" os produtos */
            .expansion-overlay::after {
                content: '';
                position: fixed; /* Fica preso na tela */
                top: 0;
                left: 0;
                width: 100%;
                height: 120px; /* Altura da névoa (cobre a barra e um pouco mais) */
                
                /* O Degradê: Transparente embaixo -> Chocolate Sólido em cima */
                background: linear-gradient(to bottom, 
                    rgba(36, 16, 0, 1) 0%,    /* Topo Sólido (esconde tudo) */
                    rgba(36, 16, 0, 0.8) 60%, /* Começa a ficar transparente */
                    rgba(36, 16, 0, 0) 100%   /* Totalmente transparente */
                );
                
                z-index: 499; /* Fica ACIMA dos produtos (z=10) mas ABAIXO da Navbar (z=500) */
                pointer-events: none; /* Deixa clicar através na parte transparente */
            }

            /* O resto continua igual... */
            .catalog-actions { display: flex; align-items: center; gap: 10px; }

            #js-search-input {
                padding: 10px 20px; width: 100%; max-width: 250px;
                border-radius: 50px; border: 1px solid #4a2500;
                background: rgba(255, 255, 255, 0.05); color: #FDB90C;
                font-size: 0.95rem; outline: none; transition: all 0.3s ease;
            }
            #js-search-input:focus {
                background: rgba(255, 255, 255, 0.1); border-color: #FDB90C;
                box-shadow: 0 0 15px rgba(253, 185, 12, 0.2);
            }
            #js-search-input::placeholder { color: rgba(253, 185, 12, 0.5); }

            #js-sort-select {
                padding: 10px 20px; border-radius: 50px;
                border: 1px solid #FDB90C; background: #241000;
                color: #FDB90C; font-size: 0.9rem; font-weight: 600;
                cursor: pointer; outline: none; text-align: center;
                transition: all 0.3s ease;
            }
            #js-sort-select:hover { background: #3a1a00; transform: translateY(-2px); }

            .btn-insta-order {
                padding: 10px 25px; border-radius: 50px; border: none;
                background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
                color: #fff; font-size: 0.9rem; font-weight: 600;
                cursor: pointer; display: flex; align-items: center; gap: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: transform 0.2s ease;
                white-space: nowrap;
            }
            .btn-insta-order:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(220, 39, 67, 0.4); }

            @media (max-width: 768px) {
                .catalog-navbar {
                    flex-direction: column; padding: 20px; border-radius: 20px;
                    width: 90%; gap: 15px; top: 10px;
                }
                /* Ajuste da névoa no mobile */
                .expansion-overlay::after { height: 180px; } /* Mais alta pq a barra é maior */
                
                #js-search-input { max-width: 100%; }
                .catalog-actions { width: 100%; flex-direction: column; gap: 10px; }
                #js-sort-select, .btn-insta-order { width: 100%; justify-content: center; }
            }

            .toast-notification {
                position: fixed; top: 20px; left: 50%; 
                transform: translateX(-50%) translateY(-100px);
                background-color: #241000; color: #FDB90C; padding: 12px 24px;
                border-radius: 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                font-family: 'Poppins', sans-serif; font-size: 0.9rem; font-weight: 500;
                z-index: 10000; opacity: 0; 
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex; align-items: center; gap: 8px; border: 1px solid #FDB90C;
            }
            .toast-notification.show { transform: translateX(-50%) translateY(0); opacity: 1; }
        `;
        document.head.appendChild(style);
    }

    // Função de Toast Atualizada (Aceita classe extra)
    function showToast(message, customClass = '') {
        const oldToast = document.querySelector('.toast-notification');
        if(oldToast) oldToast.remove();
        
        const toast = document.createElement('div');
        // Aqui ele junta a classe padrão + a classe nova (se houver)
        toast.className = `toast-notification ${customClass}`; 
        toast.innerHTML = message;
        
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        
        setTimeout(() => { 
            toast.classList.remove('show'); 
            setTimeout(() => toast.remove(), 400); 
        }, 3000);
    }

    function attachCardEvents(container) { } 

    function initFilters() {
        const injectButtons = (container) => { }; 
        const filterContainers = document.querySelectorAll('.catalog-filters');
        
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const button = e.target;
                const filterValue = button.dataset.filter;
                updateURL('filtro', filterValue);
                trackEvent('filter', filterValue);
                const searchInput = document.getElementById('js-search-input');
                if (searchInput) searchInput.value = '';
                const container = button.closest('.catalog-filters');
                if(container) { container.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active')); button.classList.add('active'); }
                
                if (filterValue === 'all') activeData = productsData;
                else activeData = productsData.filter(item => item.category === filterValue);
                
                activeData = applySort(activeData);
                const modalContent = button.closest('.expansion-content');
                const targetGallery = modalContent ? modalContent.querySelector('.gallery-5-cols') : galleryContainer;
                resetAndRender(targetGallery);
            }
        });
    }

    // --- FUNÇÃO DE ENCOMENDA (Lógica "Copiar e Colar") ---
    function sendFavoritesToInsta() {
        if (wishlist.length === 0) {
            showToast('Sua lista de desejos está vazia!');
            return;
        }
        
        // 1. Pega os produtos favoritados
        const selectedItems = productsData.filter(p => wishlist.includes(p.id));
        
        // 2. Monta o texto bonito
        let message = "Olá Rafa! Separei essas peças na minha Wishlist:\n\n";
        selectedItems.forEach(item => {
            message += ` ${item.title} (Ref: ${item.id})\n`;
        });
        message += "\nComo faço para encomendar?";

        // 3. Copia para a área de transferência e abre o Insta
        navigator.clipboard.writeText(message).then(() => {
            showToast('Pedido copiado! Cole no Direct da Rafa.');
            setTimeout(() => {
                // Abre direto no perfil (ou na DM se preferir, mas perfil é mais seguro em mobile)
                window.open('https://instagram.com/darafa_cwb', '_blank');
            }, 1500); // Espera 1.5s para o usuário ler o aviso
        }).catch(err => {
            console.error('Erro ao copiar', err);
            showToast('Erro ao copiar. Tente novamente.');
        });
        
        trackEvent('interaction', 'click_order_insta');
    }

    function initControls() {
        const filterContainer = document.querySelector('.catalog-filters');
        if (!filterContainer) return;
        
        const controlsWrapper = document.createElement('div');
        controlsWrapper.className = 'controls-wrapper';
        
        // 1. Barra de Busca
        const input = document.createElement('input');
        input.type = 'text'; 
        input.id = 'js-search-input'; 
        input.placeholder = 'Buscar joia...';
        input.addEventListener('focus', () => input.style.borderColor = '#CD4A00');
        input.addEventListener('blur', () => input.style.borderColor = '#241000');
        
        // 2. Seletor de Ordem (Menu)
        const sortSelect = document.createElement('select');
        sortSelect.id = 'js-sort-select';
        sortSelect.innerHTML = `<option value="default">Relevância</option><option value="az">A - Z</option><option value="za">Z - A</option><option value="favorites">Favoritos</option>`;
        
        // --- 3. NOVO: Botão de Encomenda ---
        const orderBtn = document.createElement('button');
        orderBtn.className = 'btn-insta-order';
        orderBtn.innerHTML = '<i class="fab fa-instagram"></i> Encomendar';
        orderBtn.onclick = sendFavoritesToInsta; // Liga o botão à função

        // Adiciona na ordem: Busca -> Select -> Botão
        controlsWrapper.appendChild(input);
        controlsWrapper.appendChild(sortSelect);
        controlsWrapper.appendChild(orderBtn); // <--- Adicionado aqui
        
        // Coloca tudo na tela
        filterContainer.prepend(controlsWrapper); 
        
        // 4. Atualização do Grid (Busca e Filtros)
        const updateGridData = () => {
            const term = input.value.toLowerCase();
            let filtered = productsData;
            
            // Filtra por termo de busca
            if (term) {
                if(term.length > 3) trackEvent('search', term);
                filtered = filtered.filter(item => item.title.toLowerCase().includes(term) || item.description.toLowerCase().includes(term) || item.category.toLowerCase().includes(term));
            }
            
            // Aplica ordenação ou filtro de favoritos
            filtered = applySort(filtered);
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
            case 'az': 
                sortedItems.sort((a, b) => a.title.localeCompare(b.title)); 
                break;
            case 'za': 
                sortedItems.sort((a, b) => b.title.localeCompare(a.title)); 
                break;
            case 'favorites': 
                sortedItems = sortedItems.filter(item => wishlist.includes(item.id));
                // Se não tiver nada, avisa (opcional, pois o botão já avisa também)
                if (sortedItems.length === 0 && items.length > 0) {
                    showToast('Você ainda não favoritou nada');
                }
                break;
            default: 
                sortedItems.sort((a, b) => a.id - b.id);
        }
        return sortedItems;
    }

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
        currentViewerId = nextItem.id;

        const viewerImg = document.querySelector('.image-viewer-content');
        if (viewerImg) {
            viewerImg.style.opacity = 0.5;
            setTimeout(() => { viewerImg.src = nextItem.image; viewerImg.onload = () => viewerImg.style.opacity = 1; }, 200);
            setPageMetadata(nextItem.title, nextItem.description);
            addToHistory(nextItem.id); 
            updateURL('id', nextItem.id);
            
            const favBtn = document.querySelector('.viewer-btn.fav-btn');
            if(favBtn) {
                if(wishlist.includes(nextItem.id)) favBtn.classList.add('active');
                else favBtn.classList.remove('active');
            }
        }
    }

    function shareProductById(id) {
        const product = productsData.find(p => p.id == id);
        if(!product) return;
        const shareUrl = `${window.location.origin}${window.location.pathname}?id=${product.id}`;
        trackEvent('interaction', 'share');
        const shareData = { title: `DaRafa: ${product.title}`, text: `Olha essa joia: ${product.title}`, url: shareUrl };
        try { if (navigator.share) navigator.share(shareData); else { navigator.clipboard.writeText(shareUrl); showToast('Link copiado! 📋'); } } catch (err) { console.warn('Erro share', err); }
    }

// [ATUALIZAÇÃO] Lógica de Sincronia Real-Time (Modal -> Mini-Card)
    function toggleWishlistById(id, btnElement) {
        const index = wishlist.indexOf(id);
        
        // CORREÇÃO: Usamos querySelectorAll para pegar TODAS as cópias do card
        // (tanto o original oculto quanto o visível no modal)
        const galleryCards = document.querySelectorAll(`.gold-framebox[data-id="${id}"]`);

        if (index === -1) {
            // Adicionar
            wishlist.push(id);
            btnElement.classList.add('active');
            showToast('Adicionado aos Favoritos');
            trackEvent('interaction', 'wishlist_add');
            
            // Atualiza VISUALMENTE todos os cards encontrados (Ocultos e Visíveis)
            galleryCards.forEach(card => {
                if (!card.querySelector('.fav-marker')) {
                    card.insertAdjacentHTML('afterbegin', '<span class="fav-marker" style="position:absolute; top:8px; right:8px; color:#D00000; font-size:1.2rem; z-index:10; text-shadow:0 2px 5px rgba(0,0,0,0.5);">♥</span>');
                }
            });
        } else {
            // Remover
            wishlist.splice(index, 1);
            btnElement.classList.remove('active');
            showToast('Removido dos Favoritos');
            trackEvent('interaction', 'wishlist_remove');

            // Remove o marcador de todos os cards encontrados
            galleryCards.forEach(card => {
                const marker = card.querySelector('.fav-marker');
                if (marker) marker.remove();
            });
        }
        localStorage.setItem('darafa_wishlist', JSON.stringify(wishlist));
    }

    // --- MODALS (Viewer e Story) ---
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) { func.apply(context, args); inThrottle = true; setTimeout(() => inThrottle = false, limit); }
        }
    }

    const backToTopBtn = document.getElementById('backToTop');
    const contactSection = document.getElementById('contact');
    
    if(backToTopBtn && contactSection) {
        window.addEventListener('scroll', throttle(() => {
            // Calcula onde a seção de contato começa
            const contactPosition = contactSection.offsetTop;
            // Pega a posição atual do scroll + altura da janela (para saber se o rodapé está visível)
            const scrollPosition = window.scrollY + window.innerHeight;

            // Se o scroll chegou perto do rodapé (ex: 100px antes), mostra o botão
            if (scrollPosition >= contactPosition - 100) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 100), { passive: true });
    }

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

        // --- CONSTRUÇÃO DA NOVA NAVBAR DO CATÁLOGO ---
        // Verifica se estamos abrindo o Catálogo (procura pelos filtros antigos para confirmar)
        const modalFiltersPlaceholder = overlay.querySelector('.catalog-filters');
        
        if(modalFiltersPlaceholder) {
             // 1. Cria a Navbar Container (A barra chocolate fixa)
             const navbar = document.createElement('nav');
             navbar.className = 'catalog-navbar';
             
             // 2. Elemento da Esquerda: Busca
             const input = document.createElement('input');
             input.id = 'js-search-input';
             input.type = 'text';
             input.placeholder = '🔍 Buscar joia...';
             
             // 3. Container da Direita: Ações (Select + Botão Insta)
             const actionsDiv = document.createElement('div');
             actionsDiv.className = 'catalog-actions';

             // 3a. Select de Filtros (Todos, A-Z, Favoritos)
             const sortSelect = document.createElement('select');
             sortSelect.id = 'js-sort-select';
             sortSelect.innerHTML = `
                <option value="default">✨ Todos</option>
                <option value="az">A - Z</option>
                <option value="za">Z - A</option>
                <option value="favorites">♥ Favoritos</option>
             `;

             // 3b. Botão Encomendar (Instagram)
             const orderBtn = document.createElement('button');
             orderBtn.className = 'btn-insta-order';
             orderBtn.innerHTML = '<i class="fab fa-instagram"></i> Encomendar';
             orderBtn.onclick = sendFavoritesToInsta; // Liga a função de copiar pedido

             // Monta o lado direito
             actionsDiv.appendChild(sortSelect);
             actionsDiv.appendChild(orderBtn);

             // Monta a Navbar completa
             navbar.appendChild(input);      // Esquerda
             navbar.appendChild(actionsDiv); // Direita
             
             // 4. INJEÇÃO NO TOPO (A Mágica)
             // Inserimos a navbar ANTES de qualquer coisa dentro do conteúdo
             const contentMain = overlay.querySelector('.expansion-content');
             contentMain.insertBefore(navbar, contentMain.firstChild);
             
             // 5. Limpeza: Esconde a barra antiga que veio do HTML estático
             const oldBar = overlay.querySelector('.catalog-controls-bar');
             if(oldBar) oldBar.style.display = 'none';
             if(modalFiltersPlaceholder) modalFiltersPlaceholder.style.display = 'none';

             // --- LÓGICA DE FILTRAGEM (Reativada para os novos elementos) ---
             const updateModal = () => {
                 const term = input.value.toLowerCase();
                 let filtered = productsData;
                 
                 // Filtra por texto
                 if (term) {
                    filtered = filtered.filter(item => 
                        item.title.toLowerCase().includes(term) || 
                        item.category.toLowerCase().includes(term)
                    );
                 }
                 
                 // Aplica ordenação/favoritos
                 // (Precisamos atualizar a variável global currentSort com o valor deste select novo)
                 currentSort = sortSelect.value;
                 filtered = applySort(filtered);
                 
                 // Atualiza a grid
                 activeData = filtered;
                 const targetGallery = overlay.querySelector('.gallery-5-cols');
                 resetAndRender(targetGallery);
             };

             // Liga os eventos
             input.addEventListener('input', updateModal);
             sortSelect.addEventListener('change', updateModal);

             // Renderiza inicial
             const targetGallery = overlay.querySelector('.gallery-5-cols');
             resetAndRender(targetGallery);
        }

        // --- PREPARAÇÃO DAS IMAGENS (Lazy Load no Modal) ---
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
        
        // --- CLIQUES NOS CARDS (Abrir Zoom) ---
        overlay.addEventListener('click', (e) => {
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
            updateURL('id', null);
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
        currentViewerId = parseInt(id);

        updateURL('id', currentViewerId);

        const isFav = wishlist.includes(currentViewerId) ? 'active' : '';

        createViewerOverlay(`
            <div class="viewer-image-wrapper" style="position: relative; display: inline-block; max-height:90vh; max-width:90%;">
                <img src="${imageSrc}" class="image-viewer-content" style="width:100%; height:auto; display:block; border:1px solid var(--color-gold-dark); box-shadow: 0 0 30px rgba(0,0,0,0.8);">
                
                <div class="viewer-actions">
                    <button class="viewer-btn share-btn" aria-label="Compartilhar">➦</button>
                    <button class="viewer-btn fav-btn ${isFav}" aria-label="Favoritar">♥</button>
                </div>
            </div>
        `);
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

        const favBtn = viewer.querySelector('.fav-btn');
        const shareBtn = viewer.querySelector('.share-btn');

        if(favBtn) favBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleWishlistById(currentViewerId, favBtn); });
        if(shareBtn) shareBtn.addEventListener('click', (e) => { e.stopPropagation(); shareProductById(currentViewerId); });

        let touchStartY = 0; let touchEndY = 0;
        viewer.addEventListener('touchstart', e => { touchStartY = e.changedTouches[0].screenY; }, {passive: true});
        viewer.addEventListener('touchend', e => { touchEndY = e.changedTouches[0].screenY; if (touchEndY - touchStartY > 60) closeViewer(); }, {passive: true});

        const closeViewer = () => {
            restorePageMetadata(); 
            updateURL('id', null);
            viewer.classList.remove('active');
            setTimeout(() => { if(viewer.parentNode) viewer.parentNode.removeChild(viewer); }, 300);
        };
        viewer.querySelector('.close-viewer').addEventListener('click', closeViewer);
        viewer.addEventListener('click', (e) => { if(e.target === viewer) closeViewer(); });
        const closeViewerOnEsc = (e) => { if (e.key === 'Escape') { closeViewer(); document.removeEventListener('keydown', closeViewerOnEsc); } };
        document.addEventListener('keydown', closeViewerOnEsc);
    }
    
});
