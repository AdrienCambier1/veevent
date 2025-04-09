import Link from "next/link";
import { MusicDoubleNote } from "iconoir-react";

export default function ThemeCard() {
  return (
    <Link href="" className="theme-card group">
      <div className="flex flex-col items-center justify-center gap-2">
        <MusicDoubleNote className="group-hover:text-white" />
        <p className="group-hover:text-white">Musique</p>
      </div>
    </Link>
  );
}
