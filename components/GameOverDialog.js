import { Dialog } from '@mui/material'
import styles from '../styles/Home.module.css'

export default function GameOverDialog(props) {
    const dialogOn = props.OverDialogOn;
    const setIsGameOver = props.setIsGameOver;
    const setOverDialogOn = props.setOverDialogOn;
    const handleClose = function () {
        setOverDialogOn(false);
        location.reload();
    }
    return <Dialog open={dialogOn} onClose={handleClose} className={styles.row}  maxWidth="sm"  fullWidth>
        <div className={styles.row} style={{width:'30vmin', height:'30vmin', flexGrow:2}}>
            <h1 >
                Game Over!!
            </h1>
        </div>
    </Dialog>

}