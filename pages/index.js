import styles from '../styles/Home.module.css';
import GameBoard from '../components/GameBoard';
import { useEffect, useState } from 'react';
import GameOverDialog from '../components/GameOverDialog';
import { useRouter } from 'next/router';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import HelpDialog from '../components/HelpDialog';
import GameMeter from '../components/GameMeter';

// definitions
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

export default function Home(props) {
  // props or query
  const pixelNumber = props.pixelNumber;
  const allowedDirections = new Map(Object.entries(JSON.parse(props.allowedDirections)));
  const { isGameOver, setIsGameOver } = props;
  const snakeStart = props.snakeStart;
  const appleStart = props.appleStart;
  const router = useRouter();
  let { timedelay } = router.query;
  timedelay = timedelay || 200;


  //states
  const [score, setScore] = useState(-1);
  const [direction, setDirection] = useState(undefined);
  const [teleportOK, setTeleportOK] = useState(true);
  const [OverDialogOn, setOverDialogOn] = useState(false);
  const [helpDialogOn, setHelpDialogOn] = useState(true);
  const [isTranslated, setIsTranslate] = useState(false);
  const [meterName, setMeterName] = useState([styles.togglemeter]);
  const [rockNumber, setRockNumber] = useState(3);
  const [boardSize, setBoardSize] = useState(pixelNumber);
  const [delay, setDelay] = useState(timedelay);
  
  // const and func
  const handleKeyUp = function (e) {
    const newDirection = allowedDirections.get(e.key);
    if (newDirection) {
      setDirection(newDirection);
    }
  }
  const handleClick = e => setDirection(undefined);
  const helpHandleClick = e => setHelpDialogOn(true)
  const meterHandleClick = e => {
    setIsTranslate(!isTranslated)
  }
  const gameSettings = {teleportOK, setTeleportOK, rockNumber, setRockNumber, boardSize, setBoardSize, delay, setDelay}

  //effects
  useEffect(e => {
    if (isGameOver === true) setOverDialogOn(true)
  }, [isGameOver])
  useEffect(e => {
    if (isTranslated) {
      setMeterName([styles.togglemeter, styles.translated])
    } else {
      setMeterName([styles.togglemeter])
    }

  }, [isTranslated])
  return (
    <div style={{ display: 'flex', flexDirection: "column", justifyContent: "center", height: '100vh' }}
      tabIndex={0}
      onKeyDown={handleKeyUp}
      onClick={handleClick}>
      <HelpDialog helpDialogOn={helpDialogOn} setHelpDialogOn={setHelpDialogOn} />
      <GameOverDialog OverDialogOn={OverDialogOn} setIsGameOver={setIsGameOver} setOverDialogOn={setOverDialogOn} />
      <div style={{ position: 'relative' }}>
        <GameMeter name={meterName.join(" ")} gameSettings={gameSettings}/>
        <div className={[styles.mid, styles.col].join(" ")} style={{ textAlign: "center", position: 'absolute', left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto', alignItems: 'stretch' }}>
          <h1>Welcome to snake</h1>
          <h2 style={{ marginTop: 0 }}>Your Score: {score}</h2>
          <div className={[styles.mid, styles.col].join(" ")} style={{ alignItems: 'center', flexGrow: 1.5 }}>
            <GameBoard boardSize={boardSize}
              snakeDirection={direction}
              isGameOver={isGameOver}
              setIsGameOver={setIsGameOver}
              snakeStart={snakeStart}
              appleStart={appleStart}
              teleportOK={teleportOK}
              delay={delay}
              setScore={setScore}
              score={score}
              rockNumber={rockNumber}
            />
          </div>
        </div>
        <div className={styles.col} style={{ alignSelf: 'start', alignItems: 'stretch' }}>
          <div className={styles.row} style={{ justifyContent: 'flex-end' }}>
            <div style={{ margin: '15px', zIndex: 3 }} onClick={meterHandleClick} >
              <FormatListBulletedIcon fontSize="large" />
            </div>
            <div style={{ margin: '15px', zIndex: 3 }} onClick={helpHandleClick} >
              <QuestionMarkIcon fontSize="large" />
            </div>

          </div>
        </div>
      </div>
      <div className={styles.row}>
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
      appleStart: appleStart,
      pixelNumber: pixelNumber,
      allowedDirections: JSON.stringify(Object.fromEntries(allowedDirections))
    }
  }
}