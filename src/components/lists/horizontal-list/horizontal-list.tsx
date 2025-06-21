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
    <section className="horizontal-list gap-0 ">
      <div className="wrapper pb-0">
        {description ? (
          <CustomTitle title={title} description={description} />
        ) : (
          <h2>{title}</h2>
        )}
      </div>

      <div className="swiper-container ">
        <Swiper
          modules={[FreeMode, Mousewheel, Keyboard]}
          slidesPerView="auto"
          freeMode={{
            enabled: true,
            sticky: true,
            momentumRatio: 0.3,
            momentumVelocityRatio: 0.3,
            momentumBounce: true,
            momentumBounceRatio: 0.1,
            minimumVelocity: 0.005,
          }}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 0.5,
            releaseOnEdges: true,
            thresholdDelta: 50,
            thresholdTime: 200,
          }}
          speed={400}
          touchRatio={0.7}
          grabCursor={true}
          followFinger={true}
          className="horizontal-swiper"
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
