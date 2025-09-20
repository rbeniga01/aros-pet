

import React, { useState, useEffect } from 'react';
import { Expression, RobotType } from '../../types';

interface RobotEyesProps {
    expression: Expression;
    robotType: RobotType;
}

const Eye: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`relative w-16 h-16 bg-gray-100 overflow-hidden flex items-center justify-center transition-all duration-300 ease-in-out border-2 border-gray-900 shadow-[0_0_12px_rgba(100,220,255,0.4)] ${className}`}>
        <div className="absolute top-2 left-2 w-6 h-3 bg-cyan-100/90 rounded-sm blur-sm"></div>
        {children}
    </div>
);

const Pupil: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className = '', children }) => (
    <div className={`relative w-6 h-6 bg-gray-800 border border-cyan-300 transition-all duration-300 ease-in-out ${className}`}>
        {children}
    </div>
);

const DeadEye: React.FC = () => (
    <Eye className="!bg-gray-300">
        <div className="absolute w-1 h-12 bg-gray-800 transform rotate-45"></div>
        <div className="absolute w-1 h-12 bg-gray-800 transform -rotate-45"></div>
    </Eye>
);

const HeartPupil: React.FC = () => (
    <div className="relative w-8 h-8">
        <div className="absolute w-5 h-5 bg-red-500 transform rotate-45 -translate-x-1/2 -translate-y-1/2 top-[60%] left-1/2"></div>
        <div className="absolute w-3 h-3 bg-red-500 rounded-full top-1 left-1"></div>
        <div className="absolute w-3 h-3 bg-red-500 rounded-full top-1 right-1"></div>
    </div>
);

const Tear: React.FC<{ delay: string }> = ({ delay }) => (
    <div 
        className="absolute bottom-0 left-1/2 w-2 h-3 bg-cyan-400 rounded-full animate-tear"
        style={{ animationDelay: delay }}
    ></div>
);

const Blush: React.FC<{ side: 'left' | 'right'}> = ({ side }) => (
    <div className={`absolute bottom-4 ${side === 'left' ? 'left-2' : 'right-2'} w-8 h-3 bg-pink-400/80 rounded-full animate-blush-anim`}></div>
);

const BatteryPupil: React.FC = () => (
    <div className="relative w-8 h-5 bg-gray-700 border border-cyan-300 animate-battery-charge-pulse">
        {/* The charging level */}
        <div className="w-full h-full bg-green-400 animate-pulse-cyan-pupil [animation-duration:1s]"></div>
        {/* The little nub on the battery */}
        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1 h-2 bg-cyan-300 border-t-2 border-b-2 border-r-2 border-gray-900"></div>
    </div>
);

const SlimeEyeContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
        {children}
    </div>
);

const AngryBubble: React.FC<{delay: string}> = ({delay}) => {
    const [translateX, setTranslateX] = useState(0);

    useEffect(() => {
        setTranslateX(Math.random() * 40 - 20);
    }, []);

    return (
        <div 
            className="absolute top-0 left-1/2 w-2 h-2 bg-red-300/50 rounded-full animate-angry-bubble"
            style={{ animationDelay: delay, transform: `translateX(${translateX}px)` }}
        ></div>
    );
};


const AngryBubbles: React.FC = () => (
    <div className="absolute -top-4 left-0 w-full h-full pointer-events-none">
        <AngryBubble delay="0s" />
        <AngryBubble delay="0.2s" />
        <AngryBubble delay="0.5s" />
    </div>
)


