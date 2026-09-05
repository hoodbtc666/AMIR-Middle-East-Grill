(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const status = document.querySelector('#open-status');

  const setHeaderState = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
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

  const getTorontoParts = () => {
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
      const parts = getTorontoParts();
      const minutes = Number(parts.hour) * 60 + Number(parts.minute);
      const isSunday = parts.weekday === 'Sun';
      const opensAt = isSunday ? 14 * 60 : 11 * 60;
      const isOpen = minutes >= opensAt && minutes <= 23 * 60 + 59;

      status.textContent = isOpen ? 'Open now · until midnight' : `Closed now · opens ${isSunday ? '2:00 PM' : '11:00 AM'}`;
      status.classList.toggle('is-open', isOpen);
      status.classList.toggle('is-closed', !isOpen);
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
})();
