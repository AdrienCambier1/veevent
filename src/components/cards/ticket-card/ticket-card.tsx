"use client";

import "./ticket-card.scss";
import Image from "next/image";
import img from "@/assets/images/nice.jpg";
import { useState } from "react";
import BottomSheet from "@/components/common/bottom-sheet/bottom-sheet";
import QRCode from "@/components/common/qr-code/qr-code";
import Link from "next/link";

export default function TicketCard() {
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);

  // Identifiant unique du ticket (à remplacer par les vraies données)
  const ticketId = "TKT-2025-MORGAN-001";
  const eventName = "morgan"; // Nom de l'événement, utilisé dans le lien

  const handleShowQRCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQRCodeOpen(true);
  };

  return (
    <Link href={`/evenements/${eventName.toLowerCase()}`}>
      <div className="ticket-card">
        <div className="ticket-container">
          <div className="flex flex-col gap-1">
            <div className="event-name">Morgan</div>
            <div className="event-place">Eglise Sainte Philomène</div>
            <p className="event-city">LE CANNET, FRANCE</p>
            <div className="event-date">
              <div>18 Mai 2025</div>
              <div>15:00</div>
            </div>
            <Image
              src={img}
              alt="picture event"
              className="rounded-[var(--vv-border-radius)]"
            />
          </div>
          <div className="ticket-footer">
            <div className="barcode">
              <div className="barcode-lines">
                {Array.from({ length: 28 }, (_, i) => (
                  <div
                    key={i}
                    className="barcode-line"
                    style={{
                      width: Math.random() > 0.5 ? "2px" : "4px",
                    }}
                  />
                ))}
              </div>
              <button
                className="barcode-text cursor-pointer "
                onClick={handleShowQRCode}
              >
                Voir le code QR
              </button>
            </div>
            <img src={"/veevent.svg"} alt="Veevent Logo" className="logo" />
          </div>
        </div>
        <img
          src="/ticket-body.svg"
          alt="Ticket body background"
          className="ticket-body"
        />
      </div>

      <BottomSheet
        isOpen={isQRCodeOpen}
        onClose={() => setIsQRCodeOpen(false)}
        maxHeight="75vh"
        title="Code QR du billet"
      >
        <div
          className="flex flex-col items-center justify-center p-4 gap-3"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsQRCodeOpen(false);
          }}
        >
          <QRCode value={ticketId} size={250} />
          <div className="primary-btn">
            <span>Fermer</span>
          </div>
        </div>
      </BottomSheet>
    </Link>
  );
}
