document.querySelectorAll('.faq__item').forEach((item) => {
  const trigger = item.querySelector('.faq__question');
  const icon = item.querySelector('.faq__toggle');
  const answers = item.querySelectorAll('.faq__answer');

  if (!trigger || !icon || answers.length === 0) return;

  answers.forEach((answer) => (answer.hidden = true));
  trigger.setAttribute('aria-expanded', 'false');

  trigger.addEventListener('click', () => {
    const expanded = item.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(expanded));
    answers.forEach((answer) => {
      answer.hidden = !expanded;
    });
    icon.textContent = expanded ? '−' : '+';
  });
});

const videoHighlight = document.querySelector('[data-video-highlight]');
const videoCards = document.querySelectorAll('[data-video-item]');
const videoCardList = Array.from(videoCards);

if (videoHighlight && videoCardList.length) {
  const highlightElements = {
    cover: videoHighlight.querySelector('[data-video-cover]'),
    link: videoHighlight.querySelector('[data-video-link]'),
    cta: videoHighlight.querySelector('[data-video-cta]'),
    source: videoHighlight.querySelector('[data-video-source]'),
    title: videoHighlight.querySelector('[data-video-title]'),
    description: videoHighlight.querySelector('[data-video-description]'),
  };

  const videoPrevBtn = videoHighlight.querySelector('[data-video-prev]');
  const videoNextBtn = videoHighlight.querySelector('[data-video-next]');
  let activeVideoCard = null;

  const getInitialCard = () => {
    const preset = videoCardList.find((card) => card.getAttribute('aria-pressed') === 'true');
    if (preset) return preset;
    const firstCard = videoCardList[0];
    if (firstCard) firstCard.setAttribute('aria-pressed', 'true');
    return firstCard;
  };

  const updateHighlight = (card) => {
    const { videoCover, videoUrl, videoCta, videoSource, videoTitle, videoDescription } = card.dataset;

    if (videoCover && highlightElements.cover) {
      highlightElements.cover.src = videoCover;
      if (videoTitle) {
        highlightElements.cover.alt = videoTitle;
      }
    }

    if (videoUrl && highlightElements.link) {
      highlightElements.link.href = videoUrl;
    }

    if (videoCta && highlightElements.cta) {
      highlightElements.cta.textContent = videoCta;
    }

    if (videoSource && highlightElements.source) {
      highlightElements.source.textContent = videoSource;
    }

    if (videoTitle && highlightElements.title) {
      highlightElements.title.textContent = videoTitle;
    }

    if (videoDescription && highlightElements.description) {
      highlightElements.description.textContent = videoDescription;
    }
  };

  const activateCard = (card) => {
    if (card === activeVideoCard) return;

    if (activeVideoCard) {
      activeVideoCard.setAttribute('aria-pressed', 'false');
    }

    card.setAttribute('aria-pressed', 'true');
    activeVideoCard = card;
    updateHighlight(card);
  };

  activeVideoCard = getInitialCard();
  if (activeVideoCard) {
    updateHighlight(activeVideoCard);
  }

  videoCards.forEach((card) => {
    card.addEventListener('click', () => activateCard(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activateCard(card);
      }
    });
  });

  const moveBy = (delta) => {
    if (!activeVideoCard) return;
    const currentIndex = videoCardList.indexOf(activeVideoCard);
    let targetIndex = currentIndex + delta;
    if (targetIndex < 0) {
      targetIndex = videoCardList.length - 1;
    } else if (targetIndex >= videoCardList.length) {
      targetIndex = 0;
    }
    const targetCard = videoCardList[targetIndex];
    if (targetCard) activateCard(targetCard);
  };

  videoPrevBtn?.addEventListener('click', () => moveBy(-1));
  videoNextBtn?.addEventListener('click', () => moveBy(1));
}

document.querySelectorAll('[data-countdown]').forEach((container) => {
  const targetDateValue = container.dataset.countdownTarget;
  if (!targetDateValue) return;
  const targetDate = new Date(targetDateValue);
  if (Number.isNaN(targetDate.getTime())) return;

  const daysEl = container.querySelector('[data-countdown-days]');
  const hoursEl = container.querySelector('[data-countdown-hours]');
  const minutesEl = container.querySelector('[data-countdown-minutes]');
  const secondsEl = container.querySelector('[data-countdown-seconds]');

  const updateSegment = (el, value) => {
    if (!el) return;
    el.textContent = String(value).padStart(2, '0');
  };

  const updateCountdown = () => {
    const now = new Date();
    let diff = targetDate.getTime() - now.getTime();
    if (diff <= 0) {
      updateSegment(daysEl, 0);
      updateSegment(hoursEl, 0);
      updateSegment(minutesEl, 0);
      updateSegment(secondsEl, 0);
      clearInterval(timerId);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * 1000 * 60 * 60 * 24;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * 1000 * 60;
    const seconds = Math.floor(diff / 1000);

    updateSegment(daysEl, days);
    updateSegment(hoursEl, hours);
    updateSegment(minutesEl, minutes);
    updateSegment(secondsEl, seconds);
  };

  updateCountdown();
  const timerId = setInterval(updateCountdown, 1000);
});

document.querySelectorAll('[data-case-gallery]').forEach((gallery) => {
  const track = gallery.querySelector('.case-gallery__track');
  const slides = track ? Array.from(track.children) : [];
  const prevBtn = gallery.querySelector('[data-case-prev]');
  const nextBtn = gallery.querySelector('[data-case-next]');

  if (!track || slides.length === 0) {
    prevBtn?.setAttribute('hidden', '');
    nextBtn?.setAttribute('hidden', '');
    return;
  }

  let index = 0;

  const toggleButtons = () => {
    if (slides.length <= 1) {
      prevBtn?.setAttribute('hidden', '');
      nextBtn?.setAttribute('hidden', '');
    } else {
      prevBtn?.removeAttribute('hidden');
      nextBtn?.removeAttribute('hidden');
    }
  };

  const updatePosition = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
  };

  toggleButtons();
  updatePosition();

  if (slides.length <= 1) return;

  prevBtn?.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    updatePosition();
  });

  nextBtn?.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    updatePosition();
  });
});

const mobileNav = document.getElementById('mobile-nav');
const mobileNavTrigger = document.querySelector('[data-mobile-nav-trigger]');
const mobileNavCloseTargets = document.querySelectorAll('[data-mobile-nav-close]');
const mobileNavLinks = document.querySelectorAll('[data-mobile-nav-link]');

const openMobileNav = () => {
  if (!mobileNav) return;
  mobileNav.classList.add('mobile-nav--open');
  mobileNav.setAttribute('aria-hidden', 'false');
  document.body.classList.add('mobile-nav-open');
  mobileNavTrigger?.setAttribute('aria-expanded', 'true');
};

const closeMobileNav = () => {
  if (!mobileNav) return;
  mobileNav.classList.remove('mobile-nav--open');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('mobile-nav-open');
  mobileNavTrigger?.setAttribute('aria-expanded', 'false');
};

mobileNavTrigger?.addEventListener('click', () => {
  if (mobileNav?.classList.contains('mobile-nav--open')) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
});

mobileNavCloseTargets.forEach((btn) => {
  btn.addEventListener('click', closeMobileNav);
});

mobileNavLinks.forEach((link) => {
  link.addEventListener('click', () => {
    closeMobileNav();
  });
});
