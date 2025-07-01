// Project Page JavaScript - Simple and Subtle Animations

document.addEventListener('DOMContentLoaded', function () {
    // Initialize animations and interactions
    initScrollAnimations();
    initParallaxEffect();
    initFeatureInteractions();
    initButtonAnimations();
    initLoadingStates();
    addCursorTrail();
});

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');

                if (entry.target.classList.contains('features')) {
                    const featureItems = entry.target.querySelectorAll('.feature-item');
                    featureItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    document.querySelectorAll('.feature-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });
}

// Subtle parallax effect
function initParallaxEffect() {
    const header = document.querySelector('header');
    if (!header) return;

    const debouncedScrollHandler = debounce(function () {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.3;
        header.style.transform = `translateY(${parallax}px)`;
    }, 16);

    window.addEventListener('scroll', debouncedScrollHandler);
}

// Feature item interactions
function initFeatureInteractions() {
    const featureItems = document.querySelectorAll('.feature-item');

    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.animation = 'pulse 2s infinite';
            this.style.boxShadow = '0 12px 40px rgba(235, 214, 251, 0.4), 0 0 20px rgba(252, 216, 205, 0.3)';
        });

        item.addEventListener('mouseleave', function () {
            this.style.animation = 'none';
            this.style.boxShadow = '';
        });

        item.addEventListener('click', function () {
            this.style.transform = 'translateY(-8px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }, 150);
        });
    });
}

// Button animations and interactions
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });

        btn.addEventListener('click', () => {
            btn.classList.add('loading');
            setTimeout(() => {
                btn.classList.remove('loading');
            }, 800);
        });
    });
}

// Loading state (optional use)
function initLoadingStates() {
    document.body.classList.add('loaded');
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optional: Cursor trail for fun
function addCursorTrail() {
    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.width = '12px';
    trail.style.height = '12px';
    trail.style.borderRadius = '50%';
    trail.style.backgroundColor = 'rgba(235, 214, 251, 0.5)';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '10000';
    document.body.appendChild(trail);

    document.addEventListener('mousemove', (e) => {
        trail.style.left = `${e.clientX}px`;
        trail.style.top = `${e.clientY}px`;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const track = document.querySelector('.carousel-track');
    const nextBtn = document.querySelector('.carousel-button.next');
    const prevBtn = document.querySelector('.carousel-button.prev');
    const imageWidth = track.offsetWidth;

    nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: imageWidth, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -imageWidth, behavior: 'smooth' });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselImages = Array.from(document.querySelectorAll('.carousel-image'));
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    let currentIndex = 0;
    const aspectRatio = 16 / 9; // Desired aspect ratio for maximum height (width * 9 / 16)

    // Function to update carousel display based on the active image
    function updateCarousel() {
        const currentImage = carouselImages[currentIndex];

        // 1. Calculate the maximum allowed height for the current container width
        //    We get the actual rendered width of the track (which is 100% of container)
        const containerWidth = carouselTrack.clientWidth;
        const maxAllowedHeight = containerWidth * (9 / aspectRatio); // Using 9/16 for 16:9 ratio

        // 2. Adjust carousel container height based on image's natural height or maxAllowedHeight
        const img = new Image();
        img.src = currentImage.src;

        img.onload = () => {
            const naturalHeight = img.naturalHeight;
            const naturalWidth = img.naturalWidth;

            // Remove previous force-fit class
            carouselImages.forEach(imgEl => imgEl.classList.remove('force-fit'));

            if (naturalHeight > maxAllowedHeight) {
                // If natural height is greater than max allowed, force fit and set container height to max
                currentImage.style.height = `${maxAllowedHeight}px`;
                currentImage.classList.add('force-fit'); // Apply object-fit: fill
                carouselContainer.style.height = `${maxAllowedHeight}px`;
            } else {
                // If natural height is less or equal, maintain aspect ratio and set container height to natural height
                // We need to calculate the scaled height if the width is constrained to containerWidth
                const scaledHeight = containerWidth * (naturalHeight / naturalWidth);
                currentImage.style.height = `${scaledHeight}px`;
                currentImage.style.objectFit = 'contain'; // Ensure contain is active
                carouselContainer.style.height = `${scaledHeight}px`;
            }
            
            // Scroll to the current image
            carouselTrack.scrollLeft = currentImage.offsetLeft;
        };

        // Handle image loading errors (optional)
        img.onerror = () => {
            console.error('Failed to load image:', currentImage.src);
            // Fallback to a default height or error image height
            carouselContainer.style.height = `${containerWidth * (9 / aspectRatio)}px`; // Default to max height
            currentImage.style.height = `${containerWidth * (9 / aspectRatio)}px`;
            currentImage.classList.add('force-fit'); // Force fit in case of error
            carouselTrack.scrollLeft = currentImage.offsetLeft;
        };
    }

    // Navigation functions
    function goToNextSlide() {
        currentIndex = (currentIndex + 1) % carouselImages.length;
        updateCarousel();
    }

    function goToPrevSlide() {
        currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
        updateCarousel();
    }

    // Event Listeners
    nextButton.addEventListener('click', goToNextSlide);
    prevButton.addEventListener('click', goToPrevSlide);

    // Initial update
    updateCarousel();

    // Recalculate on window resize to adjust container height and object-fit dynamically
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel();
        }, 100); // Debounce to avoid excessive recalculations
    });
});
