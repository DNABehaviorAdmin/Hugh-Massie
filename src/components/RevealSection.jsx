import { useEffect, useRef } from 'react';

export default function RevealSection({ children, className = '', delay = 0, ...props }) {
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            element.classList.add('active');
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const delayClass = delay === 100 ? 'delay-100' : delay === 200 ? 'delay-200' : delay === 300 ? 'delay-300' : '';

    return (
        <div ref={ref} className={`reveal-section ${delayClass} ${className}`} {...props}>
            {children}
        </div>
    );
}
