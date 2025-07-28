import React, { useRef } from 'react';
import InfiniteClientsText from './TextEffects/InfiniteClientsText';
import FallingText from './TextEffects/FallingText ';

const Client = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full h-screen min-h-screen  bg-gradient-to-b from-white to-90% overflow-hidden flex flex-col"
    >
      {/* Main container with better spacing */}
      <div className="relative z-10 w-full flex flex-col flex-grow">
        {/* Header section with title */}
        <header className="w-full px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16 lg:pt-20">
          <h1 
            ref={titleRef}
            className="font-general text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 
                     text-gray-900 text-center font-bold tracking-tight
                     leading-[1.1] sm:leading-[1.1] md:leading-[1.1]"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            Our Partners
          </h1>
          
          {/* Subtitle */}
          <p className="mt-4 text-center font-circularweb text-base sm:text-lg md:text-xl 
                       text-gray-600 max-w-2xl mx-auto px-4">
            We're proud to partner with industry leaders who trust us to deliver exceptional results.
          </p>
          <div className="mt-auto" >
            <InfiniteClientsText />
          </div>
        </header>
        {/* Falling text effect fills the bottom */}
        <div className="flex-grow flex items-end w-full min-h-[50vh]">
          <FallingText
            text={`At Vidana Consulting, we empower businesses to evolve faster and operate smarter. Our multidisciplinary expertise spans business strategy, digital innovation, and advanced automation. From stabilizing operations to driving full-scale digital transformation, we deliver scalable, intelligent solutions that align with your mission and future goals. Whether you're adopting AI, modernizing legacy systems, or launching new technologies—we're your partner in building what's next.`}
            highlightWords={["Vidana", "Consulting", "expertise", "innovation", "future"]}
            highlightClass="highlighted"
            trigger="click" // Change to "hover" for hover effect
            backgroundColor="transparent"
            wireframes={false}
            gravity={0.56}
            fontSize="clamp(1rem, 4vw, 2.5rem)"
            mouseConstraintStiffness={0.9}
          />
        </div>
      </div>
    </section>
  );
};

export default Client;