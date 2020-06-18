import { Event, Direction, App } from './interfaces';

const eventState: Event = {
    direction: 'Down',
    isMoving: {
        Up: false,
        Down: false,
        Left: false,
        Right: false
    },
    isShooting: false
};

export function listenToEvents({ state, constants }: App) {
    const { direction } = eventState;
    if (eventState.isShooting) {
        state.isShooting = true;
        eventState.isShooting = false;
    }
    if (state.direction !== direction) {
        state.direction = eventState.direction;
    }
    if (state.isMoving[direction] !== eventState.isMoving[direction]) {
        state.isMoving[direction] =
            eventState.isMoving[direction as Direction];
    }
    return { state, constants };
}

export function handleKeyDown(event: KeyboardEvent) {
    if (
        event.key.startsWith('Arrow') &&
        !Object.values(eventState.isMoving).some(isMoving => isMoving)
    ) {
        const removeArrowFromKeyString = event.key.slice(5);
        eventState.direction = removeArrowFromKeyString as Direction;
        eventState.isMoving[removeArrowFromKeyString as Direction] = true;
    }
    if (event.key === 'Enter') {
        eventState.isShooting = true;
    }
}

export function handleKeyUp(event: KeyboardEvent) {
    if (event.key.startsWith('Arrow')) {
        const removeArrowFromKeyString = event.key.slice(5);
        eventState.isMoving[removeArrowFromKeyString as Direction] = false;
    }
    if (event.key === 'Enter') {
        eventState.isShooting = false;
    }
}
