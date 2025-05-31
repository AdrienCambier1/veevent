import "@/assets/styles/sidebar-menu.scss";
import { Xmark, City, MapPin } from "iconoir-react";
import CityCard from "@/components/cards/city-card";

export default function SidebarMenu() {
    return (
        <>
            <div className="sidebar-overlay"> </div>
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="close-button">
                        <Xmark strokeWidth={2} />
                    </div>
                    <div className="city-selector">
                        <City strokeWidth={2} /><span>Nice</span>
                    </div>
                </div>
                <ul className="sidebar-list">
                    <p className="sidebar-list-title">Explorer par ville</p>
                    <CityCard city="Nice" isCard={false} />
                    <CityCard city="Cannes" isCard={false} />
                    <CityCard city="Marseille" isCard={false} />
                    <CityCard city="Lyon" isCard={false} />
                    <button className="primary-btn">
                        <span className="flex gap-2"><City strokeWidth={2} />Toutes les villes</span>
                    </button>
                </ul>
                <div className="sidebar-footer">
                    <button className="geo-button"><MapPin />Activer la géolocalisation</button>
                </div>
            </div>
        </>
    );
}