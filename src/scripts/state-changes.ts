import {
    Action,
    Neighbours,
    App,
    Direction,
    Enemy,
    GameState
} from './interfaces';
import { drawMessage } from './draw-fns';
import {
    isActive,
    getLevel,
    isMovementPossible,
    findPath,
    isAHit,
    getBody,
    isPlayerInRange,
    fireCanon,
    isEnemyHit,
    isEnemyPositionEven
} from './helpers';

export function handleEnemies({ state, constants }: App) {
    const { moveDiff, HEAD } = constants;
    const newEnemies: Enemy[] = state.enemies.map(
        (enemy: Enemy, enemyIndex: number) => {
            let { x, y, direction, status, spriteCount } = enemy;
            const playerBody = getBody(state);
            const enemyInRangeOfPlayer = isPlayerInRange(enemy);
            if (!isAHit(enemyInRangeOfPlayer, playerBody)) {
                return enemy;
            } else if (isEnemyPositionEven(enemy.x)) {
                const enemyCoords = {
                    x: Math.floor(enemy.x / enemy.size),
                    y: Math.floor(enemy.y / enemy.size)
                };
                const playerCoords = {
                    x: Math.floor(state.x / state.size),
                    y: Math.floor(state.y / state.size)
                };
                const track =
                    state.level &&
                    findPath(
                        state.level,
                        enemyCoords,
                        playerCoords,
                        constants
                    );
                if (track !== false) {
                    direction = track[HEAD] as Direction;
                }
            }
            const [horisontal, vertical] = moveDiff[direction];
            x += horisontal;
            y += vertical;
            spriteCount = spriteCount + 1 === 3 ? 0 : spriteCount + 1;
            status = isEnemyHit(state.actions, enemyIndex) ? false : true;
            return { ...enemy, direction, x, y, status, spriteCount };
        }
    );
    state.enemies = newEnemies.filter(isActive);
    return { state, constants };
}

export function handleObjects({ state, constants }: App) {
    const newActions = state.actions.filter(isActive).map(action => {
        let { x, y, status, hasHitEnemy } = action;
        const { isPossible } = isMovementPossible(
            action,
            state.level,
            constants
        );
        if (isPossible) {
            const { moveDiff } = constants;
            const [horisontal, vertical] = moveDiff[action.direction];
            x += horisontal * action.speed;
            y += vertical * action.speed;
        } else {
            status = false;
        }
        hasHitEnemy = state.enemies.findIndex(enemy =>
            isAHit(
                {
                    x: enemy.x,
                    y: enemy.y,
                    w: enemy.size,
                    h: enemy.size
                },
                {
                    x: action.x,
                    y: action.y,
                    w: action.size,
                    h: action.size
                }
            )
        );
        if (hasHitEnemy !== -1) {
            status = false;
        }
        return { ...action, status, x, y, hasHitEnemy };
    });
    state.actions = [...newActions];
    return { state, constants };
}

export function handleMovement({ state, constants }: App) {
    const { moveDiff, openChest, closedChest } = constants;
    const possibleMoves = Object.entries(state.isMoving);
    const actualMove = possibleMoves.find(([_, isMoving]) => isMoving);
    let {
        direction,
        gameState,
        status,
        size,
        speed,
        x,
        y,
        spriteCount,
        hasHitEnemy
    } = state;
    if (actualMove) {
        const orientation = 0;
        const inDirection = actualMove[orientation];
        const [horisontal, vertical] = moveDiff[
            inDirection as keyof Neighbours
        ];
        const moveAsAction: Action = {
            direction,
            status,
            size,
            speed,
            x,
            y,
            hasHitEnemy
        };
        const currentMove = isMovementPossible(
            moveAsAction,
            state.level,
            constants
        );
        if (currentMove.isPossible && state.level) {
            if (currentMove.hits) {
                const { first, second } = currentMove.hits;
                if (
                    first.type === closedChest ||
                    second.type === closedChest
                ) {
                    first.type === closedChest
                        ? (state.level[first.y][first.x] = openChest)
                        : (state.level[second.y][second.x] = openChest);
                    state.chests = state.chests.filter(
                        chest =>
                            (chest.x !== first.x && chest.y !== first.x) ||
                            (chest.x !== second.x && chest.y !== second.y)
                    );
                }
                spriteCount = spriteCount + 1 === 2 ? 0 : spriteCount + 1;
                y += vertical;
                x += horisontal;
            }
        }
    }
    hasHitEnemy = state.enemies.findIndex(enemy =>
        isAHit(
            {
                x: enemy.x,
                y: enemy.y,
                w: enemy.size,
                h: enemy.size
            },
            {
                x,
                y,
                w: size,
                h: size
            }
        )
    );
    if (hasHitEnemy !== -1) {
        gameState = GameState.GameOver;
    }
    state = { ...state, hasHitEnemy, gameState, x, y, spriteCount };
    return { state, constants };
}

export function handleCanon({ state, constants }: App) {
    let { loading, isShooting } = state;
    const { loadSpeed } = constants;
    if (isShooting) {
        isShooting = false;
        if (loading === 0) {
            loading = loadSpeed;
            const newShot = fireCanon(state, constants);
            state.actions.push(newShot);
        }
    }
    if (loading > 0) {
        loading--;
    }
    state = { ...state, loading, isShooting };
    return { state, constants };
}

export function handleGameStates({ state, constants }: App) {
    if (state.gameState !== GameState.Playing) {
        // side-effects
        if (state.gameState === GameState.PlayerWin) {
            console.log('This is the End');
            drawMessage('This is the End.');
        } else if (state.gameState === GameState.GameOver) {
            console.log('Game Over');
            drawMessage('Game Over');
        }
    }
    return { state, constants };
}
export function handleChests({ state, constants }: App) {
    if (state.chests.length === 0) {
        const nextLevel = getLevel.next(constants);
        if (!nextLevel.level) {
            state.gameState = GameState.PlayerWin;
        } else {
            state.level = nextLevel.level;
            state.enemies = nextLevel.enemies;
            state.chests = getLevel.chests(state.level, constants);
        }
    }
    return { state, constants };
}
