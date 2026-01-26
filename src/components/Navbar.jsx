import { useState, useEffect } from 'react';
import MagneticButton from './MagneticButton';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        
        // Active section logic from legacy script
        const sections = document.querySelectorAll('section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.getAttribute('id'));
                }
            });
        }, { rootMargin: '-30% 0px -50% 0px' });
        
        sections.forEach(section => observer.observe(section));

        return () => {
             window.removeEventListener('scroll', handleScroll);
             observer.disconnect();
        };
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            document.body.style.transition = 'backdrop-filter 0.3s';
            el.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    return (
        <nav id="navbar" className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-slate-900/80 backdrop-blur-md border-white/5 shadow-lg' : 'border-white/0'}`}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <a href="#" className="flex items-center gap-2 relative group py-2">
                    <span className="text-2xl font-bold tracking-tight text-white group-hover:text-accent transition-all duration-300">HM<span className="text-accent">.</span></span>
                </a>

                <ul className="hidden md:flex gap-10 text-sm font-semibold tracking-wide text-slate-400">
                    {['About', 'Work', 'Speaking', 'Testimonials'].map((item) => {
                        const id = item.toLowerCase();
                        const targetId = item === 'Speaking' ? 'speaking' : item.toLowerCase();
                        
                        return (
                            <li key={item}>
                                <MagneticButton
                                    onClick={() => scrollTo(targetId)}
                                    className={`hover:text-white py-2 px-1 relative group ${activeSection === targetId ? 'text-accent' : ''}`}
                                >
                                    {item === 'Speaking' ? 'Media' : item} 
                                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full ${activeSection === targetId ? 'w-full' : ''}`}></span>
                                </MagneticButton>
                            </li>
                        );
                    })}
                </ul>

                <MagneticButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white p-2 rounded-lg bg-white/5 hover:bg-white/10" aria-label="Toggle mobile menu">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </MagneticButton>
            </div>

            <div className={`md:hidden absolute top-20 left-0 w-full bg-slate-900/95 border-b border-white/10 backdrop-blur-xl transition-all duration-300 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
                <ul className="flex flex-col p-6 gap-6 text-center text-slate-300 text-lg font-light">
                     {['About', 'Work', 'Medua', 'Testimonials'].map((item) => { // Copy-paste typo "Medua"? No, legacy checked href="#speaking" -> Media
                        const label = item === 'Medua' ? 'Media' : item;
                        const targetId = label === 'Media' ? 'speaking' : label.toLowerCase();
                        return (
                            <li key={label}><button onClick={() => scrollTo(targetId)} className="block hover:text-accent w-full">{label}</button></li>
                        )
                     })}
                </ul>
            </div>
        </nav>
    );
}
