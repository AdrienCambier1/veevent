import "./faq-card.scss";
import { Plus } from "iconoir-react";

interface FaqCardProps {
  label?: string;
}

export default function FaqCard({ label }: FaqCardProps) {
  return (
    <div className="faq-card">
      <div className="flex items-center gap-2 justify-between">
        <p>{label}</p>
        <Plus className="icon-small" />
      </div>
    </div>
  );
}
