// Lightbox
const lightboxCaption = document.getElementById('lightboxCaption');
const galleryImages = document.querySelectorAll('.gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentIndex = 0;

function showImage(index) {
  currentIndex = index;
  lightboxImg.src = galleryImages[currentIndex].src;
  lightboxImg.alt = galleryImages[currentIndex].alt;
  lightboxCaption.textContent = galleryImages[currentIndex].alt;
}

galleryImages.forEach(function(img, index) {
  img.addEventListener('click', function() {
    showImage(index);
    lightbox.classList.remove('hidden');
  });
});

lightboxNext.addEventListener('click', function(e) {
  e.stopPropagation();
  showImage((currentIndex + 1) % galleryImages.length);
});

lightboxPrev.addEventListener('click', function(e) {
  e.stopPropagation();
  showImage((currentIndex - 1 + galleryImages.length) % galleryImages.length);
});

lightboxClose.addEventListener('click', function(e) {
  e.stopPropagation();
  lightbox.classList.add('hidden');
});

lightbox.addEventListener('click', function() {
  lightbox.classList.add('hidden');
});

// Hamburger menu
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.querySelector('.nav-links');

hamburgerBtn.addEventListener('click', function() {
  navLinks.classList.toggle('active');
});