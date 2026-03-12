const revealTargets = document.querySelectorAll('.tile');
const tileImages = document.querySelectorAll('.tile img');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxCaption = document.querySelector('#lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
let currentIndex = 0;

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('revealed');
      obs.unobserve(entry.target);
    });
  },
  {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.08,
  }
);

revealTargets.forEach((target, index) => {
  target.style.transitionDelay = `${Math.min(index * 28, 480)}ms`;
  observer.observe(target);
});

const openLightbox = (index) => {
  const targetImage = tileImages[index];
  if (!targetImage || !lightbox || !lightboxImage || !lightboxCaption) {
    return;
  }

  currentIndex = index;
  lightboxImage.src = targetImage.src;
  lightboxImage.alt = targetImage.alt;

  const captionSource = targetImage.closest('.tile')?.querySelector('figcaption');
  lightboxCaption.textContent = captionSource ? captionSource.textContent : '';

  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

const navigateLightbox = (step) => {
  if (!tileImages.length) {
    return;
  }

  const nextIndex = (currentIndex + step + tileImages.length) % tileImages.length;
  openLightbox(nextIndex);
};

tileImages.forEach((img, index) => {
  img.addEventListener('click', () => {
    openLightbox(index);
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxPrev) {
  lightboxPrev.addEventListener('click', () => {
    navigateLightbox(-1);
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener('click', () => {
    navigateLightbox(1);
  });
}

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (!lightbox || !lightbox.classList.contains('is-open')) {
    return;
  }

  if (event.key === 'Escape') {
    closeLightbox();
  }

  if (event.key === 'ArrowLeft') {
    navigateLightbox(-1);
  }

  if (event.key === 'ArrowRight') {
    navigateLightbox(1);
  }
});
