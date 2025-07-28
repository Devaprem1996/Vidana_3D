// components/ParallaxLines.jsx
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const ParallaxLines = () => {
  const lineRef = useRef(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!lineRef.current) return;

    // Create a wavy path function
    const createSpiralPath = (progress) => {
     
  let path = `M 960 540`;
      const steps = 100;
      const speed = 1.8;
  
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * speed;
    const scale = 400 * (1 + progress * 0.5);
    
    // Figure-8 parametric equations
    const x = 960 + scale * Math.sin(t);
    const y = 540 + scale * Math.sin(t) * Math.cos(t);
    
    if (i === 1) {
      path += ` M ${x} ${y}`;
    } else {
      path += ` L ${x} ${y}`;
    }
  }
  
  return path;
      

};

    // Set initial path
    lineRef.current.setAttribute("d", createSpiralPath(0));


    // Get initial path length
    let currentLength = lineRef.current.getTotalLength();
    
    // Set initial dash state
    gsap.set(lineRef.current, { 
      strokeDasharray: currentLength,
      strokeDashoffset: currentLength
    });

    // Create main scroll animation with slower scrub
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%", // Start earlier for smoother entry
      end: "bottom 20%", // End later for smoother exit
      scrub: 3, // CHANGED: Increased scrub value for slower, smoother parallax
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Update path shape
        const newPath = createSpiralPath(progress);
        lineRef.current.setAttribute("d", newPath);
        
        // Update path length for smooth drawing
        const newLength = lineRef.current.getTotalLength();
        
        // Smoothly animate the line drawing
        gsap.set(lineRef.current, {
          strokeDasharray: newLength,
          strokeDashoffset: newLength * (1 - progress)
        });
      }
    });

    // Add subtle floating animation
    gsap.to(lineRef.current, {
      attr: {
        "stroke-width": 35 // Oscillate between 30 and 35
      },
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full z-10"
        viewBox="0 0 1920 1080"
        fill="none"
        preserveAspectRatio="none"
        style={{ pointerEvents: "none" }}
      >
        
        <path
          ref={lineRef}
          stroke="#f8ef00"//NGED: Solid blue color, no gradient
          strokeWidth="30" // CHANGED: Increased line width
          strokeLinecap="round"
          fill="none"
          filter="url(#blueGlow)"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};

export default ParallaxLines;