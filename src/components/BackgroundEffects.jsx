import { useEffect, useRef } from 'react';

export default function BackgroundEffects() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null };
    let animationFrameId;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };
    const handleMouseOut = () => { mouse.x = null; mouse.y = null; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

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
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 -z-[60] bg-slate-900"></div>
      <div className="fixed inset-0 -z-50 bg-[url('/assets/premium-bg-v2.png')] bg-cover bg-center opacity-80"></div>
      {/* Dark Overlay for "Lucid" effect */}
      <div className="fixed inset-0 -z-40 bg-slate-950/70 backdrop-blur-sm"></div>
      <div id="ambient-layer" className="fixed inset-0 pointer-events-none -z-20 overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] mix-blend-screen animate-float delay-100"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen animate-float delay-300"></div>
      </div>
      <canvas ref={canvasRef} id="background-canvas" className="fixed inset-0 pointer-events-none -z-10 opacity-40" aria-hidden="true"></canvas>
    </>
  );
}
