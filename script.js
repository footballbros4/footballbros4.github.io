document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded');

    // Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const headerContainer = document.querySelector('header .container-zon');

    if (navToggle && navMenu && headerContainer) {
        navToggle.addEventListener('click', () => {
            console.log('Nav toggle clicked');
            navMenu.classList.toggle('active');
            navToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });

        // Detect container width to toggle mobile/desktop behavior
        function checkNavDisplay() {
            const containerWidth = headerContainer.offsetWidth;
            if (containerWidth > 600) {
                headerContainer.classList.remove('mobile-nav');
                navMenu.classList.remove('active');
                navToggle.textContent = '☰';
            } else {
                headerContainer.classList.add('mobile-nav');
            }
        }

        checkNavDisplay();
        window.addEventListener('resize', checkNavDisplay);
    } else {
        console.error('Nav elements not found:', {
            navToggle: !!navToggle,
            navMenu: !!navMenu,
            headerContainer: !!headerContainer
        });
    }

    // Search Functionality
    const searchIcon = document.querySelector('.search-icon');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    const gameContainer = document.querySelector('#zon_games.masonry-grid');
    const noResults = document.querySelector('#zon_games .no-results');

    if (!searchIcon || !searchForm || !searchInput || !gameContainer || !noResults) {
        console.error('Search elements not found:', {
            searchIcon: !!searchIcon,
            searchForm: !!searchForm,
            searchInput: !!searchInput,
            gameContainer: !!gameContainer,
            noResults: !!noResults
        });
        return;
    }

    searchIcon.addEventListener('click', () => {
        console.log('Search icon clicked');
        searchForm.classList.toggle('active');
        if (searchForm.classList.contains('active')) {
            searchInput.focus();
            navMenu.classList.remove('active');
            navToggle.textContent = '☰';
        } else {
            searchInput.value = '';
            gameContainer.querySelectorAll('a').forEach(game => game.classList.remove('hidden'));
            noResults.style.display = 'none';
        }
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        console.log('Search input:', query);
        let visibleGames = 0;

        gameContainer.querySelectorAll('a').forEach(game => {
            const title = game.querySelector('h3')?.textContent.toLowerCase();
            if (!title) {
                console.warn('Game card missing h3 title:', game);
                return;
            }
            if (query === '' || title.includes(query)) {
                game.classList.remove('hidden');
                visibleGames++;
            } else {
                game.classList.add('hidden');
            }
        });

        noResults.style.display = visibleGames === 0 && query !== '' ? 'block' : 'none';
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submission prevented; using live search');
    });

    // Slider Functionality
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    let currentIndex = 0;
    const totalSlides = slides.length;

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    setInterval(nextSlide, 5000);
    nextSlide();

    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // Infinite Scroll
    let isLoading = false;
    const zonGames = document.getElementById('zon_games');
    const loader = document.querySelector('.zon-loader');

    const additionalGames = [
        { name: "Game 16", size: "small", image: "https://via.placeholder.com/200x120?text=Game+16" },
        { name: "Game 17", size: "large", image: "https://via.placeholder.com/200x240?text=Game+17" },
        { name: "Game 18", size: "tall", image: "https://via.placeholder.com/200x180?text=Game+18" },
        { name: "Game 19", size: "small", image: "https://via.placeholder.com/200x120?text=Game+19" },
        { name: "Game 20", size: "large", image: "https://via.placeholder.com/200x240?text=Game+20" },
    ];

    function loadData() {
        if (isLoading) return;
        isLoading = true;
        loader.style.display = 'grid';

        setTimeout(() => {
            additionalGames.forEach(game => {
                const gameCard = document.createElement('a');
                gameCard.href = `#${game.name.toLowerCase().replace(/\s+/g, '-')}`;
                gameCard.innerHTML = `
                    <div class="card-body ${game.size}">
                        <img src="${game.image}" alt="${game.name}" loading="lazy">
                        <div class="gradient-overlay"></div>
                        <div class="play-text">Play Now</div>
                        <h3>${game.name}</h3>
                    </div>
                `;
                zonGames.appendChild(gameCard);
            });

            loader.style.display = 'none';
            isLoading = false;

            const query = searchInput.value.trim().toLowerCase();
            if (query) {
                let visibleGames = 0;
                zonGames.querySelectorAll('a').forEach(game => {
                    const title = game.querySelector('h3').textContent.toLowerCase();
                    if (title.includes(query)) {
                        game.classList.remove('hidden');
                        visibleGames++;
                    } else {
                        game.classList.add('hidden');
                    }
                });
                noResults.style.display = visibleGames === 0 ? 'block' : 'none';
            }
        }, 1000);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 200) {
            loadData();
        }
    });
});
