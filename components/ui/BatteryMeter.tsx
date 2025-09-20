

import React from 'react';

interface BatteryMeterProps {
    level: number; // 0-100
}

export const BatteryMeter: React.FC<BatteryMeterProps> = ({ level }) => {
    const getBatteryColor = () => {
        if (level > 50) return 'bg-green-500';
        if (level > 20) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div 
            className="flex items-center gap-2"
            title={`Battery: ${level}%`}
        >
            <div className="relative w-10 h-5 border-2 border-gray-400 p-0.5 flex items-center">
                <div 
                    className={`h-full transition-all duration-500 ${getBatteryColor()}`}
                    style={{ width: `${level}%` }}
                ></div>
            </div>
            <div className="w-1 h-2 bg-gray-400"></div>
        </div>
    );
};