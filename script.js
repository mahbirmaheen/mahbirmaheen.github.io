/* =========================
   NAVBAR HIDE ON SCROLL (Optimized)
========================= */
let lastScroll = 0;
const navbar = document.querySelector(".navbar");
let ticking = false;

function handleScroll() {
    const currentScroll = window.pageYOffset;

    if (navbar) {
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = "translateY(-100%)";
            navbar.style.opacity = "0";
        } else {
            navbar.style.transform = "translateY(0)";
            navbar.style.opacity = "1";
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
   SECTION REVEAL + CTA REVEAL
========================= */
document.addEventListener('DOMContentLoaded', () => {

    /* ---- Section Reveal ---- */
    const revealOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
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


    /* ---- EMAIL CTA REVEAL ---- */
    const ctaSection = document.querySelector(".cta-email");

    if (ctaSection) {
        const ctaObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target); // animate only once
                }
            });
        }, {
            threshold: 0.2   // triggers when 20% visible
        });

        ctaObserver.observe(ctaSection);
    }

});
