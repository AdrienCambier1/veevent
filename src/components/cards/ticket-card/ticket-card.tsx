"use client";

import "./ticket-card.scss";
import Image from "next/image";
import img from "@/assets/images/nice.jpg";
import { useState } from "react";
import BottomSheet from "@/components/common/bottom-sheet/bottom-sheet";

export default function TicketCard() {
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);

  // Identifiant unique du ticket (à remplacer par les vraies données)
  const ticketId = "TKT-2025-MORGAN-001";

  const handleShowQRCode = () => {
    setIsQRCodeOpen(true);
  };

  return (
    <>
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
                className="barcode-text cursor-pointer hover:text-primary-700 transition-colors"
                onClick={handleShowQRCode}
              >
                Voir le code barre
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
        maxHeight="70vh"
        title="Code QR du billet"
      >
        <div>TEST</div>
      </BottomSheet>
    </>
  );
}
