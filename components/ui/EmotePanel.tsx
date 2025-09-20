

import React, { useState } from 'react';
import { Expression } from '../../types';
import { playSound } from '../../services/soundService';

export interface Emote {
    name: string;
    icon: React.ReactNode;
    expression: Expression;
    message: string;
}

// Main Toggle Icons (h-6 w-6)
const PositiveToggleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const NegativeToggleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// Custom Pixel-Art Emote Icons (16x16 grid)
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
        {children}
    </svg>
);

const HappyEmoteIcon = () => (
    <IconWrapper>
        <path d="M4 6H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 6H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 10C5 10 6.5 11.5 8 11.5C9.5 11.5 11 10 11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </IconWrapper>
);
const LoveEmoteIcon = () => (
    <IconWrapper>
        <path d="M8.00001 4.66666C6.89168 3.55833 5.09168 3.55833 4.00001 4.66666C2.90834 5.775 2.90834 7.575 4.00001 8.66666L8.00001 12.6667L12 8.66666C13.0917 7.575 13.0917 5.775 12 4.66666C10.9083 3.55833 9.10834 3.55833 8.00001 4.66666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </IconWrapper>
);
const ExcitedEmoteIcon = () => (
     <IconWrapper>
        <path d="M4.5 5.5L3 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.5 5.5L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 7H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 11C4 11 6 13 8 13C10 13 12 11 12 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </IconWrapper>
);
const PlayfulEmoteIcon = () => (
    <IconWrapper>
        <path d="M4 6H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 6L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 10C5.16667 11.3333 6.3 12 8 12C9.7 12 10.8333 11.3333 11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </IconWrapper>
);
const ProudEmoteIcon = () => (
    <IconWrapper>
        <path d="M3 6.5H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 6.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.5 10.5C6 10 7 10 8 10C9 10 10 10 10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </IconWrapper>
);
const CuriousEmoteIcon = () => (
    <IconWrapper>
        <path d="M6 5.33333C6 4.44167 6.775 3.66667 7.66667 3.66667C8.55833 3.66667 9.33333 4.44167 9.33333 5.33333C9.33333 6.225 8.5 6.5 8 7.33333V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 11.3333H8.00667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </IconWrapper>
);
const SurprisedEmoteIcon = () => (
    <IconWrapper>
        <path d="M4.5 5.5C4.5 4.94772 4.94772 4.5 5.5 4.5C6.05228 4.5 6.5 4.94772 6.5 5.5C6.5 6.05228 6.05228 6.5 5.5 6.5C4.94772 6.5 4.5 6.05228 4.5 5.5Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10.5 5.5C10.5 4.94772 10.9477 4.5 11.5 4.5C12.0523 4.5 12.5 4.94772 12.5 5.5C12.5 6.05228 12.0523 6.5 11.5 6.5C10.9477 6.5 10.5 6.05228 10.5 5.5Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6.5 10.5C6.5 9.94772 6.94772 9.5 7.5 9.5H8.5C9.05228 9.5 9.5 9.94772 9.5 10.5C9.5 11.0523 9.05228 11.5 8.5 11.5H7.5C6.94772 11.5 6.5 11.0523 6.5 10.5Z" stroke="currentColor" strokeWidth="1.5"/>
    </IconWrapper>
);
const RelaxedEmoteIcon = () => (
    <IconWrapper>
        <path d="M4 7C4 7 5 6 6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 7C10 7 11 6 12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 10.5C5 10.5 6.5 11.5 8 11.5C9.5 11.5 11 10.5 11 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </IconWrapper>
);
const SadEmoteIcon = () => (
    <IconWrapper>
        <path d="M4 7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 7H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 11C5 11 6.5 9.5 8 9.5C9.5 9.5 11 11 11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </IconWrapper>
);
const CryEmoteIcon = () => (
    <IconWrapper>
        <path d="M4 7C4 7 4.5 8 5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 7C11 7 11.5 8 12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 9.5V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 11C5 11 6.5 9.5 8 9.5C9.5 9.5 11 11 11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </IconWrapper>
);
const AngryEmoteIcon = () => (
     <IconWrapper>
        <path d="M6 6L4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 6L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 11C5 11 6.5 9.5 8 9.5C9.5 9.5 11 11 11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </IconWrapper>
);
const FrustratedEmoteIcon = () => (
    <IconWrapper>
        <path d="M6 6L4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 6L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 11L7 10L9 11L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </IconWrapper>
);
const ConfusedEmoteIcon = () => (
    <IconWrapper>
        <path d="M6 5.33333C6 4.44167 6.775 3.66667 7.66667 3.66667C8.55833 3.66667 9.33333 4.44167 9.33333 5.33333C9.33333 6.225 8.5 6.5 8 7.33333V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 11.3333H8.00667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </IconWrapper>
);
const TiredEmoteIcon = () => (
    <IconWrapper>
        <path d="M4 7H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 7H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 10C6 10 7 11.5 8 11.5C9 11.5 10 10 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </IconWrapper>
);
const ScaredEmoteIcon = () => (
    <IconWrapper>
        <path d="M4.5 6C4.5 5.44772 4.94772 5 5.5 5C6.05228 5 6.5 5.44772 6.5 6C6.5 6.55228 6.05228 7 5.5 7C4.94772 7 4.5 6.55228 4.5 6Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10.5 6C10.5 5.44772 10.9477 5 11.5 5C12.0523 5 12.5 5.44772 12.5 6C12.5 6.55228 12.0523 7 11.5 7C10.9477 7 10.5 6.55228 10.5 6Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 11L7 10L9 11L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </IconWrapper>
);
const EmbarrassedEmoteIcon = () => (
    <IconWrapper>
        <path d="M4 7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 7H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 10H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 8.5H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </IconWrapper>
);


