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

// Contact form — submit to Formspree via AJAX so the visitor stays on the page
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const formStatus = document.getElementById('form-status');
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    formStatus.className = 'form-status';
    formStatus.textContent = 'Sending…';
    submitBtn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        contactForm.reset();
        formStatus.classList.add('success');
        formStatus.textContent = "Thanks — your message has been sent. I'll get back to you soon.";
      } else {
        const data = await response.json().catch(function() { return null; });
        const message = data && data.errors
          ? data.errors.map(function(err) { return err.message; }).join(', ')
          : 'Something went wrong. Please try again, or email me directly.';
        formStatus.classList.add('error');
        formStatus.textContent = message;
      }
    } catch (err) {
      formStatus.classList.add('error');
      formStatus.textContent = 'Network error — please check your connection and try again.';
    } finally {
      submitBtn.disabled = false;
    }
  });
}