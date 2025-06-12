"use client";
import { useAuth } from "@/contexts/auth-context";
import { ReactNode } from "react";
import "./loading-controller.scss";

export default function LoadingController({
  children,
}: {
  children: ReactNode;
}) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="loader">
          <div className="cell d-0"></div>
          <div className="cell d-1"></div>
          <div className="cell d-2"></div>
          <div className="cell d-1"></div>
          <div className="cell d-2"></div>
          <div className="cell d-2"></div>
          <div className="cell d-3"></div>
          <div className="cell d-3"></div>
          <div className="cell d-4"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
