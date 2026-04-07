/*
  Portfolio HTML5 remake (no build tools).
  - Theme preference
  - Mobile nav toggle
  - Scroll reveal animations
  - Projects filter
  - CV preview modal
  - Contact form mailto flow
*/

const CONFIG = {
  name: 'Muhammed Riyas M.U',
  role: 'Flutter Developer',
  location: 'Kerala, India',
  emailTo: 'riyasmu08@gmail.com',
  githubUrl: 'https://github.com/muhammedriyasmu',
  linkedinUrl: 'https://linkedin.com/in/muhammed-riyas-mu',
  cvPath: 'assets/Muhammed_Riyas_CV.pdf',
  performance: {
    min3DWidth: 900,
    minVantaWidth: 1100,
    minCpuCores: 6,
    minDeviceMemory: 4
  }
};

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function runWhenIdle(callback, timeout = 500){
  if('requestIdleCallback' in window){
    window.requestIdleCallback(() => callback(), { timeout });
    return;
  }
  window.setTimeout(callback, 120);
}

function canRunHeavyMotion(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const isWideEnough = window.innerWidth >= CONFIG.performance.min3DWidth;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  return !reduceMotion && !isCoarse && isWideEnough && cores >= CONFIG.performance.minCpuCores && memory >= CONFIG.performance.minDeviceMemory;
}

(function initTheme(){
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = saved || (prefersDark ? 'dark' : 'light');
})();

function toggleTheme(){
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  updateThemeIcon();
}

function updateThemeIcon(){
  const btn = qs('[data-action="theme"]');
  if(!btn) return;
  const isDark = document.documentElement.dataset.theme === 'dark';
  btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  btn.title = isDark ? 'Light mode' : 'Dark mode';
  btn.textContent = isDark ? 'Light' : 'Dark';
}

function toggleMobileNav(e){
  if(e) e.preventDefault();

  const nav = qs('.nav-links');
  const btn = qs('[data-action="nav"]');
  const isMobileMode = window.matchMedia('(max-width: 760px)').matches;

  if(!nav || !btn) return;

  if(!isMobileMode){
    nav.classList.remove('mobile');
    btn.setAttribute('aria-expanded', 'false');
    return;
  }

  nav.classList.toggle('mobile');
  btn.setAttribute('aria-expanded', nav.classList.contains('mobile') ? 'true' : 'false');
}

function closeMobileNav(){
  const nav = qs('.nav-links');
  const btn = qs('[data-action="nav"]');
  if(!nav) return;
  nav.classList.remove('mobile');
  if(btn) btn.setAttribute('aria-expanded', 'false');
}

(function initMobileNav(){
  const btn = qs('[data-action="nav"]');
  const nav = qs('.nav-links');
  if(!btn || !nav) return;

  btn.addEventListener('click', toggleMobileNav);

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('click', (e) => {
    const isMobileMode = window.matchMedia('(max-width: 760px)').matches;
    if(!isMobileMode) return;
    if(nav.contains(e.target) || btn.contains(e.target)) return;
    closeMobileNav();
  });

  window.addEventListener('resize', () => {
    if(!window.matchMedia('(max-width: 760px)').matches) closeMobileNav();
  });
})();

function initReveal(){
  const items = qsa('.reveal');
  if(items.length === 0) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  items.forEach((item) => io.observe(item));
}

