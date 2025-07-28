import React, { useState } from "react";
import ThreeDRotate from "../Backgounds/ThreeDRotate";

const BelieveHeading = () => {
  const [hovered, setHovered] = useState(false);

    return (
      <>
      
      
      
    <div className="min-h-screen   flex items-center justify-center font-mono relative bg-black">
                <ThreeDRotate
                    className = "  w-full h-full object-cover absolute top-0 left-0 right-0 bottom-0 "
                />
      <h2
        className="relative text-[6em] xl:text-[20em] lg:text-[16] md:text-[14em] uppercase text-transparent m-0 p-0 select-none"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        Believe
        {/* Top half */}
        <span
          className="absolute top-0 left-0 text-blue-50 transition-transform duration-500 overflow-hidden"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
            transform: hovered ? "translateY(-18px)" : "none",
          }}
        >
          Believe
        </span>
        {/* Bottom half */}
        <span
          className="absolute top-0 left-0 text-blue-50  transition-transform duration-500 overflow-hidden"
          style={{
            clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
            transform: hovered ? "translateY(18px)" : "none",
          }}
        >
          Believe
        </span>
        {/* "in yourself" bar */}
        <span
          className="absolute left-0 text-black bg-yellow-300 font-medium text-center transition-transform duration-500"
          style={{
            top: "50%",
            width: "91%",
            fontSize: "0.25em",
            fontWeight: 500,
            letterSpacing: "0.7em",
            paddingLeft: "20px",
            marginLeft: "5px",
            transform: hovered
              ? "translateY(-50%) scaleY(1)"
              : "translateY(-50%) scaleY(0)",
          }}
        >
          in yourself
        </span>
      </h2>
            </div>
            </>
  );
};

export default BelieveHeading;