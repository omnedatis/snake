import styles from '../styles/Home.module.css'
export default function GameBoard(props) {
    const _pixelNumber = props.pixelNumber+2;
    const snakeCoordinates = props.snakeCoordinates;
    const wallCoordinates = props.wallCoordinates
    const appleCoordinate = props.appleCoordinate
    const blockCoordinates = props.blockCoordinates
    return Array(_pixelNumber).fill().slice().map(($, i) => {
        const rowItems = Array(_pixelNumber).fill().slice().map(($, j) =>{
            const isSnake = snakeCoordinates.includes(`${j}_${i}`);
            const isWall = wallCoordinates.has(`${j}_${i}`);
            const isApple = (appleCoordinate=== `${j}_${i}`);
            const isRock = blockCoordinates.includes(`${j}_${i}`)
            const name = [styles.grid];
            if (snakeCoordinates[0] === `${j}_${i}`)
                return <div key ={`item_${j}_${i}`} className={[styles.grid, styles.head].join(" ")} >
                    &nbsp;
                    </div>
            if (isSnake){
                name.push(styles.snake);
            } else if (isWall){
                name.push(styles.wall);
            } else if (isApple) {
                name.push(styles.apple);
            } else if (isRock){
                name.push(styles.rock);
            }
            return <div key ={`item_${j}_${i}`} className={name.join(" ")} style={{flexGrow:1}}>&nbsp;</div>
        })
        
        return <div key={`row_${i}`} className={styles.row}>{rowItems}</div>
    })
}