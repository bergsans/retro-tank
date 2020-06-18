import { compose, tee } from './utilities';
import { drawShots, drawEnemies, drawLevel, drawTank } from './draw-fns';
import { getLevel } from './helpers';
import { constants } from './constants';
import { listenToEvents, handleKeyUp, handleKeyDown } from './events';
import {
    handleObjects,
    handleMovement,
    handleEnemies,
    handleCanon,
    handleChests,
    handleGameStates
} from './state-changes';
import { State, App, GameState } from './interfaces';

const ONCE_FRST_LEVEL = 0;

const initialState: State = {
    x: 288,
    y: 150,
    speed: 5,
    spriteCount: 0,
    chests: getLevel.chests(ONCE_FRST_LEVEL, constants),
    status: true,
    size: 32,
    hasHitEnemy: -1,
    loading: 0,
    direction: 'Down',
    isMoving: {
        Up: false,
        Down: false,
        Left: false,
        Right: false
    },
    isShooting: false,
    gameState: GameState.Playing,
    actions: [],
    level: getLevel.first(constants).level,
    enemies: getLevel.first(constants).enemies
};

const gameLoop = (appState: App) => {
    const { state, constants } = compose(
        handleGameStates,
        tee(drawShots),
        tee(drawEnemies),
        tee(drawTank),
        tee(drawLevel),
        listenToEvents,
        handleObjects,
        handleEnemies,
        handleMovement,
        handleCanon,
        handleChests
    )(appState);
    state.gameState === GameState.Playing &&
        requestAnimationFrame(() => gameLoop({ state, constants }));
};
requestAnimationFrame(() => gameLoop({ state: initialState, constants }));

document.addEventListener('keyup', handleKeyUp);
document.addEventListener('keydown', handleKeyDown);
