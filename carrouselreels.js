document.addEventListener('DOMContentLoaded', () => {
    const reelData = [
        {
            title: "VT COSMETICS",
            platform: "instagram",
            icon: "fab fa-instagram",
            link: "https://www.instagram.com/reel/DM_sJwuulJq/",
            thumb: "./images/IG1.jpg"
        },
        {
            title: "FASHION INSPO",
            platform: "tiktok",
            icon: "fab fa-tiktok",
            link: "https://www.tiktok.com/@xaviergil.fc/video/7578566621082553611",
            thumb: "./images/TK1.png"
        },
        {
            title: "TRAVEL VLOGS 🇰🇷🌃",
            platform: "youtube",
            icon: "fab fa-youtube",
            link: "https://www.youtube.com/shorts/fi8vxSwEuf4",
            thumb: "./images/YT1.jpg"
        },
        // Añade más objetos aquí...
        {
            title: "KPOP DANCE COVER",
            platform: "instagram",
            icon: "fab fa-instagram",
            link: "https://www.instagram.com/reel/DR-y1rSAZM4/",
            thumb: "./images/IG2.jpg"
        },
        {
            title: "MINISO VZLA",
            platform: "tiktok",
            icon: "fab fa-tiktok",
            link: "https://www.tiktok.com/@xaviergil.fc/video/7531916085172456709",
            thumb: "./images/TK2.png"
        },
        {
            title: "KDRAMAS",
            platform: "youtube",
            icon: "fab fa-youtube",
            link: "https://www.youtube.com/shorts/9qRTQ8bpEn8",
            thumb: "./images/YT2.jpg"
        },
        {
            title: "MIXSOON",
            platform: "instagram",
            icon: "fab fa-instagram",
            link: "https://www.instagram.com/reel/DKgVhiftimR/",
            thumb: "./images/IG3.jpg"
        }
    ];

    const wrapper = document.getElementById('reel-items-wrapper');

    // 1. Función para crear el HTML de la card
    const createReelCard = (item) => {
        return `
            <a href="${item.link}" target="_blank" class="reel-item" role="listitem">
                <div class="platform-badge"><i class="${item.icon}"></i></div>
                <img src="${item.thumb}" alt="${item.title}" class="reel-thumb" loading="lazy">
                <div class="reel-overlay">
                    <h3>${item.title}</h3>
                </div>
            </a>
        `;
    };

    // 2. Renderizar items iniciales
    const renderContent = () => {
        const contentHTML = reelData.map(item => createReelCard(item)).join('');
        // Importante: Duplicamos el contenido para el efecto infinite marquee
        wrapper.innerHTML = contentHTML + contentHTML;
    };

    renderContent();

    // 3. Soporte táctil básico (Opcional: Detener animación al tocar)
    wrapper.addEventListener('touchstart', () => {
        wrapper.style.animationPlayState = 'paused';
    }, {passive: true});

    wrapper.addEventListener('touchend', () => {
        wrapper.style.animationPlayState = 'running';
    });
});