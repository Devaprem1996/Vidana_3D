// SimpleCursorEffects.jsx
import React, { useEffect, useRef } from "react";
import "./SimpleCursorEffects.css";

const GlassCursor = () => {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const requestRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const cursorVelocity = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;

    // Mouse move handler
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // Move dot cursor immediately
      if (cursorDot) {
        cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      // Create ripple effect on movement
      createRipple(e.clientX, e.clientY);
    };

    // Smooth animation for outline cursor
    const animateCursor = () => {
      // Calculate smooth following
      const dx = mousePos.current.x - cursorPos.current.x;
      const dy = mousePos.current.y - cursorPos.current.y;
      
      cursorVelocity.current.x = dx * 0.1;
      cursorVelocity.current.y = dy * 0.1;
      
      cursorPos.current.x += cursorVelocity.current.x;
      cursorPos.current.y += cursorVelocity.current.y;

      if (cursorOutline) {
        cursorOutline.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`;
      }

      requestRef.current = requestAnimationFrame(animateCursor);
    };

    // Create ripple effect
    const createRipple = (() => {
      let lastTime = 0;
      const throttleDelay = 50; // Create ripple every 50ms max

      return (x, y) => {
        const currentTime = Date.now();
        if (currentTime - lastTime < throttleDelay) return;
        lastTime = currentTime;

        const ripple = document.createElement("div");
        ripple.className = "cursor-ripple";
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        document.body.appendChild(ripple);

        ripple.addEventListener("animationend", () => {
          ripple.remove();
        });
      };
    })();

    // Mouse down/up handlers
    const handleMouseDown = () => {
      if (cursorDot) cursorDot.classList.add("cursor-clicked");
      if (cursorOutline) cursorOutline.classList.add("cursor-clicked");
    };

    const handleMouseUp = () => {
      if (cursorDot) cursorDot.classList.remove("cursor-clicked");
      if (cursorOutline) cursorOutline.classList.remove("cursor-clicked");
    };

    // Hover handlers for interactive elements
    const handleMouseOver = (e) => {
      if (e.target.matches("a, button, input, textarea, [data-cursor='pointer']")) {
        if (cursorDot) cursorDot.classList.add("cursor-hover");
        if (cursorOutline) cursorOutline.classList.add("cursor-hover");
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.matches("a, button, input, textarea, [data-cursor='pointer']")) {
        if (cursorDot) cursorDot.classList.remove("cursor-hover");
        if (cursorOutline) cursorOutline.classList.remove("cursor-hover");
      }
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    // Start animation
    animateCursor();

    // Hide cursor on mobile
    if ('ontouchstart' in window) {
      if (cursorDot) cursorDot.style.display = "none";
      if (cursorOutline) cursorOutline.style.display = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <>
      <div ref={cursorDotRef} className="cursor-dot" />
      <div ref={cursorOutlineRef} className="cursor-outline" />
      
      {/* SVG Filter for water distortion effect */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="water-distortion">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01"
              numOctaves="2"
              result="turbulence"
            />
            <feDisplacementMap
              in2="turbulence"
              in="SourceGraphic"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
};

export default GlassCursor;