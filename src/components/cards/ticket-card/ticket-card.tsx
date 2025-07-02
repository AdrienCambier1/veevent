"use client";

import "./ticket-card.scss";
import Image from "next/image";
import img from "@/assets/images/nice.jpg";
import { useState } from "react";
import { Drawer } from "vaul";
import QRCode from "@/components/commons/qr-code/qr-code";
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

      <Drawer.Root open={isQRCodeOpen} onOpenChange={setIsQRCodeOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[20px] h-[80vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
            {/* Header avec handle */}
            <div className="flex-shrink-0 p-4 pb-0">
              <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-300 mb-6" />
              <Drawer.Title className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">
                Code QR du billet
              </Drawer.Title>
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-y-auto px-4">
              <div className="w-full max-w-4xl mx-auto pb-6">
                <div className="flex flex-col gap-4">
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
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </Link>
  );
}
