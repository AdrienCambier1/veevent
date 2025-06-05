import FloatingMenuItem from "@/components/menu/floating-menu/floating-menu-item";
import "./floating-menu.scss";

export default function FloatingMenu() {
  return (
    <div className="floating-menu">
      <FloatingMenuItem label="Pour vous" isActive={true} />
      <FloatingMenuItem label="Évènements" isActive={false} />
      <FloatingMenuItem label="Profil" isActive={false} />
    </div>
  );
}
