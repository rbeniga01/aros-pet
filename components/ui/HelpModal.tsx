

import React from 'react';
import { playSound } from '../../services/soundService';
import { RobotType } from '../../types';

interface HelpModalProps {
    onClose: () => void;
    robotType: RobotType;
}

const Command: React.FC<{ command: string; description: string; }> = ({ command, description }) => (
    <li className="flex flex-col sm:flex-row items-baseline gap-2 mb-2">
        <code className="bg-gray-900 text-cyan-300 py-1 px-2 text-sm whitespace-nowrap">{command}</code>
        <span className="text-gray-300 font-body text-sm">- {description}</span>
    </li>
);

const RobotCommands: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className="mb-4">
            <h4 className="font-display text-lg text-blue-300 mb-3 border-b-2 border-blue-300/30 pb-1">Core Commands</h4>
            <ul className="list-none">
                <Command command="Move forward" description="Glides closer with a steady zoom-in." />
                <Command command="Move backward" description="Drifts smoothly farther away." />
                <Command command="Go left" description="Slides gracefully to the left." />
                <Command command="Go right" description="Shifts smoothly to the right." />
            </ul>
        </div>

        <div className="mb-4">
            <h4 className="font-display text-lg text-yellow-300 mb-3 border-b-2 border-yellow-300/30 pb-1">Advanced Commands</h4>
            <ul className="list-none">
                <Command command="Circle around" description="Orbits smoothly around the center." />
                <Command command="Zigzag" description="Dashes forward with playful side shifts." />
                <Command command="Dash forward" description="Bursts forward fast, then halts." />
                <Command command="Hop in place" description="Bounces up and down rhythmically." />
                <Command command="Shake" description="Quivers side-to-side sharply." />
                <Command command="Wobble" description="Rocks gently left and right." />
            </ul>
        </div>
        
        <div className="mb-4">
            <h4 className="font-display text-lg text-green-300 mb-3 border-b-2 border-green-300/30 pb-1">Exploration / Interaction</h4>
            <ul className="list-none">
                <Command command="Explore!" description="Wanders unpredictably in free roam." />
                <Command command="Stop exploring" description="Freezes instantly, cancels wander." />
                <Command command="Follow me" description="Tracks your cursor or touch input." />
                <Command command="Guard mode" description="Holds center, focused and alert." />
                <Command command="Return home" description="Glides smoothly back to its default spot." />
            </ul>
        </div>

        <div className="mb-4">
            <h4 className="font-display text-lg text-purple-300 mb-3 border-b-2 border-purple-300/30 pb-1">Expressive Commands</h4>
            <ul className="list-none">
                 <Command command="Peek" description="Slides partly into view from an edge." />
                <Command command="Hide" description="Slips fully off-screen and vanishes." />
                <Command command="Jump scare!" description="Lunges forward suddenly, then retreats." />
                <Command command="Float around" description="Drifts lazily in calm, looping paths." />
                <Command command="Dance" description="Performs a mix of hops and spins." />
            </ul>
        </div>

         <div className="mb-4">
            <h4 className="font-display text-lg text-red-300 mb-3 border-b-2 border-red-300/30 pb-1">Fun & Actions</h4>
            <ul className="list-none">
                <Command command="Sing a song" description="Aros will sing with musical notes." />
                <Command command="Eat / Drink" description="Aros enjoys a virtual snack." />
                 <Command command="Eat chip" description="Munches on a tasty computer chip." />
                 <Command command="Drink oil" description="Sips from an oil can for an energy boost." />
                 <Command command="Change battery" description="Swaps in a new battery to fully recharge." />
                <Command command="Bang!" description="A playful dying animation." />
                <Command command="Laser eyes" description="Activates a powerful laser eye effect." />
                <Command command="Demon eyes" description="Aros shows its menacing side." />
                <Command command="Facepalm" description="For when things get a bit silly." />
            </ul>
        </div>

        <div className="mb-4">
            <h4 className="font-display text-lg text-cyan-300 mb-3 border-b-2 border-cyan-300/30 pb-1">Utility</h4>
             <ul className="list-none">
                <Command command="Take a photo" description="Opens the camera to snap a picture." />
                <Command command="Charge / Stop charging" description="Starts or stops the charging process." />
                <Command command="What's the battery level?" description="Reports the current battery status." />
            </ul>
        </div>
    </div>
);

