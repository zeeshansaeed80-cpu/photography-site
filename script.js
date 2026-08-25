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