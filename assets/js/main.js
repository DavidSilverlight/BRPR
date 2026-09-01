/* BoardroomPR — front-end behavior
   Swiper x5, AOS scroll reveals, nav (desktop dropdown + mobile off-canvas). */

(function () {
  'use strict';

  /* ---------- Scroll reveals ---------- */
  if (window.AOS) {
    AOS.init({ duration: 750, once: true, offset: 80, easing: 'ease-out' });
  }

  /* ---------- Carousels ---------- */
  if (window.Swiper) {
    var common = { spaceBetween: 24, grabCursor: true };

    // Services / industries: carousel on mobile only. The desktop markup is a
    // separate static grid, so these instances live behind .hide-on-desktop.
    ['.servicelist.slideme', '.industrylist.slideme'].forEach(function (sel) {
      if (!document.querySelector(sel)) return;
      new Swiper(sel, Object.assign({}, common, {
        slidesPerView: 1,
        pagination: { el: sel + ' .swiper-pagination', clickable: true },
        breakpoints: { 520: { slidesPerView: 2 } }
      }));
    });

    // Full-bleed: one slide per view at every width. Each slide holds its own
    // 3-up grid, which reflows to 1-up via CSS below the mobile break.
    if (document.querySelector('.buzzlist')) {
      new Swiper('.buzzlist', {
        slidesPerView: 1,
        spaceBetween: 0,
        grabCursor: true,
        autoHeight: true,
        navigation: {
          nextEl: '.buzzlist .swiper-button-next',
          prevEl: '.buzzlist .swiper-button-prev'
        },
        pagination: { el: '.buzzlist .swiper-pagination', clickable: true }
      });
    }

    if (document.querySelector('.testimonial')) {
      new Swiper('.testimonial', Object.assign({}, common, {
        slidesPerView: 1,
        loop: true,
        autoplay: { delay: 7000, disableOnInteraction: false },
        pagination: { el: '.testimonial .swiper-pagination', clickable: true }
      }));
    }

    if (document.querySelector('.locationlist')) {
      new Swiper('.locationlist', Object.assign({}, common, {
        slidesPerView: 2,
        pagination: { el: '.locationlist .swiper-pagination', clickable: true },
        breakpoints: { 740: { slidesPerView: 3 }, 1000: { slidesPerView: 4 } }
      }));
    }
  }

  /* ---------- Navigation ---------- */
  var body = document.body;
  var toggle = document.querySelector('.navtoggle');
  var scrim = document.querySelector('.navscrim');

  function closeNav() {
    body.classList.remove('nav-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  if (scrim) scrim.addEventListener('click', closeNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  // Sub-menus: hover handles desktop via CSS. Below the 980px break they
  // become tap-to-open accordions.
  var mq = window.matchMedia('(max-width: 980px)');
  document.querySelectorAll('.nav--main li > .sub-menu').forEach(function (sub) {
    var li = sub.parentElement;
    var link = li.querySelector(':scope > a');
    if (!link) return;

    link.addEventListener('click', function (e) {
      if (!mq.matches) return;          // desktop: follow the link
      e.preventDefault();
      var open = li.classList.contains('is-open');
      // close siblings
      li.parentElement.querySelectorAll(':scope > li.is-open')
        .forEach(function (o) { if (o !== li) o.classList.remove('is-open'); });
      li.classList.toggle('is-open', !open);
    });
  });

  // Reset nav state when crossing the breakpoint
  mq.addEventListener('change', function () {
    closeNav();
    document.querySelectorAll('.nav--main li.is-open')
      .forEach(function (li) { li.classList.remove('is-open'); });
  });

  /* ---------- Contact form ---------- */
  // The live site posts to WPForms. Endpoint is unresolved for the static
  // build, so validate here and surface a clear status instead of silently
  // failing. Wire ACTION to a real endpoint when one is chosen.
  var form = document.querySelector('.talk form');
  if (form) {
    var status = form.querySelector('.formstatus');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type=email]');
      if (!email || !email.value.trim() || !/.+@.+\..+/.test(email.value)) {
        if (status) {
          status.textContent = 'Please enter a valid email address.';
          status.className = 'formstatus err';
        }
        if (email) email.focus();
        return;
      }
      if (status) {
        status.textContent =
          'Form endpoint not configured yet — no message was sent.';
        status.className = 'formstatus err';
      }
    });
  }
})();
