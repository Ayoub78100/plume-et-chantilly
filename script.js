(function () {
  // Menu mobile
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  // Header ombre au scroll
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Apparition au défilement
  const targets = document.querySelectorAll('.reveal, .stagger');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(t => io.observe(t));
  } else targets.forEach(t => t.classList.add('in'));

  // Léger parallaxe sur l'image d'accueil
  const heroImg = document.querySelector('.hero-img');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroImg && !reduce) {
    heroImg.addEventListener('animationend', () => {
      heroImg.style.animation = 'none';
      heroImg.style.transform = 'scale(1.05)';
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight) heroImg.style.transform = `translateY(${y * 0.25}px) scale(1.05)`;
      }, { passive: true });
    }, { once: true });
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  // Formulaire
  const form = document.getElementById('order-form');
  const date = document.getElementById('date');
  const creation = document.getElementById('creation');
  const hint = document.getElementById('date-hint');
  const addressField = document.getElementById('address-field');
  const addressInput = addressField.querySelector('input');
  const status = form.querySelector('.form-status');

  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const inDays = n => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return d; };
  date.min = iso(inDays(2));

  function checkDelay() {
    hint.hidden = true;
    if (!date.value) return true;
    const chosen = new Date(date.value + 'T00:00:00');
    const isNumber = creation.value.startsWith('Number');
    if (chosen < inDays(2)) {
      hint.textContent = 'Merci de commander au moins 48 h à l\'avance.';
      hint.hidden = false; return false;
    }
    if (isNumber && chosen < inDays(7)) {
      hint.textContent = 'Les number cakes se commandent idéalement 7 jours avant. Envoyez quand même votre demande : Christelle vous dira si c\'est possible.';
      hint.hidden = false;
    }
    return true;
  }
  date.addEventListener('change', checkDelay);
  creation.addEventListener('change', checkDelay);

  form.querySelectorAll('input[name="Remise"]').forEach(r => r.addEventListener('change', () => {
    const delivery = form.querySelector('input[name="Remise"]:checked').value === 'Livraison';
    addressField.hidden = !delivery;
    addressInput.required = delivery;
  }));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.className = 'form-status';
    let valid = true;
    form.querySelectorAll('[required]').forEach(el => {
      const ok = el.type === 'checkbox' ? el.checked : el.checkValidity();
      el.classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    });
    if (!checkDelay()) valid = false;
    if (!valid) {
      status.textContent = 'Merci de compléter les champs obligatoires (*).';
      status.classList.add('err');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Envoi en cours…';
    try {
      const data = Object.fromEntries(new FormData(form));
      if (data.Date) data.Date = new Date(data.Date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const res = await fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error();
      form.reset();
      addressField.hidden = true; addressInput.required = false; hint.hidden = true;
      status.textContent = 'Merci ! Votre demande est envoyée. Christelle vous recontacte sous 24 h.';
      status.classList.add('ok');
    } catch {
      status.innerHTML = 'Oups, l\'envoi n\'a pas fonctionné. Écrivez directement sur <a href="https://wa.me/33669960948" target="_blank" rel="noopener">WhatsApp</a>.';
      status.classList.add('err');
    } finally {
      btn.disabled = false; btn.textContent = 'Envoyer ma demande';
    }
  });

  form.addEventListener('input', e => e.target.classList.remove('invalid'));
})();