function initScroll3D(){
  if(!canRunHeavyMotion()) return;

  const groups = [
    { selector: '.hero-copy, .portrait-card', depth: 'hero' },
    { selector: '.floating-badge', depth: 'badge' },
    { selector: '.section-row, .skills-card, .cta-panel, .work-summary-panel, .toolchain-panel, .contact-form-shell, .skills-right', depth: 'section' },
    { selector: '.work-card, .project-card, .skill-card-large, .info-card, .contact-link-card', depth: 'card' }
  ];

  const items = [];
  const seen = new Set();

  groups.forEach(({ selector, depth }) => {
    qsa(selector).forEach((element) => {
      if(seen.has(element)) return;
      seen.add(element);
      element.classList.add('scroll-3d');
      element.dataset.scrollDepth = depth;
      items.push(element);
    });
  });

  if(items.length === 0) return;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  let ticking = false;

  const update = () => {
    const vh = window.innerHeight || 1;
    const vw = window.innerWidth || 1;
    const compact = vw < 760;

    items.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const centerY = rect.top + (rect.height / 2);
      const centerX = rect.left + (rect.width / 2);
      const progressY = clamp((centerY - (vh / 2)) / (vh / 2), -1.2, 1.2);
      const progressX = clamp((centerX - (vw / 2)) / (vw / 2), -1, 1);
      const visibility = 1 - Math.min(Math.abs(progressY), 1);
      const depth = element.dataset.scrollDepth;

      let shift = progressY * -24;
      let rotateX = progressY * -7;
      let rotateY = progressX * 6;
      let translateZ = visibility * 42;
      let scale = 0.94 + (visibility * 0.1);

      if(depth === 'section'){
        shift *= 0.7;
        rotateX *= 0.6;
        rotateY *= 0.45;
        translateZ *= 0.95;
        scale = 0.965 + (visibility * 0.07);
      } else if(depth === 'card'){
        shift *= 0.55;
        rotateX *= 0.75;
        rotateY *= 0.7;
        translateZ *= 1.15;
        scale = 0.92 + (visibility * 0.12);
      } else if(depth === 'badge'){
        shift *= 0.9;
        rotateX *= 1.1;
        rotateY *= 1.15;
        translateZ *= 1.45;
        scale = 0.98 + (visibility * 0.08);
      } else if(depth === 'hero'){
        translateZ *= 1.3;
        scale = 0.965 + (visibility * 0.09);
      }

      if(compact){
        shift *= 0.45;
        rotateX *= 0.4;
        rotateY *= 0.35;
        translateZ *= 0.45;
        scale = 0.98 + ((scale - 0.98) * 0.45);
      }

      element.style.setProperty('--scroll-shift', `${shift.toFixed(2)}px`);
      element.style.setProperty('--scroll-depth', `${translateZ.toFixed(2)}px`);
      element.style.setProperty('--scroll-scale', scale.toFixed(4));
      element.style.setProperty('--scroll-rotate-x', `${rotateX.toFixed(2)}deg`);
      element.style.setProperty('--scroll-rotate-y', `${rotateY.toFixed(2)}deg`);
    });

    ticking = false;
  };

  const requestTick = () => {
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
}

function initProjectsFilter(){
  const seg = qs('[data-project-filter]');
  if(!seg) return;

  const allBtn = qs('[data-filter="all"]', seg);
  const featBtn = qs('[data-filter="featured"]', seg);
  const cards = qsa('[data-project-card]');

  const apply = (mode) => {
    const featuredOnly = mode === 'featured';
    cards.forEach((card) => {
      const isFeatured = card.dataset.featured === 'true';
      card.style.display = (!featuredOnly || isFeatured) ? '' : 'none';
    });
    allBtn?.classList.toggle('active', mode === 'all');
    featBtn?.classList.toggle('active', mode === 'featured');
  };

  allBtn?.addEventListener('click', () => apply('all'));
  featBtn?.addEventListener('click', () => apply('featured'));
  apply('all');
}

function initHeroParallax(){
  const hero = qs('.hero');
  const visual = qs('.hero-visual');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!hero || !visual || reduceMotion) return;

  const onMove = (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) - 0.5;
    const y = ((e.clientY - rect.top) / rect.height) - 0.5;
    visual.style.setProperty('--hover-x', `${x * 16}px`);
    visual.style.setProperty('--hover-y', `${y * 10}px`);
  };

  const reset = () => {
    visual.style.setProperty('--hover-x', '0px');
    visual.style.setProperty('--hover-y', '0px');
  };

  hero.addEventListener('mousemove', onMove);
  hero.addEventListener('mouseleave', reset);
}

function initCardTilt(){
  const desktop = window.matchMedia('(min-width: 981px)').matches;
  if(!desktop || !canRunHeavyMotion()) return;

  qsa('.project-card, .work-card').forEach((card) => {
    card.classList.add('scroll-3d');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 5;
      const rotateX = (0.5 - y) * 4;
      card.style.setProperty('--hover-rotate-x', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--hover-rotate-y', `${rotateY.toFixed(2)}deg`);
      card.style.setProperty('--hover-lift', '-6px');
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--hover-rotate-x', '0deg');
      card.style.setProperty('--hover-rotate-y', '0deg');
      card.style.setProperty('--hover-lift', '0px');
    });
  });
}

