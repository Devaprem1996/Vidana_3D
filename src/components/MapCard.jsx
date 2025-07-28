import { useState, useEffect } from 'react';
 
export default function MapCard({ address = "123 Main Street, San Francisco, CA", mapRef, handleTilt, resetTilt }) {
  const [mapSrc, setMapSrc] = useState('');
 
  useEffect(() => {
    // Encode the address for URL
    const encodedAddress = encodeURIComponent(address);
    
    // Generate the Google Maps embed URL
    // Note: You should store your API key in environment variables
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
                   import.meta.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                   
    
    if (apiKey) {
      // Use Google Maps Embed API with key
      const newMapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`;
      setMapSrc(newMapSrc);
    } else {
      // Fallback to free embed without API key
      const newMapSrc = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      setMapSrc(newMapSrc);
    }
  }, [address]);

  return (
    <div
      ref={mapRef}
      className="relative flex flex-col justify-center items-center"
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
        minHeight: "420px",
        transition: "transform 0.3s ease-out",
      }}
      onMouseMove={(e) => handleTilt(e, mapRef)}
      onMouseLeave={() => resetTilt(mapRef)}
    >
      <div
        className="w-full h-80 md:h-full bg-white/10 border-hsla rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md"
        style={{
          transformStyle: "preserve-3d",
          boxShadow: "0 8px 40px 0 rgba(79,183,221,0.15)",
          minHeight: "420px",
        }}
      >
        {mapSrc && (
          <iframe
            title="Google Map"
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "320px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          ></iframe>
        )}
      </div>
      <div className="mt-6 text-center text-white/70 font-circularweb text-xs">
        <span className="block mb-1">Our Office</span>
        <span>{address}</span>
      </div>
    </div>
  );
}