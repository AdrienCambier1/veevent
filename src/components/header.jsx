import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header>
      <Link href="/">
        <h1 className="text-[--dark-blue]">
          V<span className="text-[--blue]">ee</span>vent
        </h1>
      </Link>
      <nav className="hidden xl:flex items-center gap-8">
        <Link href="">
          <h4>Evenements</h4>
        </Link>
        <Link href="">
          <h4>Evenements</h4>
        </Link>
      </nav>
      <div className="hidden xl:flex items-center gap-4">
        <Link href="" className="blue-secondary-btn">
          Notifications
        </Link>
        <Link href="" className="blue-primary-btn">
          Profile
        </Link>
      </div>
    </header>
  );
}
