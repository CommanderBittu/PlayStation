let items = document.querySelectorAll('.slider .list .item');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let thumbnails = document.querySelectorAll('.thumbnail .item');

// config param
let countItem = items.length;
let itemActive = 0;

// event next click
next.onclick = function() {
    itemActive = itemActive + 1;
    if (itemActive >= countItem) {
        itemActive = 0;
    }
    showSlider();
}

// event prev click
prev.onclick = function() {
    itemActive = itemActive - 1;
    if (itemActive < 0) {
        itemActive = countItem - 1;
    }
    showSlider();
}

// auto run slider
let refreshInterval = setInterval(() => {
    next.click();
}, 5000);

function showSlider() {
    // remove item active old
    let itemActiveOld = document.querySelector('.slider .list .item.active');
    let thumbnailActiveOld = document.querySelector('.thumbnail .item.active');
    if (itemActiveOld) itemActiveOld.classList.remove('active');
    if (thumbnailActiveOld) thumbnailActiveOld.classList.remove('active');

    // active new item
    items[itemActive].classList.add('active');
    thumbnails[itemActive].classList.add('active');

    // clear auto time run slider
    clearInterval(refreshInterval);
    refreshInterval = setInterval(() => {
        next.click();
    }, 5000);

    // Trigger button animation
    let button = items[itemActive].querySelector('.button-2');
    if (button) {
        button.classList.remove('animate'); // Reset animation
        // Force reflow to restart animation
        void button.offsetWidth; 
        button.classList.add('animate'); // Apply animation
    }
}

// click thumbnail
thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        itemActive = index;
        showSlider();
    });
});
// slider navigation
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.list-games-slider');
    const navLinks = document.querySelectorAll('.slider-navigation a');

    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            slider.scrollTo({
                left: slider.clientWidth * index,
                behavior: 'smooth'
            });
            updateActiveLink(index);
        });
    });

    const updateActiveLink = (index) => {
        navLinks.forEach((link, i) => {
            if (i === index) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // Initial active link
    updateActiveLink(0);
});
