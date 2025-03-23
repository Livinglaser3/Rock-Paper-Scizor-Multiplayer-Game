// src/RockPaperScissors.js

import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000';

function RockPaperScissors({ user }) {
  const [choice, setChoice] = useState('');
  const [result, setResult] = useState('');
  const [winner, setWinner] = useState('');

  const moves = ['Rock', 'Paper', 'Scissors'];

  const sendMove = async (move) => {
    await fetch(`${API_URL}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, move }),
    });

    setChoice(move);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`${API_URL}/result`);
      const data = await res.json();

      if (data.result) {
        setResult(data.result);
        setWinner(data.winner || 'Draw');
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>Your move: {choice || 'None'}</h3>

      {!choice && moves.map((m) => (
        <button key={m} onClick={() => sendMove(m)} style={{ margin: '10px' }}>
          {m}
        </button>
      ))}

      {result && (
        <>
          <h2>Result: You {result}!</h2>
          <h3>Winner: {winner}</h3>
        </>
      )}
    </div>
  );
}

export default RockPaperScissors;
