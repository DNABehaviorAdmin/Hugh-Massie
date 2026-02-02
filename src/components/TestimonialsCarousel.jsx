import React, { useEffect, useRef, useState } from "react";

function useCarouselState(containerRef) {
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const left = el.scrollLeft;

      // small tolerance for fractional scroll values
      const eps = 2;

      setCanPrev(left > eps);
      setCanNext(left < maxScrollLeft - eps);
    };

    update();

    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  return { canPrev, canNext };
}

export default function TestimonialsCarousel({ children }) {
  const scrollerRef = useRef(null);
  const { canPrev, canNext } = useCarouselState(scrollerRef);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const getStep = () => {
    const el = scrollerRef.current;
    if (!el) return 560;

    const slide = el.querySelector("[data-slide]");
    const gap = window.innerWidth >= 768 ? 32 : 24; // md gap-8 vs gap-6
    return slide ? slide.offsetWidth + gap : 400;
  };

  const scrollByOne = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;

    const step = getStep();
    el.scrollBy({
      left: dir === "next" ? step : -step,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(scrollerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) * 1.5; // scroll-fast multiplier
    scrollerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="relative">
      {/* Controls */}
      <div className="flex items-center justify-end gap-3 mb-8 px-6 md:px-12">
        <button
          type="button"
          aria-label="Previous testimonials"
          onClick={() => scrollByOne("prev")}
          disabled={!canPrev}
          className="h-11 w-11 rounded-full border border-white/10 bg-slate-900/50 backdrop-blur-xl text-white
                     shadow-lg transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-900/70 flex items-center justify-center"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Next testimonials"
          onClick={() => scrollByOne("next")}
          disabled={!canNext}
          className="h-11 w-11 rounded-full border border-white/10 bg-slate-900/50 backdrop-blur-xl text-white
                     shadow-lg transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-900/70 flex items-center justify-center"
        >
          →
        </button>
      </div>

      {/* Edge fades removed */}

      {/* Scroller */}
      <div
        ref={scrollerRef}
        tabIndex={0}
        
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onContextMenu={(e) => e.preventDefault()}

        className={`relative overflow-x-auto flex gap-6 md:gap-8 
                   px-6 md:px-12 pb-2 select-none
                   [scrollbar-width:none] [-ms-overflow-style:none] outline-none
                   ${isDragging ? "cursor-grabbing scroll-auto snap-none" : "cursor-grab scroll-smooth snap-x snap-mandatory"}`}
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Hide scrollbar (webkit) */}
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>

        <div className="contents">{children}</div>
      </div>
    </div>
  );
}
