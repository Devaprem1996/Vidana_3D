import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const NotFound404 = () => {
  const textRef = useRef(null);
  const mascotRef = useRef(null);

  // GSAP infinite loop effect on 404 text
  useEffect(() => {
    gsap.to(textRef.current, {
      scale: 1.08,
      rotate: 6,
      yoyo: true,
      repeat: -1,
      duration: 1.2,
      ease: "power1.inOut",
    });
    // Mascot bobbing and waving
    gsap.to(mascotRef.current, {
      y: -20,
      rotate: 8,
      yoyo: true,
      repeat: -1,
      duration: 1.4,
      ease: "sine.inOut",
    });
  }, []);

  // Particle config
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesOptions = {
    fullScreen: { enable: false },
    background: { color: "#10131a" },
    fpsLimit: 60,
    particles: {
      number: { value: 12, density: { enable: true, value_area: 800 } },
      color: { value: ["#3B82F6", "#EC4899", "#F59E0B", "#22C55E"] },
      shape: { type: "circle" },
      opacity: { value: 0.7, random: true },
      size: { value: 60, random: { enable: true, minimumValue: 24 } },
      move: {
        enable: true,
        speed: 1.2,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "out" },
        attract: { enable: false },
      },
    },
    detectRetina: true,
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#10131a] overflow-hidden">
      {/* Particles */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
          style={{ position: "absolute" }}
        />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        <div
          ref={textRef}
          className="text-[18vw] leading-none font-extrabold text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.7)] select-none"
          style={{
            textShadow: "0 0 40px #3B82F6, 0 0 80px #EC4899",
            letterSpacing: "-0.05em",
          }}
        >
          404
        </div>
        {/* Mascot SVG */}
        <div ref={mascotRef} className="my-4 w-32 md:w-40">
          <svg viewBox="0 0 128 128" fill="none" className="w-full h-auto">
            <ellipse cx="64" cy="110" rx="40" ry="10" fill="#222" opacity="0.2"/>
            <rect x="34" y="40" width="60" height="50" rx="20" fill="#3B82F6" />
            <ellipse cx="54" cy="65" rx="6" ry="8" fill="#fff"/>
            <ellipse cx="74" cy="65" rx="6" ry="8" fill="#fff"/>
            <ellipse cx="54" cy="67" rx="2" ry="3" fill="#222"/>
            <ellipse cx="74" cy="67" rx="2" ry="3" fill="#222"/>
            <rect x="58" y="80" width="12" height="4" rx="2" fill="#fff"/>
            <rect x="44" y="30" width="40" height="16" rx="8" fill="#60A5FA"/>
            <rect x="38" y="90" width="8" height="18" rx="4" fill="#EC4899"/>
            <rect x="82" y="90" width="8" height="18" rx="4" fill="#F59E0B"/>
            <circle cx="44" cy="38" r="3" fill="#fff"/>
            <circle cx="84" cy="38" r="3" fill="#fff"/>
            <rect x="60" y="18" width="8" height="16" rx="4" fill="#22C55E"/>
          </svg>
        </div>
        <div className="text-2xl md:text-3xl text-blue-200 font-semibold text-center">
          Oops! Page not found.
        </div>
        <div className="mt-2 text-base md:text-lg text-blue-300 text-center max-w-xl">
          The page you are looking for doesn&apos;t exist or has been moved.
        </div>
        <a
          href="/"
          className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg transition-all duration-200"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default NotFound404;