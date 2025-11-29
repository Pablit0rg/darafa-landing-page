/**
 * DaRafa Acessórios - Main Script (Final + Lazy Loading Avançado)
 * Funcionalidades:
 * 1. Integração API Instagram (Com Lazy Loading)
 * 2. Fallback: Catálogo Automático (Com Lazy Loading)
 * 3. Menu Mobile, Scroll, Modais e UX
 * 4. Performance: Intersection Observer para imagens
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // CONFIGURAÇÃO DO INSTAGRAM
    // =========================================================
    const INSTAGRAM_TOKEN = ''; // Cole o Token aqui no futuro
    const POSTS_LIMIT = 50; 

    // =========================================================
    // 1. CONTROLE DE CONTEÚDO E LAZY LOADING
    // =========================================================
    const galleryContainer = document.querySelector('#gallery-door .gallery-5-cols');
    
    if (galleryContainer) {
        initCatalog();
    }

    async function initCatalog() {
        if (INSTAGRAM_TOKEN) {
            try {
                await fetchInstagramPosts();
            } catch (error) {
                console.warn("Falha ao carregar Instagram. Usando backup...", error);
                generatePlaceholderCatalog();
            }
        } else {
            generatePlaceholderCatalog();
        }
        
        // INICIA O OBSERVADOR APÓS GERAR OS CARDS
        initLazyObserver();
    }

    // --- A. FUNÇÃO QUE BUSCA DO INSTAGRAM ---
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

            // USO DE DATA-SRC PARA O LAZY LOAD
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

    // --- B. FUNÇÃO QUE GERA PLACEHOLDERS (BACKUP) ---
    function generatePlaceholderCatalog() {
        galleryContainer.innerHTML = '';
        for (let i = 1; i <= 50; i++) {
            // USO DE DATA-SRC PARA O LAZY LOAD
            const cardHTML = `
                <div class="gold-framebox">
                    <img 
                        class="lazy-image" 
                        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                        data-src="https://placehold.co/300x400/0e0e0e/C6A36B?text=Joia+${i}" 
                        alt="Joia ${i} da Coleção"
                        style="transition: opacity 0.5s ease; opacity: 0;"
                    >
                    <div class="card-info-bar">
                        <h3 class="info-title">Joia Exclusiva ${i}</h3>
                        <p class="info-desc">Design artesanal em arame dourado, peça única da coleção DaRafa.</p>
                    </div>
                </div>
            `;
            galleryContainer.innerHTML += cardHTML;
        }
    }

    // --- C. O OBSERVADOR DE IMAGENS (LAZY LOADER) ---
    function initLazyObserver() {
        const lazyImages = document.querySelectorAll('.lazy-image');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Troca o placeholder pela imagem real
                    img.src = img.dataset.src;
                    
                    // Quando carregar, faz aparecer suavemente
                    img.onload = () => {
                        img.style.opacity = 1;
                    };
                    
                    // Para de observar esta imagem (já carregou)
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: "50px 0px", // Carrega um pouco antes de aparecer na tela
            threshold: 0.01
        });

        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    }


    // =========================================================
    // 2. MENU MOBILE
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

    document.addEventListener('click', (e) => {
        if (navbarMenu && navbarMenu.classList.contains('active') && 
            !navbarMenu.contains(e.target) && 
            !navbarToggler.contains(e.target)) {
            toggleMenu();
        }
    });


    // =========================================================
    // 3. BOTÃO VOLTAR AO TOPO
    // =========================================================
    const backToTopBtn = document.getElementById('backToTop');

    if(backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backToTopBtn.classList.add('visible');
            else backToTopBtn.classList.remove('visible');
        });
    }


    // =========================================================
    // 4. A MÁGICA: EXPANSÃO DOS CARDS (PORTAL)
    // =========================================================
    const doors = document.querySelectorAll('.big-card-wrapper:not(.no-expand)');
    const body = document.body;

    doors.forEach(door => {
        door.addEventListener('click', function(e) {
            e.preventDefault();
            const hiddenContentDiv = this.querySelector('.hidden-content');
            
            if (hiddenContentDiv) {
                // Clona o conteúdo e reativa o Lazy Loading dentro do Modal
                // (Pois os elementos clonados precisam de novos observadores)
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

        // --- REATIVAR LAZY LOAD DENTRO DO MODAL ---
        // Como o HTML foi injetado agora, precisamos observar as novas imagens
        const modalImages = overlay.querySelectorAll('.lazy-image');
        if(modalImages.length > 0) {
            const modalObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.onload = () => { img.style.opacity = 1; };
                        observer.unobserve(img);
                    }
                });
            }, { root: overlay, rootMargin: "50px" }); // root é o overlay (que tem scroll)
            
            modalImages.forEach(img => modalObserver.observe(img));
        }

        // --- RE-BIND NOS MINI CARDS (CLIQUES) ---
        const miniCards = overlay.querySelectorAll('.gold-framebox');
        miniCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                const img = card.querySelector('img');
                
                if (card.dataset.description) {
                    openStoryMode(img.dataset.src || img.src, card.dataset.title, card.dataset.description);
                } else {
                    if(img) openImageViewer(img.dataset.src || img.src);
                }
            });
        });

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
        
        const closeOnEsc = (e) => {
            if (e.key === 'Escape' && !document.querySelector('.image-viewer-overlay.active')) {
                close();
                document.removeEventListener('keydown', closeOnEsc);
            }
        };
        document.addEventListener('keydown', closeOnEsc);
    }


    // =========================================================
    // 5. MODAIS DE DETALHE
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
