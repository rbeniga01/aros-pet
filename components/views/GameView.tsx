

import React, { useState, useCallback } from 'react';
import { playSound } from '../../services/soundService';
import { Sudoku, Difficulty } from './game/Sudoku';
import { getPuzzle } from '../../services/sudokuService';

interface GameViewProps {
    onClose: () => void;
    onGameWin: () => void;
    onGameStart: () => void;
}

type GameState = 'menu' | 'difficulty' | 'playing';
type GameSelection = 'none' | 'sudoku';

export const GameView: React.FC<GameViewProps> = ({ onClose, onGameWin, onGameStart }) => {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [gameSelection, setGameSelection] = useState<GameSelection>('none');
    const [puzzle, setPuzzle] = useState<number[][] | null>(null);
    const [solution, setSolution] = useState<number[][] | null>(null);

    const handleClose = () => {
        playSound('click');
        onClose();
    };

    const handleSelectGame = (game: GameSelection) => {
        playSound('click');
        setGameSelection(game);
        setGameState('difficulty');
    };

    const handleSelectDifficulty = (difficulty: Difficulty) => {
        playSound('click');
        const { puzzle, solution } = getPuzzle(difficulty);
        setPuzzle(puzzle);
        setSolution(solution);
        setGameState('playing');
        onGameStart();
    };
    
    const handleReturnToMenu = () => {
        playSound('click');
        setGameState('menu');
        setGameSelection('none');
        setPuzzle(null);
        setSolution(null);
    }
    
    const handleNewGame = () => {
        playSound('click');
        setGameState('difficulty');
        setPuzzle(null);
        setSolution(null);
    }

    const renderContent = () => {
        if (gameState === 'playing' && puzzle && solution) {
            return (
                <Sudoku 
                    initialPuzzle={puzzle} 
                    solution={solution} 
                    onWin={onGameWin} 
                    onNewGame={handleNewGame}
                />
            );
        }

        if (gameState === 'difficulty') {
            return (
                <div className="flex flex-col items-center gap-4">
                    <h4 className="font-display text-lg text-cyan-300">Select Difficulty</h4>
                    <button onClick={() => handleSelectDifficulty('Easy')} className="font-display text-lg bg-green-500 text-gray-900 py-2 px-6 hover:bg-green-400 transition-colors border-2 border-gray-900 shadow-[4px_4px_0px_#1f2937]">Easy</button>
                    <button onClick={() => handleSelectDifficulty('Medium')} className="font-display text-lg bg-yellow-500 text-gray-900 py-2 px-6 hover:bg-yellow-400 transition-colors border-2 border-gray-900 shadow-[4px_4px_0px_#1f2937]">Medium</button>
                    <button onClick={() => handleSelectDifficulty('Hard')} className="font-display text-lg bg-red-500 text-gray-900 py-2 px-6 hover:bg-red-400 transition-colors border-2 border-gray-900 shadow-[4px_4px_0px_#1f2937]">Hard</button>
                     <button onClick={handleReturnToMenu} className="mt-4 font-body text-sm text-gray-400 hover:text-white">Back to Games</button>
                </div>
            );
        }

        // Default to menu
        return (
            <div className="flex flex-col items-center gap-4">
                <button onClick={() => handleSelectGame('sudoku')} className="font-display text-xl bg-cyan-500 text-gray-900 py-3 px-8 hover:bg-cyan-400 transition-colors border-2 border-gray-900 shadow-[4px_4px_0px_#1f2937]">
                    Sudoku
                </button>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center animate-fadeIn w-full max-w-2xl h-full p-4">
            <div className="relative bg-gray-900 border-4 border-cyan-400 p-4 shadow-lg w-full h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-xl text-cyan-300">Game Zone</h3>
                    <button 
                        onClick={handleClose}
                        className="font-display text-xl text-gray-400 hover:text-white transition-colors"
                        aria-label="Close Games"
                    >
                       &times;
                    </button>
                </div>
                 <div className="flex-grow flex items-center justify-center">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};