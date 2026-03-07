document.addEventListener('DOMContentLoaded', () => {

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        entry.target.addEventListener('transitionend', (e) => {
          if(e.propertyName === 'transform' || e.propertyName === 'opacity') {
            entry.target.classList.add('done');
            entry.target.style.transform = ''; 
          }
        }, { once: true });
        observer.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '-20px 0px', threshold: 0.10 });

  document.querySelectorAll('.section, .detail-hero, .reading-box, .plotter-card, #plotContainer, #r-squared-container').forEach(el => {
    el.classList.add('reveal-up');
    revealObserver.observe(el);
  });

  const gridObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const grid  = entry.target;
        const cards = grid.querySelectorAll('.card');
        cards.forEach((card, index) => {
          const delay = 60 + (index * 100);
          setTimeout(() => { 
            card.classList.add('active'); 
            card.addEventListener('transitionend', () => { card.style.transform = ''; }, {once: true});
          }, delay);
        });
        observer.unobserve(grid);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.grid').forEach(grid => {
    grid.querySelectorAll('.card').forEach(card => { card.classList.add('reveal-up'); });
    gridObserver.observe(grid);
  });

  /* CTA animates */
  const ctaSection = document.querySelector('.cta-email');
  if (ctaSection) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show'); 
        } else {
          entry.target.classList.remove('show'); 
        }
      });
    }, { threshold: 0.0, rootMargin: '0px 0px -50px 0px' });
    ctaObserver.observe(ctaSection); 
  }

  const posterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        entry.target.addEventListener('transitionend', () => { entry.target.style.transform = ''; }, {once: true});
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.poster-preview-layout, .manuscript-box').forEach(el => {
    el.classList.add('reveal-up');
    posterObserver.observe(el);
  });

  const profileCard = document.querySelector('.profile-card');
  if (profileCard) {
    profileCard.style.opacity   = '0';
    profileCard.style.transform = 'translate3d(0, 20px, 0) scale(0.97)';
    profileCard.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1)';
    setTimeout(() => {
      profileCard.style.opacity   = '1';
      profileCard.style.transform = 'translate3d(0, 0, 0) scale(1)';
    }, 600);
  }
});