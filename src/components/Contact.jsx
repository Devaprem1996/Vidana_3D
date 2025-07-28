import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { submitToAirtable } from "../utils/airtable";
import MapCard from "./MapCard";


gsap.registerPlugin(ScrollTrigger);

// Initial form state and validation
const initialForm = { name: "", email: "", phone: "", message: "" };



const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
    errors.email = "Invalid email";
  if (!form.phone.trim()) errors.phone = "Phone is required";
  else if (!/^\+?\d{7,15}$/.test(form.phone.replace(/\s/g, "")))
    errors.phone = "Invalid phone";
  if (!form.message.trim()) errors.message = "Message is required";
  return errors;
};

const Contact = () => {
  const sectionRef = useRef(null);
 
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null);
  const mapRef = useRef(null);
  const cardRef = useRef(null);
  const floatRefs = useRef([]);
  const socialRefs = useRef([]);
  const statusRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState('idle'); // idle, success, error
  const [isFlipped, setIsFlipped] = useState(false);

  

  // 3D Tilt Effect
  const handleTilt = (e, ref) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 15;
    const rotateY = (x / rect.width) * 15;

    gsap.to(card, {
      rotateX,
      rotateY,
      scale: 1.05,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
      transformOrigin: "center center",
    });
  };

  const resetTilt = (ref) => {
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.3)",
    });
  };

  // GSAP Animations Setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background color change on scroll
 

      // Title 3D entrance
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 80, rotateX: 60 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
          },
        }
      );

      // Subtitle fade-in
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: "top 85%",
          },
        }
      );

      // Form card 3D pop-in
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 120, rotateY: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
          },
        }
      );

      // Map 3D pop-in
      gsap.fromTo(
        mapRef.current,
        { opacity: 0, y: 120, rotateY: -40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: mapRef.current,
            start: "top 90%",
          },
        }
      );

      // Floating elements parallax
      floatRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: -200 * (i + 1),
          x: Math.sin(i) * 100,
          rotation: 360 * (i + 1),
          scale: 1 + i * 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2 + i,
          },
        });
      });

      // Social icons stagger
      gsap.fromTo(
        socialRefs.current,
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".social-container",
            start: "top 90%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Form submission handler with n8n integration and toasts
 const handleSubmit = async (e) => {
  e.preventDefault();
  setFormStatus(""); // Clear previous status
  setErrors({});     // Clear previous errors

  const errs = validate(form);
  setErrors(errs);

  if (Object.keys(errs).length === 0) {
    setIsFlipped(true);
    gsap.to(cardRef.current, {
      rotateY: 180,
      duration: 0.8,
      ease: "power2.inOut",
    });

    let wasSuccess = false;

    try {
      const response = await submitToAirtable(form);

      if (!response || !response.id) {
        throw new Error("Failed to send message");
      }

      setFormStatus('success');
      wasSuccess = true;
      setForm(initialForm);

      toast.success("Message sent successfully!", { /* ... */ });

      gsap.fromTo(
        statusRef.current,
        { scale: 0, rotate: -90, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.7, ease: "back.out(1.7)" }
      );

    } catch (err) {
      setFormStatus('error');
      wasSuccess = false;

      toast.error("Error sending message. Please try again.", { /* ... */ });

      gsap.to(statusRef.current, {
        x: "+=5",
        duration: 0.1,
        yoyo: true,
        repeat: 3,
        ease: "power2.inOut",
      });
    } finally {
      setTimeout(() => {
        gsap.to(cardRef.current, {
          rotateY: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            setFormStatus('idle');
            setIsFlipped(false);
          },
        });
      }, 3000);
    }
  } else {
    // Shake invalid fields
    Object.keys(errs).forEach((field) => {
      const input = formRef.current.querySelector(`[name="${field}"]`);
      if (input) {
        gsap.to(input, {
          x: "+=5",
          duration: 0.1,
          yoyo: true,
          repeat: 3,
          ease: "power2.inOut",
        });
      }
    });
  }
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setFormStatus("idle");
  };

  return (
    <>
      <ToastContainer />
      <section
        ref={sectionRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-neutral-800 text-4xl text-white"
      >
    
        

        {/* Floating Parallax Elements */}
      

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-24 " >
          {/* Title Section */}
          <div className="text-center  mb-16">
            <h2
              ref={titleRef}
              className=" text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-10xl  xl:text-[180px] text-white mb-4"
            >
              Contact Us
            </h2>
            <p
              ref={subtitleRef}
              className="font-circularweb  lx:text-5xl text-white/80 max-w-2xl mx-auto"
            >
              Let's build something amazing together. Reach out to us!
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            {/* Form Card with 3D Flip */}
            <div
              ref={cardRef}
              className="relative flex flex-col justify-center items-center"
              style={{
                perspective: "1200px",
                transformStyle: "preserve-3d",
                minHeight: "420px",
              }}
              onMouseMove={(e) => !isFlipped && handleTilt(e, cardRef)}
              onMouseLeave={() => !isFlipped && resetTilt(cardRef)}
            >
              <div
                className="w-full bg-white/10 border-hsla rounded-2xl shadow-2xl p-8 md:p-10 backdrop-blur-md"
                style={{
                  transformStyle: "preserve-3d",
                  boxShadow: "0 8px 40px 0 rgba(87,36,255,0.15)",
                  minHeight: "420px",
                }}
              >
                {isFlipped ? (
                  <div ref={statusRef} className="flex flex-col items-center justify-center h-full">
  {formStatus === 'success' && (
    <>
      <svg width="64" height="64" viewBox="0 0 64 64" className="mb-6">
        <circle cx="32" cy="32" r="30" fill="var(--color-bluer-300)" opacity="0.2" />
        <path
          d="M20 34l8 8 16-16"
          fill="none"
          stroke="var(--color-bluer-300)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="text-2xl font-zentry-regular text-[var(--color-bluer-300)] mb-2">Thank you!</div>
      <div className="text-white/80 font-circularweb text-base text-center">
        Your message has been sent.<br />We’ll get back to you soon.
      </div>
    </>
  )}

  {formStatus === 'error' && (
    <>
      <svg width="64" height="64" viewBox="0 0 64 64" className="mb-6">
        <circle cx="32" cy="32" r="30" fill="#ff6b6b" opacity="0.2" />
        <path
          d="M20 20l24 24M44 20l-24 24"
          fill="none"
          stroke="#ff6b6b"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="text-2xl font-zentry-regular text-[#ff6b6b] mb-2">Error!</div>
      <div className="text-white/80 font-circularweb text-base text-center">
        Failed to send message.<br />Please try again.
      </div>
    </>
  )}

  {formStatus === 'sending' && (
    <>
      <svg className="w-12 h-12 text-[var(--color-bluer-300)] animate-spin mb-6" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <div className="text-xl font-zentry-regular text-[var(--color-bluer-300)] mb-2">Sending...</div>
      <div className="text-white/80 font-circularweb text-base text-center">
        Please wait while we send your message.
      </div>
    </>
  )}
</div>
                ) : (
                  <form ref={formRef} className="space-y-7" onSubmit={handleSubmit}>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={`peer w-full px-3 py-2 text-lg rounded-md  bg-white/20 text-white font-circularweb border border-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-violeter-300)] transition placeholder-transparent ${errors.name ? "border-red-400" : ""}`}
                        placeholder="Your Name"
                      />
                      <label className="absolute left-4 top-3 text-white/60 font-robert-medium text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--color-violeter-300)] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs">
                        Name
                      </label>
                      {errors.name && <div className="text-xs text-red-400 mt-1">{errors.name}</div>}
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`peer w-full px-4 py-2 text-lg rounded-md  bg-white/20 text-white font-circularweb border border-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-bluer-300)] transition placeholder-transparent ${errors.email ? "border-red-400" : ""}`}
                        placeholder="Your Email"
                      />
                      <label className="absolute left-4 top-3 text-white/60 font-robert-medium text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--color-bluer-300)] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs">
                        Email
                      </label>
                      {errors.email && <div className="text-xs text-red-400 mt-1">{errors.email}</div>}
                    </div>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className={`peer w-full px-4 py-2 text-lg rounded-md  bg-white/20 text-white font-circularweb border border-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-yellower-300)] transition placeholder-transparent ${errors.phone ? "border-red-400" : ""}`}
                        placeholder="Your Phone"
                      />
                      <label className="absolute left-4 top-3 text-white/60 font-robert-medium text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--color-yellower-300)] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs">
                        Phone
                      </label>
                      {errors.phone && <div className="text-xs text-red-400 mt-1">{errors.phone}</div>}
                    </div>
                    <div className="relative">
                      <textarea
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        className={`peer w-full px-4 py-2 text-lg rounded-md  bg-white/20 text-white font-circularweb border border-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-bluer-300)] transition resize-none placeholder-transparent ${errors.message ? "border-red-400" : ""}`}
                        placeholder="Your Message"
                      />
                      <label className="absolute left-4 top-3 text-white/60 font-robert-medium text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--color-bluer-300)] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs">
                        Message
                      </label>
                      {errors.message && <div className="text-xs text-red-400 mt-1">{errors.message}</div>}
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-[var(--color-black-300)] text-white font-robert-medium text-lg uppercase tracking-wider shadow-lg hover:bg-[var(--color-black-300)]/90 transition"
                    >
                      Send Message
                    </button>
                  </form>
                )}
                <div className="mt-8 text-center text-white/70 font-circularweb text-xs">
                  Or email us at{" "}
                  <a
                    href="mailto:hello@yourcompany.com"
                    className="underline text-[var(--color-bluer-300)]"
                  >
                    vidanaConsulting@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <MapCard
              address="11/18 kasipuram, tamil nadu, india"
              mapRef={mapRef}
              handleTilt={handleTilt}
              resetTilt={resetTilt}
              
            />
          </div>

          {/* Social Links Section */}
          <div className="social-container mt-20 text-center">
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-circularweb xl:text-6xl   text-white mb-8">Connect With Us</h3>
            <div className="flex justify-center  space-x-6">
              {[
                { name: "Twitter", icon: "𝕏", color: "hover:text-[var(--color-bluer-300)]" },
                { name: "LinkedIn", icon: "in", color: "hover:text-[var(--color-violeter-300)]" },
                { name: "Instagram", icon: "◐", color: "hover:text-[var(--color-yellower-300)]" },
                { name: "GitHub", icon: "⌘", color: "hover:text-white" },
              ].map((social, i) => (
                <a
                  key={i}
                  ref={(el) => (socialRefs.current[i] = el)}
                  href="#"
                  className={`w-14 h-14 bg-white/10 border-hsla rounded-full flex-center  text-white/60 font-bold text-xl transition-all duration-300 hover:scale-110 hover:bg-white/20 ${social.color}`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;