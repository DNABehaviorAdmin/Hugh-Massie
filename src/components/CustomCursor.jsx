import { useEffect, useRef } from 'react';

export default function CustomCursor() {
    const dotRef = useRef(null);
    const outlineRef = useRef(null);

    useEffect(() => {
        const cursorDot = dotRef.current;
        const cursorOutline = outlineRef.current;

        if (!cursorDot || !cursorOutline) return;

        // Only active on non-touch devices
        const isFinePointer = window.matchMedia("(pointer: fine)").matches;
        if (!isFinePointer) return;

        const handleMouseMove = (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;

            // Outline follows with very slight delay for snappiness
            cursorOutline.animate({
                transform: `translate3d(${posX}px, ${posY}px, 0)`
            }, { duration: 125, fill: "forwards" });
        };

        const handleMouseEnter = () => document.body.classList.add('hovering');
        const handleMouseLeave = () => document.body.classList.remove('hovering');

        window.addEventListener('mousemove', handleMouseMove);

        const handleInteraction = (e) => {
            const target = e.target;
            if (target.closest('a, button, input, textarea, .spotlight-card, [role="button"]')) {
                handleMouseEnter();
            } else {
                handleMouseLeave();
            }
        };
        
        window.addEventListener('mouseover', handleInteraction);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleInteraction);
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot hidden md:block"></div>
            <div ref={outlineRef} className="cursor-outline hidden md:block"></div>
        </>
    );
}
