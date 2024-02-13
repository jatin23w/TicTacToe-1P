import { useCallback, useEffect, useState } from 'react';

import SelectSymbol from './SelectSymbol';
import GameBox from './GameBox';
import axios from 'axios';


/* Get Response From the api */

const getResComputer = async (gridboxstate) => {
  let res;
  const url = 'https://hiring-react-assignment.vercel.app/api/bot';
  
  try {
    const response = await axios.post(url, gridboxstate);
    res = {
      boxId: response.data,
      error: null,
    };
  } catch (error) {
    console.error(error);
    res = {
      boxId: -1,
      error: 'Failed to gain the Response',
    };
  }
  return res;
};

/* Check Winner matched row || column || diagonal */

const handlecheckwinner = (gridboxstate,setWinnerIndex)=>{
  const PossiblewinCombo = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

/* Checking the grid for winner */

  for (const comb of PossiblewinCombo) {
    const [a, b, c] = comb;
    if(gridboxstate[a]===gridboxstate[b] && gridboxstate[b]===gridboxstate[c] && gridboxstate[a]) {
      setWinnerIndex(comb)
      return gridboxstate[a];
    }
  }
  return null;
}

/* All squares filled */
const handleGameOver = (gridboxstate) => gridboxstate.every((state) => state !== null);
/*All square are empty*/
const handleGameStart = (gridboxstate) => gridboxstate.every((state) => state === null);

function GameLogic() {
  const [userSymbol,setUserSymbol] = useState("X")
  const [gridboxstate,setGridState] = useState(new Array(9).fill(null))
  const [gameOverState,setGameEndState] = useState({
    isGameOver: false,
    winner: null,
  })
  const [isPlayerTurn,setIsPlayerTurn] = useState(true)
  const [winningInd,setWinnerIndex] = useState([null,null,null])

  console.log(isPlayerTurn)
  console.log(gridboxstate)
  const onGridClick = (e)=>{
    const clickedBoxInd = Number(e.target.id)
    if(isPlayerTurn && gridboxstate[clickedBoxInd]===null){
      setIsPlayerTurn(false)
      setGridState(gridboxstate.map((state,ind)=>ind===clickedBoxInd ? userSymbol : state))
    }
  }
  
  const computermove = useCallback(async ()=>{
    const computerResponse = await getResComputer(gridboxstate)
    if(!computerResponse.error && !gridboxstate[computerResponse.boxId]){
      setIsPlayerTurn(true)
      setGridState(gridboxstate.map((state,ind)=>ind===computerResponse.boxId ? (userSymbol==="X" ? "O": "X") : state))
    }
  },[userSymbol,gridboxstate])

  useEffect(()=>{
    const isGameOver = handleGameOver(gridboxstate)
    const winner = handlecheckwinner(gridboxstate,setWinnerIndex)
    if(winner){
      winner===userSymbol
      ? setGameEndState({
        isGameOver: true,
        winner: "player"
      })
      : setGameEndState({
        isGameOver: true,
        winner: "computer"
      })
    }
    else if(isGameOver){
      setGameEndState({
        isGameOver: true,
        winner: null
      })
    }
    else{
      !isPlayerTurn &&
      computermove()
    }
  },[gridboxstate,userSymbol,isPlayerTurn,computermove])

  const playagainstate = ()=>{
    setUserSymbol("X")
    setGridState(new Array(9).fill(null))
    setGameEndState({
      isGameOver: false,
      winner: null,
    })
    setIsPlayerTurn(true)
    setWinnerIndex(new Array(3).fill(null))
  }

  return (
    <div className='flex flex-col items-center h-[80vh] min-h-[500px] justify-center'>
    <h1 className='mb-4 text-center text-4xl font-bold text-purple-600'>Tic Tac Toe Game</h1>
      <SelectSymbol selectedSymbol={userSymbol} setSymbol={setUserSymbol} isGameStart={handleGameStart(gridboxstate)} />
      <div className='mt-8 mb-4 font-semibold'>{gameOverState.isGameOver ? "Game Over!!" : isPlayerTurn ? "Your Move" : "Computer's Move"}</div>
      <div onClick={onGridClick} className='grid grid-cols-3 grid-rows-3 gap-3 w-56 h-40'>
        {
          gridboxstate.map((state,ind)=>
          <GameBox 
            key={ind} 
            boxId={ind} 
            symbol={state} 
            hasWon = {state && winningInd.includes(ind)}
          />)
        }
      </div>
      <div className='mt-8 flex flex-col items-center'>
        {gameOverState.winner==="player" && <div>Woah! You Won the Game 🥳</div>}
        {gameOverState.winner==="computer" && <div>Sorry, You Lost ! </div>}
        {!gameOverState.winner && gameOverState.isGameOver && <div> Game Draw </div>}
        {gameOverState.isGameOver && 
        <button onClick={playagainstate} className="text-black mt-3 border border-purple hover:bg-purple hover:text-black font-bold px-8 py-2 rounded outline-none focus:outline-none" type="button">
          Play Again
        </button>
        }
      </div>
      
    </div>
  );
}

export default GameLogic;
