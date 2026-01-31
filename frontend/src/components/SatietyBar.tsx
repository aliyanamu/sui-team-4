"use client";

import { SatietyBarProps } from "@/types";

export function SatietyBar({ value, showLabel = true }: SatietyBarProps) {
  const getBarColor = () => {
    if (value > 50) return "var(--nb-accent)";
    if (value > 20) return "var(--nb-secondary)";
    return "var(--nb-danger)";
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
    </div>
  );
}
