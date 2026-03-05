export default function decorate(block) {
  const slides = [...block.children];
  if (slides.length === 0) return;

  // Build slide structure
  slides.forEach((slide, i) => {
    slide.classList.add('carousel-slide');
    if (i === 0) slide.classList.add('carousel-slide-active');

    const cols = [...slide.children];
    if (cols.length >= 2) {
      cols[0].classList.add('carousel-slide-image');
      cols[1].classList.add('carousel-slide-content');
    }
  });

  // Navigation arrows
  const nav = document.createElement('div');
  nav.className = 'carousel-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-nav-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '<span class="carousel-nav-icon"></span>';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-nav-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '<span class="carousel-nav-icon"></span>';

  nav.append(prevBtn, nextBtn);

  // Indicators
  const indicators = document.createElement('div');
  indicators.className = 'carousel-indicators';
  indicators.setAttribute('role', 'tablist');

  let current = 0;
  let autoplayTimer;

  function goToSlide(index) {
    slides[current].classList.remove('carousel-slide-active');
    indicators.children[current].classList.remove('carousel-indicator-active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('carousel-slide-active');
    indicators.children[current].classList.add('carousel-indicator-active');
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      goToSlide(current + 1);
    }, 6000);
  }

  slides.forEach((slide, i) => {
    const btn = document.createElement('button');
    btn.className = 'carousel-indicator';
    if (i === 0) btn.classList.add('carousel-indicator-active');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', `Slide ${i + 1}`);

    const heading = slide.querySelector('h2, h3, h4');
    btn.textContent = heading ? heading.textContent : `Slide ${i + 1}`;

    btn.addEventListener('click', () => { goToSlide(i); resetAutoplay(); });
    indicators.append(btn);
  });

  prevBtn.addEventListener('click', () => { goToSlide(current - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goToSlide(current + 1); resetAutoplay(); });

  block.append(nav, indicators);

  // Start autoplay
  resetAutoplay();

  // Pause on hover
  block.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  block.addEventListener('mouseleave', resetAutoplay);
}
