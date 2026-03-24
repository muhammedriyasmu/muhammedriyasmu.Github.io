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
  cvPath: 'assets/Muhammed_Riyas_CV.pdf'
};

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

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
    visual.style.transform = `translate3d(${x * 16}px, ${y * 10}px, 0)`;
  };

  const reset = () => {
    visual.style.transform = 'translate3d(0,0,0)';
  };

  hero.addEventListener('mousemove', onMove);
  hero.addEventListener('mouseleave', reset);
}

function initCardTilt(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia('(min-width: 981px)').matches;
  if(reduceMotion || !desktop) return;

  qsa('.project-card, .work-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 5;
      const rotateX = (0.5 - y) * 4;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function initVantaBackground(){
  const host = qs('#vanta-bg');
  if(!host || !document.body.classList.contains('has-vanta')) return;
  if(typeof VANTA === 'undefined' || !VANTA.GLOBE) return;

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
  initCardTilt();
  initVantaBackground();
});
