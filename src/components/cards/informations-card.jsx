"use client";
import { NavArrowRight } from "iconoir-react";

export default function InformationsCard({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <div className="informations-card">
      <div className="flex justify-between gap-4">
        <div className="flex flex-col gap-4 min-w-0">
          <h4>{title}</h4>
          <p className="break-words">{description}</p>
        </div>
        <div className="img-gradient-blue">{Icon && <Icon />}</div>
      </div>
      <div className="w-full flex justify-end">
        <button className="secondary-btn" onClick={onClick}>
          <span>Modifier</span>
          <NavArrowRight />
        </button>
      </div>
    </div>
  );
}
