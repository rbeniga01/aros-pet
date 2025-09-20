

import React from 'react';
import { playSound } from '../../services/soundService';

interface UserInputProps {
  userInput: string;
  setUserInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isDisabled?: boolean;
}

export const UserInput: React.FC<UserInputProps> = ({ userInput, setUserInput, onSubmit, isLoading, isDisabled }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading && !isDisabled) {
      onSubmit();
    }
  };
  
  const handleSubmitClick = () => {
    playSound('click');
    onSubmit();
  }

  const getPlaceholderText = () => {
    if (isDisabled) return "Aros is busy...";
    if (isLoading) return "Aros is thinking...";
    return "Say something to Aros...";
  }

  return (
    <div className="flex items-center w-full max-w-md bg-gray-900 border-4 border-gray-700 backdrop-blur-sm shadow-lg">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={getPlaceholderText()}
        disabled={isDisabled || isLoading}
        className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none px-3 py-2 text-sm disabled:bg-gray-800/20"
      />
      <button
        onClick={handleSubmitClick}
        disabled={isDisabled || isLoading || !userInput.trim()}
        className="bg-cyan-500 text-gray-900 p-2 hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none border-l-4 border-gray-700"
        aria-label="Send message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
};