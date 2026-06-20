document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Expandable Search Bar ---
    const searchIcon = document.getElementById('search-icon');
    const searchBox = document.querySelector('.search-box');
    const searchInput = document.getElementById('search-input');

    searchIcon.addEventListener('click', () => {
        searchBox.classList.toggle('active');
        if(searchBox.classList.contains('active')) searchInput.focus();
    });

    // --- 2. Modal Logic ---
    const modal = document.getElementById('movie-modal');
    const closeModal = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalOverview = document.getElementById('modal-overview');
    const modalBanner = document.getElementById('modal-banner');
    const modalYear = document.getElementById('modal-year');

    // Close modal when clicking the X or clicking outside the box
    closeModal.onclick = () => modal.classList.remove('show');
    window.onclick = (e) => { if (e.target === modal) modal.classList.remove('show'); }

    function openModal(movie) {
        modalTitle.innerText = movie.title || movie.name;
        modalOverview.innerText = movie.overview || "No description available.";
        modalYear.innerText = (movie.release_date || "2026").substring(0, 4);
        modalBanner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
        modal.classList.add('show');
    }

    // --- 3. TMDB API Integration ---
    // NOTE: Insert your real TMDB API key here to make it work!
    const API_KEY = 'YOUR_API_KEY'; 
    const isApiActive = API_KEY !== 'YOUR_API_KEY';

    const endpoints = {
        popular: `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`,
        trending: `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`,
        anime: `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=16`
    };

    function populateCarousel(carouselId, movies) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;
        
        movies.forEach(movie => {
            if(!movie.backdrop_path) return; // Skip if no image
            
            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;
            img.alt = movie.title;
            img.className = "carousel-item";
            
            // Add click event to open the modal with this movie's data
            img.addEventListener('click', () => openModal(movie));
            
            carousel.appendChild(img);
        });
    }

    function updateHeroSection(movie) {
        document.getElementById('home').style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
        document.getElementById('hero-title').innerText = movie.title || movie.name;
        
        // Truncate description if too long
        let desc = movie.overview;
        if(desc.length > 200) desc = desc.substring(0, 200) + '...';
        document.getElementById('hero-desc').innerText = desc;
    }

    async function loadMovies() {
        if (!isApiActive) {
            console.error("Please add your TMDB API Key to see real data.");
            return;
        }

        try {
            // Fetch Trending for Hero and Row 1
            const trendRes = await fetch(endpoints.trending);
            const trendData = await trendRes.json();
            
            // Set Hero to the #1 trending movie
            updateHeroSection(trendData.results[0]);
            
            // Populate rows
            populateCarousel('carousel-top-picks', trendData.results);
            populateCarousel('carousel-continue', trendData.results.slice().reverse()); // shuffle visually

            // Fetch Anime
            const animeRes = await fetch(endpoints.anime);
            const animeData = await animeRes.json();
            populateCarousel('carousel-anime', animeData.results);
            
            // Fetch Popular
            const popRes = await fetch(endpoints.popular);
            const popData = await popRes.json();
            populateCarousel('carousel-party', popData.results);

        } catch (error) {
            console.error("API Fetch failed", error);
        }
    }

    loadMovies();
});