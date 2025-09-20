

import React from 'react';
import { playSound } from '../../services/soundService';
import { RobotType } from '../../types';

// Simplified previews
const ArosPreview = () => (
    <div className="w-16 h-12 bg-gray-800 border-2 border-gray-700 flex items-center justify-center gap-2">
        <div className="w-4 h-4 bg-gray-100 border border-gray-900"><div className="w-2 h-2 bg-gray-800 mx-auto mt-1"></div></div>
        <div className="w-4 h-4 bg-gray-100 border border-gray-900"><div className="w-2 h-2 bg-gray-800 mx-auto mt-1"></div></div>
    </div>
);

const CutePreview = () => (
    <div className="w-16 h-12 bg-pink-200 border-2 border-pink-400 rounded-lg flex items-center justify-center gap-2">
        <div className="w-5 h-5 bg-white border-2 border-pink-400 rounded-full"><div className="w-3 h-3 bg-black mx-auto mt-1 rounded-full"></div></div>
        <div className="w-5 h-5 bg-white border-2 border-pink-400 rounded-full"><div className="w-3 h-3 bg-black mx-auto mt-1 rounded-full"></div></div>
    </div>
);

const SlimePreview = () => (
    <div 
        className="w-16 h-12 bg-cyan-300/60 border-2 border-cyan-200/70 flex items-center justify-center"
        style={{ borderRadius: '60% 60% 45% 45% / 75% 75% 35% 35%' }}
    >
        <div className="relative w-8 h-8 bg-cyan-400/40 rounded-full">
            <div className="absolute w-2 h-2 bg-blue-900/70 rounded-full" style={{ top: '30%', left: '25%' }}></div>
            <div className="absolute w-2 h-2 bg-blue-900/70 rounded-full" style={{ top: '30%', right: '25%' }}></div>
            <div className="absolute w-2 h-2 bg-blue-900/70 rounded-full" style={{ bottom: '25%', left: '50%', transform: 'translateX(-50%)' }}></div>
        </div>
    </div>
);


const types: { id: RobotType, name: string, preview: React.ReactNode }[] = [
    { id: 'aros', name: 'Aros', preview: <ArosPreview /> },
    { id: 'cute', name: 'Cute', preview: <CutePreview /> },
    { id: 'slime', name: 'Slime', preview: <SlimePreview /> },
];

interface TypeSelectorModalProps {
    onSelect: (type: RobotType) => void;
    onClose: () => void;
    currentType: RobotType;
}

export const TypeSelectorModal: React.FC<TypeSelectorModalProps> = ({ onSelect, onClose, currentType }) => {
    
    const handleClose = () => {
        playSound('click');
        onClose();
    };

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30 animate-fadeIn" onClick={handleClose}>
            <div 
                className="bg-gray-800 border-4 border-gray-700 p-6 shadow-lg shadow-cyan-500/20"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the menu
            >
                <h3 className="font-display text-xl text-cyan-300 mb-6 text-center">Change Robot Style</h3>
                <div className="grid grid-cols-3 gap-4">
                    {types.map(type => (
                        <button
                            key={type.id}
                            onClick={() => onSelect(type.id)}
                            className={`flex flex-col items-center gap-2 p-3 bg-gray-700/80 hover:bg-cyan-500/50 rounded-lg transition-colors duration-200 border-2 ${currentType === type.id ? 'border-cyan-400' : 'border-gray-600 hover:border-cyan-400'}`}
                        >
                            {type.preview}
                            <span className="font-body text-sm text-gray-200">{type.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};