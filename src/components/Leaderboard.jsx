import React, { useState, useEffect } from 'react';
import './Leaderboard.css';
import { apiUrl } from '../lib/api';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(apiUrl('/api/leaderboard'));
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.message || 'Unable to load leaderboard');
        }

        setLeaders(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setLeaders([]);
        setError(loadError.message || 'Unable to load leaderboard');
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  return (
    <div className="leaderboard-wrapper">
      <div className="leaderboard-header">
        <span className="lb-badge">Global Rankings</span>
        <h1>🔥 Top Financial Champions</h1>
        <p>The smartest investors and learners on FinPlay Bharat.</p>
      </div>

      <div className="lb-container">
        {loading ? (
          <div className="lb-loading">Loading champions...</div>
        ) : error ? (
          <div className="lb-empty">{error}</div>
        ) : (
          <div className="lb-list">
            <div className="lb-item header">
              <span className="lb-rank">Rank</span>
              <span className="lb-name">Name</span>
              <span className="lb-streak">Streak</span>
              <span className="lb-score">Total Score</span>
            </div>
            {leaders.map((u, i) => (
              <div key={u._id} className={`lb-item ${i === 0 ? 'rank-1' : ''} ${i === 1 ? 'rank-2' : ''} ${i === 2 ? 'rank-3' : ''}`}>
                <span className="lb-rank">
                  {i === 0 && '🥇'}
                  {i === 1 && '🥈'}
                  {i === 2 && '🥉'}
                  {i > 2 && `#${i + 1}`}
                </span>
                <span className="lb-name">{u.name}</span>
                <span className="lb-streak">🔥 {u.streak || 1} day</span>
                <span className="lb-score">{u.totalScore?.toLocaleString() || 0} pts</span>
              </div>
            ))}
            {leaders.length === 0 && <div className="lb-empty">No champions yet. Be the first!</div>}
          </div>
        )}
      </div>
    </div>
  );
}
