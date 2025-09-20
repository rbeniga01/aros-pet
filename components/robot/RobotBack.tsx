

import React from 'react';
import { Expression, RobotType } from '../../types';

interface RobotBackProps {
    expression: Expression;
    robotType: RobotType;
}

const BackIndicator: React.FC<{ expression: Expression }> = ({ expression }) => {
    let indicatorClasses = "w-10 h-10 rounded-full border-2 border-gray-900 transition-all duration-300 shadow-inner";
    let glowClasses = "absolute inset-0 rounded-full blur-lg opacity-75";

    switch (expression) {
        case Expression.Happy:
        case Expression.Smile:
        case Expression.Excited:
        case Expression.Playful:
        case Expression.Loving:
        case Expression.Singing:
        case Expression.Dancing:
            indicatorClasses += " bg-cyan-400";
            glowClasses += " bg-cyan-400 animate-pulse";
            break;
        case Expression.Sad:
        case Expression.Cry:
        case Expression.Embarrassed:
            indicatorClasses += " bg-blue-500";
            glowClasses += " bg-blue-500 animate-pulse [animation-duration:3s]";
            break;
        case Expression.Angry:
        case Expression.Frustrated:
        case Expression.DemonEyes:
        case Expression.LaserEyes:
            indicatorClasses += " bg-red-500";
            glowClasses += " bg-red-500 animate-pulse-red";
            break;
        case Expression.Thinking:
        case Expression.Confuse:
        case Expression.Focused:
            indicatorClasses += " bg-yellow-400";
            glowClasses += " bg-yellow-400 animate-pulse [animation-duration:1.5s]";
            break;
        case Expression.Sleeping:
        case Expression.Tired:
        case Expression.Dead:
            indicatorClasses += " bg-gray-600";
            glowClasses += " bg-gray-500 animate-pulse [animation-duration:4s]";
            break;
        case Expression.Charging:
        case Expression.ChangeBattery:
             indicatorClasses += " bg-green-500";
             glowClasses += " bg-green-500 animate-battery-charge-pulse";
             break;
        default: // Neutral, listening, etc.
            indicatorClasses += " bg-gray-500";
            glowClasses = ""; // No glow for neutral
            break;
    }

    return (
        <div className="relative">
            <div className={glowClasses}></div>
            <div className={indicatorClasses}></div>
        </div>
    );
};

export const RobotBack: React.FC<RobotBackProps> = ({ expression, robotType }) => {
    if (robotType === 'slime') {
        // The slime is translucent, so its front face is made visible from the back
        // in App.tsx. We render nothing here to avoid a layered effect.
        return null;
    }
    
    const getArosAndCuteClasses = (type: RobotType) => {
        switch (type) {
            case 'cute': 
                return 'bg-pink-200 border-pink-400 rounded-3xl';
            case 'aros':
            default: 
                return 'bg-gray-800 border-gray-700';
        }
    };
    
    return (
        <div className={`w-full h-full flex flex-col items-center justify-center border-4 shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)] ${getArosAndCuteClasses(robotType)}`}>
            <BackIndicator expression={expression} />
        </div>
    );
};