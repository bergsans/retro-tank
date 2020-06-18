export interface HitLookUp extends Directions<ArrayFirstSecond> {}

type ArrayFirstSecond = {
    0: Coord;
    1: Coord;
} & Array<Coord>;

export interface PathNode {
    x: number;
    y: number;
    status: string;
    path: Direction[];
}

export interface Coord {
    x: number;
    y: number;
}

export interface Directions<T> {
    Up: T;
    Down: T;
    Right: T;
    Left: T;
}

export type Direction = keyof Directions<string>;

export type Level = string[][];

export interface HitsProp extends Coord {
    type: string;
}

export interface Enemy extends Coord {
    speed: number;
    status: boolean;
    spriteCount: number;
    direction: Direction;
    size: number;
}

export interface Event {
    isShooting: boolean;
    isMoving: Directions<boolean>;
    direction: Direction;
}

export interface Chest extends Coord {}

export interface Action extends Coord {
    direction: Direction;
    status: boolean;
    size: number;
    speed: number;
    hasHitEnemy: number;
}

export interface State extends Action {
    spriteCount: number;
    chests: Chest[];
    loading: number;
    isMoving: Directions<boolean>;
    isShooting: boolean;
    actions: Action[];
    level: false | Level;
    enemies: Enemy[];
    gameState: GameState;
}

type HitPartOfState = 'direction' | 'x' | 'y' | 'size' | 'speed';

export type HitState = Pick<State, HitPartOfState>;

export interface Body extends Coord {
    w: number;
    h: number;
}

export interface Hits {
    first: HitsProp;
    second: HitsProp;
}

export type Coords = Coord[];

export interface TankSprite extends Directions<Coords> {}

type ArrayTwoNumbers = {
    0: number;
    1: number;
} & Array<number>;

export interface Neighbours extends Directions<ArrayTwoNumbers> {}

export interface GhostSprite
    extends Pick<Directions<Coords>, 'Left' | 'Right'> {}

export interface ShotImage extends Coord {
    size: number;
}

export enum GameState {
    Playing,
    GameOver,
    PlayerWin
}

export interface App {
    state: State;
    constants: Constants;
}

export interface TileTypeImage {
    '1': Coord;
    '2': Coord;
    '3': Coord;
    '4': Coord;
    '5': Coord;
    '6': Coord;
}

export interface Constants {
    shotDiff: Neighbours;
    moveDiff: Neighbours;
    shotImage: ShotImage;
    ghostSprite: GhostSprite;
    tankSprite: TankSprite;
    tileSize: number;
    tileImage: TileTypeImage;
    loadSpeed: number;
    closedChest: string;
    openChest: string;
    floor: string;
    HEAD: number;
}
