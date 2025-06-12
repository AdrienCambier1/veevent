import { useRef, useState } from "react";
import CustomTitle from "@/components/common/custom-title/custom-title";
import "./horizontal-list.scss";

interface HorizontalListProps {
  children?: React.ReactNode;
  title: string;
  description?: string;
}

export default function HorizontalList({
  title,
  description,
  children,
}: HorizontalListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 4; // Vitesse de défilement
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="horizontal-list gap-0">
      <div className="wrapper pb-0">
        {description ? (
          <CustomTitle title={title} description={description} />
        ) : (
          <h2>{title}</h2>
        )}
      </div>
      <div
        ref={scrollRef}
        className={`scroll-container scrollbar-hide ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="scroll-content">{children}</div>
      </div>
    </section>
  );
}
