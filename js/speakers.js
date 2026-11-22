(() => {
  'use strict';

  const SPEAKERS = [
    {
      id: 'speaker-01',
      firstName: 'Mouhssine',
      lastName: 'Lamsiah',
      formationFr: 'Marketing Stratégique & Architecture de Marque',
      formationEn: 'Strategic Marketing & Brand Architecture',
      dayFr: 'SAMEDI 28 NOVEMBRE 2026',
      dayEn: 'SATURDAY, NOVEMBER 28, 2026',
      portrait: 'assets/speakers/mouhssine-portrait.jpg',
      background: 'assets/speakers/mouhssine-background.jpg',
    },
    {
      id: 'speaker-02',
      firstName: 'Abdelbasset',
      lastName: 'Tassine',
      formationFr: 'Graphic Design & Branding',
      formationEn: 'Graphic Design & Branding',
      dayFr: 'SAMEDI 28 NOVEMBRE 2026',
      dayEn: 'SATURDAY, NOVEMBER 28, 2026',
      portrait: 'assets/speakers/abdelbasset-portrait.jpg',
      background: 'assets/speakers/abdelbasset-background.jpg',
    },
  ];

  const section = document.getElementById('speakers');
  if (!section || section.dataset.speakersInitialized === 'true' || SPEAKERS.length === 0) return;
  section.dataset.speakersInitialized = 'true';

  const backgroundStack = section.querySelector('[data-background-stack]');
  const portraits = section.querySelector('[data-portrait-stage]');
  const firstName = section.querySelector('[data-speaker-first]');
  const lastName = section.querySelector('[data-speaker-last]');
  const formation = section.querySelector('[data-speaker-formation]');
  const day = section.querySelector('[data-speaker-day]');
  const caption = section.querySelector('[data-speaker-caption]');
  const counter = section.querySelector('[data-speaker-current]');
  const totalCounter = section.querySelector('[data-speaker-total]');
  if (!backgroundStack || !portraits || !firstName || !lastName || !formation || !day || !caption || !counter) return;

  const mod = (value, total) => ((value % total) + total) % total;
  const speakers = SPEAKERS.slice();
  const totalCount = speakers.length;

  if (totalCounter) {
    totalCounter.textContent = String(totalCount).padStart(2, '0');
  }

  // Balanced orbital layout for 2 speakers: active centered at 0°, companion positioned gracefully on the arc
  const seatAngles = totalCount === 2 ? [0, 34] : [0, -44, -84, 180, -276, -316];
  const seatScales = totalCount === 2 ? [1.04, 0.72] : [1, 0.76, 0.57, 0.42, 0.57, 0.76];
  const seatOpacity = totalCount === 2 ? [1, 0.86] : [1, 0.92, 0.76, 0, 0.76, 0.92];

  const reducedMotion = typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const backgroundLayers = [];
  const nodes = [];
  let currentAngles = new Array(totalCount).fill(0);
  let activeIndex = 0;
  let animationFrame = 0;
  let textTimer = 0;
  let swipe = null;
  let suppressClickUntil = 0;

  function getLocalizedSpeaker(speaker) {
    const english = document.documentElement.lang === 'en';
    return {
      firstName: speaker.firstName,
      lastName: speaker.lastName,
      formation: english ? speaker.formationEn : speaker.formationFr,
      day: english ? speaker.dayEn : speaker.dayFr,
    };
  }

  speakers.forEach((speaker, index) => {
    const layer = document.createElement('div');
    layer.className = 'speaker-orbit__backdrop';
    layer.setAttribute('aria-hidden', 'true');
    layer.style.backgroundImage = `url("${speaker.background}")`;
    layer.classList.toggle('is-current', index === activeIndex);
    backgroundStack.appendChild(layer);
    backgroundLayers.push(layer);

    const node = document.createElement('div');
    node.className = 'speaker-orbit__node';
    node.dataset.speakerIndex = String(index);

    const button = document.createElement('button');
    button.className = 'speaker-orbit__pick';
    button.type = 'button';
    button.dataset.speakerSelect = String(index);
    button.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');

    const visual = document.createElement('span');
    visual.className = 'speaker-orbit__visual';
    visual.setAttribute('aria-hidden', 'true');

    const disc = document.createElement('span');
    disc.className = 'speaker-orbit__disc';
    const image = document.createElement('img');
    image.className = 'speaker-orbit__portrait';
    image.src = speaker.portrait;
    image.alt = `${speaker.firstName} ${speaker.lastName}`.trim();
    image.loading = 'eager';
    image.decoding = 'async';
    disc.appendChild(image);
    visual.appendChild(disc);
    button.appendChild(visual);
    node.appendChild(button);
    portraits.appendChild(node);
    nodes.push({ node, button, visual });
  });

  function preloadBackground(src) {
    return new Promise((resolve) => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        if (typeof image.decode === 'function') image.decode().catch(() => {}).finally(resolve);
        else resolve();
      };
      image.onerror = resolve;
      image.src = src;
      if (image.complete && image.naturalWidth) {
        if (typeof image.decode === 'function') image.decode().catch(() => {}).finally(resolve);
        else resolve();
      }
    });
  }

  const backgroundPreload = Promise.all(speakers.map((speaker) => preloadBackground(speaker.background)));
  backgroundPreload.then(() => section.classList.add('is-assets-ready'));

  function targetAngleFor(index, active) {
    if (totalCount === 2) {
      if (index === active) return 0;
      return index === 1 ? 34 : -34;
    }
    const offset = mod(index - active, totalCount);
    return seatAngles[offset];
  }

  function geometry() {
    const width = section.clientWidth || window.innerWidth;
    const height = section.clientHeight || window.innerHeight;
    const mobile = width < 768;
    return mobile
      ? { rx: width * 0.42, ry: height * 0.48, cy: height * 0.76 }
      : { rx: width * 0.42, ry: height * 0.54, cy: height * 0.82 };
  }

  function renderPositions() {
    const { rx, ry, cy } = geometry();
    nodes.forEach(({ node, button, visual }, index) => {
      const offset = mod(index - activeIndex, totalCount);
      const radians = (currentAngles[index] * Math.PI) / 180;
      const x = Math.sin(radians) * rx;
      const y = cy - Math.cos(radians) * ry;
      node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      button.style.setProperty('--speaker-scale', String(seatScales[offset]));
      visual.style.opacity = String(seatOpacity[offset]);
      visual.style.setProperty('--speaker-lens-image', `url("${speakers[activeIndex].background}")`);
      node.style.zIndex = String(offset === 0 ? 30 : 18);
      node.style.pointerEvents = 'auto';
      button.tabIndex = 0;
      button.setAttribute('aria-current', offset === 0 ? 'true' : 'false');
      button.setAttribute('aria-label', `${speakers[index].firstName} ${speakers[index].lastName}`.trim());
      button.setAttribute('aria-hidden', 'false');
    });
  }

  function applyCaptionText(index) {
    const localized = getLocalizedSpeaker(speakers[index]);
    firstName.textContent = localized.firstName;
    lastName.textContent = localized.lastName;
    formation.textContent = localized.formation;
    day.textContent = localized.day;
    counter.textContent = String(index + 1).padStart(2, '0');
  }

  function animateCaption(index) {
    window.clearTimeout(textTimer);
    caption.classList.remove('is-entering', 'is-leaving');
    caption.classList.add('is-leaving');
    textTimer = window.setTimeout(() => {
      applyCaptionText(index);
      caption.classList.remove('is-leaving');
      caption.classList.add('is-entering');
      requestAnimationFrame(() => requestAnimationFrame(() => caption.classList.remove('is-entering')));
    }, reducedMotion ? 0 : 210);
  }

  function setSpeaker(nextIndex) {
    const next = mod(nextIndex, totalCount);
    if (next === activeIndex) return;
    if (animationFrame) cancelAnimationFrame(animationFrame);

    const starts = currentAngles.slice();
    activeIndex = next;
    const targets = speakers.map((_speaker, index) => targetAngleFor(index, activeIndex));

    backgroundLayers.forEach((layer, index) => layer.classList.toggle('is-current', index === activeIndex));
    animateCaption(activeIndex);

    if (reducedMotion) {
      currentAngles = targets;
      renderPositions();
      return;
    }

    const startedAt = performance.now();
    const duration = 760;
    const tick = (now) => {
      const raw = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - raw, 4);
      currentAngles = starts.map((value, index) => value + (targets[index] - value) * eased);
      renderPositions();
      if (raw < 1) animationFrame = requestAnimationFrame(tick);
      else {
        currentAngles = targets;
        animationFrame = 0;
        renderPositions();
      }
    };
    animationFrame = requestAnimationFrame(tick);
  }

  function setInitialState() {
    currentAngles = speakers.map((_speaker, index) => targetAngleFor(index, activeIndex));
    applyCaptionText(0);
    renderPositions();
  }

  section.addEventListener('click', (event) => {
    if (Date.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const select = event.target.closest('[data-speaker-select]');
    if (select) {
      setSpeaker(Number(select.dataset.speakerSelect));
      return;
    }
    const navigation = event.target.closest('[data-speaker-step]');
    if (navigation) setSpeaker(activeIndex + Number(navigation.dataset.speakerStep));
  });

  section.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setSpeaker(activeIndex + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setSpeaker(activeIndex - 1);
    }
  });

  section.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    swipe = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }, { passive: true });

  section.addEventListener('pointerup', (event) => {
    if (!swipe || swipe.id !== event.pointerId) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      suppressClickUntil = Date.now() + 360;
      setSpeaker(activeIndex + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
  section.addEventListener('pointercancel', () => { swipe = null; }, { passive: true });

  let resizeFrame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(renderPositions);
  }, { passive: true });

  setInitialState();
  backgroundPreload.catch(() => {});

  // Navigation link & i18n sync
  const nav = document.querySelector('.hero-nav');
  if (nav && !nav.querySelector('a[href="#speakers"]')) {
    const link = document.createElement('a');
    link.href = '#speakers';
    nav.appendChild(link);
    const translate = () => {
      const english = document.documentElement.lang === 'en';
      link.textContent = english ? 'Speakers' : 'Intervenants';
      section.setAttribute('aria-label', english ? 'The speakers behind Think Before You Design' : 'Les intervenants de Think Before You Design');
      section.querySelector('[data-speaker-copy="eyebrow"]').textContent = english ? 'SPEAKERS · THINK BEFORE YOU DESIGN' : 'INTERVENANTS · THINK BEFORE YOU DESIGN';
      section.querySelector('[data-speaker-copy="hint"]').textContent = english ? 'Choose a portrait · Use ← → arrow keys to navigate' : 'Choisissez un portrait · Flèches ← → pour naviguer';
      section.querySelector('.speaker-orbit__count').setAttribute('aria-label', english ? 'Number of speakers' : 'Nombre d’intervenants');
      for (const [step, en, fr] of [['-1', 'Previous speaker', 'Intervenant précédent'], ['1', 'Next speaker', 'Intervenant suivant']]) {
        const button = section.querySelector('[data-speaker-step="' + step + '"]');
        const label = english ? en : fr;
        if (button) {
          button.setAttribute('aria-label', label);
          button.title = label;
        }
      }
      applyCaptionText(activeIndex);
    };
    translate();
    new MutationObserver(translate).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
})();
