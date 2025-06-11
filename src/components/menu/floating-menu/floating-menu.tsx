import FloatingMenuItem from "@/components/menu/floating-menu/floating-menu-item";
import "./floating-menu.scss";

export default function FloatingMenu() {
  return (
    <div className="floating-menu">
      <FloatingMenuItem link="/" label="Pour vous" isActive={true} />
      <FloatingMenuItem
        link="/evenements"
        label="Évènements"
        isActive={false}
      />
      <FloatingMenuItem
        link="/compte/tickets"
        label="Profil"
        isActive={false}
      />
    </div>
  );
}