const positiveEmotes: Emote[] = [
    { name: 'Happy', icon: <HappyEmoteIcon />, expression: Expression.Happy, message: 'Yay!' },
    { name: 'Excited', icon: <ExcitedEmoteIcon />, expression: Expression.Excited, message: 'Wow!' },
    { name: 'Playful', icon: <PlayfulEmoteIcon />, expression: Expression.Playful, message: 'Hehe!' },
    { name: 'Curious', icon: <CuriousEmoteIcon />, expression: Expression.Confuse, message: 'Oh?' },
    { name: 'Loving', icon: <LoveEmoteIcon />, expression: Expression.Loving, message: '<3' },
    { name: 'Proud', icon: <ProudEmoteIcon />, expression: Expression.Proud, message: 'Hmph.' },
    { name: 'Surprised', icon: <SurprisedEmoteIcon />, expression: Expression.Surprised, message: 'Whoa!' },
    { name: 'Relaxed', icon: <RelaxedEmoteIcon />, expression: Expression.Relaxed, message: 'Ahh...' },
];

const negativeEmotes: Emote[] = [
    { name: 'Sad', icon: <SadEmoteIcon />, expression: Expression.Sad, message: 'Oh no...' },
    { name: 'Crying', icon: <CryEmoteIcon />, expression: Expression.Cry, message: '*Sniff*' },
    { name: 'Angry', icon: <AngryEmoteIcon />, expression: Expression.Angry, message: 'Grrr!' },
    { name: 'Frustrated', icon: <FrustratedEmoteIcon />, expression: Expression.Frustrated, message: 'Ugh!' },
    { name: 'Confused', icon: <ConfusedEmoteIcon />, expression: Expression.Confuse, message: 'Hmm...' },
    { name: 'Tired', icon: <TiredEmoteIcon />, expression: Expression.Tired, message: '*Yawn*' },
    { name: 'Scared', icon: <ScaredEmoteIcon />, expression: Expression.Scared, message: 'Yikes!' },
    { name: 'Embarrassed', icon: <EmbarrassedEmoteIcon />, expression: Expression.Embarrassed, message: '...' },
];


interface EmotePanelProps {
    onEmoteSelect: (emote: Emote) => void;
    isDisabled: boolean;
}

interface EmoteCategoryProps {
    emotes: Emote[];
    onEmoteSelect: (emote: Emote) => void;
    isOpen: boolean;
}

const EmoteCategoryPanel: React.FC<EmoteCategoryProps> = ({ emotes, onEmoteSelect, isOpen }) => {
    return (
        <div 
            className={`absolute left-full ml-4 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}
        >
            <div className="bg-gray-900/80 backdrop-blur-sm border-4 border-gray-700 p-2 rounded-lg shadow-[8px_8px_0px_#1f2937]">
                 <div className="flex flex-col gap-2">
                    {emotes.map((emote, index) => (
                        <button
                            key={emote.name}
                            onClick={() => onEmoteSelect(emote)}
                            title={emote.name}
                            className={`w-full p-2 flex items-center gap-2 bg-gray-700 hover:bg-cyan-600 rounded-lg border-2 border-gray-900 shadow-[4px_4px_0px_#1f2937] transition-all duration-300 transform text-white hover:text-cyan-200 hover:scale-105 ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
                            style={{ transitionDelay: isOpen ? `${index * 30}ms` : '0ms' }}
                        >
                            {emote.icon}
                            <span className="font-body text-sm">{emote.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};


export const EmotePanel: React.FC<EmotePanelProps> = ({ onEmoteSelect, isDisabled }) => {
    const [openPanel, setOpenPanel] = useState<'positive' | 'negative' | null>(null);

    const handleToggle = (panel: 'positive' | 'negative') => {
        if (isDisabled) return;
        playSound('click');
        setOpenPanel(current => (current === panel ? null : panel));
    };
    
    const handleSelect = (emote: Emote) => {
        onEmoteSelect(emote);
        setOpenPanel(null);
    }

    return (
        <>
            {/* Positive Emotes */}
            <div className="relative flex items-center">
                <button
                    onClick={() => handleToggle('positive')}
                    disabled={isDisabled}
                    className="relative w-10 h-10 flex items-center justify-center text-green-400 bg-gray-800 rounded-full border-4 border-gray-700 shadow-lg transition-transform duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed hover:text-green-300 hover:border-green-500"
                    aria-label="Toggle positive emote panel"
                    title="Positive Reactions"
                >
                    <PositiveToggleIcon />
                </button>
                <EmoteCategoryPanel 
                    emotes={positiveEmotes} 
                    onEmoteSelect={handleSelect} 
                    isOpen={openPanel === 'positive'} 
                />
            </div>
            {/* Negative Emotes */}
            <div className="relative flex items-center">
                <button
                    onClick={() => handleToggle('negative')}
                    disabled={isDisabled}
                    className="relative w-10 h-10 flex items-center justify-center text-red-400 bg-gray-800 rounded-full border-4 border-gray-700 shadow-lg transition-transform duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed hover:text-red-300 hover:border-red-500"
                    aria-label="Toggle negative emote panel"
                    title="Negative Reactions"
                >
                    <NegativeToggleIcon />
                </button>
                 <EmoteCategoryPanel 
                    emotes={negativeEmotes} 
                    onEmoteSelect={handleSelect} 
                    isOpen={openPanel === 'negative'} 
                />
            </div>
        </>
    );
};