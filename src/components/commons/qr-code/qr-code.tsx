"use client";

import dynamic from "next/dynamic";
import { FC } from "react";

const QRCodeSVG = dynamic(() => import("qrcode.react").then(mod => ({ default: mod.QRCodeSVG })), { ssr: false });

interface QRCodeProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
}

export default function QRCode({
  value,
  size = 200,
  level = "M",
}: QRCodeProps) {
  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <QRCodeSVG
        value={value}
        size={size}
        level={level}
        bgColor="#f7f7f7"
        fgColor="#3b32ff"
      />

      <div className="text-center">
        <p className="text-sm text-primary-950 text-center py-1">
          Présentez ce code à l'entrée de l'événement
        </p>
      </div>
    </div>
  );
}
