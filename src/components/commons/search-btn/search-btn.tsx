"use client";
import Link from "next/link";
import { Search } from "iconoir-react";
import { useState, useEffect } from "react";
import "./search-btn.scss";

export default function SearchBtn() {
  const texts = [
    "Concert de rock à Nice",
    "Festival de jazz",
    "Exposition d'art moderne",
    "Conférence tech à Sophia",
    "Marché artisanal",
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[currentTextIndex];

    if (isTyping) {
      if (charIndex < currentText.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 100);

        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);

        return () => clearTimeout(timeout);
      }
    } else {
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 50);

        return () => clearTimeout(timeout);
      } else {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, currentTextIndex, texts]);

  return (
    <Link href="/search" className="search-btn">
      <div className="content">
        <Search className="icon-small" />
        <p className="typewriter-text">
          {displayedText}
          <span className="cursor">|</span>
        </p>
      </div>
    </Link>
  );
}
