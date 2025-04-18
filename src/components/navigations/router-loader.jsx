"use client";

import { useState, useEffect } from "react";

export default function RouteLoader({ children }) {
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const minTimer = setTimeout(() => {
      setLoadingComplete(true);
    }, 300);

    return () => clearTimeout(minTimer);
  }, []);

  if (!loadingComplete) {
    return (
      <div className="loader-container">
        <div className="loader" />
      </div>
    );
  }

  return children;
}
