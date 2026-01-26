import { useEffect, useRef } from 'react';

export default function SpotlightCard({ children, className = '', as: Component = 'div', ...props }) {
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        };

        // We listen on the document or the card? Legacy script listened on document.
        // But listening on document for ALL cards is efficient, but passing the specific card ref logic is tricky if isolated.
        // Legacy: document.addEventListener('mousemove', spotlightCards.forEach...)
        // Converting to local listener might be less efficient if many cards, but simpler.
        // Or cleaner: listen on card.mousemove.
        // Wait, legacy logic: `spotlightCards.forEach(card => ... const rect = card.getBoundingClientRect(); const x = e.clientX - rect.left;`
        // It captures mouse ANYWHERE on screen to update the glow?
        // "radial-gradient(800px circle at var(--mouse-x)"
        // If I hover OUTSIDE only one card, should it glow? Usually spotlight is on hover?
        // Legacy script: `document.addEventListener('mousemove', (e) => { spotlightCards.forEach... })`
        // So yes, it updates ALL cards based on global mouse position constanty.
        // This is expensive but gives that "flashlight" feel even when far away?
        // Actually, CSS says `.spotlight-card { background: rgba(255, 255, 255, 0.02); }`
        // The ::before mask is what glows.
        // If I move mouse outside, `x` and `y` are relative to card.
        // I will replicate the global listener behavior for correctness.

        const updatePosition = (e) => {
             const rect = card.getBoundingClientRect();
             const x = e.clientX - rect.left;
             const y = e.clientY - rect.top;
             card.style.setProperty('--mouse-x', `${x}px`);
             card.style.setProperty('--mouse-y', `${y}px`);
        }

        window.addEventListener('mousemove', updatePosition);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
        };
    }, []);

    return (
        <Component ref={cardRef} className={`spotlight-card ${className}`} {...props}>
            {children}
        </Component>
    );
}
