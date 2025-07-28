// MillionDollarScrollbar.jsx
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MillionDollarScrollbar = ({ sections }) => {
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const sectionsRef = useRef([]);
  const labelsRef = useRef([]);
  const magnetRef = useRef(null);
  const percentRef = useRef(null);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Font setup
  useEffect(() => {
    // Load Inter font from Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    // Device detection
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    const ctx = gsap.context(() => {
      // Entrance animation (no 3D, no glow)
      gsap.fromTo(containerRef.current,
        { opacity: 0, x: isMobile ? 30 : 60 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", delay: 0.2 }
      );

      // Progress bar animation (no glow)
      gsap.to(progressRef.current, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          onUpdate: (self) => {
            setScrollPercent(Math.round(self.progress * 100));
          },
        },
      });

      // Section indicators (no 3D, no glow)
      sectionsRef.current.forEach((dot, index) => {
        if (!dot) return;
        ScrollTrigger.create({
          trigger: document.getElementById(sections[index].id),
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            setActiveSection(index);
            gsap.to(dot, {
              scale: 1.4,
              backgroundColor: sections[index].color || "var(--color-blue-600)",
              duration: 0.3,
              ease: "power2.out",
            });
            if (!isMobile && labelsRef.current[index]) {
              gsap.to(labelsRef.current[index], {
                opacity: 1,
                x: -8,
                scale: 1,
                duration: 0.2,
                ease: "power2.out",
              });
            }
          },
          onLeaveBack: () => {
            gsap.to(dot, {
              scale: 1,
              backgroundColor: "var(--color-gray-400)",
              duration: 0.2,
            });
            if (!isMobile && labelsRef.current[index]) {
              gsap.to(labelsRef.current[index], {
                opacity: 0,
                x: 12,
                scale: 0.9,
                duration: 0.2,
              });
            }
          },
          onLeave: () => {
            if (index < sections.length - 1) {
              gsap.to(dot, {
                scale: 1,
                backgroundColor: "var(--color-gray-400)",
                duration: 0.2,
              });
            }
          },
          onEnterBack: () => {
            setActiveSection(index);
            gsap.to(dot, {
              scale: 1.4,
              backgroundColor: sections[index].color || "var(--color-blue-600)",
              duration: 0.2,
            });
          },
        });
      });

      // Magnetic effect on hover (desktop only, optional)
      if (!isMobile && !isTablet) {
        const handleMouseMove = (e) => {
          const rect = containerRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(magnetRef.current, { x: x * 0.05, y: y * 0.05, duration: 0.2 });
        };
        const handleMouseLeave = () => {
          gsap.to(magnetRef.current, { x: 0, y: 0, duration: 0.3 });
        };
        containerRef.current?.addEventListener("mousemove", handleMouseMove);
        containerRef.current?.addEventListener("mouseleave", handleMouseLeave);
        return () => {
          containerRef.current?.removeEventListener("mousemove", handleMouseMove);
          containerRef.current?.removeEventListener("mouseleave", handleMouseLeave);
        };
      }
    });

    return () => {
      ctx.revert();
      window.removeEventListener("resize", checkDevice);
    };
  }, [sections, isMobile, isTablet]);

  // Scroll activity detection
  useEffect(() => {
    let scrollTimeout;
    
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  

  // Mobile menu toggle
  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  // Mobile version
  if (isMobile) {
    return (
      <>
        {/* Mobile Toggle Button */}
        <button
          onClick={toggleMobileMenu}
          className="fixed hidden bottom-6 right-6 z-50 w-14 h-14 bg-[var(--color-gray-900)] rounded-full items-center justify-center"
        >

        </button>

        
  
      </>
    );
  }

  // Desktop/Tablet version
  return (
    <div
      ref={containerRef}
      className={`fixed ${isTablet ? 'right-4' : 'right-8'} top-1/2 transform -translate-y-1/2 z-50`}
      style={{ perspective: "none" }}
      onMouseEnter={() => !isTablet && setIsHovered(true)}
      onMouseLeave={() => !isTablet && setIsHovered(false)}
    >
      <div ref={magnetRef} className="relative">
        {/* Scroll Percentage Display */}
        <div
          ref={percentRef}
          className={`absolute -top-12 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
            isHovered || isTablet ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <div className="bg-[var(--color-gray-900)] px-3 py-1 rounded-full">
            <span className="text-white text-sm">{scrollPercent}%</span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="relative mb-6">
          <div className={`relative ${isTablet ? 'w-2 h-60' : 'w-3 h-80'} bg-[var(--color-gray-700)] rounded-full overflow-hidden`}>
            {/* Animated Progress Fill */}
            <div
              ref={progressRef}
              className="absolute bottom-0 w-full bg-[var(--color-blue-600)]"
              style={{
                height: "0%",
                transition: "height 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MillionDollarScrollbar;