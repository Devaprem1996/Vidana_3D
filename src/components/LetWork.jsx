import { useState, useEffect, useRef } from 'react'
import ResponsiveColorfulStressAdvanced from "./Backgounds/ResponsiveColorfulStressAdvanced"
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import ScrollVelocity from './Scrolls/ScrollVelocity'


// Register GSAP plugin
gsap.registerPlugin(SplitText);

const LetWork = () => {
  const [activeScheme, setActiveScheme] = useState('light');
  const [isVisible, setIsVisible] = useState(false);
  const [sensitivity, setSensitivity] = useState(1.5);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const colorSchemes = {
    light: ['#E0E0E0', '#D0D0D0', '#C0C0C0', '#B0B0B0', '#A0A0A0'],
    minimal: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7'],
    pastel: ['#FFB6C1', '#FF69B4', '#FF1493', '#FF1493', '#C71585'],
    monochrome: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'],
    neutral: ['#795548', '#8D6E63', '#A1887F', '#BCAAA4', '#D7CCC8'],
    blue: ['#0000FF', '#3399FF', '#66CCFF', '#99CCFF', '#CCE5FF'],
    rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
    neon: ['#FF10F  F', '#00FF00', '#00FFFF', '#FF0000', '#FFFF00'],
    vibrant: ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A1'],
    warm: ['#FF4500', '#FF6347', '#FF7F50     ', '#FF8C00', '#FFA500'],
    cool: ['#1E90FF', '#00CED1', '#20B2AA', '#87CEFA', '#4682B4'],
    earth: ['#8B4513', '#A0522D', '#D2691E', '#CD853F', '#F4A460'],
    custom: [],

  };


  

  
  // Adjust sensitivity based on quality
  
  


  // Configuration for brighter background
  const bgConfig = {
    brightness: 1.2,
    contrast: 0.9,
    opacity: 10 // Increased opacity for a more vibrant look
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // GSAP Text Animation
  useEffect(() => {
    if (!isVisible || !titleRef.current || !subtitleRef.current) return;

    const splitTitle = new SplitText(titleRef.current, { 
      type: "chars, words", 
      linesClass: "split-line" 
    });
    
    const splitSubtitle = new SplitText(subtitleRef.current, { 
      type: "chars, words", 
      linesClass: "split-line" 
    });

    // 3D text animation
    gsap.set(splitTitle.chars, {
      opacity: 0,
      y: 50,
      rotateX: -90,
      transformPerspective: 1000,
      transformOrigin: "50% 50% -50",
    });

    gsap.set(splitSubtitle.chars, {
      opacity: 0,
      y: 50,
      rotateX: -90,
      transformPerspective: 1000,
      transformOrigin: "50% 50% -50",
    });

    gsap.to(splitTitle.chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 1,
      ease: "power3.out",
      stagger: {
        amount: 0.5,
        from: "start"
      }
    });

    gsap.to(splitSubtitle.chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.3,
      stagger: {
        amount: 0.5,
        from: "start"
      }
    });

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(e.currentTarget, {
        rotateY: x * 10,
        rotateX: -y * 10,
        duration: 0.5,
        ease: "power2.out",
        transformPerspective: 1000,
      });
    };

    const handleMouseLeave = (e) => {
      gsap.to(e.currentTarget, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    titleRef.current.addEventListener('mousemove', handleMouseMove);
    titleRef.current.addEventListener('mouseleave', handleMouseLeave);
    subtitleRef.current.addEventListener('mousemove', handleMouseMove);
    subtitleRef.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      splitTitle.revert();
      splitSubtitle.revert();
    };
  }, [isVisible]);

  if (isLoading) {
    return (
      <section className="let-work-section relative h-screen bg-gray-100 flex items-center justify-center">
        <div className="let-work-loader">
          <div className="let-work-loader-dot"></div>
          <div className="let-work-loader-dot"></div>
          <div className="let-work-loader-dot"></div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="let-work-section relative h-screen bg-gray-100 overflow-hidden">
        {/* Full-height Physics Background - Remove pointer-events-none */}
         
       

          <div 
          className="absolute inset-0 z-50" 
          style={{ 
            filter: `brightness(${bgConfig.brightness}) contrast(${bgConfig.contrast})`,
            opacity: bgConfig.opacity 
          }}
        >
          <ResponsiveColorfulStressAdvanced
            colorScheme={"vibrant"}
            customColors={colorSchemes}
              showStats={false}
              showPerformance={false}
              mobileScale={0.9}
              tabletScale={0.95}
              desktopScale={2}
              enableTouch={true}
              enableMouse={true}
              enableGyroscope={true}
              enableShake={true}
              mouseSensitivity={sensitivity * 0.2}
              touchSensitivity={sensitivity * 0.5}
              gyroSensitivity={sensitivity * 0.5}
            particleMode={false}
              heightScale={1}
        
              gravity={2}
              enable3D={true}
              mousewheelSensitivity={sensitivity * 0.4}
              enableTilt={true}
              tiltSensitivity={sensitivity * 0.6}
   />
        </div>

          
          
      
        
        {/* Lighter overlay - with pointer-events-none for hover to work */}
        <div className="absolute inset-0 bg-white/20 z-10 pointer-events-none"></div>
        
        {/* 3D Grid Pattern - with pointer-events-none */}
        <div className="absolute inset-0 let-work-bg-grid-pattern opacity-10 z-20 pointer-events-none"></div>
        
        {/* Content positioned at top for mobile, centered for desktop */}
        <div className="relative z-40 h-full flex flex-col">
          <div className="flex-1 flex items-center sm:items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-0">
            <div className="text-center w-full max-w-6xl mx-auto">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] text-gray-900 mb-4 tracking-tight">
                <span 
                  ref={titleRef}
                  className="block let-work-3d-text cursor-default let-work-mobile-text"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  Let's Work
                </span>
                <span 
                  ref={subtitleRef}
                  className="block let-work-3d-text mt-2 cursor-default let-work-mobile-text"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  Together
                </span>
              </h1>
              <div className="w-20 sm:w-32 md:w-40 h-1 bg-gray-900 mx-auto mt-4 sm:mt-8 transform origin-center let-work-animate-pulse-width"></div>
              
              {/* CTA Button - smaller on mobile */}
              {/*lassName="mt-8 sm:mt-16 ">
                <button className="
                  relative group
                  px-6 sm:px-12 py-2.5 sm:py-4
                  bg-gray-900 text-white
                  text-sm sm:text-lg font-semibold
                  transform transition-all duration-300
                  hover:scale-110
                  let-work-animate-slide-up opacity-0
                  let-work-button-3d
                " style={{ animationDelay: '0.8s' }}>
                  <span className="relative z-10">Start a Project</span>
                  <div className="absolute inset-0 bg-gray-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
            </div>*/}


            </div>
          </div>
          
          {/* Mobile hint - positioned at bottom */}
          <div className="sm:hidden pb-8 px-4">
            <p className="text-center text-xs text-gray-600 opacity-70">
              Drag shapes • Tilt device • Shake to explode
            </p>
          </div>
        </div>

       
        
      </section>

      {/* Scoped styles */}
      <style jsx>{`
        /* Loading animation */
        .let-work-loader {
          display: flex;
          gap: 0.5rem;
        }

        .let-work-loader-dot {
          width: 12px;
          height: 12px;
          background: #333;
          border-radius: 50%;
          animation: let-work-bounce 1.4s ease-in-out infinite both;
        }

        .let-work-loader-dot:nth-child(1) { animation-delay: -0.32s; }
        .let-work-loader-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes let-work-bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        /* Animations */
        @keyframes letWorkFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes letWorkSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes letWorkPulseWidth {
          0%, 100% {
            transform: scaleX(1);
          }
          50% {
            transform: scaleX(1.1);
          }
        }

        .let-work-animate-fadeIn {
          animation: letWorkFadeIn 0.6s ease-out forwards;
        }

        .let-work-animate-slide-up {
          animation: letWorkSlideUp 0.8s ease-out forwards;
        }

        .let-work-animate-pulse-width {
          animation: letWorkPulseWidth 2s ease-in-out infinite;
        }

        /* 3D Grid Background Pattern */
        .let-work-bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          background-position: -1px -1px;
        }

        /* 3D Text Effects */
        .let-work-3d-text {
          text-shadow: 
            1px 1px 0 rgba(0,0,0,0.1),
            2px 2px 0 rgba(0,0,0,0.08),
            3px 3px 0 rgba(0,0,0,0.06),
            4px 4px 0 rgba(0,0,0,0.04),
            5px 5px 10px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
            }

        .let-work-3d-text:hover {
          text-shadow: 
            1px 1px 0 rgba(0,0,0,0.15),
            2px 2px 0 rgba(0,0,0,0.12),
            3px 3px 0 rgba(0,0,0,0.10),
            4px 4px 0 rgba(0,0,0,0.08),
            5px 5px 0 rgba(0,0,0,0.06),
            6px 6px 20px rgba(0,0,0,0.2);
        }

        /* 3D Button */
        .let-work-button-3d {
          box-shadow: 
            0 2px 4px rgba(0,0,0,0.2),
            0 4px 8px rgba(0,0,0,0.15),
            0 8px 16px rgba(0,0,0,0.1);
          transform-style: preserve-3d;
          transition: all 0.3s ease;
        }

        .let-work-button-3d:hover {
          box-shadow: 
            0 4px 8px rgba(0,0,0,0.25),
            0 8px 16px rgba(0,0,0,0.2),
            0 16px 32px rgba(0,0,0,0.15);
          transform: translateY(-2px) rotateX(-5deg);
        }

        .let-work-button-3d:active {
          transform: translateY(0) rotateX(0);
          box-shadow: 
            0 1px 2px rgba(0,0,0,0.2),
            0 2px 4px rgba(0,0,0,0.15);
        }

        /* Custom slider styles */
        .let-work-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #333;
          cursor: pointer;
          border-radius: 50%;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .let-work-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }

        .let-work-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #333;
          cursor: pointer;
          border-radius: 50%;
          border: none;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .let-work-slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .let-work-3d-text {
            text-shadow: 
              1px 1px 0 rgba(0,0,0,0.1),
              2px 2px 0 rgba(0,0,0,0.08),
              3px 3px 5px rgba(0,0,0,0.1);
          }
        }

        /* GSAP Split Text styles */
        .split-line {
          overflow: hidden;
        }
        
}

        /* Ensure proper layering */
        .let-work-section {
          -webkit-tap-highlight-color: transparent;
          position: relative;
          isolation: isolate;
        }

        /* Ensure full height coverage */
        .let-work-section > div:first-child {
          height: 100%;
          width: 100%;
        }
      `}</style>
      
    </>
  );
}

export default LetWork;