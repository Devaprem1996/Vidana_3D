import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect } from "react";
import CurvedLoop from "./TextEffects/CurvedLoop";
import Button from "./Button";
import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const FloatingImage = () => {
  const frameRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      videoRef.current,
      { scale: 0 },
      {
        scale: 1,
        duration: 0.5,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: videoRef.current,
          start: "top 80%",
          end: "top 40%",
          scrub: true,
        },
      }
    );
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const element = frameRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((yPos - centerY) / centerY) * -2;
    const rotateY = ((xPos - centerX) / centerX) * 2;
    gsap.to(element, {
      duration: 0.3,
      rotateX,
      rotateY,
      transformPerspective: 500,
      ease: "power1.inOut",
    });
  };

  const handleMouseLeave = () => {
    const element = frameRef.current;
    if (element) {
      gsap.to(element, {
        duration: 0.3,
        rotateX: 0,
        rotateY: 0,
        ease: "power1.inOut",
      });
    }
  };

  return (
    <section  //bg-gradient-to-br from-black via-gray-900 to-neutral-800 text-4xl text-white 
      id="story"
      className="relative min-h-screen w-screen  bg-black  text-white text-4xl flex flex-col items-center overflow-x-hidden"
      style={{ minHeight: "100dvh" }}
    >
      {/* Top label */}
      <p className="font-general  uppercase tracking-wider text-2xl sm:text-4xl md:text-6xl lg-text-7xl  xl:text-[50px]  text-blue-50/80 mt-8 mb-2">
        see our story
      </p>

      {/* Title */}
      <AnimatedTitle
        title="The St<b>o</b>ry of <br />  Vidana Consultin<b>g</b>"
        containerClass="text-center mb-6 sm:mb-10 pointer-events-none mix-blend-difference relative z-10"
      />

      {/* Video */}
      <div className="w-full max-w-3xl px-4 sm:px-0 flex justify-center mb-8 sm:mb-12 flex-shrink-0">
        <div
          ref={videoRef}
          className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl"
          style={{ filter: "url(#flt_tag)" }}
        >
          <video
            ref={frameRef}
            muted
            autoPlay
            loop
            playsInline
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseLeave}
            onMouseEnter={handleMouseLeave}
            src="/videos/story.mp4"
            className="w-full h-full object-cover"
          />
        </div>
        {/* SVG Filter */}
        <svg className="absolute w-0 h-0">
          <defs>
            <filter id="flt_tag">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                result="flt_tag"
              />
              <feComposite in="SourceGraphic" in2="flt_tag" operator="atop" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Curved Text */}


      
    </section>
  );
};

export default FloatingImage;