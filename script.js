// ---------- Gallery lightbox (keyboard and screen-reader accessible) ----------
// Builds the photo viewer once here, so gallery pages only need plain <img> tags inside .gallery
const galleryImages = Array.from(document.querySelectorAll('.gallery img'));

if (galleryImages.length) {
  // Wrap each thumbnail in a real button: reachable with Tab, opens with Enter or Space
  const thumbButtons = galleryImages.map(function(img, index) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-open';
    button.setAttribute('aria-label', 'View larger: ' + img.alt);
    img.parentNode.insertBefore(button, img);
    button.appendChild(img);
    button.addEventListener('click', function() {
      openLightbox(index);
    });

    // The hover caption repeats the button label, so hide it from screen readers
    const caption = button.parentNode.querySelector('.gallery-caption');
    if (caption) caption.setAttribute('aria-hidden', 'true');

    return button;
  });

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox hidden';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Photo viewer');
  lightbox.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button type="button" class="lightbox-arrow lightbox-prev" aria-label="Previous photo">&#10094;</button>' +
    '<img class="lightbox-img" src="" alt="">' +
    '<p class="lightbox-caption" aria-live="polite"></p>' +
    '<button type="button" class="lightbox-arrow lightbox-next" aria-label="Next photo">&#10095;</button>';
  document.body.appendChild(lightbox);

  const closeButton = lightbox.querySelector('.lightbox-close');
  const prevButton = lightbox.querySelector('.lightbox-prev');
  const nextButton = lightbox.querySelector('.lightbox-next');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const focusableInLightbox = [closeButton, prevButton, nextButton];

  let currentIndex = 0;
  let inertElements = [];

  function showImage(index) {
    currentIndex = (index + galleryImages.length) % galleryImages.length;
    const img = galleryImages[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;

    // Visible caption stays the same; screen readers also hear "Photo 3 of 24"
    const counter = document.createElement('span');
    counter.className = 'visually-hidden';
    counter.textContent = 'Photo ' + (currentIndex + 1) + ' of ' + galleryImages.length + ': ';
    lightboxCaption.replaceChildren(counter, document.createTextNode(img.alt));
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.remove('hidden');

    // Make the rest of the page unreachable (Tab and screen readers) while the viewer is open
    inertElements = Array.from(document.body.children).filter(function(el) {
      return el !== lightbox && !el.inert;
    });
    inertElements.forEach(function(el) { el.inert = true; });
    document.body.classList.add('lightbox-open');

    document.addEventListener('keydown', handleLightboxKeys);
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    inertElements.forEach(function(el) { el.inert = false; });
    inertElements = [];
    document.body.classList.remove('lightbox-open');
    document.removeEventListener('keydown', handleLightboxKeys);

    // Return focus to the thumbnail of the photo that was last on screen
    const thumb = thumbButtons[currentIndex];
    thumb.focus({ preventScroll: true });
    thumb.scrollIntoView({ block: 'center' });
  }

  function handleLightboxKeys(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      showImage(currentIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showImage(currentIndex - 1);
    } else if (e.key === 'Tab') {
      // Keep Tab / Shift+Tab cycling through the viewer's buttons only
      e.preventDefault();
      const last = focusableInLightbox.length - 1;
      const current = focusableInLightbox.indexOf(document.activeElement);
      let next;
      if (e.shiftKey) {
        next = current <= 0 ? last : current - 1;
      } else {
        next = current === -1 || current === last ? 0 : current + 1;
      }
      focusableInLightbox[next].focus();
    }
  }

  closeButton.addEventListener('click', closeLightbox);
  prevButton.addEventListener('click', function() { showImage(currentIndex - 1); });
  nextButton.addEventListener('click', function() { showImage(currentIndex + 1); });

  // Clicking the dark background closes the viewer; clicking the photo itself does not
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });
}

// Discourage casual saving of photos: block right-click and drag on gallery and lightbox images
function isProtectedImage(el) {
  return el.tagName === 'IMG' && (el.closest('.gallery') || el.closest('.lightbox'));
}

document.addEventListener('contextmenu', function(e) {
  if (isProtectedImage(e.target)) e.preventDefault();
});

document.addEventListener('dragstart', function(e) {
  if (isProtectedImage(e.target)) e.preventDefault();
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