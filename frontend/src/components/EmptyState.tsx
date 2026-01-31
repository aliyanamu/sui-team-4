"use client";

export function EmptyState() {
  return (
    <div className="empty-state">
      <div className="egg-container">
        <span className="egg">🥚</span>
      </div>
      <h3 className="title">NO PETS YET!</h3>
      <p className="message">Mint your first companion above to get started.</p>
      <style jsx>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }
        .egg-container {
          background: var(--nb-secondary);
          border: 3px solid var(--nb-border);
          box-shadow: var(--nb-shadow-lg);
          padding: 2rem;
          margin-bottom: 1.5rem;
        }
        .egg {
          font-size: 4rem;
          display: block;
        }
        .title {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--nb-foreground);
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .message {
          font-size: 1rem;
          color: var(--nb-foreground);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