const SlimeFace: React.FC<{ expression: Expression }> = ({ expression }) => {
    let coreBgClass = "bg-cyan-400/40";
    let animationClass = "";
    let eyeDotClasses = "absolute w-4 h-4 bg-blue-900/70 rounded-full transition-colors duration-300";
    let mouthDotClasses = "absolute w-4 h-4 bg-blue-900/70 rounded-full transition-colors duration-300";
    let specialEffect = null;
    let showAngryBubbles = false;
    let coreScale = "";

    switch (expression) {
        case Expression.Happy:
        case Expression.Smile:
        case Expression.Singing:
        case Expression.Dancing:
        case Expression.Excited:
        case Expression.Playful:
        case Expression.Proud:
             coreBgClass = "bg-yellow-400/50";
             animationClass = "animate-pulse-cyan-pupil";
             coreScale = "transform scale(1.05)";
             break;
        case Expression.Sad:
        case Expression.Cry:
             coreBgClass = "bg-blue-500/60";
             mouthDotClasses += " transform scaleY(0.5) !bg-blue-900/50";
             animationClass = "opacity-80";
             coreScale = "transform scale(0.9)";
             break;
        case Expression.Angry:
        case Expression.Frustrated:
             coreBgClass = "bg-red-500/70";
             animationClass = "animate-pulse-red";
             eyeDotClasses += " !bg-red-800/90";
             mouthDotClasses += " !bg-red-800/90 transform scaleY(0.5)";
             showAngryBubbles = true;
             coreScale = "transform scale(1.1)";
             break;
        case Expression.Surprised:
        case Expression.Scared:
            coreBgClass = "bg-indigo-400/60";
            coreScale = "transform scale(1.25)";
            eyeDotClasses += " transform scale(1.3)";
            mouthDotClasses += " transform scale(1.3)";
             if(expression === Expression.Scared) animationClass = "animate-tremble";
            break;
        case Expression.Dead:
            coreBgClass = "bg-slate-700/60";
            eyeDotClasses = "hidden";
            mouthDotClasses = "hidden";
            specialEffect = <>
                <div className="absolute w-1 h-12 bg-blue-900/70 transform rotate-45"></div>
                <div className="absolute w-1 h-12 bg-blue-900/70 transform -rotate-45"></div>
            </>;
            break;
        case Expression.Sleeping:
        case Expression.Relaxed:
        case Expression.Tired:
            coreBgClass = "bg-slate-600/60";
            animationClass = "opacity-50";
            eyeDotClasses += " h-1 scale-x-150";
            mouthDotClasses += " h-1";
            coreScale = "transform scale(0.95)";
            break;
        case Expression.Loving:
        case Expression.Embarrassed:
            coreBgClass = "bg-pink-500/60";
            eyeDotClasses = "hidden";
            mouthDotClasses = "hidden";
            specialEffect = <>
                <div className="text-6xl text-red-400 animate-heart-throb">♥</div>
            </>;
            coreScale = "transform scale(1.1)";
            break;
        case Expression.Thinking:
        case Expression.Confuse:
            coreBgClass = "bg-purple-500/60";
            animationClass = "animate-subtlePulse [animation-duration:1.5s]";
            break;
        default:
            break;
    }

    const coreClasses = `relative w-20 h-20 ${coreBgClass} rounded-full transition-all duration-300 flex items-center justify-center ${animationClass} ${coreScale}`;

    return (
        <>
            <div className={coreClasses}>
                <div className={eyeDotClasses} style={{ top: '30%', left: '25%' }}></div>
                <div className={eyeDotClasses} style={{ top: '30%', right: '25%' }}></div>
                <div className={mouthDotClasses} style={{ bottom: '25%', left: '50%', transform: 'translateX(-50%)' }}></div>
                {specialEffect}
                {showAngryBubbles && <AngryBubbles />}
            </div>
            {expression === Expression.Cry && 
                <div className="absolute top-1/2 left-1/2 w-48 h-24 overflow-hidden">
                    <Tear delay="0s" /><Tear delay="1.2s" /><Tear delay="0.6s" /><Tear delay="1.8s" />
                </div>
            }
        </>
    );
};


const renderSlimeEyes = (expression: Expression) => {
    return (
        <SlimeEyeContainer>
            <SlimeFace expression={expression} />
        </SlimeEyeContainer>
    );
}


