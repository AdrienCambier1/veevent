"use client";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";

export default function LoaderModal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)] z-[999]">
      <div className="loader" />
    </div>,
    document.querySelector("body")
  );
}
