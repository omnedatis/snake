import { Dialog } from '@mui/material'
import styles from '../styles/Home.module.css'

export default function GameOverDialog(props) {
    const dialogOn = props.OverDialogOn
    const setIsGameOver = props.setIsGameOver
    const setOverDialogOn = props.setOverDialogOn
    const handleClose = function () {
        setIsGameOver(true)
        setOverDialogOn(false)
        location.reload()
    }
    return <Dialog open={dialogOn} onClose={handleClose} >
        <div className={styles.row} style={{width:'50vw', height:'20vh'}}>
            <h1 >
                Game Over!!
            </h1>
        </div>
    </Dialog>

}