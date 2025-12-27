let lastScrollTop = 0;
const header = document.querySelector('header');
const scrollThreshold = 100;

window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > scrollThreshold) {
        if (scrollTop > lastScrollTop) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
    } else {
        header.classList.remove('header-hidden');
    }

    lastScrollTop = scrollTop;
});

const video = document.getElementById('foodVideo');
const playButton = document.getElementById('playButton');

if (playButton && video) {
    playButton.addEventListener('click', function () {
        if (video.paused) {
            video.play();
            playButton.style.display = 'none';
        }
    });

    video.addEventListener('click', function () {
        if (video.paused) {
            video.play();
            playButton.style.display = 'none';
        } else {
            video.pause();
            playButton.style.display = 'flex';
        }
    });

    video.addEventListener('pause', function () {
        playButton.style.display = 'flex';
    });

    video.addEventListener('ended', function () {
        playButton.style.display = 'flex';
    });
}

const prevArrow = document.querySelector('.prev-arrow');
const nextArrow = document.querySelector('.next-arrow');
const carouselTrack = document.querySelector('.carousel-track');
let carouselCards = document.querySelectorAll('.carousel-card');

let currentIndex = 0;
let isTransitioning = false;

function cloneCards() {
    const firstClone = carouselCards[0].cloneNode(true);
    const secondClone = carouselCards[1].cloneNode(true);
    const lastClone = carouselCards[carouselCards.length - 1].cloneNode(true);
    const secondLastClone = carouselCards[carouselCards.length - 2].cloneNode(true);

    carouselTrack.appendChild(firstClone);
    carouselTrack.appendChild(secondClone);
    carouselTrack.insertBefore(lastClone, carouselCards[0]);
    carouselTrack.insertBefore(secondLastClone, lastClone);

    carouselCards = document.querySelectorAll('.carousel-card');
    currentIndex = 2;
}

function updateCarousel(smooth = true) {
    if (!carouselTrack || carouselCards.length === 0) return;

    const cardWidth = carouselCards[0].offsetWidth;
    const gap = 24;
    const offset = -currentIndex * (cardWidth + gap);

    carouselTrack.style.transition = smooth ? 'transform 0.5s ease' : 'none';
    carouselTrack.style.transform = `translateX(${offset}px)`;

    carouselCards.forEach((card, index) => {
        card.classList.remove('active-card', 'inactive-card');
        if (index === currentIndex + 1) {
            card.classList.add('active-card');
        } else {
            card.classList.add('inactive-card');
        }
    });
}

if (nextArrow && prevArrow) {
    cloneCards();
    updateCarousel(false);

    nextArrow.addEventListener('click', function () {
        if (isTransitioning) return;
        isTransitioning = true;

        currentIndex++;
        updateCarousel(true);

        setTimeout(() => {
            if (currentIndex >= carouselCards.length - 3) {
                currentIndex = 2;
                updateCarousel(false);
            }
            isTransitioning = false;
        }, 500);
    });

    prevArrow.addEventListener('click', function () {
        if (isTransitioning) return;
        isTransitioning = true;

        currentIndex--;
        updateCarousel(true);

        setTimeout(() => {
            if (currentIndex < 2) {
                currentIndex = carouselCards.length - 4;
                updateCarousel(false);
            }
            isTransitioning = false;
        }, 500);
    });
}

const requestDishBtn = document.querySelector('.request-dish-btn');
const body = document.body;

