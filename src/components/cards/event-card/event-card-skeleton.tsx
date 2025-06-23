import "./event-card.scss";
import ProfilesImgSkeleton from "@/components/images/profiles-img/profiles-img-skeleton";

interface EventCardSkeletonProps {
  minify?: boolean;
}

export default function EventCardSkeleton({
  minify = false,
}: EventCardSkeletonProps) {
  return (
    <div className={`event-card ${minify ? "minify" : ""}`}>
      <div className="image-container">
        <div className="banner" />
      </div>
      <div
        className={`flex flex-col flex-1 p-2 ${
          minify ? "gap-1" : "justify-between gap-1"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="title">name</div>
        </div>
        {/*<ProfileImg
          name={
            `${event.organizer.firstName} ${event.organizer.lastName}` || ""
          }
          note={event.organizer.note}
          imageUrl={event.organizer.imageUrl}
        />*/}
        <div className={`flex flex-wrap ${minify ? "gap-1" : "gap-2"}`}>
          <div className="info">
            <span>address</span>
          </div>
          <div className="info">
            <span>Le </span>
          </div>
        </div>
        {!minify && <p className="description">description</p>}
        <div className="flex items-center justify-between gap-2">
          {!minify && <ProfilesImgSkeleton />}
          <p className="price">prix</p>
        </div>
      </div>
    </div>
  );
}
