import {
    Hits,
    Neighbours,
    Body,
    Constants,
    Direction,
    Coord,
    PathNode,
    Level,
    Action,
    Enemy,
    HitLookUp,
    State
} from './interfaces';
import { rawLevels } from './data/raw-levels';
import { enemySize } from './constants';

export const isEven = (divider: number) => (divisor: number) =>
    divisor % divider === 0;

export const isEnemyPositionEven = isEven(enemySize);

export function fireCanon(state: State, constants: Constants) {
    const NO_ENEMY_IS_HIT = -1;
    const { shotDiff, shotImage } = constants;
    const { x, y, direction } = state;
    const [dX, dY] = shotDiff[direction];
    return {
        x: x + dX,
        y: y + dY,
        status: true,
        size: shotImage.size,
        speed: 10,
        direction,
        hasHitEnemy: NO_ENEMY_IS_HIT
    };
}
export const isPlayerInRange = (enemy: Enemy): Body => {
    const diff250 = 250;
    return {
        x: enemy.x - diff250,
        y: enemy.y - diff250,
        w: enemy.size + diff250 * 2,
        h: enemy.size + diff250 * 2
    };
};

export const getBody = (body: Enemy | State): Body => ({
    x: body.x,
    y: body.y,
    w: body.size,
    h: body.size
});

export function extractEnemies(
    level: Level,
    constants: Constants
): { enemies: Enemy[]; level: Level } {
    const { tileSize, floor } = constants;
    const enemies: Enemy[] = [];
    const newLevel = [...level].map((rows, i) =>
        rows.map((cell, j) => {
            if (cell === 'x') {
                enemies.push({
                    x: j * tileSize,
                    y: i * tileSize,
                    status: true,
                    spriteCount: 0,
                    speed: 1,
                    size: 32,
                    direction: getRandomInt(2) === 0 ? 'Left' : 'Right'
                });
                return floor;
            } else {
                return cell;
            }
        })
    );
    return { enemies, level: newLevel };
}

const [first, ...levels] = rawLevels;

export const getLevel = {
    first: (constants: Constants) =>
        extractEnemies(format(first), constants),
    chests: (x: Level | number, constants: Constants) =>
        x !== 0
            ? findChests(x as Level, constants)
            : findChests(format(first), constants),
    next: (
        constants: Constants
    ): { enemies: Enemy[]; level: Level } | { level: false } => {
        const nextLevel = levels.shift();
        return levels.length > 0 && nextLevel !== undefined
            ? extractEnemies(format(nextLevel), constants)
            : { level: false };
    }
};

export function isPosObject(pos: string, constants: Constants): boolean {
    return (
        pos === constants.floor ||
        pos === constants.closedChest ||
        pos === constants.openChest
    );
}

export function isAHit(firstBody: Body, secondBody: Body): boolean {
    return (
        firstBody.x < secondBody.x + secondBody.w &&
        firstBody.x + firstBody.w > secondBody.x &&
        firstBody.y < secondBody.y + secondBody.h &&
        firstBody.y + firstBody.h > secondBody.y
    );
}

export function isMovementPossible(
    act: Action,
    level: Level | false,
    constants: Constants
): { isPossible: boolean; hits?: Hits } {
    const { tileSize } = constants;
    const DFF = 6;
    const { direction, x, y, size, speed } = act;
    let hits: Hits;
    const directionsPossibilities: HitLookUp = {
        Up: [
            {
                x: Math.floor(x / tileSize),
                y: Math.floor((y - speed - DFF) / tileSize)
            },
            {
                x: Math.floor((x + size - DFF) / tileSize),
                y: Math.floor((y - speed - DFF) / tileSize)
            }
        ],
        Right: [
            {
                x: Math.floor((x + size + speed - DFF) / tileSize),
                y: Math.floor((y + DFF) / tileSize)
            },
            {
                x: Math.floor((x + size + speed - DFF) / tileSize),
                y: Math.floor((y - DFF + size) / tileSize)
            }
        ],
        Down: [
            {
                x: Math.floor(x / tileSize),
                y: Math.floor((y + size + speed - DFF) / tileSize)
            },
            {
                x: Math.floor((x + size - DFF) / tileSize),
                y: Math.floor((y + size + speed - DFF) / tileSize)
            }
        ],
        Left: [
            {
                x: Math.floor((x - speed - DFF) / tileSize),
                y: Math.floor((y + DFF) / tileSize)
            },
            {
                x: Math.floor((x - speed - DFF) / tileSize),
                y: Math.floor((y - DFF + size) / tileSize)
            }
        ]
    };
    const [first, second] = directionsPossibilities[direction];
    if (
        level &&
        isPosObject(level[first.y][first.x], constants) &&
        isPosObject(level[second.y][second.x], constants)
    ) {
        hits = {
            first: {
                type: level[first.y][first.x],
                x: first.x,
                y: first.y
            },
            second: {
                type: level[second.y][second.x],
                x: second.x,
                y: second.y
            }
        };
        return {
            isPossible: true,
            hits
        };
    } else {
        return {
            isPossible: false
        };
    }
}

export function findPath(
    level: Level,
    startCoordinates: Coord,
    endCoordinates: Coord,
    constants: Constants
) {
    let grid = level.map(el => [...el]);
    const queue: PathNode[] = [
        {
            y: startCoordinates.y,
            x: startCoordinates.x,
            path: [],
            status: 'Known'
        }
    ];
    grid[endCoordinates.y][endCoordinates.x] = 'G';
    while (queue.length > 0) {
        let currentLocation = queue.shift();
        if (currentLocation === undefined) {
            continue;
        }
        for (const direction of ['Up', 'Down', 'Left', 'Right']) {
            const { moveDiff } = constants;
            const newPath = currentLocation.path.slice();
            newPath.push(direction as Direction);
            let { x, y } = currentLocation;
            const [horisontal, vertical] = moveDiff[
                direction as keyof Neighbours
            ];
            x += horisontal;
            y += vertical;
            const newLocation = {
                y,
                x,
                path: newPath,
                status: 'Unknown'
            };
            if (
                newLocation.x < 0 ||
                newLocation.x >= grid[0].length ||
                newLocation.y < 0 ||
                newLocation.y >= grid.length
            ) {
                newLocation.status = 'Invalid';
            } else if (grid[y][x] === 'G') {
                newLocation.status = 'Goal';
                return newLocation.path;
            } else if (grid[y][x] !== constants.floor) {
                newLocation.status = 'Blocked';
            } else {
                newLocation.status = 'Valid';
                grid[newLocation.y][newLocation.x] = 'Visited';
                queue.push(newLocation);
            }
        }
    }
    return false;
}

export const isActive = (entity: Enemy | Action) => entity.status === true;

export const isEnemyHit = (
    actions: Action[],
    enemyIndex: number
): boolean =>
    actions.some((action: Action) => action.hasHitEnemy === enemyIndex);

function format(level: string): Level {
    const rows = level.split('\n');
    return rows.map(cell => cell.split(''));
}

function findChests(level: Level, constants: Constants) {
    return level.reduce((acc: Coord[], row, i) => {
        const found: Coord[] = [];
        row.forEach((x, j) => {
            if (x === constants.closedChest) {
                found.push({
                    x: j,
                    y: i
                });
            }
        });
        return acc.concat(found);
    }, []);
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}
