import "./theme-card.scss";

export default function ThemeCardSkeleton() {
  return (
    <div className="theme-card skeleton-bg flex flex-col items-center gap-2 p-4 min-h-32 min-w-32">
      <div className="theme-card-icon skeleton-bg h-10 w-10 rounded-full mb-2" />
      <span className="theme-card-label skeleton-text">Thème</span>
    </div>
  );
}
