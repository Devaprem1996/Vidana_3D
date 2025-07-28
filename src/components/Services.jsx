import { useState, useRef, useEffect } from "react";
import React from "react";
import { TiLocationArrow } from "react-icons/ti";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import hoverSoundSrc from '/audio/hover.mp3';
import TargetCursor from "./Cursors/TargetCursor";
import SplitText from "./TextEffects/SplitText"





gsap.registerPlugin(ScrollTrigger);

// --- AnimatedWord Component ---
const AnimatedWord = ({ text, className = "", scramble = false, delay = 0 }) => {
  const ref = useRef(null);
  const hoverAudio = useRef(null);

  useEffect(() => {
    hoverAudio.current = new Audio(hoverSoundSrc);
  }, []);

  const playHoverSound = () => {
    if (hoverAudio.current) {
      hoverAudio.current.currentTime = 0;
      hoverAudio.current.play();
    }
  };

  useEffect(() => {
    if (scramble && ref.current) {
      let cancel;
      setTimeout(() => {
        cancel = scrambleText(ref.current, text, 1.1);
      }, delay * 1000);
      return () => cancel && cancel();
    }
  }, [text, scramble, delay]);

  useEffect(() => {
    if (!scramble && ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay,
          ease: "power3.out",
        }
      );
    }
  }, [scramble, delay]);

  return (
    <span
      ref={ref}
      className={`inline-block transition-transform duration-200 will-change-transform ${className}`}
      onMouseEnter={playHoverSound}
    >
      {text}
    </span>
  );
};

// --- BentoTilt Component ---
export const BentoTilt = ({ children, className = "", ...props }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;
    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;
    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;
    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.97, .97, .97)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => setTransformStyle("");

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle, transition: "transform 0.25s cubic-bezier(.22,1,.36,1)" }}
      {...props}
    >
      {children}
    </div>
  );
};

