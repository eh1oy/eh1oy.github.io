document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.my-nav-link');
    const contentSections = document.querySelectorAll('.my-section');
    const leaksContainer = document.getElementById('leaks-container');
    const appbarTitle = document.querySelector('.my-appbar-title');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.my-sidebar');

    function showSection(sectionId, updateHash = true) {
        contentSections.forEach(section => {
            const isActive = section.id === sectionId;
            section.style.display = isActive ? 'block' : 'none';
            if(isActive) section.classList.add('active');
            else section.classList.remove('active');
        });
        if (updateHash) {
            window.location.hash = sectionId;
        }
    }

    navLinks.forEach(link => {
        const sectionId = link.getAttribute('data-section');
        if (sectionId) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                navLinks.forEach(nav => nav.classList.remove('active'));
                link.classList.add('active');

                const linkText = link.cloneNode(true);
                const icon = linkText.querySelector('.material-symbols-outlined');
                if (icon) icon.remove();
                appbarTitle.textContent = linkText.textContent.trim();
                
                showSection(sectionId);

                if (sectionId === 'leaks' && !leaksContainer.dataset.loaded) {
                    loadLeaks();
                }

                if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                }
            });
        }
    });

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });

    async function loadLeaks() {
        if (leaksContainer.dataset.loaded) return;
        leaksContainer.dataset.loaded = 'true'; 

        try {
            const response = await fetch('leaks.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const leaks = await response.json();
            displayLeaks(leaks);
        } catch (error) {
            console.error("Could not load leaks data:", error);
            leaksContainer.innerHTML = '<p>Не удалось загрузить данные.</p>';
        }
    }

    function displayLeaks(leaks) {
        leaksContainer.innerHTML = '';
        leaks.forEach(leak => {
            const card = document.createElement('div');
            card.className = 'my-leak-card'; // Используем новый класс для карточек
            card.innerHTML = `
                <h3>${leak.title}</h3>
                <p>${leak.description}</p>
                <a href="${leak.download_link}" target="_blank" download class="my-btn my-m3-order-submit">
                    Скачать
                </a>
            `;
            leaksContainer.appendChild(card);
        });
    }

    function handleInitialLoad() {
        // Устанавливаем тёмную тему по умолчанию
        document.body.classList.add('dark-theme');

        const hash = window.location.hash.substring(1);
        const section = hash || 'home';
        
        const linkToActivate = document.querySelector(`.my-nav-link[data-section="${section}"]`);
        
        if (linkToActivate) {
            linkToActivate.click();
        } else {
             // Fallback to home if hash is invalid
            const homeLink = document.querySelector('.my-nav-link[data-section="home"]');
            if (homeLink) {
                homeLink.click();
            }
        }
    }

    handleInitialLoad();
}); 