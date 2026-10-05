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
const proModalEl = document.getElementById('proModal');
if (proModalEl) {
    proModalEl.addEventListener('click', function(e) {
        if (e.target === this) {
            closeProModal();
        }
    });
}



// --- Email Capture Download Modal ---
let emailModalInitialized = false;
let currentDownloadUrl = '';

function injectEmailModal() {
    if (document.getElementById('emailDownloadModal')) return;

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
                    <select id="downloadCountry" class="email-modal-select" required>
<option value="" disabled selected>Select your country</option>
                        <option value="Afghanistan">Afghanistan</option>
                        <option value="Albania">Albania</option>
                        <option value="Algeria">Algeria</option>
                        <option value="Andorra">Andorra</option>
                        <option value="Angola">Angola</option>
                        <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Armenia">Armenia</option>
                        <option value="Australia">Australia</option>
                        <option value="Austria">Austria</option>
                        <option value="Azerbaijan">Azerbaijan</option>
                        <option value="Bahamas">Bahamas</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Barbados">Barbados</option>
                        <option value="Belarus">Belarus</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Belize">Belize</option>
                        <option value="Benin">Benin</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                        <option value="Botswana">Botswana</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Brunei">Brunei</option>
                        <option value="Bulgaria">Bulgaria</option>
                        <option value="Burkina Faso">Burkina Faso</option>
                        <option value="Burundi">Burundi</option>
                        <option value="Cabo Verde">Cabo Verde</option>
                        <option value="Cambodia">Cambodia</option>
                        <option value="Cameroon">Cameroon</option>
                        <option value="Canada">Canada</option>
                        <option value="Central African Republic">Central African Republic</option>
                        <option value="Chad">Chad</option>
                        <option value="Chile">Chile</option>
                        <option value="China">China</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Comoros">Comoros</option>
                        <option value="Congo (Congo-Brazzaville)">Congo (Congo-Brazzaville)</option>
                        <option value="Costa Rica">Costa Rica</option>
                        <option value="Croatia">Croatia</option>
                        <option value="Cuba">Cuba</option>
                        <option value="Cyprus">Cyprus</option>
                        <option value="Czechia">Czechia</option>
                        <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
                        <option value="Denmark">Denmark</option>
                        <option value="Djibouti">Djibouti</option>
                        <option value="Dominica">Dominica</option>
                        <option value="Dominican Republic">Dominican Republic</option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Egypt">Egypt</option>
                        <option value="El Salvador">El Salvador</option>
                        <option value="Equatorial Guinea">Equatorial Guinea</option>
                        <option value="Eritrea">Eritrea</option>
                        <option value="Estonia">Estonia</option>
                        <option value="Eswatini">Eswatini</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Fiji">Fiji</option>
                        <option value="Finland">Finland</option>
                        <option value="France">France</option>
                        <option value="Gabon">Gabon</option>
                        <option value="Gambia">Gambia</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Germany">Germany</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Greece">Greece</option>
                        <option value="Grenada">Grenada</option>
                        <option value="Guatemala">Guatemala</option>
                        <option value="Guinea">Guinea</option>
                        <option value="Guinea-Bissau">Guinea-Bissau</option>
                        <option value="Guyana">Guyana</option>
                        <option value="Haiti">Haiti</option>
                        <option value="Holy See">Holy See</option>
                        <option value="Honduras">Honduras</option>
                        <option value="Hungary">Hungary</option>
                        <option value="Iceland">Iceland</option>
                        <option value="India">India</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Iran">Iran</option>
                        <option value="Iraq">Iraq</option>
                        <option value="Ireland">Ireland</option>
                        <option value="Israel">Israel</option>
                        <option value="Italy">Italy</option>
                        <option value="Jamaica">Jamaica</option>
                        <option value="Japan">Japan</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Kazakhstan">Kazakhstan</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Kiribati">Kiribati</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                        <option value="Laos">Laos</option>
                        <option value="Latvia">Latvia</option>
                        <option value="Lebanon">Lebanon</option>
                        <option value="Lesotho">Lesotho</option>
                        <option value="Liberia">Liberia</option>
                        <option value="Libya">Libya</option>
                        <option value="Liechtenstein">Liechtenstein</option>
                        <option value="Lithuania">Lithuania</option>
                        <option value="Luxembourg">Luxembourg</option>
                        <option value="Madagascar">Madagascar</option>
                        <option value="Malawi">Malawi</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Maldives">Maldives</option>
                        <option value="Mali">Mali</option>
                        <option value="Malta">Malta</option>
                        <option value="Marshall Islands">Marshall Islands</option>
                        <option value="Mauritania">Mauritania</option>
                        <option value="Mauritius">Mauritius</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Micronesia">Micronesia</option>
                        <option value="Moldova">Moldova</option>
                        <option value="Monaco">Monaco</option>
                        <option value="Mongolia">Mongolia</option>
                        <option value="Montenegro">Montenegro</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Mozambique">Mozambique</option>
                        <option value="Myanmar">Myanmar</option>
                        <option value="Namibia">Namibia</option>
                        <option value="Nauru">Nauru</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="Nicaragua">Nicaragua</option>
                        <option value="Niger">Niger</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="North Korea">North Korea</option>
                        <option value="North Macedonia">North Macedonia</option>
                        <option value="Norway">Norway</option>
                        <option value="Oman">Oman</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="Palau">Palau</option>
                        <option value="Palestine State">Palestine State</option>
                        <option value="Panama">Panama</option>
                        <option value="Papua New Guinea">Papua New Guinea</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Peru">Peru</option>
                        <option value="Philippines">Philippines</option>
                        <option value="Poland">Poland</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Romania">Romania</option>
                        <option value="Russia">Russia</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                        <option value="Saint Lucia">Saint Lucia</option>
                        <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                        <option value="Samoa">Samoa</option>
                        <option value="San Marino">San Marino</option>
                        <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Senegal">Senegal</option>
                        <option value="Serbia">Serbia</option>
                        <option value="Seychelles">Seychelles</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Slovakia">Slovakia</option>
                        <option value="Slovenia">Slovenia</option>
                        <option value="Solomon Islands">Solomon Islands</option>
                        <option value="Somalia">Somalia</option>
                        <option value="South Africa">South Africa</option>
                        <option value="South Korea">South Korea</option>
                        <option value="South Sudan">South Sudan</option>
                        <option value="Spain">Spain</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="Sudan">Sudan</option>
                        <option value="Suriname">Suriname</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Syria">Syria</option>
                        <option value="Tajikistan">Tajikistan</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Timor-Leste">Timor-Leste</option>
                        <option value="Togo">Togo</option>
                        <option value="Tonga">Tonga</option>
                        <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                        <option value="Tunisia">Tunisia</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Turkmenistan">Turkmenistan</option>
                        <option value="Tuvalu">Tuvalu</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Ukraine">Ukraine</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Uzbekistan">Uzbekistan</option>
                        <option value="Vanuatu">Vanuatu</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="Yemen">Yemen</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Zimbabwe">Zimbabwe</option>
                    </select>
                    <button type="submit" class="panel-btn solid" style="width: 100%; margin-top: 16px;">Download Free</button>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('emailDownloadModal');
    const closeBtn = document.getElementById('closeEmailModal');
    const form = document.getElementById('emailDownloadForm');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('downloadEmail').value;
        const country = document.getElementById('downloadCountry').value;
        const btn = form.querySelector('button');
        
        if (email && email.includes('@')) {
            const originalText = btn.innerText;
            btn.innerText = "Starting...";
            btn.style.opacity = "0.8";

            try {
                await fetch('/api/capture', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, country })
                });
            } catch (err) {
                console.error("Failed to save email", err);
            }

            window.location.href = currentDownloadUrl;
            
            setTimeout(() => {
                modal.classList.remove('active');
                btn.innerText = originalText;
                btn.style.opacity = "1";
                form.reset();
            }, 1000);
        }
    });
}

