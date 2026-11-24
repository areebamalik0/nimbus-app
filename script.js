(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  // Aurora glow follows the pointer with a soft delay
  addEventListener('pointermove', e => {
    root.style.setProperty('--ax', e.clientX / innerWidth * 100);
    root.style.setProperty('--ay', e.clientY / innerHeight * 100);
  });

  // Spotlight highlight inside every glass card
  document.querySelectorAll('.glass').forEach(g => {
    g.addEventListener('pointermove', e => {
      const b = g.getBoundingClientRect();
      g.style.setProperty('--mx', (e.clientX - b.left) + 'px');
      g.style.setProperty('--my', (e.clientY - b.top) + 'px');
    });
    g.addEventListener('pointerleave', () => { g.style.removeProperty('--mx'); g.style.removeProperty('--my'); });
  });

  // 3D tilt on the phone
  const stage = document.getElementById('stage'), phone = document.getElementById('phone');
  if (!reduce) {
    stage.addEventListener('pointermove', e => {
      const b = stage.getBoundingClientRect();
      phone.style.setProperty('--rx', ((e.clientX - b.left) / b.width - 0.5) * 24);
      phone.style.setProperty('--ry', ((e.clientY - b.top) / b.height - 0.5) * -14);
    });
    stage.addEventListener('pointerleave', () => { phone.style.setProperty('--rx', -12); phone.style.setProperty('--ry', 6); });
  }

  // Rotating headline word
  const swap = document.getElementById('swap'), words = ['save', 'spend', 'invest', 'relax']; let w = 0;
  if (!reduce) setInterval(() => {
    swap.classList.add('out');
    setTimeout(() => { w = (w + 1) % words.length; swap.textContent = words[w]; swap.classList.remove('out'); }, 350);
  }, 2400);

  // Scroll reveal and count-up numbers
  const countUp = el => {
    const end = +el.dataset.count; let n = 0; const inc = Math.max(1, Math.ceil(end / 50));
    const step = () => { n = Math.min(end, n + inc); el.textContent = n.toLocaleString(); if (n < end) requestAnimationFrame(step); };
    step();
  };
  const io = new IntersectionObserver(list => list.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    en.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(en.target);
  }), { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Pricing toggle
  document.querySelectorAll('#period button').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('#period button').forEach(b => b.classList.toggle('on', b === btn));
    const key = btn.dataset.p;
    document.querySelectorAll('.amt').forEach(a => a.textContent = a.dataset[key]);
  }));

  // Mobile menu
  const burger = document.querySelector('.burger'), links = document.querySelector('.links');
  const setMenu = o => { burger.setAttribute('aria-expanded', o); links.classList.toggle('open', o); };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Waitlist form (front-end only, nothing is sent)
  const mail = document.getElementById('mail'), note = document.getElementById('mnote');
  mail.addEventListener('submit', e => {
    e.preventDefault();
    const v = mail.querySelector('input').value.trim(), ok = /^\S+@\S+\.\S+$/.test(v);
    mail.classList.toggle('invalid', !ok);
    note.textContent = ok ? 'You are on the list! (Demo form, nothing was sent)' : 'Please enter a valid email address.';
    if (ok) mail.reset();
  });

  // If photo.jpg is missing, the credit badge falls back to initials
  const pic = document.querySelector('.avatar img');
  if (pic) pic.addEventListener('error', () => pic.remove());
})();
