import styles from '../styles/Home.module.css';
import GameBoard from '../components/GameBoard';
import { useEffect, useState } from 'react';
import GameOverDialog from '../components/GameOverDialog';
import { useRouter } from 'next/router';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import HelpDialog from '../components/HelpDialog';

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
const snakeTeleport = function (coordinate, direction, modNumber) {
  let ret = coordinate.split("_");
  switch (direction) {
    case 'ArrowDown':
      ret[1] = 1;
      break;
    case 'ArrowUp':
      ret[1] = ret[1] - 3 + modNumber;
      break;
    case 'ArrowLeft':
      ret[0] = ret[0] - 3 + modNumber;
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

export default function Home(props) {
  // props
  const pixelNumber = props.pixelNumber;
  const allowedDirections = new Map(Object.entries(JSON.parse(props.allowedDirections)));
  const { isGameOver, setIsGameOver } = props;

  // const and func

  const wallCoordinates = getWallCordinates(pixelNumber);
  const handleKeyUp = function (e) {
    const direction = allowedDirections.get(e.key);
    if (direction) {
      const newCoordinate = snakeGo(snakeCoordinates[0], direction);
      if (newCoordinate === snakeCoordinates[1]) return;
      setSnakeDirection(direction);
    }
  }
  const handleClick = e => {
    setSnakeDirection(undefined);
  };
  const router = useRouter();
  let { delay, teleport } = router.query;
  teleport = teleport ? true : false;
  delay = delay || 200;

  //local states
  const [snakeCoordinates, setSnakeCoordinates] = useState([props.snakeStart]);
  const [appleCoordinate, setAppleCoordinate] = useState(props.appleStart);
  const [snakeDirection, setSnakeDirection] = useState(undefined);
  const [score, setScore] = useState(-1);
  const [teleportOK, setTeleportOK] = useState(teleport);
  const [blockCoordinates, setBlockCoordinates] = useState([]);
  const [count, setCount] = useState(0);
  const [OverDialogOn, setOverDialogOn] = useState(false);
  const [helpDialogOn, setHelpDialogOn] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {

      if (snakeDirection && (!isGameOver)) {
        let newCoordinate = snakeGo(snakeCoordinates[0], snakeDirection);
        const newcoordinates = snakeCoordinates.slice();
        if (wallCoordinates.has(newCoordinate)) {
          if (!teleportOK) {
            setOverDialogOn(true);
            setIsGameOver(true);
            return
          } else {
            newCoordinate = snakeTeleport(snakeCoordinates[0], snakeDirection, pixelNumber + 2);
          }

        } else if (snakeCoordinates.includes(newCoordinate)) {
          setOverDialogOn(true);
          setIsGameOver(true);
          return
        } else if (blockCoordinates.includes(newCoordinate)) {
          setOverDialogOn(true);
          setIsGameOver(true);
          return
        }
        if (newCoordinate === appleCoordinate) {
          newcoordinates.unshift(newCoordinate);
          setSnakeCoordinates(newcoordinates);
          setAppleCoordinate(getEmptyCoordinate(newcoordinates.concat(blockCoordinates), pixelNumber));
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
          const block = getEmptyCoordinate(newcoordinates.concat([appleCoordinate, front1, front2], blockCoordinates), pixelNumber)
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
  return (
    <div style={{ display: 'flex', flexDirection: "column", justifyContent: "center", height: '100vh' }}
      tabIndex={0}
      onKeyDown={handleKeyUp}
      onClick={handleClick}>
      <HelpDialog helpDialogOn={helpDialogOn} setHelpDialogOn={setHelpDialogOn} />
      <GameOverDialog OverDialogOn={OverDialogOn} setIsGameOver={setIsGameOver} setOverDialogOn={setOverDialogOn} />
      <div style={{ position: 'relative' }}>
        <div className={[styles.mid, styles.col].join(" ")} style={{ textAlign: "center", position: 'absolute', left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto', alignItems: 'stretch' }}>
          <h1>Welcome to snake</h1>
          <h2 style={{ marginTop: 0 }}>Your Score: {score}</h2>
          <div className={[styles.mid, styles.col].join(" ")} style={{ alignItems: 'center', flexGrow: 1.5 }}>
            <GameBoard pixelNumber={pixelNumber}
              snakeCoordinates={snakeCoordinates}
              appleCoordinate={appleCoordinate}
              wallCoordinates={wallCoordinates}
              blockCoordinates={blockCoordinates} />
          </div>
        </div>
        <div className={styles.col} style={{ alignSelf: 'start', alignItems: 'stretch' }}>
          <div className={styles.row} style={{ justifyContent: 'flex-end' }}>
            <FormatListBulletedIcon fontSize="large" style={{ margin: '15px' }} />
            <div style={{ margin: '15px', zIndex:3}} onClick={e => setHelpDialogOn(true)} >
              <QuestionMarkIcon fontSize="large" />
            </div>

          </div>
        </div>
      </div>
      <div className={styles.row} onClick={e=> console.log('frank')}>
        <h1>&nbsp;</h1>
      </div>
    </div>

  )
}

export async function getServerSideProps() {
  const pixelNumber = 20;
  const snakeStart = `${randomInteger(1, pixelNumber)}_${randomInteger(1, pixelNumber)}`;
  const appleStart = getEmptyCoordinate([snakeStart], pixelNumber);
  const allowedDirections = new Map([
    ['ArrowDown', 'ArrowDown'],
    ['ArrowUp', 'ArrowUp'],
    ['ArrowLeft', 'ArrowLeft'],
    ['ArrowRight', 'ArrowRight']
  ]);
  return {
    props: {
      snakeStart: snakeStart,
      pixelNumber: pixelNumber,
      appleStart: appleStart,
      allowedDirections: JSON.stringify(Object.fromEntries(allowedDirections))
    }
  }
}