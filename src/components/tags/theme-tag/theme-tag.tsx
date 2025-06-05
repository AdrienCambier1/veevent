import "./theme-tag.scss";
import React from "react";
import themeIcons from "./themes";

interface ThemeTagProps {
  category?: string;
  name?: string;
  children?: React.ReactNode;
  onEventCard?: boolean;
  isSelected?: boolean;
}

export default function ThemeTag({
  category,
  name,
  onEventCard,
  isSelected,
  children,
}: ThemeTagProps) {
  if (category) {
    const themeIcon = themeIcons[category] || themeIcons.default;
    const displayName = name || themeIcon.name;

    return (
      <span
        className={`theme-tag ${onEventCard ? "on-event-card" : ""} ${
          isSelected ? "selected" : ""
        }`}
      >
        {themeIcon.icon}
        {displayName}
        {children}
      </span>
    );
  }

  if (name) {
    return (
      <span
        className={`theme-tag ${onEventCard ? "on-event-card" : ""} ${
          isSelected ? "selected" : ""
        }`}
      >
        {themeIcons.default.icon}
        {children}
        {name}
      </span>
    );
  }

  return (
    <span
      className={`theme-tag ${onEventCard ? "on-event-card" : ""} ${
        isSelected ? "selected" : ""
      }`}
    >
      {children}
    </span>
  );
}
