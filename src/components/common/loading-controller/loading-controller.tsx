"use client";
import { useAuth } from "@/contexts/auth-context";
import { ReactNode, useEffect, useState } from "react";
import "./loading-controller.scss";

export default function LoadingController({
  children,
}: {
  children: ReactNode;
}) {
  const { loading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!loading) {
      const elapsed = Date.now() - startTime;
      const minLoadingTime = 1000;
      document.body.style.overflow = "hidden";

      if (elapsed < minLoadingTime) {
        const remainingTime = minLoadingTime - elapsed;
        setTimeout(() => {
          setShowLoader(false);
          document.body.classList.add("loaded");
          document.body.style.overflow = "auto";
        }, remainingTime);
      } else {
        setShowLoader(false);
        document.body.classList.add("loaded");
        document.body.style.overflow = "auto";
      }
    }
  }, [loading, startTime]);

  return (
    <>
      {showLoader && (
        <div className="loader-wrapper">
          <div className="loader ">
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
      )}

      {children}
    </>
  );
}
