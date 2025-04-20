"use client";
import { Home } from "iconoir-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomNav({ navigation, disabledHome }) {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-full blue-shadow p-2 flex items-center w-fit max-w-full">
      {!disabledHome && (
        <Link href="/" className="px-4">
          <Home className="h-6 w-6 text-[var(--primary-blue)] hover:opacity-75 transition" />
        </Link>
      )}
      {navigation.map((item, index) => {
        const isActive = pathname.includes(item.href);

        return (
          <Link
            href={item.href}
            key={index}
            className={
              isActive ? "primary-btn" : "blue-rounded-btn !bg-transparent"
            }
          >
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
