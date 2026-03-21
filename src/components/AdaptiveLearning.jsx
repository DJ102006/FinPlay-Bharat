import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdaptiveLearning.css";
import { aiApiUrl } from "../lib/api";
import { getStoredUser } from "../lib/auth";

export default function AdaptiveLearning() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState("");
  const user = getStoredUser();

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setError("Please log in to view your adaptive AI learning profile.");
      return;
    }

    fetchAIProfile();
  }, [user?.id]);

  const fetchAIProfile = async () => {
    try {
      setError("");
      const resp = await fetch(aiApiUrl(`/api/analyze/${user.id}`));
      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        throw new Error(data.error || "AI server is unavailable right now.");
      }

      setInsights(data);
    } catch (err) {
      setInsights(null);
      setError(err.message || "Unable to load adaptive profile right now.");
    } finally {
      setLoading(false);
    }
  };

  const getSafeRecommendations = () => {
    const recommendations = insights?.analysis?.recommendations;
    return Array.isArray(recommendations) && recommendations.length > 0
      ? recommendations
      : ["Complete another learning hub so the adaptive engine has richer behavior data."];
  };

  const getRecommendedPath = () => insights?.recommendedPath || "/hub/growth";

  if (loading) {
    return (
      <div className="adaptive-wrapper loading-state">
        <div className="loader"></div>
        <h2>Proactive AI is analyzing your behavioral fingerprint...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="adaptive-wrapper">
        <div className="adaptive-header">
          <h1>🧠 AI Financial Profile</h1>
          <p>Proactive Adaptive Learning Engine</p>
        </div>

        <div className="adaptive-content">
          <div className="ai-report-card">
            <div className="report-badge">status</div>
            <h2>Adaptive Profile Unavailable</h2>
            <p className="main-insight">{error}</p>

            <div className="next-steps">
              <h3>What to do next</h3>
              <p>Complete a learning hub quiz, make sure the AI engine server is running, and open this page again.</p>
              <button
                onClick={() => navigate(user?.id ? "/hub/security" : "/login")}
                className="primary-btn pulse"
              >
                {user?.id ? "Start Learning Path" : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="adaptive-wrapper">
      <div className="adaptive-header">
        <h1>🧠 AI Financial Profile</h1>
        <p>Proactive Adaptive Learning Engine</p>
      </div>

      <div className="adaptive-content">
        <div className="ai-report-card">
          <div className="report-badge">{insights.analysis.category}</div>
          <h2>{insights.analysis.title}</h2>
          <p className="main-insight">{insights.analysis.mainInsight}</p>
          
          <div className="rules-triggered">
             <h3>Patterns Detected</h3>
             <div className="tags">
                {(insights.triggeredRules || []).map((rule, idx) => (
                   <span key={idx} className="rule-tag">{rule}</span>
                ))}
                {(!insights.triggeredRules || insights.triggeredRules.length === 0) && (
                  <span className="rule-tag">Live activity analysis</span>
                )}
             </div>
          </div>

          <div className="recommendations-box">
             <h3>AI Recommendations</h3>
             <ul>
                {getSafeRecommendations().map((rec, idx) => (
                   <li key={idx}>⚡ {rec}</li>
                ))}
             </ul>
          </div>

          <div className="next-steps">
             <h3>Dynamic Learning Path Adjustment</h3>
             <p>{insights.analysis.nextSteps}</p>
             <button onClick={() => navigate(getRecommendedPath())} className="primary-btn pulse">Start Recommended Path</button>
          </div>
        </div>
      </div>
    </div>
  );
}