window.openEmailModal = function(url) {
    if (!emailModalInitialized) {
        injectEmailModal();
        emailModalInitialized = true;
    }
    
    currentDownloadUrl = url;
    const modal = document.getElementById('emailDownloadModal');
    if (modal) {
        modal.classList.add('active');
        setTimeout(() => {
            const emailInput = document.getElementById('downloadEmail');
            if(emailInput) emailInput.focus();
        }, 100);
    }
};

// Navbar Scroll & Mobile Menu
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector(".navbar");
    if(navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 30) {
                navbar.style.boxShadow = "0 20px 50px var(--shadow-color)";
                navbar.style.background = "var(--modal-bg)";
            } else {
                navbar.style.boxShadow = "0 18px 45px rgba(0,0,0,0.05)";
                navbar.style.background = "var(--nav-bg)";
            }
        });
    }

    const mobileToggle = document.getElementById("mobileToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener("click", () => {
            mobileMenu.classList.toggle("open");
        });
        
        document.querySelectorAll(".mobile-link, .mobile-download, .mobile-buy").forEach(link => {
            link.addEventListener("click", () => mobileMenu.classList.remove("open"));
        });
        
        document.addEventListener("click", (event) => {
            if (!mobileMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
                mobileMenu.classList.remove("open");
            }
        });
    }
});


