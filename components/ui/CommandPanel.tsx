

import React, { useState } from 'react';
import { playSound } from '../../services/soundService';
import { RobotType } from '../../types';

interface Command {
    name: string;
    command: string;
}

interface CommandCategory {
    name: string;
    icon: React.ReactNode;
    commands: Command[];
}

// --- Icons for Categories ---
const MoveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8" />
        <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
    </svg>
);


const InteractionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const ActionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);


// --- Command Data ---
const robotCommandCategories: CommandCategory[] = [
    {
        name: 'Movement',
        icon: <MoveIcon />,
        commands: [
            { name: 'Forward', command: 'move forward' },
            { name: 'Backward', command: 'move backward' },
            { name: 'Left', command: 'go left' },
            { name: 'Right', command: 'go right' },
            { name: 'Dash Forward', command: 'dash forward' },
            { name: 'Hop', command: 'hop in place' },
            { name: 'Shake', command: 'shake' },
            { name: 'Wobble', command: 'wobble' },
            { name: 'Circle Around', command: 'circle around' },
            { name: 'Zigzag', command: 'zigzag' },
        ]
    },
    {
        name: 'Interaction',
        icon: <InteractionIcon />,
        commands: [
            { name: 'Explore', command: 'explore' },
            { name: 'Stop Exploring', command: 'stop exploring' },
            { name: 'Follow Me', command: 'follow me' },
            { name: 'Guard Mode', command: 'guard mode' },
            { name: 'Return Home', command: 'return home' },
            { name: 'Peek', command: 'peek' },
            { name: 'Hide', command: 'hide' },
            { name: 'Jump Scare', command: 'jump scare' },
            { name: 'Float Around', command: 'float around' },
            { name: 'Dance', command: 'dance' },
        ]
    },
    {
        name: 'Actions',
        icon: <ActionIcon />,
        commands: [
            { name: 'Sing a Song', command: 'sing a song' },
            { name: 'Eat Chip', command: 'eat chip' },
            { name: 'Drink Oil', command: 'drink oil' },
            { name: 'Bang!', command: 'bang' },
            { name: 'Laser Eyes', command: 'laser eyes' },
            { name: 'Demon Eyes', command: 'demon eyes' },
            { name: 'Facepalm', command: 'facepalm' },
            { name: 'Take Photo', command: 'take a photo' },
            { name: 'Charge', command: 'charge' },
            { name: 'Stop Charging', command: 'stop charging' },
            { name: 'Check Battery', command: "what's the battery level" },
        ]
    }
];

const slimeCommandCategories: CommandCategory[] = [
    {
        name: 'Movement',
        icon: <MoveIcon />,
        commands: [
            { name: 'Ooze Forward', command: 'move forward' },
            { name: 'Slide Left', command: 'go left' },
            { name: 'Slide Right', command: 'go right' },
            { name: 'Squish Hop', command: 'squish hop' },
            { name: 'Return Home', command: 'return home' },
        ]
    },
    {
        name: 'Interaction',
        icon: <InteractionIcon />,
        commands: [
            { name: 'Explore', command: 'explore' },
            { name: 'Stop Exploring', command: 'stop exploring' },
            { name: 'Follow Me', command: 'follow me' },
            { name: 'Stick to Wall', command: 'stick to wall' },
            { name: 'Melt Down', command: 'melt down' },
        ]
    },
    {
        name: 'Actions',
        icon: <ActionIcon />,
        commands: [
            { name: 'Stretch', command: 'stretch' },
            { name: 'Splatter', command: 'splatter' },
            { name: 'Split Clone', command: 'split clone' },
            { name: 'Slime Wave', command: 'slime wave' },
            { name: 'Dance', command: 'dance' },
            { name: 'Slime Cannon', command: 'slime cannon' },
            { name: 'Transparent Mode', command: 'transparent mode' },
            { name: 'Glow Mode', command: 'glow mode' },
            { name: 'Absorb Chip', command: 'eat chip' },
        ]
    }
];


// --- Subcomponents ---
interface CommandPanelProps {
    onCommandSelect: (command: string) => void;
    isDisabled: boolean;
    robotType: RobotType;
}

interface CommandCategoryPanelProps {
    commands: Command[];
    onCommandSelect: (command: string) => void;
    isOpen: boolean;
}

const CommandCategoryPanel: React.FC<CommandCategoryPanelProps> = ({ commands, onCommandSelect, isOpen }) => (
     <div 
        className={`absolute left-full ml-4 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}
    >
        <div className="bg-gray-900/80 backdrop-blur-sm border-4 border-gray-700 p-2 rounded-lg shadow-[8px_8px_0px_#1f2937] max-h-96 overflow-y-auto">
             <div className="flex flex-col gap-2">
                {commands.map((cmd, index) => (
                    <button
                        key={cmd.name}
                        onClick={() => onCommandSelect(cmd.command)}
                        title={cmd.name}
                        className={`w-full p-2 flex items-center justify-center bg-gray-700 hover:bg-cyan-600 rounded-lg border-2 border-gray-900 shadow-[4px_4px_0px_#1f2937] transition-all duration-300 transform text-white hover:text-cyan-200 hover:scale-105 ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
                        style={{ transitionDelay: isOpen ? `${index * 20}ms` : '0ms' }}
                    >
                        <span className="font-body text-sm whitespace-nowrap">{cmd.name}</span>
                    </button>
                ))}
            </div>
        </div>
    </div>
);


// --- Main Component ---
export const CommandPanel: React.FC<CommandPanelProps> = ({ onCommandSelect, isDisabled, robotType }) => {
    const [openPanel, setOpenPanel] = useState<string | null>(null);

    const handleToggle = (panelName: string) => {
        if (isDisabled) return;
        playSound('click');
        setOpenPanel(current => (current === panelName ? null : panelName));
    };
    
    const handleSelect = (command: string) => {
        playSound('click');
        onCommandSelect(command);
        setOpenPanel(null);
    }
    
    const commandCategories = robotType === 'slime' ? slimeCommandCategories : robotCommandCategories;

    const categoryColors: { [key: string]: string } = {
        'Movement': 'text-blue-400 hover:text-blue-300 hover:border-blue-500',
        'Interaction': 'text-yellow-400 hover:text-yellow-300 hover:border-yellow-500',
        'Actions': 'text-purple-400 hover:text-purple-300 hover:border-purple-500',
    };

    return (
        <>
            {commandCategories.map(category => (
                <div key={category.name} className="relative flex items-center">
                     <button
                        onClick={() => handleToggle(category.name)}
                        disabled={isDisabled}
                        className={`relative w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full border-4 border-gray-700 shadow-lg transition-transform duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${categoryColors[category.name]}`}
                        aria-label={`Toggle ${category.name} commands`}
                        title={`${category.name} Commands`}
                    >
                        {category.icon}
                    </button>
                    <CommandCategoryPanel 
                        commands={category.commands}
                        onCommandSelect={handleSelect}
                        isOpen={openPanel === category.name} 
                    />
                </div>
            ))}
        </>
    );
};