import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Keyboard } from "swiper/modules";
import CustomTitle from "@/components/common/custom-title/custom-title";
import React from "react";

import "swiper/css";
import "swiper/css/free-mode";
import "./horizontal-list.scss";

interface HorizontalListProps {
  children?: React.ReactNode;
  title: string;
  description?: string;
}

export default function HorizontalList({
  title,
  description,
  children,
}: HorizontalListProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <section className="horizontal-list gap-0">
      <div className="wrapper pb-0">
        {description ? (
          <CustomTitle title={title} description={description} />
        ) : (
          <h2>{title}</h2>
        )}
      </div>

      <div className="swiper-container">
        <Swiper
          modules={[FreeMode, Mousewheel, Keyboard]}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode={{
            enabled: true,
            sticky: true,
            momentumRatio: 0.6,
            momentumVelocityRatio: 0.6,
            minimumVelocity: 0.02,
          }}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 0.8,
            releaseOnEdges: true,
            thresholdDelta: 50,
            thresholdTime: 150,
          }}
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
          speed={400}
          resistance={true}
          resistanceRatio={0.9}
          grabCursor={true}
          className="horizontal-swiper scrollbar-hide"
        >
          {childrenArray.map((child, index) => (
            <SwiperSlide key={index} className="swiper-slide-auto">
              {child}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
