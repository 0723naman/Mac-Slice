// Register ScrollTrigger plugin if gsap is loaded
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Hero Initial Load Animation
document.addEventListener("DOMContentLoaded", () => {
    
    // Theme Toggle Logic
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme (force light mode by default)
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if(sunIcon) sunIcon.style.display = 'block';
        if(moonIcon) moonIcon.style.display = 'none';
    }

    if (themeToggles.length > 0) {
        themeToggles.forEach(btn => {
            btn.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                if (newTheme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.querySelectorAll('.sun-icon').forEach(el => el.style.display = 'block');
                    document.querySelectorAll('.moon-icon').forEach(el => el.style.display = 'none');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                    document.querySelectorAll('.sun-icon').forEach(el => el.style.display = 'none');
                    document.querySelectorAll('.moon-icon').forEach(el => el.style.display = 'block');
                    localStorage.setItem('theme', 'light');
                }
            });
        });
    }

    if (typeof gsap === 'undefined') return;
    
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



// --- Email Capture Download Modal ---
document.addEventListener('DOMContentLoaded', () => {
    const downloadLinks = document.querySelectorAll('a[href*="MacSlice.dmg"]');
    if (downloadLinks.length === 0) return;

    // Create the modal HTML
    const modalHTML = `
        <div id="emailDownloadModal" class="email-modal-overlay">
            <div class="email-modal">
                <button class="email-modal-close" id="closeEmailModal">&times;</button>
                <div class="email-modal-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </div>
                <h2>Download Mac Slice</h2>
                <p>Enter your email to get the free version. We'll send you occasional tips on keeping your Mac fast.</p>
                <form id="emailDownloadForm">
                    <input type="email" id="downloadEmail" placeholder="your@email.com" required>
                    <button type="submit" class="panel-btn solid" style="width: 100%; margin-top: 16px;">Download Free</button>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('emailDownloadModal');
    const closeBtn = document.getElementById('closeEmailModal');
    const form = document.getElementById('emailDownloadForm');
    let currentDownloadUrl = '';

    downloadLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentDownloadUrl = link.href;
            modal.classList.add('active');
            setTimeout(() => document.getElementById('downloadEmail').focus(), 100);
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('downloadEmail').value;
        const btn = form.querySelector('button');
        
        if (email && email.includes('@')) {
            const originalText = btn.innerText;
            btn.innerText = "Starting...";
            btn.style.opacity = "0.8";

            // Save the email to Vercel KV
            try {
                await fetch('/api/capture', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
            } catch (err) {
                console.error("Failed to save email", err);
            }

            // Trigger the download
            window.location.href = currentDownloadUrl;
            
            setTimeout(() => {
                modal.classList.remove('active');
                btn.innerText = originalText;
                btn.style.opacity = "1";
                form.reset();
            }, 1000);
        }
    });
});
