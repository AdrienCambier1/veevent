import "./event-card.scss";

export default function EventCardSkeleton() {
  return (
    <div className="event-card skeleton-bg flex flex-col">
      <div className="image-container">
        <div className="theme-tags">
          <span className="skeleton-text">Pop</span>
          <span className="skeleton-text">Rock</span>
        </div>
        <div className="banner" style={{ height: "128px" }} />
      </div>
      <div className="flex flex-col flex-1 p-2 gap-1">
        <div className="flex items-center justify-between gap-2">
          <div className="title skeleton-text">Nom de l'événement</div>
          <div className="icon" style={{ width: "24px", height: "24px" }} />
        </div>
        <div className="flex items-center gap-2">
          <div
            className="profile-pic icon"
            style={{ width: "24px", height: "24px", borderRadius: "50%" }}
          />
          <div className="flex flex-col justify-center gap-1">
            <p className="skeleton-text text-base font-medium">
              Nom Organisateur
            </p>
            <div className="flex items-center gap-1">
              <span className="skeleton-text text-xs">★★★★☆</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="info flex items-center gap-1">
            <div
              className="icon-small"
              style={{ width: "16px", height: "16px" }}
            />
            <span className="skeleton-text">Adresse du lieu</span>
          </div>
          <div className="info flex items-center gap-1">
            <div
              className="icon-small"
              style={{ width: "16px", height: "16px" }}
            />
            <span className="skeleton-text">Le 25 déc 2024 à 20:00</span>
          </div>
        </div>
        <p className="description skeleton-text">
          Description de l'événement qui peut être assez longue
        </p>
        <div className="flex items-center justify-between gap-2">
          <div
            style={{ width: "80px", height: "32px", borderRadius: "16px" }}
          />
          <p className="price skeleton-text">À partir de 25 €</p>
        </div>
      </div>
    </div>
  );
}
