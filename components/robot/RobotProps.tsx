

import React from 'react';
import { Expression } from '../../types';

interface RobotPropsProps {
    expression: Expression;
}

const ChargingProp: React.FC = () => (
    <div className="absolute top-1/2 -right-48 w-48 h-10 animate-charging-cable-connect pointer-events-none">
        {/* Cable */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 w-full h-2 bg-gray-600 border-y-2 border-gray-900"></div>
        {/* Plug */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-8 h-8 bg-gray-800 border-2 border-gray-900 shadow-[2px_2px_0px_#111827]">
             <div className="absolute top-1 left-1 w-1 h-2 bg-yellow-400"></div>
             <div className="absolute top-1 right-1 w-1 h-2 bg-yellow-400"></div>
        </div>
        {/* Lightning effect */}
         <div className="absolute top-1/2 -translate-y-1/2 left-10 text-yellow-300 text-2xl animate-lightning-pulse">⚡</div>
    </div>
);

const PropWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="absolute top-36 left-1/2 -translate-x-1/2 z-10 animate-prop-consume pointer-events-none">
        <div className="animate-prop-float">
            {children}
        </div>
    </div>
);

const ChipProp: React.FC = () => (
    <PropWrapper>
        <div className="relative w-10 h-8 bg-green-700 border-2 border-gray-900 shadow-[2px_2px_0px_#111827]">
            <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-400"></div>
            <div className="absolute bottom-1 right-1 w-4 h-1 bg-yellow-400"></div>
        </div>
    </PropWrapper>
);

const OilCanProp: React.FC = () => (
    <PropWrapper>
        <div className="relative w-12 h-16">
           <div className="w-12 h-14 bg-gray-400 border-2 border-gray-900 rounded-t-md shadow-[2px_2px_0px_#111827]">
                <div className="w-full h-4 bg-red-600"></div>
                <span className="font-display text-xs text-gray-900 absolute top-6 left-1/2 -translate-x-1/2">OIL</span>
           </div>
           <div className="absolute -top-4 left-1 w-2 h-6 bg-gray-500 border border-gray-900 transform rotate-[45deg]"></div>
        </div>
    </PropWrapper>
);

const FloatingBatteryProp: React.FC = () => (
    <div className="absolute top-36 left-1/2 -translate-x-1/2 z-10 animate-prop-consume pointer-events-none" style={{ perspective: '200px' }}>
        <div className="animate-battery-float-detailed">
            <div className="relative w-10 h-6 bg-teal-400 border-2 border-gray-900 shadow-[2px_2px_0px_#111827] animate-battery-glow flex items-center justify-center">
                 <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1 h-3 bg-gray-500 border-t-2 border-b-2 border-r-2 border-gray-900"></div>
                 <div className="text-black font-bold text-sm">⚡</div>
            </div>
        </div>
    </div>
);

const SnackProp: React.FC = () => (
    <div className="absolute -left-28 bottom-8 animate-prop-float [animation-duration:3s] pointer-events-none">
        <div className="w-16 h-20 bg-green-700 border-2 border-gray-900 shadow-[2px_2px_0px_#111827] -rotate-12">
             <div className="w-full h-4 bg-yellow-500"></div>
             <span className="font-display text-xs text-gray-900 absolute top-8 left-1/2 -translate-x-1/2">CHIP</span>
        </div>
    </div>
);

const DrinkProp: React.FC = () => (
     <div className="absolute -right-28 bottom-8 animate-prop-float [animation-duration:3.5s] pointer-events-none">
        <div className="relative w-12 h-16 rotate-6">
           <div className="w-12 h-14 bg-gray-400 border-2 border-gray-900 rounded-t-md shadow-[2px_2px_0px_#111827]">
                <div className="w-full h-4 bg-red-600"></div>
                <span className="font-display text-xs text-gray-900 absolute top-6 left-1/2 -translate-x-1/2">OIL</span>
           </div>
           <div className="absolute -top-4 left-1 w-2 h-6 bg-gray-500 border border-gray-900 transform rotate-[45deg]"></div>
        </div>
     </div>
);

const GamingControllerProp: React.FC = () => (
    <div className="absolute top-36 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="relative w-28 h-16 bg-gray-900 border-2 border-gray-600 shadow-[2px_2px_0px_#111827]">
            {/* D-pad */}
            <div className="absolute top-4 left-3 w-2 h-6 bg-gray-500"></div>
            <div className="absolute top-6 left-1 w-6 h-2 bg-gray-500"></div>
            {/* Buttons */}
            <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="absolute top-8 right-8 w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
    </div>
);

const GamingProp: React.FC = () => (
    <>
        <SnackProp />
        <DrinkProp />
        <GamingControllerProp />
    </>
);


export const RobotProps: React.FC<RobotPropsProps> = ({ expression }) => {
    switch (expression) {
        case Expression.Charging:
            return <ChargingProp />;
        case Expression.EatChip:
            return <ChipProp />;
        case Expression.DrinkOil:
            return <OilCanProp />;
        case Expression.ChangeBattery:
            return <FloatingBatteryProp />;
        case Expression.Gaming:
            return <GamingProp />;
        default:
            return null;
    }
};