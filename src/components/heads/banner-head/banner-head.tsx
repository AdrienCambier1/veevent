import Image from "next/image";
import nice4k from "@/assets/images/nice4k.jpg";
import "./banner-head.scss";

interface BannerHeadProps {
  city?: string;
  bannerImage?: any;
}

export default function BannerHead({
  city,
  bannerImage,
}: BannerHeadProps) {
  // Utiliser l'image par défaut si bannerImage n'est pas fournie
  const imageToShow = bannerImage || nice4k;

  return (
    <div className="banner-img">
      <div className="gradient" />
      <Image 
        src={imageToShow} 
        alt="Banner image" 
        className="banner"
        width={1200}
        height={300}
        priority
      />
      {city && (
        <div className="content">
          <section className="wrapper">
            <p className="city">{city}</p>
          </section>
        </div>
      )}
    </div>
  );
}
