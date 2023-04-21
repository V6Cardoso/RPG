const body = document.querySelector("body");
const input = document.getElementById('search-input');
const carousel = document.querySelector(".carousel");
const arrowIcons = document.getElementsByClassName("arrow");
//const imageContainer = document.querySelector('.image-container');

body.onkeydown = checkKey;

let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff;


const showHideIcons = () => {
    arrowIcons[0].style.display = carousel.scrollLeft <= 20 ? 'none' : 'block';
    arrowIcons[1].style.display = carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 20 ? 'none' : 'block';
}

Array.prototype.forEach.call(arrowIcons, function(icon) {
    icon.addEventListener("click", () => {
        scrollCarousel(icon.id == 'left' ? -carousel.clientWidth : carousel.clientWidth); //div width + ?.margin
    });
});

const scrollCarousel = (value) => {
    carousel.classList.add('scroll-smooth');
    carousel.scrollLeft += value;
    carousel.classList.remove('scroll-smooth');
    setTimeout(() => showHideIcons(), 550);
}

const dragStart = (e) => {
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
}

const dragStop = () => {
    isDragStart = false;

    if(!isDragging)
        return;
    isDragging = false;

    showHideIcons();
}

const dragging = (e) => {
    if (!isDragStart)
        return;
    isDragging = true;
    e.preventDefault();
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    carousel.scrollLeft = prevScrollLeft - positionDiff;
    showHideIcons();
}


function checkKey(e) {
    e = e || window.event;

    if (document.activeElement == input)
        return;

    //left arrow
    if (e.keyCode == '37') { 
        scrollCarousel(-carousel.clientWidth);
    }
    //right arrow
    else if (e.keyCode == '39') {
        scrollCarousel(carousel.clientWidth);
    }
}

carousel.addEventListener('mousedown', dragStart);
carousel.addEventListener('touchstart', dragStart);

carousel.addEventListener('mousemove', dragging);
carousel.addEventListener('touchmove', dragging);

carousel.addEventListener('mouseup', dragStop);
carousel.addEventListener('touchend', dragStop);

showHideIcons();

