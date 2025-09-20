

import React, { useEffect, useState } from 'react';

interface SpecialEffectsProps {
    effect: 'singing' | null;
}

const MusicalNote: React.FC<{ id: number; onEnd: (id: number) => void }> = ({ id, onEnd }) => {
    const style = {
        left: `${Math.random() * 100 - 50}%`,
        animationDuration: `${1.5 + Math.random()}s`,
        animationDelay: `${Math.random() * 1.5}s`,
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            onEnd(id);
        }, 3000); // Duration matches animation + delay
        return () => clearTimeout(timer);
    }, [id, onEnd]);

    const notes = ['🎵', '🎶', '🎼'];
    const note = notes[Math.floor(Math.random() * notes.length)];
    
    return (
        <span
            className="absolute top-0 text-2xl animate-note-float"
            style={style}
        >
            {note}
        </span>
    );
};

export const SpecialEffects: React.FC<SpecialEffectsProps> = ({ effect }) => {
    const [notes, setNotes] = useState<number[]>([]);

    useEffect(() => {
        if (effect === 'singing') {
            const interval = setInterval(() => {
                setNotes(prev => [...prev, Date.now()]);
            }, 500);
            return () => clearInterval(interval);
        } else {
            setNotes([]);
        }
    }, [effect]);

    const removeNote = (id: number) => {
        setNotes(prev => prev.filter(noteId => noteId !== id));
    };

    if (!effect) return null;

    return (
        <div className="absolute top-[-20px] left-1/2 w-full h-full pointer-events-none z-20">
            {effect === 'singing' && notes.map(id => <MusicalNote key={id} id={id} onEnd={removeNote} />)}
        </div>
    );
};