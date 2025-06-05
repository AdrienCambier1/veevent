import Link from "next/link";
import { ArrowUpRight, Group } from "iconoir-react";
import "./shortcut.scss";

interface ShortcutProps {
  link: string;
  label: string;
}

export default function Shortcut({ link, label }: ShortcutProps) {
  return (
    <Link href={link} className="shortcut">
      <Group className="icon" />
      <p>{label}</p>
      <ArrowUpRight />
    </Link>
  );
}
