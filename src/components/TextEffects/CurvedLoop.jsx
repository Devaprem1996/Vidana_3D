import {
  useRef,
  useEffect,
  useState,
  useMemo,
  useId
} from "react";

const CurvedLoop = ({
  marqueeText = "",
  speed = 2,
  className,
  curveAmount = 400,
  direction = "left",
  interactive = true,
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (
      (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + "\u00A0"
    );
  }, [marqueeText]);

  const measureRef = useRef(null);
  const textPathRef = useRef(null);
  const pathRef = useRef(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1440);
  const uid = useId();
  const pathId = `curve-${uid}`;
  
  // Responsive curve amount based on viewport
  const responsiveCurveAmount = viewportWidth < 768 ? curveAmount * 0.6 : curveAmount;
  const pathD = `M-100,40 Q${viewportWidth/2},${40 + responsiveCurveAmount} ${viewportWidth + 100},40`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);

  const textLength = spacing;
  const totalText = textLength ? Array(Math.ceil((viewportWidth + 200) / textLength) + 2).fill(text).join('') : text;
  const ready = spacing > 0;

  // Handle viewport resize
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (measureRef.current)
      setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className, viewportWidth]);

  useEffect(() => {
    if (!spacing || !ready) return;
    let frame = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === "right" ? speed : -speed;
        const currentOffset = parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
        let newOffset = currentOffset + delta;

        const wrapPoint = spacing;
        if (newOffset <= -wrapPoint) newOffset += wrapPoint;
        if (newOffset >= wrapPoint) newOffset -= wrapPoint;

        textPathRef.current.setAttribute("startOffset", newOffset + "px");
        setOffset(newOffset);
      }
      frame = requestAnimationFrame(step);
    };
    step();
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  const onPointerDown = (e) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    (e.target).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;

    const currentOffset = parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
    let newOffset = currentOffset + dx;

    const wrapPoint = spacing;
    if (newOffset <= -wrapPoint) newOffset += wrapPoint;
    if (newOffset >= wrapPoint) newOffset -= wrapPoint;

    textPathRef.current.setAttribute("startOffset", newOffset + "px");
    setOffset(newOffset);
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? "right" : "left";
  };

  const cursorStyle = interactive
    ? dragRef.current
      ? "grabbing"
      : "grab"
    : "auto";

  return (
    <div
      className="curved-loop-jacket"
      style={{ visibility: ready ? "visible" : "hidden", cursor: cursorStyle }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg 
        className="curved-loop-svg" 
        viewBox={`0 0 ${viewportWidth} 120`}
        preserveAspectRatio="xMidYMid meet"
      >
        <text
          ref={measureRef}
          xmlSpace="preserve"
          style={{ visibility: "hidden", opacity: 0, pointerEvents: "none" }}
          className="measure-text"
        >
          {text}
        </text>
        <defs>
          <path
            ref={pathRef}
            id={pathId}
            d={pathD}
            fill="none"
            stroke="transparent"
          />
        </defs>
        {ready && (
          <text fontWeight="bold" xmlSpace="preserve" className={`curved-text ${className || ''}`}>
            <textPath ref={textPathRef} href={`#${pathId}`} startOffset={offset + "px"} xmlSpace="preserve">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
      <style jsx = "true">{`
        .curved-loop-jacket {
          position: relative;
          width: 100%;
          height: auto;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          z-index: 1;
        }

        .curved-loop-svg {
          user-select: none;
          width: 100%;
          height: auto;
          overflow: visible;
          display: block;
          -moz-user-select: none;
          -webkit-user-select: none;
        }

        .curved-text {
          fill: #ffffff;
          font-weight: 100;
          font-family: 'Poppins', sans-serif;
          
          line-height: 1;
          font-size: 6rem;
        }

        .measure-text {
          font-size: 6rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        /* Responsive font sizes */
        @media (max-width: 1536px) {
          .curved-text, .measure-text {
            font-size: 5rem;
          }
        }

        @media (max-width: 1280px) {
          .curved-text, .measure-text {
            font-size: 4rem;
          }
        }

        @media (max-width: 1024px) {
          .curved-text, .measure-text {
            font-size: 3.5rem;
          }
        }

        @media (max-width: 768px) {
          .curved-text, .measure-text {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 640px) {
          .curved-text, .measure-text {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .curved-text, .measure-text {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CurvedLoop;