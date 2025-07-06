"use client";
import Link from "next/link";
import { City, NavArrowDown, NavArrowLeft, Search } from "iconoir-react";
import "./header.scss";
import React from "react";
import { useSidebar } from "@/contexts/sidebar-context";
import SidebarMenu from "../menu/sidebar-menu/sidebar-menu";
import { useHeader } from "@/contexts/header-context";
import { useCity } from "@/contexts/city-context";
import { usePathname } from "next/navigation";

export default function Header() {
  const { openSidebar } = useSidebar();
  const { currentCity, geoLoading } = useCity();
  const { hideCitySelector } = useHeader();
  const pathname = usePathname() || "";

  const menuItems = [
    {
      link: "/",
      label: "Pour vous",
      isActive: pathname === "/",
    },
    {
      link: "/evenements",
      label: "Évènements",
      isActive: pathname.includes("/evenements"),
    },
    {
      link: "/compte/tickets",
      label: "Profil",
      isActive: pathname.includes("/compte"),
    },
  ];

  return (
    <>
      <header>
        <div
          className={`${
            hideCitySelector ? "justify-center" : "justify-between"
          } wrapper`}
        >
          <Link href="/" className="logo">
            <img src="/veevent.svg" alt="Veevent Logo" />
          </Link>

          {/* Menu de navigation desktop - caché quand le sélecteur de ville est masqué */}
          {!hideCitySelector && (
            <nav className="desktop-nav">
              {menuItems.map((item) => (
                <Link
                  key={item.link}
                  href={item.link}
                  className={`nav-link ${item.isActive ? "active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/search"
                className={`nav-link ${pathname.includes("/search") ? "active" : ""}`}
              >
                <Search strokeWidth={2} />
              </Link>
            </nav>
          )}

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
