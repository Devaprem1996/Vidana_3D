// components/Particles.jsx
import { useEffect, useRef, useState } from "react";
import { Renderer, Camera, Geometry, Program, Mesh } from "ogl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const defaultColors = ["#ffffff", "#ffffff", "#ffffff"];

const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  const int = parseInt(hex, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  uniform float uScrollProgress;
  uniform vec2 uMouse;
  uniform float uMouseInfluence;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    // Mouse influence on particles
    vec2 mouseOffset = uMouse * uMouseInfluence;
    pos.x += mouseOffset.x * (1.0 - abs(position.z)) * 2.0;
    pos.y += mouseOffset.y * (1.0 - abs(position.z)) * 2.0;
    
    // Add scroll-based movement
    float scrollEffect = uScrollProgress * 2.0;
    pos.x += sin(random.x * 6.28) * scrollEffect;
    pos.y += cos(random.y * 6.28) * scrollEffect;
    pos.z += sin(random.z * 6.28) * scrollEffect * 0.5;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    
    vec4 mvPos = viewMatrix * mPos;
    
    // Dynamic size based on scroll
    float sizeMultiplier = 1.0 + uScrollProgress * 0.5;
    gl_PointSize = (uBaseSize * sizeMultiplier * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  uniform float uScrollProgress;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    
    // Dynamic opacity based on scroll
    float opacity = 1.0 - uScrollProgress * 0.3;
    
    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), opacity);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8 * opacity;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

const Particles = ({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 500,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  className,
  enableScrollEffects = true,
  performanceMode = "auto",
}) => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);
  const [devicePerformance, setDevicePerformance] = useState("high");
  const rendererRef = useRef(null);
  const programRef = useRef(null);

  // Performance detection
  useEffect(() => {
    const detectPerformance = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isLowEndDevice = navigator.hardwareConcurrency <= 4;
      const hasLowMemory = performance.memory && 
        performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit > 0.7;
      
      if (performanceMode !== "auto") {
        setDevicePerformance(performanceMode);
        return;
      }

      if (isMobile || isLowEndDevice || hasLowMemory) {
        setDevicePerformance("low");
      } else if (navigator.hardwareConcurrency <= 8) {
        setDevicePerformance("medium");
      } else {
        setDevicePerformance("high");
      }
    };

    detectPerformance();
  }, [performanceMode]);

  // Adjust settings based on performance
  const getOptimizedSettings = () => {
    switch (devicePerformance) {
      case "low":
        return {
          count: Math.min(particleCount, 100),
          size: particleBaseSize * 0.8,
          speedMultiplier: 0.5,
          enableRotation: false,
        };
      case "medium":
        return {
          count: Math.min(particleCount, 200),
          size: particleBaseSize * 0.9,
          speedMultiplier: 0.8,
          enableRotation: !disableRotation,
        };
      case "high":
      default:
        return {
          count: particleCount,
          size: particleBaseSize,
          speedMultiplier: 1,
          enableRotation: !disableRotation,
        };
    }
  };

  const optimizedSettings = getOptimizedSettings();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ 
      depth: false, 
      alpha: true,
      antialias: devicePerformance === "high",
      dpr: devicePerformance === "high" ? window.devicePixelRatio : 1,
    });
    rendererRef.current = renderer;
    
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener("resize", resize, false);
    resize();

    // Fixed mouse move handler
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseRef.current = { x, y };
    };

    // Handle both container and window mouse events for better tracking
    if (moveParticlesOnHover) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseenter", handleMouseMove);
      container.addEventListener("mouseleave", () => {
        targetMouseRef.current = { x: 0, y: 0 };
      });
      
      // Also track mouse when it's near the container
      window.addEventListener("mousemove", (e) => {
        const rect = container.getBoundingClientRect();
        const margin = 100; // pixels outside container to still track
        
        if (e.clientX >= rect.left - margin && 
            e.clientX <= rect.right + margin && 
            e.clientY >= rect.top - margin && 
            e.clientY <= rect.bottom + margin) {
          handleMouseMove(e);
        }
      });
    }

    // Scroll trigger setup
    let scrollTriggerInstance;
    if (enableScrollEffects) {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
        }
      });
    }

    const count = optimizedSettings.count;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

    for (let i = 0; i < count; i++) {
      let x, y, z, len;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors.set(col, i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: optimizedSettings.size },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 },
        uScrollProgress: { value: 0 },
        uMouse: { value: [0, 0] },
        uMouseInfluence: { value: particleHoverFactor },
      },
      transparent: true,
      depthTest: false,
    });
    programRef.current = program;

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId;
    let lastTime = performance.now();
    let elapsed = 0;
    let frameCount = 0;

    const update = (t) => {
      animationFrameId = requestAnimationFrame(update);
      
      // Frame skipping for low performance devices
      if (devicePerformance === "low") {
        frameCount++;
        if (frameCount % 2 !== 0) return;
      }

      const delta = t - lastTime;
      lastTime = t;
      elapsed += delta * speed * optimizedSettings.speedMultiplier;

      program.uniforms.uTime.value = elapsed * 0.001;
      
      // Update scroll progress
      if (enableScrollEffects) {
        program.uniforms.uScrollProgress.value = scrollProgressRef.current;
      }

      // Smooth mouse movement with lerp
      if (moveParticlesOnHover) {
        mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.1;
        mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.1;
        
        // Update mouse uniform for shader
        program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y];
      }

      if (optimizedSettings.enableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particles.rotation.z += 0.01 * speed * optimizedSettings.speedMultiplier;
      }

      renderer.render({ scene: particles, camera });
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resize);
      if (moveParticlesOnHover) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseMove);
      }
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      cancelAnimationFrame(animationFrameId);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
  }, [
    optimizedSettings.count,
    particleSpread,
    speed,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    optimizedSettings.size,
    sizeRandomness,
    cameraDistance,
    optimizedSettings.enableRotation,
    devicePerformance,
    enableScrollEffects,
    optimizedSettings.speedMultiplier,
  ]);

  return (
    <div
      ref={containerRef}
      className={`particles-container ${className}`}
      data-performance={devicePerformance}
      style={{ pointerEvents: moveParticlesOnHover ? 'auto' : 'none' }}
    >
      
    </div>
  );
};

export default Particles;