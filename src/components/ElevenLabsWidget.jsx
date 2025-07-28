import React, { useEffect } from 'react';

const ElevenLabsWidget = () => {
  useEffect(() => {
    if (!document.getElementById('elevenlabs-convai-script')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      script.id = 'elevenlabs-convai-script';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <elevenlabs-convai agent-id="agent_01jyxrm26yef7bsze4sw4gmtvb"></elevenlabs-convai>
    </div>
  );
};

export default ElevenLabsWidget;