import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';
import { apiUrl } from '../lib/api';
import { clearAuthSession, getAuthToken, getStoredUser } from '../lib/auth';
const CATEGORIES = ['Feature', 'Fix', 'Partner', 'Announcement'];
const EMOJIS = ['🚀', '🛡️', '🤝', '📢', '📈', '🎓', '🔧', '⭐'];

export default function AdminPanel() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const token = getAuthToken();

  const [stats, setStats] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [form, setForm] = useState({ title: '', body: '', category: 'Feature', emoji: '🚀' });
  const [posting, setPosting] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState('stats');

  // Auth guard
  useEffect(() => {
    if (!user || !user.isAdmin) navigate('/login');
  }, []);

  useEffect(() => {
    fetchStats();
    fetchUpdates();
  }, []);

  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  async function fetchStats() {
    try {
      const res = await fetch(apiUrl('/api/admin/stats'), { headers: authHeaders });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 401 || res.status === 403) {
          clearAuthSession();
          navigate('/login');
          return;
        }
        throw new Error(err.message || 'Unable to load admin stats');
      }

      setStats(await res.json());
    } catch (error) {
      setStats(null);
      setMsg(`❌ ${error.message || 'Unable to load admin stats.'}`);
    }
  }

  async function fetchUpdates() {
    try {
      const res = await fetch(apiUrl('/api/updates'));
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Unable to load updates');
      }

      setUpdates(await res.json());
    } catch (error) {
      setUpdates([]);
      setMsg(`❌ ${error.message || 'Unable to load updates.'}`);
    }
  }

  async function handlePost(e) {
    e.preventDefault();
    setPosting(true);
    setMsg('');
    try {
      const res = await fetch(apiUrl('/api/updates'), {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMsg('✅ Update posted successfully!');
        setForm({ title: '', body: '', category: 'Feature', emoji: '🚀' });
        fetchUpdates();
        fetchStats();
      } else {
        const err = await res.json().catch(() => ({}));
        setMsg(`❌ ${err.message || 'Unable to post update.'}`);
      }
    } catch (error) {
      setMsg(`❌ ${error.message || 'Network error. Is the server running?'}`);
    }
    setPosting(false);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this update?')) return;
    try {
      const res = await fetch(apiUrl(`/api/updates/${id}`), { method: 'DELETE', headers: authHeaders });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to delete update');
      }

      setMsg('🗑️ Deleted.');
      fetchUpdates();
      fetchStats();
    } catch (error) {
      setMsg(`❌ ${error.message || 'Failed to delete.'}`);
    }
  }

  if (!user?.isAdmin) return null;

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span>⚙️</span>
          <h2>Admin Panel</h2>
        </div>
        <p className="admin-greeting">Welcome, {user.name}</p>
        <nav>
          {['stats', 'post', 'manage'].map(tab => (
            <button
              key={tab}
              className={`sidebar-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'stats' && '📊 Dashboard'}
              {tab === 'post' && '✏️ Post Update'}
              {tab === 'manage' && '🗂️ Manage Updates'}
            </button>
          ))}
        </nav>
        <button className="sidebar-logout" onClick={() => navigate('/')}>← Back to Site</button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {msg && (
          <div className={`admin-msg ${msg.startsWith('✅') || msg.startsWith('🗑') ? 'success' : 'error'}`}>
            {msg}
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <section>
            <h1 className="admin-title">📊 Dashboard Overview</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-num">{stats?.totalUsers ?? '—'}</div>
                <div className="stat-lbl">Total Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎓</div>
                <div className="stat-num">{stats?.completions ?? '—'}</div>
                <div className="stat-lbl">Hub Completions</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📢</div>
                <div className="stat-num">{stats?.totalUpdates ?? '—'}</div>
                <div className="stat-lbl">Posted Updates</div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="qa-grid">
                <button className="qa-btn" onClick={() => setActiveTab('post')}>✏️ Post New Update</button>
                <button className="qa-btn" onClick={() => setActiveTab('manage')}>🗂️ Manage Updates</button>
                <button className="qa-btn" onClick={() => navigate('/updates')}>👁️ View Public Updates Page</button>
              </div>
            </div>
          </section>
        )}

        {/* POST UPDATE TAB */}
        {activeTab === 'post' && (
          <section>
            <h1 className="admin-title">✏️ Post New Update</h1>
            <form className="update-form" onSubmit={handlePost}>
              <div className="form-row">
                <div className="form-group">
                  <label>Emoji Icon</label>
                  <div className="emoji-picker">
                    {EMOJIS.map(e => (
                      <button type="button" key={e}
                        className={`emoji-opt ${form.emoji === e ? 'selected' : ''}`}
                        onClick={() => setForm({ ...form, emoji: e })}
                      >{e}</button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <div className="cat-picker">
                    {CATEGORIES.map(c => (
                      <button type="button" key={c}
                        className={`cat-opt ${form.category === c ? 'selected' : ''}`}
                        onClick={() => setForm({ ...form, category: c })}
                      >{c}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="admin-title-input">Title *</label>
                <input
                  id="admin-title-input"
                  type="text"
                  placeholder="e.g. New AI Tutor Feature Launched!"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="admin-body-input">Description *</label>
                <textarea
                  id="admin-body-input"
                  rows={5}
                  placeholder="Describe the update in detail..."
                  value={form.body}
                  onChange={e => setForm({ ...form, body: e.target.value })}
                  required
                />
              </div>

              <div className="preview-box">
                <p className="preview-label">Preview:</p>
                <div className="update-card-preview">
                  <span className="uc-emoji">{form.emoji}</span>
                  <div>
                    <span className={`uc-badge badge-${form.category.toLowerCase()}`}>{form.category}</span>
                    <h4>{form.title || 'Your Update Title'}</h4>
                    <p>{form.body || 'Your update description will appear here.'}</p>
                  </div>
                </div>
              </div>

              <button type="submit" className="post-btn" disabled={posting}>
                {posting ? 'Posting...' : '🚀 Post Update'}
              </button>
            </form>
          </section>
        )}

        {/* MANAGE TAB */}
        {activeTab === 'manage' && (
          <section>
            <h1 className="admin-title">🗂️ Manage Updates ({updates.length})</h1>
            {updates.length === 0 ? (
              <div className="empty-state">No updates posted yet. <button className="link-btn" onClick={() => setActiveTab('post')}>Post the first one →</button></div>
            ) : (
              <div className="manage-list">
                {updates.map(u => (
                  <div key={u._id} className="manage-item">
                    <span className="mi-emoji">{u.emoji}</span>
                    <div className="mi-content">
                      <div className="mi-top">
                        <span className={`uc-badge badge-${u.category?.toLowerCase()}`}>{u.category}</span>
                        <span className="mi-date">{new Date(u.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      <h4>{u.title}</h4>
                      <p>{u.body}</p>
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(u._id)}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
