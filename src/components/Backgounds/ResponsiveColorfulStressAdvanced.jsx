// components/ResponsiveColorfulStressAdvanced.jsx
import { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';

const ResponsiveColorfulStressAdvanced = ({
  colorScheme = 'vibrant',
  customColors = [],
  enableGyroscope = true,
  enableShake = true,
  particleMode = false,
  heightScale = 1,
}) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const mouseMoveThrottleRef = useRef(null);
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [deviceType, setDeviceType] = useState('desktop');
  const [orientation, setOrientation] = useState('portrait');
  const [fps, setFps] = useState(60);
  const [isShaking, setIsShaking] = useState(false);

  // Performance monitoring
  useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;
    
    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frames * 1000) / (currentTime - lastTime)));
        frames = 0;
        lastTime = currentTime;
      }
      
      animationFrameRef.current = requestAnimationFrame(measureFPS);
    };
    
    measureFPS();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Shake detection for mobile - reduced force
  useEffect(() => {
    if (!enableShake || deviceType === 'desktop') return;

    let lastX = 0, lastY = 0, lastZ = 0;
    let lastTime = Date.now();
    const threshold = 15;

    const handleMotion = (event) => {
      const current = event.accelerationIncludingGravity;
      if (!current) return;

      const currentTime = Date.now();
      const timeDiff = currentTime - lastTime;
      
      if (timeDiff > 100) {
        const deltaX = Math.abs(lastX - current.x);
        const deltaY = Math.abs(lastY - current.y);
        const deltaZ = Math.abs(lastZ - current.z);
        
        if (deltaX + deltaY + deltaZ > threshold) {
          setIsShaking(true);
          if (engineRef.current) {
            const bodies = Matter.Composite.allBodies(engineRef.current.world);
            bodies.forEach(body => {
              if (!body.isStatic) {
                const forceMagnitude = 0.02 * body.mass;
                Matter.Body.applyForce(body, body.position, {
                  x: (Math.random() - 0.5) * forceMagnitude,
                  y: (Math.random() - 0.5) * forceMagnitude
                });
              }
            });
          }
          setTimeout(() => setIsShaking(false), 500);
        }
        
        lastX = current.x;
        lastY = current.y;
        lastZ = current.z;
        lastTime = currentTime;
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [enableShake, deviceType]);

  // Gyroscope for gravity control - smoother
  useEffect(() => {
  // Do not change gravity on device orientation
  return () => {};
}, []);

  // Enhanced responsive setup with proper height scaling
  useEffect(() => {
    const updateDimensions = () => {
      const container = sceneRef.current?.parentElement;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight || window.innerHeight;

      setDimensions({ width, height });
      setOrientation(width > height ? 'landscape' : 'portrait');

      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /mobile|android|iphone|ipad|tablet/.test(userAgent);
      
      if (width < 640 || isMobile) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (sceneRef.current?.parentElement) {
      resizeObserver.observe(sceneRef.current.parentElement);
    }

    window.addEventListener('orientationchange', updateDimensions);
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('orientationchange', updateDimensions);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [heightScale]);

  // Color schemes
  const colorSchemes = {
    vibrant: ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF'],
    pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'],
    neon: ['#FF10F0', '#00FFF0', '#39FF14', '#FF3F00', '#FFFF00'],
    monochrome: ['#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080'],
    rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
    light: ['#E0E0E0', '#D0D0D0', '#C0C0C0', '#B0B0B0', '#A0A0A0'],
    minimal: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7'],
    neutral: ['#795548', '#8D6E63', '#A1887F', '#BCAAA4', '#D7CCC8'],
    blue: ['#0000FF', '#3399FF', '#66CCFF', '#99CCFF', '#CCE5FF']
  };

  const getColor = useCallback(() => {
    const colors = customColors.length > 0 ? customColors : (colorSchemes[colorScheme] || colorSchemes.vibrant);
    return colors[Math.floor(Math.random() * colors.length)];
  }, [colorScheme, customColors]);

  const shadeColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  };

  // Ultra-smooth water wave effect
  const createWaterWaveEffect = useCallback((mouseX, mouseY, isClick = false) => {
    if (!engineRef.current) return;

    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    const effectRadius = isClick ? 300 : 200;
const forceMagnitude = isClick ? 0.08 : 0.05;

    bodies.forEach(body => {
      if (!body.isStatic) {
        const dx = body.position.x - mouseX;
        const dy = body.position.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < effectRadius && distance > 0) {
  const normalizedDistance = distance / effectRadius;
  const waveForce = Math.pow(1 - normalizedDistance, 2) * forceMagnitude;

  const forceX = (dx / distance) * waveForce * body.mass * 2;
const forceY = (dy / distance) * waveForce * body.mass * 2;

          Matter.Body.applyForce(body, body.position, {
    x: forceX,
    y: forceY
  });

  if (isClick) {
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);// Add slight rotation on click
  }
}
      }
    });
  }, []);

  // Main physics engine
  useEffect(() => {
    if (!sceneRef.current || dimensions.width === 0 || dimensions.height === 0) return;// Ensure dimensions are set

    // Cleanup previous instances
    if (renderRef.current) {
      Matter.Render.stop(renderRef.current);
      renderRef.current.canvas.remove();
    }
    if (engineRef.current) {
      Matter.Engine.clear(engineRef.current);
    }

    // Create engine
    const engine = Matter.Engine.create({
      positionIterations: deviceType === 'mobile' ? 6 : 8,
      velocityIterations: deviceType === 'mobile' ? 4 : 6,
      constraintIterations: deviceType === 'mobile' ? 2 : 3,
      enableSleeping: true,
      timing: {
        timeScale: 0.8,
        timestamp: 0
      }
    });
    engineRef.current = engine;

   engine.gravity.scale = 0.007;  // tweak strength here
engine.gravity.x = 0;
engine.gravity.y = 1;
    engine.gravity.angle = Math.PI / 2; // Gravity pointing down

    // Create render  

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: dimensions.width,
        height: dimensions.height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: deviceType === 'mobile' ? 1 : Math.min(window.devicePixelRatio || 1, 2),
        showStats: false,
        showPerformance: false,
        showSleeping: false,
        hasBounds: true
      }
    });
    renderRef.current = render;

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    runner.delta = 1000 / 60;
    runner.isFixed = true;
    Matter.Runner.run(runner, engine);

    // Calculate responsive grid
   const calculateGrid = () => {
  const baseSize = particleMode ? 50 : 30; // bigger size for particles
  const size = deviceType === 'mobile' ? baseSize * 0.7 : 
       deviceType === 'tablet' ? baseSize * 0.85 : baseSize;

  const spacing = size * 3.0; // less spacing
  const cols = Math.floor(dimensions.width / spacing);  
  const rows = Math.floor(dimensions.height / spacing);
  return { size, spacing, cols, rows };
};

    const { size, spacing, cols, rows } = calculateGrid();
    const bodies = [];

    const startX = (dimensions.width - (cols - 1) * spacing) / 2;
    const startY = 60;

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const x = startX + col * spacing;
        const y = startY + row * spacing;
        const color = getColor();
        
        const renderOptions = {
          fillStyle: color,
          strokeStyle: deviceType === 'mobile' ? 'transparent' : shadeColor(color, -20),
          lineWidth: deviceType === 'mobile' ? 0 : 1
        };

        const physicsOptions = {
          render: renderOptions,// Physics options
          frictionAir: 0,// Reduced air friction for smoother motion
          restitution: 0.4,// Increased restitution for more bounce
          density: 0.0008,// Decreased density for lighter bodies
          friction: 0,// Reduced friction for smoother interactions
          frictionStatic: 0.5,// Increased static friction for better grip
          slop: 0.6// Reduced slop for more precise collisions
        };

        let body;
        if (particleMode) {
          body = Matter.Bodies.circle(x, y, size / 2, physicsOptions);
        } else {
          const shapeType = Math.floor(Math.random() * 3);
          switch (shapeType) {
            case 0:
              body = Matter.Bodies.rectangle(x, y, size, size, {
                ...physicsOptions,
                chamfer: { radius: size * 0.1 }
              });

              break;
            case 1:
              { const sides = Math.floor(Math.random() * 5) + 3;
              body = Matter.Bodies.polygon(x, y, sides, size / 2, physicsOptions);// Polygon shape
              break; }
            case 2:
              body = Matter.Bodies.circle(x, y, size / 2, physicsOptions);// Circle shape
              break;
          }
        }
        
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
        bodies.push(body);
      }
    }

    Matter.Composite.add(engine.world, bodies);

    // Walls
    const wallThickness = 50;
    const walls = [
      Matter.Bodies.rectangle(dimensions.width / 2, -25, dimensions.width + 100, wallThickness, { 
        isStatic: true,
        render: { visible: false }
      }),
      Matter.Bodies.rectangle(dimensions.width / 2, dimensions.height + 25, dimensions.width + 100, wallThickness, { 
        isStatic: true,
        render: { visible: false }
      }),
      Matter.Bodies.rectangle(-25, dimensions.height / 2, wallThickness, dimensions.height + 100, { 
        isStatic: true,
        render: { visible: false }
      }),
      Matter.Bodies.rectangle(dimensions.width + 25, dimensions.height / 2, wallThickness, dimensions.height + 100, { 
        isStatic: true,
        render: { visible: false }
      })
    ];

    Matter.Composite.add(engine.world, walls);

    // Mouse/Touch handlers
    const handleMouseMove = (e) => {
      const rect = render.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      createWaterWaveEffect(mouseX, mouseY, false);
    };

    const handleClick = (e) => {
      const rect = render.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      createWaterWaveEffect(mouseX, mouseY, true);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = render.canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        createWaterWaveEffect(touchX, touchY, false);
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = render.canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        createWaterWaveEffect(touchX, touchY, true);
      }
    };

    // Add event listeners directly to canvas
    const canvas = render.canvas;
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchstart', handleTouchStart);

    // Subtle ambient animation
    let animationTime = 0;
    const ambientAnimation = () => {
      animationTime += 0.005;
      
      bodies.forEach((body, index) => {
        if (!body.isStatic && index % 3 === 0) {
          const offsetX = Math.sin(animationTime + index * 0.8) * 0.02;// increase amplitude
          const offsetY = Math.cos(animationTime + index * 0.15) * 0.02;// increase amplitude

          Matter.Body.applyForce(body, body.position, {
            x: offsetX * body.mass * 0.5,// increase force
            y: offsetY * body.mass * 0.5// increase force
          });
        }
      });
    };

    let frameCount = 0;
    const throttledAmbientAnimation = () => {
      frameCount++;
      if (frameCount % 2 === 0) {
        ambientAnimation();
      }
    };

    Matter.Events.on(engine, 'beforeUpdate', throttledAmbientAnimation);

    // Cleanup
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
      Matter.Events.off(engine, 'beforeUpdate', throttledAmbientAnimation);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, [dimensions, deviceType, colorScheme, particleMode, getColor, createWaterWaveEffect]);

  return (
    <div className="relative w-full h-full">
      <div ref={sceneRef} className="w-full h-full" />
      
      {/* Performance indicator */}
      {deviceType !== 'desktop' && fps < 30 && (
        <div className="absolute top-2 right-2 bg-red-600/70 text-white px-2 py-1 rounded text-xs pointer-events-none">
          {fps} FPS
        </div>
      )}
      
      {/* Shake indicator */}
      {isShaking && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-white/10 animate-pulse" />
        </div>
      )}
      
      {/* Mobile instructions */}
      {deviceType === 'mobile' && orientation === 'portrait' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded text-xs text-center pointer-events-none">
          <p>Touch & Tilt to interact</p>
        </div>
      )}

      {/* Optimized styles - REMOVED touch-none class */}
      <style jsx>{`
        canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
          cursor: pointer;  
        }
        
        @media (prefers-reduced-motion: reduce) {
          canvas {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResponsiveColorfulStressAdvanced;