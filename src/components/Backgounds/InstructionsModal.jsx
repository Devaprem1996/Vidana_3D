import React from 'react'
import  { useState, useEffect } from 'react'

const InstructionsModal = () => {
const [showModal, setShowModal] = useState(false);

useEffect(() => {
const hasSeenInstructions = localStorage.getItem('hasSeenPhysicsInstructions');
if (!hasSeenInstructions) {
setShowModal(true);
localStorage.setItem('hasSeenPhysicsInstructions', 'true');
}
}, []);

if (!showModal) return null;

return (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
  <div className="bg-white rounded-lg max-w-md w-full p-6 relative animate-fadeIn">
    <button onClick={()=> setShowModal(false)}
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <h2 className="text-2xl font-bold mb-4">Welcome to Physics Playground!</h2>

    <div className="space-y-3 text-sm text-gray-600">
      <div className="flex items-start gap-3">
        <span className="text-blue-500 mt-0.5">👆</span>
        <p>Drag and drop shapes with your mouse or finger</p>
      </div>

      <div className="flex items-start gap-3 sm:hidden">
        <span className="text-blue-500 mt-0.5">📱</span>
        <p>Tilt your device to control gravity (Advanced mode)</p>
      </div>

      <div className="flex items-start gap-3 sm:hidden">
        <span className="text-blue-500 mt-0.5">🎯</span>
        <p>Shake your device for explosion effect!</p>
      </div>

      <div className="flex items-start gap-3">
        <span className="text-blue-500 mt-0.5">🎨</span>
        <p>Try different color themes for various moods</p>
      </div>

      <div className="flex items-start gap-3">
        <span className="text-blue-500 mt-0.5">⚡</span>
        <p>Enable particle mode for better performance on slower devices</p>
      </div>
    </div>

    <button onClick={()=> setShowModal(false)}
      className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
      Got it!
    </button>
  </div>
</div>
);
};

export default InstructionsModal