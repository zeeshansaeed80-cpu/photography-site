// Lightbox
const galleryImages = document.querySelectorAll('.gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

galleryImages.forEach(function(img) {
  img.addEventListener('click', function() {
    lightboxImg.src = img.src;
    lightbox.classList.remove('hidden');
  });
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