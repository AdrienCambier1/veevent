import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import React, { useState, useEffect } from "react";

import "swiper/css";
import "swiper/css/pagination";
import "./carousel.scss";

interface CarouselProps {
  children?: React.ReactNode;
  title: string;
  description?: string;
  autoplayDelay?: number;
}

export default function Carousel({
  title,
  description,
  children,
  autoplayDelay = 3000,
}: CarouselProps) {
  const childrenArray = React.Children.toArray(children);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible || childrenArray.length === 0) {
    return null;
  }

  return (
    <section className="carousel-section">
      <div className="wrapper pb-0">
        {description ? (
          <div className="carousel-header">
            <h2>{title}</h2>
            <p className="description">{description}</p>
          </div>
        ) : (
          <h2>{title}</h2>
        )}
      </div>

      <div className="wrapper">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={0}
          autoplay={{
            delay: autoplayDelay,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          loop={childrenArray.length > 1}
          speed={600}
          className="trending-carousel"
        >
          {childrenArray.map((child, index) => (
            <SwiperSlide key={index} className="carousel-slide">
              {child}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
} 