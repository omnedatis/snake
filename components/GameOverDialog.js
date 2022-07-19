import { Dialog } from '@mui/material'

export default function GameOverDialog(props) {
    const dialogOn = props.OverDialogOn
    const setIsGameOver = props.setIsGameOver
    const setOverDialogOn = props.setOverDialogOn
    const handleClose = function (){
        setIsGameOver(true)
        setOverDialogOn(false)
        location.reload()
    }
    return <Dialog open={dialogOn} onClose={handleClose}>
        <div>
            Game Over
        </div>
    </Dialog>

}