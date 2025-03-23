// src/Leaderboard.js

import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000';

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      const res = await fetch(`${API_URL}/leaderboard`);
      const data = await res.json();
      setLeaders(data);
    };

    fetchLeaders();
  }, []);

  return (
    <div>
      <h3>Leaderboard</h3>
      <ul>
        {leaders.map((entry, idx) => (
          <li key={idx}>
            {entry.username} — {entry.wins} win(s)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;
