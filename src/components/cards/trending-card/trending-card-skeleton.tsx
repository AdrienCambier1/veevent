import "./trending-card.scss";

export default function TrendingCardSkeleton() {
  return (
    <div className="trending-card skeleton-bg animate-pulse relative w-96 h-44 flex items-center justify-center overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gray-300" />
      <div className="content p-2 h-44 w-full flex flex-col justify-between z-10">
        <div className="flex justify-between items-center mb-2">
          <div className="bg-gray-200 h-4 w-24 rounded" />
          <div className="bg-gray-200 h-4 w-16 rounded" />
        </div>
        <div className="flex items-end gap-8">
          <div className="bg-gray-200 h-6 w-2/3 rounded" />
          <div className="bg-gray-300 h-6 w-6 rounded-full" />
        </div>
      </div>
      <div className="gradient blue" />
      <div className="gradient black" />
    </div>
  );
}
