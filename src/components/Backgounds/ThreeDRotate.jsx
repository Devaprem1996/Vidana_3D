import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const items = Array.from({ length: 16 });

const ThreeDRotateBackground = () => {
  const boxRef = useRef(null);
  const mouseTween = useRef(null);

  useEffect(() => {
    const box = boxRef.current;

    // GSAP scroll animation
    gsap.fromTo(
      box,
      {
        rotateX: 0,
        scale: 1,
        perspective: 600,
        rotateZ: 5,
      },
      {
        rotateX: 360,
        scale: 1.15,
        perspective: 200,
        rotateZ: 5,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: box,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (mouseTween.current) mouseTween.current.kill();
    };
  }, []);

  // Responsive Z value for 3D depth
  const zValue = () => {
    if (typeof window === "undefined") return 120;
    if (window.innerWidth >= 1536) return 350;
    if (window.innerWidth >= 1280) return 320;
    if (window.innerWidth >= 1024) return 260;
    if (window.innerWidth >= 768) return 200;
    if (window.innerWidth >= 640) return 150;
    return 120;
  };

  // Mouse move interaction
  const handleMouseMove = (e) => {
    const box = boxRef.current;
    const rect = box.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / rect.width) * 30; // max 30deg
    const rotateX = -(y / rect.height) * 30; // max 30deg

    // Animate with GSAP for smoothness
    if (mouseTween.current) mouseTween.current.kill();
    mouseTween.current = gsap.to(box, {
      rotateY,
      rotateX,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  // Reset on mouse leave
  const handleMouseLeave = () => {
    const box = boxRef.current;
    if (mouseTween.current) mouseTween.current.kill();
    mouseTween.current = gsap.to(box, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,
      ease: "power2.out",
    });
  };

  return (
    <div
      className="
        absolute inset-0 w-full h-full
        flex items-center justify-center
        z-0
        overflow-hidden
         pointer-events-none  
      "
      aria-hidden="true"
    >
      <div
        className="
          relative
          w-[90vw] h-[90vw]
          sm:w-[80vw] sm:h-[80vw]
          md:w-[60vw] md:h-[60vw]
          lg:w-[50vw] lg:h-[50vw]
          max-w-[900px] max-h-[900px]
          flex items-center justify-center
        "
      >
        <div
          ref={boxRef}
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            perspective: "600px",
            willChange: "transform",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {items.map((_, i) => (
            <span
              key={i}
              className="
                absolute left-1/2 top-1/2 font-bold text-white
                text-[6vw] sm:text-[5vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw]
                uppercase whitespace-nowrap px-2
                pointer-events-none
              "
              style={{
                transform: `
                  translate(-50%, -50%)
                  rotateX(${i * 22.5}deg)
                  translateZ(${zValue()}px)
                `,
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.1), rgba(0,0,0,0.5) 90%, transparent)",
                textShadow: "0 10px 15px rgba(0,0,0,0.3)",
                lineHeight: "0.76em",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                transformStyle: "preserve-3d",
                padding: "0 10px",
              }}
            >
              <i className="not-italic text-[#5c5fc4]">Vidana</i>{" "}
              <span className="text-white">Consulting</span>{" "}
              <i className="not-italic text-[#c4c15c]">Works</i>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreeDRotateBackground;