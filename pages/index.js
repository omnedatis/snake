import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import GameBoard from '../components/GameBoard'
import { useEffect, useState } from 'react'
import GameOverDialog from '../components/GameOverDialog'
import moment from 'moment'
import { useRouter } from 'next/router'

// definitions
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
  upperbound++;
  for (let i = 0; i <= upperbound; i++) {
    ret.add(`0_${i}`);
    ret.add(`${i}_0`);
    ret.add(`${upperbound}_${i}`);
    ret.add(`${i}_${upperbound}`);
  }
  return ret;
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
export default function Home(props) {
  // props
  const pixelNumber = props.pixelNumber;
  const { isGameOver, setIsGameOver } = props;

  //local states
  const [snakeCoordinates, setSnakeCoordinates] = useState([props.snakeStart]);
  const [appleCoordinate, setAppleCoordinate] = useState(props.appleStart);
  const [snakeDirection, setSnakeDirection] = useState(undefined);
  const [OverDialogOn, setOverDialogOn] = useState(false);
  const [score, setScore] = useState(-1);

  // const and func
  const allowedDirections = new Map();
  allowedDirections.set('ArrowDown','ArrowDown');
  allowedDirections.set('ArrowUp', 'ArrowUp');
  allowedDirections.set('ArrowLeft', 'ArrowLeft');
  allowedDirections.set('ArrowRight', 'ArrowRight');
  const wallCoordinates = getWallCordinates(pixelNumber);
  const router = useRouter()
  let { delay } = router.query
  delay = delay || 200
  const handleKeyUp = function (e) {
    const direction = allowedDirections.get(e.key);
    if (direction){
      const newCoordinate = snakeGo(snakeCoordinates[0], direction)
      if (newCoordinate===snakeCoordinates[1]) return
      setSnakeDirection(direction)
    }
  }
  //effects
  useEffect(() => {
    const t = setInterval(()=>{
      if (snakeDirection) {
        const newCoordinate = snakeGo(snakeCoordinates[0], snakeDirection)
        const newcoordinates = snakeCoordinates.slice();
        if (wallCoordinates.has(newCoordinate)) {
          setOverDialogOn(true)
          return
        } else if (snakeCoordinates.includes(newCoordinate)) {
          setOverDialogOn(true)
          return
        }
        if (newCoordinate === appleCoordinate) {
          setAppleCoordinate(getEmptyCoordinate(newcoordinates, pixelNumber))
          newcoordinates.unshift(newCoordinate);
          setSnakeCoordinates(newcoordinates);
        } else {
          newcoordinates.unshift(newCoordinate);
          newcoordinates.pop();
          setSnakeCoordinates(newcoordinates);
        }
      }
    }, delay)
    return () => clearInterval(t)
  })
  useEffect(e =>setScore(score+1), [appleCoordinate])

  
  return (
    <div style={{ display: 'flex', flexDirection: "column", justifyContent: "center", height: '100vh' }}
      tabIndex={0}
      onKeyDown={handleKeyUp}
      onClick={e=>setSnakeDirection(undefined)}>
      <GameOverDialog OverDialogOn={OverDialogOn} setIsGameOver={setIsGameOver} setOverDialogOn={setOverDialogOn} />
      <div className={styles.row}>
        <div className={styles.row}>

        </div>
        <h1 className={[styles.mid, styles.col].join(" ")} style={{ textAlign: "center" }}>
          <div>&nbsp;</div>
          <span>Welcome to snake</span>
          <span>Your Score: {score}</span>
        </h1>
        <div className={styles.row} >

        </div>
      </div>
      <div className={styles.row} style={{ flexGrow: 3 }}>
        <div className={styles.row}>

        </div>
        <div className={[styles.mid, styles.col].join(" ")} style={{ alignItems: 'stretch', flexGrow:1.5 }}>
          <GameBoard pixelNumber={pixelNumber}
            snakeCoordinates={snakeCoordinates}
            appleCoordinate={appleCoordinate}
            wallCoordinates={wallCoordinates} />
        </div>
        <div className={styles.row}>

        </div>
      </div>

      <div className={styles.row}>
        <h1>&nbsp;</h1>

      </div>
    </div>

  )

}

export async function getStaticProps() {
  const pixelNumber = 20;
  const snakeStart = `${randomInteger(1, pixelNumber)}_${randomInteger(1, pixelNumber)}`
  const appleStart = getEmptyCoordinate([snakeStart], pixelNumber)

  return { props: { 
    snakeStart: snakeStart, 
    pixelNumber: pixelNumber, 
    appleStart: appleStart,
  } }
}