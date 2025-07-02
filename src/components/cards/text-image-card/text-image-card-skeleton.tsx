import "./text-image-card.scss";

export default function TextImageCardSkeleton() {
  return (
    <div className="text-image-card is-card skeleton-bg">
      <div className="flex items-center">
        <p className="title skeleton-text">Nom de la ville</p>
        <div className="skeleton-bg h-10 w-10 rounded-lg rotate-6" />
      </div>
      <div className="flex items-center justify-between gap-2 text-secondary-400">
        <p className="skeleton-text">25 événements</p>
        <div className="skeleton-bg h-4 w-4 rounded-full" />
      </div>
    </div>
  );
}
