/**
 * script.js — Matias Tornatti Portfolio
 * Handles: scroll reveal, navbar, mobile menu, back-to-top, contact form, year
 */

'use strict';

/* ─── Utility ─────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─── Year ─────────────────────────────────────────── */
const yearEl = qs('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── Navbar scroll state ──────────────────────────── */
const navbar = qs('#navbar');
function updateNavbar() {
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ─── Mobile menu ──────────────────────────────────── */
const navToggle = qs('#navToggle');
const navMenu   = qs('#navMenu');

function closeMenu() {
  navMenu?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
}

navToggle?.addEventListener('click', () => {
  const isOpen = navMenu?.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close when a nav link is clicked
qsa('.nav-link').forEach(link => link.addEventListener('click', closeMenu));

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

/* ─── Scroll Reveal (IntersectionObserver) ─────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger siblings inside the same grid/flex parent
        staggerSiblings(entry.target);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

qsa('.reveal').forEach(el => revealObserver.observe(el));

function staggerSiblings(el) {
  // Add stagger delay to sibling .reveal elements in same parent
  const siblings = qsa(':scope > .reveal', el.parentElement);
  siblings.forEach((sib, i) => {
    if (!sib.classList.contains('visible')) {
      sib.style.transitionDelay = `${i * 80}ms`;
    }
  });
}

/* ─── Skill bar animation trigger ──────────────────── */
// Skill bars animate when the skills-card becomes visible
const skillsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        skillsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.25 }
);

qsa('.skills-card').forEach(card => skillsObserver.observe(card));

/* ─── Back to top ──────────────────────────────────── */
const backToTop = qs('#backToTop');

window.addEventListener('scroll', () => {
  if (!backToTop) return;
  const show = window.scrollY > 400;
  backToTop.hidden = !show;
}, { passive: true });

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── Active nav link on scroll ────────────────────── */
const sections  = qsa('section[id]');
const navLinks  = qsa('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));

/* ─── Contact form ──────────────────────────────────── */
const contactForm  = qs('#contactForm');
const submitBtn    = qs('#submitBtn');
const formFeedback = qs('#formFeedback');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  // Gather data
  const data = {
    name:    contactForm.name.value.trim(),
    email:   contactForm.email.value.trim(),
    message: contactForm.message.value.trim(),
  };

  // Disable button while "sending"
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Enviando…';
  setFeedback('', '');

  try {
    // ── REPLACE this block with your real backend / Formspree endpoint ──
    // Example with Formspree:
    // const res = await fetch('https://formspree.io/f/YOUR_ID', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // if (!res.ok) throw new Error('Server error');

    // Simulated delay for demo purposes
    await new Promise(r => setTimeout(r, 1400));

    setFeedback('✓ Mensaje enviado. ¡Te responderé pronto!', 'success');
    contactForm.reset();
  } catch {
    setFeedback('✗ Algo salió mal. Por favor inténtalo de nuevo.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').textContent = 'Enviar mensaje';
  }
});

function setFeedback(msg, type) {
  if (!formFeedback) return;
  formFeedback.textContent = msg;
  formFeedback.className = `form-feedback${type ? ` ${type}` : ''}`;
}

/* ─── Smooth anchor click (for older Safari fallback) ─ */
qsa('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = qs(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
