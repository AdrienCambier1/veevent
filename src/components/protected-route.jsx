"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const minLoaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, 500);

    return () => clearTimeout(minLoaderTimer);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (showLoader || loading || !isAuthenticated) {
    return (
      <div className="loader-container">
        <div className="loader" />
      </div>
    );
  }

  return children;
}
