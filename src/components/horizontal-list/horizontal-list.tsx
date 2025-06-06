import { useRef, useState } from "react";

interface HorizontalListProps {
  children?: React.ReactNode;
  title?: string;
}

export default function HorizontalList({
  title,
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
    const walk = (x - startX) * 2; // Vitesse de défilement
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="wrapper">
        <h2>{title}</h2>
      </div>
      <div
        ref={scrollRef}
        className={`overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth snap-x snap-mandatory ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex gap-4 pl-4 pr-4 sm:pl-4 sm:pr-4 xl:pl-[calc((100vw-1200px)/2+0.5rem)] py-1 xl:pr-[calc((100vw-1200px)/2+1rem)] min-w-fit select-none">
          {children}
        </div>
      </div>
    </section>
  );
}
