
import React from 'react';

type Trail = { id: number; x: number; y: number; z: number; color: string };
type Clone = { id: number; x: number; y: number; };
type Cannonball = { id: number, x: number; y: number; z: number; color: string } | null;

export interface SlimeEffectState {
    trails: Trail[];
    clones: Clone[];
    areClonesMerging: boolean;
    cannonball: Cannonball;
}

interface SlimeEffectsProps {
    state: SlimeEffectState;
    robotState: { x: number; y: number; z: number };
}

const SlimeTrail: React.FC<{ trail: Trail }> = ({ trail }) => (
    <div
        className="absolute w-8 h-4 rounded-full animate-slime-trail-fade"
        style={{
            backgroundColor: trail.color,
            opacity: 0.7,
            transform: `
                translateX(${trail.x}px) 
                translateY(${trail.y}px) 
                scale(${1 + trail.z * 0.25})
            `,
            top: '50%',
            left: '50%',
            marginTop: '5rem',
            marginLeft: '-1rem',
        }}
    />
);

const MiniSlime: React.FC<{ clone: Clone; robotState: { x: number; y: number; z: number }; isMerging: boolean }> = ({ clone, robotState, isMerging }) => {
    const animationClass = isMerging
        ? (clone.x < 0 ? 'animate-clone-merge-left' : 'animate-clone-merge-right')
        : 'animate-mini-slime-wiggle';

    return (
        <div
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `
                    translateX(${robotState.x + clone.x}px) 
                    translateY(${robotState.y + clone.y}px)
                    scale(${1 + robotState.z * 0.25})
                `,
                marginTop: '2.5rem',
                marginLeft: '-3rem',
            }}
        >
            <div
                className={`w-24 h-16 bg-cyan-300/60 border-2 border-cyan-200/70 ${animationClass}`}
                style={{ borderRadius: '60% 60% 45% 45% / 75% 75% 35% 35%' }}
            >
                <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative w-8 h-8 bg-cyan-400/40 rounded-full">
                        <div className="absolute w-2 h-2 bg-blue-900/70 rounded-full" style={{ top: '30%', left: '25%' }}></div>
                        <div className="absolute w-2 h-2 bg-blue-900/70 rounded-full" style={{ top: '30%', right: '25%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const SlimeCannonball: React.FC<{ ball: Cannonball, robotState: { x: number, y: number, z: number } }> = ({ ball, robotState }) => {
    if (!ball) return null;
    return (
        <div
            className="absolute w-10 h-10 rounded-full animate-slime-cannon-ball"
            style={{
                backgroundColor: ball.color,
                top: '50%',
                left: '50%',
                 transform: `
                    translateX(${robotState.x}px) 
                    translateY(${robotState.y}px) 
                    scale(${1 + robotState.z * 0.25})
                `,
                marginTop: '1.5rem',
                marginLeft: '-1.25rem',
            }}
        />
    );
};


export const SlimeEffects: React.FC<SlimeEffectsProps> = ({ state, robotState }) => {
    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            {state.trails.map(trail => (
                <SlimeTrail key={trail.id} trail={trail} />
            ))}
             {state.clones.map(clone => (
                <MiniSlime key={clone.id} clone={clone} robotState={robotState} isMerging={state.areClonesMerging} />
            ))}
            <SlimeCannonball ball={state.cannonball} robotState={robotState} />
        </div>
    );
};