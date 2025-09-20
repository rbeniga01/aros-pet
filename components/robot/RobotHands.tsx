

import React from 'react';
import { Expression, RobotType } from '../../types';

interface RobotHandsProps {
    expression: Expression;
    robotType: RobotType;
}

const Hand: React.FC<{ side: 'left' | 'right', expression: Expression, robotType: RobotType }> = ({ side, expression, robotType }) => {
    if (robotType === 'slime') {
        return null;
    }

    const baseClasses = "absolute bottom-8 w-12 h-12 bg-gray-700 transition-all duration-500 ease-in-out border-2 border-gray-900 shadow-[3px_3px_0px_#111827]";
    let expressionClasses = '';

    const getTypeClasses = (type: RobotType) => {
        switch (type) {
            case 'cute': 
                return 'rounded-full bg-pink-300 border-pink-500';
            case 'aros':
            default: 
                return '';
        }
    }

    switch (expression) {
        // Positive
        case Expression.Happy:
            expressionClasses = 'animate-hand-wiggle';
            break;
        case Expression.EatChip:
        case Expression.DrinkOil:
        case Expression.Excited:
             expressionClasses = side === 'left' ? 'animate-hand-clap-left' : 'animate-hand-clap-right';
            break;
        case Expression.Playful:
            if (side === 'left') {
                 expressionClasses = 'animate-hand-wave-playful transform -translate-x-20';
            } else {
                expressionClasses = 'transform -translate-y-6';
            }
            break;
        case Expression.Confuse: // Used for Curious
             if (side === 'left') {
                expressionClasses = 'transform -translate-x-16 -translate-y-24'; // Tap head
            } else {
                expressionClasses = 'transform -translate-y-6';
            }
            break;
        case Expression.Loving:
            expressionClasses = side === 'left' ? 'animate-form-heart-left' : 'animate-form-heart-right';
            break;
        case Expression.Proud:
            expressionClasses = side === 'left' ? 'transform -translate-x-8 -translate-y-16 rotate-[-15deg]' : 'transform translate-x-8 -translate-y-16 rotate-[15deg]'; // Cross arms
            break;
        case Expression.Surprised:
            expressionClasses = 'transform -translate-y-28';
            break;
        case Expression.Relaxed:
             expressionClasses = 'transform -translate-y-4';
             break;
        case Expression.Singing:
             expressionClasses = 'transform -translate-y-12';
             break;
         case Expression.Dancing:
              expressionClasses = 'transform -translate-y-28';
              break;
        
        // Negative
        case Expression.Sad:
            expressionClasses = side === 'left' 
                ? 'transform translate-y-4 rotate-[-8deg]' 
                : 'transform translate-y-4 rotate-[8deg]';
            break;
        case Expression.Cry:
             expressionClasses = side === 'left' ? 'transform -translate-x-8 -translate-y-24' : 'transform translate-x-8 -translate-y-24'; // Cover face
            break;
        case Expression.Angry:
            expressionClasses = 'transform -translate-y-16 w-10 h-10'; // Fists up
            break;
        case Expression.Frustrated:
             if (side === 'left') {
                expressionClasses = 'transform -translate-x-8 -translate-y-28'; // Facepalm
            } else {
                expressionClasses = 'transform -translate-y-6';
            }
            break;
        case Expression.Tired:
            if (side === 'left') {
                expressionClasses = 'transform -translate-y-2 translate-x-2 rotate-6'; // Drooping
            } else {
                expressionClasses = 'transform -translate-y-6';
            }
            break;
        case Expression.Scared:
            expressionClasses = side === 'left' ? 'animate-hands-shield -translate-x-12' : 'animate-hands-shield translate-x-12 -scale-x-100'; // Shield
            break;
        case Expression.Embarrassed:
            expressionClasses = 'transform -translate-y-24'; // Both hands cover face
            break;

        // Functional
        case Expression.Thinking:
             if (side === 'left') {
                expressionClasses = 'transform -translate-x-16 -translate-y-24';
            } else {
                expressionClasses = 'transform translate-x-8 -translate-y-6';
            }
            break;
        case Expression.Charging:
            expressionClasses = 'transform -translate-y-4'; // Resting at sides
            break;
        case Expression.ChangeBattery:
             expressionClasses = 'transform -translate-y-6';
            break;
        case Expression.Gaming:
            expressionClasses = side === 'left' 
                ? 'transform -translate-y-12 translate-x-10 rotate-[25deg]' 
                : 'transform -translate-y-12 -translate-x-10 rotate-[-25deg]';
            break;
        case Expression.Neutral:
        default:
            expressionClasses = 'transform -translate-y-6';
            break;
    }
    
    const sideClasses = side === 'left' ? '-left-6' : '-right-6';
    
    return (
        <div className={`${baseClasses} ${getTypeClasses(robotType)} ${sideClasses} ${expressionClasses}`}>
        </div>
    );
};


export const RobotHands: React.FC<RobotHandsProps> = ({ expression, robotType }) => {
    return (
        <>
            <Hand side="left" expression={expression} robotType={robotType} />
            <Hand side="right" expression={expression} robotType={robotType} />
        </>
    );
};