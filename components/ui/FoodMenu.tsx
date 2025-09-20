

import React from 'react';
import { playSound } from '../../services/soundService';

interface FoodMenuProps {
    onFeed: (food: string) => void;
    onClose: () => void;
}

const FoodItem: React.FC<{ emoji: string; name: string; onClick: () => void }> = ({ emoji, name, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-2 p-3 bg-gray-700/80 hover:bg-cyan-500/50 rounded-lg transition-colors duration-200 border-2 border-gray-600 hover:border-cyan-400"
    >
        <span className="text-4xl">{emoji}</span>
        <span className="font-body text-sm text-gray-200">{name}</span>
    </button>
);

export const FoodMenu: React.FC<FoodMenuProps> = ({ onFeed, onClose }) => {
    
    const handleFeed = (food: string) => {
        playSound('click');
        onFeed(food);
    }
    
    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30 animate-fadeIn" onClick={onClose}>
            <div 
                className="bg-gray-800 border-4 border-gray-700 p-6 shadow-lg shadow-cyan-500/20"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the menu
            >
                <h3 className="font-display text-xl text-cyan-300 mb-6 text-center">Feed Aros a Snack!</h3>
                <div className="grid grid-cols-3 gap-4">
                    <FoodItem emoji="🔋" name="Battery" onClick={() => handleFeed('battery')} />
                    <FoodItem emoji="💧" name="Oil Can" onClick={() => handleFeed('oil can')} />
                    <FoodItem emoji="🍪" name="Chip" onClick={() => handleFeed('chip')} />
                </div>
            </div>
        </div>
    );
};