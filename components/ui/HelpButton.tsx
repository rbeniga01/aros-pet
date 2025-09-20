

import React from 'react';

interface HelpButtonProps {
  onShowHelp: () => void;
}

export const HelpButton: React.FC<HelpButtonProps> = ({ onShowHelp }) => (
  <button
    onClick={onShowHelp}
    className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-gray-700/70 text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors font-display text-xl"
    aria-label="Show help"
    title="Show available commands"
  >
    ?
  </button>
);