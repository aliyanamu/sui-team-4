"use client";

export function EmptyState() {
  return (
    <div className="empty-state">
      <div className="egg-container">
        <span className="egg">🥚</span>
      </div>
      <h3 className="title">NO PETS YET!</h3>
      <p className="message">Mint your first companion above to get started.</p>
    </div>
  );
}
