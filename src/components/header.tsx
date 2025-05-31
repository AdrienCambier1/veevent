import Link from "next/link";
import Image from "next/image";
import { City, NavArrowDown, NavArrowLeft } from "iconoir-react";
import logo from "@/assets/images/veevent.svg";
import "@/assets/styles/header.scss";
import React from "react";

interface HeaderProps {
  hideCitySelector: boolean;
}

export default function Header({ hideCitySelector }: HeaderProps) {
  return (
    <header className={hideCitySelector ? "is-hide" : ""}>
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
          <div className="city-selector">
            <City strokeWidth={2} />
            <span>
              Nice
              <NavArrowDown className="text-xs" />
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
