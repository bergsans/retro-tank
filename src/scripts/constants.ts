import {
    TileTypeImage,
    TankSprite,
    ShotImage,
    GhostSprite,
    Neighbours,
    Constants
} from './interfaces';

// Time it takes to reload
export const loadSpeed: number = 40;

// Size of tiles and sprites
export const tileSize: number = 32;
export const enemySize: number = 32;

// First element of list
export const HEAD: number = 0;

// Level types
export const closedChest: string = '5';
export const openChest: string = '6';
export const floor: string = '0';

// mage data
export const tileImage: TileTypeImage = {
    '1': { x: 0, y: 0 },
    '2': { x: 64, y: 0 },
    '3': { x: 128, y: 0 },
    '4': { x: 192, y: 0 },
    '5': { x: 256, y: 0 },
    '6': { x: 320, y: 0 }
};

export const tankSprite: TankSprite = {
    Up: [
        { x: 0, y: 64 },
        { x: 64, y: 64 }
    ],
    Down: [
        { x: 128, y: 64 },
        { x: 192, y: 64 }
    ],
    Left: [
        { x: 256, y: 64 },
        { x: 320, y: 64 }
    ],
    Right: [
        { x: 384, y: 64 },
        { x: 448, y: 64 }
    ]
};

export const ghostSprite: GhostSprite = {
    Left: [
        { x: 0, y: 128 },
        { x: 64, y: 128 },
        { x: 128, y: 128 }
    ],
    Right: [
        { x: 192, y: 128 },
        { x: 320, y: 128 },
        { x: 386, y: 128 }
    ]
};

export const shotImage: ShotImage = {
    x: 64,
    y: 0,
    size: 10
};

// Helpers for movement
export const moveDiff: Neighbours = {
    Left: [-1, 0],
    Right: [1, 0],
    Up: [0, -1],
    Down: [0, 1]
};
export const shotDiff: Neighbours = {
    Left: [0, tileSize / 2],
    Right: [tileSize, tileSize / 2],
    Up: [tileSize / 2, 0],
    Down: [tileSize / 2, tileSize]
};

export const constants: Constants = {
    shotDiff,
    moveDiff,
    shotImage,
    ghostSprite,
    tankSprite,
    tileSize,
    tileImage,
    loadSpeed,
    floor,
    closedChest,
    openChest,
    HEAD
};
