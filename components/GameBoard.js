import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'

const randomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const getEmptyCoordinate = function (occupied, pixelNumber) {
    let newPos = `${randomInteger(1, pixelNumber)}_${randomInteger(1, pixelNumber)}`;
    while (occupied.includes(newPos)) {
        newPos = `${randomInteger(1, pixelNumber)}_${randomInteger(1, pixelNumber)}`;
    }
    return newPos
}
const getWallCordinates = function (upperbound) {
    let ret = new Set();
    for (let i = 0; i <= upperbound; i++) {
        ret.add(`0_${i}`);
        ret.add(`${i}_0`);
        ret.add(`${upperbound}_${i}`);
        ret.add(`${i}_${upperbound}`);
    }
    return ret;
}
const snakeTeleport = function (coordinate, direction, boundNumber) {
    let ret = coordinate.split("_");
    switch (direction) {
        case 'ArrowDown':
            ret[1] = 1;
            break;
        case 'ArrowUp':
            ret[1] = boundNumber;
            break;
        case 'ArrowLeft':
            ret[0] = boundNumber;
            break;
        case 'ArrowRight':
            ret[0] = 1;
            break;
        default:
            return;
    }
    return ret.join('_');
}
const snakeGo = function (coordinate, direction) {
    let ret = coordinate.split("_");
    switch (direction) {
        case 'ArrowDown':
            ret[1]++;
            break;
        case 'ArrowUp':
            ret[1]--;
            break;
        case 'ArrowLeft':
            ret[0]--;
            break;
        case 'ArrowRight':
            ret[0]++;
            break;
        default:
            return;
    }
    return ret.join('_');
}
export default function GameBoard(props) {
    // props
    const boundNumber = props.pixelNumber + 1;
    const direction = props.snakeDirection;
    const isGameOver = props.isGameOver;
    const setIsGameOver = props.setIsGameOver;

    // optional props
    const snakeStart = props.snakeStart || '0_0';
    const appleStart = props.appleStart || '0_1;'
    const blocksStart = props.blocksStart || [];
    const teleportOK = props.teleportOK || true;
    const delay = props.delay || 200;
    const startScore = props.startScore || 0;

    //consts
    const wallCoordinates = getWallCordinates(boundNumber);

    // prop states
    const [appleCoordinate, setAppleCoordinate] = useState(appleStart);
    const [snakeCoordinates, setSnakeCoordinates] = useState([snakeStart]);
    const [blockCoordinates, setBlockCoordinates] = useState(blocksStart);
    const [score, setScore] = useState(startScore);
    //local states
    const [count, setCount] = useState(0);
    const [snakeDirection, setSnakeDirection] = useState(direction);

    //effects
    useEffect(() => {
        const t = setInterval(() => {

            if (snakeDirection && (!isGameOver)) {
                let newCoordinate = snakeGo(snakeCoordinates[0], snakeDirection);
                const newcoordinates = snakeCoordinates.slice();
                if (wallCoordinates.has(newCoordinate)) {
                    if (!teleportOK) {
                        setIsGameOver(true);
                        return
                    } else {
                        newCoordinate = snakeTeleport(snakeCoordinates[0], snakeDirection, boundNumber-1);
                    }

                } else if (snakeCoordinates.includes(newCoordinate)) {
                    setIsGameOver(true);
                    return
                } else if (blockCoordinates.includes(newCoordinate)) {
                    setIsGameOver(true);
                    return
                }
                if (newCoordinate === appleCoordinate) {
                    newcoordinates.unshift(newCoordinate);
                    setSnakeCoordinates(newcoordinates);
                    setAppleCoordinate(getEmptyCoordinate(newcoordinates.concat(blockCoordinates), boundNumber-1));
                } else {
                    newcoordinates.unshift(newCoordinate);
                    newcoordinates.pop();
                    setSnakeCoordinates(newcoordinates);
                }

                setCount((count + 1) % 15)
                let gen = randomInteger(1, 3)
                if (count === 0 && (gen === 1)) {
                    const front1 = snakeGo(snakeCoordinates[0], snakeDirection)
                    const front2 = snakeGo(front1, snakeDirection)
                    const block = getEmptyCoordinate(newcoordinates.concat([appleCoordinate, front1, front2], blockCoordinates), boundNumber-1)
                    let newBlockCoordinate = blockCoordinates.slice();
                    newBlockCoordinate.unshift(block);
                    if (newBlockCoordinate.length > 3) {
                        newBlockCoordinate.pop()
                    }
                    setBlockCoordinates(newBlockCoordinate)
                }

            }
        }, delay)
        return () => clearInterval(t)
    })
    useEffect(e => setScore(score + 1), [appleCoordinate])
    useEffect(e => {
        if (direction !== undefined) {
            if (snakeGo(snakeCoordinates[0], direction) === snakeCoordinates[1]) return;
        }
        setSnakeDirection(direction);

    }, [direction])
    const board = Array(boundNumber + 1).fill().slice().map(($, i) => {
        const rowItems = Array(boundNumber + 1).fill().slice().map(($, j) => {
            const isSnake = snakeCoordinates.includes(`${j}_${i}`);
            const isWall = wallCoordinates.has(`${j}_${i}`);
            const isApple = (appleCoordinate === `${j}_${i}`);
            const isRock = blockCoordinates.includes(`${j}_${i}`)
            const name = [styles.grid];
            if (snakeCoordinates[0] === `${j}_${i}`)
                return <div key={`item_${j}_${i}`} className={[styles.grid, styles.head].join(" ")} >
                    &nbsp;
                </div>
            if (isSnake) {
                name.push(styles.snake);
            } else if (isWall) {
                name.push(styles.wall);
            } else if (isApple) {
                name.push(styles.apple);
            } else if (isRock) {
                name.push(styles.rock);
            }
            return <div key={`item_${j}_${i}`} className={name.join(" ")} style={{ flexGrow: 1 }}>&nbsp;</div>
        })

        return <div key={`row_${i}`} className={styles.row} >{rowItems}</div>
    })
    return <div style={{ height: '50vmin', width: '50vmin' }}>{board}</div>
}