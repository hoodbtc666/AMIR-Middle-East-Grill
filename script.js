(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const status = document.querySelector('#open-status');

  const setHeaderState = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 18);
  };

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
      });
    });
  }

  const getOntarioTime = () => {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Toronto',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    });

    return formatter.formatToParts(new Date()).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
  };

  const updateOpenStatus = () => {
    if (!status) return;
    try {
      const parts = getOntarioTime();
      const minutes = Number(parts.hour) * 60 + Number(parts.minute);
      const sunday = parts.weekday === 'Sun';
      const opens = sunday ? 14 * 60 : 11 * 60;
      const open = minutes >= opens && minutes <= 23 * 60 + 59;

      status.textContent = open ? 'Open now · until midnight' : `Closed now · opens ${sunday ? '2:00 PM' : '11:00 AM'}`;
      status.classList.toggle('is-open', open);
      status.classList.toggle('is-closed', !open);
    } catch {
      status.textContent = 'See today’s hours above';
    }
  };

  updateOpenStatus();
  window.setInterval(updateOpenStatus, 60000);

  document.querySelectorAll('details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      document.querySelectorAll('details[open]').forEach((other) => {
        if (other !== detail) other.removeAttribute('open');
      });
    });
  });

  // Automatically include the newest restaurant photos that were added to this repo.
  // They stay in the gallery with neutral labels so we do not misidentify a dish.
  const gallery = document.querySelector('.photo-grid');
  if (gallery) {
    const newPhotos = [
      '796640610_1114469678052660_2976353442159035332_n.webp',
      '796940836_28395411196754865_6927143069474894834_n.webp',
      '796968293_1738631804124384_2602888669479728879_n.webp',
      '798393363_2143559859528134_8106833509244442647_n.webp'
    ];

    newPhotos.forEach((src, index) => {
      if (gallery.querySelector(`img[src="${src}"]`)) return;

      const figure = document.createElement('figure');
      figure.className = index % 3 === 2 ? 'photo photo-wide reveal' : 'photo reveal';

      const image = document.createElement('img');
      image.src = src;
      image.alt = 'AMIR Middle East Grill restaurant photo';
      image.loading = 'lazy';
      image.decoding = 'async';

      figure.appendChild(image);
      gallery.appendChild(figure);
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }
})();
