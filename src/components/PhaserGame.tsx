'use client';
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import config from '@/phaser/config';

const PhaserGame = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const fullConfig: Phaser.Types.Core.GameConfig = {
      ...config,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: gameRef.current,
    };

    const game = new Phaser.Game(fullConfig);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameRef} className="w-full h-screen" />;
};

export default PhaserGame;