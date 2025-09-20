

import React from 'react';
import { Expression, RobotType } from '../../types';

interface RobotFeetProps {
    expression: Expression;
    isUserWalking: boolean;
    robotType: RobotType;
}

const Foot: React.FC<{ side: 'left' | 'right', expression: Expression, isUserWalking: boolean, robotType: RobotType }> = ({ side, expression, isUserWalking, robotType }) => {
    const baseClasses = "absolute bottom-0 w-24 h-8 bg-gray-700 border-2 border-gray-900 shadow-[3px_3px_0px_#111827]";
    const sideClasses = side === 'left' ? 'left-4' : 'right-4';
    let animationClass = '';

    const getTypeClasses = (type: RobotType) => {
        switch (type) {
            case 'cute': return 'rounded-full bg-pink-300 border-pink-500 !w-20';
            case 'aros':
            default: return '';
        }
    }

    if (isUserWalking) {
         animationClass = side === 'left' ? 'animate-walk-left' : 'animate-walk-right';
    } else {
        switch (expression) {
            case Expression.Happy:
                animationClass = 'animate-feet-bounce';
                break;
            case Expression.Excited:
            case Expression.Surprised:
            case Expression.Dancing:
            case Expression.EatChip:
            case Expression.DrinkOil:
                animationClass = 'animate-feet-hop';
                break;
            case Expression.Playful:
                animationClass = side === 'left' ? 'animate-feet-shuffle-side' : 'animate-feet-shuffle-side [animation-direction:reverse]';
                break;
            case Expression.Loving:
                 animationClass = 'animate-feet-tap-impatient';
                 break;
            case Expression.Relaxed:
                animationClass = 'animate-feet-wobble';
                break;
            case Expression.Sad:
                animationClass = 'animate-feet-drag';
                break;
            case Expression.Cry:
                animationClass = 'animate-feet-wobble';
                break;
            case Expression.Angry:
                animationClass = 'animate-feet-stomp';
                break;
            case Expression.Frustrated:
                 animationClass = 'animate-feet-tap-impatient';
                 break;
            case Expression.Tired:
                animationClass = 'animate-feet-wobble';
                break;
            case Expression.Scared:
                animationClass = 'animate-tremble';
                break;
             case Expression.Embarrassed:
                animationClass = 'animate-feet-wobble [animation-duration:0.5s]';
                break;
            case Expression.Gaming:
                animationClass = 'transform translate-y-4';
                break;
            case Expression.Charging:
            case Expression.ChangeBattery:
                 animationClass = ''; // Stationary
                 break;
            default:
                break;
        }
    }


    return (
        <div className={`${baseClasses} ${getTypeClasses(robotType)} ${sideClasses} ${animationClass}`}></div>
    );
};

export const RobotFeet: React.FC<RobotFeetProps> = ({ expression, isUserWalking, robotType }) => {
    if (robotType === 'slime') {
        return null;
    }
    
    return (
        <>
            <Foot side="left" expression={expression} isUserWalking={isUserWalking} robotType={robotType} />
            <Foot side="right" expression={expression} isUserWalking={isUserWalking} robotType={robotType} />
        </>
    );
};