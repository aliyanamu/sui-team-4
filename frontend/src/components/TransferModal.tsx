"use client";

import { useState } from "react";
import { TransferModalProps } from "@/types";
import { X, AlertTriangle } from "lucide-react";

export function TransferModal({
  petId,
  petName,
  isOpen,
  onClose,
  onConfirm,
}: TransferModalProps) {
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");

  // Validate SUI address format (basic check)
  const validateAddress = (address: string): boolean => {
    return address.startsWith("0x") && address.length >= 64;
  };

  const handleConfirm = () => {
    if (!recipient.trim()) {
      setError("Please enter a recipient address");
      return;
    }
    if (!validateAddress(recipient)) {
      setError("Invalid SUI address format");
      return;
    }
    setError("");
    onConfirm(recipient);
  };

  const handleClose = () => {
    setRecipient("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          <X size={24} strokeWidth={3} />
        </button>

        <h2 className="title">SEND &quot;{petName}&quot;</h2>

        <div className="input-group">
          <label htmlFor="recipient">RECIPIENT ADDRESS</label>
          <input
            id="recipient"
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
              setError("");
            }}
          />
          {error && <p className="error">{error}</p>}
        </div>

        <div className="warning">
          <AlertTriangle size={20} strokeWidth={3} />
          <span>THIS ACTION CANNOT BE UNDONE</span>
        </div>

        <div className="actions">
          <button className="btn btn-cancel" onClick={handleClose}>
            CANCEL
          </button>
          <button className="btn btn-confirm" onClick={handleConfirm}>
            CONFIRM
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        .modal-content {
          background: white;
          border: 3px solid var(--nb-border);
          box-shadow: var(--nb-shadow-lg);
          padding: 2rem;
          max-width: 460px;
          width: 100%;
          position: relative;
        }
        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--nb-danger);
          border: 3px solid var(--nb-border);
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .close-btn:hover {
          transform: translate(1px, 1px);
        }
        .title {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--nb-foreground);
          margin: 0 0 1.5rem 0;
          padding-right: 3rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .input-group {
          margin-bottom: 1.5rem;
        }
        .input-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 800;
          color: var(--nb-foreground);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .input-group input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 3px solid var(--nb-border);
          font-size: 1rem;
          font-family: monospace;
          background: white;
        }
        .input-group input:focus {
          outline: none;
          box-shadow: var(--nb-shadow-sm);
        }
        .error {
          color: var(--nb-danger);
          font-size: 0.875rem;
          font-weight: 700;
          margin-top: 0.5rem;
          text-transform: uppercase;
        }
        .warning {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--nb-secondary);
          color: black;
          padding: 1rem;
          border: 3px solid var(--nb-border);
          font-size: 0.875rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
        }
        .actions {
          display: flex;
          gap: 1rem;
        }
        .btn {
          flex: 1;
          padding: 1rem 1.5rem;
          border: 3px solid var(--nb-border);
          font-weight: 900;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.1s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .btn-cancel {
          background: white;
          color: black;
          box-shadow: var(--nb-shadow-sm);
        }
        .btn-cancel:hover {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px var(--nb-shadow);
        }
        .btn-confirm {
          background: var(--nb-primary);
          color: black;
          box-shadow: var(--nb-shadow-sm);
        }
        .btn-confirm:hover {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px var(--nb-shadow);
        }
      `}</style>
    </div>
  );
}
