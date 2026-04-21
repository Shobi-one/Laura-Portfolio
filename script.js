const revealTargets = document.querySelectorAll('.tile');

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

if (document.querySelector('.category-page') && window.baguetteBox) {
  const galleryImages = document.querySelectorAll('.category-grid .tile img');

  galleryImages.forEach((img) => {
    if (img.closest('a')) {
      return;
    }

    const link = document.createElement('a');
    link.href = img.currentSrc || img.src;
    link.className = 'lightbox-link';
    link.setAttribute('aria-label', `Open image: ${img.alt || 'Artwork'}`);
    img.parentNode.insertBefore(link, img);
    link.appendChild(img);
  });

  baguetteBox.run('.category-page .category-grid', {
    captions: (element) => {
      const image = element.getElementsByTagName('img')[0];
      return image ? image.alt : '';
    },
    animation: 'fadeIn',
    noScrollbars: true,
  });
}
