document.addEventListener('DOMContentLoaded', () => {

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Core State & Utilities */
    const state = {
        scrollY: window.scrollY,
        winHeight: window.innerHeight,
        docHeight: document.documentElement.scrollHeight,
        headerHeight: 0,
        ticking: false
    };

    function updateMetrics() {
        state.winHeight = window.innerHeight;
        state.docHeight = document.documentElement.scrollHeight;
        state.headerHeight = document.querySelector('header')?.offsetHeight || 0;
    }

    // Debounce Utility
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /* Reveal Animations on Scroll */
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
            rootMargin: '0px 0px -50px 0px', // Adjusted trigger point
            threshold: 0.1
        });
        revealSections.forEach(section => revealObserver.observe(section));
    } else {
        revealSections.forEach(section => section.classList.add('active'));
    }

    /* --- 2. Magnetic Buttons --- */
    /* Magnetic Buttons */
    if (!prefersReducedMotion) {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');

        magneticBtns.forEach(btn => {
            let boundRect = null;

            // Cache bounds on entry to avoid constant reflows
            btn.addEventListener('mouseenter', () => {
                boundRect = btn.getBoundingClientRect();
                btn.style.transition = 'transform 0.1s ease-out';
            });

            btn.addEventListener('mousemove', (e) => {
                if (!boundRect) return;
                const x = e.clientX - boundRect.left - boundRect.width / 2;
                const y = e.clientY - boundRect.top - boundRect.height / 2;

                // Using cached rect
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transition = 'transform 0.5s ease-out';
                btn.style.transform = 'translate(0, 0)';
                boundRect = null;
            });
        });
    }

    /* Spotlight Cards */
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    let spotlightTargets = [];

    function cacheSpotlightRects() {
        spotlightTargets = [];
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        spotlightCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            spotlightTargets.push({
                el: card,
                left: rect.left + scrollX,
                top: rect.top + scrollY,
                width: rect.width,
                height: rect.height
            });
        });
    }

    // Initial cache
    cacheSpotlightRects();

    // Mouse Move Handler for Spotlight
    let mouseTick = false;
    document.addEventListener('mousemove', (e) => {
        if (!mouseTick) {
            window.requestAnimationFrame(() => {
                const clientX = e.clientX;
                const clientY = e.clientY;
                const scrollX = window.scrollX;
                const scrollY = window.scrollY;

                spotlightTargets.forEach(item => {
                    // Optimization: Only update if mouse is relatively close (e.g., within 200px of card bounds)
                    // Or simple check: is it in viewport?
                    // For now, we'll keep the logic simple but efficient.

                    const itemX = item.left - scrollX;
                    const itemY = item.top - scrollY;

                    // Simple bounds check to avoid updating off-screen or far-away elements style if desired, 
                    // but these cards are CSS var driven so it's lightweight. 
                    // We will check if the card is roughly in viewport to save style calcs.
                    if (itemY + item.height < 0 || itemY > state.winHeight) return;

                    const x = clientX - itemX;
                    const y = clientY - itemY;

                    item.el.style.setProperty('--mouse-x', `${x}px`);
                    item.el.style.setProperty('--mouse-y', `${y}px`);
                });
                mouseTick = false;
            });
            mouseTick = true;
        }
    });

    /* Unified Scroll Handler (Parallax, Sticky, Progress) */
    const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('reading-progress');

    function onScroll() {
        state.scrollY = window.scrollY;

        // 1. Parallax
        if (!prefersReducedMotion) {
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax-speed'));
                // Use translate3d for hardware acceleration
                el.style.transform = `translate3d(0, ${state.scrollY * speed}px, 0)`;
            });
        }

        // 2. Sticky Nav Glass
        if (state.scrollY > 20) {
            navbar.classList.add('bg-slate-900/80', 'backdrop-blur-md', 'border-white/5', 'shadow-lg');
            navbar.classList.remove('border-white/0');
        } else {
            navbar.classList.remove('bg-slate-900/80', 'backdrop-blur-md', 'border-white/5', 'shadow-lg');
            navbar.classList.add('border-white/0');
        }

        // 3. Reading Progress Bar
        // Using cached docHeight to avoid reflow!
        if (progressBar) {
            const availableScroll = state.docHeight - state.winHeight;
            const scrollPercent = (availableScroll > 0) ? (state.scrollY / availableScroll) * 100 : 0;
            progressBar.style.width = `${scrollPercent}%`;
        }
    }

    // Scroll Listener with rAF throttling
    window.addEventListener('scroll', () => {
        if (!state.ticking) {
            window.requestAnimationFrame(() => {
                onScroll();
                state.ticking = false;
            });
            state.ticking = true;
        }
    }, { passive: true });

    /* Navigation & Scroll Logic */
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

    /* Dynamic Accent & Active Link */
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


    /* Particles Canvas */
    const canvas = document.getElementById('background-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouse = { x: null, y: null };

        // Debounced Resize for Canvas & Metrics
        const handleResize = debounce(() => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            // Update global metrics
            updateMetrics();

            // Update spotlight cache
            cacheSpotlightRects();
        }, 150);

        window.addEventListener('resize', handleResize);
        // Initial setup
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        updateMetrics();

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
                this.size = Math.random() * 2 + 1; // Size: 1px - 3px
                this.alpha = Math.random() * 0.3 + 0.2; // Opacity: 0.2 - 0.5
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
                        this.alpha = Math.min(this.baseAlpha + force * 0.5, 1);
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

        for (let i = 0; i < 75; i++) particles.push(new Particle());

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

    /* Toast Notification System */
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
        toast.classList.remove('translate-y-32', 'opacity-0', 'pointer-events-none', 'invisible');

        // Auto hide after 4s
        toastTimeout = setTimeout(() => {
            hideToast();
        }, 4000);
    }

    function hideToast() {
        if (!toast) return;
        toast.classList.add('translate-y-32', 'opacity-0', 'pointer-events-none', 'invisible');
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

    /* Custom Cursor Logic */
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




    /* Disable Dragging */
    window.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    /* Custom Link Preview (Site Status) */
    const siteStatus = document.getElementById('site-status');
    const statusText = document.getElementById('status-text');

    if (siteStatus && statusText && !prefersReducedMotion) {
        const links = document.querySelectorAll('a, button');

        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const href = link.getAttribute('href');
                const ariaLabel = link.getAttribute('aria-label');
                const text = link.innerText.trim();

                let previewText = '';

                if (href) {
                    if (href.startsWith('mailto:')) {
                        previewText = `Email: ${href.replace('mailto:', '')}`;
                    } else if (href.startsWith('tel:')) {
                        previewText = `Call: ${href.replace('tel:', '')}`;
                    } else if (href.startsWith('#')) {
                        previewText = `Go to: ${text || href.substring(1)}`;
                    } else if (href.startsWith('http')) {
                        // Clean URL for display
                        const url = new URL(href);
                        previewText = `Visit: ${url.hostname}${url.pathname !== '/' ? url.pathname : ''}`;
                    } else {
                        previewText = `Open: ${text || href}`;
                    }
                } else if (ariaLabel) {
                    previewText = ariaLabel;
                }

                if (previewText) {
                    statusText.textContent = previewText;
                    siteStatus.classList.remove('translate-y-24', 'opacity-0');
                }
            });

            link.addEventListener('mouseleave', () => {
                siteStatus.classList.add('translate-y-24', 'opacity-0');
            });
        });
    }

    /* Popular Videos Logic */
    const popularVideosContainer = document.getElementById('popular-videos');
    if (popularVideosContainer) {
        initPopularVideos();
    }

    async function initPopularVideos() {
        try {
            // Using a relative path which the Worker should handle if configured on same domain
            // For local development, if worker is on different port, this might fail unless proxied.
            // Assuming the Worker is deployed to /api/youtube/popular or user runs a local proxy.
            // If running strictly local file system, this fetch will fail (CORS/Protocol).
            // But requirement was "same-origin API endpoint".
            
            // In a real local dev with `wrangler dev`, the url might be http://localhost:8787/api/youtube/popular
            // We'll try a relative path first.
            const res = await fetch('/api/youtube/popular?limit=12');
            
            if (!res.ok) throw new Error('Failed to fetch popular videos');
            const data = await res.json();

            if (!data.items || data.items.length === 0) throw new Error('No videos found');

            const scrollContainer = document.getElementById('pv-scroll-container');
            const playerContainer = document.getElementById('pv-player-container');
            
            popularVideosContainer.classList.remove('hidden');
            scrollContainer.innerHTML = ''; // Clear skeleton

            data.items.forEach((video) => {
                // Create Card
                const card = document.createElement('div');
                card.className = 'min-w-[260px] w-[260px] group cursor-pointer relative snap-start';
                
                // Format helper
                const viewCount = formatViews(video.viewCount);
                const published = formatDate(video.publishedAt);

                card.innerHTML = `
                    <div class="relative aspect-video rounded-xl overflow-hidden bg-slate-800 border border-white/10 group-hover:border-accent/50 transition-colors mb-3">
                        <img src="${video.thumbnailUrl}" alt="${video.title}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy">
                        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            <svg class="w-12 h-12 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                        ${video.duration ? `<span class="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">${video.duration}</span>` : ''}
                    </div>
                    <h4 class="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-accent transition-colors mb-1" title="${video.title}">${video.title}</h4>
                    <div class="flex items-center gap-2 text-xs text-slate-400">
                        <span>${viewCount} views</span>
                        <span>•</span>
                        <span>${published}</span>
                    </div>
                `;
                
                card.addEventListener('click', () => {
                    playVideo(video.videoId);
                    // Highlight selected
                    document.querySelectorAll('#pv-scroll-container > div .ring-2').forEach(el => el.classList.remove('ring-2', 'ring-accent'));
                    card.querySelector('div').classList.add('ring-2', 'ring-accent');
                });

                scrollContainer.appendChild(card);
            });
            
            // Arrow listeners
            const prevBtn = document.getElementById('pv-prev');
            const nextBtn = document.getElementById('pv-next');

            prevBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: -280, behavior: 'smooth' });
            });
            nextBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: 280, behavior: 'smooth' });
            });

        } catch (e) {
            console.warn('Popular videos error:', e);
            // Keep it hidden or show specific error state if desired
            // popularVideosContainer.classList.add('hidden');
        }
    }

    function playVideo(videoId) {
        const container = document.getElementById('pv-player-container');
        container.classList.remove('hidden');
        // Using youtube-nocookie
        container.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen class="w-full h-full"></iframe>`;
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function formatViews(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays < 30) return `${diffDays} days ago`;
        if (diffDays < 365) return `${Math.floor(diffDays/30)} months ago`;
        return `${Math.floor(diffDays/365)} years ago`;
    }
});
