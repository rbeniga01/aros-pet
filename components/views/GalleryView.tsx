

import React, { useState } from 'react';
import { playSound } from '../../services/soundService';

interface GalleryViewProps {
    photos: string[];
    onClose: () => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ photos, onClose }) => {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    const handleClose = () => {
        playSound('click');
        onClose();
    };

    const handleThumbnailClick = (photo: string) => {
        playSound('click');
        setSelectedPhoto(photo);
    };

    const handleClosePreview = () => {
        playSound('click');
        setSelectedPhoto(null);
    }

    return (
        <div className="flex flex-col items-center justify-center animate-fadeIn w-full max-w-2xl h-full p-4">
            <div className="relative bg-gray-900 border-4 border-cyan-400 p-4 shadow-lg w-full h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-xl text-cyan-300">Photo Gallery</h3>
                    <button 
                        onClick={handleClose}
                        className="font-display text-xl text-gray-400 hover:text-white transition-colors"
                        aria-label="Close Gallery"
                    >
                       &times;
                    </button>
                </div>
                {photos.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center">
                        <p className="text-gray-400 font-body">No photos yet. Try taking one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 overflow-y-auto">
                        {photos.map((photo, index) => (
                            <button key={index} onClick={() => handleThumbnailClick(photo)} className="aspect-square bg-gray-800 border-2 border-transparent hover:border-cyan-400 transition-colors">
                                <img src={photo} alt={`Snapshot ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {selectedPhoto && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 animate-fadeIn" onClick={handleClosePreview}>
                    <img src={selectedPhoto} alt="Selected snapshot" className="max-w-xl max-h-[80vh] border-4 border-cyan-400 shadow-lg"/>
                    <p className="mt-4 text-lg font-body">(Click anywhere to close preview)</p>
                </div>
            )}
        </div>
    );
};