const SlimeCommands: React.FC = () => (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className="mb-4">
            <h4 className="font-display text-lg text-blue-300 mb-3 border-b-2 border-blue-300/30 pb-1">Core Moves</h4>
            <ul className="list-none">
                <Command command="Move forward" description="Oozes forward, stretching and contracting." />
                <Command command="Move backward" description="Retreats with a gooey ooze." />
                <Command command="Go left / right" description="Slides sideways, leaving a temporary trail." />
                <Command command="Return home" description="Slides back to the center of the screen."/>
            </ul>
        </div>

        <div className="mb-4">
            <h4 className="font-display text-lg text-yellow-300 mb-3 border-b-2 border-yellow-300/30 pb-1">Advanced Motions</h4>
            <ul className="list-none">
                <Command command="Stretch" description="Elongates horizontally, then snaps back." />
                <Command command="Splatter" description="Jumps and dissolves into goo, then reforms." />
                <Command command="Split clone" description="Divides into mini-slimes that wiggle and merge." />
                <Command command="Squish hop" description="Flattens then springs joyfully into the air." />
                <Command command="Melt down" description="Puddles into flat goo, then reassembles." />
            </ul>
        </div>
        
        <div className="mb-4">
            <h4 className="font-display text-lg text-green-300 mb-3 border-b-2 border-green-300/30 pb-1">Interaction</h4>
            <ul className="list-none">
                <Command command="Explore!" description="Wanders around with playful, slimy physics." />
                <Command command="Stop exploring" description="Stops wandering and settles down." />
                <Command command="Follow me" description="Tracks your cursor or touch input." />
                <Command command="Stick to wall" description="Hops to the side and 'clings' there." />
            </ul>
        </div>

        <div className="mb-4">
            <h4 className="font-display text-lg text-purple-300 mb-3 border-b-2 border-purple-300/30 pb-1">Fun & Actions</h4>
            <ul className="list-none">
                 <Command command="Slime wave" description="Forms a gooey tendril and waves." />
                <Command command="Dance" description="Wobbles and jiggles rhythmically." />
                <Command command="Slime cannon" description="Fires a harmless, gooey projectile." />
                <Command command="Transparent mode" description="Becomes semi-see-through for a moment." />
                <Command command="Glow mode" description="Glows with a pulsing neon effect." />
            </ul>
        </div>

         <div className="mb-4 md:col-span-2">
            <h4 className="font-display text-lg text-red-300 mb-3 border-b-2 border-red-300/30 pb-1">Feeding & Utility</h4>
            <ul className="list-none">
                <Command command="Eat chip / Drink oil / Change battery" description="Absorbs the item to recharge." />
                <Command command="Take a photo" description="Opens the camera to snap a picture." />
            </ul>
        </div>
    </div>
);


export const HelpModal: React.FC<HelpModalProps> = ({ onClose, robotType }) => {
    
    const handleClose = () => {
        playSound('click');
        onClose();
    };

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" onClick={handleClose}>
            <div 
                className="w-full max-w-2xl bg-gray-800 border-4 border-gray-700 p-6 shadow-lg shadow-cyan-500/20 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-display text-2xl text-cyan-300">Aros's Commands</h3>
                     <button 
                        onClick={handleClose}
                        className="font-display text-xl text-gray-400 hover:text-white transition-colors"
                        aria-label="Close help modal"
                    >
                       &times;
                    </button>
                </div>

                {robotType === 'slime' ? <SlimeCommands /> : <RobotCommands />}
                 
                 <div className="mt-4 border-t-2 border-gray-700 pt-4">
                    <h4 className="font-display text-lg text-gray-300 mb-2">General Conversation</h4>
                    <p className="font-body text-gray-300 text-sm">You can also talk to Aros about anything! Ask questions, tell it a story, or just say hello. It will try its best to be a good friend and companion.</p>
                </div>

            </div>
        </div>
    );
};