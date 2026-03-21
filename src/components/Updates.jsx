import React, { useState, useEffect } from 'react';
import './Updates.css';
import { apiUrl } from '../lib/api';

const CATEGORY_COLORS = {
  Feature:      'badge-feature',
  Fix:          'badge-fix',
  Partner:      'badge-partner',
  Announcement: 'badge-announcement',
};

export default function Updates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadUpdates() {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(apiUrl('/api/updates'));
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load updates');
        }

        setUpdates(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setUpdates([]);
        setError(loadError.message || 'Unable to load updates');
      } finally {
        setLoading(false);
      }
    }

    loadUpdates();
  }, []);

  const categories = ['All', ...new Set(updates.map(u => u.category).filter(Boolean))];
  const filtered = filter === 'All' ? updates : updates.filter(u => u.category === filter);

  return (
    <div className="updates-wrapper">
      {/* Hero */}
      <div className="updates-hero">
        <div className="updates-hero-inner">
          <span className="updates-hero-badge">What's New</span>
          <h1>FinPlay Bharat Updates</h1>
          <p>Stay up to date with new features, partnerships, and improvements.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="updates-container">
        <div className="filter-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-tab ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="updates-loading">
            <div className="updates-spinner"></div>
            <p>Loading updates...</p>
          </div>
        ) : error ? (
          <div className="updates-empty">
            <span>⚠️</span>
            <h3>Could not load updates</h3>
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="updates-empty">
            <span>📭</span>
            <h3>No updates yet</h3>
            <p>Check back soon — exciting things are coming!</p>
          </div>
        ) : (
          <div className="updates-timeline">
            {filtered.map((u, idx) => (
              <div key={u._id} className="update-item" style={{ animationDelay: `${idx * 0.08}s` }}>
                <div className="update-dot">
                  <span>{u.emoji || '🚀'}</span>
                </div>
                <div className="update-card">
                  <div className="update-card-top">
                    <span className={`update-badge ${CATEGORY_COLORS[u.category] || 'badge-feature'}`}>
                      {u.category || 'Feature'}
                    </span>
                    <span className="update-date">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="update-title">{u.title}</h3>
                  <p className="update-body">{u.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
