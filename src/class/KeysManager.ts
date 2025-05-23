import * as Phaser from 'phaser';
import { KeyBindings, PhaserKeyBindings, KeyNames } from '@/types/keysManager';

export default class KeyManager 
{
    private defaultKeys: KeyBindings;
    private keys: KeyBindings;
    private phaserKeys: PhaserKeyBindings;
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) 
    {
        this.scene = scene;

        // Default key bindings for the game
        this.defaultKeys = 
        {
            LEFT: 'Q',
            RIGHT: 'D',
            JUMP: Phaser.Input.Keyboard.KeyCodes.SPACE,
            ATK: 'F',
            DASH: 'R',
            CROUCH: 'S',
            SPRINT: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            SPELL1: 'A',
            SPELL2: 'E',
            PAUSE: Phaser.Input.Keyboard.KeyCodes.ESC,
            POSX: 'P',
            DEBUG: 'B',
        };

        // Load saved keys or use default ones
        this.keys = this.loadKeys();
        // Create Phaser key bindings
        this.phaserKeys = this.createPhaserKeys(this.keys);
    }

    // Load saved keys from localStorage or use default if none exist
    private loadKeys(): KeyBindings {
        const savedKeys = localStorage.getItem('playerKeys');
        if (savedKeys) 
        {
            try 
            {
                const parsed = JSON.parse(savedKeys);
                return { ...this.defaultKeys, ...parsed };
            } 
            catch 
            {
                return this.defaultKeys;
            }
        }
        return this.defaultKeys;
    }

    // Create Phaser key bindings from the given key mappings
    private createPhaserKeys(keys: KeyBindings): PhaserKeyBindings 
    {
        const keyboard = this.scene.input.keyboard;

        if (!keyboard) 
        {
            console.warn('⚠️ Keyboard input not ready yet.');
            return {} as PhaserKeyBindings;
        }

        return keyboard.addKeys(keys) as PhaserKeyBindings;
    }

    // Save the current key bindings to localStorage
    saveKeys(newKeys: KeyBindings): void 
    {
        this.keys = newKeys;
        localStorage.setItem('playerKeys', JSON.stringify(newKeys));
    }

    // Update Phaser key bindings after changes
    updateKeys(): void 
    {
        this.phaserKeys = this.createPhaserKeys(this.keys);
    }

    // Get the current Phaser key bindings
    getKeys(): PhaserKeyBindings 
    {
        return this.phaserKeys;
    }

    // Change a specific key binding
    changeKey(key: KeyNames, newKey: string | number): void 
    {
        if (key in this.keys) 
        {
            this.keys[key] = newKey;
            this.saveKeys(this.keys);
            this.updateKeys();
        }
    }
}
