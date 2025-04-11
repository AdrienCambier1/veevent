"use client";
import { Search } from "iconoir-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

export default function SearchBarButton({ onClick }) {
  const textRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    const textSequence = [
      "Rechercher",
      "Concert de rock",
      "Atelier de couture",
      "Festival de musique",
    ];

    gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    const tl = gsap.timeline({ repeat: -1 });

    textSequence.forEach((text) => {
      if (tl.recent()) {
        const previousText = tl.recent().vars.text || "";
        for (let i = previousText.length; i > 0; i--) {
          tl.to(textRef.current, {
            duration: 0.05 + Math.random() * 0.05,
            text: previousText.substring(0, i - 1),
            ease: "none",
          });
        }
      }

      tl.to({}, { duration: 0.5 });

      let typedText = "";
      for (let i = 0; i < text.length; i++) {
        typedText += text[i];

        tl.to(textRef.current, {
          duration: 0.06 + Math.random() * 0.08,
          text: typedText,
          ease: "none",
        });

        if (Math.random() < 0.2) {
          tl.to({}, { duration: 0.2 + Math.random() * 0.3 });
        }
      }

      tl.to({}, { duration: 1.5 });
    });

    return () => tl.kill();
  }, []);

  return (
    <button className="search-bar-btn hover:opacity-75" onClick={onClick}>
      <Search />
      <div className="flex">
        <p ref={textRef}></p>
        <span ref={cursorRef} className="ml-0.5 text-[var(--light-gray)]">
          |
        </span>
      </div>
    </button>
  );
}
