document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 2. Button Interactivity ---
    const playBtn = document.getElementById('play-btn');
    const infoBtn = document.getElementById('info-btn');
    if(playBtn) playBtn.addEventListener('click', () => alert('Playing movie...'));
    if(infoBtn) infoBtn.addEventListener('click', () => alert('Opening details...'));

    // --- 3. Carousel Slider Logic ---
    const carouselContainers = document.querySelectorAll('.carousel-container');
    carouselContainers.forEach(container => {
        const carousel = container.querySelector('.carousel');
        const leftHandle = container.querySelector('.left-handle');
        const rightHandle = container.querySelector('.right-handle');
        const scrollAmount = 520; // Width to scroll per click

        if (leftHandle && rightHandle && carousel) {
            leftHandle.addEventListener('click', () => {
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
            rightHandle.addEventListener('click', () => {
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    });

    // --- 4. TMDB API & Fallback Data Injection ---
    
    // NOTE: To use real TMDB data, replace 'YOUR_API_KEY' with a real key from https://www.themoviedb.org/
    const API_KEY = 'YOUR_API_KEY'; 
    const isApiActive = API_KEY !== 'YOUR_API_KEY';
    
    // Cinematic Fallback Images (Guarantees site works even without API key)
    const fallbackImages = [
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80",
        "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&q=80",
        "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=500&q=80",
        "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=500&q=80",
        "https://images.unsplash.com/photo-1574267432553-4b462808152a?w=500&q=80",
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80",
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&q=80",
        "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=500&q=80"
    ];

    // IDs of all the carousels in HTML
    const rowIds = [
        'carousel-top-picks', 
        'carousel-continue', 
        'carousel-party', 
        'carousel-captivating', 
        'carousel-anime', 
        'carousel-gems'
    ];

    // Function to populate a carousel with images
    function populateCarousel(carouselId, imageUrls) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;
        
        imageUrls.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = "Movie Poster";
            img.className = "carousel-item";
            carousel.appendChild(img);
        });
    }

    // Logic to fetch from TMDB or use Fallback
    async function loadMovies() {
        if (isApiActive) {
            try {
                // Example: Fetching popular movies from TMDB
                const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
                const data = await res.json();
                const tmdbImages = data.results.map(movie => `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`);
                
                // Populate all rows with API data
                rowIds.forEach(id => populateCarousel(id, tmdbImages));
            } catch (error) {
                console.error("API Fetch failed, using fallback.", error);
                rowIds.forEach(id => populateCarousel(id, fallbackImages.sort(() => Math.random() - 0.5)));
            }
        } else {
            // No API Key provided: Use fallback cinematic images, shuffling them slightly for variety
            rowIds.forEach(id => {
                const shuffled = [...fallbackImages].sort(() => Math.random() - 0.5);
                populateCarousel(id, shuffled);
            });
        }
    }

    // Execute movie loading
    loadMovies();
});