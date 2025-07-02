import "./text-image-card.scss";

export default function TextImageCardSkeleton() {
  return (
    <div className="text-image-card is-card skeleton-bg animate-pulse">
      <div className="flex items-center gap-2 w-full justify-between">
        <div className="title bg-gray-300 h-6 w-2/3 rounded mb-0.5"></div>
        <div className="city-img bg-gray-300 h-10 w-10 rounded-lg rotate-6" />
      </div>
      <div className="flex items-center justify-between gap-2 w-full mt-2">
        <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
        <div className="bg-gray-300 h-4 w-4 rounded-full" />
      </div>
    </div>
  );
}
