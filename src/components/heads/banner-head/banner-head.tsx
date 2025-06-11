import Image from "next/image";
import nice4k from "@/assets/images/nice4k.jpg";
import "./banner-head.scss";

interface BannerHeadProps {
  city?: string;
  bannerImage?: any;
}

export default function BannerHead({
  city,
  bannerImage = nice4k,
}: BannerHeadProps) {
  return (
    <div className="banner-img">
      <div className="gradient" />
      <Image src={bannerImage} alt="Banner image" className="banner" />
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
