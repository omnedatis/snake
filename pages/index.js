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

export default function Home(props) {
  // props
  const pixelNumber = props.pixelNumber;
  const allowedDirections = new Map(Object.entries(JSON.parse(props.allowedDirections)));
  const { isGameOver, setIsGameOver } = props;
  const snakeStart = props.snakeStart;
  const appleStart = props.appleStart;

  // const and func
  const score = 0
  const handleKeyUp = function (e) {
    const newDirection = allowedDirections.get(e.key);
    if (newDirection) {
      setDirection(newDirection);
    }
  }
  const handleClick = e => setDirection(undefined);
  const router = useRouter();
  let { delay } = router.query;
  delay = delay || 200;

  //local states
  const [direction, setDirection] = useState(undefined);
  const [teleportOK, setTeleportOK] = useState(true);
  const [OverDialogOn, setOverDialogOn] = useState(false);
  const [helpDialogOn, setHelpDialogOn] = useState(true);

  //effects
  useEffect(e => {
    if (isGameOver ===true) setOverDialogOn(true)
  }, [isGameOver])
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
              snakeDirection={direction}
              isGameOver={isGameOver}
              setIsGameOver={setIsGameOver}
              snakeStart={snakeStart}
              appleStart={appleStart}
              teleportOK={teleportOK}
              delay={delay}
              startScore={score}
            />
          </div>
        </div>
        <div className={styles.col} style={{ alignSelf: 'start', alignItems: 'stretch' }}>
          <div className={styles.row} style={{ justifyContent: 'flex-end' }}>
            <FormatListBulletedIcon fontSize="large" style={{ margin: '15px' }} />
            <div style={{ margin: '15px', zIndex: 3 }} onClick={e => setHelpDialogOn(true)} >
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