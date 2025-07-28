// components/MouseTrail.jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MouseTrail = () => {
  const trailRef = useRef([]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      trailRef.current.forEach((dot, index) => {
        if (!dot) return;
        
        gsap.to(dot, {
          x: mousePos.current.x - 10,
          y: mousePos.current.y - 10,
          duration: 0.3 + index * 0.05,
          ease: "power2.out",
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none  z-50">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          ref={el => trailRef.current[i] = el}
          className="absolute w-5 h-5 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              ['#5724ff', '#4fb7dd', '#edff66'][i % 3]
            }88 0%, transparent 70%)`,
            filter: 'blur(1px)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};

export default MouseTrail;