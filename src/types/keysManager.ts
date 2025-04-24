import * as Phaser from 'phaser';

export type KeyBindings = {
    LEFT: string | number;
    RIGHT: string | number;
    JUMP: string | number;
    ATK: string | number;
    DASH: string | number;
    CROUCH: string | number;
    SPRINT: string | number;
    SPELL1: string | number;
    SPELL2: string | number;
    PAUSE: string | number;
    POSX: string | number;
    DEBUG: string | number;
};

export type KeyNames =
    | 'LEFT'
    | 'RIGHT'
    | 'JUMP'
    | 'ATK'
    | 'DASH'
    | 'CROUCH'
    | 'SPRINT'
    | 'SPELL1'
    | 'SPELL2'
    | 'PAUSE'
    | 'POSX'
    | 'DEBUG';

export type PhaserKeyBindings = {
    [K in keyof KeyBindings]: Phaser.Input.Keyboard.Key;
};