// --- BentoCard Component ---
export const BentoCard = ({ src, title, description, isComingSoon }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const [hovered, setHovered] = useState(false);
  const hoverButtonRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();
    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setHoverOpacity(1);
    setHovered(true);
  };
  
  const handleMouseLeave = () => {
    setHoverOpacity(0);
    setHovered(false);
  };

  return (
    <div className="relative size-full " >
      <video
        src={src}
        loop
        muted
        autoPlay
        playsInline
        className="absolute left-0 top-0 size-full object-cover object-center opacity-50"
      />
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1
            className={`bento-title transition-transform duration-200 ${
              hovered ? "scale-105 text-orange-300 drop-shadow-lg" : ""
            }`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <AnimatedWord text={title}  />
          </h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">
              <AnimatedWord text={description} delay={0.3} />
            </p>
          )}
        </div>
        {isComingSoon && (
          <div
            ref={hoverButtonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase transition-all duration-200 ${
              hoverOpacity ? "scale-105 text-violet-300" : "text-white/20"
            }`}
            style={{
              boxShadow: hoverOpacity ? "0 4px 24px 0 #5724ff44" : "none",
            }}
          >
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
              }}
            />
            <TiLocationArrow className="relative z-20" />
            <p className="relative z-20">
              <AnimatedWord text="View Details" scramble={hoverOpacity > 0} />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Services Component with Responsive Zoom ---
const Services = () => {
  const sectionRef = useRef(null);
  const sectionWrapperRef = useRef(null);
  const whatWeDoRef = useRef(null);
  const scrollDownRef = useRef(null);
  const scrollDownZoomRef = useRef(null);
  
  const [showTargetCursor, setShowTargetCursor] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

   // AnimatedWord with forwardRef for better performance
  const ForwardedAnimatedWord = React.forwardRef((props, ref) => (
  <span ref={ref}>
    <AnimatedWord {...props} />
  </span>
));
 

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Performance check
  const canHandleComplexAnimations = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  };

  // Cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const isInHero = 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom;

      setShowTargetCursor(isInHero);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Main animations
    useGSAP(() => {
    // Existing animations
    gsap.utils.toArray(".bento-tilt_1").forEach((el, index) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 100, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          delay: index * 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: "top 60%",
            scrub: true,
          },
        }
      );
    });

    gsap.utils.toArray(".animated-title-word").forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          delay: i * 0.15,
          ease: "power2.out",
        }
      );
    });

      if (!canHandleComplexAnimations()) {
    // Simple fade for low-end devices
    gsap.to(sectionRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "bottom bottom",
        end: "+=200",
        scrub: true,
      },
      opacity: 0,
      y: -50,
    });
    return;
  }

  // Animation config based on device
  const animationConfig = {
    mobile:   { zoomScale: 2.2, duration: 0.6, scrollDistance: 300 },
    tablet:   { zoomScale: 3.2, duration: 0.8, scrollDistance: 500 },
    desktop:  { zoomScale: 4.2, duration: 1,   scrollDistance: 700 }
  };
  const config = isMobile ? animationConfig.mobile : isTablet ? animationConfig.tablet : animationConfig.desktop;

  // ScrollTrigger for the overlay zoom
  const zoomTl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "bottom bottom",
      end: `+=${config.scrollDistance}`,
      scrub: 1,
      pin: false, // <--- No pinning!
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (self.progress > 0.05 && scrollDownZoomRef.current) {
          scrollDownZoomRef.current.style.display = 'flex';
        }
      },
      onLeave: () => {
        if (scrollDownZoomRef.current) scrollDownZoomRef.current.style.display = 'none';
      },
      onLeaveBack: () => {
        if (scrollDownZoomRef.current) scrollDownZoomRef.current.style.display = 'none';
      }
    }
  });

  zoomTl
    .to(scrollDownZoomRef.current.querySelector('h2'), {
      scale: config.zoomScale,
      opacity: 1,
      duration: config.duration,
      ease: "power2.in"
    })
    .to(scrollDownZoomRef.current.querySelector('h2'), {
      opacity: 0,
      filter: "blur(20px)",
      duration: config.duration * 0.3,
    }, `-=${config.duration * 0.2}`);

  // Clean up
  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}, [isMobile, isTablet]);

  // Initial section animation
  useEffect(() => {
    gsap.fromTo(sectionRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      }
    );
  }, []);
 
  return (
    <>
      
      <div 
        ref={sectionWrapperRef} 
        className="relative overflow-hidden"
        style={{
          maxWidth: '100vw',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        {showTargetCursor && (
          <TargetCursor
            spinDuration={2}
            hideDefaultCursor={true}
            targetSelector=".bento-tilt_1, .bento-tilt_2, .bento-title, .animated-title-word, aboutTitle, aboutPara"
          />
        )}
        
        <section
          ref={sectionRef}
          className=" bg-gradient-to-br from-black via-gray-900 to-neutral-800 text-white  duration-700 pb-12 md:pb-32 lg:pb-52 "
          style={{ 
          
            minHeight: isMobile ? '100vh' : 'auto',
            contain: 'layout',
            transform: 'translateZ(0)',
            isolation: 'isolate',
            
          }}
          
        >
          {/* Sticky header */}
          <div className="sticky top-0 z-30 bg-transparent backdrop-blur-md">
          
            <div className="container mx-auto px-3 md:px-10">
              <div 
                ref={whatWeDoRef}
                className="min-h-screen flex items-center justify-center px-5"
              >
                <div
                  
                    onMouseEnter={() => setShowTargetCursor(true)}
                  onMouseLeave={() => setShowTargetCursor(false)}
                  
                  
                  className="w-full flex flex-col items-center mx-auto text-center">
                  <h1 
                  
                    className=" aboutTitle font-general text-5xl md:text-7xl xl:text-8xl xl:text-[180px] text-white mb-8">
                    Our Work
                  </h1>
                  <p 
                    onMouseEnter={() => setShowTargetCursor(true)}
                    onMouseLeave={() => setShowTargetCursor(false)}
                    className=" aboutPara font-robert-regular text-lg md:text-xl lg:text-2xl xl:text-3xl text-balance text-white/70 leading-relaxed">
                    At Vidana Consulting, we empower businesses to evolve faster and operate smarter.
                    Our multidisciplinary expertise spans business strategy, digital innovation, and advanced automation.
                    From stabilizing operations to driving full-scale digital transformation, we deliver scalable,
                    intelligent solutions that align with your mission and future goals. Whether you're adopting AI,
                    modernizing legacy systems, or launching new technologies—we're your partner in building what's next.
                  </p>
                </div>
              </div>
            </div>
            
          </div>

          {/* Features grid */}
          <div id="services" className="container mx-auto px-3 md:px-10">
            
           <SplitText
  text="How We Help"
              className="flex justify-center  items-center text-2xl sm:text-4xl md:text-5xl lg:text-7xl 
  xl:text-9xl font-general text-white mb-8 text-center  "
  delay={100}
  duration={0.6}
  ease="elastic.out(1, 0.3)"
  splitType="chars"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="center"

/>
            {/* Main Feature Card */}
            <BentoTilt
              id="serviceCard"
              className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh] bento-tilt_1"
            >
              <BentoCard
                src="videos/feature-1.mp4"
                title="Implementing and Supporting SAP and Non-SAP Applications"
                description="Our end-to-end implementation and support services ensure your enterprise systems—SAP or otherwise—are robust, scalable, and always aligned with your evolving goals. We don't just deploy software; we drive measurable business value."
                isComingSoon
              />
            </BentoTilt>

            {/* Bento Grid */}
            <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
              <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
                <BentoCard
                  src="videos/feature-2.mp4"
                  title="Artificial Intelligence"
                  description="From ideation to launch, we build intelligent products powered by AI—enhancing decision-making, automation, and innovation for next-gen solutions across industries."
                  isComingSoon
                />
              </BentoTilt>

              <BentoTilt className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
                <BentoCard
                  src="videos/feature-3.mp4"
                  title="Digital Transformations"
                  description="We digitize enterprises end-to-end by integrating cutting-edge technologies like AI, IoT, RFID, and mobile apps. From online storefronts to smart logistics, we create intelligent ecosystems that drive growth."
                  isComingSoon
                />
              </BentoTilt>

              <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
                <BentoCard
                  src="videos/feature-4.mp4"
                  title="Business Process Consulting"
                  description="We analyze your core operations, identify inefficiencies, and design strategic improvements. Our advisory and auditing services ensure compliance, streamline workflows, and align processes with long-term business goals."
                  isComingSoon
                />
              </BentoTilt>

              <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
                <BentoCard
                  src="videos/feature-5.mp4"
                  title="Robotic Process Automation"
                  description="We automate repetitive, rule-based tasks using RPA, freeing up your human workforce to focus on higher-value activities—delivering greater accuracy, speed, and scalability."
                  isComingSoon
                />
              </BentoTilt>

              <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
                <div className="flex size-full flex-col justify-between bg-violet-300 p-5">
                  <h1 className="bento-title special-font max-w-64 hover:scale-110 transition-transform duration-200">
                    <ForwardedAnimatedWord
  ref={scrollDownRef}
  text="Scroll down"
  delay={0.1}
  scramble={true}
  className="animated-title-word"
/>
                  </h1>
                  <TiLocationArrow className="m-5 scale-[5] self-end" />
                </div>
              </BentoTilt>
            </div>
          </div>
        </section>

        {/* Zoom overlay container */}
        <div
  ref={scrollDownZoomRef}
  className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
  style={{
    display: 'none',
    background: 'radial-gradient(circle, transparent 0%, rgba(0,0,0,0.4) 100%)'
  }}
>
  <h2
    className="text-white font-bold text-center px-4"
    style={{
      fontSize: 'clamp(3rem, 10vw, 8rem)',
      lineHeight: 1.2,
      opacity: 0,
      scale: 0.5,
      textShadow: '0 0 40px rgba(139, 92, 246, 0.5)',
    }}
  >
    Scroll Down
  </h2>
</div>
      </div>
    </>
  );
};

export default Services;