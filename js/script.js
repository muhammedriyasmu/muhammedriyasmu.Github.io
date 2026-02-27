/*
  Portfolio HTML5 remake (no build tools).
  - Dark mode toggle (saved to localStorage)
  - Mobile nav toggle
  - Scroll reveal animations
  - Projects filter
  - CV preview modal (PDF embed if present)
  - Contact form (JS-only): opens email client via mailto + shows success message
*/

const CONFIG = {
  name: 'Muhammed Riyas M.U',
  role: 'Flutter Developer',
  location: 'Kerala, India',
  emailTo: 'riyasmu08@gmail.com.com',
  githubUrl: 'https://github.com/muhammedriyasmu',
  linkedinUrl: 'https://linkedin.com/in/muhammed-riyas-mu',
  cvPath: 'assets/Muhammed_Riyas_CV.pdf'
};

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

// --------------------
// Theme
// --------------------
(function initTheme(){
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
})();

function toggleTheme(){
  const now = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = now;
  localStorage.setItem('theme', now);
  updateThemeIcon();
}

function updateThemeIcon(){
  const btn = qs('[data-action="theme"]');
  if(!btn) return;
  const isDark = document.documentElement.dataset.theme === 'dark';
  btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  btn.title = isDark ? 'Light mode' : 'Dark mode';
  btn.innerHTML = isDark ? '☀️' : '🌙';
}

// --------------------
// Mobile nav (updated)
// --------------------
function toggleMobileNav(e){
  if (e) e.preventDefault();

  const nav = qs('.nav-links');
  const btn = qs('[data-action="nav"]');
  const isMobileMode = window.matchMedia('(max-width: 880px)').matches;

  if(!nav || !btn) return;

  // If not mobile, ensure closed and exit
  if(!isMobileMode){
    nav.classList.remove('mobile');
    btn.setAttribute('aria-expanded', 'false');
    return;
  }

  // Toggle open/close
  nav.classList.toggle('mobile');
  const expanded = nav.classList.contains('mobile');
  btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
}

function closeMobileNav(){
  const nav = qs('.nav-links');
  const btn = qs('[data-action="nav"]');
  if(!nav) return;

  nav.classList.remove('mobile');
  if(btn) btn.setAttribute('aria-expanded', 'false');
}

// --------------------
// Bindings (call once)
// --------------------
(function initMobileNav(){
  const btn = qs('[data-action="nav"]');
  const nav = qs('.nav-links');
  if(!btn || !nav) return;

  // Toggle on hamburger click
  btn.addEventListener('click', toggleMobileNav);

  // Close when clicking a link
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMobileNav);
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const isMobileMode = window.matchMedia('(max-width: 880px)').matches;
    if(!isMobileMode) return;

    const clickedInsideNav = nav.contains(e.target);
    const clickedButton = btn.contains(e.target);

    if(!clickedInsideNav && !clickedButton){
      closeMobileNav();
    }
  });

  // Reset on resize (moving from mobile -> desktop)
  window.addEventListener('resize', () => {
    const isMobileMode = window.matchMedia('(max-width: 880px)').matches;
    if(!isMobileMode) closeMobileNav();
  });
})();
// --------------------
// Scroll reveal
// --------------------
function initReveal(){
  const items = qsa('.reveal');
  if(items.length === 0) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('show');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.14 });

  items.forEach(el => io.observe(el));
}

// --------------------
// Projects filter
// --------------------
function initProjectsFilter(){
  const seg = qs('[data-project-filter]');
  if(!seg) return;

  const allBtn = qs('[data-filter="all"]', seg);
  const featBtn = qs('[data-filter="featured"]', seg);
  const cards = qsa('[data-project-card]');

  const apply = (mode) => {
    const featuredOnly = mode === 'featured';
    cards.forEach(c => {
      const isFeatured = c.dataset.featured === 'true';
      c.style.display = (!featuredOnly || isFeatured) ? '' : 'none';
    });
    allBtn.classList.toggle('active', mode === 'all');
    featBtn.classList.toggle('active', mode === 'featured');
  };

  allBtn?.addEventListener('click', () => apply('all'));
  featBtn?.addEventListener('click', () => apply('featured'));
  apply('all');
}

// --------------------
// CV modal
// --------------------
function openCVModal(){
  const backdrop = qs('#cvModal');
  if(!backdrop) return;
  backdrop.classList.add('show');
  backdrop.setAttribute('aria-hidden', 'false');

  const frame = qs('#cvFrame');
  const placeholder = qs('#cvPlaceholder');

  // We can't reliably check file existence on static hosting without a fetch.
  // We'll try fetch; if blocked or missing, fallback to placeholder.
  if(frame){
    frame.src = CONFIG.cvPath;
  }

  if(frame && placeholder){
    fetch(CONFIG.cvPath, { method: 'HEAD' })
      .then(r => {
        if(r.ok){
          frame.style.display = 'block';
          placeholder.style.display = 'none';
        } else {
          frame.style.display = 'none';
          placeholder.style.display = 'block';
        }
      })
      .catch(() => {
        // On some hosts HEAD may be blocked; still try showing iframe.
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

// --------------------
// Contact form (mailto)
// --------------------
function initContactForm(){
  const form = qs('#contactForm');
  if(!form) return;

  const notice = qs('#contactNotice');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = (qs('#name')?.value || '').trim();
    const email = (qs('#email')?.value || '').trim();
    const msg = (qs('#message')?.value || '').trim();

    if(!name || !email || !msg){
      if(notice){
        notice.textContent = 'Please fill in all fields.';
        notice.classList.add('show');
      }
      return;
    }

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}\n\n— Sent from portfolio site`);

    const mailto = `mailto:${CONFIG.emailTo}?subject=${subject}&body=${body}`;

    // Open user's email client
    window.location.href = mailto;

    // UX confirmation
    if(notice){
      notice.textContent = "Message prepared in your email app. If it didn't open, copy the message and email me directly.";
      notice.classList.add('show');
    }

    form.reset();
  });
}

// --------------------
// Wire up actions
// --------------------
document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = qs('[data-action="theme"]');
  themeBtn?.addEventListener('click', toggleTheme);
  updateThemeIcon();

  const navBtn = qs('[data-action="nav"]');
  navBtn?.addEventListener('click', toggleMobileNav);

  qsa('.nav-links a').forEach(a => {
    a.addEventListener('click', closeMobileNav);
  });

  // CV modal
  qsa('[data-action="cv"]').forEach(btn => btn.addEventListener('click', openCVModal));
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
});
