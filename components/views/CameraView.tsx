

import React, { useRef, useEffect, useState } from 'react';
import { playSound } from '../../services/soundService';

interface CameraViewProps {
    onCapture: (dataUrl: string) => void;
    onClose: () => void;
}

const CAPTURE_WIDTH = 640;
const CAPTURE_HEIGHT = 480;

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        
        const startCamera = async () => {
            try {
                if (!navigator.mediaDevices?.getUserMedia) {
                    throw new Error("Camera not supported by this browser.");
                }
                stream = await navigator.mediaDevices.getUserMedia({ video: { width: CAPTURE_WIDTH, height: CAPTURE_HEIGHT } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("Could not access camera. Please check permissions.");
            }
        };

        startCamera();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    const handleSnap = () => {
        if (isCapturing) return;

        playSound('click');
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (video && canvas && container) {
            const context = canvas.getContext('2d');
            if (context) {
                setIsCapturing(true);

                // Flash effect
                const flash = document.createElement('div');
                flash.className = 'absolute inset-0 bg-white animate-shutter-flash pointer-events-none';
                container.appendChild(flash);
                setTimeout(() => flash.remove(), 300);

                // Capture and save
                context.drawImage(video, 0, 0, CAPTURE_WIDTH, CAPTURE_HEIGHT);
                const dataUrl = canvas.toDataURL('image/png');
                onCapture(dataUrl);

                // Start animation
                setCapturedImage(dataUrl);

                // Reset after animation
                setTimeout(() => {
                    setCapturedImage(null);
                    setIsCapturing(false);
                }, 1000); // Must match animation duration
            }
        }
    };
    
    const handleClose = () => {
        playSound('click');
        onClose();
    }

    return (
        <div className="flex flex-col items-center justify-center animate-fadeIn w-full max-w-2xl h-full p-4">
            <div ref={containerRef} className="relative bg-gray-900 border-4 border-cyan-400 p-2 shadow-lg w-full overflow-hidden">
                {error ? (
                    <div className="w-full aspect-[4/3] flex items-center justify-center bg-gray-800 text-red-400 font-body">
                        <p>{error}</p>
                    </div>
                ) : (
                    <video ref={videoRef} autoPlay playsInline className="block w-full h-auto"></video>
                )}
                <canvas ref={canvasRef} width={CAPTURE_WIDTH} height={CAPTURE_HEIGHT} className="hidden"></canvas>
                
                {capturedImage && (
                    <img
                        src={capturedImage}
                        alt="Captured moment"
                        className="absolute top-0 left-0 w-full h-full object-cover animate-photo-to-gallery pointer-events-none"
                    />
                )}
            </div>
             <div className="mt-4 flex gap-4">
                 <button 
                    onClick={handleSnap}
                    disabled={!!error || isCapturing}
                    className="font-display text-lg bg-cyan-500 text-gray-900 py-2 px-6 hover:bg-cyan-400 disabled:bg-gray-600 transition-colors border-2 border-gray-900 shadow-[4px_4px_0px_#1f2937]"
                >
                   {isCapturing ? 'Saved!' : 'Snap'}
                </button>
                 <button 
                    onClick={handleClose}
                    className="font-display text-lg bg-gray-600 text-white py-2 px-6 hover:bg-gray-500 transition-colors border-2 border-gray-900 shadow-[4px_4px_0px_#1f2937]"
                >
                   Close
                </button>
            </div>
        </div>
    );
};