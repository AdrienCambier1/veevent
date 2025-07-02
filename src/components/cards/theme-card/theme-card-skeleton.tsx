import "./theme-card.scss";

export default function ThemeCardSkeleton() {
  return (
    <div className="theme-card skeleton-bg flex flex-col items-center gap-2 p-4 min-h-32 min-w-32 animate-pulse">
      <div className="theme-card-icon bg-gray-300 h-10 w-10 rounded-full mb-2" />
      <div className="theme-card-label bg-gray-200 h-4 w-20 rounded" />
    </div>
  );
}
