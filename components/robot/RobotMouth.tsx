

import React from 'react';
import { Expression } from '../../types';

interface RobotMouthProps {
    expression: Expression;
}

export const RobotMouth: React.FC<RobotMouthProps> = ({ expression }) => {
    // The user has requested to remove the mouth. This component will now render nothing.
    return null;
};