"use client";
import { Check, Copy } from "iconoir-react";
import { useState } from "react";

export default function CopyBtn({ id = "Jeanclaude" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  return (
    <button
      className={`copy-btn ${copied ? "copied" : ""}`}
      onClick={handleCopy}
      title={`Copier l'identifiant: ${id}`}
    >
      {copied ? <Check /> : <Copy />}
      <span>{id}</span>
    </button>
  );
}
