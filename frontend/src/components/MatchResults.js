import React from 'react';

export default function MatchResults({ matchData }) {
  if (!matchData) return null;

  const { score, matched, missing } = matchData;
  const scoreClass = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  const cardClass = score >= 70 ? '' : score >= 40 ? 'medium' : 'low';

  return (
    <div className="match-results" data-testid="match-results">
      {/* Score Card */}
      <div className={`score-card ${cardClass}`}>
        <div className={`score-value ${scoreClass}`} data-testid="match-score">
          {score}%
        </div>
        <div className="score-label">Keyword Match Score</div>
      </div>

      {/* Keywords */}
      <div className="keyword-section">
        {/* Matched */}
        {matched.length > 0 && (
          <div className="keyword-group">
            <div className="keyword-group-title">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              Matched ({matched.length})
            </div>
            <div className="keyword-chips">
              {matched.map((kw, i) => (
                <span className="chip chip-match" key={i}>{kw}</span>
              ))}
            </div>
          </div>
        )}

        {/* Missing */}
        {missing.length > 0 && (
          <div className="keyword-group">
            <div className="keyword-group-title">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Missing ({missing.length})
            </div>
            <div className="keyword-chips">
              {missing.map((kw, i) => (
                <span className="chip chip-missing" key={i}>{kw}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
