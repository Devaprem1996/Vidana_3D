// components/ResponsiveColorfulStress.jsx
import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const ResponsiveColorfulStress = ({
  colorScheme = 'vibrant',
  customColors = [],
  showStats = false,
  showPerformance = false,
  mobileScale = 0.5, // Scale factor for mobile
  tabletScale = 0.7, // Scale factor for tablet
  desktopScale = 1,  // Scale factor for desktop
}) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [deviceType, setDeviceType] = useState('desktop');
  const [bodiesCount, setBodiesCount] = useState(0);

  // Color schemes
  const colorSchemes = {
    vibrant: [
      '#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF',
      '#06FFB4', '#FF4365', '#00F5FF', '#FFFD82', '#FF124F'
    ],
    pastel: [
      '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
      '#E0BBE4', '#FEC8D8', '#FFDFD3', '#D4F1F4', '#F3E5F5'
    ],
    neon: [
      '#FF10F0', '#00FFF0', '#39FF14', '#FF3F00', '#FFFF00',
      '#FF00FF', '#00FFFF', '#FF1493', '#00FF00', '#FF69B4'
    ],
    monochrome: [
      '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080',
      '#999999', '#b3b3b3', '#cccccc', '#e6e6e6', '#f2f2f2'
    ]
  };

  // Get color based on scheme
  const getColorFromScheme = () => {
    if (colorScheme === 'custom' && customColors.length > 0) {
      return customColors[Math.floor(Math.random() * customColors.length)];
    } else if (colorSchemes[colorScheme]) {
      const colors = colorSchemes[colorScheme];
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      const hue = Math.random() * 360;
      const saturation = 70 + Math.random() * 30;
      const lightness = 45 + Math.random() * 20;
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
  };

  // Detect device type and set dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const container = sceneRef.current?.parentElement;
      if (!container) return;

      const width = container.clientWidth;
      const height = window.innerHeight * 0.7; // 70% of viewport height

      setDimensions({ width, height });

      // Detect device type
      if (width < 640) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Main physics setup
  useEffect(() => {
    if (!sceneRef.current || dimensions.width === 0) return;

    // Clear previous instance
    if (renderRef.current) {
      Matter.Render.stop(renderRef.current);
      renderRef.current.canvas.remove();
      renderRef.current = null;
    }
    if (engineRef.current) {
      Matter.Engine.clear(engineRef.current);
      engineRef.current = null;
    }

    // Create engine
    const engine = Matter.Engine.create({
      positionIterations: deviceType === 'mobile' ? 6 : 10,
      velocityIterations: deviceType === 'mobile' ? 4 : 10
    });
    engineRef.current = engine;
    const world = engine.world;

    // Adjust gravity for mobile
    if (deviceType === 'mobile') {
      engine.world.gravity.scale = 0.0008;
    }

    // Create renderer
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: dimensions.width,
        height: dimensions.height,
        wireframes: false,
        background: colorScheme === 'neon' ? '#000000' : '#f8f8f8',
        showStats: deviceType === 'desktop' ? showStats : false,
        showPerformance: deviceType === 'desktop' ? showPerformance : false,
        pixelRatio: window.devicePixelRatio || 1
      }
    });
    renderRef.current = render;

    Matter.Render.run(render);

    // Create runner
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Calculate responsive parameters
    const getResponsiveParams = () => {
      const baseColumns = 38;
      const baseRows = 18;
      const baseScale = 0.3;
      const baseSpacing = 20;

      let scale, columns, rows, spacing;

      switch (deviceType) {
        case 'mobile':
          scale = baseScale * mobileScale;
          columns = Math.floor(baseColumns * 0.4);
          rows = Math.floor(baseRows * 0.6);
          spacing = baseSpacing * 0.8;
          break;
        case 'tablet':
          scale = baseScale * tabletScale;
          columns = Math.floor(baseColumns * 0.7);
          rows = Math.floor(baseRows * 0.8);
          spacing = baseSpacing * 0.9;
          break;
        default:
          scale = baseScale * desktopScale;
          columns = baseColumns;
          rows = baseRows;
          spacing = baseSpacing;
      }

      // Adjust based on actual dimensions
      const maxColumns = Math.floor((dimensions.width - 80) / spacing);
      const maxRows = Math.floor((dimensions.height - 80) / spacing);
      
      columns = Math.min(columns, maxColumns);
      rows = Math.min(rows, maxRows);

      return { scale, columns, rows, spacing };
    };

    const { scale, columns, rows, spacing } = getResponsiveParams();

    // Create bodies
    const bodies = [];
    const startX = (dimensions.width - (columns - 1) * spacing) / 2;
    const startY = 40;
    const shadeColor = (color, percent) => {
  // Convert hex to RGB
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


    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        const x = startX + col * spacing;
        const y = startY + row * spacing;
        const sides = Math.round(Matter.Common.random(3, 8));
        const color = getColorFromScheme();
        
        const renderOptions = {
          fillStyle: color,
          strokeStyle: colorScheme === 'neon' ? color : shadeColor('#ffffff', -20),
          lineWidth: deviceType === 'mobile' ? 1 : 2
        };

        let body;
        const shapeType = Math.round(Matter.Common.random(0, 2));
        
        switch (shapeType) {
          case 0:
            // Rectangle
            body = Matter.Bodies.rectangle(
              x, y,
              Matter.Common.random(25, 50) * scale,
              Matter.Common.random(25, 50) * scale,
              { 
                render: renderOptions,
                chamfer: { radius: 5 * scale }
              }
            );
            break;
          case 1:
            // Polygon
            body = Matter.Bodies.polygon(
              x, y,
              sides,
              Matter.Common.random(25, 50) * scale,
              { render: renderOptions }
            );
            break;
          case 2:
            // Circle
            body = Matter.Bodies.circle(
              x, y,
              Matter.Common.random(15, 30) * scale,
              { render: renderOptions }
            );
            break;
        }
        
        bodies.push(body);
      }
    }

    Matter.Composite.add(world, bodies);
    setBodiesCount(bodies.length);

    // Responsive walls
    const wallThickness = deviceType === 'mobile' ? 30 : 50;
    const wallColor = colorScheme === 'neon' ? '#111111' : '#333333';
    
    const walls = [
      // Top
      Matter.Bodies.rectangle(
        dimensions.width / 2, -wallThickness / 2, 
        dimensions.width, wallThickness, 
        { isStatic: true, render: { fillStyle: wallColor } }
      ),
      // Bottom
      Matter.Bodies.rectangle(
        dimensions.width / 2, dimensions.height + wallThickness / 2, 
        dimensions.width, wallThickness, 
        { isStatic: true, render: { fillStyle: wallColor } }
      ),
      // Right
      Matter.Bodies.rectangle(
        dimensions.width + wallThickness / 2, dimensions.height / 2, 
        wallThickness, dimensions.height, 
        { isStatic: true, render: { fillStyle: wallColor } }
      ),
      // Left
      Matter.Bodies.rectangle(
        -wallThickness / 2, dimensions.height / 2, 
        wallThickness, dimensions.height, 
        { isStatic: true, render: { fillStyle: wallColor } }
      )
    ];

    Matter.Composite.add(world, walls);

    // Mouse/Touch control
    const mouse = Matter.Mouse.create(render.canvas);
    mouse.pixelRatio = window.devicePixelRatio || 1;
    
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Matter.Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    // Touch events for mobile
    render.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
    }, { passive: false });

    // Cleanup
    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [dimensions, deviceType, colorScheme, customColors, showStats, showPerformance, mobileScale, tabletScale, desktopScale]);

  return (
    <div className="relative w-full">
      <div ref={sceneRef} className="w-full" />
      
      {/* Responsive Info Panel */}
      <div className={`absolute top-2 left-2 bg-black/70 text-white rounded-lg shadow-lg transition-all ${
        deviceType === 'mobile' ? 'p-2 text-xs' : 'p-4 text-sm'
      }`}>
        <p>Bodies: {bodiesCount}</p>
        <p>Device: {deviceType}</p>
        <p className="hidden sm:block">Dimensions: {dimensions.width}x{dimensions.height}</p>
      </div>

      {/* Mobile Controls */}
      {deviceType === 'mobile' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <button
            onClick={() => {
              if (engineRef.current) {
                engineRef.current.world.gravity.y = -1;
                setTimeout(() => {
                  engineRef.current.world.gravity.y = 1;
                }, 1000);
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm shadow-lg"
          >
            Flip Gravity
          </button>
        </div>
      )}
    </div>
  );
};

export default ResponsiveColorfulStress;