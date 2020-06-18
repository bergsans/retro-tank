import graphics from './data/graphics.png';
import {
    Coord,
    State,
    TileTypeImage,
    Action,
    App,
    Enemy
} from './interfaces';

const canvasRef = document.querySelector<HTMLCanvasElement>('#game');
const ctx =
    canvasRef && <CanvasRenderingContext2D>canvasRef.getContext('2d');

const img = new Image();
img.src = graphics;

function getRelativePos(state: State, entity: Coord) {
    const { x, y } = state;
    let relX = x;
    let relY = y;
    if (entity.x <= x && entity.y <= y) {
        relX = 224 - Math.abs(x - entity.x);
    } else if (entity.x >= x && entity.y <= y) {
        relY = 224 - Math.abs(y - entity.y);
        relX = 224 + Math.abs(x - entity.x);
        relY = 224 - Math.abs(y - entity.y);
    } else if (entity.x <= x && entity.y >= y) {
        relX = 224 - Math.abs(x - entity.x);
        relY = 224 + Math.abs(y - entity.y);
    } else if (entity.x >= x && entity.y >= y) {
        relX = 224 + Math.abs(x - entity.x);
        relY = 224 + Math.abs(y - entity.y);
    }
    return { relX, relY };
}

export function drawShots({ state, constants }: App) {
    if (!ctx) {
        return;
    }
    const { shotImage } = constants;
    const { actions } = state;
    if (!state.status) {
        return;
    }
    actions.map((entity: Action) => {
        if (entity !== undefined && entity.status) {
            const { relX, relY } = getRelativePos(state, entity);
            ctx.drawImage(
                img,
                shotImage.x,
                shotImage.y,
                shotImage.size,
                shotImage.size,
                relX,
                relY,
                shotImage.size,
                shotImage.size
            );
        }
    });
}

export function drawEnemies({ state, constants }: App) {
    if (!ctx) {
        return;
    }
    if (!state.status) {
        return;
    }
    const { ghostSprite } = constants;
    state.enemies.map((enemy: Enemy) => {
        if (enemy && enemy.status) {
            const direction =
                enemy.direction === 'Left' || enemy.direction === 'Right'
                    ? enemy.direction
                    : 'Left';
            const { relX, relY } = getRelativePos(state, enemy);
            ctx.drawImage(
                img,
                ghostSprite[direction][enemy.spriteCount].x,
                ghostSprite[direction][enemy.spriteCount].y,
                64,
                64,
                relX,
                relY,
                enemy.size,
                enemy.size
            );
        }
    });
}

export function drawTank({ state, constants }: App) {
    if (!ctx || !img || !state.status) {
        return;
    }
    const { direction, spriteCount } = state;
    const { tileSize, tankSprite } = constants;
    ctx.drawImage(
        img,
        tankSprite[direction][spriteCount].x,
        tankSprite[direction][spriteCount].y,
        64,
        64,
        220,
        220,
        tileSize,
        tileSize
    );
}

export function drawMessage(msg: string) {
    if (!ctx) {
        return;
    }
    const render = () => {
        ctx.font = '100px ARCADECLASSIC';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(msg, 240, 240);
    };
    (document as any).fonts.load('100px "ARCADECLASSIC"').then(render);
}

export function drawLevel({ state, constants }: App) {
    if (!ctx) {
        return;
    }
    const { tileSize, tileImage, floor } = constants;
    if (!state.level || !state.status) {
        return;
    }
    ctx.fillStyle = '#fffff8';
    ctx.fillRect(0, 0, 480, 480);
    const minX = Math.floor(state.x / tileSize) - 7;
    const minY = Math.floor(state.y / tileSize) - 7;
    const diffX = state.x - Math.floor(state.x / tileSize) * tileSize;
    const diffY = state.y - Math.floor(state.y / tileSize) * tileSize;
    let arrY = minY;
    let arrX;
    for (let y = 0; y < 16; y++) {
        arrX = minX;
        for (let x = 0; x < 16; x++) {
            if (
                arrY >= 0 &&
                arrY < state.level.length &&
                arrX >= 0 &&
                arrX < state.level[0].length
            ) {
                const currentTile = state.level[arrY][arrX];
                if (currentTile !== floor) {
                    let currentY = y * tileSize - diffY;
                    let currentX = x * tileSize - diffX;
                    ctx.drawImage(
                        img,
                        tileImage[currentTile as keyof TileTypeImage].x,
                        tileImage[currentTile as keyof TileTypeImage].y,
                        64,
                        64,
                        currentX,
                        currentY,
                        tileSize,
                        tileSize
                    );
                }
            }
            arrX++;
        }
        arrY++;
    }
}
