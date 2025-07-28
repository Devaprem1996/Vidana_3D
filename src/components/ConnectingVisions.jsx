// Updated ConnectingVisions component with better scroll space
import ParallaxLines from './ParallaxLines';
import MouseTrail from './MouseTrail';
import Particles from './Backgounds/particles'  

const ConnectingVisions = () => {
  return (
    // CHANGED: Increased height for more scroll space
    <div className="relative  w-full min-h-[100vh]">
      {/* Mouse trail */}
      <MouseTrail />

      {/* Sticky parallax section */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Matte Pattern Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: "#000000",
           
            backgroundRepeat: "repeat",
          }}
        />
        {/* WebGL Particles Container */}
          <div className="absolute inset-0 z-[1] pointer-events-none overflow-ellipsis">
            <Particles
                particleCount={1000}
              particleSpread={10}
              speed={4}
            particleColors={["#f8ef00"]}
              moveParticlesOnHover={true}
              particleHoverFactor={7}
              alphaParticles={true}
              particleBaseSize={200}
              sizeRandomness={0.8}
              cameraDistance={30}
              disableRotation={false}
            enableScrollEffects={false}
              performanceMode="auto"
              className="w-full h-full"
            />
          </div>
        {/* Big Matte Parallax Line */}
        <ParallaxLines />
        

        {/* Optional centered content */}
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="text-center">
            <h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl xl:text-[180px] text-white    mb-4">
              Connecting Visions
            </h3>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-8 text-amber-200 font-circularweb">
              Where stories meet innovation
            </p>
          </div>
        </div>
        
      </div>

      

      
    </div>
  );
};

export default ConnectingVisions;