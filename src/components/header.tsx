"use client";
import Link from "next/link";
import Image from "next/image";
import { City, NavArrowDown, NavArrowLeft } from "iconoir-react";
import logo from "@/assets/images/veevent.svg";
import "@/assets/styles/header.scss";
import React from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useCity } from "@/contexts/city-context";

interface HeaderProps {
  hideCitySelector: boolean;
}

export default function Header({ hideCitySelector }: HeaderProps) {
  const { openSidebar } = useSidebar();
  const { currentCity, geoLoading } = useCity();

  return (
    <header className={hideCitySelector ? "is-hide" : ""}>
      <div className="wrapper">
        <div className="left-column">
          {hideCitySelector ? (
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
            >
              <div className="back-button">
                <NavArrowLeft />
                Retour
              </div>
            </Link>
          ) : (
            <Link href="/" className="logo">
              <Image src={logo} alt="Veevent Logo" />
            </Link>
          )}
        </div>

        <div className="middle-column">
          {hideCitySelector && (
            <Link href="/" className="logo">
              <Image src={logo} alt="Veevent Logo" />
            </Link>
          )}
        </div>

        <div className="right-column">
          {!hideCitySelector && (
            <button
              className="city-selector"
              onClick={openSidebar}
              type="button"
            >
              <City strokeWidth={2} />
              <span>
                {geoLoading ? "Localisation..." : currentCity}
                <NavArrowDown className="text-xs" />
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
