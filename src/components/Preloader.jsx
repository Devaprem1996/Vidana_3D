import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Matter from "matter-js";

const Preloader = ({ onFinish }) => {
  const [loading, setLoading] = useState(true);
  const [canPlaySound, setCanPlaySound] = useState(false);
  const preloaderRef = useRef(null);
  const canvasRef = useRef(null);

  // Wait for user interaction to allow sound
  useEffect(() => {
    const enableSound = () => setCanPlaySound(true);
    window.addEventListener("pointerdown", enableSound, { once: true });
    return () => window.removeEventListener("pointerdown", enableSound);
  }, []);

  // Play sound when loading ends and user has interacted
  const playSound = () => {
    if (canPlaySound) {
      const audio = new Audio("/success.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  };

  // Matter.js particles
  useEffect(() => {
    const width = 400, height = 400;
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
      },
    });

    // Create particles
    const particles = Array.from({ length: 30 }).map(() =>
      Matter.Bodies.circle(
        width / 2,
        height / 2,
        Math.random() * 8 + 4,
        {
          render: {
            fillStyle: `hsl(${Math.random() * 360}, 80%, 60%)`,
          },
          frictionAir: 0.02,
        }
      )
    );

    Matter.World.add(engine.world, particles);

    // Burst effect
    setTimeout(() => {
      particles.forEach((p) => {
        Matter.Body.applyForce(
          p,
          p.position,
          {
            x: (Math.random() - 0.5) * 0.08,
            y: (Math.random() - 0.5) * 0.08,
          }
        );
      });
    }, 500);

    // Use Runner API (no deprecated warnings)
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Clean up
    return () => {
      Matter.Render.stop(render);
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
      Matter.Runner.stop(runner);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  // GSAP zoom in/fade out
  useEffect(() => {
    gsap.fromTo(
      preloaderRef.current,
      { scale: 0.7, opacity: 1 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }
    );

    // Simulate loading, then fade out
    const timer = setTimeout(() => {
      gsap.to(preloaderRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onStart: playSound,
        onComplete: () => {
          setLoading(false);
          onFinish();
        },
      });
    }, 2600);

    return () => clearTimeout(timer);
  }, [onFinish, canPlaySound]);

  if (!loading) return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        // 3D dark background with radial light
        background: `
          radial-gradient(ellipse at 50% 40%, #2e3a5a 0%, #10131a 80%, #05070a 100%)
        `,
        boxShadow: "0 0 80px 10px #1e293b inset",
      }}
    >
      <div className="relative flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ zIndex: 1 }}
        />
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.7)] relative z-10 tracking-widest">
          VIDANA
        </h1>
        <p className="mt-4 text-lg text-blue-200 z-10 font-semibold tracking-wider">Consulting</p>
      </div>
      <div className="mt-10 w-48 h-2 bg-blue-900/40 rounded-full overflow-hidden">
        <div className="h-full bg-blue-400/90 animate-pulse w-1/2"></div>
      </div>
      {!canPlaySound && (
        <div className="absolute bottom-8 text-xs text-blue-200/70 text-center px-4">
          Tap or click anywhere to enable sound
        </div>
      )}
    </div>
  );
};

export default Preloader;