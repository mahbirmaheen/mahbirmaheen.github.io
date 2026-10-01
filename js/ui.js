const navbar = document.querySelector('.navbar');
let lastScrollY = 0;
let ticking = false;

function handleNavbarScroll() {
  const currentScrollY = window.scrollY;
  if (navbar) {
    const scrolledDown    = currentScrollY > lastScrollY;
    const pastThreshold   = currentScrollY > 80;   
    const atTop           = currentScrollY < 10;   
    if (atTop) {
      navbar.style.transform = 'translate3d(0, 0, 0)';
      navbar.style.opacity   = '1';
    } else if (scrolledDown && pastThreshold) {
      navbar.style.transform = 'translate3d(0, -100%, 0)';
      navbar.style.opacity   = '0';
    } else {
      navbar.style.transform = 'translate3d(0, 0, 0)';
      navbar.style.opacity   = '1';
    }
  }
  lastScrollY = currentScrollY;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(handleNavbarScroll);
    ticking = true; 
  }
}, { passive: true }); 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetID = this.getAttribute('href');
    if (targetID.length <= 1) return;
    const targetElement = document.querySelector(targetID);
    if (!targetElement) return;
    e.preventDefault();
    const navbarHeight   = navbar ? navbar.offsetHeight : 90;
    const extraPadding   = 20; 
    const elementTop     = targetElement.getBoundingClientRect().top;
    const scrollTarget   = window.scrollY + elementTop - navbarHeight - extraPadding;
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  });
});

(function initActiveNavHighlight() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!navLinks.length) return;
  const sections = [];
  navLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) sections.push(section);
  });
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => link.classList.remove('active-link'));
        const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active-link');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));
})();