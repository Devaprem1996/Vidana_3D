import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "./AnimatedTitle";
import SplitText from "./TextEffects/SplitText";



gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-3xl  ">
          About us
        </p>

          <SplitText
  text="Accelerating Growth Through Strategy, Intelligence & Technology"
  className="  text-center  *:text-gray-950  flex flex-col gap-2 text-4xl   text-white sm:px-32  md:text-[6rem]  "
  delay={100}
  duration={0.6}
  ease="power3.out"
  splitType="words"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  textAlign="center"
 
/>
        
        <div className="about-subtext">
          <p>Welcome to Vidana Consulting Private Limited</p>
          <p className="text-gray-500">
            India-born, globally focused—a powerhouse where innovation meets execution. Step into a world where
            complex enterprise tech like SAP, AI, IoT, and automation isn’t
            just implemented—it’s transformed into beautiful, intuitive,
            and scalable digital ecosystems.
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
                  <iframe
                      src='https://my.spline.design/rocket-P0RXQBDK02YnVEqjF7fXLdVo/'
                      width='100%'
                      height='100%'
                      className="absolute left-0 top-0 size-full object-cover"
                      alt="Background"
                  >
                      </iframe>
                 
                  
        </div>
        
      </div>
    </div>
  );
};

export default About;

/*<AnimatedTitle
                  title="Emp<b>o</b>wering Digital Frontiers<br /> Where Vision <b>Be</b>comes Intelligent Reality."
          containerClass="mt-5 !text-black text-center"
        /> */