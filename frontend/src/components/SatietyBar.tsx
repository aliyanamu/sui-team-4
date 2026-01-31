"use client";

import { SatietyBarProps } from "@/types";

export function SatietyBar({ value, showLabel = true }: SatietyBarProps) {
  // Determine color based on satiety level
  const getBarColor = () => {
    if (value > 50) return "var(--nb-accent)"; // Green - healthy
    if (value > 20) return "var(--nb-secondary)"; // Yellow - warning
    return "var(--nb-danger)"; // Red - danger
  };

  const getStatusEmoji = () => {
    if (value === 0) return "💀";
    if (value > 70) return "😊";
    if (value > 40) return "😐";
    if (value > 20) return "😟";
    return "😰";
  };

  return (
    <div className="satiety-bar-container">
      <div className="bar-wrapper">
        <div
          className="bar-fill"
          style={{
            width: `${Math.max(0, Math.min(100, value))}%`,
            backgroundColor: getBarColor(),
          }}
        />
      </div>
      {showLabel && (
        <div className="label">
          <span className="emoji">{getStatusEmoji()}</span>
          <span className="value">{value}/100</span>
        </div>
      )}
      <style jsx>{`
        .satiety-bar-container {
          width: 100%;
        }
        .bar-wrapper {
          width: 100%;
          height: 20px;
          background-color: white;
          border: 3px solid var(--nb-border);
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          transition: width 0.3s ease;
        }
        .label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--nb-foreground);
        }
        .emoji {
          font-size: 1.25rem;
        }
        .value {
          font-weight: 800;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}
