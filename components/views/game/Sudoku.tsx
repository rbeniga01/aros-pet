

import React, { useState, useEffect, useCallback } from 'react';
import { playSound } from '../../../services/soundService';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
type Board = (number | null)[][];
type SelectedCell = { row: number; col: number } | null;

interface SudokuProps {
    initialPuzzle: number[][];
    solution: number[][];
    onWin: () => void;
    onNewGame: () => void;
}

export const Sudoku: React.FC<SudokuProps> = ({ initialPuzzle, solution, onWin, onNewGame }) => {
    const [board, setBoard] = useState<Board>([]);
    const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);
    const [errors, setErrors] = useState<boolean[][]>([]);

    useEffect(() => {
        const newBoard = initialPuzzle.map(row => row.map(cell => (cell === 0 ? null : cell)));
        setBoard(newBoard);
        setErrors(Array(9).fill(null).map(() => Array(9).fill(false)));
    }, [initialPuzzle]);

    const checkWin = useCallback((currentBoard: Board) => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (currentBoard[r][c] === null || currentBoard[r][c] !== solution[r][c]) {
                    return false;
                }
            }
        }
        return true;
    }, [solution]);

    const validateBoard = useCallback((currentBoard: Board) => {
        const newErrors = Array(9).fill(null).map(() => Array(9).fill(false));
        let hasErrors = false;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const value = currentBoard[r][c];
                if (value !== null && value !== solution[r][c]) {
                    newErrors[r][c] = true;
                    hasErrors = true;
                }
            }
        }
        setErrors(newErrors);
        return hasErrors;
    }, [solution]);
    
    const handleCellClick = (row: number, col: number) => {
        if (initialPuzzle[row][col] === 0) { // Only allow selecting empty cells
            setSelectedCell({ row, col });
        }
    };

    const handleNumberInput = (num: number | null) => {
        if (!selectedCell) return;
        
        playSound('click');

        const { row, col } = selectedCell;
        if (initialPuzzle[row][col] !== 0) return;

        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = num;
        setBoard(newBoard);
        
        const hasErrors = validateBoard(newBoard);
        if (!hasErrors && checkWin(newBoard)) {
            setTimeout(() => onWin(), 500);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full h-full">
            <div className="grid grid-cols-9 aspect-square w-full max-w-sm border-2 border-cyan-300 bg-gray-800">
                {board.map((row, rIdx) => 
                    row.map((cell, cIdx) => {
                        const isInitial = initialPuzzle[rIdx][cIdx] !== 0;
                        const isSelected = selectedCell?.row === rIdx && selectedCell?.col === cIdx;
                        const isError = errors[rIdx][cIdx];
                        
                        const borderClasses = `
                            ${(cIdx === 2 || cIdx === 5) ? 'border-r-2 border-r-cyan-300' : ''}
                            ${(cIdx === 3 || cIdx === 6) ? 'border-l-2 border-l-cyan-300' : ''}
                            ${(rIdx === 2 || rIdx === 5) ? 'border-b-2 border-b-cyan-300' : ''}
                            ${(rIdx === 3 || rIdx === 6) ? 'border-t-2 border-t-cyan-300' : ''}
                        `;

                        return (
                            <button
                                key={`${rIdx}-${cIdx}`}
                                onClick={() => handleCellClick(rIdx, cIdx)}
                                className={`flex items-center justify-center aspect-square text-lg md:text-xl font-bold border border-gray-600 transition-colors duration-200
                                    ${borderClasses}
                                    ${isInitial ? 'text-cyan-300' : 'text-white cursor-pointer'}
                                    ${isSelected ? 'bg-cyan-800' : 'hover:bg-gray-700'}
                                    ${isError ? '!bg-red-800 !text-red-300' : ''}
                                `}
                                disabled={isInitial}
                                aria-label={`Cell ${rIdx + 1}, ${cIdx + 1}. Value: ${cell || 'Empty'}`}
                            >
                                {cell}
                            </button>
                        );
                    })
                )}
            </div>
            
            <div className="flex flex-col items-center gap-3">
                <div className="flex justify-center gap-1">
                    {Array.from({ length: 9 }, (_, i) => i + 1).map(num => (
                        <button
                            key={num}
                            onClick={() => handleNumberInput(num)}
                            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-gray-700 text-white font-bold rounded hover:bg-cyan-600 transition-colors border border-gray-900"
                        >
                            {num}
                        </button>
                    ))}
                    <button onClick={() => handleNumberInput(null)} className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-gray-700 text-red-400 font-bold rounded hover:bg-red-600 hover:text-white transition-colors border border-gray-900" title="Erase">
                       &times;
                    </button>
                </div>
                 <button onClick={onNewGame} className="mt-2 font-body text-sm text-gray-400 hover:text-white">Start New Game</button>
            </div>
        </div>
    );
};