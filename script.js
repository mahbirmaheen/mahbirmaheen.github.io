/* =========================
   NAVBAR HIDE ON SCROLL (Optimized FIXED)
========================= */

let lastScroll = 0;
const navbar = document.querySelector(".navbar");
let ticking = false;

function handleScroll() {
    const currentScroll = document.documentElement.scrollTop;

    if (navbar) {
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.classList.add("nav-hidden");
        } else {
            navbar.classList.remove("nav-hidden");
        }
    }

    lastScroll = currentScroll;
    ticking = false;
}

function onScroll() {
    if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
    }
}

/* PASSIVE LISTENER — prevents scroll blocking */
window.addEventListener("scroll", onScroll, { passive: true });


/* =========================
   SECTION REVEAL + CTA REVEAL
========================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ---- Section Reveal ---- */
    const revealOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }

        });
    }, revealOptions);

    document.querySelectorAll('.section, .detail-hero, .reading-box').forEach(section => {
        section.classList.add('reveal-up');
        sectionObserver.observe(section);
    });


    /* ---- EMAIL CTA REVEAL (PLAYS EVERY TIME) ---- */
    const ctaSection = document.querySelector(".cta-email");

    if (ctaSection) {

        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    /* reset animation */
                    entry.target.classList.remove("show");
                    void entry.target.offsetWidth; // force reflow

                    /* replay animation */
                    entry.target.classList.add("show");

                } else {
                    /* remove when leaving viewport */
                    entry.target.classList.remove("show");
                }

            });
        }, {
            threshold: 0.25
        });

        ctaObserver.observe(ctaSection);
    }

});
