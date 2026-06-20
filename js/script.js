document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        // If the user scrolls down more than 50px, add the solid background
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Carousel Slider Logic
    const carouselContainers = document.querySelectorAll('.carousel-container');

    carouselContainers.forEach(container => {
        const carousel = container.querySelector('.carousel');
        const leftHandle = container.querySelector('.left-handle');
        const rightHandle = container.querySelector('.right-handle');

        // Scroll amount is roughly the width of two images
        const scrollAmount = 520; 

        if (leftHandle && rightHandle && carousel) {
            leftHandle.addEventListener('click', () => {
                carousel.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            });

            rightHandle.addEventListener('click', () => {
                carousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });
        }
    });

    // 3. Hero Buttons Logic (Demonstration)
    const playBtn = document.getElementById('play-btn');
    const infoBtn = document.getElementById('info-btn');

    if(playBtn) {
        playBtn.addEventListener('click', () => {
            alert('Playing the movie...');
        });
    }

    if(infoBtn) {
        infoBtn.addEventListener('click', () => {
            alert('Opening more info modal...');
        });
    }

});