import "./trending-card.scss";

export default function TrendingCardSkeleton() {
  return (
    <div className="trending-card skeleton-bg relative w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 skeleton-bg" />
      <div className="content p-2 w-full flex flex-col justify-between z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="skeleton-text">Tendance</span>
          <span className="skeleton-text">Nice</span>
        </div>
        <div className="flex items-end gap-8">
          <h3 className="skeleton-text">Nom de l'événement tendance</h3>
          <div className="skeleton-bg h-6 w-6 rounded-full" />
        </div>
      </div>
      <div className="gradient blue" />
      <div className="gradient black" />
    </div>
  );
}
