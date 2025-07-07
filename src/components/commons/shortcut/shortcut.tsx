import Link from "next/link";
import { ArrowUpRight, Group } from "iconoir-react";
import "./shortcut.scss";

interface ShortcutProps {
  link: string;
  label: string;
  icon?: React.ReactNode;
}

export default function Shortcut({ link, label, icon }: ShortcutProps) {
  return (
    <Link href={link} className="shortcut">
      <span>
      {icon ? icon : <Group className="icon" />}
      <p>{label}</p>
      </span>
      <ArrowUpRight className="arrow" />
    </Link>
  );
}
