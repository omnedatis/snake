import { Dialog, Divider } from "@mui/material"

export default function HelpDialog (props) {
    const helpDialogOn = props.helpDialogOn
    const setHelpDialogOn = props.setHelpDialogOn
    return <Dialog open={helpDialogOn} onClose={e=>setHelpDialogOn(false)} fullWidth>
        <div style={{display:'flex', flexDirection:'column', marginLeft:'30px', marginRight:'30px'}}>
            <h2 style={{margin:'15px', textAlign:'center'}}>How to play</h2>
            <p>Move your snake to eat apples and grow as long as possible. 
            </p>
            <p>Beware of the dangers!</p>
            <Divider/>
            <h4>Eat the apples</h4>
            <></>
            <h4>Don't hit the rock</h4>
            <></>
            <h4>Go through wall when in teleport mode</h4>
            <></>
        </div>
    </Dialog>
}