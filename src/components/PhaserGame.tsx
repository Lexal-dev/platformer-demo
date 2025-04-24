'use client';
import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import config from '@/phaser/config';

const PhaserGame = () => {
    const gameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check if the gameRef is available
        if (!gameRef.current) return;

        // Set up the game configuration
        const fullConfig: Phaser.Types.Core.GameConfig = {
            ...config,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: gameRef.current,
        };

        // Create a new Phaser game with the full configuration
        const game = new Phaser.Game(fullConfig);

        // Cleanup function to destroy the game when the component unmounts
        return () => {
            game.destroy(true);
        };
    }, []);

    return <div ref={gameRef} className="w-full h-screen" />;
};

export default PhaserGame;