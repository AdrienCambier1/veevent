import FloatingMenuItem from "@/components/floating-menu/floating-menu-item";
import "@/assets/styles/floating-menu.scss";

export default function FloatingMenu() {
  return (
    <div className="floating-menu">
      <FloatingMenuItem label="Pour vous" isActive={true} />
      <FloatingMenuItem label="Évènements" isActive={false} />
      <FloatingMenuItem label="Profil" isActive={false} />
    </div>
  );
}