function initVantaBackground(){
  const host = qs('#vanta-bg');
  if(!host || !document.body.classList.contains('has-vanta')) return;
  if(typeof VANTA === 'undefined' || !VANTA.GLOBE) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(window.matchMedia('(pointer: coarse)').matches) return;
  if(window.innerWidth < CONFIG.performance.minVantaWidth) return;

  if(window.__vantaInstance && typeof window.__vantaInstance.destroy === 'function'){
    window.__vantaInstance.destroy();
  }

  window.__vantaInstance = VANTA.GLOBE({
    el: '#vanta-bg',
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    backgroundColor: 0xf4f4f4,
    color: 0x31262b,
    color2: 0xffffff,
    size: 1.0
  });
}

function openCVModal(){
  const backdrop = qs('#cvModal');
  if(!backdrop) return;

  backdrop.classList.add('show');
  backdrop.setAttribute('aria-hidden', 'false');

  const frame = qs('#cvFrame');
  const placeholder = qs('#cvPlaceholder');

  if(frame){
    frame.src = CONFIG.cvPath;
  }

  if(frame && placeholder){
    fetch(CONFIG.cvPath, { method: 'HEAD' })
      .then((response) => {
        if(response.ok){
          frame.style.display = 'block';
          placeholder.style.display = 'none';
        } else {
          frame.style.display = 'none';
          placeholder.style.display = 'block';
        }
      })
      .catch(() => {
        frame.style.display = 'block';
        placeholder.style.display = 'none';
      });
  }

  document.body.style.overflow = 'hidden';
}

function closeCVModal(){
  const backdrop = qs('#cvModal');
  if(!backdrop) return;
  backdrop.classList.remove('show');
  backdrop.setAttribute('aria-hidden', 'true');
  const frame = qs('#cvFrame');
  if(frame) frame.src = 'about:blank';
  document.body.style.overflow = '';
}

function initContactForm(){
  const form = qs('#contactForm');
  if(!form) return;

  const notice = qs('#contactNotice');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = (qs('#name', form)?.value || '').trim();
    const email = (qs('#email', form)?.value || '').trim();
    const msg = (qs('#message', form)?.value || '').trim();
    const projectType = qs('input[name="projectType"]:checked', form)?.value || 'General Inquiry';

    if(!name || !email || !msg){
      if(notice){
        notice.textContent = 'Please fill in all fields.';
        notice.classList.add('show');
      }
      return;
    }

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nProject Type: ${projectType}\n\nMessage:\n${msg}\n\nSent from portfolio site`
    );
    const mailto = `mailto:${CONFIG.emailTo}?subject=${subject}&body=${body}`;

    window.location.href = mailto;

    if(notice){
      notice.textContent = "Message prepared in your email app. If it didn't open, copy the message and email me directly.";
      notice.classList.add('show');
    }

    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.body.classList.add('loaded');
  });

  const themeBtn = qs('[data-action="theme"]');
  themeBtn?.addEventListener('click', toggleTheme);
  updateThemeIcon();

  const navBtn = qs('[data-action="nav"]');
  navBtn?.addEventListener('click', toggleMobileNav);

  qsa('.nav-links a').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  qsa('[data-action="cv"]').forEach((btn) => btn.addEventListener('click', openCVModal));
  qs('[data-action="cv-close"]')?.addEventListener('click', closeCVModal);
  qs('#cvModal')?.addEventListener('click', (e) => {
    if(e.target && e.target.id === 'cvModal') closeCVModal();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeCVModal();
  });

  initReveal();
  initProjectsFilter();
  initContactForm();
  initHeroParallax();

  runWhenIdle(() => {
    initScroll3D();
    initCardTilt();
  }, 700);

  window.addEventListener('load', () => {
    runWhenIdle(() => {
      initVantaBackground();
    }, 1200);
  }, { once: true });
});
