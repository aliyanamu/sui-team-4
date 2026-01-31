"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

interface TransferModalProps {
  petName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (recipient: string) => void;
}

export function TransferModal({
  petName,
  isOpen,
  onClose,
  onConfirm,
}: TransferModalProps) {
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");

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
    </div>
  );
}
