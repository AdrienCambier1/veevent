"use client";

import { useEffect } from "react";

export default function HydrationFix() {
  useEffect(() => {
    // Remove browser extension attributes that cause hydration mismatches
    const body = document.body;
    if (body) {
      // Remove Built-in Speed extension attributes
      body.removeAttribute("bis_register");

      // Remove other extension attributes that match these patterns
      Array.from(body.attributes).forEach((attr) => {
        if (
          attr.name.includes("__processed_") ||
          attr.name.includes("bis_") ||
          attr.name.includes("data-new-gr-c-s-check-loaded") ||
          attr.name.includes("data-gr-ext-installed")
        ) {
          body.removeAttribute(attr.name);
        }
      });
    }
  }, []);

  return null; // Ce composant ne rend rien
}
