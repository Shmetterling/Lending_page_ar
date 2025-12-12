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

const body = document.body;
let activeModal = null;

const getModal = (id) => document.getElementById(`modal-${id}`);

const openModal = (id) => {
  const modal = getModal(id);
  if (!modal) return;
  if (activeModal && activeModal !== modal) {
    closeModal(activeModal);
  }
  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add('is-visible'));
  body.classList.add('modal-open');
  activeModal = modal;
};

const closeModal = (modal) => {
  if (!modal) return;
  modal.classList.remove('is-visible');
  setTimeout(() => {
    modal.hidden = true;
  }, 250);
  body.classList.remove('modal-open');
  if (activeModal === modal) {
    activeModal = null;
  }
};

document.querySelectorAll('[data-modal]').forEach((btn) => {
  btn.addEventListener('click', () => openModal(btn.dataset.modal));
});

document.querySelectorAll('[data-modal-close]').forEach((el) => {
  el.addEventListener('click', () => closeModal(el.closest('.modal')));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && activeModal) {
    closeModal(activeModal);
  }
});

const initCarousel = (carousel) => {
  const track = carousel.querySelector('[data-carousel-track]');
  if (!track) return;
  const slides = Array.from(track.children);
  if (!slides.length) return;

  let index = 0;
  const prevBtn = carousel.querySelector('[data-carousel-prev]');
  const nextBtn = carousel.querySelector('[data-carousel-next]');

  const update = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
  };

  const goTo = (newIndex) => {
    if (slides.length === 0) return;
    if (newIndex < 0) {
      index = slides.length - 1;
    } else if (newIndex >= slides.length) {
      index = 0;
    } else {
      index = newIndex;
    }
    update();
  };

  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));

  update();
};

document.querySelectorAll('[data-carousel]').forEach(initCarousel);

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
