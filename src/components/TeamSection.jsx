import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@fortawesome/fontawesome-free/css/all.min.css';
gsap.registerPlugin(ScrollTrigger);

const Team3DSection = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardsRef = useRef([]);
  const bgRef = useRef(null);
  const floatingElementsRef = useRef([]);
  const [activeCard, setActiveCard] = useState(null);

  const teamMembers = [
    {
      id: 1,
      name: "Sekaran Ramalingam",
      role: "CAIO",
      department: "Leadership",
      image: "/img/person-1.png",
      bio: "Sekaran Ramalingam brings over 28 years of distinguished experience in the global IT landscape and has held critical leadership roles.",
      skills: ["Generative AI & Automation Evangelist ", "AI Strategy & Governance adroit ", " Enterprise Agile Transformation Expert",],
      color: "#5724ff",
      matteColor: "#6B46C1",
      socials: { twitter: "#", linkedin: "#", dribbble: "#" }
    },
    {
      id: 2,
      name: "P.Mohana Sankar",
      role: "CEO",
      department: "Leadership",
      image: "/img/person-2.png",
      bio: "Chief AI Officer At VIDANA CONSULTING, Captain of the ship building the future of AI",
      skills: ["leadership","AI Strategy","Governance"],
      color: "#4fb7dd",
      matteColor: "#3B82F6",
      socials: { github: "#", linkedin: "#", twitter: "#" }
    },
    {
      id: 3,
      name: "Tharini",
      role: "UX Designer",
      department: "Design",
      image: "/img/person-3.png",
      bio: "Human-centered design advocate creating intuitive and accessible experiences",
      skills: ["User Research", "Prototyping", "Design Systems"],
      color: "#edff66",
      matteColor: "#F59E0B",
      socials: { dribbble: "#", behance: "#", linkedin: "#" }
    },
    {
      id: 4,
      name: "Devaprem",
      role: "Motion Designer",
      department: "Design",
      image: "/img/person-4.png",
      bio: "Bringing interfaces to life with stunning animations and micro-interactions",
      skills: ["After Effects", "Lottie", "3D Animation"],
      color: "#ff6b6b",
      matteColor: "#EF4444",
      socials: { vimeo: "#", dribbble: "#", twitter: "#" }
    },
    {
      id: 5,
      name: "Jenifer",
      role: "Product Manager",
      department: "Leadership",
      image: "/img/person-5.png",
      bio: "Strategic thinker driving product innovation and user satisfaction",
      skills: ["Product Strategy", "Agile", "Data Analysis"],
      color: "#a8e6cf",
      matteColor: "#10B981",
      socials: { linkedin: "#", twitter: "#", medium: "#" }
    },
    {
      id: 6,
      name: "Rajasri",
      role: "Backend Engineer",
      department: "Engineering",
      image: "/img/person-6.png",
      bio: "System architect building scalable and secure infrastructures",
      skills: ["Python", "AWS", "Microservices"],
      color: "#ff8cc8",
      matteColor: "#EC4899",
      socials: { github: "#", stackoverflow: "#", linkedin: "#" }
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const title = titleRef.current;
      const cardsContainer = cardsContainerRef.current;
      const cards = cardsRef.current.filter(Boolean);
      const bg = bgRef.current;
      const floatingElements = floatingElementsRef.current.filter(Boolean);

      // Set initial states for cards
      gsap.set(cards, { 
        opacity: 0,
        y: 100,
        rotateX: -15,
        transformPerspective: 1000,
        transformOrigin: "center center"
      });

      // Set initial state for title
      gsap.set(title, {
        opacity: 0,
        y: 50,
        scale: 0.9
      });

      // Create main ScrollTrigger
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          // Title animation
          gsap.to(title, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out"
          });

          // Cards stagger animation
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            stagger: {
              amount: 0.6,
              from: "start",
              ease: "power2.inOut"
            },
            ease: "power3.out",
            delay: 0.3
          });
        },
        onLeaveBack: () => {
          // Reset when scrolling back up
          gsap.to(cards, {
            opacity: 0,
            y: 100,
            rotateX: -15,
            duration: 0.5,
            stagger: 0.05
          });
          gsap.to(title, {
            opacity: 0,
            y: 50,
            scale: 0.9,
            duration: 0.5
          });
        }
      });

      // Background color change on scroll - adjusted for light theme
      
      // Subtle container breathing animation
      gsap.to(cardsContainer, {
        scale: 1.02,
        duration: 4,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });

      // Individual card hover animations
      cards.forEach((card, index) => {
        if (!card) return;
        
        const cardContent = card.querySelector('.card-content');
        
        // Parallax effect on scroll
        gsap.to(card, {
          y: () => -50 - (index * 20),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1 + (index * 0.1)
          }
        });

        // Hover animations
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            z: 50,
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
          });
          
          gsap.to(cardContent, {
            rotateY: 180,
            duration: 0.6,
            ease: "power2.inOut"
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            z: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
          
          gsap.to(cardContent, {
            rotateY: 0,
            duration: 0.6,
            ease: "power2.inOut"
          });
        });
      });

      // Floating elements animation
      floatingElements.forEach((el, index) => {
        if (!el) return;
        
        gsap.to(el, {
          y: -200 * (index + 1),
          x: Math.sin(index) * 100,
          rotation: 360 * (index + 1),
          scale: 1 + (index * 0.2),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 2 + index
          }
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background */}
      <div 
        ref={bgRef}
        className="absolute inset-0 transition-colors duration-1000"
        style={{ backgroundColor: '#000000' }}
      />

      {/* Floating decorative elements - 3D matte spheres for light theme */}
      <div className="absolute inset-0 pointer-events-none">
       
        
      </div>

      {/* Main container */}
      <div ref={containerRef} className="relative z-10 w-full px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div ref={titleRef} className="text-center mb-16 md:mb-20">
            <h2 className="font-circularweb text-5xl sm:text-6xl md:text-7xl lg:text-9xl xl:text-10xl xl:text-[180px] text-white mb-4 md:mb-6"
                style={{
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)'
                }}>
              Meet Our Team
            </h2>
            <p className="font-robert-regular text-lg md:text-xl text-white max-w-2xl xl:text-[40px] mx-auto">
              The creative minds behind extraordinary digital experiences
            </p>
          </div>

          {/* 3D Cards Container */}
          <div 
            ref={cardsContainerRef}
            className="relative"
            style={{ 
              perspective: '1200px',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 max-w-6xl mx-auto" 
                 style={{ transformStyle: 'preserve-3d' }}>
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  ref={el => cardsRef.current[index] = el}
                  className="relative w-full max-w-sm mx-auto cursor-pointer"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: 'translateZ(0)'
                  }}
                >
                  <div 
                    className="card-content relative h-[450px] md:h-[500px]"
                    style={{ 
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.6s'
                    }}
                  >
                    {/* Front of card - 3D Matte for light theme */}
                    <div 
                      className="absolute inset-0 rounded-2xl overflow-hidden"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        background: '##ffff0080',
                        boxShadow: `
                          0 10px 30px rgba(0, 0, 0, 0.1),
                          0 5px 15px rgba(0, 0, 0, 0.08),
                          inset 0 1px 0 rgba(255, 255, 255, 0.9),
                          inset 0 -1px 0 rgba(0, 0, 0, 0.05)
                        `,
                        border: '1px solid rgba(0, 0, 0, 0.09)'
                      }}
                    >
                      <div className="relative h-full p-0 flex flex-col">
                        {/* Matte highlight effect */}
                        <div 
                          className="absolute inset-0 opacity-50 pointer-events-none"
                          style={{
                                                        background: `radial-gradient(circle at 20% 20%, ${member.matteColor}08 0%, transparent 50%)`
                          }}
                        />
                        
                        <div className="relative h-56 md:h-64 mb-4 rounded-xl overflow-hidden"
                             style={{
                               boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                             }}>
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t text-white not-[]:via-transparent to-transparent" />
                        </div>
                        
                        <div className="flex-1 flex flex-col relative z-10">
                          <h3 className=" text-xl md:text-2xl text-white mb-2">
                            {member.name}
                          </h3>
                          <p className="font-robert-medium text-sm uppercase tracking-wider mb-1" 
                             style={{ 
                               color: member.matteColor
                             }}>
                            {member.role}
                          </p>
                          <p className="font-circularweb text-xs text-gray-100">
                            {member.department}
                          </p>
                        </div>

                        <div className="flex gap-3 mt-4">
                          {Object.keys(member.socials).map((platform) => (
                            <a
                              key={platform}
                              href={member.socials[platform]}
                              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                              style={{
                                background: '#f5f5f5',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                                border: '1px solid rgba(0, 0, 0, 0.04)'
                              }}
                              onClick={(e) => e.stopPropagation()}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = `${member.matteColor}15`;
                                e.currentTarget.style.boxShadow = `0 2px 8px ${member.matteColor}20, inset 0 1px 0 rgba(255, 255, 255, 0.5)`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#f5f5f5';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.5)';
                              }}
                            >
                              <i className={`fab fa-${platform} text-gray-600 text-sm`} />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Back of card - 3D Matte for light theme */}
                    <div 
                      className="absolute inset-0 rounded-2xl overflow-hidden"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: '#fff',
                        boxShadow: `
                          0 10px 30px rgba(0, 0, 0, 0.1),
                          0 5px 15px rgba(0, 0, 0, 0.08),
                          inset 0 1px 0 rgba(255, 255, 255, 0.9),
                          inset 0 -1px 0 rgba(0, 0, 0, 0.05)
                        `,
                        border: '1px solid rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      <div className="h-full p-6 flex flex-col relative">
                        {/* Matte highlight effect */}
                        <div 
                          className="absolute inset-0 opacity-30 pointer-events-none"
                         
                          
                        />
                        
                        {/* Header */}
                        <div className="mb-6 relative z-10">
                          <h3 className=" text-3xl md:text-2xl text-gray-800 mb-2">
                            {member.name}
                          </h3>
                          <div className="h-1 w-16 rounded-full" 
                               style={{ 
                                 backgroundColor: member.matteColor,
                                 boxShadow: `0 2px 8px ${member.matteColor}30`
                               }} />
                        </div>
                        
                        {/* Bio */}
                        <p className="font-circularweb text-sm md:text-base text-gray-600 mb-6 leading-relaxed relative z-10">
                          {member.bio}
                        </p>

                        {/* Skills Section */}
                        <div className="flex-1 relative z-10">
                          <h4 className="font-robert-medium text-xs uppercase tracking-wider text-gray-500 mb-4">
                            Core Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {member.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1.5 rounded-full text-xs font-circularweb transition-all duration-300 hover:scale-105"
                                style={{ 
                                  background: `${member.matteColor}10`,
                                  border: `1px solid ${member.matteColor}30`,
                                  color: member.matteColor,
                                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)'
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Contact Section */}
                        <div className="mt-6 pt-6 border-t border-gray-200 relative z-10">
                          <p className="font-robert-medium text-xs uppercase tracking-wider text-gray-500 mb-3">
                            Connect
                          </p>
                          <div className="flex gap-3">
                            {Object.entries(member.socials).map(([platform, url]) => (
                              <a
                                key={platform}
                                href={url}
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                                style={{ 
                                  background: '#f5f5f5',
                                  border: `1px solid ${member.matteColor}20`,
                                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)'
                                }}
                                onClick={(e) => e.stopPropagation()}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = `${member.matteColor}15`;
                                  e.currentTarget.style.boxShadow = `0 2px 8px ${member.matteColor}20`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#f5f5f5';
                                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.04)';
                                }}
                              >
                                <i className={`fab fa-${platform} text-sm`} style={{ color: member.matteColor }} />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <section class=" w-full h-full bg-gradient-to-br from-black via-gray-900 to-neutral-800 text-white px-6 py-20 md:px-12 lg:px-24">
  <div class="max-w-6xl mx-auto text-center">
    <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[170px]  leading-tight">
      Build What’s Next.<br class="hidden sm:block">
      </br><span class="text-teal-400">Smarter. Faster. Scalable.</span>
    </h1>
    <p class=" xl:mt-3.5 text-balance  w-full text-center text-base sm:text-lg md:text-xl xl:text-3xl text-gray-300 max-w-3xl mx-auto">
      Empowering businesses with intelligent automation, strategy, and digital transformation. From AI adoption to legacy system modernization—we're your partner in progress.
    </p>
    
  </div>
</section>
      </div>

      {/* Add CSS for additional 3D matte effects */}
      <style jsx = "true">{`
        .card-content {
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-content > div {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        
        /* Add subtle ambient occlusion effect for light theme */
        .card-content::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.03) 100%);
          border-radius: 18px;
          z-index: -1;
        }
        
        /* Hover state enhancement */
        .card-content:hover::before {
          background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.05) 100%);
        }
      `}</style>
    </section>
  );
};

export default Team3DSection;