// Navbar Indicator Logic
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    const indicator = document.querySelector('.nav-indicator');

    function moveIndicator(link) {
        if (!indicator || !link) return;
        
        indicator.style.opacity = '1';
        
        const linkRect = link.getBoundingClientRect();
        const containerRect = link.parentElement.getBoundingClientRect();

        // Calculate center of the link relative to the container
        const x = linkRect.left + (linkRect.width / 2) - containerRect.left - (7 / 2); // 7 is dot width

        indicator.style.transform = `translateX(${x}px)`;
    }

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Wait for navigation if it's an anchor on the same page, otherwise we just move it
            links.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
            moveIndicator(link);
        });
    });

    // Initialize position on load
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        // slight delay to ensure fonts/layout are rendered
        setTimeout(() => moveIndicator(activeLink), 100);
    }
});


// MacSlice Dynamic Indicator Logic
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.macslice-nav-link');
    const indicator = document.querySelector('.macslice-nav-indicator');

    function moveIndicator(link) {
        if (!indicator || !link) return;
        
        indicator.style.opacity = '1';
        
        const linkRect = link.getBoundingClientRect();
        const containerRect = link.parentElement.getBoundingClientRect();

        const x = linkRect.left + (linkRect.width / 2) - containerRect.left - (7 / 2); 

        indicator.style.transform = `translateX(${x}px)`;
    }

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            links.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
            moveIndicator(link);
        });
    });

    // Determine active link based on current URL
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPath === '') currentPath = 'index.html';
    
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.macslice-mobile-toggle');
    const navbar = document.querySelector('.macslice-navbar');
    if (mobileToggle && navbar) {
        mobileToggle.addEventListener('click', () => {
            navbar.classList.toggle('mobile-open');
        });
        
        // Close on link click
        links.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('mobile-open');
            });
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navbar.classList.contains('mobile-open')) {
                navbar.classList.remove('mobile-open');
            }
        });
    }

    let matchedLink = null;
    links.forEach(link => {
        link.classList.remove('active'); // Clear all
        const linkHref = link.getAttribute('href');
        if (linkHref) {
            // e.g. "index.html#how-it-works" or "pricing.html"
            const justPage = linkHref.split('#')[0] || 'index.html';
            if (justPage === currentPath) {
                matchedLink = link;
            }
        }
    });

    if (matchedLink) {
        matchedLink.classList.add('active');
        setTimeout(() => moveActivePill(matchedLink), 150);
        window.addEventListener('resize', () => moveActivePill(document.querySelector('.macslice-nav-link.active')));
    }
});


