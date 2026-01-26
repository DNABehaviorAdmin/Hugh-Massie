import { useEffect, useRef } from 'react';

export default function MagneticButton({ children, className = '', href, ...props }) {
  const btnRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    };

    const handleMouseLeave = () => {
      btn.style.transform = 'translate(0, 0)';
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const baseClass = "inline-flex items-center justify-center transition-all duration-300 active:scale-95";

  if (href) {
    return (
      <a ref={btnRef} href={href} className={`${baseClass} ${className}`} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button ref={btnRef} className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
