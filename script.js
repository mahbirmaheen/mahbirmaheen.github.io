/* =========================
   NAVBAR HIDE ON SCROLL
========================= */
let lastScroll = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if(navbar) {
        if(currentScroll > lastScroll && currentScroll > 100){
            navbar.style.transform = "translateY(-100%)";
            navbar.style.opacity = "0";
        } else {
            navbar.style.transform = "translateY(0)";
            navbar.style.opacity = "1";
        }
    }
    lastScroll = currentScroll;
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
   SECTION REVEAL ON SCROLL (Fades everything up smoothly)
========================= */
document.addEventListener('DOMContentLoaded', () => {
    const revealOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
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

/* =========================
   EMAIL CTA ANIMATION (Restored perfectly)
========================= */
const ctaSection = document.querySelector(".cta-email");
if(ctaSection){
    window.addEventListener("scroll", () => {
        const triggerPoint = ctaSection.offsetTop - window.innerHeight + 100;
        if(window.scrollY > triggerPoint){
            ctaSection.classList.add("show");
        }
    });
}
