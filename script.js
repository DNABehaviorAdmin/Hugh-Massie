document.addEventListener('DOMContentLoaded', () => {

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --- 1. Reveal Animations on Scroll --- */
    const revealSections = document.querySelectorAll('.reveal-section');

    if (!prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        });

        revealSections.forEach(section => revealObserver.observe(section));
    } else {
        revealSections.forEach(section => section.classList.add('active'));
    }

    /* --- 2. Magnetic Buttons --- */
    if (!prefersReducedMotion) {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');

        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Strength of pull
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    /* --- 3. Spotlight Cards --- */
    const spotlightCards = document.querySelectorAll('.spotlight-card');

    document.addEventListener('mousemove', (e) => {
        spotlightCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    /* --- 4. 3D Tilt for Portrait Card (REMOVED) --- */
    // User requested removal of childish hover effects. Keeping comment for context.

    /* --- 5. Scroll Parallax (Hero) --- */
    if (!prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const parallaxElements = document.querySelectorAll('[data-parallax-speed]');

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax-speed'));
                el.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });
    }

    /* --- 6. Navigation & Scroll Logic --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return;
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Blur background before scroll
                document.body.style.transition = 'backdrop-filter 0.3s';

                targetElement.scrollIntoView({ behavior: 'smooth' });

                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    /* --- 7. Sticky Nav Glass --- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('bg-slate-900/80', 'backdrop-blur-md', 'border-white/5', 'shadow-lg');
            navbar.classList.remove('border-white/0');
        } else {
            navbar.classList.remove('bg-slate-900/80', 'backdrop-blur-md', 'border-white/5', 'shadow-lg');
            navbar.classList.add('border-white/0');
        }
    });

    /* --- 8. Dynamic Accent & Active Link --- */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Theme colors for sections
    const themes = {
        teal: '#2dd4bf',
        purple: '#a78bfa',
        blue: '#60a5fa'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const theme = entry.target.getAttribute('data-section-theme') || 'teal';

                // Update Nav Active State
                navLinks.forEach(link => {
                    link.classList.remove('text-accent', 'text-white');
                    link.classList.add('text-slate-400');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('text-accent');
                        link.classList.remove('text-slate-400');
                    }
                });

                // Subtle Theme HUE shift (optional, modifying root var)
                // document.documentElement.style.setProperty('--accent-glow', themes[theme]);
            }
        });
    }, { rootMargin: '-30% 0px -50% 0px' });

    sections.forEach(section => sectionObserver.observe(section));


    /* --- 9. Particles Canvas (Layer 2) --- */
    const canvas = document.getElementById('background-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouse = { x: null, y: null };

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.2;
                this.vy = (Math.random() - 0.5) * 0.2;
                this.size = Math.random() * 1.5 + 0.5;
                this.alpha = Math.random() * 0.3 + 0.1;
                this.baseAlpha = this.alpha;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;

                // Mouse Repulsion
                if (mouse.x != null && !prefersReducedMotion) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 250) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (250 - distance) / 250;
                        const push = 1.5;
                        this.x -= forceDirectionX * force * push;
                        this.y -= forceDirectionY * force * push;
                        // Brighten near mouse
                        this.alpha = this.baseAlpha + force * 0.5;
                    } else {
                        this.alpha = this.baseAlpha;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 40; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    /* --- 10. Download Toast Notification --- */
    /* --- 10. Toast Notification System --- */
    const toast = document.getElementById('toast-notification');
    const closeToastBtn = document.getElementById('close-toast');
    const toastTitle = toast.querySelector('h4');
    const toastMessage = toast.querySelector('p');
    const toastIconContainer = toast.querySelector('.text-accent');
    let toastTimeout;

    // Icons
    const icons = {
        download: `<svg class="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>`,
        mail: `<svg class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`
    };

    function showToast(title, message, iconType = 'download') {
        if (!toast) return;

        // Update Content
        if (toastTitle) toastTitle.textContent = title;
        if (toastMessage) toastMessage.textContent = message;
        if (toastIconContainer && icons[iconType]) toastIconContainer.innerHTML = icons[iconType];

        // Reset timeout if already showing
        clearTimeout(toastTimeout);

        // Show
        toast.classList.remove('translate-y-32', 'opacity-0', 'pointer-events-none');

        // Auto hide after 4s
        toastTimeout = setTimeout(() => {
            hideToast();
        }, 4000);
    }

    function hideToast() {
        if (!toast) return;
        toast.classList.add('translate-y-32', 'opacity-0', 'pointer-events-none');
    }

    // 1. Download Links
    const downloadLinks = document.querySelectorAll('a[download]');
    downloadLinks.forEach(link => {
        link.addEventListener('click', () => {
            showToast('Download Started', 'Your PDF is on its way.', 'download');
        });
    });

    // 2. Mailto Links (Contact)
    const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
    mailtoLinks.forEach(link => {
        link.addEventListener('click', () => {
            showToast('Opening Email', 'Launching your default email client...', 'mail');
        });
    });

    if (closeToastBtn) {
        closeToastBtn.addEventListener('click', hideToast);
    }

    /* --- 11. Custom Cursor Logic --- */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Only active on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with slight delay/smoothness via CSS transition or direct animate
            // Using animate for smoother trail
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover Effect
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .spotlight-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    /* --- 12. Reading Progress Bar --- */
    const progressBar = document.getElementById('reading-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        });
    }

    /* --- 13. YouTube Popular Videos Feed (Worker API) --- */
    initYouTubeFeed();

    async function initYouTubeFeed() {
        const container = document.getElementById('pv-scroll-container');
        const section = document.getElementById('popular-videos');
        const playerContainer = document.getElementById('pv-player-container');
        const prevBtn = document.getElementById('pv-prev');
        const nextBtn = document.getElementById('pv-next');

        if (!container || !section) return;

        try {
            // 1. Try Relative Path (Standard for production site)
            let apiUrl = '/api/youtube/popular?limit=12';
            
            // Handle local dev (Live Server)
            console.log('Current Hostname:', window.location.hostname);
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                 console.log('Localhost detected: Using direct Worker URL');
                 apiUrl = 'https://hughmassie.ryan-scott.workers.dev/api/youtube/popular?limit=12'; 
            } else {
                 console.log('Production detected: Using relative API path');
            }

            let response;
            
            try {
                response = await fetch(apiUrl);
            } catch (e) {
                console.warn('Relative path fetch failed, trying direct worker...');
            }

            // 2. Fallback: Direct Worker URL (If relative failed or returned 404)
            if (!response || !response.ok) {
                 // Use the direct worker URL you confirmed:
                 apiUrl = 'https://hughmassie.ryan-scott.workers.dev/api/youtube/popular?limit=12';
                 response = await fetch(apiUrl);
            }

            if (!response.ok) throw new Error('Failed to load videos from both sources');
            
            const data = await response.json();
            const videos = data.items || [];

            if (videos.length === 0) {
                console.warn('YouTube API returned 0 videos');
                section.classList.add('hidden');
                return;
            }

            // Clear Skeletons
            container.innerHTML = '';
            section.classList.remove('hidden');

            // Render Cards
            videos.forEach((video, index) => {
                const card = document.createElement('div');
                card.className = 'min-w-[280px] w-[280px] bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-colors cursor-pointer group snap-start';
                card.onclick = () => loadVideo(video);

                card.innerHTML = `
                    <div class="relative aspect-video overflow-hidden">
                        <img src="${video.thumbnailUrl}" alt="${video.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        <div class="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                        <div class="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            ${video.duration || 'TOP'}
                        </div>
                        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <div class="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                                <svg class="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                             </div>
                        </div>
                    </div>
                    <div class="p-4 space-y-2">
                        <h4 class="text-sm font-semibold text-slate-100 line-clamp-2 leading-snug">${video.title}</h4>
                        <div class="flex items-center justify-between text-[11px] text-slate-400">
                            <span>${new Date(video.publishedAt).toLocaleDateString()}</span>
                            <span>${formatViews(video.viewCount)} views</span>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });

            // Scroll Controls
            if (prevBtn && nextBtn) {
                prevBtn.addEventListener('click', () => {
                    container.scrollBy({ left: -300, behavior: 'smooth' });
                });
                nextBtn.addEventListener('click', () => {
                    container.scrollBy({ left: 300, behavior: 'smooth' });
                });
            }

        } catch (err) {
            console.error('YouTube API Error:', err);
            // Hide section on error so broken UI doesn't show
            section.classList.add('hidden');
        }

        function loadVideo(video) {
            if (!playerContainer) return;
            playerContainer.classList.remove('hidden');
            
            // Scroll to player if on mobile
            if(window.innerWidth < 768) {
                playerContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            playerContainer.innerHTML = `
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0" 
                    title="${video.title}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
        }

        function formatViews(num) {
            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
            if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
            return num.toString();
        }
    }
});
