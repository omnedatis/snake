import GameBoard from "./GameBoard";

export default function EatAppleExample (){
    const pixelNumber = 4
    const appleCoordinate = '2_2'
    return <GameBoard pixelNumber={pixelNumber}
    snakeCoordinates={snakeCoordinates}
    appleCoordinate={appleCoordinate}
    wallCoordinates={wallCoordinates}
    blockCoordinates={blockCoordinates}/>
}
