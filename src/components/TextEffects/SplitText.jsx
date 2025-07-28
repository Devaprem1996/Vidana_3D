import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

const SplitText = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const ref = useRef(null);
  const animationCompletedRef = useRef(false);
  const scrollTriggerRef = useRef(null);
  const tlRef = useRef(null); // Store timeline for cleanup
  const splitterRef = useRef(null); // Store splitter for cleanup

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current || !text) return;

    const el = ref.current;
    animationCompletedRef.current = false;

    const absoluteLines = splitType === "lines";
    if (absoluteLines) el.style.position = "relative";

    const initSplitText = () => {
      try {
        splitterRef.current = new GSAPSplitText(el, {
          type: splitType,
          absolute: absoluteLines,
          linesClass: "split-line",
        });
      } catch (error) {
        console.error("Failed to create SplitText:", error);
        return;
      }

      let targets;
      switch (splitType) {
        case "lines":
          targets = splitterRef.current.lines;
          break;
        case "words":
          targets = splitterRef.current.words;
          break;
        case "chars":
          targets = splitterRef.current.chars;
          break;
        default:
          targets = splitterRef.current.chars;
      }

      if (!targets || targets.length === 0) {
        console.warn("No targets found for SplitText animation");
        splitterRef.current.revert();
        return;
      }

      targets.forEach((t) => {
        t.style.willChange = "transform, opacity";
      });
      
      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);// eslint-disable-line

      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? (marginMatch[2] || "px") : "px";
      const sign = marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      tlRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
          once: true,
          onToggle: (self) => {
            scrollTriggerRef.current = self;
          },
        },
        smoothChildTiming: true,
        onComplete: () => {
          animationCompletedRef.current = true;
          gsap.set(targets, {
            ...to,
            clearProps: "willChange",
            immediateRender: true,
          });
          onLetterAnimationComplete?.();
        },
      });

      tlRef.current.set(targets, { ...from, immediateRender: false, force3D: true });
      tlRef.current.to(targets, {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        force3D: true,
      });
    };

    // Wait for fonts to load before initializing SplitText
    if (document.fonts) {
      document.fonts.ready.then(() => {
        initSplitText();
      }).catch((error) => {
        console.error("Error waiting for fonts:", error);
        initSplitText(); // Fallback: try anyway
      });
    } else {
      // Fallback for browsers without document.fonts
      const onLoad = () => initSplitText();
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      if (splitterRef.current) {
        splitterRef.current.revert();
      }
    };
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    from,
    to,
    threshold,
    rootMargin,
    onLetterAnimationComplete,
  ]);

  return (
    <p
      ref={ref}
      className={`split-parent ${className} p-2 w-full `}
      style={{
        textAlign,
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word",
        
      }}
    >
      {text}
    </p>
  );
};

export default SplitText;