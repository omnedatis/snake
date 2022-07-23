import { Dialog } from "@mui/material"

export default function HelpDialog (props) {
    const helpDialogOn = props.helpDialogOn
    const setHelpDialogOn = props.setHelpDialogOn
    return <Dialog open={helpDialogOn} onClose={e=>setHelpDialogOn(false)} fullWidth>
        <div>rule1</div>
    </Dialog>
}