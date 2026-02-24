/* =========================
   OPTIMIZED SCROLL HANDLER (Navbar + CTA)
========================= */
let lastScroll = 0;
const navbar = document.querySelector(".navbar");
const ctaSection = document.querySelector(".cta-email");

let ticking = false;

function handleScroll() {
    const currentScroll = window.pageYOffset;

    /* NAVBAR HIDE/SHOW */
    if (navbar) {
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = "translateY(-100%)";
            navbar.style.opacity = "0";
        } else {
            navbar.style.transform = "translateY(0)";
            navbar.style.opacity = "1";
        }
    }

    /* CTA EMAIL ANIMATION */
    if (ctaSection) {
        const triggerPoint = ctaSection.getBoundingClientRect().top - window.innerHeight + 100;
        if (triggerPoint < 0) {
            ctaSection.classList.add("show");
        }
    }

    lastScroll = currentScroll;
    ticking = false;
}

window.addEventListener("scroll", () => {
    if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
    }
});


/* =========================
   SMOOTH SCROLL FOR MENU
========================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e){
        const targetID = this.getAttribute("href");
        if(targetID.length > 1){
            e.preventDefault();
            const targetElement = document.querySelector(targetID);
            if(targetElement){
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        }
    });
});


/* =========================
   SECTION REVEAL ON SCROLL
========================= */
document.addEventListener('DOMContentLoaded', () => {

    const revealOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.section, .detail-hero, .reading-box').forEach(section => {
        section.classList.add('reveal-up');
        sectionObserver.observe(section);
    });

});
