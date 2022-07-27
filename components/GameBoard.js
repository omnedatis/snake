import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'

const randomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const getEmptyCoordinate = function (occupied, upperbound) {
    let newPos = `${randomInteger(1, upperbound)}_${randomInteger(1, upperbound)}`;
    while (occupied.includes(newPos)) {
        newPos = `${randomInteger(1, upperbound)}_${randomInteger(1, upperbound)}`;
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
const fetcher = async function (path, data) {
    const url = `http://localhost:3000/${path}`
    const req = {
        method: 'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data),
        redirect: "follow"
    }
    const resp =  await fetch(url, req).then(res => res.json())
    return resp
}
const getSnakeStart = async function (boardSize) {
    const path = '/api/getSnakeStart'
    const resp = await fetcher(path, {boardSize:boardSize}).then(data =>data);
    return resp.body.snakeStart
}
const getAppleStart = async function (occupied, boardSize) {
    const path = '/api/getAppleStart'
    const resp = await fetcher(path, {boardSize:boardSize, occupied:occupied}).then(data =>data);
    return resp.body.appleStart
}
export default function GameBoard (props) {

    
    // props
    const boardSize = props.boardSize;
    const boundNumber = boardSize + 1;
    const direction = props.snakeDirection;

    // optional props
    const snakeStart = props.snakeStart 
    const appleStart = props.appleStart 
    const rocksStart = props.rocksStart || [];
    const teleportOK = props.teleportOK ?? true;
    const delay = props.delay || 200;
    const rockNumber = props.rockNumber || 3;
    const frame = props.frame || { height: '50vmin', width: '50vmin' };

    const score = props.score || 0;
    const setScore = props.setScore || function () { e => score++ };
    const isGameOver = props.isGameOver || false;
    const setIsGameOver = props.setIsGameOver || function () { isGameOver = true };

    //consts
    const wallCoordinates = getWallCordinates(boundNumber);
    const genRockPeriod = 15;

    // prop states
    const [appleCoordinate, setAppleCoordinate] = useState(appleStart);
    const [snakeCoordinates, setSnakeCoordinates] = useState([snakeStart]);
    const [rockCoordinates, setrockCoordinates] = useState(rocksStart);
    
    //local states
    const [count, setCount] = useState(1);
    const [snakeDirection, setSnakeDirection] = useState(direction);

    //effects
    useEffect(()=>{
        let snake;
        if (snakeStart === undefined){
            snake = getSnakeStart(boardSize).then(data=> {
                setSnakeCoordinates([data])
                return data
            });
        }
        if (appleStart === undefined){
            getAppleStart([snake], boardSize).then(data=> setAppleCoordinate(data));
        }
    }, [])
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
                        newCoordinate = snakeTeleport(snakeCoordinates[0], snakeDirection, boundNumber - 1);
                    }

                } else if (snakeCoordinates.includes(newCoordinate)) {
                    setIsGameOver(true);
                    return
                } else if (rockCoordinates.includes(newCoordinate)) {
                    setIsGameOver(true);
                    return
                }
                if (newCoordinate === appleCoordinate) {
                    newcoordinates.unshift(newCoordinate);
                    setSnakeCoordinates(newcoordinates);
                    setAppleCoordinate(getEmptyCoordinate(newcoordinates.concat(rockCoordinates), boundNumber - 1));
                    setScore(score + 1);
                } else {
                    newcoordinates.unshift(newCoordinate);
                    newcoordinates.pop();
                    setSnakeCoordinates(newcoordinates);
                }

                setCount((count + 1) % genRockPeriod)

                if (count === 0) {
                    const front1 = snakeGo(snakeCoordinates[0], snakeDirection)
                    const front2 = snakeGo(front1, snakeDirection)
                    const newRock = getEmptyCoordinate(newcoordinates.concat([appleCoordinate, front1, front2], rockCoordinates), boundNumber - 1)
                    const newRockCoordinate = rockCoordinates.slice();
                    const gen = randomInteger(1, 3)
                    if (gen === 1) {
                        newRockCoordinate.unshift('')
                    } else {
                        newRockCoordinate.unshift(newRock);
                    }
                    if (newRockCoordinate.length > rockNumber) {
                        newRockCoordinate.pop()
                    }
                    setrockCoordinates(newRockCoordinate)
                }

            }
        }, delay)
        return () => clearInterval(t)
    });
    useEffect(e => {
        if (direction !== undefined) {
            if (snakeGo(snakeCoordinates[0], direction) === snakeCoordinates[1]) return;
        }
        setSnakeDirection(direction);

    }, [direction]);
    const board = Array(boundNumber + 1).fill().slice().map(($, i) => {
        const rowItems = Array(boundNumber + 1).fill().slice().map(($, j) => {
            const isSnake = snakeCoordinates.includes(`${j}_${i}`);
            const isWall = wallCoordinates.has(`${j}_${i}`);
            const isApple = (appleCoordinate === `${j}_${i}`);
            const isRock = rockCoordinates.includes(`${j}_${i}`)
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
    return <div style={frame}>{board}</div>
}

export async function getServerSideProps(context) {
    const snake = randomInteger()
    return {}
}