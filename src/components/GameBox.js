import React, { memo } from 'react';



const GameBox = memo(({ symbol, boxId, hasWon = false }) => {
  const boxStyle = {
    backgroundColor: hasWon ? 'purple' : 'white',
    color: hasWon ? 'white' : 'purple',
    cursor: hasWon ? 'default' : 'pointer',
    fontSize: '16px',
    padding: '10px',
    border: '3px solid purple',
    borderRadius: '8px',
    textAlign: 'center',
    transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
  };
  return (
    <div
      id={boxId}
      style={boxStyle}
      className="tic-tac-toe-box"
    >
      {symbol ?? ''}
    </div>
  );
});

export default GameBox;
