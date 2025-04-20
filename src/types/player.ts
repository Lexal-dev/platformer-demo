export type Direction = 'left' | 'right' | 'default';

export interface PlayerStats {
    coins: number;
    lifePoint: number;
    lifePointMax: number;
    manaPoint: number;
    manaPointMax: number;
}

export interface MovementState {
    speed: number;
    lastDirection: Direction;
    onPushKey: string;
    jumpReady: boolean;
    doubleJumpReady: boolean;
    onSlide: boolean;
    onWallJump: boolean;
    onCrouch: boolean;
    onCrouchDisable: boolean;
    dashUp: boolean;
    isDashing: boolean;
    onWater: boolean;
    touchActive: boolean;
}

export interface FireballState {
    fireCharge: boolean;
    spellChargeTimer: Phaser.Time.TimerEvent | null;
    fireballCost : number,
    chargedFireballCost : number
}