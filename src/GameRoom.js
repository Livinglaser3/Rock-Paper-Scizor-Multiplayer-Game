// src/GameRoom.js

import React, { useEffect, useState } from 'react';
import RockPaperScissors from './RockPaperScissors';
import Leaderboard from './Leaderboard';

const API_URL = 'http://localhost:4000';

function GameRoom({ user }) {
  const [isPlayer, setIsPlayer] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const joinGame = async () => {
      const res = await fetch(`${API_URL}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username }),
      });

      const data = await res.json();

      if (data.status === 'joined') {
        setIsPlayer(true);
        setStatus('You are in the game');
      } else {
        setIsPlayer(false);
        setStatus('Game is full. Please wait...');
      }
    };

    joinGame();

    return () => {
      // On unmount or logout, remove player (handled by backend after result)
    };
  }, [user.username]);

  return (
    <div>
      <h2>{status}</h2>
      {isPlayer ? <RockPaperScissors user={user} /> : <Leaderboard />}
    </div>
  );
}

export default GameRoom;
