
import React from 'react';

interface ChatBubbleProps {
  message: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  if (!message) return null;

  return (
  <div className="absolute bottom-full mb-4 z-50 w-[400px] max-w-[700px] animate-pop-in">
    <div className="relative bg-white text-gray-900 font-bold py-2 px-10 border-4 border-gray-900 shadow-[8px_8px_0px_#1f2937] flex items-center justify-center">
      <p className="font-body text-base text-center">{message}</p>

      {/* Pointer */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-[16px] w-0 h-0">
        {/* Pointer border (black) */}
        <div className="absolute w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[14px] border-t-gray-900 -top-px"></div>
        {/* Pointer fill (white) */}
        <div
          className="absolute w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"
          style={{ left: '10px', top: '0px' }}
        ></div>
      </div>
    </div>
  </div>

  );
};