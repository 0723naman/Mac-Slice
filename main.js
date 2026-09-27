// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Hero Initial Load Animation
document.addEventListener("DOMContentLoaded", () => {
    
    // Timeline for the hero section
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Fade in text from below
    tl.to(".hero-content", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.2
    })
    
    // Fade in main hero image (UI screenshot) slightly after the text
    .to(".hero-image-container", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5
    }, "-=0.8");

    // Rotating Text Animation
    const rotatingTexts = gsap.utils.toArray(".rotating-text");
    if (rotatingTexts.length > 0) {
        const textTl = gsap.timeline({ repeat: -1 });
        
        rotatingTexts.forEach((text, i) => {
            textTl
                .fromTo(text, 
                    { y: "100%", opacity: 0 }, 
                    { y: "0%", opacity: 1, duration: 0.8, ease: "back.out(1.2)" }
                )
                .to(text, {
                    y: "-100%", opacity: 0, duration: 0.6, ease: "power2.in", delay: 2.5
                });
        });
    }

    // Statement section fade up
    gsap.from(".statement-content", {
        scrollTrigger: {
            trigger: ".statement-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power2.out"
    });

    // Scroll Animations for Feature Sections
    const features = gsap.utils.toArray(".feature-section");

    features.forEach(feature => {
        const text = feature.querySelector(".feature-text");
        const image = feature.querySelector(".feature-image-wrapper");

        // Animate text fading up as you scroll to it
        gsap.fromTo(text, 
            { opacity: 0, y: 50 },
            {
                scrollTrigger: {
                    trigger: feature,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out"
            }
        );
        
        // Parallax effect on the image container
        gsap.fromTo(image,
            { opacity: 0, y: 70 },
            {
                scrollTrigger: {
                    trigger: feature,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power2.out"
            }
        );
        
        // Subtle internal parallax for the image inside the wrapper during scroll
        gsap.to(image.querySelector("img"), {
            scrollTrigger: {
                trigger: feature,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            y: -30,
            ease: "none"
        });
    });

    // Bento Grid Animation
    gsap.from(".bento-card", {
        scrollTrigger: {
            trigger: ".bento-grid",
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
    });

    // Premium Pricing Fade up
    gsap.from(".pricing-premium-section", {
        scrollTrigger: {
            trigger: ".pricing-premium-section",
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out"
    });

    // FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            
            // Toggle active class on button
            question.classList.toggle('active');
            
            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = 0;
            }
            
            // Optional: Close others
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
                    otherQuestion.classList.remove('active');
                    otherQuestion.nextElementSibling.style.maxHeight = 0;
                }
            });
        });
    });

    // Auto-switching image gallery
    const galleries = document.querySelectorAll('.image-gallery');
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('img');
        if (images.length > 1) {
            let currentIndex = 0;
            setInterval(() => {
                images[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].classList.add('active');
            }, 3000);
        }
    });
});

// Modal Logic
function openProModal() {
    document.getElementById('proModal').classList.add('active');
}

function closeProModal() {
    document.getElementById('proModal').classList.remove('active');
}

// Close modal when clicking outside
document.getElementById('proModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeProModal();
    }
});
