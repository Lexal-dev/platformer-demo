'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import config from '@/phaser/config';

const PhaserGame = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameInstance = useRef<Phaser.Game | null>(null);

  // Handle window resizing
  const handleResize = () => {
    if (gameInstance.current) {
      gameInstance.current.scale.resize(window.innerWidth, window.innerHeight);
    }
  };

  useEffect(() => {
    if (!gameRef.current) return;

    const fullConfig: Phaser.Types.Core.GameConfig = {
      ...config,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: gameRef.current,
    };

    // Create the game instance
    gameInstance.current = new Phaser.Game(fullConfig);

    // Add resize listener
    window.addEventListener('resize', handleResize);

    return () => {
      if (gameInstance.current) {
        gameInstance.current.destroy(true);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={gameRef} className="w-full h-screen" />;
};

export default PhaserGame;