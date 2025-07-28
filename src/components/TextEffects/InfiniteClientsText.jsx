// components/InfiniteClientsText.jsx
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const InfiniteClientsText = ({ 
  speed = 40,
  direction = 'left',
  pauseOnHover = true,
  className = '',
}) => {
  const scrollRef = useRef(null);
  const scrollContentRef = useRef(null);
  const animationRef = useRef(null);

  const clients = [
    'HWASHIN','BEML',"GEBA","SUNGWOO HITECH",
  ];

  useEffect(() => {
    const scrollContent = scrollContentRef.current;
    const scrollContainer = scrollRef.current;
    
    if (!scrollContent || !scrollContainer) return;

    // Clone for seamless loop
    const text = scrollContent.innerHTML;
    scrollContent.innerHTML = text + text;

    // Calculate width
    const totalWidth = scrollContent.scrollWidth / 2;
    
    // Animation
    const tl = gsap.timeline({ repeat: -1 });
    
    if (direction === 'left') {
      gsap.set(scrollContent, { x: 0 });
      tl.to(scrollContent, {
        x: -totalWidth,
        duration: totalWidth / speed,
        ease: 'none',
      });
    } else {
      gsap.set(scrollContent, { x: -totalWidth });
      tl.to(scrollContent, {
        x: 0,
        duration: totalWidth / speed,
        ease: 'none',
      });
    }

    animationRef.current = tl;

    // Hover handlers
    const handleMouseEnter = () => animationRef.current?.pause();
    const handleMouseLeave = () => animationRef.current?.resume();

    if (pauseOnHover) {
      scrollContainer.addEventListener('mouseenter', handleMouseEnter);
      scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      tl.kill();
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [speed, direction, pauseOnHover]);

  return (
    <div className={`relative w-full overflow-hidden bg-[#f9fafc] ${className}`}>
      {/* Gradient masks */}
      <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
      
      <div 
        ref={scrollRef}
        className="py-10 cursor-pointer"
      >
        <div 
          ref={scrollContentRef}
          className="flex items-center gap-16 text-4xl font-zendry text-gray-500"
        >
          {clients.map((client, index) => (
            <span
              key={index}
              className="whitespace-nowrap hover:text-gray-900 transition-colors duration-300"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteClientsText;