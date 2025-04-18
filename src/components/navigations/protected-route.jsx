"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [redirecting, setRedirecting] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    router.prefetch("/login");
  }, [router]);

  useEffect(() => {
    const minTimer = setTimeout(() => {
      setLoadingComplete(true);
    }, 300);

    return () => clearTimeout(minTimer);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated && !redirecting && loadingComplete) {
      setRedirecting(true);

      const encodedRedirectPath = encodeURIComponent(pathname);
      router.replace(`/login?redirect=${encodedRedirectPath}`);
    }
  }, [isAuthenticated, loading, router, redirecting, loadingComplete]);

  if (loading || !isAuthenticated || !loadingComplete) {
    return (
      <div className="loader-container">
        <div className="loader" />
      </div>
    );
  }

  return children;
}
