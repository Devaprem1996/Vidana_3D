import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";
import ParallaxLines from "./ParallaxLines"; // <-- Add your effect here

const navItems = ["home", "about", "services", "team", "contact"];

const NavBar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Hamburger animation state
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }
    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  // Animate mobile menu with GSAP
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        gsap.to(mobileMenuRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          pointerEvents: "auto",
        });
      } else {
        gsap.to(mobileMenuRef.current, {
          y: "-100%",
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          pointerEvents: "none",
        });
      }
    }
    setHamburgerOpen(isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  // ESC to close mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMobileMenuOpen]);

  // Overlay click to close
  const handleOverlayClick = (e) => {
    if (e.target === mobileMenuRef.current) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo */}
          <div className="flex items-center gap-7">
            <img src="/img/logo.png" alt="logo" className="w-10" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex h-full items-center">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase()}`}
                className="nav-hover-btn"
              >
                {item}
              </a>
            ))}

            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{ animationDelay: `${bar * 0.1}s` }}
                />
              ))}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex flex-col justify-center items-center w-8 h-8 gap-1 focus:outline-none"
              aria-label={hamburgerOpen ? "Close menu" : "Open menu"}
            >
              <span
                className={clsx(
                  "w-6 h-0.5 bg-white transition-all duration-300",
                  hamburgerOpen && "rotate-45 translate-y-2"
                )}
              />
              <span
                className={clsx(
                  "w-6 h-0.5 bg-white transition-all duration-300",
                  hamburgerOpen && "opacity-0"
                )}
              />
              <span
                className={clsx(
                  "w-6 h-0.5 bg-white transition-all duration-300",
                  hamburgerOpen && "-rotate-45 -translate-y-2"
                )}
              />
            </button>
          </div>
        </nav>

        {/* Mobile Nav Overlay */}
        <div
          ref={mobileMenuRef}
          className="fixed top-0 left-0 z-40 h-screen w-full bg-black/90 flex flex-col items-center justify-center gap-8 opacity-0 -translate-y-full pointer-events-none"
          onClick={handleOverlayClick}
        >
          {/* ParallaxLines effect */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <ParallaxLines />
          </div>
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" className="text-white">
              <path
                d="M6 6l12 12M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {/* Mobile Nav Links */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white text-2xl font-medium tracking-wider transition-all duration-300 hover:scale-110"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
};

export default NavBar;