import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import GameBoard from '../components/GameBoard'
import { useState } from 'react'
import GameOverDialog from '../components/GameOverDialog'

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getEmptyCoordinate (occupied, pixelNumber) {
  let newPos = `${randomInteger(1, pixelNumber)}_${randomInteger(1, pixelNumber)}`
  while (occupied.includes(newPos)) {
    newPos = `${randomInteger(1, pixelNumber)}_${randomInteger(1, pixelNumber)}`
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
      break;
  }
  return ret.join('_');
}
export default function Home(props) {
  const pixelNumber = props.pixelNumber;
  const [snakeCoordinates, setSnakeCoordinate] = useState([props.snakeStart]);
  
  const [appleCoordinate, setAppleCoordinate] = useState(props.appleStart);
  const [OverDialogOn, setOverDialogOn] = useState(false);
  const {isGameOver, setIsGameOver} = props
  

  const wallCoordinates = getWallCordinates(pixelNumber);

  const handleKeyUp = function (e) {
    const value = e.key;
    const newCoordinate = snakeGo(snakeCoordinates[0], value);
    const newcoordinates = snakeCoordinates.slice();
    if (wallCoordinates.has(newCoordinate)){
      setOverDialogOn(true)
      return
    } else if (snakeCoordinates.includes(newCoordinate)){
      setOverDialogOn(true)
      return
    }
    if (newCoordinate === appleCoordinate){
      setAppleCoordinate(getEmptyCoordinate(newcoordinates, pixelNumber))
      newcoordinates.unshift(newCoordinate);
      setSnakeCoordinate(newcoordinates);
    } else {
      newcoordinates.unshift(newCoordinate);
      newcoordinates.pop();
      setSnakeCoordinate(newcoordinates);
    }

    }
  return (
    <div style={{ display: 'flex', flexDirection: "column", justifyContent: "center", height: '100vh' }}
      tabIndex={0}
      onKeyDown={handleKeyUp}>
      <GameOverDialog OverDialogOn={OverDialogOn} setIsGameOver={setIsGameOver} setOverDialogOn={setOverDialogOn}/>
      <div className={styles.row}>
        <div className={styles.row}>

        </div>
        <h1 className={[styles.mid, styles.row].join(" ")} style={{ textAlign: "center" }}>
          <span>Welcome to snake</span>
        </h1>
        <div className={styles.row} >

        </div>
      </div>
      <div className={styles.row} style={{ flexGrow: 3 }}>
        <div className={styles.row}>

        </div>
        <div className={[styles.mid, styles.col].join(" ")} style={{ alignItems: 'stretch' }}>
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
  let appleStart = getEmptyCoordinate([snakeStart], pixelNumber)
  return { props: { snakeStart: snakeStart, pixelNumber: pixelNumber, appleStart:appleStart} }
}