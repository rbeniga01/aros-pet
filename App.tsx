

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Expression, RobotType } from './types';
import { RobotEyes } from './components/robot/RobotEyes';
import { RobotBack } from './components/robot/RobotBack';
import { RobotHands } from './components/robot/RobotHands';
import { RobotFeet } from './components/robot/RobotFeet';
import { RobotProps } from './components/robot/RobotProps';
import { ChatBubble } from './components/ui/ChatBubble';
import { UserInput } from './components/ui/UserInput';
import { InteractionMenu } from './components/ui/InteractionMenu';
import { FoodMenu } from './components/ui/FoodMenu';
import { BatteryMeter } from './components/ui/BatteryMeter';
import { CameraView } from './components/views/CameraView';
import { GalleryView } from './components/views/GalleryView';
import { GameView } from './components/views/GameView';
import { SpecialEffects } from './components/robot/SpecialEffects';
import { SlimeEffects, SlimeEffectState } from './components/robot/SlimeEffects';
import { HelpButton } from './components/ui/HelpButton';
import { HelpModal } from './components/ui/HelpModal';
import { EmotePanel, Emote } from './components/ui/EmotePanel';
import { CommandPanel } from './components/ui/CommandPanel';
import { getAIResponse, ChatHistoryPart, AIResponse } from './services/geminiService';
import { playSound } from './services/soundService';
import { TypeSelectorModal } from './components/ui/TypeSelectorModal';

const expressionMap: { [key: string]: Expression } = {
    'NEUTRAL': Expression.Neutral,
    'HAPPY': Expression.Happy,
    'SMILE': Expression.Smile,
    'SAD': Expression.Sad,
    'ANGRY': Expression.Angry,
    'CONFUSE': Expression.Confuse,
    'CRY': Expression.Cry,
    'THINKING': Expression.Thinking,
    'SLEEPING': Expression.Sleeping,
    'EXCITED': Expression.Excited,
    'PLAYFUL': Expression.Playful,
    'LOVING': Expression.Loving,
    'PROUD': Expression.Proud,
    'RELAXED': Expression.Relaxed,
    'FRUSTRATED': Expression.Frustrated,
    'EMBARRASSED': Expression.Embarrassed,
    'SCARED': Expression.Scared,
};

const X_STEP = 60;
const Z_STEP = 0.2;
const VERTICAL_OFFSET = 80; // Pixels to shift the robot down from the center


