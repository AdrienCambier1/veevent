"use client";
import { Suspense, useEffect } from "react";

function ScrollToTopContent() {
  const { usePathname, useSearchParams } = require("next/navigation");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname, searchParams]);

  return null;
}

export default function ScrollToTop() {
  return (
    <Suspense fallback={<></>}>
      <ScrollToTopContent />
    </Suspense>
  );
}
