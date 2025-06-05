"use client";
import Link from "next/link";
import { City, NavArrowDown, NavArrowLeft } from "iconoir-react";
import "./header.scss";
import React from "react";
import { useSidebar } from "@/contexts/sidebar-context";
import { useCity } from "@/contexts/city-context";
import SidebarMenu from "../../menu/sidebar-menu/sidebar-menu";

interface HeaderProps {
  hideCitySelector: boolean;
}

export default function Header({ hideCitySelector }: HeaderProps) {
  const { openSidebar } = useSidebar();
  const { currentCity, geoLoading } = useCity();

  return (
    <>
      <header>
        <div
          className={`${
            hideCitySelector ? "justify-center" : "justify-between"
          } wrapper`}
        >
          {hideCitySelector && (
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
              className="back-button"
            >
              <NavArrowLeft />
              <span>Retour</span>
            </Link>
          )}

          <Link href="/" className="logo">
            <img src="/veevent.svg" alt="Veevent Logo" />
          </Link>

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
      </header>
      <SidebarMenu />
    </>
  );
}
