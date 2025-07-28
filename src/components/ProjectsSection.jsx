import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Matter from 'matter-js';

gsap.registerPlugin(ScrollTrigger);

const ProjectsSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const blurRefs = useRef([]);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const projects = [
    {
      id: 1,
      title: "Vanilla",
      category: "Clean and Minimal",
      image: "/img/site-1.jpg",
      link: "https://readdy.link/share/d42e76fd3787b213622c219d15fe3ae2"
    },
    {
      id: 2,
      title: "Vibrant",
      category: "Bold and Colorful UI",
      image: "/img/site-2.jpg",
      link: "https://readdy.link/share/e7ac8d56edb6cf81d860ec506f6492ce"
    },
    {
      id: 3,
      title: "Animated",
      category: "Dynamic Motion Effects",
      image: "/img/site-3.jpg",
      link: "https://readdy.link/share/ec5e73c0056b3e9da7ea7ba05a9bbce0"
    },
    {
      id: 4,
      title: "Animations",
      category: "More Animation Techniques",
      image: "/img/site-4.PNG",
      link: "https://vidana-consulting.netlify.app/"
    },
  ];

  // Handle blur animation on hover
  const handleHover = (index) => {
    const el = blurRefs.current[index];
    if (el) {
      el.classList.remove('blur-on-hover');
      void el.offsetWidth;
      el.classList.add('blur-on-hover');
    }
  };

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
      });

      cardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            y: 50,
            opacity: 0,
            duration: 1,
            delay: i * 0.1,
            ease: 'power2.out',
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Enhanced 3D Matter.js Particles
  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // Create engine with custom gravity
    const engine = Matter.Engine.create();
    engine.world.gravity.y = -0.05; // Very gentle upward float
    engine.world.gravity.x = 0;

    // Custom render with enhanced visuals
    const render = Matter.Render.create({
      element: container,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio || 1,
      },
    });

    // Dark color palette with gradients
    const darkColors = [
      { main: '#1a1a2e', shadow: '#0f0f1e', glow: 'rgba(26, 26, 46, 0.3)' },
      { main: '#16213e', shadow: '#0c1524', glow: 'rgba(22, 33, 62, 0.3)' },
      { main: '#0f3460', shadow: '#081d3d', glow: 'rgba(15, 52, 96, 0.3)' },
      { main: '#533483', shadow: '#3a2461', glow: 'rgba(83, 52, 131, 0.3)' },
      { main: '#e94560', shadow: '#b8354a', glow: 'rgba(233, 69, 96, 0.3)' },
      { main: '#2d2d2d', shadow: '#1a1a1a', glow: 'rgba(45, 45, 45, 0.3)' },
    ];

    // Create complex particle system
    const particles = [];
    const particleCount = 35;
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = height + Math.random() * 300;
      const size = Math.random() * 20 + 15; // 15-35px for 3D effect
      const colorSet = darkColors[Math.floor(Math.random() * darkColors.length)];
      const sides = Math.floor(Math.random() * 3) + 5; // 5-7 sided polygons
      
      // Create main particle
      const particle = Matter.Bodies.polygon(x, y, sides, size, {
        restitution: 0.7,
        friction: 0.001,
        density: 0.0001,
        frictionAir: 0.008,
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.02,
        render: {
          fillStyle: colorSet.main,
          strokeStyle: colorSet.shadow,
          lineWidth: 2,
          opacity: 0.9
        }
      });

      // Store color info for custom rendering
      particle.colorSet = colorSet;
      particle.baseSize = size;
      particle.zIndex = Math.random(); // For 3D layering effect
      
      particles.push(particle);
      Matter.World.add(engine.world, particle);
    }

    // Sort particles by z-index for depth
    particles.sort((a, b) => a.zIndex - b.zIndex);

    // Custom render loop for 3D effects
    const customRender = () => {
      const context = render.canvas.getContext('2d');
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        const { position, angle } = particle;
        const scale = 0.7 + particle.zIndex * 0.3; // Depth scaling
        const opacity = 0.4 + particle.zIndex * 0.6; // Depth opacity

        context.save();
        context.translate(position.x, position.y);
        context.rotate(angle);
        context.scale(scale, scale);

        // Draw shadow/glow
        context.shadowColor = particle.colorSet.glow;
        context.shadowBlur = 20 * scale;
        context.shadowOffsetX = 5 * scale;
        context.shadowOffsetY = 5 * scale;

        // Draw particle
        context.fillStyle = particle.colorSet.main;
        context.strokeStyle = particle.colorSet.shadow;
        context.lineWidth = 2;
        context.globalAlpha = opacity;

        // Create path for polygon
        const vertices = particle.vertices;
        context.beginPath();
        context.moveTo(vertices[0].x - position.x, vertices[0].y - position.y);
        for (let i = 1; i < vertices.length; i++) {
          context.lineTo(vertices[i].x - position.x, vertices[i].y - position.y);
        }
        context.closePath();
        context.fill();
        context.stroke();

        // Inner glow effect
        const gradient = context.createRadialGradient(0, 0, 0, 0, 0, particle.baseSize);
        gradient.addColorStop(0, particle.colorSet.glow);
        gradient.addColorStop(1, 'transparent');
        context.fillStyle = gradient;
        context.fill();

        context.restore();
      });
    };

    // Override default render
    Matter.Events.on(render, 'afterRender', customRender);

    // Run the engine
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Mouse interaction for 3D effect
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      // Apply force based on mouse position
      particles.forEach((particle) => {
        const dx = mouseRef.current.x - particle.position.x;
        const dy = mouseRef.current.y - particle.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150 * 0.0001;
          Matter.Body.applyForce(particle, particle.position, {
            x: -dx * force * particle.zIndex,
            y: -dy * force * particle.zIndex
          });
        }
      });
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Particle recycling with 3D effect
    const updateParticles = () => {
      particles.forEach(particle => {
        // Recycle particles that float off screen
        if (particle.position.y < -100) {
          Matter.Body.setPosition(particle, {
            x: Math.random() * width,
            y: height + 100
          });
          Matter.Body.setVelocity(particle, {
            x: (Math.random() - 0.5) * 1,
            y: -Math.random() * 2
          });
        }

        // Add subtle horizontal drift based on depth
        Matter.Body.applyForce(particle, particle.position, {
          x: Math.sin(Date.now() * 0.001 + particle.zIndex * Math.PI) * 0.00001,
          y: 0
        });
      });
    };

    const animationLoop = setInterval(updateParticles, 50);

    // Handle resize
    const handleResize = () => {
      const newWidth = container.offsetWidth;
      const newHeight = container.offsetHeight;
      
      render.canvas.width = newWidth;
      render.canvas.height = newHeight;
      render.options.width = newWidth;
      render.options.height = newHeight;
      render.bounds.max.x = newWidth;
      render.bounds.max.y = newHeight;
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearInterval(animationLoop);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      Matter.Events.off(render, 'afterRender', customRender);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-screen bg-white text-black px-5 md:px-[5vw] py-24 md:py-32 overflow-hidden"
        >
            {/* Enhanced styles for blur animation and 3D effects */}
            <style>
                {`
          @keyframes hover-blur {
            0% {
              backdrop-filter: blur(0px) brightness(1);
              filter: blur(0px);
              transform: translateZ(0);
            }
            50% {
              backdrop-filter: blur(12px) brightness(0.95);
              filter: blur(0.5px);
              transform: translateZ(10px);
            }
            100% {
              backdrop-filter: blur(0px) brightness(1);
              filter: blur(0px);
              transform: translateZ(0);
            }
          }

          .blur-on-hover {
            animation: hover-blur 3s ease-in-out;
            transform-style: preserve-3d;
          }

          .particle-canvas {
            filter: contrast(1.1) brightness(0.9);
            mix-blend-mode: multiply;
          }
        `}
            </style>

            {/* 3D Particles Canvas */}
            <div
                ref={canvasRef}
                className="particle-canvas absolute inset-0 pointer-events-auto"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1,
                    opacity: 0.7
                }}
            />

            {/* Content wrapper */}
            <div className="relative z-10">
                {/* Title with 3D text effect */}
                <div className="w-fit mb-16 md:mb-[8vh]">
                    <h1
                        ref={titleRef}
                        className="inline-block text-[17vw] leading-none font-normal overflow-hidden -ml-[1vw]"
                        style={{
                            textShadow: '2px 2px 4px rgba(0,0,0,0.1), -1px -1px 2px rgba(255,255,255,0.5)'
                        }}
                    >
                        <span className="block">Projects</span>
                    </h1>
                </div>

                {/* Projects grid */}
                <div className="grid grid-cols-6 md:grid-cols-12 gap-[4vw] md:gap-[2vw] w-full">
                    {projects.map((project, index) => (
                        <a
                            key={project.id}
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative col-span-6 cursor-pointer group block transform transition-all duration-500 hover:scale-[1.02]"
                            ref={(el) => {
                                cardsRef.current[index] = el;
                                blurRefs.current[index] = el;
                            }}
                            onMouseEnter={() => handleHover(index)}
                            style={{
                                transformStyle: 'preserve-3d',
                                perspective: '1000px'
                            }}
                        >
                            <div className="relative overflow-hidden rounded-[15px] md:rounded-[20px] bg-white/5 backdrop-blur-sm shadow-2xl">
                                {/* Image */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                                </div>

                                {/* Info with gradient */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                                    <p className="text-white/70 text-sm mb-2">{project.category}</p>
                                    <h3 className="text-white text-2xl md:text-3xl font-normal">
                                        {project.title}
                                          </h3>
                </div>

                {/* Hover icon */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                  <svg
                    className="w-5 h-5 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>

              {/* Project meta */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">0{index + 1}</span>
                <span className="text-sm text-gray-400">View Project →</span>
              </div>
            </a>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-16 md:mt-[8vh] text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300 shadow-lg">
            <span>Projects Coming Soon</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;