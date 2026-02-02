import React, { useEffect, useMemo, useRef, useState } from "react";

// Helper to normalize the index difference for a circular deck
function normalizeDiff(index, active, total) {
  let diff = index - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

function clampDeckOffset(diff) {
  if (diff > 2) return 2;
  if (diff < -2) return -2;
  return diff;
}

function getDeckStyle(diff) {
  const d = clampDeckOffset(diff);

  // Base config per layer
  // Active card: 100% focus, no blur, highest layer
  if (d === 0) {
    return {
      transform: "translate3d(-50%, -50%, 0) translate3d(0px, 0px, 0px) scale(1)",
      opacity: 1,
      filter: "blur(0px)",
      zIndex: 50,
    };
  }

  // Side cards: visible but secondary, subtle depth cues
  // Immediate neighbors (d=-1, 1)
  if (d === -1) {
    return {
      transform: "translate3d(-50%, -50%, 0) translate3d(-200px, 10px, 0px) scale(0.9) rotate(-1.5deg)",
      opacity: 0.35,
      filter: "blur(2px)",
      zIndex: 40,
    };
  }

  if (d === 1) {
    return {
      transform: "translate3d(-50%, -50%, 0) translate3d(200px, 10px, 0px) scale(0.9) rotate(1.5deg)",
      opacity: 0.35,
      filter: "blur(2px)",
      zIndex: 40,
    };
  }

  // Sub-secondary layers (d=-2, 2)
  if (d === -2) {
    return {
      transform: "translate3d(-50%, -50%, 0) translate3d(-340px, 20px, 0px) scale(0.8) rotate(-3deg)",
      opacity: 0.1,
      filter: "blur(4px)",
      zIndex: 30,
    };
  }

  if (d === 2) {
    return {
      transform: "translate3d(-50%, -50%, 0) translate3d(340px, 20px, 0px) scale(0.8) rotate(3deg)",
      opacity: 0.1,
      filter: "blur(4px)",
      zIndex: 30,
    };
  }

  // hidden
  return {
    transform: "translate3d(-50%, -50%, 0) translate3d(0px, 80px, 0px) scale(0.75)",
    opacity: 0,
    filter: "blur(8px)",
    zIndex: 10,
  };
}

export default function TestimonialsCarousel({
  children,
  className = "",
  initialIndex = 0,
  autoplay = false,
  autoplayMs = 7000,
}) {
  const items = useMemo(() => React.Children.toArray(children).filter(Boolean), [children]);
  const n = items.length;

  const [active, setActive] = useState(() => {
    if (!n) return 0;
    return Math.min(Math.max(initialIndex, 0), n - 1);
  });

  const touchRef = useRef({ x: 0, y: 0, dragging: false });

  const go = (dir) => {
    if (!n) return;
    setActive((prev) => (prev + dir + n) % n);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      // Don't navigate if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n]);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || n <= 1) return;
    const id = window.setInterval(() => go(1), autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplay, autoplayMs, n]);

  // Touch handlers for swipe
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, dragging: true };
  };

  const onTouchMove = (e) => {
    if (!touchRef.current.dragging) return;
    const t = e.touches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    // Lock scroll if movement is primarily horizontal
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      if (e.cancelable) e.preventDefault();
    }
  };

  const onTouchEnd = (e) => {
    if (!touchRef.current.dragging) return;
    touchRef.current.dragging = false;

    const changedTouch = e.changedTouches[0];
    const dx = changedTouch.clientX - touchRef.current.x;

    if (dx > 60) go(-1);
    if (dx < -60) go(1);
  };

  if (!n) return null;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Stage - strictly Deck, no overflow */}
      <div
        className="relative mx-auto flex items-center justify-center p-4 overflow-visible"
        style={{
          height: "640px",
          maxWidth: "1400px",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Soft centered focus area */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 blur-[120px] -z-20 pointer-events-none" />

        {/* Cards Layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
          {items.map((node, i) => {
            const diff = normalizeDiff(i, active, n);
            const style = getDeckStyle(diff);
            const isActive = diff === 0;
            const isNeighbor = Math.abs(diff) === 1;

            return (
              <div
                key={i}
                className={`absolute left-1/2 top-1/2 w-[340px] sm:w-[440px] md:w-[500px] lg:w-[580px] -translate-x-1/2 -translate-y-1/2 transition-all duration-800 cubic-bezier(0.19, 1, 0.22, 1) will-change-transform 
                  ${isActive ? 'pointer-events-auto z-50' : isNeighbor ? 'pointer-events-auto cursor-pointer z-40' : 'pointer-events-none z-30'}`}
                style={style}
                aria-hidden={!isActive}
                onClick={() => {
                  if (diff === -1) go(-1);
                  if (diff === 1) go(1);
                }}
              >
                {/* Active card has no external effects - purely solid */}
                <div className="relative group">
                   {node}
                </div>
              </div>
            );
          })}
        </div>

        {/* Left Arrow */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); go(-1); }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[100] h-14 w-14 flex items-center justify-center rounded-full border border-white/20 bg-slate-900/60 text-white backdrop-blur-xl hover:bg-slate-900/80 hover:scale-110 hover:border-white/40 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-accent group"
          aria-label="Previous testimonial"
        >
          <svg className="h-7 w-7 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); go(1); }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[100] h-14 w-14 flex items-center justify-center rounded-full border border-white/20 bg-slate-900/60 text-white backdrop-blur-xl hover:bg-slate-900/80 hover:scale-110 hover:border-white/40 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-accent group"
          aria-label="Next testimonial"
        >
          <svg className="h-7 w-7 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Pagination Highlights - Clean and simple */}
      <div className="flex justify-center items-center gap-3 mt-12 pb-8">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2.5 transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-accent ${
              i === active ? "w-10 bg-accent" : "w-2.5 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
