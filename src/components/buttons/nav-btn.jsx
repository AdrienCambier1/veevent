"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBtn({ icon: Icon, href = "", label, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="nav-btn">
      <div
        className={`${
          isActive
            ? "bg-[var(--primary-blue)] blue-shadow"
            : "bg-[rgba(var(--primary-blue-rgb),0.1)]"
        }`}
      >
        {Icon && (
          <Icon
            className={`${
              isActive ? "text-white" : "text-[var(--primary-blue)]"
            }`}
          />
        )}
        {children}
      </div>
      <span className={`${isActive && "text-[var(--primary-blue)]"}`}>
        {label}
      </span>
    </Link>
  );
}
