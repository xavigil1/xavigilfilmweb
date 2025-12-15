document.addEventListener('DOMContentLoaded', function() {
    // ... (Tu código existente para el menú y scroll suave va aquí) ...

    // ===============================================
    // NUEVA FUNCIONALIDAD: VERTICAL REELS CAROUSEL
    // ===============================================

    const reelData = [
        {
            id: 1,
            title: "¿Ajo para el Acné? 🧄👀",
            thumbnail: "https://via.placeholder.com/350x622/D62424/FFFFFF?text=Reel+1", // REEMPLAZAR con tus URLs
            url: "https://www.instagram.com/reel/DM_sJwuulJq/"
        },
        {
            id: 2,
            title: "PIEZAS SIMPLES hacen GRANDES ESTILOS",
            thumbnail: "https://via.placeholder.com/350x622/333333/FFFFFF?text=Reel+2",
            url: "https://www.tiktok.com/@xaviergil.fc/video/7578566621082553611"
        },
        {
            id: 3,
            title: "Hora de BOUNCY ATEEZ DANCE COVER 🔥🇰🇷",
            thumbnail: "https://via.placeholder.com/350x622/D62424/FFFFFF?text=Reel+3",
            url: "https://www.instagram.com/reel/DR-y1rSAZM4/"
        },
        {
            id: 4,
            title: "¿Que harías en una noche en Corea del Sur? 🇰🇷🌃",
            thumbnail: "https://via.placeholder.com/350x622/333333/FFFFFF?text=Reel+4",
            url: "https://www.youtube.com/shorts/fi8vxSwEuf4"
        },
        {
            id: 5,
            title: "Rutina de skincare express con Mixsoon",
            thumbnail: "https://via.placeholder.com/350x622/D62424/FFFFFF?text=Reel+5",
            url: "https://www.instagram.com/reel/DKgVhiftimR/"
        },
        {
            id: 6,
            title: "Visitando Miniso en Venezuela",
            thumbnail: "https://via.placeholder.com/350x622/333333/FFFFFF?text=Reel+6",
            url: "https://www.tiktok.com/@xaviergil.fc/video/7531916085172456709"
        },
        {
            id: 7,
            title: "4 K-dramas Clasicos que debes ver 🇰🇷❤️",
            thumbnail: "https://via.placeholder.com/350x622/D62424/FFFFFF?text=Reel+7",
            url: "https://www.youtube.com/shorts/9qRTQ8bpEn8"
        }
    ];

    const reelWrapper = document.getElementById('reel-items-wrapper');
    let scrollInterval;
    const scrollSpeed = 2; // Pixeles a desplazar por intervalo

    if (reelWrapper) {
        
        // Helper: extraer id de YouTube (soporta diversos formatos: youtu.be, watch?v=, shorts, embed)
        const extractYouTubeId = (url) => {
            const ytRegex = /(?:v=|v\/|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/i;
            const m = url.match(ytRegex);
            return m ? m[1] : null;
        };

        // Helper: intentar obtener thumbnail vía oEmbed para algunos proveedores
        const fetchOEmbedThumbnail = async (url) => {
            try {
                // TikTok oEmbed
                if (/tiktok\.com/.test(url)){
                    const res = await fetch('https://www.tiktok.com/oembed?url=' + encodeURIComponent(url));
                    if(res.ok){ const j = await res.json(); if(j.thumbnail_url) return j.thumbnail_url; }
                }

                // Instagram oEmbed (public posts) - puede fallar por CORS si Instagram lo restringe
                if (/instagram\.com/.test(url)){
                    const res = await fetch('https://api.instagram.com/oembed?url=' + encodeURIComponent(url));
                    if(res.ok){ const j = await res.json(); if(j.thumbnail_url) return j.thumbnail_url; }
                }

                // Generic oEmbed attempt (some providers support /oembed)
                const genericProviders = ['https://vimeo.com/oembed.json?url=', 'https://www.youtube.com/oembed?url='];
                for(const p of genericProviders){
                    try{
                        const res = await fetch(p + encodeURIComponent(url));
                        if(res.ok){ const j = await res.json(); if(j.thumbnail_url) return j.thumbnail_url; }
                    }catch(e){ /* ignore */ }
                }
            } catch(err){
                // fallo silencioso — probablemente CORS o bloqueo del proveedor
            }
            return null;
        };

        // Actualizar la miniatura de un <img> dado la URL del video
        const updateThumbnailForImg = async (imgEl, videoUrl, fallback) => {
            // Prioridad: YouTube constructed thumbnail (no CORS), luego oEmbed
            const ytId = extractYouTubeId(videoUrl);
            if(ytId){
                const hi = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
                const low = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                // Probar maxresfirst; si falla, fallback a hqdefault (onerror handler)
                imgEl.onerror = () => { if(imgEl.src !== low) imgEl.src = low; };
                imgEl.src = hi;
                return;
            }

            // intentar oEmbed
            const thumb = await fetchOEmbedThumbnail(videoUrl);
            if(thumb){
                imgEl.onerror = null;
                imgEl.src = thumb;
                return;
            }

            // Si todo falla, usar la miniatura proporcionada en el array o un placeholder
            imgEl.onerror = null;
            imgEl.src = fallback || 'https://via.placeholder.com/350x622/cccccc/000000?text=No+thumbnail';
        };

        // Función para renderizar el HTML de los reels (inserta y luego actualiza thumbnails asíncronamente)
        const renderReels = () => {
            reelData.forEach(video => {
                const itemHTML = `
                    <a 
                        href="${video.url}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="reel-item"
                        role="listitem"
                        tabindex="0"
                        aria-label="Ver: ${video.title}"
                        data-aos="zoom-in" 
                        data-aos-duration="500"
                    >
                        <div class="reel-content" data-video-id="${video.id}">
                                            <img loading="lazy" src="${video.thumbnail || 'https://via.placeholder.com/350x622/cccccc/000000?text=Loading'}" alt="${video.title}">
                            <div class="reel-overlay">
                                <h3>${video.title}</h3>
                            </div>
                            <div class="play-icon"><i class="fas fa-play-circle"></i></div>
                        </div>
                    </a>
                `;
                reelWrapper.insertAdjacentHTML('beforeend', itemHTML);
                // after insert, update the image src if a better thumbnail can be fetched
                const lastImg = reelWrapper.querySelector('.reel-item:last-child img');
                if(lastImg){
                    updateThumbnailForImg(lastImg, video.url, video.thumbnail);
                }
            });
        };

        // Autoscroll por ITEM (snap estricto): avanza exactamente la altura de un item
        const startAutoScroll = (delay = 2800) => {
            // limpia intervalos previos
            if (scrollInterval) clearInterval(scrollInterval);

            const items = Array.from(reelWrapper.querySelectorAll('.reel-item'));
            if (!items.length) return;

            let currentIndex = 0;

            const computeItemHeight = () => {
                if (items.length >= 2) {
                    const t0 = items[0].getBoundingClientRect().top;
                    const t1 = items[1].getBoundingClientRect().top;
                    return Math.abs(t1 - t0);
                }
                return items[0].getBoundingClientRect().height;
            };

            const itemHeight = computeItemHeight();
            const maxScroll = reelWrapper.scrollHeight - reelWrapper.clientHeight;

            const scrollToIndex = (idx) => {
                const top = Math.max(0, Math.min(maxScroll, Math.round(idx * itemHeight)));
                reelWrapper.scrollTo({ top, behavior: 'smooth' });
                currentIndex = Math.round(top / itemHeight);
            };

            const next = () => {
                const nextIndex = (currentIndex + 1) % items.length;
                // si el siguiente excede maxScroll, reiniciar al inicio
                const targetTop = Math.round(nextIndex * itemHeight);
                if (targetTop > maxScroll) {
                    scrollToIndex(0);
                } else {
                    scrollToIndex(nextIndex);
                }
            };

            // Mantener currentIndex actualizado si el usuario hace scroll manual
            let scrollTimeout;
            reelWrapper.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const idx = Math.round(reelWrapper.scrollTop / itemHeight);
                    currentIndex = Math.max(0, Math.min(items.length - 1, idx));
                }, 120);
            }, { passive: true });

            // Iniciar intervalo
            scrollInterval = setInterval(next, delay);
        };
        
        // Manejadores de Hover para pausar el scroll
        // Pause on hover, touch, and focus for accessibility/mobile
        reelWrapper.addEventListener('mouseenter', () => { clearInterval(scrollInterval); });
        reelWrapper.addEventListener('mouseleave', () => { startAutoScroll(); });

        // Touch handlers for mobile: pause on touchstart, resume on touchend
        reelWrapper.addEventListener('touchstart', (e) => { clearInterval(scrollInterval); }, { passive: true });
        reelWrapper.addEventListener('touchend', (e) => { startAutoScroll(); });

        // Keyboard accessibility: pause when a child receives focus
        reelWrapper.addEventListener('focusin', () => { clearInterval(scrollInterval); });
        reelWrapper.addEventListener('focusout', () => { startAutoScroll(); });

        // Inicializar la sección
        renderReels();
        // Ajustar tamaño de los contenedores para asegurar proporción 9:16 en navegadores sin soporte
        const debounce = (fn, wait = 100) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); }; };

        const applyAspectRatioFallback = () => {
            const items = reelWrapper.querySelectorAll('.reel-content');
            items.forEach(el => {
                // calcula altura en base al ancho para 9:16
                const w = el.clientWidth || el.offsetWidth;
                if (w) {
                    const h = Math.round((w * 16) / 9);
                    el.style.height = `${h}px`;
                }
            });
        };

        // run after render and on resize
        applyAspectRatioFallback();
        window.addEventListener('resize', debounce(() => { applyAspectRatioFallback(); }, 60));
        startAutoScroll();
    }
});