/* ============================================================
   NETFLIX CLONE — script.js
   ============================================================
   Features:
   1. Navbar scroll effect
   2. Search bar expand/collapse
   3. Carousel smooth scroll with handles
   4. Hover tooltip card
   5. Modal (More Info)
   6. Top 10 numbered overlays
   7. Continue Watching progress bars
   8. TMDB API integration with rich fallback data
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================
       CONFIG — Replace with your TMDB API key
       Get one free at https://www.themoviedb.org/settings/api
       ======================================================== */
    const TMDB_KEY      = 'e74245fd9291e58c0c9cc0827e12c698';
    const TMDB_BASE     = 'https://api.themoviedb.org/3';
    const TMDB_IMG_W300 = 'https://image.tmdb.org/t/p/w300';
    const TMDB_IMG_W780 = 'https://image.tmdb.org/t/p/w780';
    const API_ACTIVE    = TMDB_KEY !== 'e74245fd9291e58c0c9cc0827e12c698';

    /* ========================================================
       1. NAVBAR SCROLL EFFECT
       ======================================================== */
    const navbar = document.getElementById('navbar');

    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ========================================================
       2. SEARCH BAR
       ======================================================== */
    const searchContainer = document.getElementById('search-container');
    const searchToggle    = document.getElementById('search-toggle');
    const searchInput     = document.getElementById('search-input');

    searchToggle.addEventListener('click', () => {
        const isActive = searchContainer.classList.toggle('active');
        if (isActive) {
            searchInput.focus();
        } else {
            searchInput.value = '';
        }
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            searchContainer.classList.remove('active');
            searchInput.value = '';
        }
    });

    /* ========================================================
       3. CAROUSEL SCROLL HANDLES
       ======================================================== */
    document.querySelectorAll('.carousel-container').forEach(container => {
        const carousel     = container.querySelector('.carousel');
        const leftHandle   = container.querySelector('.left-handle');
        const rightHandle  = container.querySelector('.right-handle');
        const SCROLL_STEP  = 700;

        if (!carousel || !leftHandle || !rightHandle) return;

        const updateHandles = () => {
            leftHandle.style.opacity  = carousel.scrollLeft > 10 ? '' : '0';
            rightHandle.style.opacity = carousel.scrollLeft < (carousel.scrollWidth - carousel.clientWidth - 10) ? '' : '0';
        };

        leftHandle.addEventListener('click',  () => carousel.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' }));
        rightHandle.addEventListener('click', () => carousel.scrollBy({ left:  SCROLL_STEP, behavior: 'smooth' }));
        carousel.addEventListener('scroll', updateHandles, { passive: true });
    });

    /* ========================================================
       4. HERO BUTTONS
       ======================================================== */
    const playBtn = document.getElementById('play-btn');
    const infoBtn = document.getElementById('info-btn');

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            openModal(heroMovie);
        });
    }

    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            openModal(heroMovie);
        });
    }

    /* ========================================================
       5. MODAL
       ======================================================== */
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose   = document.getElementById('modal-close');
    const modalHeroImg = document.getElementById('modal-hero-img');
    const modalTitle   = document.getElementById('modal-title');
    const modalDesc    = document.getElementById('modal-description');

    function openModal(movie) {
        if (!movie) return;
        modalHeroImg.src = movie.backdrop || movie.thumb || '';
        modalHeroImg.alt = movie.title || '';
        modalTitle.textContent = movie.title || 'Untitled';
        modalDesc.textContent  = movie.overview || 'No description available.';
        modalOverlay.setAttribute('aria-hidden', 'false');
        modalOverlay.classList.add('open');
        document.body.classList.add('modal-open');
        modalClose.focus();
    }

    function closeModal() {
        modalOverlay.classList.remove('open');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    if (modalClose)   modalClose.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    /* ========================================================
       6. TOOLTIP HOVER CARD
       ======================================================== */
    const tooltip      = document.getElementById('tooltip-card');
    const tooltipThumb = document.getElementById('tooltip-thumb');
    const tooltipGenre = document.getElementById('tooltip-genres');
    const tooltipMore  = document.getElementById('tooltip-more');

    let tooltipTimeout    = null;
    let hideTimeout       = null;
    let activeMovie       = null;
    let activeCard        = null;

    function showTooltip(card, movie) {
        clearTimeout(hideTimeout);
        activeMovie = movie;
        activeCard  = card;

        const rect = card.getBoundingClientRect();
        tooltipThumb.src = movie.thumb || '';
        tooltipThumb.alt = movie.title || '';
        tooltipGenre.textContent = (movie.genres || ['Action', 'Drama', 'Thriller']).join(' • ');

        // Position tooltip centered above/below card
        const ttWidth  = 280;
        const margin   = 12;
        let   left     = rect.left + rect.width / 2 - ttWidth / 2 + window.scrollX;
        let   top      = rect.top + window.scrollY - 8;

        // Clamp to viewport
        left = Math.max(8, Math.min(left, window.innerWidth - ttWidth - 8));

        // Determine if tooltip should go below
        if (rect.top < 240) {
            top = rect.bottom + window.scrollY + margin;
        } else {
            top = rect.top + window.scrollY - 220; // approximate tooltip height
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top  = `${top}px`;
        tooltip.classList.add('visible');
    }

    function hideTooltip() {
        hideTimeout = setTimeout(() => {
            tooltip.classList.remove('visible');
            activeMovie = null;
            activeCard  = null;
        }, 250);
    }

    tooltip.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
    tooltip.addEventListener('mouseleave', hideTooltip);

    if (tooltipMore) {
        tooltipMore.addEventListener('click', () => {
            if (activeMovie) openModal(activeMovie);
        });
    }

    /* ========================================================
       7. CAROUSEL POPULATION (Updated Fallback Images)
       ======================================================== */

    // Replaced dead/blank links with working cinematic images
    const FALLBACK_MOVIES = [
        {
            id: 1, title: 'The Dark Knight',
            thumb: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&q=80',
            backdrop: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1200&q=80',
            overview: 'Batman faces the Joker in Gotham City, a battle that tests his resolve to protect the city without becoming a vigilante above the law.',
            genres: ['Action', 'Crime', 'Drama'], match: 98, rating: 'U/A 15+', year: 2008
        },
        {
            id: 2, title: 'Inception',
            thumb: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&q=80',
            backdrop: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&q=80',
            overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
            genres: ['Action', 'Sci-Fi', 'Thriller'], match: 97, rating: 'U/A 13+', year: 2010
        },
        {
            id: 3, title: 'Interstellar',
            thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80',
            backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
            overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
            genres: ['Adventure', 'Drama', 'Sci-Fi'], match: 96, rating: 'U/A 13+', year: 2014
        },
        {
            id: 4, title: 'Dune',
            thumb: 'https://images.unsplash.com/photo-1547638375-ebf04735d792?w=500&q=80',
            backdrop: 'https://images.unsplash.com/photo-1547638375-ebf04735d792?w=1200&q=80',
            overview: 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe.',
            genres: ['Action', 'Adventure', 'Drama'], match: 95, rating: 'U/A 13+', year: 2021
        },
        {
            id: 5, title: 'The Shawshank Redemption',
            thumb: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80',
            backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=80',
            overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
            genres: ['Drama'], match: 99, rating: 'U/A 15+', year: 1994
        },
        {
            id: 6, title: 'Parasite',
            thumb: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=500&q=80',
            backdrop: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200&q=80',
            overview: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
            genres: ['Comedy', 'Drama', 'Thriller'], match: 97, rating: 'U/A 15+', year: 2019
        },
        {
            id: 7, title: 'Oppenheimer',
            thumb: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=500&q=80',
            backdrop: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=1200&q=80',
            overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
            genres: ['Biography', 'Drama', 'History'], match: 96, rating: 'U/A 15+', year: 2023
        },
        {
            id: 8, title: 'Avatar: The Way of Water',
            thumb: 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=500&q=80',
            backdrop: 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=1200&q=80',
            overview: 'Jake Sully lives with his newfound family formed on the planet of Pandora. Once a familiar threat returns, Jake must work with Neytiri to protect their home.',
            genres: ['Action', 'Adventure', 'Fantasy'], match: 93, rating: 'U/A 13+', year: 2022
        },
        {
            id: 9, title: 'Everything Everywhere All at Once',
            thumb: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80',
            backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80',
            overview: 'An aging Chinese immigrant is swept up in an insane adventure in which she alone can save the world by exploring other universes.',
            genres: ['Action', 'Adventure', 'Comedy'], match: 98, rating: 'U/A 15+', year: 2022
        },
        {
            id: 10, title: 'Top Gun: Maverick',
            thumb: 'https://images.unsplash.com/photo-1550684848-86a5d8727436?w=500&q=80',
            backdrop: 'https://images.unsplash.com/photo-1550684848-86a5d8727436?w=1200&q=80',
            overview: 'After more than thirty years of service as one of the Navy\'s top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot.',
            genres: ['Action', 'Drama'], match: 97, rating: 'U/A 13+', year: 2022
        },
        {
            id: 11, title: 'Pulp Fiction',
            thumb: 'https://images.unsplash.com/photo-1512070679279-8988d32161be?w=500&q=80',
            backdrop: 'https://images.unsplash.com/photo-1512070679279-8988d32161be?w=1200&q=80',
            overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
            genres: ['Crime', 'Drama'], match: 97, rating: 'A', year: 1994
        },
        {
            id: 12, title: 'The Godfather',
            thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
            backdrop: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
            overview: 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.',
            genres: ['Crime', 'Drama'], match: 99, rating: 'A', year: 1972
        }
    ];

    // Hero movie data
    const heroMovie = {
        title: 'The Matrix Resurrections',
        thumb: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80',
        backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80',
        overview: 'Return to a world of two realities: one, everyday life; the other, what lies behind it. To find out if his reality is a construct, to truly know himself, Mr. Anderson will have to choose to follow the white rabbit once more.',
        genres: ['Action', 'Sci-Fi', 'Fantasy'], match: 97, rating: 'U/A 16+', year: 2021
    };

    function shuffle(arr) {
        return [...arr].sort(() => Math.random() - 0.5);
    }

    /**
     * Create a carousel card element
     * @param {Object}  movie
     * @param {Object}  options  - { showProgress, progressPct, rankNumber, showTooltipCard }
     */
    function createCard(movie, options = {}) {
        const { showProgress = false, progressPct = 0, rankNumber = null } = options;

        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.setAttribute('role', 'listitem');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', movie.title);

        const img = document.createElement('img');
        img.src    = movie.thumb || '';
        img.alt    = movie.title || '';
        img.loading = 'lazy';
        // Updated error fallback URL
        img.onerror = () => {
            img.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';
        };
        item.appendChild(img);

        // Rank number overlay (Top 10)
        if (rankNumber !== null) {
            const rank = document.createElement('span');
            rank.className = 'rank-number';
            rank.textContent = rankNumber;
            item.appendChild(rank);
        }

        // Progress bar (Continue Watching)
        if (showProgress) {
            const bar = document.createElement('div');
            bar.className = 'progress-bar';
            const fill = document.createElement('div');
            fill.className = 'progress-fill';
            fill.style.width = `${Math.min(100, Math.max(5, progressPct))}%`;
            bar.appendChild(fill);
            item.appendChild(bar);
        }

        // Tooltip on hover
        let hoverTimer = null;

        item.addEventListener('mouseenter', () => {
            hoverTimer = setTimeout(() => showTooltip(item, movie), 400);
        });

        item.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
            hideTooltip();
        });

        // Click opens modal
        item.addEventListener('click', () => openModal(movie));

        // Keyboard support
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(movie);
            }
        });

        return item;
    }

    /**
     * Populate a carousel element with movie cards
     */
    function populateCarousel(carouselId, movies, options = {}) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;
        carousel.innerHTML = '';

        movies.forEach((movie, index) => {
            const cardOptions = { ...options };
            if (options.isTop10) cardOptions.rankNumber = index + 1;
            if (options.isContinue) {
                cardOptions.showProgress = true;
                cardOptions.progressPct  = movie.progressPct || Math.floor(Math.random() * 85) + 10;
            }
            carousel.appendChild(createCard(movie, cardOptions));
        });
    }

    /* ========================================================
       8. DATA LOADING
       ======================================================== */

    // Row configuration
    const ROWS = [
        { id: 'carousel-top-picks',   tmdbEndpoint: '/movie/popular',         fallbackCount: 10 },
        { id: 'carousel-top10',       tmdbEndpoint: '/trending/all/week',       fallbackCount: 10, isTop10: true },
        { id: 'carousel-continue',    tmdbEndpoint: '/movie/now_playing',       fallbackCount: 8,  isContinue: true },
        { id: 'carousel-new',         tmdbEndpoint: '/movie/upcoming',          fallbackCount: 10 },
        { id: 'carousel-party',       tmdbEndpoint: '/movie/top_rated',         fallbackCount: 10 },
        { id: 'carousel-captivating', tmdbEndpoint: '/tv/top_rated',            fallbackCount: 10 },
        { id: 'carousel-anime',       tmdbEndpoint: '/discover/tv?with_genres=16', fallbackCount: 10 },
        { id: 'carousel-gems',        tmdbEndpoint: '/discover/movie?sort_by=vote_average.desc&vote_count.gte=1000', fallbackCount: 10 }
    ];

    // Add "explore more" span to row titles (Netflix style)
    document.querySelectorAll('.row-title').forEach(title => {
        const span = document.createElement('span');
        span.className = 'explore-more';
        span.innerHTML = 'Explore All <i class="fas fa-chevron-right" style="font-size:0.65em"></i>';
        title.appendChild(span);
    });

    async function fetchTMDB(endpoint) {
        const sep = endpoint.includes('?') ? '&' : '?';
        const url = `${TMDB_BASE}${endpoint}${sep}api_key=${TMDB_KEY}&language=en-US&page=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`TMDB ${res.status}`);
        return res.json();
    }

    function tmdbToMovie(item) {
        return {
            id:       item.id,
            title:    item.title || item.name || 'Untitled',
            thumb:    item.backdrop_path ? `${TMDB_IMG_W300}${item.backdrop_path}` : null,
            backdrop: item.backdrop_path ? `${TMDB_IMG_W780}${item.backdrop_path}` : null,
            overview: item.overview || '',
            genres:   [],
            match:    Math.floor(Math.random() * 10 + 89),
            year:     (item.release_date || item.first_air_date || '').slice(0, 4)
        };
    }

    async function loadRows() {
        for (const row of ROWS) {
            try {
                if (API_ACTIVE) {
                    const data   = await fetchTMDB(row.tmdbEndpoint);
                    const movies = (data.results || []).slice(0, row.fallbackCount).map(tmdbToMovie);
                    populateCarousel(row.id, movies, { isTop10: row.isTop10, isContinue: row.isContinue });
                } else {
                    throw new Error('No API key');
                }
            } catch (_) {
                // Fallback to local data
                const movies = shuffle(FALLBACK_MOVIES).slice(0, row.fallbackCount);
                populateCarousel(row.id, movies, { isTop10: row.isTop10, isContinue: row.isContinue });
            }
        }
    }

    loadRows();

    /* ========================================================
       9. BROWSE MENU (mobile)
       ======================================================== */
    const browseMenu = document.getElementById('browse-menu');
    if (browseMenu) {
        document.addEventListener('click', (e) => {
            if (!browseMenu.contains(e.target)) {
                browseMenu.querySelector('.browse-dropdown').style.display = '';
            }
        });
    }

    /* ========================================================
       10. REDUCED MOTION
       ======================================================== */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition', '0s');
    }

});