// ── Mobile nav toggle ──────────────────────────────────────────
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('hidden');
  menuBtn.setAttribute('aria-expanded', String(!isOpen));
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

// ── Active nav highlight on scroll ────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[data-section]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('text-ink', link.dataset.section === entry.target.id);
        link.classList.toggle('text-muted', link.dataset.section !== entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// ── Scroll-reveal ──────────────────────────────────────────────
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

// ── Contact form (Formspree) ───────────────────────────────────
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  try {
    const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      formStatus.textContent = "Message sent! I'll get back to you soon.";
      formStatus.classList.remove('hidden', 'text-red-500');
      formStatus.classList.add('text-accent');
      form.reset();
    } else throw new Error();
  } catch {
    formStatus.textContent = 'Something went wrong. Try emailing me directly.';
    formStatus.classList.remove('hidden', 'text-accent');
    formStatus.classList.add('text-red-500');
  }
});