const App: React.FC = () => {
    const [expression, setExpression] = useState<Expression>(Expression.Sleeping);
    const [robotMessage, setRobotMessage] = useState<string>('');
    const [isDisplayingMessage, setIsDisplayingMessage] = useState<boolean>(false);
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chatHistory, setChatHistory] = useState<ChatHistoryPart[]>([]);
    const [isSessionStarted, setIsSessionStarted] = useState<boolean>(false);
    const [hasWelcomed, setHasWelcomed] = useState<boolean>(false);
    const [isInteracting, setIsInteracting] = useState<boolean>(false);
    const [showFoodMenu, setShowFoodMenu] = useState<boolean>(false);
    const [activeView, setActiveView] = useState<'none' | 'camera' | 'gallery' | 'game'>('none');
    const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
    const [batteryLevel, setBatteryLevel] = useState<number>(100);
    const [specialEffect, setSpecialEffect] = useState<'singing' | null>(null);
    const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
    const [isCharging, setIsCharging] = useState(false);
    const [isInGameMode, setIsInGameMode] = useState(false);
    const [robotType, setRobotType] = useState<RobotType>('aros');
    const [showTypeSelector, setShowTypeSelector] = useState(false);
    const [isPortrait, setIsPortrait] = useState(false);


    // For movement & animation
    const [robotState, setRobotState] = useState({ x: 0, y: 0, z: 0, rotation: 0 }); // x: side-to-side, y: up-down, z: depth, rotation: y-axis spin
    const [bodyAnimation, setBodyAnimation] = useState('');
    const [isExploring, setIsExploring] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const isExploringRef = useRef(isExploring); // Ref to track exploring state in callbacks
    const exploreTimeoutRef = useRef<number | null>(null);
    const animationIntervalRef = useRef<number | null>(null);
    const [slimeState, setSlimeState] = useState<SlimeEffectState>({ trails: [], clones: [], areClonesMerging: false, cannonball: null });
    const [isSlimeTransparent, setIsSlimeTransparent] = useState(false);
    const [isSlimeGlowing, setIsSlimeGlowing] = useState(false);
    const [isMainSlimeVisible, setIsMainSlimeVisible] = useState(true);

    const interactionTimeoutRef = useRef<number | null>(null);
    const messageTimeoutRef = useRef<number | null>(null);
    const inactivityTimeoutRef = useRef<number | null>(null);
    const chargeIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(orientation: portrait)");
        const handleOrientationChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setIsPortrait(e.matches);
        };

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', handleOrientationChange);
        } else {
            // Deprecated fallback for older browsers
            (mediaQuery as any).addListener(handleOrientationChange);
        }
        
        handleOrientationChange(mediaQuery); // Initial check

        return () => {
            if (typeof mediaQuery.removeEventListener === 'function') {
                mediaQuery.removeEventListener('change', handleOrientationChange);
            } else {
                (mediaQuery as any).removeListener(handleOrientationChange);
            }
        };
    }, []);


    // Sync isExploring state with its ref
    useEffect(() => {
        isExploringRef.current = isExploring;
    }, [isExploring]);

    // Battery drain effect
    useEffect(() => {
        if (!isSessionStarted || expression === Expression.Sleeping || isCharging) return;
        const drainInterval = setInterval(() => {
            setBatteryLevel(prev => {
                const drainAmount = isExploring || isFollowing ? 2 : 1;
                const newLevel = Math.max(0, prev - drainAmount);
                if (newLevel <= 20 && newLevel > 0 && expression !== Expression.Tired) {
                     setExpression(Expression.Tired);
                } else if (newLevel === 0) {
                     handleSleep();
                }
                return newLevel;
            });
        }, 15000); 
        return () => clearInterval(drainInterval);
    }, [isSessionStarted, expression, isExploring, isFollowing, isCharging]);
    
    // Follow Me (Cursor/Touch) Effect
    useEffect(() => {
        if (!isFollowing || activeView !== 'none') return;

        const handleMove = (clientX: number, clientY: number) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const newX = clientX - centerX;
            const newY = clientY - centerY;
            setRobotState(prev => ({ ...prev, x: newX, y: newY, z: prev.z, rotation: prev.rotation }));
        };
        
        const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);
        setExpression(Expression.Focused);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            if (!isExploringRef.current) {
                 setExpression(Expression.Neutral);
            }
        };
    }, [isFollowing, activeView]);


    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }
        if (!isSessionStarted || expression === Expression.Sleeping || isInteracting || isLoading || isExploring || isFollowing || isCharging) {
            return;
        }
        inactivityTimeoutRef.current = window.setTimeout(() => {
            setExpression(Expression.Sad);
            setRobotMessage("Are you still there?");
            setIsDisplayingMessage(true);
        }, 30000); // 30 seconds
    }, [isSessionStarted, expression, isInteracting, isLoading, isExploring, isFollowing, isCharging]);

    useEffect(() => {
        resetInactivityTimer();
        return () => {
            if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
        };
    }, [resetInactivityTimer]);


    useEffect(() => {
        if (!isSessionStarted || hasWelcomed) return;

        setHasWelcomed(true); // Prevent this effect from re-running.
        
        const showWelcomeMessage = () => {
            const welcomeMessage = "Hi there! I'm Aros, your new AI friend.";
            setExpression(Expression.Smile);
            setRobotMessage(welcomeMessage);
            setIsDisplayingMessage(true);
            
            if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
            messageTimeoutRef.current = window.setTimeout(() => {
                setIsDisplayingMessage(false);
                setExpression(Expression.Neutral);
                resetInactivityTimer();
            }, 5000);
        };

        const initialDelay = setTimeout(showWelcomeMessage, 1000);
        
        return () => {
            clearTimeout(initialDelay);
            if(messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        }
    }, [isSessionStarted, hasWelcomed, resetInactivityTimer]);

    const handleStartSession = () => {
        playSound('powerUp');
        setIsSessionStarted(true);
        setBatteryLevel(100);
        setExpression(Expression.Neutral);
        setRobotState({ x: 0, y: 0, z: 0, rotation: 0 });
    };
    
    const stopAllActivities = useCallback(() => {
        if (exploreTimeoutRef.current) {
            clearTimeout(exploreTimeoutRef.current);
            exploreTimeoutRef.current = null;
        }
        setIsExploring(false);

        setIsFollowing(false);

        if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current);
            interactionTimeoutRef.current = null;
        }
        
        if (animationIntervalRef.current) {
            clearInterval(animationIntervalRef.current);
            animationIntervalRef.current = null;
        }
        
        if (chargeIntervalRef.current) {
            clearInterval(chargeIntervalRef.current);
            chargeIntervalRef.current = null;
        }
        setIsCharging(false);

        setIsInteracting(false);
        setBodyAnimation('');
        setIsSlimeGlowing(false);
        setIsSlimeTransparent(false);

        resetInactivityTimer();
    }, [resetInactivityTimer]);

    const runInteraction = useCallback((sequence: [Expression, number][], sound?: 'play' | 'eat' | 'tiredSigh' | 'sleep' | 'powerUp' | 'error', effect?: 'singing' | null) => {
        if (isLoading || !isSessionStarted) return;
        
        stopAllActivities();
        setIsInteracting(true);
        setIsDisplayingMessage(false);
        if (sound) playSound(sound);
        if (effect) setSpecialEffect(effect);

        let delay = 0;
        sequence.forEach(([expr, duration]) => {
            setTimeout(() => {
                setExpression(expr);
            }, delay);
            delay += duration;
        });

        interactionTimeoutRef.current = window.setTimeout(() => {
            setExpression(Expression.Neutral);
            setIsInteracting(false);
            if(effect) setSpecialEffect(null);
            setBodyAnimation(''); // Clear body animation after interaction
            resetInactivityTimer();
        }, delay);
    }, [isLoading, isSessionStarted, stopAllActivities, resetInactivityTimer]);
    
    // Auto-stop charging when full
    useEffect(() => {
        if (isCharging && batteryLevel >= 100) {
            if (chargeIntervalRef.current) {
                clearInterval(chargeIntervalRef.current);
                chargeIntervalRef.current = null;
            }
            setIsCharging(false);
            // A little celebration
            runInteraction([[Expression.Excited, 2500]], 'powerUp');
            setRobotMessage("I'm fully charged! Let's play!");
            setIsDisplayingMessage(true);
            if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
            messageTimeoutRef.current = window.setTimeout(() => {
                setIsDisplayingMessage(false);
                resetInactivityTimer();
            }, 4000);
        }
    }, [batteryLevel, isCharging, runInteraction, resetInactivityTimer]);
    
    const playAnimation = useCallback((animation: string, duration: number, expression?: Expression) => {
        if (isLoading || !isSessionStarted) return;
        stopAllActivities();
        setIsInteracting(true);
        if (expression) setExpression(expression);
        setBodyAnimation(animation);

        interactionTimeoutRef.current = window.setTimeout(() => {
            setBodyAnimation('');
            setExpression(Expression.Neutral);
            setIsInteracting(false);
            resetInactivityTimer();
        }, duration);
    }, [isLoading, isSessionStarted, stopAllActivities, resetInactivityTimer]);
    
    const handleCloseSideView = useCallback(() => {
        setActiveView('none');
        setExpression(Expression.Neutral);
        setIsInteracting(false);
        setIsInGameMode(false);
        resetInactivityTimer();
    }, [resetInactivityTimer]);

    const handlePhotoCapture = useCallback((photo: string) => {
        setGalleryPhotos(prev => [...prev, photo]);
    }, []);

    const handleShowGallery = useCallback(() => {
        if (activeView !== 'none' || isInteracting) return;
        stopAllActivities();
        playSound('click');
        setRobotState({ x: 0, y: 0, z: 0, rotation: 0 }); // Reset position for split view
        setIsInteracting(true);
        setActiveView('gallery');
        setExpression(Expression.Smile);

        const msg = "Here are your photos!";
        setRobotMessage(msg);
        setIsDisplayingMessage(true);

        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = window.setTimeout(() => setIsDisplayingMessage(false), 3000);
    }, [activeView, isInteracting, stopAllActivities]);
    
     const handleShowGames = useCallback(() => {
        if (activeView !== 'none' || isInteracting) return;
        stopAllActivities();
        playSound('click');
        setRobotState({ x: 0, y: 0, z: 0, rotation: 0 });
        setIsInteracting(true);
        setActiveView('game');
        setExpression(Expression.Focused);

        const msg = "Let's play a game!";
        setRobotMessage(msg);
        setIsDisplayingMessage(true);

        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = window.setTimeout(() => setIsDisplayingMessage(false), 3000);
    }, [activeView, isInteracting, stopAllActivities]);

    const handleGameWin = useCallback(() => {
        handleCloseSideView();
        setIsInGameMode(false);
        runInteraction([[Expression.Excited, 1500], [Expression.Proud, 2000]], 'powerUp');
        const msg = "You won! Great job!";
        setRobotMessage(msg);
        setIsDisplayingMessage(true);
    }, [handleCloseSideView, runInteraction]);

    const handleGameStart = useCallback(() => {
        setIsInGameMode(true);
    }, []);

    const performExploreStep = useCallback(() => {
        if (!isExploringRef.current) {
            setExpression(Expression.Neutral);
            return;
        }

        const action = Math.random();
        let actionDuration = 1000 + Math.random() * 1000;

        setRobotState(prev => {
            const scale = 1 + prev.z * 0.25;
            const currentRobotWidth = 200 * scale;
            const xBoundary = (window.innerWidth / 2) - currentRobotWidth;

            if (action < 0.7) {
                setExpression(Math.random() < 0.5 ? Expression.Confuse : Expression.Playful);
                const moveDirection = Math.random();
                if (moveDirection < 0.25 && prev.z < 1) return { ...prev, z: prev.z + Z_STEP };
                else if (moveDirection < 0.5 && prev.z > -1.5) return { ...prev, z: prev.z - Z_STEP };
                else if (moveDirection < 0.75 && prev.x > -xBoundary) return { ...prev, x: prev.x - X_STEP };
                else if (prev.x < xBoundary) return { ...prev, x: prev.x + X_STEP };
            }
            return prev;
        });

        if (action >= 0.7) {
            setExpression(Expression.Neutral);
            const emoteAction = Math.random();
            if (emoteAction < 0.5) setExpression(Expression.Confuse);
            else setExpression(Expression.Smile);
            actionDuration = 1500;
        }
        
        exploreTimeoutRef.current = window.setTimeout(performExploreStep, actionDuration);
    }, []);

    const handleLocalCommand = useCallback((message: string): boolean => {
        const lower = message.toLowerCase().trim().replace(/[!?,.]/g, '');
        
        const interactionWrapper = (action: () => void) => {
            action();
            setIsInteracting(true);
            setTimeout(() => {
                setIsInteracting(false);
                resetInactivityTimer();
            }, 300); // Duration to override idle animation
        };

        const addSlimeTrail = (x: number, y: number, z: number, color: string) => {
            const id = Date.now() + Math.random();
            const newTrail = { id, x, y, z, color };
            setSlimeState(prev => ({...prev, trails: [...prev.trails, newTrail]}));
            setTimeout(() => {
                setSlimeState(prev => ({ ...prev, trails: prev.trails.filter(t => t.id !== id) }));
            }, 1000);
        };
        
        let commands: { [key: string]: () => void };

        if (robotType === 'slime') {
            commands = {
                // Core moves
                'move forward': () => interactionWrapper(() => { playAnimation('animate-ooze', 1000, Expression.Focused); setRobotState(prev => ({ ...prev, z: Math.min(1, prev.z + Z_STEP) }))}),
                'move backward': () => interactionWrapper(() => { playAnimation('animate-ooze', 1000, Expression.Focused); setRobotState(prev => ({ ...prev, z: Math.max(-1.5, prev.z - Z_STEP) }))}),
                'go left': () => interactionWrapper(() => { playAnimation('animate-slime-slide', 1000, Expression.Playful); setRobotState(prev => { addSlimeTrail(prev.x, prev.y, prev.z, 'cyan'); return {...prev, x: prev.x - X_STEP}; })}),
                'go right': () => interactionWrapper(() => { playAnimation('animate-slime-slide', 1000, Expression.Playful); setRobotState(prev => { addSlimeTrail(prev.x, prev.y, prev.z, 'cyan'); return {...prev, x: prev.x + X_STEP}; })}),
                'return home': () => { stopAllActivities(); setRobotState({ x: 0, y: 0, z: 0, rotation: 0 }); },
                
                // Advanced motions
                'stretch': () => playAnimation('animate-slime-stretch', 1500, Expression.Playful),
                'splatter': () => {
                    if (isInteracting) return;
                    stopAllActivities();
                    setIsInteracting(true);
                    setExpression(Expression.Surprised);
                    setBodyAnimation('animate-splatter');

                    setTimeout(() => {
                        setExpression(Expression.Proud);
                        setBodyAnimation('animate-reform');
                        
                        setTimeout(() => {
                            setBodyAnimation('');
                            setExpression(Expression.Neutral);
                            setIsInteracting(false);
                            resetInactivityTimer();
                        }, 800); // reform duration
                    }, 1200); // splatter duration
                },
                'split clone': () => {
                    if (isInteracting) return;
                    stopAllActivities();
                    setIsInteracting(true);
                    setExpression(Expression.Excited);
                    setBodyAnimation('animate-slime-jump-split');

                    setTimeout(() => {
                        setIsMainSlimeVisible(false);
                        setBodyAnimation('');
                        
                        const clones = [
                            { id: 1, x: -60, y: 10 }, 
                            { id: 2, x: 60, y: 10 },
                        ];
                        setSlimeState(prev => ({ ...prev, clones, areClonesMerging: false }));
                        
                        setTimeout(() => {
                            setSlimeState(prev => ({ ...prev, areClonesMerging: true }));

                            setTimeout(() => {
                                setSlimeState(prev => ({ ...prev, clones: [], areClonesMerging: false }));
                                setIsMainSlimeVisible(true);
                                setExpression(Expression.Proud);
                                setBodyAnimation('animate-reform');
                                
                                setTimeout(() => {
                                    setBodyAnimation('');
                                    setExpression(Expression.Neutral);
                                    setIsInteracting(false);
                                    resetInactivityTimer();
                                }, 800);
                            }, 800);
                        }, 3000);
                    }, 1000);
                },
                'squish hop': () => playAnimation('animate-squish-hop', 1000, Expression.Excited),
                'melt down': () => { 
                    if (isInteracting) return;
                    stopAllActivities();
                    setIsInteracting(true);
                    setExpression(Expression.Tired);
                    setBodyAnimation('animate-melt-down');
                    
                    // Pause as a puddle, then reform
                    setTimeout(() => {
                        setExpression(Expression.Neutral);
                        setBodyAnimation('animate-reform');
                        
                        setTimeout(() => {
                            setBodyAnimation('');
                            setIsInteracting(false);
                            resetInactivityTimer();
                        }, 800); // reform duration
                    }, 1500 + 1500); // melt duration + pause duration
                },

                // Interaction
                'explore': () => {
                    if (isExploring || isInteracting || activeView !== 'none') return;
                    setIsExploring(true);
                    performExploreStep();
                },
                'stop exploring': stopAllActivities,
                'follow me': () => { if (isInteracting || activeView !== 'none') return; setIsFollowing(true); },
                'stick to wall': () => interactionWrapper(() => { // Simplified version
                    const peekFrom = Math.random() > 0.5 ? 1 : -1;
                    const peekX = (window.innerWidth / 2 - 100) * peekFrom;
                    setRobotState(prev => ({ ...prev, x: peekX, rotation: peekFrom * 20 }));
                }),

                // Fun & Actions
                'slime wave': () => playAnimation('animate-slime-wave', 3000, Expression.Playful),
                'dance': () => playAnimation('animate-slime-wobble', 4000, Expression.Dancing),
                'slime cannon': () => {
                    if (isInteracting) return;
                    setIsInteracting(true);
                    const cannonball = { id: Date.now(), x: robotState.x, y: robotState.y, z: robotState.z, color: 'cyan' };
                    setSlimeState(prev => ({...prev, cannonball }));
                    playSound('sendMessage');
                    setTimeout(() => {
                        setSlimeState(prev => ({...prev, cannonball: null }));
                        setIsInteracting(false);
                    }, 1000);
                },
                'transparent mode': () => { setIsInteracting(true); setIsSlimeTransparent(true); setTimeout(() => { setIsSlimeTransparent(false); setIsInteracting(false); }, 3000)},
                'glow mode': () => { setIsInteracting(true); setIsSlimeGlowing(true); setTimeout(() => { setIsSlimeGlowing(false); setIsInteracting(false); }, 4000)},
                'eat chip': () => {
                    playAnimation('animate-slime-absorb', 500);
                    runInteraction([[Expression.EatChip, 3000]], 'eat');
                    setBatteryLevel(prev => Math.min(100, prev + 15));
                },
                 'drink oil': () => {
                    playAnimation('animate-slime-absorb', 500);
                    runInteraction([[Expression.DrinkOil, 3000]], 'play');
                    setBatteryLevel(prev => Math.min(100, prev + 25));
                },
                 'change battery': () => {
                    playAnimation('animate-slime-absorb', 500);
                    runInteraction([[Expression.ChangeBattery, 3000]], 'powerUp');
                    setBatteryLevel(100);
                },
                 'take a photo': () => {
                     if (activeView !== 'none' || isInteracting) return;
                    stopAllActivities();
                    playSound('click');
                    setRobotState({x: 0, y: 0, z: 0, rotation: 0});
                    setIsInteracting(true); 
                    setActiveView('camera');
                    setExpression(Expression.Focused);
                },
            };
        } else {
             commands = {
                'stop exploring': stopAllActivities,
                'return home': () => {
                    stopAllActivities();
                    setRobotState({ x: 0, y: 0, z: 0, rotation: 0 });
                },
                'move forward': () => interactionWrapper(() => setRobotState(prev => ({ ...prev, z: Math.min(1, prev.z + Z_STEP) }))),
                'move backward': () => interactionWrapper(() => setRobotState(prev => ({ ...prev, z: Math.max(-1.5, prev.z - Z_STEP) }))),
                'go left': () => interactionWrapper(() => setRobotState(prev => ({ ...prev, x: prev.x - X_STEP }))),
                'go right': () => interactionWrapper(() => setRobotState(prev => ({ ...prev, x: prev.x + X_STEP }))),
                'dash forward': () => interactionWrapper(() => setRobotState(prev => ({ ...prev, z: Math.min(1, prev.z + Z_STEP * 3) }))),
                'hop in place': () => playAnimation('animate-hop-in-place', 2400, Expression.Playful),
                'shake': () => playAnimation('animate-shake', 500, Expression.Frustrated),
                'wobble': () => playAnimation('animate-wobble', 2000, Expression.Confuse),
                'explore': () => {
                    if (isExploring || isInteracting || activeView !== 'none') return;
                    setIsExploring(true);
                    performExploreStep();
                },
                'follow me': () => {
                    if (isInteracting || activeView !== 'none') return;
                    setIsFollowing(true);
                },
                'guard mode': () => {
                    stopAllActivities();
                    setRobotState({ x: 0, y: 0, z: 0, rotation: 0 });
                    setExpression(Expression.Focused);
                },
                'peek': () => {
                    interactionWrapper(() => {
                        const peekFrom = Math.random() > 0.5 ? 1 : -1;
                        const offscreenX = (window.innerWidth / 2 + 150) * peekFrom;
                        const peekX = (window.innerWidth / 2 - 100) * peekFrom;
                        setRobotState(prev => ({ ...prev, x: offscreenX, y: 0, z: 0 }));
                        setTimeout(() => setRobotState(prev => ({ ...prev, x: peekX })), 100);
                    });
                },
                'hide': () => {
                    interactionWrapper(() => {
                        const hideTo = robotState.x > 0 ? 1 : -1;
                        setRobotState(prev => ({ ...prev, x: (window.innerWidth / 2 + 150) * hideTo }));
                    });
                },
                'jump scare': () => {
                    setIsInteracting(true);
                    const originalZ = robotState.z;
                    setExpression(Expression.Scared);
                    setRobotState(prev => ({ ...prev, z: 1.2 }));
                    playSound('error');
                    setTimeout(() => {
                        setRobotState(prev => ({ ...prev, z: originalZ }));
                        setExpression(Expression.Playful);
                        setIsInteracting(false);
                    }, 600);
                },
                'float around': () => {
                     if (isInteracting || activeView !== 'none') return;
                     playAnimation('animate-body-sway', 6000, Expression.Relaxed);
                },
                'circle around': () => {
                    if (isInteracting) return;
                    setIsInteracting(true);
                    let angle = 0;
                    animationIntervalRef.current = window.setInterval(() => {
                        angle += 5;
                        const radius = 150;
                        const x = Math.cos(angle * Math.PI / 180) * radius;
                        const z = (Math.sin(angle * Math.PI / 180) * 0.5) - 0.5;
                        setRobotState(prev => ({ ...prev, x, z, rotation: prev.rotation + 5}));
                        if (angle >= 360) {
                            clearInterval(animationIntervalRef.current!);
                            animationIntervalRef.current = null;
                            setIsInteracting(false);
                            setRobotState({ x: 0, y: 0, z: 0, rotation: 0 });
                        }
                    }, 50);
                },
                'zigzag': () => {
                     if (isInteracting) return;
                    setIsInteracting(true);
                    let step = 0;
                    animationIntervalRef.current = window.setInterval(() => {
                        step++;
                        const direction = step % 2 === 0 ? -1 : 1;
                        setRobotState(prev => ({...prev, x: prev.x + X_STEP * direction, z: Math.min(1, prev.z + Z_STEP / 2)}));
                        if(step > 5) {
                            clearInterval(animationIntervalRef.current!);
                            animationIntervalRef.current = null;
                            setIsInteracting(false);
                        }
                    }, 400);
                },
                'dance': () => playAnimation('animate-dance-combo', 6000, Expression.Dancing),
                'laser eyes': () => runInteraction([[Expression.LaserEyes, 3000]], 'error'),
                'demon eyes': () => runInteraction([[Expression.DemonEyes, 3000]], 'error'),
                'bang': () => runInteraction([[Expression.Confuse, 1000], [Expression.Dead, 2000]], 'error'),
                'sing a song': () => runInteraction([[Expression.Singing, 4000]], 'play', 'singing'),
                'facepalm': () => runInteraction([[Expression.Frustrated, 2000]]),
                'eat chip': () => {
                    runInteraction([[Expression.EatChip, 3000]], 'eat');
                    setBatteryLevel(prev => Math.min(100, prev + 15));
                    setRobotMessage("Crunchy!");
                    setIsDisplayingMessage(true);
                    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
                    messageTimeoutRef.current = window.setTimeout(() => setIsDisplayingMessage(false), 3000);
                },
                'drink oil': () => {
                    runInteraction([[Expression.DrinkOil, 3000]], 'play');
                    setBatteryLevel(prev => Math.min(100, prev + 25));
                    setRobotMessage("Smooth!");
                    setIsDisplayingMessage(true);
                    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
                    messageTimeoutRef.current = window.setTimeout(() => setIsDisplayingMessage(false), 3000);
                },
                'charge': () => {
                    if (isCharging) return;
                    stopAllActivities();
                    setIsCharging(true);
                    setIsInteracting(true); // Lock other actions while charging
                    setExpression(Expression.Charging);
                    chargeIntervalRef.current = window.setInterval(() => {
                        setBatteryLevel(prev => Math.min(100, prev + 2));
                    }, 500);
                },
                'stop charging': () => {
                    if (!isCharging) return;
                    if (chargeIntervalRef.current) {
                        clearInterval(chargeIntervalRef.current);
                        chargeIntervalRef.current = null;
                    }
                    setIsCharging(false);
                    setIsInteracting(false);
                    setExpression(Expression.Neutral);
                    resetInactivityTimer();
                },
                "what's the battery level": () => {
                    const msg = `My battery is at ${batteryLevel}%.`;
                    setRobotMessage(msg);
                    setIsDisplayingMessage(true);
                    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
                    messageTimeoutRef.current = window.setTimeout(() => setIsDisplayingMessage(false), 4000);
                    resetInactivityTimer();
                },
                'take a photo': () => {
                     if (activeView !== 'none' || isInteracting) return;
                    stopAllActivities();
                    playSound('click');
                    setRobotState({x: 0, y: 0, z: 0, rotation: 0});
                    setIsInteracting(true); 
                    
                    setActiveView('camera');
                    setExpression(Expression.Focused);

                    const msg = "Say cheese!";
                    setRobotMessage(msg);
                    setIsDisplayingMessage(true);

                    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
                    messageTimeoutRef.current = window.setTimeout(() => setIsDisplayingMessage(false), 3000);
                },
            };
        }

        const commandKeys = Object.keys(commands).sort((a, b) => b.length - a.length);

        for (const cmd of commandKeys) {
            if (lower.includes(cmd)) {
                stopAllActivities();
                commands[cmd]();
                return true;
            }
        }
        return false;
    }, [runInteraction, batteryLevel, activeView, isInteracting, isExploring, stopAllActivities, isLoading, isSessionStarted, performExploreStep, resetInactivityTimer, playAnimation, robotState, isCharging, setIsInteracting, robotType]);

    const handleSendMessage = useCallback(async (message: string) => {
        const trimmedInput = message.trim();
        if (!trimmedInput || isLoading) return;
        
        if (handleLocalCommand(trimmedInput)) {
            setUserInput('');
            return;
        }
        
        stopAllActivities();
        playSound('sendMessage');
        setIsLoading(true);
        setExpression(Expression.Thinking);
        setIsDisplayingMessage(false);
        
        try {
            const response: AIResponse = await getAIResponse(trimmedInput, chatHistory);
            
            playSound('receiveMessage');

            const newHistory: ChatHistoryPart[] = [
                ...chatHistory,
                { role: 'user', parts: [{ text: trimmedInput }] },
                { role: 'model', parts: [{ text: response.message }] }
            ];
            setChatHistory(newHistory);

            setExpression(expressionMap[response.expression] || Expression.Neutral);
            setRobotMessage(response.message);
            setIsDisplayingMessage(true);

            if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
            messageTimeoutRef.current = window.setTimeout(() => {
                setIsDisplayingMessage(false);
                setExpression(Expression.Neutral);
                resetInactivityTimer();
            }, 8000 + response.message.length * 50);

        } catch (error) {
            playSound('error');
            console.error(error);
            const errorMessage = "Oops, something went wrong. I can't seem to think right now.";
            setExpression(Expression.Sad);
            setRobotMessage(errorMessage);
            setIsDisplayingMessage(true);

            if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
            messageTimeoutRef.current = window.setTimeout(() => {
                setIsDisplayingMessage(false);
                setExpression(Expression.Neutral);
                resetInactivityTimer();
            }, 8000);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, chatHistory, handleLocalCommand, stopAllActivities, resetInactivityTimer]);

    const handleTextInputSubmit = () => {
        if (userInput.trim()) {
            handleSendMessage(userInput);
            setUserInput('');
        }
    };
    
    const handleFeed = useCallback((food: string) => {
        setShowFoodMenu(false);
        if (food === 'battery') {
            handleLocalCommand('change battery');
        } else if (food === 'oil can') {
             handleLocalCommand('drink oil');
        } else if (food === 'chip') {
            handleLocalCommand('eat chip');
        }
    }, [runInteraction, resetInactivityTimer, handleLocalCommand]);

    const handleSleep = useCallback(() => {
         if (isLoading || !isSessionStarted) return;
        
        stopAllActivities();
        setIsInteracting(true);
        setIsDisplayingMessage(false);
        if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);

        playSound('tiredSigh');
        setExpression(Expression.Tired);
        
        setTimeout(() => {
            playSound('sleep');
            setExpression(Expression.Sleeping);
        }, 2000);

    }, [isLoading, isSessionStarted, stopAllActivities]);

    const handleWakeUp = useCallback(() => {
        if (expression === Expression.Sleeping) {
            playSound('powerUp');
            setExpression(Expression.Smile);
            const newBattery = Math.max(20, batteryLevel);
            setBatteryLevel(newBattery);
            const messages = ["I had a great nap!", `I feel refreshed! Battery is at ${newBattery}%.`, "I'm back!"];
            setRobotMessage(messages[Math.floor(Math.random() * messages.length)]);
            setIsDisplayingMessage(true);
             if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
             messageTimeoutRef.current = window.setTimeout(() => {
                 setIsDisplayingMessage(false);
                 setExpression(Expression.Neutral);
                 resetInactivityTimer();
             }, 4000);
            setIsInteracting(false);
        }
    }, [expression, batteryLevel, resetInactivityTimer]);

    const handleRobotClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (activeView !== 'none') return;
        if (expression === Expression.Sleeping) {
            handleWakeUp();
            return;
        }
        resetInactivityTimer();
    }, [expression, handleWakeUp, activeView, resetInactivityTimer]);

    const handleEmoteSelect = useCallback((emote: Emote) => {
        if (isLoading || !isSessionStarted || expression === Expression.Sleeping) return;
        
        stopAllActivities();
        setIsDisplayingMessage(false);
        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        
        playSound('click');

        setExpression(emote.expression);
        setRobotMessage(emote.message);
        setIsDisplayingMessage(true);

        interactionTimeoutRef.current = window.setTimeout(() => {
            setIsDisplayingMessage(false);
            setExpression(Expression.Neutral);
            resetInactivityTimer();
            interactionTimeoutRef.current = null;
        }, 2500);

    }, [isLoading, isSessionStarted, expression, resetInactivityTimer, stopAllActivities]);

     const handleCommandSelect = useCallback((command: string) => {
        if (isLoading || !isSessionStarted || expression === Expression.Sleeping) return;
        handleLocalCommand(command);
    }, [handleLocalCommand, isLoading, isSessionStarted, expression]);
    
    const handleTypeSelect = (type: RobotType) => {
        playSound('click');
        setRobotType(type);
        setShowTypeSelector(false);
    };
    
    const getBodyAnimationClass = useCallback(() => {
        if (isInGameMode) return '';
        if (bodyAnimation) return bodyAnimation;

        if (robotType === 'slime') {
            switch(expression) {
                case Expression.Happy:
                case Expression.Smile:
                case Expression.Excited:
                case Expression.Playful:
                case Expression.Proud:
                case Expression.Singing:
                case Expression.Dancing:
                    return 'animate-slime-jiggle';
                case Expression.Sad:
                case Expression.Cry:
                    return 'animate-slime-droop';
                case Expression.Angry:
                case Expression.Frustrated:
                    return 'animate-slime-boil';
                case Expression.Surprised:
                     return 'animate-slime-puff-up';
                case Expression.Scared:
                    return 'animate-tremble';
                case Expression.Loving:
                case Expression.Embarrassed:
                    return 'animate-loving-pulse';
                case Expression.Thinking:
                case Expression.Confuse:
                    return 'animate-slime-swirl';
                case Expression.Sleeping:
                case Expression.Tired:
                case Expression.Relaxed:
                    return 'animate-slime-breathe-slow';
            }
             if (!isSessionStarted || isInteracting || activeView !== 'none' || isFollowing) {
                return '';
            }
            return 'animate-slime-wobble';
        } else { // Not slime
            if (expression === Expression.Scared) {
                return 'animate-body-tremble';
            }
            switch (expression) {
                case Expression.Relaxed: return 'animate-body-sway';
                case Expression.Walking:
                case Expression.Focused: return 'animate-walk-bounce';
            }

            if (!isSessionStarted || isInteracting || activeView !== 'none' || expression === Expression.Sleeping || isFollowing) {
                return '';
            }
            
            if (expression === Expression.Neutral) {
                return isExploring ? 'animate-walk-bounce' : 'animate-float';
            }

            return '';
        }
    }, [isSessionStarted, isInteracting, activeView, expression, isFollowing, bodyAnimation, isExploring, isInGameMode, robotType]);
    
    const getRobotBodyStyles = (type: RobotType, expression: Expression): { main: string, front: string, shadow: string, frontStyle: React.CSSProperties, glowStyle: React.CSSProperties } => {
        const defaultStyles = { main: '', front: '', shadow: '', frontStyle: {}, glowStyle: {} };
        switch (type) {
            case 'slime':
                const slimeColorConfig: { front: string, shadow: string, glow: string } = (() => {
                     switch (expression) {
                        case Expression.Loving:
                        case Expression.Embarrassed: 
                            return { front: 'bg-pink-400/60 border-pink-300/70', shadow: 'shadow-[8px_8px_0px_0px_rgba(236,72,153,0.4)]', glow: '#f9a8d4' };
                        case Expression.Happy:
                        case Expression.Smile:
                        case Expression.Excited:
                        case Expression.Playful:
                        case Expression.Proud:
                        case Expression.Singing:
                        case Expression.Dancing: 
                            return { front: 'bg-yellow-300/70 border-yellow-200/80', shadow: 'shadow-[8px_8px_0px_0px_rgba(252,211,77,0.4)]', glow: '#fde047' };
                        case Expression.Angry:
                        case Expression.Frustrated: 
                            return { front: 'bg-red-500/60 border-red-400/70', shadow: 'shadow-[8px_8px_0px_0px_rgba(239,68,68,0.4)]', glow: '#f87171' };
                        case Expression.Sad:
                        case Expression.Cry: 
                            return { front: 'bg-blue-500/50 border-blue-400/60', shadow: 'shadow-[8px_8px_0px_0px_rgba(59,130,246,0.4)]', glow: '#60a5fa' };
                        case Expression.Scared:
                        case Expression.Surprised:
                             return { front: 'bg-indigo-400/60 border-indigo-300/70', shadow: 'shadow-[8px_8px_0px_0px_rgba(129,140,248,0.4)]', glow: '#a5b4fc' };
                        case Expression.Thinking:
                        case Expression.Confuse: 
                            return { front: 'bg-purple-400/60 border-purple-300/70', shadow: 'shadow-[8px_8px_0px_0px_rgba(168,85,247,0.4)]', glow: '#c084fc' };
                        case Expression.Sleeping:
                        case Expression.Tired:
                        case Expression.Relaxed:
                        case Expression.Dead: 
                            return { front: 'bg-gray-500/50 border-gray-400/60', shadow: 'shadow-[8px_8px_0px_0px_rgba(107,114,128,0.4)]', glow: '#9ca3af' };
                        default: 
                            return { front: 'bg-cyan-300/60 border-cyan-200/70', shadow: 'shadow-[8px_8px_0px_0px_rgba(20,83,100,0.3)]', glow: '#67e8f9' };
                    }
                })();

                const slimeShapeConfig: { borderRadius: string, transform?: string } = (() => {
                    switch (expression) {
                        case Expression.Happy:
                        case Expression.Smile:
                        case Expression.Excited:
                        case Expression.Playful:
                        case Expression.Proud:
                        case Expression.Singing:
                        case Expression.Dancing:
                            return { borderRadius: '55% 55% 45% 45% / 80% 80% 30% 30%' }; // Taller, bouncier shape
                        case Expression.Sad:
                        case Expression.Cry:
                            return { borderRadius: '60% 60% 30% 30% / 70% 70% 40% 40%' }; // Droopier top, flatter bottom
                        case Expression.Angry:
                        case Expression.Frustrated:
                            return { borderRadius: '70% 50% 60% 40% / 80% 60% 40% 50%' }; // Unstable, jagged shape
                        case Expression.Surprised:
                            return { borderRadius: '50%' }; // Perfectly round
                        case Expression.Scared:
                            return { borderRadius: '50% 50% 40% 40% / 90% 90% 20% 20%', transform: 'scale(0.95, 1.05)' }; // Squashed and wide
                        case Expression.Loving:
                        case Expression.Embarrassed:
                            return { borderRadius: '50% 50% 45% 45% / 85% 85% 25% 25%' }; // Heart-like top
                        case Expression.Thinking:
                        case Expression.Confuse:
                            return { borderRadius: '45% 55% 45% 55% / 70% 80% 30% 40%' }; // Asymmetrical, blobby
                        case Expression.Sleeping:
                        case Expression.Tired:
                        case Expression.Relaxed:
                        case Expression.Dead:
                            return { borderRadius: '50%', transform: 'scale(1.2, 0.7) translateY(25px)' }; // Puddle
                        default:
                            return { borderRadius: '60% 60% 45% 45% / 75% 75% 35% 35%' };
                    }
                })();

                let frontStyle: React.CSSProperties = { ...slimeShapeConfig, transition: 'border-radius 0.3s ease-in-out, transform 0.3s ease-in-out' };
                if (isSlimeTransparent) {
                    frontStyle.opacity = 0.4;
                }

                return {
                    main: `!w-64 !h-40`,
                    front: slimeColorConfig.front,
                    shadow: slimeColorConfig.shadow,
                    frontStyle: frontStyle,
                    glowStyle: { '--glow-color': slimeColorConfig.glow } as React.CSSProperties,
                };
            case 'cute':
                return {
                    ...defaultStyles,
                    front: 'bg-pink-200 border-pink-400 rounded-3xl',
                    shadow: 'shadow-[8px_8px_0px_0px_rgba(244,114,182,0.3)]',
                };
            case 'aros':
            default:
                return {
                    ...defaultStyles,
                    front: 'bg-gray-800 border-gray-700',
                    shadow: 'shadow-[8px_8px_0px_0px_rgba(72,187,255,0.2)]',
                };
        }
    };


    const currentExpression = isInGameMode ? Expression.Gaming : expression;
    const isUserWalking = [Expression.Walking, Expression.Focused, Expression.Surprised, Expression.Excited].includes(currentExpression) && !isExploring;
    const isUIBlocked = !isSessionStarted || isLoading || isInteracting || expression === Expression.Sleeping;
    const robotBodyStyles = getRobotBodyStyles(robotType, currentExpression);
    
    const RotateIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-cyan-300 mb-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.49 12.51a7.5 7.5 0 01-1.2 4.23M4.51 12.49a7.5 7.5 0 011.2-4.23" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.75V12.5h-4.75" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 16.25V11.5h4.75" />
        </svg>
    );

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 p-4 overflow-hidden">
            {isPortrait && (
                <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center z-[100] text-center p-8 animate-fadeIn">
                    <RotateIcon />
                    <h2 className="text-2xl font-display text-cyan-300 mb-2">Please Rotate Your Device</h2>
                    <p className="text-gray-300 font-body max-w-sm">
                        This experience is designed for landscape mode. Please turn your device sideways to continue.
                    </p>
                </div>
            )}

            <div className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 ${isPortrait ? 'invisible' : ''}`}>
                <div className="flex flex-col items-center gap-2 p-2 bg-gray-900/50 border border-gray-700/50 rounded-full">
                    <EmotePanel
                        onEmoteSelect={handleEmoteSelect}
                        isDisabled={isUIBlocked}
                    />
                    <CommandPanel
                        onCommandSelect={handleCommandSelect}
                        isDisabled={isUIBlocked}
                        robotType={robotType}
                    />
                </div>
            </div>

            <header className={`absolute top-0 left-0 p-4 w-full flex justify-between items-start z-10 ${isPortrait ? 'invisible' : ''}`}>
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-display text-cyan-300">Aros</h1>
                        <p className="text-gray-400 font-body">Your AI Robot Partner</p>
                    </div>
                     <InteractionMenu
                        onShowGames={handleShowGames}
                        onFeed={() => { playSound('click'); setShowFoodMenu(true); }}
                        onSleep={handleSleep}
                        onTakePhoto={() => handleLocalCommand('take a photo')}
                        onShowGallery={handleShowGallery}
                        onShowTypeSelector={() => { playSound('click'); setShowTypeSelector(true); }}
                        isDisabled={isUIBlocked}
                    />
                </div>
                <div className="flex items-center gap-4">
                    {isSessionStarted && <BatteryMeter level={batteryLevel} />}
                    <HelpButton onShowHelp={() => { playSound('click'); setShowHelpModal(true); }} />
                </div>
            </header>
            
            {showHelpModal && !isPortrait && <HelpModal onClose={() => setShowHelpModal(false)} robotType={robotType}/>}

            <main className={`flex-grow flex w-full transition-all duration-500 ${activeView !== 'none' ? 'flex-col md:flex-row items-center justify-center gap-8' : 'flex-col items-center justify-center'} ${isPortrait ? 'invisible' : ''}`}>
                 {activeView === 'none' && showFoodMenu && <FoodMenu onFeed={handleFeed} onClose={() => setShowFoodMenu(false)} />}
                 {activeView === 'none' && showTypeSelector && (
                    <TypeSelectorModal
                        onSelect={handleTypeSelect}
                        onClose={() => setShowTypeSelector(false)}
                        currentType={robotType}
                    />
                 )}
                
                <SlimeEffects state={slimeState} robotState={robotState} />

                <div className={`flex items-center justify-center transition-all duration-500 ${activeView !== 'none' ? 'w-full md:w-1/2' : 'w-auto'}`}>
                    <div
                        className="transition-transform duration-1000 ease-in-out"
                        style={{
                            transform: `
                                translateX(${robotState.x}px) 
                                translateY(${robotState.y + VERTICAL_OFFSET}px) 
                                scale(${1 + robotState.z * 0.25})
                            `,
                            perspective: '1000px',
                        }}
                    >
                        <div
                            onClick={handleRobotClick}
                            className={`relative w-64 h-52 transition-transform duration-200 ease-out ${isSessionStarted ? (expression === Expression.Sleeping ? 'cursor-pointer' : 'cursor-default') : 'cursor-default'} ${getBodyAnimationClass()}`}
                            style={{
                                transform: `rotateY(${robotState.rotation}deg)`,
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            <RobotProps expression={currentExpression} />
                            <SpecialEffects effect={specialEffect} />
                            
                            <div className={`relative w-56 h-40 mx-auto transition-opacity duration-300 ${!isMainSlimeVisible ? 'opacity-0' : 'opacity-100'} ${robotBodyStyles.main}`} style={{ transformStyle: 'preserve-3d' }}>
                                {/* Front Face */}
                                <div 
                                    className={`absolute w-full h-full`} 
                                    style={{ 
                                        backfaceVisibility: robotType === 'slime' ? 'visible' : 'hidden', 
                                        transform: 'rotateY(0deg)' 
                                    }}
                                >
                                    <div 
                                        className={`relative w-full h-full border-4 flex flex-col items-center justify-center animate-subtlePulse ${robotBodyStyles.front} ${robotBodyStyles.shadow} ${isSlimeGlowing ? 'animate-slime-glow' : ''}`}
                                        style={{...robotBodyStyles.frontStyle, ...robotBodyStyles.glowStyle}}
                                    >
                                        {isDisplayingMessage && <ChatBubble message={robotMessage} />}
                                        {robotType !== 'slime' && <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-700/50 to-transparent"></div>}
                                        <RobotEyes expression={currentExpression} robotType={robotType} />
                                    </div>
                                </div>
                                {/* Back Face */}
                                <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                    <RobotBack expression={currentExpression} robotType={robotType} />
                                </div>
                            </div>

                             <RobotHands expression={currentExpression} robotType={robotType} />
                             <RobotFeet expression={currentExpression} isUserWalking={isUserWalking} robotType={robotType} />
                        </div>
                    </div>
                </div>

                {activeView !== 'none' && (
                    <div className="w-full md:w-1/2 h-full flex items-center justify-center">
                        {activeView === 'camera' && (
                            <CameraView 
                                onCapture={handlePhotoCapture}
                                onClose={handleCloseSideView}
                            />
                        )}
                        {activeView === 'gallery' && (
                            <GalleryView
                                photos={galleryPhotos}
                                onClose={handleCloseSideView}
                            />
                        )}
                        {activeView === 'game' && (
                            <GameView
                                onClose={handleCloseSideView}
                                onGameWin={handleGameWin}
                                onGameStart={handleGameStart}
                            />
                        )}
                    </div>
                )}

                {!isSessionStarted && !isPortrait && (
                  <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-fadeIn">
                       <p className="mb-6 text-lg text-gray-300 font-body">Meet Aros — your playful AI pet!</p>
                       <p className="mb-6 text-lg text-gray-300 font-body">Click below to wake it up and start the fun.</p>
                       <button 
                            onClick={handleStartSession}
                            className="font-display text-xl bg-cyan-500 text-gray-900 py-3 px-8 hover:bg-cyan-400 disabled:bg-gray-600 transition-all duration-300 focus:outline-none border-4 border-gray-900 shadow-[8px_8px_0px_#1f2937] animate-pulse"
                       >
                           Wake Up
                       </button>
                  </div>
                )}
            </main>

            <footer className={`w-full flex justify-center p-4 ${isPortrait ? 'invisible' : ''}`}>
                <UserInput
                    userInput={userInput}
                    setUserInput={setUserInput}
                    onSubmit={handleTextInputSubmit}
                    isLoading={isLoading}
                    isDisabled={isUIBlocked}
                />
            </footer>
        </div>
    );
};

export default App;