import React, { useRef, useState,useEffect } from 'react'
import Buttons from './Button';
import { TiLocationArrow } from 'react-icons/ti';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import TextPressure from './TextEffects/TextPressure';
import SplitText from './TextEffects/SplitText';
import SplashCursor from './Cursors/SplashCursor';





gsap.registerPlugin(ScrollTrigger);

const Hero = () => {

  // splash cursor components variable
  const heroRef = useRef(null);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const isInHero = 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom;
      
      setShowSplash(isInHero);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  

    // contains all the state variables
    const [currentIndex, setCurrentIndex] = useState(1);
    const [hasClicked, setHasClicked] = useState(false);

    const [loading, setLoading] = useState(true);
    const [loadedVideos, setLoadedVideos] = useState(0);

    // how many videos we have
    const totalVideos = 3;
    // useRef is used to access the DOM element
    const nextVideoRef = useRef(null);
    // handling the video load event by adding ++1 to the state variable
    
    const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);


    }

    // upcoming video index is calcutating by currentIndex and totalVideos variables
    // to prevent the index goes belong the totalvideos we have
   


     useEffect(() => {
    if (loadedVideos === totalVideos - 1) {
      setLoading(false);
    }
  }, [loadedVideos]);
    
    // handles click to setCurrentIndex by upcomingvideoIndex value 
    // this keeps changing the videos 
    const handleMiniVdClick = () => {
        setHasClicked(true);
        setCurrentIndex((prevIndex)=>(prevIndex % totalVideos) + 1);
    }

    // to set the zooming effect in clickable area
    useGSAP(
        () => {
        if (hasClicked) {
            gsap.set('#next-video', { Visibility: 'visible' });
            
            gsap.to('#next-video', {
                transformOrigin: 'center center',
                scale: 1,
                width: "100%",
                height: '100%',
                duration: 1,
                ease: 'power1.inOut',
                onStart: () =>
                    nextVideoRef.current.play(),
            });

            gsap.from('#current-video', {
                transformOrigin: 'center center',
                scale: 0,
                duration: 1.5,
                ease: 'power1.inOut',
                
            })
        }
        }
    ,{dependencies:[currentIndex], revertOnUpdate: true})

    
  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

   


    // get video src from dictory based on the index value
    const getVideoSrc = (index) => `/videos/hero-${index}.mp4`



    
   
  
  return (
      <>
      {showSplash &&
       <SplashCursor
  SIM_RESOLUTION={144} // Higher for quality
  DYE_RESOLUTION={1440}           // Lower for performance
  CAPTURE_RESOLUTION={10}
  DENSITY_DISSIPATION={3.5}      // No dye at all
  VELOCITY_DISSIPATION={1}    // Only velocity simulation
  PRESSURE={0}
  PRESSURE_ITERATIONS={1}
  CURL={0.1}
  SPLAT_RADIUS={0.1}
  SPLAT_FORCE={6000}
  SHADING={false}
  COLOR_UPDATE_SPEED={500}
  BACK_COLOR={{ r: 0, g: 0, b: 0, a: 5 }}
  TRANSPARENT={true}
/>}
      
      <section
        ref={heroRef}
        className='relative flex h-dvh w-screen flex-col items-center justify-center overflow-hidden bg-bluer-75' 
        id="hero"
        style={{ cursor: showSplash ? 'none' : 'auto' }}
      >
        <div className='relative h-dvh w-screen overflow-x-hidden'>
            
          <div id="video-frame" className='relative z-10 h-dvh w-screen overflow-hidden rounded-lg  bg-bluer-75 '>
            <div className='mask-clip-path absolute-center px-2 py-1.5  absolute z-50 size-64 cursor-pointer overflow  '>
                        <div onClick={handleMiniVdClick}
                            className='origin-center scale-50 
                            opacity-0 transition-all  duration=200 ease-in ' >
                            <video
                                loop
                                muted
                                ref={nextVideoRef}
                                src={getVideoSrc((currentIndex % totalVideos) + 1)}
                                id='current-video'
                                className='size-64 origin-center scale-150 object-cover object-center'
                                onLoadedData={handleVideoLoad}

                            />
                     </div>
                    </div>
                    <video
                        ref={nextVideoRef}
                        src={getVideoSrc(currentIndex)}
                        loop
                        muted
                        id='next-video'
                        className='absolute-center invisible absolute z-20 size-64  
                        object-cover object-center '
                        onLoadedData={handleVideoLoad}
                    />
                    <video
                        src={getVideoSrc(currentIndex === totalVideos - 1 ? 1 : currentIndex)}
                        autoPlay
                        loop
                        muted
                        className='absolute left-0 top-0 size-full object-cover object-center'
                        onLoadedData={handleVideoLoad}
                    />
                    <h1 >
    
                          <SplitText
  text="CONSULTING"
  className="className='font-zentry-regular italic
                    uppercase    text-5xl sm:right-10 sm:text-3xl md:text-5xl lg:text-[4rem]
                     absolute bottom-5 right-5  text-[#ffffff] "
  delay={100}
  duration={2}
  ease="power3.out"
  splitType="chars"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="center"
  
                                 />
      
                    </h1>
                    <div className='absolute left-0 top -0 z-40 size-full'>
                        <div className='mt-24 px-5 sm:px-10'>
                            <h1 className='font-zentry-regular uppercase
                               text-5xl font-zentry sm:right-10 sm:text-7xl
                             md:text-9xl lg:text-[12rem] text-bluer-100'>
                               <TextPressure
                                 text="Vidana"
                                 flex={true}
                   alpha={false}
                          stroke={false}
                  width={true}
              weight={true}
                  italic={true}
                  textColor="#ffffff"
                strokeColor="#ff0000"
                minFontSize={36}
                /> 
                            </h1>
                            <p className='mb-5 max-w-64 font-aeonik-400 text-bluer-100'>We create high quality
                                & <br /> inovative solution </p>
                            <Buttons id="connect" title="connect"
                                leftIcon={<TiLocationArrow />}
                            containerClass ="!bg-yellow-300 flex-center gap-1"/>

                        </div>
          </div>
          
                
            </div>
            
        <h1  >
          <SplitText
  text="CONSULTING"
  className="className='font-zentry-regular italic
                    uppercase    text-5xl sm:right-10 sm:text-3xl md:text-5xl lg:text-[4rem]
                     absolute bottom-5 right-5  text-black '"
  delay={100}
  duration={0.6}
  ease="power3.out"
  splitType="chars"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="center"
  
/>
                       
                      
                </h1>
            
               
        </div>
        </section>
            </>
     
  )
}

export default Hero