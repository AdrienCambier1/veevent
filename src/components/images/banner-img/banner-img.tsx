import Image from "next/image";
import nice4k from "@/assets/images/nice4k.jpg";
import "./banner-img.scss";

interface BannerImgProps {
  city?: string;
}

export default function BannerImg({ city }: BannerImgProps) {
  return (
    <div className="banner-img">
      <div className="gradient" />
      <Image src={nice4k} alt="Nice img" className="banner" />
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
