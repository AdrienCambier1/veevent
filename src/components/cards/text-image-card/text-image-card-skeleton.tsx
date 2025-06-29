import "./text-image-card.scss";

export default function TextImageCardSkeleton() {
  return (
    <div className="text-image-card is-card skeleton-bg">
      <div className="city-img skeleton-bg rounded-lg h-10 w-10 rotate-6"></div>
      <div className="title skeleton-text h-6 w-20 rounded"></div>
    </div>
  );
} 