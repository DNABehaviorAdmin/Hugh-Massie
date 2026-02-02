import { useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import BackgroundEffects from './components/BackgroundEffects';
import Toast from './components/Toast';
import MagneticButton from './components/MagneticButton';
import RevealSection from './components/RevealSection';
import SpotlightCard from './components/SpotlightCard';
import PodcastVideoGallery from './components/PodcastVideoGallery.jsx';
import TestimonialsCarousel from './components/TestimonialsCarousel';

function App() {
  const toastRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    // Parallax logic
    const handleScroll = () => {
        const scrollY = window.scrollY;
        const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax-speed'));
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });

        // Progress Bar
        if (progressBarRef.current) {
             const docHeight = document.documentElement.scrollHeight - window.innerHeight;
             const scrollPercent = (scrollY / docHeight) * 100;
             progressBarRef.current.style.width = `${scrollPercent}%`;
        }
    };
    
    // Only if not reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', handleScroll);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDownload = (e, title, message) => {
      // Allow default download behavior but show toast
      // e.preventDefault(); // removed to allow download
      toastRef.current.show(title, message, 'download');
  };

  const handleContact = (e) => {
      toastRef.current.show('Opening Email', 'Launching your default email client...', 'mail');
  };

  return (
    <div className="bg-transparent text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-accent selection:text-slate-900 min-h-screen">
      <div ref={progressBarRef} id="reading-progress" className="fixed top-0 left-0 h-1 bg-accent z-100 w-0 transition-all duration-100 ease-out shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
      
      <BackgroundEffects />
      <Navbar />

      <Toast ref={toastRef} />

      <main>
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center relative py-24 md:py-32" data-section-theme="teal">
            <div className="ambient-shadow"></div>
            <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                {/* Text Content */}
                <RevealSection className="space-y-10 order-2 lg:order-1 text-center lg:text-left pt-8 lg:pt-0" data-parallax-speed="0.05">
                    <div className="space-y-4">
                        <span className="inline-block text-accent font-semibold tracking-widest uppercase text-xs md:text-sm bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20">Behavior • Strategy • Leadership</span>
                        <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold text-white tracking-tighter leading-[1.05]">
                            Hugh Massie
                        </h1>
                    </div>
                    <p className="text-lg md:text-2xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                        Helping growth-minded leaders unleash exponential growth with powerful behavior and money insights.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-6">
                        <MagneticButton 
                            as="a" 
                            href="mailto:dnacare@dnabehavior.com" 
                            onClick={handleContact}
                            className="px-12 py-5 bg-accent text-slate-900 rounded-full font-bold tracking-wide shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_40px_rgba(45,212,191,0.5)] transform hover:-translate-y-1.5 transition-all duration-500 relative overflow-hidden group">
                            <span className="relative z-10">Contact Hugh</span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                            <div className="absolute -inset-x-full inset-y-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-35deg] group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
                        </MagneticButton>
                        <MagneticButton 
                            as="a" 
                            href="assets/downloads/DNAB Leadership Book Final.pdf" 
                            download 
                            onClick={(e) => handleDownload(e, 'Download Started', 'Your PDF is on its way.')}
                            className="px-12 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full font-bold tracking-wide hover:bg-white/10 hover:border-white/20 transform hover:-translate-y-1.5 transition-all duration-500 flex items-center gap-3 group relative overflow-hidden">
                            <span className="relative z-10">Get the Book</span>
                            <svg className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <div className="absolute -inset-x-full inset-y-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-35deg] group-hover:animate-[shimmer_2s_infinite] pointer-events-none"></div>
                        </MagneticButton>
                    </div>
                </RevealSection>

                {/* Portrait Card */}
                <RevealSection className="relative order-1 md:order-2 flex justify-center md:justify-end delay-100" data-parallax-speed="0.1">
                    <div id="portrait-card" className="relative w-full max-w-xs h-96 md:max-w-none md:w-[26rem] md:h-[32rem] rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl mx-auto md:mx-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 opacity-60"></div>
                        <img src="/assets/hugh-portrait.jpg" alt="Portrait of Hugh Massie" className="w-full h-full object-cover" />
                    </div>
                </RevealSection>
            </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 relative" data-section-theme="purple">
            <div className="ambient-shadow"></div>
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-white sticky top-24 inline-block backdrop-blur-md py-2 px-4 rounded-lg bg-slate-900 border border-white/10 shadow-xl z-40">About Hugh</h2>
                        <RevealSection className="text-xl md:text-2xl text-accent-purple font-medium leading-relaxed">
                            Executive Chairman & Founder of <a href="https://dnabehavior.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent underline decoration-accent/30 transition-all">DNA Behavior</a>.
                        </RevealSection>
                    </div>
                    <RevealSection className="text-slate-400 space-y-6 text-lg font-light leading-loose delay-100">
                        <div className="flex flex-wrap gap-2 pt-2">
                            <span className="font-bold text-[10px] text-slate-200 uppercase tracking-[0.2em] bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md shadow-sm">Titan 100 CEO</span>
                            <span className="font-bold text-[10px] text-slate-200 uppercase tracking-[0.2em] bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md shadow-sm">Behavioral AI Architect</span>
                            <span className="font-bold text-[10px] text-slate-200 uppercase tracking-[0.2em] bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md shadow-sm">Behavioral Economics Pioneer</span>
                        </div>
                        <p>Hugh Massie is a global pioneer in the practical application of behavioral insights and the visionary behind <strong>DNA Behavior International</strong>, which serves individuals and organizations in over 125 countries.</p>
                        <p>He has been on a transformational journey from being a "Boy Without a Father" to a "Reformed CPA" and now leads and guides organizations globally as a "Man of Influence".</p>
                        <p>He works with CEOs, boards, and leadership teams to align their "DNA"—their natural behaviors—with their business goals. He solves every opportunity and challenge from the proven perspective that "behavior makes money".</p>
                        <p>His purpose is to empower people globally to increase behavioral consciousness, reduce stress, and promote greater happiness, success, and health in a sustainable way.</p>
                        <p>Hugh's moonshot goal is to commercialize DNA Behavior's AI-driven tech platform so that by 2030, it fully informs over 1 billion people annually on how to enhance their decision-making, performance and relationships.</p>
                        
                        <div className="pt-6 border-t border-white/5 space-y-4">
                            <h3 className="text-white font-bold text-lg">Impact & Connection</h3>
                            <p>Beyond his corporate leadership, Hugh is the Co-Founder of <strong>Boys Without Fathers (BWF)</strong>, a non-profit dedicated to providing mentoring and coaching to help boys become men of influence.</p>
                            <p>He is also a devoted dad and keen golfer.</p>

                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <h3 className="text-white font-bold text-lg mb-4">The Beginning</h3>
                            <p>It started with a realization. As a Chartered Accountant in Australia, Hugh saw a pattern: brilliant financial plans failing because of ignored human behavior. He realized that <em>"money problems are actually people problems."</em></p>
                            <p className="mt-4">Driven by this insight, he left traditional accounting to pioneer a new field. In 2001, he founded <strong>DNA Behavior</strong>, building the world's first system to scientifically measure and align human behavior with financial and business performance.</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 pt-6 mt-6 border-t border-white/5">
                            <a href="https://www.linkedin.com/in/hughmassie/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-accent transition-colors">
                                <span className="sr-only">LinkedIn Profile</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </a>
                            <a href="https://www.hlpster.com/hlpers/clo7znc0z0001ban8mfu9i262" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-accent transition-colors text-sm font-semibold border border-white/5">
                                View Hlpster Profile
                            </a>
                            <a href="https://www.youtube.com/@behavioraleconomicstoday" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-accent transition-colors">
                                <span className="sr-only">YouTube Channel</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </a>
                        </div>
                    </RevealSection>
                </div>

                <RevealSection className="hidden lg:flex items-start justify-end delay-300">
                    <div className="relative group translate-x-12 -translate-y-64">
                        {/* Decorative background glow */}
                        <div className="absolute -inset-8 bg-accent-purple/5 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        
                        {/* Main Image Frame */}
                        <div className="relative w-[34rem] h-[34rem] rounded-[3rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl transform transition-all duration-500">
                             <img 
                                src="/assets/behavioral-ai-visual.png" 
                                alt="Behavioral AI Intelligence Visual" 
                                className="w-full h-full object-cover mix-blend-screen opacity-90"
                            />
                            {/* Glass overlay highlight */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none"></div>
                        </div>

                        {/* Floating elements for depth */}
                        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full border border-white/10 bg-white/5 backdrop-blur-md animate-float shadow-xl"></div>
                        <div className="absolute -bottom-14 -left-14 w-40 h-40 rounded-full border border-white/10 bg-white/5 backdrop-blur-md animate-float delay-200 shadow-xl"></div>
                    </div>
                </RevealSection>
            </div>
        </section>

        {/* Key Work Section */}
        <section id="work" className="py-32 relative" data-section-theme="blue">
            <div className="ambient-shadow"></div>
            <div className="max-w-7xl mx-auto px-6">
                 <RevealSection className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 sticky top-24 inline-block z-40 backdrop-blur-md py-2 px-4 rounded-lg bg-slate-900 border border-white/10 shadow-xl">Key Work</h2>
                    <p className="text-slate-400 font-light text-lg">Ventures & Impact</p>
                 </RevealSection>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Card 1 */}
                     <SpotlightCard as="a" href="https://dnabehavior.com" target="_blank" rel="noopener noreferrer" className="block rounded-2xl p-8 group hover:border-accent-blue/30 relative overflow-hidden delay-100">
                         <div className="absolute inset-0 bg-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                         <div className="w-12 h-12 mb-8 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform duration-300 relative z-10">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                         </div>
                         <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent-blue transition-colors flex items-center gap-2 relative z-10">DNA Behavior <svg className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></h3>
                         <p className="text-slate-400 text-sm leading-relaxed relative z-10">The world's only all-in-one <strong>behavioral data platform</strong>. Providing valid, reliable insights (Financial DNA, Business DNA) to unlock human potential.</p>
                     </SpotlightCard>

                     {/* Card 2 */}
                     <SpotlightCard as="a" href="https://godna.ai" target="_blank" rel="noopener noreferrer" className="block rounded-2xl p-8 group hover:border-accent-blue/30 relative overflow-hidden delay-200">
                         <div className="absolute inset-0 bg-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                         <div className="w-12 h-12 mb-8 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform duration-300 relative z-10">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                         </div>
                         <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent-blue transition-colors flex items-center gap-2 relative z-10">GoDNA.ai <span className="text-[10px] uppercase tracking-wide bg-accent-blue/20 text-accent-blue px-2 py-0.5 rounded-full border border-accent-blue/20">New</span></h3>
                         <p className="text-slate-400 text-sm leading-relaxed relative z-10">Scalable connection intelligence mobile app for the modern world. The upcoming digital assistant empowering everyone to know, engage, and grow.</p>
                     </SpotlightCard>

                     {/* Card 3 */}
                     <SpotlightCard 
                         as="a" 
                         href="assets/downloads/DNAB Leadership Book Final.pdf" 
                         download 
                         onClick={(e) => handleDownload(e, 'Download Started', 'Your PDF is on its way.')}
                         className="block rounded-2xl p-8 group hover:border-accent-blue/30 relative overflow-hidden delay-300">
                         <div className="absolute inset-0 bg-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                         <div className="w-12 h-12 mb-8 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform duration-300 relative z-10">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                         </div>
                         <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent-blue transition-colors flex items-center gap-2 relative z-10">Leadership DNA <span className="text-[10px] uppercase tracking-wide bg-white/10 text-slate-300 px-2 py-0.5 rounded-full border border-white/10">PDF</span></h3>
                         <p className="text-slate-400 text-sm leading-relaxed relative z-10">The definitive guide to unlocking human potential in business. Download Hugh's comprehensive book on behavioral leadership.</p>
                     </SpotlightCard>

                     {/* Card 4 - BWF */}
                     <SpotlightCard as="a" href="https://www.boyswithoutfathers.org" target="_blank" rel="noopener noreferrer" className="block rounded-2xl p-8 group hover:border-accent-blue/30 relative overflow-hidden delay-400">
                         <div className="absolute inset-0 bg-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                         <div className="w-12 h-12 mb-8 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform duration-300 relative z-10">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                         </div>
                         <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent-blue transition-colors flex items-center gap-2 relative z-10">Boys Without Fathers <span className="text-[10px] uppercase tracking-wide bg-accent-blue/20 text-accent-blue px-2 py-0.5 rounded-full border border-accent-blue/20">Non-Profit</span></h3>
                         <p className="text-slate-400 text-sm leading-relaxed relative z-10">Dedicated to mentoring and coaching boys to become men of influence. A charitable initiative co-founded by Hugh Massie.</p>
                     </SpotlightCard>
                 </div>
                 
                 <div className="mt-12 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                     <RevealSection>
                         <SpotlightCard className="p-10 rounded-2xl border border-white/10 bg-white/5 relative overflow-hidden group hover:border-accent-blue/30 transition-colors">
                              <div className="absolute inset-0 bg-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-4 relative z-10"><span className="w-10 h-10 rounded-xl bg-accent-blue/20 flex items-center justify-center text-accent-blue text-sm font-bold">01</span> Consulting Solutions</h3>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-slate-300 relative z-10">
                                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-accent-blue mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span><strong className="text-white block mb-1">Business Performance</strong> Aligning people and financial behaviors.</span></li>
                                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-accent-blue mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span><strong className="text-white block mb-1">Leadership Development</strong> Hiring, talent, and performance coaching.</span></li>
                                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-accent-blue mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span><strong className="text-white block mb-1">Risk Management</strong> Behavioral risk and financial planning.</span></li>
                                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-accent-blue mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span><strong className="text-white block mb-1">M&A Due Diligence</strong> Assessing behavioral compatibility.</span></li>
                                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-accent-blue mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span><strong className="text-white block mb-1">Customer Experience</strong> Behavioral marketing and segmentation.</span></li>
                                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-accent-blue mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span><strong className="text-white block mb-1">Family Continuity</strong> Navigating complex family dynamics.</span></li>

                              </ul>
                         </SpotlightCard>
                     </RevealSection>

                     <RevealSection className="delay-100">
                         <SpotlightCard className="p-10 rounded-2xl border border-white/10 bg-white/5 relative overflow-hidden group hover:border-accent-purple/30 transition-colors">
                              <div className="absolute inset-0 bg-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-4 relative z-10"><span className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center text-accent-purple text-sm font-bold">02</span> Presentations & Workshops</h3>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-slate-300 relative z-10">
                                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-accent-purple mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg><span><strong className="text-white block mb-1">Behavioral Personalization</strong> The future of AI and engagement.</span></li>
                                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-accent-purple mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg><span><strong className="text-white block mb-1">Leadership Value Creation</strong> Unlocking potential for profit.</span></li>
                                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-accent-purple mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg><span><strong className="text-white block mb-1">Entrepreneurial Quantum Leaps</strong> Accelerating growth strategies.</span></li>
                                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-accent-purple mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg><span><strong className="text-white block mb-1">Behaviorally SMART™ Decisions</strong> Reducing bias in high-stakes situations.</span></li>
                              </ul>
                         </SpotlightCard>
                     </RevealSection>
                 </div>
            </div>
        </section>

        {/* Speaking & Media Section */}
        <section id="speaking" className="py-32 relative bg-white/[0.01]" data-section-theme="purple">
             <div className="max-w-6xl mx-auto px-6">
                 <RevealSection className="mb-20">
                     <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 sticky top-24 inline-block z-40 backdrop-blur-md py-2 px-4 rounded-lg bg-slate-900 border border-white/10 shadow-xl">Podcasts & Media</h2>
                     <p className="text-slate-400 font-light">Sharing insights on a global stage</p>
                 </RevealSection>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Podcasts entry */}
                     <RevealSection className="delay-100">
                         <SpotlightCard className="p-8 rounded-2xl h-full flex flex-col justify-between gap-8 group border-accent-purple/20 bg-accent-purple/5">
                              <div className="space-y-6">
                                  <div className="w-16 h-16 rounded-full bg-accent-purple/20 flex items-center justify-center text-accent-purple shrink-0">
                                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                                  </div>
                                  <div className="space-y-3">
                                      <h4 className="text-2xl font-bold text-white tracking-tight">The Hugh Massie Podcast</h4>
                                      <p className="text-slate-400 leading-relaxed font-light">Deep dives into the psychology of wealth, leadership behavior, and the future of human potential. Join Hugh as he interviews global changemakers.</p>
                                  </div>
                              </div>
                              <div className="flex flex-wrap gap-3 mt-4">
                                  <MagneticButton as="a" title="Listen on Apple Podcasts" aria-label="Listen on Apple Podcasts" href="https://podcasts.apple.com/us/podcast/the-behavioral-economics-podcast/id1844700855" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white hover:text-slate-900 transition-all">
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.7 19.5c-.75 1.1-1.5 2.2-2.7 2.2-1.1 0-1.45-.65-2.7-.65-1.3 0-1.65.65-2.7.65-1.1 0-1.9-1.1-2.7-2.2C6.75 17.7 5.25 14.5 5.25 11c0-3.3 2.1-5.7 6-5.7 1.15 0 2.1.8 2.7.8.55 0 1.5-.8 2.8-.8 1.1 0 2 .45 2.5 1.15-2.2 1.35-1.85 4.5 0 5.2-.4 1.2-1 2.3-1.8 3.5.05.15.15.2.25.35zM15 3.5c.65-1 1.15-2 1-3.15-1.05.05-2.3.7-3 1.55-.65.8-1.2 2-1 3.1.95.05 2.3-.65 3-1.5z"></path></svg>
                                  </MagneticButton>
                                  <MagneticButton as="a" title="Listen on Spotify" aria-label="Listen on Spotify" href="https://open.spotify.com/show/4m023IsfGpY2ZnJSqEwOef?si=e6a1db18640e468e" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 border border-white/10 text-white rounded-full hover:bg-[#1DB954] hover:text-black transition-all">
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.32 9.779-.6 13.5 1.56.42.18.6.72.241 1.26zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.4-1.02 15.66 1.44.539.3.66 1.02.359 1.56-.24.48-1.02.6-1.56.36z"></path></svg>
                                  </MagneticButton>
                                  <MagneticButton as="a" title="Watch on YouTube" aria-label="Watch on YouTube" href="https://youtube.com/@behavioraleconomicstoday?si=QMi0Z2LwYhet0eb6" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 border border-white/10 text-white rounded-full hover:bg-[#FF0000] transition-all">
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
                                  </MagneticButton>
                                  <MagneticButton as="a" href="https://dnabehavior.com/podcasts" target="_blank" rel="noopener noreferrer" className="px-6 py-3 ml-auto bg-transparent border border-white/10 text-white rounded-full font-bold hover:bg-white/5 transition-all text-xs tracking-wider uppercase">
                                      Explore all Episodes
                                  </MagneticButton>
                              </div>
                         </SpotlightCard>
                     </RevealSection>

                     {/* Blog entry */}
                     <RevealSection className="delay-200">
                         <SpotlightCard className="p-8 rounded-2xl h-full flex flex-col justify-between gap-8 group border-accent/20 bg-accent/5">
                              <div className="space-y-6">
                                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 2v6h6"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 13h10M7 17h10"></path></svg>
                                  </div>
                                  <div className="space-y-3">
                                      <h4 className="text-2xl font-bold text-white tracking-tight">Behavioral Insights Blog</h4>
                                      <p className="text-slate-400 leading-relaxed font-light">Regular commentary and analysis by Hugh Massie on the intersection of human behavior, leadership, and performance management.</p>
                                  </div>
                              </div>
                              <div className="flex items-center mt-4">
                                  <MagneticButton as="a" href="https://blog.dnabehavior.com/author/hugh-massie" target="_blank" rel="noopener noreferrer" className="w-full px-8 py-4 bg-accent text-slate-900 rounded-full font-bold transition-all hover:shadow-[0_0_20px_rgba(45,212,191,0.4)]">
                                      Visit Behavioral Blog
                                  </MagneticButton>
                              </div>
                         </SpotlightCard>
                     </RevealSection>
                 </div>
             </div>
        </section>

        {/* Podcast Gallery Section */}
        <section id="podcast-gallery" className="py-32 relative" data-section-theme="teal">
            <div className="ambient-shadow"></div>
            <div className="max-w-7xl mx-auto px-6">
                <RevealSection className="mb-20 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Watch the Podcast</h2>
                    <p className="text-slate-400 font-light max-w-2xl mx-auto uppercase tracking-widest text-sm">Visualizing Behavioral Intelligence</p>
                </RevealSection>

                <RevealSection className="delay-200">
                    <PodcastVideoGallery />
                </RevealSection>
            </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-32 md:py-48 relative" data-section-theme="teal">
            <div className="ambient-shadow"></div>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24">
                    <h2 className="inline-block text-3xl md:text-5xl font-bold text-white tracking-tight bg-slate-900/40 backdrop-blur-xl px-10 py-4 rounded-3xl border border-white/10 shadow-2xl">
                        What Others Say
                    </h2>
                </div>
            </div>

            <div className="max-w-[2400px] mx-auto">
                <TestimonialsCarousel>
                     <div data-slide className="snap-start shrink-0 w-[360px] md:w-[440px] lg:w-[520px]">
                        <RevealSection className="delay-100 h-full">
                            <SpotlightCard as="article" className="p-10 rounded-3xl relative h-full min-h-[420px] flex flex-col justify-between">
                                <div>
                                    <svg className="w-10 h-10 text-accent/50 mb-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.896 14.11 16.03 14.296 15.402C14.482 14.774 14.764 14.263 15.142 13.869C15.52 13.475 16.036 13.131 16.69 12.837C17.344 12.543 18.162 12.396 19.146 12.396V6L19 6C17.656 6 16.516 6.306 15.58 6.918C14.644 7.53 13.924 8.358 13.42 9.402C12.916 10.446 12.664 11.694 12.664 13.146V21H14.017ZM8.05 21V18C8.05 16.896 8.143 16.03 8.329 15.402C8.515 14.774 8.797 14.263 9.175 13.869C9.553 13.475 10.069 13.131 10.723 12.837C11.377 12.543 12.195 12.396 13.179 12.396V6L13.033 6C11.689 6 10.549 6.306 9.613 6.918C8.677 7.53 7.957 8.358 7.453 9.402C6.949 10.446 6.697 11.694 6.697 13.146V21H8.05Z"></path></svg>
                                    <blockquote className="text-xl md:text-2xl text-slate-200 font-light leading-relaxed mb-10 line-clamp-4">
                                        "Hugh moves the needle on self-understanding and the practicality of managing team and client differences."
                                    </blockquote>
                                </div>
                                <footer className="text-base flex items-center gap-4">
                                    <div className="h-px bg-white/20 w-12"></div>
                                    <div>
                                        <strong className="text-white block font-semibold">Rick Kent</strong>
                                        <span className="text-slate-500 text-sm">CEO of Merit Financial and Meet Fruition</span>
                                    </div>
                                </footer>
                            </SpotlightCard>
                        </RevealSection>
                     </div>

                     <div data-slide className="snap-start shrink-0 w-[360px] md:w-[440px] lg:w-[520px]">
                        <RevealSection className="delay-200 h-full">
                            <SpotlightCard as="article" className="p-10 rounded-3xl relative h-full min-h-[420px] flex flex-col justify-between">
                                <div>
                                    <svg className="w-10 h-10 text-accent/50 mb-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.896 14.11 16.03 14.296 15.402C14.482 14.774 14.764 14.263 15.142 13.869C15.52 13.475 16.036 13.131 16.69 12.837C17.344 12.543 18.162 12.396 19.146 12.396V6L19 6C17.656 6 16.516 6.306 15.58 6.918C14.644 7.53 13.924 8.358 13.42 9.402C12.916 10.446 12.664 11.694 12.664 13.146V21H14.017ZM8.05 21V18C8.05 16.896 8.143 16.03 8.329 15.402C8.515 14.774 8.797 14.263 9.175 13.869C9.553 13.475 10.069 13.131 10.723 12.837C11.377 12.543 12.195 12.396 13.179 12.396V6L13.033 6C11.689 6 10.549 6.306 9.613 6.918C8.677 7.53 7.957 8.358 7.453 9.402C6.949 10.446 6.697 11.694 6.697 13.146V21H8.05Z"></path></svg>
                                    <blockquote className="text-xl md:text-2xl text-slate-200 font-light leading-relaxed mb-10 line-clamp-4">
                                        "Hugh moves the needle in building dynamic organizational cultures by starting with the hidden competitive advantage of discovering natural hard-wired behavior."
                                    </blockquote>
                                </div>
                                <footer className="text-base flex items-center gap-4">
                                    <div className="h-px bg-white/20 w-12"></div>
                                    <div>
                                        <strong className="text-white block font-semibold">Warren Rustand</strong>
                                        <span className="text-slate-500 text-sm">Dean of EO Leadership Academy and Former YPO Chair</span>
                                    </div>
                                </footer>
                            </SpotlightCard>
                        </RevealSection>
                     </div>

                     <div data-slide className="snap-start shrink-0 w-[360px] md:w-[440px] lg:w-[520px]">
                        <RevealSection className="delay-300 h-full">
                            <SpotlightCard as="article" className="p-10 rounded-3xl relative h-full min-h-[420px] flex flex-col justify-between">
                                <div>
                                    <svg className="w-10 h-10 text-accent/50 mb-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.896 14.11 16.03 14.296 15.402C14.482 14.774 14.764 14.263 15.142 13.869C15.52 13.475 16.036 13.131 16.69 12.837C17.344 12.543 18.162 12.396 19.146 12.396V6L19 6C17.656 6 16.516 6.306 15.58 6.918C14.644 7.53 13.924 8.358 13.42 9.402C12.916 10.446 12.664 11.694 12.664 13.146V21H14.017ZM8.05 21V18C8.05 16.896 8.143 16.03 8.329 15.402C8.515 14.774 8.797 14.263 9.175 13.869C9.553 13.475 10.069 13.131 10.723 12.837C11.377 12.543 12.195 12.396 13.179 12.396V6L13.033 6C11.689 6 10.549 6.306 9.613 6.918C8.677 7.53 7.957 8.358 7.453 9.402C6.949 10.446 6.697 11.694 6.697 13.146V21H8.05Z"></path></svg>
                                    <blockquote className="text-xl md:text-2xl text-slate-200 font-light leading-relaxed mb-10 line-clamp-4">
                                        "Hugh has played a leading role in unlocking new frontiers of thinking and practical application in the emerging field of behavioral economics."
                                    </blockquote>
                                </div>
                                <footer className="text-base flex items-center gap-4">
                                    <div className="h-px bg-white/20 w-12"></div>
                                    <div>
                                        <strong className="text-white block font-semibold">Professor Meir Statman</strong>
                                        <span className="text-slate-500 text-sm">University of Santa Clara</span>
                                    </div>
                                </footer>
                            </SpotlightCard>
                        </RevealSection>
                     </div>

                     <div data-slide className="snap-start shrink-0 w-[360px] md:w-[440px] lg:w-[520px]">
                        <RevealSection className="delay-400 h-full">
                            <SpotlightCard as="article" className="p-10 rounded-3xl relative h-full min-h-[420px] flex flex-col justify-between">
                                <div>
                                    <svg className="w-10 h-10 text-accent/50 mb-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.896 14.11 16.03 14.296 15.402C14.482 14.774 14.764 14.263 15.142 13.869C15.52 13.475 16.036 13.131 16.69 12.837C17.344 12.543 18.162 12.396 19.146 12.396V6L19 6C17.656 6 16.516 6.306 15.58 6.918C14.644 7.53 13.924 8.358 13.42 9.402C12.916 10.446 12.664 11.694 12.664 13.146V21H14.017ZM8.05 21V18C8.05 16.896 8.143 16.03 8.329 15.402C8.515 14.774 8.797 14.263 9.175 13.869C9.553 13.475 10.069 13.131 10.723 12.837C11.377 12.543 12.195 12.396 13.179 12.396V6L13.033 6C11.689 6 10.549 6.306 9.613 6.918C8.677 7.53 7.957 8.358 7.453 9.402C6.949 10.446 6.697 11.694 6.697 13.146V21H8.05Z"></path></svg>
                                    <blockquote className="text-xl md:text-2xl text-slate-200 font-light leading-relaxed mb-10 line-clamp-4">
                                        "Hugh has figured out how to bring the invisible people issues in all areas of life and business to the surface through scientific measurement."
                                    </blockquote>
                                </div>
                                <footer className="text-base flex items-center gap-4">
                                    <div className="h-px bg-white/20 w-12"></div>
                                    <div>
                                        <strong className="text-white block font-semibold">Ami Lokta</strong>
                                        <span className="text-slate-500 text-sm">Maximum Impact Partners</span>
                                    </div>
                                </footer>
                            </SpotlightCard>
                        </RevealSection>
                     </div>
                </TestimonialsCarousel>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
