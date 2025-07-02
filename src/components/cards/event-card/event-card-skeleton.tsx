import "./event-card.scss";

export default function EventCardSkeleton() {
  return (
    <div className="event-card skeleton-bg animate-pulse flex flex-col">
      {/* Image + tags */}
      <div className="image-container relative w-full h-32 rounded-t-lg overflow-hidden mb-2">
        <div className="absolute inset-0 bg-gray-300" />
        <div className="absolute top-2 left-2 flex gap-2">
          <div className="bg-gray-200 h-5 w-12 rounded" />
          <div className="bg-gray-200 h-5 w-12 rounded" />
        </div>
      </div>
      <div className="flex flex-col flex-1 p-2 gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="bg-gray-200 h-5 w-2/3 rounded" />
          <div className="bg-gray-300 h-6 w-6 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gray-300 h-8 w-8 rounded-full" />
          <div className="bg-gray-200 h-4 w-24 rounded" />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="bg-gray-200 h-4 w-20 rounded" />
          <div className="bg-gray-200 h-4 w-28 rounded" />
        </div>
        <div className="bg-gray-200 h-4 w-3/4 rounded" />
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="bg-gray-200 h-6 w-16 rounded" />
          <div className="bg-gray-200 h-6 w-16 rounded" />
          <div className="bg-gray-300 h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}