if (requestDishBtn) {
    requestDishBtn.addEventListener('click', function () {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h2 class="modal-title">Request a Dish</h2>
                
                <div class="form-group">
                    <input type="text" class="modal-input" id="dishName" placeholder="Dish Name *" />
                    <span class="error-message" id="dishNameError"></span>
                </div>
                
                <div class="form-group">
                    <textarea class="modal-textarea" id="dishDescription" placeholder="Description *" rows="4"></textarea>
                    <span class="error-message" id="descriptionError"></span>
                </div>
                
                <div class="form-group">
                    <label class="photo-upload-label">
                        <input type="file" class="photo-input" id="dishPhoto" accept="image/*" />
                        <span class="upload-text">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 4V16M4 10H16" stroke="#1AC073" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            Upload Photo (Optional, Max 2MB)
                        </span>
                    </label>
                    <span class="file-name" id="fileName"></span>
                    <span class="error-message" id="photoError"></span>
                </div>
                
                <div class="modal-buttons">
                    <button class="modal-btn cancel-btn">Cancel</button>
                    <button class="modal-btn submit-btn">Submit Request</button>
                </div>
            </div>
        `;

        body.appendChild(modal);
        body.style.overflow = 'hidden';

        setTimeout(() => modal.classList.add('show'), 10);

        const cancelBtn = modal.querySelector('.cancel-btn');
        const submitBtn = modal.querySelector('.submit-btn');
        const dishNameInput = modal.querySelector('#dishName');
        const dishDescriptionInput = modal.querySelector('#dishDescription');
        const photoInput = modal.querySelector('#dishPhoto');
        const fileNameDisplay = modal.querySelector('#fileName');

        // Photo upload handler
        photoInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            const photoError = modal.querySelector('#photoError');

            if (file) {
                const maxSize = 2 * 1024 * 1024; // 2MB in bytes

                if (file.size > maxSize) {
                    photoError.textContent = 'File size exceeds 2MB. Please choose a smaller file.';
                    photoInput.value = '';
                    fileNameDisplay.textContent = '';
                } else {
                    photoError.textContent = '';
                    fileNameDisplay.textContent = `Selected: ${file.name}`;
                }
            }
        });

        // Clear error on input
        dishNameInput.addEventListener('input', function () {
            modal.querySelector('#dishNameError').textContent = '';
            dishNameInput.classList.remove('input-error');
        });

        dishDescriptionInput.addEventListener('input', function () {
            modal.querySelector('#descriptionError').textContent = '';
            dishDescriptionInput.classList.remove('input-error');
        });

        function closeModal() {
            modal.classList.remove('show');
            setTimeout(() => {
                body.removeChild(modal);
                body.style.overflow = '';
            }, 300);
        }

        function validateForm() {
            let isValid = true;
            const dishNameError = modal.querySelector('#dishNameError');
            const descriptionError = modal.querySelector('#descriptionError');

            // Clear previous errors
            dishNameError.textContent = '';
            descriptionError.textContent = '';
            dishNameInput.classList.remove('input-error');
            dishDescriptionInput.classList.remove('input-error');

            // Validate dish name
            if (!dishNameInput.value.trim()) {
                dishNameError.textContent = 'Dish name is required';
                dishNameInput.classList.add('input-error');
                isValid = false;
            } else if (dishNameInput.value.trim().length < 3) {
                dishNameError.textContent = 'Dish name must be at least 3 characters';
                dishNameInput.classList.add('input-error');
                isValid = false;
            }

            // Validate description
            if (!dishDescriptionInput.value.trim()) {
                descriptionError.textContent = 'Description is required';
                dishDescriptionInput.classList.add('input-error');
                isValid = false;
            } else if (dishDescriptionInput.value.trim().length < 10) {
                descriptionError.textContent = 'Description must be at least 10 characters';
                dishDescriptionInput.classList.add('input-error');
                isValid = false;
            }

            return isValid;
        }

        cancelBtn.addEventListener('click', closeModal);

        submitBtn.addEventListener('click', function () {
            if (validateForm()) {
                // Form is valid, you can submit the data here
                console.log('Form submitted:', {
                    dishName: dishNameInput.value,
                    description: dishDescriptionInput.value,
                    photo: photoInput.files[0] || null
                });

                // Show success message or close modal
                alert('Request submitted successfully!');
                closeModal();
            }
        });

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
}

window.addEventListener('resize', () => {
    if (carouselCards.length > 0) {
        updateCarousel(false);
    }
});