export const RobotEyes: React.FC<RobotEyesProps> = ({ expression, robotType }) => {
    
    if (robotType === 'slime') {
        return renderSlimeEyes(expression);
    }

    const renderDefaultEyes = () => {
        switch (expression) {
            case Expression.Happy:
            case Expression.Smile:
            case Expression.Singing:
            case Expression.Dancing:
                return (
                    <>
                        <Eye className="!h-8 !border-t-0 items-start">
                            <Pupil className="!w-6 !h-6 mt-2" />
                        </Eye>
                        <Eye className="!h-8 !border-t-0 items-start">
                            <Pupil className="!w-6 !h-6 mt-2" />
                        </Eye>
                    </>
                );
             case Expression.Proud:
                 return (
                    <>
                        <Eye className="!h-6 !border-t-0 items-start">
                            <Pupil className="!w-6 !h-6 mt-1" />
                        </Eye>
                        <Eye className="!h-6 !border-t-0 items-start">
                            <Pupil className="!w-6 !h-6 mt-1" />
                        </Eye>
                    </>
                );
            case Expression.Sad:
                return (
                    <>
                        <Eye className="!h-8 !border-b-0 items-end transform -rotate-6">
                            <Pupil className='!w-6 !h-6 mb-2' />
                        </Eye>
                        <Eye className="!h-8 !border-b-0 items-end transform rotate-6">
                             <Pupil className='!w-6 !h-6 mb-2' />
                        </Eye>
                    </>
                );
             case Expression.Embarrassed:
                return (
                    <>
                        <Eye className="!h-8 !border-b-0 items-end">
                             <Pupil className='!w-6 !h-6 mb-2 ml-8' />
                             <Blush side="left" />
                        </Eye>
                        <Eye className="!h-8 !border-b-0 items-end">
                             <Pupil className='!w-6 !h-6 mb-2 mr-8' />
                              <Blush side="right" />
                        </Eye>
                    </>
                );
             case Expression.Cry:
                return (
                    <>
                        <Eye className="!h-8 !border-b-0 items-end !overflow-visible">
                            <Pupil className="!w-6 !h-6 mb-2" />
                            <Tear delay="0s" />
                            <Tear delay="1s" />
                        </Eye>
                        <Eye className="!h-8 !border-b-0 items-end !overflow-visible">
                             <Pupil className="!w-6 !h-6 mb-2" />
                             <Tear delay="0.5s" />
                             <Tear delay="1.5s" />
                        </Eye>
                    </>
                );
            case Expression.Angry:
                return (
                    <>
                        <Eye className="transform rotate-12">
                            <Pupil className="!bg-red-600 !border-red-400" />
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gray-900"></div>
                        </Eye>
                        <Eye className="transform -rotate-12">
                           <Pupil className="!bg-red-600 !border-red-400" />
                           <div className="absolute top-0 left-0 w-full h-1/2 bg-gray-900"></div>
                        </Eye>
                    </>
                );
            case Expression.Frustrated:
                 return (
                    <>
                        <Eye className="transform rotate-12 animate-tremble [animation-duration:0.2s]">
                            <Pupil className="!bg-red-600 !border-red-400" />
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gray-900"></div>
                        </Eye>
                        <Eye className="transform -rotate-12 animate-tremble [animation-duration:0.2s]">
                           <Pupil className="!bg-red-600 !border-red-400" />
                           <div className="absolute top-0 left-0 w-full h-1/2 bg-gray-900"></div>
                        </Eye>
                    </>
                );
            case Expression.Confuse:
                 return (
                    <>
                        <Eye className="transform -rotate-6">
                            <Pupil />
                        </Eye>
                        <Eye className="transform rotate-6">
                           <Pupil />
                        </Eye>
                    </>
                );
            case Expression.Thinking:
                return (
                    <>
                        <Eye>
                             <Pupil className="ml-8 mt-[-2.5rem]"/>
                        </Eye>
                         <Eye>
                             <Pupil className="ml-8 mt-[-2.5rem]"/>
                        </Eye>
                    </>
                );
            case Expression.Listening:
                return (
                    <>
                        <Eye><Pupil className="!border-0 !bg-cyan-500 animate-pulse-cyan-pupil" /></Eye>
                        <Eye><Pupil className="!border-0 !bg-cyan-500 animate-pulse-cyan-pupil" /></Eye>
                    </>
                );
            case Expression.Sleeping:
            case Expression.Relaxed:
                 return (
                    <>
                        <Eye className="!h-1 !border-y-4 !border-x-0 items-start" />
                        <Eye className="!h-1 !border-y-4 !border-x-0 items-start" />
                    </>
                );
            case Expression.Tired:
                return (
                    <>
                         <Eye className="!h-4 items-end"><div className="w-full h-1/2 bg-gray-800"></div></Eye>
                         <Eye className="!h-4 items-end"><div className="w-full h-1/2 bg-gray-800"></div></Eye>
                    </>
                );
            case Expression.LaserEyes:
                return (
                    <>
                        <Eye className="!h-2 !bg-red-500 !border-red-700 overflow-visible">
                             <div className="absolute w-2 h-2 bg-yellow-300 animate-laser-charge"></div>
                             <div className="absolute left-1/2 top-1/2 w-48 h-1 bg-red-500/50 transform -translate-y-1/2 -translate-x-1/2 blur-[2px]"></div>
                        </Eye>
                        <Eye className="!h-2 !bg-red-500 !border-red-700 overflow-visible">
                            <div className="absolute w-2 h-2 bg-yellow-300 animate-laser-charge"></div>
                            <div className="absolute left-1/2 top-1/2 w-48 h-1 bg-red-500/50 transform -translate-y-1/2 -translate-x-1/2 blur-[2px]"></div>
                        </Eye>
                    </>
                );
            case Expression.DemonEyes:
                return (
                     <>
                        <Eye className="!bg-red-900 border-red-500">
                             <Pupil className="!w-1 !h-10 !bg-red-400 !border-0" />
                        </Eye>
                        <Eye className="!bg-red-900 border-red-500">
                            <Pupil className="!w-1 !h-10 !bg-red-400 !border-0" />
                        </Eye>
                    </>
                );
            case Expression.Dead:
                 return (
                    <>
                        <DeadEye />
                        <DeadEye />
                    </>
                );
            case Expression.Walking:
                 return (
                    <>
                        <Eye className="!h-12 justify-center items-center">
                            <Pupil className="!h-5 translate-y-1" />
                        </Eye>
                        <Eye className="!h-12 justify-center items-center">
                            <Pupil className="!h-5 translate-y-1" />
                        </Eye>
                    </>
                );
            case Expression.Surprised:
                return (
                    <>
                        <Eye className='!h-20'>
                            <Pupil className='!w-10 !h-10' />
                        </Eye>
                        <Eye className='!h-20'>
                            <Pupil className='!w-10 !h-10' />
                        </Eye>
                    </>
                );
            case Expression.Scared:
                return (
                    <div className="animate-tremble flex gap-4">
                        <Eye className='!h-20 !bg-blue-100'>
                            <Pupil className='!w-4 !h-4' />
                        </Eye>
                        <Eye className='!h-20 !bg-blue-100'>
                            <Pupil className='!w-4 !h-4' />
                        </Eye>
                    </div>
                );
            case Expression.Focused:
                return (
                    <>
                        <Eye className="!h-6 justify-center">
                            <Pupil className="!h-5 !w-5" />
                        </Eye>
                        <Eye className="!h-6 justify-center">
                            <Pupil className="!h-5 !w-5" />
                        </Eye>
                    </>
                );
            case Expression.Gaming:
                return (
                    <>
                        <Eye className="!h-8 justify-center">
                            <Pupil className="!h-6 !w-10 !border-0 !bg-gray-800">
                               <div className="absolute top-1 left-1 w-2 h-2 bg-white"></div>
                            </Pupil>
                        </Eye>
                        <Eye className="!h-8 justify-center">
                             <Pupil className="!h-6 !w-10 !border-0 !bg-gray-800">
                               <div className="absolute top-1 left-1 w-2 h-2 bg-white"></div>
                            </Pupil>
                        </Eye>
                    </>
                );
            case Expression.Excited:
            case Expression.EatChip:
            case Expression.DrinkOil:
                return (
                     <>
                        <Eye className="!h-20">
                            <Pupil className="!w-10 !h-10">
                                <div className="absolute top-1 right-1 w-2 h-2 bg-white"></div>
                                <div className="absolute top-1 right-1 w-3 h-1 bg-white transform rotate-45"></div>
                                <div className="absolute top-1 right-1 w-1 h-3 bg-white transform rotate-45"></div>
                            </Pupil>
                        </Eye>
                        <Eye className="!h-20">
                            <Pupil className="!w-10 !h-10">
                                <div className="absolute top-1 right-1 w-2 h-2 bg-white"></div>
                                <div className="absolute top-1 right-1 w-3 h-1 bg-white transform rotate-45"></div>
                                <div className="absolute top-1 right-1 w-1 h-3 bg-white transform rotate-45"></div>
                            </Pupil>
                        </Eye>
                    </>
                );
            case Expression.Playful:
                return (
                    <>
                        <Eye><Pupil /></Eye>
                        <Eye>
                        {/* Wink shaped like < */}
                        <div className="absolute w-6 h-1 bg-gray-900 transform -translate-y-0.5 -rotate-[25deg]"></div>
                        <div className="absolute w-6 h-1 bg-gray-900 transform translate-y-0.5 rotate-[25deg]"></div>
                        </Eye>
                    </>
                );
            case Expression.Loving:
                 return (
                    <>
                        <Eye className="!bg-pink-100"><HeartPupil /></Eye>
                        <Eye className="!bg-pink-100"><HeartPupil /></Eye>
                    </>
                );
             case Expression.Charging:
             case Expression.ChangeBattery:
                return (
                    <>
                        <Eye className="!bg-gray-800"><BatteryPupil /></Eye>
                        <Eye className="!bg-gray-800"><BatteryPupil /></Eye>
                    </>
                );
            default: // Neutral
                return (
                    <>
                        <Eye><Pupil /></Eye>
                        <Eye><Pupil /></Eye>
                    </>
                );
        }
    };
    
    // Scared expression has its own wrapper for the tremble effect, so we render it directly
    if (expression === Expression.Scared) {
        return <>{renderDefaultEyes()}</>;
    }

    return (
        <div className="relative flex gap-4 animate-blink">
            {renderDefaultEyes()}
        </div>
    );
};